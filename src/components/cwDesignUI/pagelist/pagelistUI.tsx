import React from 'react';
import { Button, Popover, Tooltip } from 'antd';
import CWPage from '@/modelClasses/courseDetail/cwpage';
import { observer, inject } from 'mobx-react';
import { Viewbox } from '@/components/controls/viewbox';
import StageCanvas from '../stage/stageCanvasUI';
import CWSubstance from '@/modelClasses/courseDetail/cwSubstance';
import UIHelper from '@/utils/uiHelper';
import { Courseware } from '@/modelClasses/courseware';
import { action, observable } from 'mobx';
import RUHelper from '@/redoundo/redoUndoHelper';
import CourseCommander from '@/modelClasses/courseDetail/courseCommander';
import { Dropdown } from 'antd';
import PageContextMenu from './pageContextMenu';
import { plainToClass, deserialize } from '@/class-transformer';
import CWResource from '@/modelClasses/courseDetail/cwResource';
import { CWResourceTypes } from '@/modelClasses/courseDetail/courseDetailenum';
import { PageVideoIcon, PageAudioIcon } from '@/svgs/designIcons';
import KeyHelper from '@/utils/keyHelper';

@inject('courseware', 'commander')
@observer
class PageList extends React.Component<any> {
  constructor(props) {
    super(props);
  }
  //#region   页面拖动排序

  pageStartDrag = (e: React.DragEvent<HTMLDivElement>, page: CWPage) => {
    var dataTransfer = e.dataTransfer;
    dataTransfer.setData('page', page.Id);
    const { clientX, clientY } = e;
    var target = e.currentTarget;
    var dragElement = target.getElementsByClassName(
      'pagePreview',
    )[0] as HTMLElement;
    var dragImg = UIHelper.getDragImage(dragElement);
    var rect = dragElement.getBoundingClientRect();
    var offsetx = clientX - rect.x;
    var offsety = clientY - rect.y;
    dataTransfer.setDragImage(dragImg, offsetx, offsety);
  };

  pageDragEnd(e: React.DragEvent<HTMLDivElement>, page: CWPage): void {
    e.preventDefault();
    this.showPageInserting(this.insertingPageElement, null);
    UIHelper.clearDragImage();
  }

  insertingPageElement: HTMLElement = null;

  getInsertPos(e: React.DragEvent<HTMLDivElement>): string {
    var target = e.currentTarget as HTMLElement;
    if (target) {
      const { clientY } = e;
      var targetRect = target.getBoundingClientRect();
      var centerY = targetRect.y + targetRect.height / 2;
      if (clientY < centerY) {
        return 'top';
      } else {
        return 'bottom';
      }
    }
    return '';
  }

  pageDragOver = (e: React.DragEvent<HTMLDivElement>, page: CWPage) => {
    var target = e.currentTarget as HTMLElement;
    if (target && e.dataTransfer.types.includes('page')) {
      var insertpos = this.getInsertPos(e);

      if (this.insertingPageElement != target) {
        this.showPageInserting(this.insertingPageElement, null);
        this.insertingPageElement = target;
      }
      this.showPageInserting(this.insertingPageElement, insertpos);
      e.dataTransfer.dropEffect = 'move';
      e.preventDefault();
    } else if (e.dataTransfer.types.includes('res')) {
      e.dataTransfer.effectAllowed = 'link';
      e.preventDefault();
    } else {
      e.dataTransfer.effectAllowed = 'none';
    }
  };
  dropOnPage = (e: React.DragEvent<HTMLDivElement>, page: CWPage) => {
    e.preventDefault();
    const { courseware } = this.props;
    var _courseware = courseware as CWSubstance;
    var pageId = e.dataTransfer.getData('page');
    var res = e.dataTransfer.getData('res');
    if (pageId != null && pageId != '') {
      var dragingPage = _courseware.Pages.find(p => p.Id == pageId);
      if (dragingPage && page) {
        var insertpos = this.getInsertPos(e);
        var fromIndex = _courseware.Pages.indexOf(dragingPage);
        var targetIndex = _courseware.Pages.indexOf(page);
        if (fromIndex != targetIndex) {
          RUHelper.Core.CreateTransaction();
          if (insertpos == 'top') {
            if (fromIndex < targetIndex - 1) {
              RUHelper.RemoveItem(_courseware.Pages, dragingPage);
              RUHelper.AddItem(_courseware.Pages, dragingPage, targetIndex - 1);
            } else if (fromIndex > targetIndex) {
              RUHelper.RemoveItem(_courseware.Pages, dragingPage);
              RUHelper.AddItem(_courseware.Pages, dragingPage, targetIndex);
            }
          } else if (insertpos == 'bottom') {
            if (fromIndex < targetIndex) {
              RUHelper.RemoveItem(_courseware.Pages, dragingPage);
              RUHelper.AddItem(_courseware.Pages, dragingPage, targetIndex);
            } else if (fromIndex > targetIndex + 1) {
              RUHelper.RemoveItem(_courseware.Pages, dragingPage);
              RUHelper.AddItem(_courseware.Pages, dragingPage, targetIndex + 1);
            }
          }
          RUHelper.Core.CommitTransaction();
        }
      }
    } else if (res != null) {
      var resource: CWResource = deserialize(CWResource, res);
      if (resource) {
        if (resource.resourceType == CWResourceTypes.Image) {
          page.BgImgRes = resource;
        } else if (resource.resourceType == CWResourceTypes.Video) {
          page.FullScreenVideo = resource;
        } else if (resource.resourceType == CWResourceTypes.Audio) {
          page.BgAudio = resource;
        }
      }
    }
  };

  showPageInserting(el: HTMLElement, pos?: string) {
    if (!el) return;
    var topInsertBar: HTMLDivElement, bottomInsertBar: HTMLDivElement;
    topInsertBar = el.children[0] as HTMLDivElement;
    bottomInsertBar = el.children[1] as HTMLDivElement;
    switch (pos) {
      case 'top':
        topInsertBar.style.display = 'inline';
        bottomInsertBar.style.display = 'none';
        break;
      case 'bottom':
        topInsertBar.style.display = 'none';
        bottomInsertBar.style.display = 'inline';
        break;
      default:
        topInsertBar.style.display = 'none';
        bottomInsertBar.style.display = 'none';
        break;
    }
  }

  //#endregion

  //#region 添加页面

  //#endregion

  //#region 页面选择

  DoSelectPage = (e: React.MouseEvent<HTMLDivElement>, page: CWPage) => {
    const { courseware, commander } = this.props;
    if (e && KeyHelper.checkCtrlOrMeta(e)) {
      page.IsSelected = !page.IsSelected;
    } else if (e && e.shiftKey) {
      if (courseware.SelectedPage == null) courseware.SelectedPage = page;
      else {
        var startIndex = courseware.Pages.indexOf(courseware.SelectedPage);
        var endIndex = courseware.Pages.indexOf(page);
        courseware.Pages?.forEach((p: CWPage, i: number) => {
          if (
            i < Math.min(startIndex, endIndex) ||
            i > Math.max(startIndex, endIndex)
          )
            p.IsSelected = false;
          else p.IsSelected = true;
        });
      }
    } else {
      if (e.button == 0 || !page.IsSelected) courseware.SelectedPage = page;
    }
  };

  @observable
  private _Width;
  public get Width(): number {
    return this._Width;
  }
  public set Width(v: number) {
    this._Width = v;
  }

  public getWidth(width) {
    if (this.Width != width) this._Width = width;
  }

  //#endregion

  render() {
    const { courseware, commander: _cmder } = this.props;
    var commander = _cmder as CourseCommander;
    var aspectratio = 56.25;
    if (
      courseware &&
      courseware.StageSize &&
      courseware.StageSize.x > 0 &&
      courseware.StageSize.y > 0
    ) {
      aspectratio = (courseware.StageSize.y / courseware.StageSize.x) * 100;
    }

    return (
      <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
        <div style={{ height: '25px', width: '100%', background: '#E3E3E3' }}>
          <Button
            type="dashed"
            size="small"
            style={{
              float: 'right',
              margin: '0px 10px',
              width: '20px',
              height: '20px',
              position: 'relative',
              background: 'transparent',
            }}
            onClick={commander.addNewPage}
          >
            <svg
              style={{
                position: 'absolute',
                margin: 'auto',
                top: '0',
                right: '0',
                bottom: '0',
                left: '0',
              }}
              width="13"
              height="13"
              viewBox="0 0 18 18"
            >
              <g stroke="rgb(64,169,255)" strokeWidth={2}>
                <path d="M0,9 L18,9 M9,0 L9,18"></path>
              </g>
            </svg>
          </Button>
        </div>
        <Dropdown
          overlay={PageContextMenu({
            courseware: courseware,
            targetPage: courseware.SelectedPage,
          })}
          trigger={['contextMenu']}
        >
          <div
            className="scrollableView"
            style={{
              overflowY: 'auto',
              position: 'absolute',
              width: '100%',
              bottom: '0px',
              top: '25px',
            }}
          >
            {courseware?.Pages?.map((page: CWPage, i) => {
              return (
                <div
                  key={page.Id}
                  style={{
                    position: 'relative',
                    padding: '8px 16px 8px 4px',
                    width: '100%',
                    display: 'table',
                    background: page.IsSelected ? '#1D91FC' : 'transparent',
                  }}
                  draggable={true}
                  onDragStart={e => this.pageStartDrag(e, page)}
                  onDragOver={e => this.pageDragOver(e, page)}
                  onDrop={e => this.dropOnPage(e, page)}
                  onDragEnd={e => this.pageDragEnd(e, page)}
                >
                  <div
                    className="topInsert"
                    style={{
                      position: 'absolute',
                      zIndex: 5,
                      display: 'none',
                      pointerEvents: 'none',
                      left: '3px',
                      right: '3px',
                      height: '4px',
                      top: '-2px',
                      border: '1px dashed #C3833F',
                    }}
                  ></div>
                  <div
                    className="bottomInsert"
                    style={{
                      position: 'absolute',
                      zIndex: 5,
                      display: 'none',
                      pointerEvents: 'none',
                      left: '3px',
                      right: '3px',
                      height: '4px',
                      bottom: '-2px',
                      border: '1px dashed #C3833F',
                    }}
                  ></div>

                  <div
                    style={{
                      width: '15%',
                      maxWidth: '40px',
                      minWidth: '18px',
                      textAlign: 'right',
                      position: 'absolute',
                      left: '0px',
                      top: '0px',
                      bottom: '0px',
                    }}
                  >
                    <label
                      style={{
                        position: 'relative',
                        top: '25%',
                        right: '8px',
                        color: page.IsSelected ? 'white' : 'black',
                      }}
                    >
                      {page.PageIndex}
                    </label>
                  </div>

                  <div
                    className="pagePreview"
                    onMouseDown={e => this.DoSelectPage(e, page)}
                    style={{
                      width: '80%',
                      float: 'right',
                      // boxShadow: '0px 0px 6px 2px  #999999',
                    }}
                  >
                    <Tooltip title={page.Name}>
                      <div
                        style={{
                          width: this.Width,
                          fontSize: 12,
                          color: page.IsSelected ? 'blanchedalmond' : 'black',
                          textAlign: 'center',
                          overflow: 'hidden',
                          whiteSpace: 'nowrap',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {page.Name}
                      </div>
                    </Tooltip>

                    <div
                      style={{
                        overflow: 'hidden',
                        width: '100%',
                        position: 'relative',
                        height: '0px',
                        paddingBottom: `${aspectratio}%`,
                        border: page.IsHoverId
                          ? '3px solid springgreen'
                          : 'none',
                      }}
                    >
                      <div
                        style={{
                          position: 'absolute',
                          width: '100%',
                          height: '100%',
                          background: 'white',
                          overflow: 'hidden',
                        }}
                      >
                        <Viewbox getWidth={w => this.getWidth(w)}>
                          <StageCanvas IsMainView={false} PageData={page} />
                        </Viewbox>
                      </div>
                      <div
                        style={{
                          position: 'absolute',
                          width: '12px',
                          right: '3px',
                          bottom: '3px',
                        }}
                      >
                        {page.FSVideoId != null && page.FSVideoId != '' ? (
                          <Popover content={page.FullScreenVideo?.resourceName}>
                            <div
                              style={{ height: '12px', cursor: 'pointer' }}
                              onClick={() => {
                                commander.openUrl(
                                  page.FullScreenVideo?.resourceKey,
                                );
                              }}
                            >
                              {PageVideoIcon}
                            </div>
                          </Popover>
                        ) : null}
                        {page.BgAudioId != null && page.BgAudioId != '' ? (
                          <Popover content={page.BgAudio?.resourceName}>
                            <div
                              style={{
                                height: '12px',
                                marginTop: '2px',
                                cursor: 'pointer',
                              }}
                              onClick={() => {
                                commander.openUrl(page.BgAudio?.resourceKey);
                              }}
                            >
                              {PageAudioIcon}
                            </div>
                          </Popover>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Dropdown>
      </div>
    );
  }
}

export default PageList;
