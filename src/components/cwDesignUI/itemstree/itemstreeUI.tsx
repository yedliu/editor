import React, { CSSProperties } from 'react';
import { Button, Dropdown, message } from 'antd';
import CWPage from '@/modelClasses/courseDetail/cwpage';
import { observer, inject } from 'mobx-react';
import { Viewbox } from '@/components/controls/viewbox';
import CWSubstance from '@/modelClasses/courseDetail/cwSubstance';
import UIHelper from '@/utils/uiHelper';
import CWElement from '@/modelClasses/courseDetail/cwElement';
import CombinedEditItem from '@/modelClasses/courseDetail/editItemViewModels/combinedEditItem';
import EditItemView from '../elements/elementItemUI';
import { number } from 'prop-types';
import ItemDragUI from './itemDragUI';
import { from } from 'linq-to-typescript';
import RUHelper from '@/redoundo/redoUndoHelper';
import ElementContextMenu from './itemContextMenu';
import CWResource from '@/modelClasses/courseDetail/cwResource';
import { deserialize } from '@/class-transformer';
import {
  ItemNormalIcon,
  ItemHiddenIcon,
  ItemLockedIcon,
  ItemSolidifiedIcon,
  ItemNotSolidifiedIcon,
  ItemStoryHiddenIcon,
} from '@/svgs/designIcons';
import {
  AppearTypes,
  ElementTypes,
} from '@/modelClasses/courseDetail/courseDetailenum';
import DraggingData from '@/modelClasses/courseDetail/toolbox/DraggingData';
import KeyHelper from '@/utils/keyHelper';
import ArrayHelper from '@/utils/arrayHelper';

const expandCheckerWidth = 13;
const levelSpaceWidth = 12;
const thumbSize = 46;
const itemHeight = 50;
const itemNameWidth = 90;
const itemStateIconSize = 12;

@inject('courseware', 'commander')
@observer
class ItemsTreeView extends React.Component<any> {
  private mouseDownItem: CWElement;
  private isMouseDownDoSingleSelect: boolean = false;
  private didMouseMoved: boolean = false;

  //#region 选中，多选

  itemMouseDown(e: React.MouseEvent<HTMLDivElement>, item: CWElement) {
    this.mouseDownItem = item;
    this.isMouseDownDoSingleSelect = false;
    this.didMouseMoved = false;
    var _isSelected = item.IsSelected;
    if (KeyHelper.checkCtrlOrMeta(e)) {
      item.IsSelected = !_isSelected;
    } else if (item.Scene != null) {
      if (e.shiftKey) {
        var scene = item.Scene;
        var totalItems = scene.TotalEditItemList;
        var startItem = scene.SelectedItems[0];
        var startIndex = totalItems.indexOf(startItem);
        var endIndex = totalItems.indexOf(item);

        scene.DeselectAll();
        if (startIndex >= 0 && endIndex >= 0) {
          for (
            let i: number = startIndex;
            i >= Math.min(startIndex, endIndex) &&
            i <= Math.max(startIndex, endIndex);
            i += endIndex > startIndex ? 1 : -1
          ) {
            if (totalItems[i].Father == null || totalItems[i].Father.IsExpanded)
              totalItems[i].IsSelected = true;
          }
        }
      } else {
        if (!item.IsSelected) {
          item.Scene.SelectedItem = item;
          this.isMouseDownDoSingleSelect = true;
        }
      }
    }
  }

  itemMouseMove(e: React.MouseEvent<HTMLDivElement>, item: CWElement) {
    if (this.mouseDownItem) {
      this.didMouseMoved = true;
    }
  }

  itemMouseUp(e: React.MouseEvent<HTMLDivElement>, item: CWElement) {
    if (
      !this.didMouseMoved &&
      !this.isMouseDownDoSingleSelect &&
      item == this.mouseDownItem &&
      item.IsSelected &&
      !e.shiftKey &&
      !KeyHelper.checkCtrlOrMeta(e) &&
      item.Scene != null &&
      e.button == 0
    ) {
      item.Scene.SelectedItem = item;
    }
    this.mouseDownItem = null;
    this.didMouseMoved = false;
  }

  //#endregion

  //#region 拖动
  dragItemStart(e: React.DragEvent<HTMLDivElement>): void {
    const { courseware } = this.props;
    var selectedPage: CWPage = courseware.SelectedPage;
    var selectedItems = selectedPage.SelectedItems;
    // from(selectedPage.TotalEditItemList)
    // .intersect(from(selectedPage.SelectedItems))
    // .toArray();
    var dataTransfer = e.dataTransfer;
    DraggingData.setData('dragitems', selectedItems);
    var target = e.currentTarget;

    var dragingUI = <ItemDragUI dragingItems={selectedItems}></ItemDragUI>;

    var dragImg = UIHelper.getDragImage(dragingUI);

    dataTransfer.setDragImage(dragImg, 10, 10);
  }
  dragItemEnd(e: React.DragEvent<HTMLDivElement>): void {
    UIHelper.clearDragImage();
    DraggingData.delData('dragitems');
    this.showItemInserting(this.insertingItemElement, null);
    e.preventDefault();
  }

  getInsertPos(clientY: number, target: HTMLElement, item: CWElement): string {
    if (target) {
      var targetRect = target.getBoundingClientRect();
      var centerY = targetRect.y + targetRect.height / 2;
      if (item == null) return 'bottom';
      if (item instanceof CombinedEditItem && !item.IsExpanded) {
        if (clientY < targetRect.y + targetRect.height / 4) {
          return 'top';
        } else if (clientY > targetRect.y + (3 * targetRect.height) / 4) {
          return 'bottom';
        } else return 'into';
      } else {
        if (clientY < centerY) {
          return 'top';
        } else {
          return 'bottom';
        }
      }
    }
    return '';
  }

  showItemInserting(el: HTMLElement, pos?: string) {
    if (!el) return;
    var topInsertBar: HTMLDivElement,
      bottomInsertBar: HTMLDivElement,
      intoInsertArea: HTMLDivElement;
    var node_rootDiv = UIHelper.FindAncestorByClassName(
      el,
      'itemThumb',
    ) as HTMLDivElement;
    if (!node_rootDiv) return;
    topInsertBar = node_rootDiv.children[0] as HTMLDivElement;
    bottomInsertBar = node_rootDiv.children[1] as HTMLDivElement;
    intoInsertArea = node_rootDiv.children[2] as HTMLDivElement;
    if (!intoInsertArea.classList.contains('innerInsert'))
      intoInsertArea = null;
    switch (pos) {
      case 'top':
        topInsertBar.style.display = 'inline';
        bottomInsertBar.style.display = 'none';
        if (intoInsertArea != null) intoInsertArea.style.display = 'none';
        break;
      case 'bottom':
        topInsertBar.style.display = 'none';
        bottomInsertBar.style.display = 'inline';
        if (intoInsertArea != null) intoInsertArea.style.display = 'none';
        break;
      case 'into':
        topInsertBar.style.display = 'none';
        bottomInsertBar.style.display = 'none';
        if (intoInsertArea != null) intoInsertArea.style.display = 'inline';
        break;
      default:
        topInsertBar.style.display = 'none';
        bottomInsertBar.style.display = 'none';
        if (intoInsertArea != null) intoInsertArea.style.display = 'none';
        break;
    }
  }

  findFirstChildElement(el: HTMLElement): HTMLElement {
    var node_rootDiv = UIHelper.FindAncestorByClassName(
      el,
      'itemThumb',
    ) as HTMLDivElement;
    if (!node_rootDiv) return null;
    var childrenPanel = node_rootDiv.getElementsByClassName('childrenPanel');
    return childrenPanel?.[0]?.getElementsByClassName(
      'itemInfoDiv',
    )?.[0] as HTMLElement;
  }

  findLastVisibleElement(rootPanelDiv: HTMLElement): HTMLElement {
    if (!rootPanelDiv) return null;
    var nodes = rootPanelDiv.getElementsByClassName('itemInfoDiv');
    if (nodes != null && nodes.length > 0)
      return nodes[nodes.length - 1] as HTMLElement;
    return null;
  }

  getRealInsertingTarget(
    clientY: number,
    target: HTMLElement,
    item: CWElement,
    originSource: HTMLElement,
  ): any[] {
    var insertpos: string = '';
    insertpos = this.getInsertPos(clientY, target, item);
    var realInsertingTarget = target;
    var realTargetItem = item;
    if (
      item instanceof CombinedEditItem &&
      item.IsExpanded &&
      insertpos == 'bottom'
    ) {
      realInsertingTarget = this.findFirstChildElement(target);
      insertpos = 'top';
      realTargetItem = item.Children?.[0] ? item.Children[0] : null;
    } else if (
      item == null &&
      originSource == target &&
      target.classList.contains('itemsBg')
    ) {
      realInsertingTarget = this.findLastVisibleElement(originSource);
      insertpos = 'bottom';

      const { courseware } = this.props;
      var selectedPage: CWPage = courseware.SelectedPage;

      realTargetItem = ArrayHelper.lastOrDefault(
        selectedPage.TotalEditItemList,
        x => !x.HasAncestorNotExpanded,
      );
    }
    return [realInsertingTarget, insertpos, realTargetItem];
  }

  insertingItemElement: HTMLElement = null;

  itemDragOver(e: React.DragEvent<HTMLDivElement>, item: CWElement): void {
    var target = e.currentTarget as HTMLElement;
    var originSource = e.target as HTMLElement;
    if (originSource != target && target.classList.contains('itemsBg'))
      //背景事件但不是直接拖在背景上
      return;

    if (target && DraggingData.getData('dragitems')) {
      var tmp = this.getRealInsertingTarget(
        e.clientY,
        target,
        item,
        originSource,
      );
      var realInsertingTarget = tmp[0] as HTMLElement;
      var insertpos = tmp[1] as string;
      if (this.insertingItemElement != realInsertingTarget) {
        this.showItemInserting(this.insertingItemElement, null);
        this.insertingItemElement = realInsertingTarget;
      }
      this.showItemInserting(this.insertingItemElement, insertpos);
      e.dataTransfer.dropEffect = 'move';
      e.preventDefault();
    } else if (e.dataTransfer.types.includes('res') && item != null) {
      e.dataTransfer.dropEffect = 'link';
      e.preventDefault();
    }
  }
  itemDragLeave(e: React.DragEvent<HTMLDivElement>, item: CWElement) {
    var target = e.currentTarget as HTMLElement;
    var originSource = e.target as HTMLElement;
    if (
      item == null &&
      originSource == target &&
      target.classList.contains('itemsBg')
    ) {
      var realInsertingTarget = this.findLastVisibleElement(originSource);
      this.showItemInserting(realInsertingTarget, null);
    } else this.showItemInserting(target, null);
  }

  dropOnItem(e: React.DragEvent<HTMLDivElement>, item: CWElement): void {
    UIHelper.clearDragImage();
    this.showItemInserting(this.insertingItemElement, null);
    var target = e.currentTarget as HTMLElement;
    var originSource = e.target as HTMLElement;
    if (originSource != target && target.classList.contains('itemsBg'))
      //背景事件但不是直接拖在背景上
      return;

    const { courseware } = this.props;
    var selectedPage: CWPage = courseware.SelectedPage;

    var dragitems: CWElement[] = DraggingData.getData('dragitems') || [];

    dragitems = ArrayHelper.intersect(
      selectedPage.TotalEditItemList,
      dragitems,
    );
    var itemsToMove = [...dragitems];
    var res = e.dataTransfer.getData('res');
    if (target && itemsToMove != null && itemsToMove.length > 0) {
      var tmp = this.getRealInsertingTarget(
        e.clientY,
        target,
        item,
        originSource,
      );
      var realInsertingTarget = tmp[0] as HTMLElement;
      var insertpos = tmp[1] as string;
      var realTargetItem = tmp[2] as CWElement;

      //var allItems = from(selectedPage.TotalEditItemList);
      // var itemsToMove = itemIds
      //   .map(id => allItems.firstOrDefault(x => x.Id == id))
      //   .filter(x => x != null);

      //如果目标的祖先也在拖动之列，则不要拖动其祖先
      var ancestorsToMove = itemsToMove.filter(x =>
        x.IsAncestorOf(realTargetItem),
      );
      for (var ancestor of ancestorsToMove)
        itemsToMove.splice(itemsToMove.indexOf(ancestor), 1);
      //如果所有移动的有同一个父亲并编号连续，并且目标也在移动的元素之列则 不做任何事
      var cancel = false;
      if (itemsToMove.includes(realTargetItem)) {
        cancel = true;
        var fatherlist = itemsToMove[0].FatherList;
        var itemsIndex: number[] = [];
        for (
          var i = 0;
          i < itemsToMove.length;
          i++ //是否都在一个父列表中
        ) {
          var movingitem = itemsToMove[i];
          itemsIndex[i] = fatherlist.indexOf(movingitem);
          if (fatherlist != movingitem.FatherList) {
            cancel = false;
            break;
          }
        }
        if (cancel) {
          var index_series = true;
          for (
            var i = 1;
            i < itemsIndex.length;
            i++ //序号是否连续
          ) {
            if (itemsIndex[i] != itemsIndex[i - 1] + 1) {
              index_series = false;
              break;
            }
          }
          if (!index_series) cancel = false;
        }
      }
      if (!cancel) {
        //不取消移动操作
        var targetFatherList = realTargetItem.FatherList;
        if (insertpos == 'into' && realTargetItem instanceof CombinedEditItem)
          targetFatherList = realTargetItem.Children;
        if (itemsToMove.includes(realTargetItem)) {
          if (insertpos == 'into') {
            if (itemsToMove.includes(realTargetItem))
              itemsToMove.splice(itemsToMove.indexOf(realTargetItem), 1);
          } else {
            var searchIndex = fatherlist.indexOf(realTargetItem);
            searchIndex--;
            while (searchIndex >= 0) {
              if (!itemsToMove.includes(targetFatherList[searchIndex])) {
                realTargetItem = targetFatherList[searchIndex];
                insertpos = 'bottom';
                break;
              } else searchIndex--;
            }
            if (searchIndex < 0) {
              realTargetItem = targetFatherList[0];
              insertpos = 'top';
            }
          }
        }

        RUHelper.Core.CreateTransaction();
        var oldFathers = ArrayHelper.distinct(
          itemsToMove.map(x => x.Father).filter(x => x != null),
        );
        var oldAbsolutePos = itemsToMove.map(x => x.AbsolutePosition);
        var oldAbsoluteAngle = itemsToMove.map(x => x.AbsoluteAngle);
        var oldAbsoluteFlipX = itemsToMove.map(x => x.AbsoluteFlipX);
        var oldAbsoluteFlipY = itemsToMove.map(x => x.AbsoluteFlipY);

        for (var movingitem of itemsToMove) {
          RUHelper.RemoveItem(movingitem.FatherList, movingitem);
          // if (movingitem.Father != null)
          //   RUHelper.SetProperty(movingitem, 'Father', null, movingitem.Father);
        }
        var insertIndex = 0;
        var targetItemIndex =
          realTargetItem.FatherList == null
            ? 0
            : realTargetItem.FatherList.indexOf(realTargetItem);
        if (insertpos == 'top') insertIndex = targetItemIndex;
        else if (insertpos == 'bottom') insertIndex = targetItemIndex + 1;
        else if (insertpos == 'into') insertIndex = targetFatherList.length;

        for (var i = 0; i < itemsToMove.length; i++) {
          RUHelper.AddItem(targetFatherList, itemsToMove[i], insertIndex + i);
          if (targetFatherList?.[0]?.Father != null)
            targetFatherList[0].Father.IsOprating = true;
          itemsToMove[i].AbsolutePosition = oldAbsolutePos[i];
          itemsToMove[i].AbsoluteAngle = oldAbsoluteAngle[i];
          itemsToMove[i].AbsoluteFlipX = oldAbsoluteFlipX[i];
          itemsToMove[i].AbsoluteFlipY = oldAbsoluteFlipY[i];
          if (targetFatherList?.[0]?.Father != null)
            targetFatherList[0].Father.IsOprating = false;
        }

        this.props.commander.ClearEmptyCombinedEditItems();
        oldFathers.forEach(x => {
          if (x.Children != targetFatherList && x.Scene != null)
            x.ResetBoundary();
        });
        targetFatherList?.[0]?.Father?.ResetBoundary();

        RUHelper.Core.CommitTransaction(
          () =>
            itemsToMove?.forEach(x => {
              x.IsSelected = true;
              x.HasSelectionChangedBeforeRecord = true;
            }),
          () => realTargetItem.Scene?.RefreshSelectedItems(),
          // () => CoursewareViewModel?.View?.Focus(),
          //() => this.props.commander.SelectedPage?.LogicDesign?.ImportDataFromScene()
        );
      }
    } else if (res != null && res != '' && item != null) {
      var resource: CWResource = deserialize(CWResource, res);
      if (resource != null) {
        item.AttachResource(resource);
      }
    }
    DraggingData.delData('dragitems');
  }

  //#endregion

  renderItemPreview(item: CWElement, i: number) {
    const { courseware: _courseware } = this.props;
    var courseware = _courseware as CWSubstance;
    var selectedPage: CWPage = courseware.SelectedPage;

    var canHasChildren = false;
    var hasChildren = false;
    if (item instanceof CombinedEditItem) {
      canHasChildren = true;
      hasChildren = item.Children != null && item.Children.length > 0;
    }
    var expandCheckerVisibilty = hasChildren ? 1 : 0;

    var isWordsWhite =
      item.IsSelected || (item.HasDescendantsSelected && !item.IsExpanded);
    var wordColor = isWordsWhite ? 'white' : '#7A7A7A';
    return (
      <div className="itemThumb">
        <div
          className="topInsert"
          style={{
            position: 'absolute',
            zIndex: 5,
            display: 'none',
            pointerEvents: 'none',
            left: `${item.Level * levelSpaceWidth + expandCheckerWidth + 3}px`,
            right: '3px',
            height: '4px',
            top: '-2px',
            border: '1px dashed #C3833F',
          }}
        />
        <div
          className="bottomInsert"
          style={{
            position: 'absolute',
            zIndex: 5,
            display: 'none',
            pointerEvents: 'none',
            left: `${item.Level * levelSpaceWidth + expandCheckerWidth + 3}px`,
            right: '3px',
            height: '4px',
            bottom: '-2px',
            border: '1px dashed #C3833F',
          }}
        />
        {canHasChildren && !item.IsExpanded ? (
          <div
            className="innerInsert"
            style={{
              zIndex: 5,
              position: 'absolute',
              display: 'none',
              pointerEvents: 'none',
              left: `${item.Level * levelSpaceWidth + expandCheckerWidth}px`,
              right: '0px',
              height: '100%',
              bottom: '0px',
              background: '#A3A3CF2F',
              border: '1.5px dashed #A3A3CF',
            }}
          />
        ) : null}
        <div
          style={{
            display: 'flex',
            height: `${itemHeight}px`,
            background: `${
              item.IsSelected
                ? '#2222EE89'
                : item.HasDescendantsSelected && !item.IsExpanded
                ? '#2222EE59'
                : '#99999903'
            }`,
            whiteSpace: 'nowrap',
          }}
        >
          <div
            className="levelSpace"
            style={{
              float: 'left',
              position: 'relative',
              minWidth: `${item.Level * levelSpaceWidth}px`,
              height: '100%',
            }}
          ></div>
          <div
            className="expandChecker"
            style={{
              float: 'left',
              position: 'relative',
              width: `${expandCheckerWidth}px`,
              height: '100%',
              background: 'transparent',
              opacity: expandCheckerVisibilty,
            }}
          >
            <svg
              style={{
                cursor: 'hand',
                position: 'relative',
                top: '50%',
                transform: 'translateY(-50%)',
              }}
              width="13"
              height="20"
              xmlns="http://www.w3.org/2000/svg"
              onClick={() => (item.IsExpanded = !item.IsExpanded)}
            >
              <path
                d={
                  item.IsExpanded
                    ? 'M1.5,7.5 L6.5,12.5 L11.5,7.5'
                    : 'M6,5 L11,10 L6,15'
                }
                stroke={isWordsWhite ? 'white' : '#2222EF'}
                fill="transparent"
                strokeWidth="1px"
                strokeLinecap="round"
                fillRule="evenodd"
              />
            </svg>
          </div>
          <Dropdown
            overlay={ElementContextMenu({
              courseware: item?.Scene?.Courseware,
              targetElement: item,
            })}
            trigger={['contextMenu']}
          >
            <div
              className="itemInfoDiv"
              style={{
                float: 'left',
                display: 'flex',
                position: 'relative',
                height: `${itemHeight}px`,
              }}
              draggable={true}
              onMouseDown={e => this.itemMouseDown(e, item)}
              onMouseMove={e => this.itemMouseMove(e, item)}
              onMouseUp={e => this.itemMouseUp(e, item)}
              onDragStart={e => this.dragItemStart(e)}
              onDragEnd={e => this.dragItemEnd(e)}
              onDragLeave={e => this.itemDragLeave(e, item)}
              onDragOver={e => this.itemDragOver(e, item)}
              onDrop={e => this.dropOnItem(e, item)}
            >
              <div
                className="itemThumbBorder"
                style={{
                  float: 'left',
                  position: 'relative',
                  width: `${thumbSize}px`,
                  height: `${thumbSize}px`,
                  margin: `${(itemHeight - thumbSize) / 2}px`,
                  background: '#9999992F',
                  overflow: 'hidden',
                }}
              >
                <Viewbox stretch="uniform">
                  <EditItemView
                    key={item.Id}
                    dataContext={item}
                    courseware={this.props.courseware}
                    isMainView={false}
                  />
                </Viewbox>
                {item.ElementType == ElementTypes.Skeleton ? (
                  <div
                    style={{
                      marginTop: '25px',
                      position: 'relative',
                      float: 'left',
                      width: '15px',
                      height: '15px',
                    }}
                  >
                    <img
                      src={require('@/assets/rotate_arrow.png')}
                      style={{
                        width: '80%',
                        height: '80%',
                        objectFit: 'contain',
                      }}
                    ></img>
                  </div>
                ) : null}
              </div>
              <div
                className="itemNameBorder"
                style={{
                  position: 'relative',
                  float: 'left',
                  height: `${itemHeight}px`,
                  width: `${itemNameWidth}px`,
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    maxWidth: `${itemNameWidth}px`,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    top: '50%',
                    transform: 'translate(0,-50%)',
                    color: `${wordColor}`,
                  }}
                >
                  {item.Name}
                </div>
              </div>
              <div
                className="lockHideIcon"
                style={{
                  marginLeft: '3px',
                  position: 'relative',
                  float: 'left',
                  width: `${itemStateIconSize}px`,
                  height: `${itemStateIconSize}px`,
                  cursor: 'pointer',
                  top: '50%',
                  transform: 'translate(0,-50%)',
                  lineHeight: `${itemStateIconSize}px`,
                }}
                onMouseDown={e => e.stopPropagation()}
                onClick={e => {
                  RUHelper.Core.CreateTransaction();
                  if (item.IsDesignHide) {
                    item.IsDesignHide = false;
                    item.IsLocked = false;
                  } else if (item.IsLocked) {
                    item.IsDesignHide = true;
                    item.IsLocked = false;
                  } else {
                    item.IsDesignHide = false;
                    item.IsLocked = true;
                  }
                  RUHelper.Core.CommitTransaction();
                }}
              >
                {item.IsDesignHide
                  ? ItemHiddenIcon(wordColor)
                  : item.IsLocked
                  ? ItemLockedIcon(wordColor)
                  : ItemNormalIcon(wordColor)}
              </div>

              {courseware?.Profile?.purposeVo?.['code'] == 'TEMPLATE' ? (
                <div
                  className="templateLockManageIcon"
                  style={{
                    marginLeft: '3px',
                    position: 'relative',
                    float: 'left',
                    width: `${itemStateIconSize * 1.2}px`,
                    height: `${itemStateIconSize * 1.2}px`,
                    cursor: 'pointer',
                    top: '50%',
                    transform: 'translate(0,-50%)',
                    borderRadius: '3px',
                    background: 'rgb(185,185,185)',
                    color: 'white',
                    textAlign: 'center',
                    fontSize: '4px',
                    lineHeight: `${itemStateIconSize * 1.2}px`,
                  }}
                  onMouseDown={e => e.stopPropagation()}
                  onClick={e => {
                    item.IsPageTemplateLocked = !item.IsPageTemplateLocked;
                  }}
                >
                  {item.IsPageTemplateLocked ? '模' : '自'}
                </div>
              ) : item.IsPageTemplateLockEnabled ? (
                <div
                  className="templateLockedIcon"
                  style={{
                    marginLeft: '3px',
                    position: 'relative',
                    float: 'left',
                    width: `${itemStateIconSize * 1.2}px`,
                    height: `${itemStateIconSize * 1.2}px`,
                    top: '50%',
                    transform: 'translate(0,-50%)',
                    borderRadius: '3px',
                    background: 'rgb(185,185,185)',
                    color: 'white',
                    textAlign: 'center',
                    fontSize: '4px',
                    lineHeight: `${itemStateIconSize * 1.2}px`,
                  }}
                >
                  {'模'}
                </div>
              ) : null}

              {item instanceof CombinedEditItem ? (
                <div
                  className="soildifyIcon"
                  style={{
                    marginLeft: '2px',
                    position: 'relative',
                    float: 'left',
                    width: `${itemStateIconSize}px`,
                    height: `${itemStateIconSize}px`,
                    cursor: 'pointer',
                    top: '50%',
                    transform: 'translate(0,-50%)',
                    lineHeight: `${itemStateIconSize}px`,
                  }}
                  onMouseDown={e => e.stopPropagation()}
                  onClick={e => {
                    item.IsSolidified = !item.IsSolidified;
                  }}
                >
                  {item.IsSolidified
                    ? ItemSolidifiedIcon(wordColor)
                    : ItemNotSolidifiedIcon(wordColor)}
                </div>
              ) : null}
              <div
                className="storyAppearIndexIcon"
                style={{
                  marginLeft: '4px',
                  position: 'relative',
                  float: 'left',
                  width: `${itemStateIconSize * 1.2}px`,
                  height: `${itemStateIconSize * 1.2}px`,
                  top: '50%',
                  transform: 'translate(0,-50%)',
                  borderRadius: '3px',
                  background: 'rgb(185,185,185)',
                  color: 'white',
                  textAlign: 'center',
                  fontSize: '6px',
                  lineHeight: `${itemStateIconSize * 1.2}px`,
                }}
              >
                {item.AppearType == AppearTypes.Auto
                  ? item.AppearIndex
                  : ItemStoryHiddenIcon('white')}
              </div>
            </div>
          </Dropdown>
        </div>
        {hasChildren && item.IsExpanded ? (
          <div
            className="childrenPanel"
            style={{
              position: 'relative',
              width: '100%',
              // display: `${hasChildren && item.IsExpanded ? '' : 'none'}`,
            }}
          >
            {(item as CombinedEditItem)?.Children?.map(
              (item: CWElement, i: number) => {
                return (
                  <div
                    key={item.Id}
                    style={{ position: 'relative', width: '100%' }}
                  >
                    {this.renderItemPreview(item, i)}
                  </div>
                );
              },
            )}
          </div>
        ) : null}
      </div>
    );
  }

  render() {
    const { courseware } = this.props;
    var selectedPage: CWPage = courseware.SelectedPage;
    var rootElements = selectedPage?.Elements;
    return (
      <div
        className="scrollableView"
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          overflowX: 'auto',
          overflowY: 'auto',
        }}
      >
        <div
          className="itemsBg"
          style={{
            background: 'transparent',
            minHeight: '100%',
          }}
          onDragOver={e => this.itemDragOver(e, null)}
          onDrop={e => this.dropOnItem(e, null)}
          onDragLeave={e => this.itemDragLeave(e, null)}
        >
          {rootElements?.map((item: CWElement, i) => {
            return (
              <div
                key={item.Id || i}
                style={{ position: 'relative', width: '100%' }}
              >
                {this.renderItemPreview(item, i)}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default ItemsTreeView;
