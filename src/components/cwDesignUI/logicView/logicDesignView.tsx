import React, { PureComponent } from 'react';
import { observer, inject } from 'mobx-react';
import LogicDesign from '@/modelClasses/courseDetail/logicDesign';
import CourseCommander from '@/modelClasses/courseDetail/courseCommander';
import FreeScrollbar from '@/components/controls/scrollviewer';
import { observable, runInAction, reaction } from 'mobx';
import { Rect2D, GeometryHelper, Point2D, noCalcSize } from '@/utils/Math2D';
import CWSubstance from '@/modelClasses/courseDetail/cwSubstance';
import ILogicDesignItem from '@/modelClasses/courseDetail/InvokeDesign/logicViewModels/ILogicDesignItem';
import LogicDesignCanvas from './logicDesignCanvas';
import copy from 'copy-to-clipboard';
import LoopWork from '@/modelClasses/courseDetail/toolbox/LoopWork';
import { stores } from '@/pages';
import {
  getGlobalHotkeyHandlers,
  getLogicDesignHotkeyHandlers,
} from '@/configs/hotkeyConfigs';
import { HotKeys } from 'react-hotkeys';
import InvFunction from '@/modelClasses/courseDetail/InvokeDesign/logicViewModels/Invokables/InvFunc/InvFunction';
import FuncWindowView from './ldItemViews/funcWindowView';
import ReactDOM from 'react-dom';
import { InvStructNode } from '@/modelClasses/courseDetail/InvokeDesign/invStructTree';
import KeyHelper from '@/utils/keyHelper';
import FreeScrollViewer from '@/components/controls/freeScrollViewer';
import StopWatch from '@/utils/stopWatch';
import { Dropdown, Menu } from 'antd';
import { CaretDownOutlined } from '@ant-design/icons';
import { renderInvStructNode } from './addInvItemMenu';

@observer
class InvAddMenuView extends PureComponent<{ logicDesign: LogicDesign }> {
  @observable
  menuStates: boolean[] = null;

  constructor(props) {
    super(props);
    var logicDesign = props.logicDesign;
    var rootNodes = logicDesign?.FullInvCreateTreeMap;
    this.menuStates = rootNodes?.map(x => false);
  }

  render() {
    var logicDesign = this.props.logicDesign;
    var rootNodes = logicDesign?.FullInvCreateTreeMap;

    var counter = [0];
    if (rootNodes) {
      return (
        <div
          style={{
            position: 'absolute',
            left: '3px',
            top: '3px',
            display: '-webkit-box',
            WebkitBoxPack: 'start',
            WebkitBoxAlign: 'center',
            WebkitBoxOrient: 'horizontal',
            fontSize: '13px',
          }}
        >
          {rootNodes.map((node, mindex) => (
            <Dropdown
              overlay={
                <Menu style={{ userSelect: 'none' }}>
                  {node.Children?.map((subNode, nodeindex) => {
                    return renderInvStructNode(
                      this.props.logicDesign,
                      subNode,
                      node.Children,
                      counter,
                      true,
                      (() => {
                        this.menuStates[mindex] = false;
                      }).bind(this),
                    );
                  })}
                </Menu>
              }
              placement="bottomLeft"
              trigger={['click']}
              key={mindex}
              visible={this.menuStates[mindex]}
              onVisibleChange={v => (this.menuStates[mindex] = v)}
            >
              <div
                style={{
                  marginLeft: '3px',
                  marginRight: '3px',
                  display: '-webkit-box',
                  WebkitBoxPack: 'start',
                  WebkitBoxAlign: 'center',
                  WebkitBoxOrient: 'horizontal',
                  borderRadius: '4px',
                  padding: '0px 5px',
                  border: '1px solid #3333337F',
                  cursor: 'pointer',
                  background: '#FFFFFFDF',
                }}
              >
                <div
                  style={{ width: '15px', height: '15px', marginRight: '3px' }}
                >
                  {InvStructNode.GetNodeIcon(node.Name)}
                </div>
                <label>{node.Name}</label>
                <CaretDownOutlined style={{ marginLeft: '3px' }} />
              </div>
            </Dropdown>
          ))}
        </div>
      );
    }
    return null;
  }
}

@observer
export default class LogicDesignView extends React.Component<any> {
  scrollview: FreeScrollViewer;
  selectAreaLayer: HTMLDivElement;
  lgbg: HTMLDivElement;
  lgCanvas: LogicDesignCanvas;
  funcWindowsLayer: HTMLDivElement;

  @observable
  dragingSelectArea: boolean = false;
  @observable
  dragRect: Rect2D = Rect2D.Empty;

  handleRootRef = v => {
    const { logicDesign: _logicDesign } = this.props;
    var logicDesign = _logicDesign as LogicDesign;
    var commander = logicDesign?.Scene?.Courseware?.Commander;
    if (commander) commander.LogicViewUIRoot = v;
    this.scrollview = v;
    this.resetView();
  };

  onBgMouseDown = (e: React.MouseEvent, isScrollViewBg: boolean = false) => {
    var target = e.target as HTMLElement;
    const { logicDesign: _logicDesign } = this.props;
    var logicDesign = _logicDesign as LogicDesign;
    const { clientX, clientY } = e;
    if ((target && target.classList.contains('lgBg')) || isScrollViewBg) {
      // 逻辑组件折叠总开关
      if (stores.commander.LogicTemplteShow) {
        // 点击逻辑背景时将所有执行器的模板详情部分关闭
        logicDesign.SubInvs.map(item => {
          if (item.IsShowDetail) {
            item.IsShowDetail = false;
          }
        });
      }

      if (e.button == 0 && this.selectAreaLayer) {
        this.dragingSelectArea = true;

        var startPoint = GeometryHelper.GetPosition(
          this.selectAreaLayer,
          new Point2D(clientX, clientY),
        );
        this.dragRect = new Rect2D(startPoint.x, startPoint.y, 0, 0);

        if (!KeyHelper.checkCtrlOrMeta(e))
          logicDesign?.SelectedLogicDItems?.forEach(
            x => (x.IsSelectedInDesign = false),
          );
        var startSelectedItems = logicDesign?.SelectedLogicDItems;
        const onMove = e => {
          if (!this.dragingSelectArea) return; // patch: fix windows press win key during mouseup issue
          e.stopImmediatePropagation();
          const { clientX, clientY } = e;
          var endPoint = GeometryHelper.GetPosition(
            this.selectAreaLayer,
            new Point2D(clientX, clientY),
          );
          var leftTop = new Point2D(
            Math.min(endPoint.x, startPoint.x),
            Math.min(endPoint.y, startPoint.y),
          );
          var rightbottom = new Point2D(
            Math.max(endPoint.x, startPoint.x),
            Math.max(endPoint.y, startPoint.y),
          );
          this.dragRect = new Rect2D(
            leftTop.x,
            leftTop.y,
            rightbottom.x - leftTop.x,
            rightbottom.y - leftTop.y,
          );
        };
        const onUp = () => {
          document.removeEventListener('mousemove', onMove);
          document.removeEventListener('mouseup', onUp);
          if (!this.dragingSelectArea) return;
          runInAction(() => {
            var itemsInRect = this.getItemsInRect(this.dragRect);
            logicDesign.LogicDItems?.forEach(item => {
              if (itemsInRect.includes(item)) {
                if (!item.IsSelectedInDesign) item.IsSelectedInDesign = true;
              } else if (
                item.IsSelectedInDesign &&
                !startSelectedItems.includes(item)
              ) {
                item.IsSelectedInDesign = false;
              }
            });
          });

          this.dragingSelectArea = false;
          this.dragRect = Rect2D.Empty;
        };
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);
      }
    }
  };

  onBgMouseUp = (e: React.MouseEvent, isScrollViewBg: boolean = false) => {
    var target = e.target as HTMLElement;
    const { logicDesign: _logicDesign } = this.props;
    var logicDesign = _logicDesign as LogicDesign;
    const { clientX, clientY } = e;
    if ((target && target.classList.contains('lgBg')) || isScrollViewBg) {
      if (e.button == 2) {
        //右键打开右键菜单
        logicDesign.AddPosition = GeometryHelper.GetPosition(
          ReactDOM.findDOMNode(this.lgCanvas) as HTMLElement,
          new Point2D(clientX, clientY),
        );
        logicDesign.InvCreateTreeMap = InvStructNode.GetInvTypeStruct(
          logicDesign,
        );
        logicDesign.IsShowInvAddMenu = true;
      }
    }
  };

  onScale = (e: React.WheelEvent) => {
    //console.log(e.deltaY);
    const { logicDesign: _logicDesign } = this.props;
    var logicDesign = _logicDesign as LogicDesign;
    var oldScale = logicDesign.Scale;
    runInAction(() => {
      logicDesign.Scale = Math.min(
        1.5,
        Math.max(0.1, logicDesign.Scale * (1 - e.deltaY / 1000)),
      );
    });
    //e.preventDefault();
    e.stopPropagation();
    return logicDesign.Scale / oldScale;
  };

  resetView() {
    if (this.scrollview) {
      const { logicDesign: _logicDesign } = this.props;
      var logicDesign = _logicDesign as LogicDesign;
      var stageSize = {
        x: this.scrollview.ContentWidth,
        y: this.scrollview.ContentHeight,
      };
      var targetScale = Math.max(
        0.125 / logicDesign.Scale,
        Math.min(
          1.5 / logicDesign.Scale,
          (this.scrollview.ViewportWidth - 60) / stageSize.x,
          (this.scrollview.ViewportHeight - 60) / stageSize.y,
        ),
      );
      var scaleStageSize = {
        x: stageSize.x * targetScale,
        y: stageSize.y * targetScale,
      };
      var contentLeft = this.scrollview.ContentLeft;
      var contentTop = this.scrollview.ContentTop;
      this.scrollview.ZeroPointX =
        (this.scrollview.ViewportWidth - scaleStageSize.x) / 2 +
        (this.scrollview.ZeroPointX - contentLeft) * targetScale;
      this.scrollview.ZeroPointY =
        (this.scrollview.ViewportHeight - scaleStageSize.y) / 2 +
        (this.scrollview.ZeroPointY - contentTop) * targetScale;
      logicDesign.Scale *= targetScale;
    }
  }

  getItemsInRect(rect: Rect2D): ILogicDesignItem[] {
    const { logicDesign: _logicDesign } = this.props;
    var logicDesign = _logicDesign as LogicDesign;

    var itemViews = this.lgCanvas.LogicItemViews;
    var result: ILogicDesignItem[] = [];
    for (var i = 0; i < itemViews.length; i++) {
      var itemView = itemViews[i];
      var _itemRectInWindow = itemView.getBoundingClientRect();
      var lefttop = GeometryHelper.GetPosition(
        this.selectAreaLayer,
        new Point2D(_itemRectInWindow.left, _itemRectInWindow.top),
      );
      var itemRect = new Rect2D(
        lefttop.x,
        lefttop.y,
        _itemRectInWindow.width,
        _itemRectInWindow.height,
      );
      if (!itemRect.isEmpty && rect.contains(itemRect)) {
        result.push(logicDesign.LogicDItems[i]);
      }
    }
    return result;
  }

  @observable
  _BgContentRect: Rect2D = Rect2D.Empty;
  GetBgContentRect() {
    if (this.scrollview) {
      var rect = new Rect2D(
        Math.min(this.scrollview.ContentLeft, 0) - this.scrollview.ZeroPointX,
        Math.min(this.scrollview.ContentTop, 0) - this.scrollview.ZeroPointY,
        this.scrollview.ScrollWidth,
        this.scrollview.ScrollHeight,
      );
      if (!this._BgContentRect.equals(rect)) this._BgContentRect = rect;
      // 当前逻辑可视区的reac
      this.scrollview.getScrollRect(this.scrollview.rootEl);
      let commander = this.props.logicDesign?.Scene?.Courseware?.Commander;
      commander.ScrollviewRoot = this.scrollview;
    }
  }

  protected bgRectChanged = reaction(
    () => this._BgContentRect,
    bgRect => {
      if (this.lgbg) {
        Object.assign(this.lgbg.style, {
          width: `${bgRect.width}px`,
          height: `${bgRect.height}px`,
          // left: `${bgRect.left}px`,
          // top: `${bgRect.top}px`,
          transform: `translate(${bgRect.left}px, ${bgRect.top}px)`,
        });
      }
    },
  );

  protected dragRectChanged = reaction(
    () => this.dragRect,
    dragRect => {
      if (this.selectAreaLayer && this.selectAreaLayer.firstElementChild) {
        var selectArea = this.selectAreaLayer
          .firstElementChild as HTMLDivElement;
        Object.assign(selectArea.style, {
          width: `${dragRect.width}px`,
          height: `${dragRect.height}px`,
          left: `${dragRect.left}px`,
          top: `${dragRect.top}px`,
        });
      }
    },
  );

  public componentDidMount() {
    LoopWork.Instance.setMission(this, this.GetBgContentRect.bind(this));
  }

  public componentWillUnmount() {
    LoopWork.Instance.removeMission(this);
  }

  render() {
    const bgurl = require('@/assets/lgbg.svg');
    const { logicDesign: _logicDesign } = this.props;
    // var rootld = stores.commander?.SelectedPage?.LogicDesign;
    var logicDesign = _logicDesign as LogicDesign; //|| rootld;
    if (!logicDesign) return null;
    // var bgRect = this._BgContentRect;
    return (
      <HotKeys
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          background: 'transparent',
        }}
        handlers={{
          ...getLogicDesignHotkeyHandlers(logicDesign),
        }}
      >
        <div
          className="modified-ant-elements"
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            background: `#9999AF12 url(${bgurl}) repeat`,
          }}
        >
          <FreeScrollViewer
            className="lgScrollViewer"
            ref={this.handleRootRef}
            onBgMouseDown={this.onBgMouseDown.bind(this)}
            onBgMouseUp={this.onBgMouseUp.bind(this)}
            onScale={this.onScale.bind(this)}
            onResetView={this.resetView.bind(this)}
            style={{ position: 'absolute' }}
          >
            <div
              style={{
                minHeight: '99%',
                minWidth: '100%',
              }}
              tabIndex={-1}
              ref={div => (logicDesign.LDViewBg = div)}
            >
              <div
                className={`lgBg ${noCalcSize}`}
                style={{
                  position: 'absolute',
                  // width: `${bgRect.width}px`,
                  // height: `${bgRect.height}px`,
                  // left: `${bgRect.left}px`,
                  // top: `${bgRect.top}px`,
                }}
                ref={v => (this.lgbg = v)}
                onDragOver={logicDesign.lgBgMouseDragOver.bind(logicDesign)}
                onDrop={logicDesign.lgBgDrop.bind(logicDesign)}
              />
              <LogicDesignCanvas
                className="lgCanvas"
                logicDesign={logicDesign}
                ref={element => (this.lgCanvas = element)}
              ></LogicDesignCanvas>
              <div
                className="selectAreaLayer"
                style={{
                  background: '#FF00002F',
                  position: 'absolute',
                  pointerEvents: 'none',
                }}
                ref={div => (this.selectAreaLayer = div)}
              >
                {this.dragingSelectArea ? (
                  <div
                    className="selectArea"
                    style={{
                      position: 'absolute',
                      // marginLeft: `${this.dragRect.x}px`,
                      // marginTop: `${this.dragRect.y}px`,
                      // width: `${this.dragRect.width}px`,
                      // height: `${this.dragRect.height}px`,
                      background: '#2222E42B',
                      border: '2px dashed #2222E45B',
                      // display: `${this.dragingSelectArea ? 'inline' : 'none'}`,
                    }}
                  ></div>
                ) : null}
              </div>
            </div>
          </FreeScrollViewer>

          <InvAddMenuView logicDesign={logicDesign} />

          <div
            className="funcWindowsLayer"
            ref={v => (this.funcWindowsLayer = v)}
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
            }}
          >
            {logicDesign.OpennedSubFuncs?.filter(x =>
              logicDesign.SubInvs.includes(x),
            ).map((invFunc: InvFunction, i: number) => {
              if (invFunc != null)
                return (
                  <FuncWindowView
                    key={i}
                    invFunc={invFunc}
                    attachedTo={this.funcWindowsLayer}
                  />
                );
            })}
          </div>
        </div>
      </HotKeys>
    );
  }
}
