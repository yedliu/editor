import { PureComponent, CSSProperties } from 'react';
import CWPage from '@/modelClasses/courseDetail/cwpage';
import CWElement from '@/modelClasses/courseDetail/cwElement';
import React from 'react';
import IdHelper from '@/utils/idHelper';
import { from } from 'linq-to-typescript';
import EditItemView from '../../elements/elementItemUI';
import { Viewbox } from '@/components/controls/viewbox';
import DraggingData from '@/modelClasses/courseDetail/toolbox/DraggingData';
import { observer } from 'mobx-react';
import { Popover, Dropdown, Select } from 'antd';
import { observable } from 'mobx';
import { TooltipPlacement } from 'antd/lib/tooltip';
import { ClassType } from '@/class-transformer/ClassTransformer';
import TypeMapHelper from '@/configs/typeMapHelper';
import { ElementTypes } from '@/modelClasses/courseDetail/courseDetailenum';
import CombinedEditItem from '@/modelClasses/courseDetail/editItemViewModels/combinedEditItem';
import { position } from 'html2canvas/dist/types/css/property-descriptors/position';
import SwitchSketelonAction from '@/modelClasses/courseDetail/ShowHideViewModels/SwitchSketelonAction';

type SkElementsSelectorProps = {
  scene?: CWPage; //页面对象
  isSingle?: boolean; //是否只能选择单个元素
  style?: CSSProperties; //样式
  selectorName?: string; //选中元素提示文案的文案前缀
  switchBoneIds?: SwitchSketelonAction[]; //选中的元素对象
  switchBoneIdsChanged?: (switchids: SwitchSketelonAction[]) => void; //修改选中结果的函数
  icon?: (...colors: string[]) => any; //icon样式
  placement?: TooltipPlacement;
  hasItemColor?: string; //选中元素时Icon的颜色
  noItemColor?: string; //未选中元素时Icon的颜色
};

@observer
export default class SkElementsSelector extends PureComponent<
  SkElementsSelectorProps
> {
  constructor(props) {
    super(props);
  }

  @observable
  isDropDownOpend = false;
  @observable
  isShowToolTip = false;
  //展开的元素集合
  @observable
  expandedItemIds: Array<string> = [];
  //查询文字
  @observable
  Keywords: string = '';

  //是否显示组合元素
  isShowCombinedElement(item: CWElement) {
    var result = false;
    (item as CombinedEditItem)?.Children?.map((item: CWElement) => {
      if (!result) {
        if (item.ElementType == ElementTypes.Skeleton) {
          result = true;
        } else if (item.ElementType == ElementTypes.Combined) {
          result = this.isShowCombinedElement(item);
        }
      }
    });
    return result;
  }

  //满足显示条件的元素集合
  public get ItemsPool(): CWElement[] {
    var itemsPool = this.props.scene?.TotalEditItemList;
    var result = [];
    itemsPool?.forEach(item => {
      if (item.ElementType == ElementTypes.Skeleton) {
        result.push(item);
      } else if (item.ElementType == ElementTypes.Combined) {
        if (this.isShowCombinedElement(item)) {
          result.push(item);
        }
      }
    });
    return result;
  }

  //选中的元素
  public get GetSelectedItems(): CWElement[] {
    var itemsPool = this.ItemsPool;
    var idList = this.props.switchBoneIds.map(x => x.Id) || [];
    var result = [];
    idList.forEach(x => {
      var item = itemsPool?.find(y => y.Id == x);
      if (item) result.push(item);
    });
    return result;
  }

  //显示提示信息
  public get GetToolTipStr() {
    var selectedItems = this.GetSelectedItems;
    var names = selectedItems.map(x => x.Name).join(',') || '(空)';
    return this.props.selectorName.concat(':', names);
  }

  //选中和取消选中效果
  selectOrDeleteItem(item: CWElement) {
    var switchBoneIds = this.props.switchBoneIds;
    var idList = switchBoneIds.map(x => x.Id) || [];
    if (idList.includes(item.Id)) {
      switchBoneIds = switchBoneIds?.filter(x => x.Id != item.Id);
      var result = [];
      this.ItemsPool.forEach(x => {
        var item = switchBoneIds?.find(y => y.Id == x.Id);
        if (item) result.push(item);
      });
      this.props.switchBoneIdsChanged?.(result);
    } else {
      if (this.props.isSingle) {
        var element = this.ItemsPool?.find(x => item.Id == x.Id);
        var actionVMsToAdd = new SwitchSketelonAction();
        actionVMsToAdd.Id = element.Id;
        actionVMsToAdd.ChangedSkPlayTimes = 0;
        actionVMsToAdd.Action = element.Res.boneList[0].value;
        this.props.switchBoneIdsChanged?.([actionVMsToAdd]);
      } else {
        var element = this.ItemsPool?.find(x => item.Id == x.Id);
        var actionVMsToAdd = new SwitchSketelonAction();
        actionVMsToAdd.Id = element.Id;
        actionVMsToAdd.ChangedSkPlayTimes = 0;
        actionVMsToAdd.Action = element.Res.boneList[0].value;
        switchBoneIds?.push(actionVMsToAdd);
        var result = [];
        this.ItemsPool.forEach(x => {
          var item = switchBoneIds?.find(y => y.Id == x.Id);
          if (item) result.push(item);
        });
        this.props.switchBoneIdsChanged?.(result);
      }
    }
  }

  //展开的元素集合
  onExpandedItem(item: CWElement) {
    if (this.expandedItemIds.includes(item.Id)) {
      this.expandedItemIds = IdHelper.ToIdList(
        IdHelper.RemoveId(IdHelper.ToIdStr(this.expandedItemIds), item.Id),
      );
    } else {
      this.expandedItemIds.push(item.Id);
    }
  }

  //元素鼠标悬浮效果
  getSelectedItemOverlay(item: CWElement) {
    return <div></div>;
  }

  //修改动作
  changeAction(item: CWElement, action: string) {
    var switchBoneIds = this.props.switchBoneIds;
    var switchBone = switchBoneIds.find(x => x.Id == item.Id);
    if (switchBone) {
      switchBone.Action = action;
      var newswitchBoneIds = switchBoneIds.filter(x => x.Id != item.Id);
      newswitchBoneIds.push(switchBone);
      this.props.switchBoneIdsChanged?.(newswitchBoneIds);
    }
  }

  //修改动作次数
  changeChangedSkPlayTimes(item: CWElement, changedSkPlayTimes: number) {
    var switchBoneIds = this.props.switchBoneIds;
    var switchBone = switchBoneIds.find(x => x.Id == item.Id);
    if (switchBone) {
      switchBone.ChangedSkPlayTimes = changedSkPlayTimes;
      var newswitchBoneIds = switchBoneIds.filter(x => x.Id != item.Id);
      newswitchBoneIds.push(switchBone);
      this.props.switchBoneIdsChanged?.(newswitchBoneIds);
    }
  }

  //获取icon
  public get GetIcon() {
    var hasItemColor = this.props.hasItemColor || '#44449F9F';
    var noItemColor = this.props.noItemColor || '#FFFFFFCF';
    var result = [];
    this.ItemsPool.forEach(x => {
      var item = this.props.switchBoneIds?.find(y => y.Id == x.Id);
      if (item) result.push(item);
    });
    return this.props.icon?.(result.length > 0 ? hasItemColor : noItemColor);
  }

  //动态查询加载元素列表
  public get VisibleItems(): CWElement[] {
    var result = [];
    var keywords = this.Keywords?.split(' ').filter(x => x && x != ' ');
    if (keywords != null && keywords.length > 0) {
      keywords.forEach(w => {
        var items = this.ItemsPool?.filter(item => item.Name.includes(w));
        if (items) result.push(...items);
      });
    } else {
      result.push(...this.ItemsPool);
    }
    return result;
  }

  //是否初始化展开组合元素
  initExpandedItem(item: CWElement, selectIdList: Array<string>) {
    var idList = this.props.switchBoneIds.map(x => x.Id) || [];
    if (item == null) {
      this.ItemsPool?.forEach(item => {
        if (item.ElementType == ElementTypes.Combined) {
          this.initExpandedItem(item, [...selectIdList, item.Id]);
        }
      });
    } else {
      (item as CombinedEditItem)?.Children?.map((item: CWElement) => {
        if (item.ElementType == ElementTypes.Combined) {
          this.initExpandedItem(item, [...selectIdList, item.Id]);
        } else {
          if (idList.indexOf(item.Id) > -1) {
            selectIdList.forEach(x => {
              if (!(this.expandedItemIds.indexOf(x) > -1)) {
                this.expandedItemIds.push(x);
              }
            });
          }
        }
      });
    }
  }

  //组件初始化完成事件
  public componentDidMount() {
    this.initExpandedItem(null, []);
  }

  renderItemPreview(item: CWElement) {
    var selectedItems = this.GetSelectedItems;
    var hasChildren = false;
    if (item instanceof CombinedEditItem) {
      hasChildren = item.Children != null && item.Children.length > 0;
    }
    var expandCheckerVisibilty = hasChildren ? 1 : 0;
    return (
      <div key={item.Id}>
        {this.VisibleItems.includes(item) ? (
          <Dropdown
            key={item.Id}
            trigger={['hover']}
            placement="topCenter"
            overlay={this.getSelectedItemOverlay(item)}
          >
            <div
              style={{
                display: 'flex',
                height: `${90}px`,
                margin: '2px',
              }}
            >
              <div
                className="levelSpace"
                style={{
                  float: 'left',
                  position: 'relative',
                  minWidth: `${item.Level * 12}px`,
                  height: '100%',
                }}
              ></div>
              <div
                className="expandChecker"
                style={{
                  float: 'left',
                  position: 'relative',
                  width: `${13}px`,
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
                  onClick={() => this.onExpandedItem(item)}
                >
                  <path
                    d={`${
                      this.expandedItemIds.includes(item.Id)
                        ? 'M1.5,7.5 L6.5,12.5 L11.5,7.5'
                        : 'M6,5 L11,10 L6,15'
                    }`}
                    stroke="#2222EF"
                    fill="transparent"
                    strokeWidth="1px"
                    strokeLinecap="round"
                    fillRule="evenodd"
                  />
                </svg>
              </div>
              <div
                style={{
                  margin: '2px',
                  position: 'relative',
                  float: 'left',
                  width: '95%',
                  height: '100%',
                  background: `${
                    selectedItems.includes(item) ? '#2222EE89' : '#99999903'
                  }`,
                  cursor: 'pointer',
                }}
                onMouseDown={() =>
                  item.ElementType == ElementTypes.Skeleton
                    ? this.selectOrDeleteItem(item)
                    : null
                }
              >
                <div
                  style={{
                    margin: '2px',
                    position: 'relative',
                    float: 'left',
                    width: `${50}px`,
                    height: `${50}px`,
                    border: '1px solid #8888884F',
                    top: '50%',
                    transform: 'translate(0,-50%)',
                  }}
                >
                  <Viewbox stretch="uniform">
                    <EditItemView isMainView={false} dataContext={item} />
                  </Viewbox>
                </div>
                {item.ElementType == ElementTypes.Skeleton ? (
                  <div
                    style={{
                      position: 'relative',
                      maxWidth: `${150}px`,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      margin: '1px',
                      fontSize: '5px',
                      top: '50%',
                      transform: 'translate(0,-50%)',
                    }}
                  >
                    {item.Name}
                    <br />
                    <Select
                      style={{ width: '100px', margin: '1px' }}
                      value={
                        this.props.switchBoneIds.find(x => x.Id == item.Id)
                          ?.Action || item.Res.boneList[0].value
                      }
                      onChange={val => {
                        this.changeAction(item, String(val));
                      }}
                      onMouseDown={e => {
                        e.stopPropagation();
                      }}
                    >
                      {item.Res.boneList.map((bone, i) => {
                        return (
                          <Select.Option key={i} value={bone.value}>
                            {bone.name}
                          </Select.Option>
                        );
                      })}
                    </Select>
                    <br />
                    <Select
                      style={{ width: '100px', margin: '1px' }}
                      value={
                        this.props.switchBoneIds.find(x => x.Id == item.Id)
                          ?.ChangedSkPlayTimes || 0
                      }
                      onChange={val => {
                        this.changeChangedSkPlayTimes(item, Number(val));
                      }}
                      onMouseDown={e => {
                        e.stopPropagation();
                      }}
                    >
                      {(() => {
                        var result = [];
                        result.push(
                          <Select.Option key={0} value={0}>
                            {'Forever'}
                          </Select.Option>,
                        );
                        for (var i = 1; i < 30; i++) {
                          result.push(
                            <Select.Option key={i} value={i}>
                              {i}
                            </Select.Option>,
                          );
                        }
                        return result;
                      })()}
                    </Select>
                  </div>
                ) : (
                  <div
                    style={{
                      position: 'relative',
                      maxWidth: `${150}px`,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      margin: '1px',
                      fontSize: '5px',
                      top: '50%',
                      transform: 'translate(0,-50%)',
                    }}
                  >
                    {item.Name}
                  </div>
                )}
              </div>
            </div>
          </Dropdown>
        ) : null}

        {hasChildren && this.expandedItemIds.includes(item.Id) ? (
          <div
            className="childrenPanel"
            style={{
              position: 'relative',
              width: '100%',
            }}
          >
            {(item as CombinedEditItem)?.Children?.map(
              (item: CWElement, i: number) => {
                return (
                  <div
                    key={item.Id}
                    style={{ position: 'relative', width: '100%' }}
                  >
                    {this.renderItemPreview(item)}
                  </div>
                );
              },
            )}
          </div>
        ) : null}
      </div>
    );
  }

  renderSelectArea() {
    return (
      <div
        style={{
          display: '-webkitbox',
          WebkitBoxOrient: 'vertical',
          WebkitBoxAlign: 'start',
          width: '250px',
        }}
        onWheel={e => e.stopPropagation()}
      >
        <div
          style={{
            height: '1px',
            width: '100%',
            background: '#8989899F',
            marginTop: '3px',
          }}
        />

        <div
          style={{
            width: '100%',
            border: '1px solid #8989899F',
            marginTop: '3px',
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            WebkitBoxAlign: 'stretch',
          }}
        >
          <div
            style={{
              width: '100%',
              height: '25px',
            }}
          >
            <select>
              <option value="0" key="0">
                关键词
              </option>
            </select>
            <input
              style={{ width: '180px', height: '23px' }}
              placeholder="请输入要搜索的关键词"
              value={String(this.Keywords || '')}
              onChange={e => (this.Keywords = String(e.target.value || ''))}
            ></input>
          </div>
          <div
            style={{
              width: '100%',
              height: '650px',
              overflowY: 'auto',
            }}
          >
            {this.props.scene.Elements?.map((item, i) => {
              return this.renderItemPreview(item);
            })}
          </div>
        </div>
      </div>
    );
  }

  render() {
    if (this.props.scene == null) return null;
    return (
      <Popover
        content={
          <div
            style={{
              maxWidth: '500px',
              WebkitLineClamp: 3,
              wordBreak: 'break-all',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
            }}
          >
            {this.GetToolTipStr}
          </div>
        }
        visible={this.isShowToolTip}
        onVisibleChange={e => {
          this.isShowToolTip = !this.isDropDownOpend && e;
        }}
      >
        <Popover
          trigger={['click']}
          content={this.renderSelectArea()}
          placement={this.props.placement || 'top'}
          arrowPointAtCenter
          onVisibleChange={e => {
            this.isDropDownOpend = e;
            this.isShowToolTip = false;
          }}
        >
          <div style={{ ...this.props.style }}>
            {this.GetIcon ? this.GetIcon : this.props.children}
          </div>
        </Popover>
      </Popover>
    );
  }
}
