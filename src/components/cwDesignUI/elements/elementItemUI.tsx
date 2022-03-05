import React, { PureComponent, Component } from 'react';
import CWElement from '@/modelClasses/courseDetail/cwElement';
import { observable, runInAction } from 'mobx';
import { number } from 'prop-types';
import { observer } from 'mobx-react';
import ResizableRect from './resizable';
import {
  Point2D,
  Rect2D,
  Vector2D,
  Matrix2D,
  noCalcChildrenSize,
} from '@/utils/Math2D';
import { from, elementAtOrDefault } from 'linq-to-typescript';
import UIHelper from '@/utils/uiHelper';
import RUHelper from '@/redoundo/redoUndoHelper';
import { Dropdown } from 'antd';
import ElementContextMenu from '../itemstree/itemContextMenu';
import ReactDOM from 'react-dom';
import KeyHelper from '@/utils/keyHelper';
import LoopWork from '@/modelClasses/courseDetail/toolbox/LoopWork';
import CombinedEditItem from '@/modelClasses/courseDetail/editItemViewModels/combinedEditItem';
import { Rect } from 'flexlayout-react';
import ArrayHelper from '@/utils/arrayHelper';

type LockTypes =
  | 'Left'
  | 'Right'
  | 'HCenter'
  | 'SameWidth'
  | 'Top'
  | 'Bottom'
  | 'VCenter'
  | 'SameHeight'
  | 'LeftToRight'
  | 'RightToLeft'
  | 'TopToBottom'
  | 'BottomToTop';

class LockParam {
  Distance: number;
  LockType: LockTypes;
  TargetBound: Rect2D;
}

@observer
export class EditItemViewContent extends PureComponent<any> {
  render() {
    const { dataContext } = this.props;
    var template = dataContext?.Template;
    return template
      ? template({
          ...this.props,
          courseware: this.props.courseware
            ? this.props.courseware
            : dataContext?.Scene?.Courseware,
        })
      : null;
  }
}

@observer
export default class EditItemView extends Component<any, any> {
  rootEl: HTMLElement;

  constructor(props) {
    super(props);
  }

  //#region 拖动与选中

  private minimumError: number = 1e-7;
  private adsorbDistance = 5;
  private minimumDragMove = 3;

  private movingItems: CWElement[] = [];
  private startRects: Rect2D[] = [];
  private startMovingBound: Rect2D = Rect2D.Empty;
  private _isStartSelected = false;
  private _isCtrlDragged = false;

  private dragVector: Vector2D = Vector2D.Zero;
  private moveVector: Vector2D = Vector2D.Zero;
  private mouseStartPos: Point2D = Point2D.Zero;
  private isDragMoved = false;

  private isCtrlDown = false;
  private preCtrlState = false;
  private preMoveVector = Vector2D.Zero;

  get HelpLineLayer() {
    var stageCanvas = UIHelper.FindAncestorByClassName(
      this.rootEl,
      'StageCanvas',
    );
    var helpLineLayer = stageCanvas?.getElementsByClassName(
      'helpLineLayer',
    )?.[0];
    return helpLineLayer;
  }
  get Scene() {
    var element = this.props.dataContext as CWElement;
    var scene = element?.Scene;
    return scene;
  }

  MovingRendering() {
    var element = this.props.dataContext as CWElement;
    var scene = element?.Scene;
    if (!element || !scene) return;
    this.isCtrlDown = KeyHelper.isCtrlOrMetaPressed;
    if (
      this.preCtrlState != this.isCtrlDown ||
      (!this.moveVector.equals(this.preMoveVector) &&
        (this.isDragMoved ||
          this.moveVector.length >
            this.minimumDragMove / scene.Courseware.StageScale))
    ) {
      this.isDragMoved =
        this.isDragMoved || !this.moveVector.equals(this.preMoveVector);
      runInAction(() => {
        //清除已有的线
        this.clearGuideLines();

        if (this.isDragMoved)
          this.moveVector = this.FindGuideLine(this.dragVector);
        var i = 0;

        if (this.isCtrlDown) {
          //复制
          if (this.copyViews == null || this.copyViews.length == 0)
            this.movingItems?.forEach(element => {
              element.AbsolutePosition = this.startRects[i++].lefttop;
            });
          this.drawCopyView();
        } else {
          this.movingItems?.forEach(element => {
            element.AbsolutePosition = this.moveVector.translatePoint(
              this.startRects[i++].lefttop,
            );
          });
          this.clearCopyView();
        }
      });
    }
    this.preCtrlState = this.isCtrlDown;
    this.preMoveVector = this.moveVector;
  }

  hLockParams: LockParam[];
  vLockParams: LockParam[];
  FindGuideLine(handMoveVector: Vector2D): Vector2D {
    var adsorb_Distance =
      this.adsorbDistance / this.Scene.Courseware.StageScale;
    this.hLockParams = [];
    this.vLockParams = [];

    var movingBound = new Rect2D(
      this.startMovingBound.x + handMoveVector.x,
      this.startMovingBound.y + handMoveVector.y,
      this.startMovingBound.width,
      this.startMovingBound.height,
    );
    var targetBounds = this.GetOtherItemBounds();

    targetBounds.forEach(x => this.CheckCanLockTo(movingBound, x));

    var minHDistance: number = null;
    var minVDistance: number = null;

    this.hLockParams.forEach(param => {
      if (
        minHDistance == null ||
        Math.abs(param.Distance) < Math.abs(minHDistance || 0)
      )
        minHDistance = param.Distance;
    });
    var minHLockParams = this.hLockParams.filter(
      x => x.Distance - minHDistance < this.minimumError,
    ); //取得所有横向吸附的目标

    this.vLockParams.forEach(param => {
      if (
        minVDistance == null ||
        Math.abs(param.Distance) < Math.abs(minVDistance || 0)
      )
        minVDistance = param.Distance;
    });
    var minVLockParams = this.vLockParams.filter(
      x => x.Distance - minVDistance < this.minimumError,
    ); //取得所有纵向吸附的目标

    var modifyVector = new Vector2D(
      minHDistance == null ? 0 : -minHDistance || 0,
      minVDistance == null ? 0 : -minVDistance || 0,
    );

    var hLines: Rect2D[] = [];
    var vLines: Rect2D[] = [];

    for (var hlockp of minHLockParams) {
      var tbound = hlockp.TargetBound;
      var lineleft = Rect2D.Empty;
      lineleft.x = tbound.left;
      lineleft.y = Math.min(movingBound.top, tbound.top) - adsorb_Distance * 3;
      lineleft.width = 0;
      lineleft.height =
        Math.max(movingBound.bottom, tbound.bottom) +
        adsorb_Distance * 3 -
        lineleft.y;

      var lineright = Rect2D.Empty;
      lineright.x = tbound.right;
      lineright.y = Math.min(movingBound.top, tbound.top) - adsorb_Distance * 3;
      lineright.width = 0;
      lineright.height =
        Math.max(movingBound.bottom, tbound.bottom) +
        adsorb_Distance * 3 -
        lineright.y;

      if (hlockp.LockType == 'Left' || hlockp.LockType == 'RightToLeft') {
        this.AddHLine(hLines, lineleft);
      } else if (
        hlockp.LockType == 'Right' ||
        hlockp.LockType == 'LeftToRight'
      ) {
        this.AddHLine(hLines, lineright);
      } else if (hlockp.LockType == 'SameWidth') {
        this.AddHLine(hLines, lineleft);
        this.AddHLine(hLines, lineright);
      } else if (hlockp.LockType == 'HCenter') {
        var centerHline = Rect2D.Empty;
        centerHline.x = (tbound.left + tbound.right) / 2;
        centerHline.y =
          Math.min(movingBound.top, tbound.top) - adsorb_Distance * 3;
        centerHline.width = 0;
        centerHline.height =
          Math.max(movingBound.bottom, tbound.bottom) +
          adsorb_Distance * 3 -
          centerHline.y;
        this.AddHLine(hLines, centerHline);
      }
    }

    for (var vlockp of minVLockParams) {
      var tbound = vlockp.TargetBound;
      var linetop = Rect2D.Empty;
      linetop.x = Math.min(movingBound.left, tbound.left) - adsorb_Distance * 3;
      linetop.y = tbound.top;
      linetop.width =
        Math.max(movingBound.right, tbound.right) +
        adsorb_Distance * 3 -
        linetop.x;
      linetop.height = 0;

      var linebottom = Rect2D.Empty;
      linebottom.x =
        Math.min(movingBound.left, tbound.left) - adsorb_Distance * 3;
      linebottom.y = tbound.bottom;
      (linebottom.width =
        Math.max(movingBound.right, tbound.right) +
        adsorb_Distance * 3 -
        linebottom.x),
        (linebottom.height = 0);

      if (vlockp.LockType == 'Top' || vlockp.LockType == 'BottomToTop') {
        this.AddVLine(vLines, linetop);
      } else if (
        vlockp.LockType == 'Bottom' ||
        vlockp.LockType == 'TopToBottom'
      ) {
        this.AddVLine(vLines, linebottom);
      } else if (vlockp.LockType == 'SameHeight') {
        this.AddVLine(vLines, linetop);
        this.AddVLine(vLines, linebottom);
      } else if (vlockp.LockType == 'VCenter') {
        var centerVline = Rect2D.Empty;
        centerVline.x =
          Math.min(movingBound.left, tbound.left) - adsorb_Distance * 3;
        centerVline.y = (tbound.top + tbound.bottom) / 2;
        centerVline.width =
          Math.max(movingBound.right, tbound.right) +
          adsorb_Distance * 3 -
          centerVline.x;
        centerVline.height = 0;
        this.AddHLine(hLines, centerVline);
      }
    }

    hLines.forEach(line =>
      this.DrawGuideLine(line.left, line.top, line.right, line.bottom),
    );
    vLines.forEach(line =>
      this.DrawGuideLine(line.left, line.top, line.right, line.bottom),
    );

    return handMoveVector.add(modifyVector);
  }

  GetRotatedBoundary(rect: Rect2D, angle: number): Rect2D {
    var m = new Matrix2D();
    m.RotateAt(angle, rect.x + rect.width / 2, rect.y + rect.height / 2);
    var boundary = m.TransformRect(rect);
    return boundary;
  }

  GetItemBoundary(item: CWElement): Rect2D {
    return this.GetRotatedBoundary(
      new Rect2D(item.AbsoluteLeft, item.AbsoluteTop, item.Width, item.Height),
      item.AbsoluteAngle,
    );
  }

  public GetMovingOutBound(): Rect2D {
    var wholeSelectedBound = Rect2D.Empty;
    var selectedBounds = this.movingItems.map(x => this.GetItemBoundary(x));
    wholeSelectedBound = Rect2D.union(...selectedBounds);

    if (this.isCtrlDown) {
      var m = new Matrix2D();
      m.Translate(this.moveVector.x, this.moveVector.y);
      wholeSelectedBound = m.TransformRect(wholeSelectedBound);
    }

    return wholeSelectedBound;
  }

  GetOtherItemBounds(): Rect2D[] {
    var totalItems = this.Scene?.TotalEditItemList.filter(
      x => !(x instanceof CombinedEditItem),
    );
    var otheritems = this.isCtrlDown
      ? totalItems
      : totalItems.filter(x => !x.IsSelected);
    otheritems = otheritems.filter(
      y => this.Scene.SelectedItems.find(x => x.IsAncestorOf(y)) == null,
    );
    return otheritems
      .filter(x => !x.IsDesignHide)
      .map(x => this.GetItemBoundary(x));
  }

  AddHLine(lines: Rect2D[], line: Rect2D) {
    var sameLine = lines.find(x => Math.abs(x.left - line.left) < 1.1);
    if (sameLine == null) lines.push(line);
    else {
      sameLine.y = Math.min(sameLine.top, line.top);
      sameLine.height = Math.min(sameLine.bottom, line.bottom) - sameLine.y;
    }
  }

  AddVLine(lines: Rect2D[], line: Rect2D) {
    var sameLine = lines.find(x => Math.abs(x.top - line.top) < 1.1);
    if (sameLine == null) lines.push(line);
    else {
      sameLine.x = Math.min(sameLine.left, line.left);
      sameLine.width = Math.min(sameLine.right, line.right) - sameLine.x;
    }
  }

  CheckCanLockTo(movingBound: Rect2D, targetBound: Rect2D) {
    var adsorb_Distance =
      this.adsorbDistance / this.Scene.Courseware.StageScale;

    //#region 无视距离吸附的机制

    var leftdis = movingBound.left - targetBound.left;
    var rightdis = movingBound.right - targetBound.right;
    var topdis = movingBound.top - targetBound.top;
    var bottomdis = movingBound.bottom - targetBound.bottom;
    var hcenterdis =
      (movingBound.left + movingBound.right) / 2 -
      (targetBound.left + targetBound.right) / 2;
    var vcenterdis =
      (movingBound.top + movingBound.bottom) / 2 -
      (targetBound.top + targetBound.bottom) / 2;

    //#region 左中右

    if (Math.abs(movingBound.width - targetBound.width) < this.minimumError) {
      //认为宽度相同
      if (Math.abs(leftdis) < adsorb_Distance)
        this.hLockParams.push(
          Object.assign(new LockParam(), {
            Distance: leftdis,
            LockType: 'SameWidth',
            TargetBound: targetBound,
          }),
        );
    } else {
      if (Math.abs(leftdis) < adsorb_Distance)
        this.hLockParams.push(
          Object.assign(new LockParam(), {
            Distance: leftdis,
            LockType: 'Left',
            TargetBound: targetBound,
          }),
        );
      else if (Math.abs(hcenterdis) < adsorb_Distance)
        this.hLockParams.push(
          Object.assign(new LockParam(), {
            Distance: hcenterdis,
            LockType: 'HCenter',
            TargetBound: targetBound,
          }),
        );
      else if (Math.abs(rightdis) < adsorb_Distance)
        this.hLockParams.push(
          Object.assign(new LockParam(), {
            Distance: rightdis,
            LockType: 'Right',
            TargetBound: targetBound,
          }),
        );
    }

    //#endregion
    //#region 上中下
    if (Math.abs(movingBound.height - targetBound.height) < this.minimumError) {
      //认为高度相同
      if (Math.abs(topdis) < adsorb_Distance)
        this.vLockParams.push(
          Object.assign(new LockParam(), {
            Distance: topdis,
            LockType: 'SameHeight',
            TargetBound: targetBound,
          }),
        );
    } else {
      if (Math.abs(topdis) < adsorb_Distance)
        this.vLockParams.push(
          Object.assign(new LockParam(), {
            Distance: topdis,
            LockType: 'Top',
            TargetBound: targetBound,
          }),
        );
      else if (Math.abs(vcenterdis) < adsorb_Distance)
        this.vLockParams.push(
          Object.assign(new LockParam(), {
            Distance: vcenterdis,
            LockType: 'VCenter',
            TargetBound: targetBound,
          }),
        );
      else if (Math.abs(bottomdis) < adsorb_Distance)
        this.vLockParams.push(
          Object.assign(new LockParam(), {
            Distance: bottomdis,
            LockType: 'Bottom',
            TargetBound: targetBound,
          }),
        );
    }
    //#endregion

    //#endregion

    //#region 边界相临的吸附机制

    if (movingBound.intersect(targetBound).isEmpty) {
      //不相互包含
      if (
        movingBound.bottom >= targetBound.top - adsorb_Distance &&
        movingBound.top <= targetBound.bottom + adsorb_Distance
      ) {
        //高度上有交错关系，寻找左右边界上是否可吸附
        var lrdis = movingBound.left - targetBound.right;
        var rldis = movingBound.right - targetBound.left;
        if (lrdis >= 0 && Math.abs(lrdis) < adsorb_Distance)
          this.hLockParams.push(
            Object.assign(new LockParam(), {
              Distance: lrdis,
              LockType: 'LeftToRight',
              TargetBound: targetBound,
            }),
          );
        else if (rldis <= 0 && Math.abs(rldis) < adsorb_Distance)
          this.hLockParams.push(
            Object.assign(new LockParam(), {
              Distance: rldis,
              LockType: 'RightToLeft',
              TargetBound: targetBound,
            }),
          );
      }
      if (
        movingBound.right >= targetBound.left - adsorb_Distance &&
        movingBound.left <= targetBound.right + adsorb_Distance
      ) {
        //宽度上有交错关系，寻找左右边界上是否可吸附
        var tbdis = movingBound.top - targetBound.bottom;
        var btdis = movingBound.bottom - targetBound.top;
        if (tbdis >= 0 && Math.abs(tbdis) < adsorb_Distance)
          this.vLockParams.push(
            Object.assign(new LockParam(), {
              Distance: tbdis,
              LockType: 'TopToBottom',
              TargetBound: targetBound,
            }),
          );
        else if (btdis <= 0 && Math.abs(btdis) < adsorb_Distance)
          this.vLockParams.push(
            Object.assign(new LockParam(), {
              Distance: btdis,
              LockType: 'BottomToTop',
              TargetBound: targetBound,
            }),
          );
      }
    }

    //#endregion
  }

  private DrawGuideLine(x1: number, y1: number, x2: number, y2: number) {
    var sceneScale = this.Scene.Courseware.StageScale;
    var dasharray = `${8 / sceneScale},${4 / sceneScale}`;
    var dasharray2 = `0,${4 / sceneScale},${8 / sceneScale}`;
    var strokeWidth = Math.max(1, 1.0 / sceneScale);
    var svgWidth = x2 - x1 + strokeWidth;
    var svgHeight = y2 - y1 + strokeWidth;

    var div = document.createElement('div');
    div.style.position = 'absolute';
    div.style.left = `${x1 - strokeWidth / 2}px`;
    div.style.top = `${y1 - strokeWidth / 2}px`;
    div.style.width = `${svgWidth}px`;
    div.style.height = `${svgHeight}px`;

    ReactDOM.render(
      <svg
        pointerEvents="none"
        style={{
          position: 'absolute',
          left: `${strokeWidth / 2}px`,
          top: `${strokeWidth / 2}px`,
        }}
        width={svgWidth}
        height={svgHeight}
      >
        <line
          stroke={'#EF7F6F'}
          strokeWidth={strokeWidth}
          strokeDasharray={dasharray2}
          strokeLinecap="round"
          x1={0}
          y1={0}
          x2={x2 - x1}
          y2={y2 - y1}
        />
        <line
          stroke={'#6F7FEF'}
          strokeWidth={strokeWidth}
          strokeDasharray={dasharray}
          strokeLinecap="round"
          x1={0}
          y1={0}
          x2={x2 - x1}
          y2={y2 - y1}
        />
      </svg>,
      div,
    );

    this.HelpLineLayer.appendChild(div);
  }

  private clearGuideLines() {
    var helpLineLayer = this.HelpLineLayer;
    if (helpLineLayer) {
      var lines = new Array(...helpLineLayer.children);
      lines.forEach(x => {
        ReactDOM.unmountComponentAtNode(x);
        x.remove();
      });
    }
  }

  handleDrag = e => {
    var element = this.props.dataContext as CWElement;
    var mousePos = new Point2D(e.clientX, e.clientY);
    var move = mousePos.minus(this.mouseStartPos);
    var scale = element.Scene?.Courseware?.StageScale;

    if (scale) this.dragVector = new Vector2D(move.x / scale, move.y / scale);
    this.moveVector = this.dragVector;
    this.isCtrlDown = KeyHelper.checkCtrlOrMeta(e);
    // e.preventDefault();
  };
  handleDragStart = e => {
    var element = this.props.dataContext as CWElement;
    this.moveVector = Vector2D.Zero;
    this.dragVector = Vector2D.Zero;
    this.mouseStartPos = new Point2D(e.clientX, e.clientY);
    // this._isCtrlDragged = false;

    //#region 元素选中
    if (element != null) {
      element.HideUniqueToolbar();
      var isCtrlPressed = KeyHelper.checkCtrlOrMeta(e);
      this._isStartSelected = element.IsSelected;
      if (isCtrlPressed && !element.IsSelected) {
        element.IsSelected = true;
      } else if (!element.IsSelected && element.Scene != null) {
        element.Scene.SelectedItem = element;
      }
    }
    //#endregion
    var selectedItems = element?.Scene?.SelectedItems;
    selectedItems?.forEach(element => {
      element.IsOprating = true;
    });
    this.movingItems = CWElement.ClearDescendants(selectedItems);
    this.startRects = this.movingItems.map(
      x => new Rect2D(x.AbsoluteLeft, x.AbsoluteTop, x.Width, x.Height),
    );

    this.startMovingBound = this.GetMovingOutBound();
    this.isDragMoved = false;

    LoopWork.Instance.setMission(this, this.MovingRendering.bind(this));

    document.addEventListener('mousemove', this.handleDrag);
    document.addEventListener('mouseup', this.handleDragEnd);
  };
  handleDragEnd = e => {
    document.removeEventListener('mousemove', this.handleDrag);
    document.removeEventListener('mouseup', this.handleDragEnd);

    var element = this.props.dataContext as CWElement;
    var selectedItems = element?.Scene?.SelectedItems;
    selectedItems?.forEach(element => {
      element.IsOprating = false;
    });
    LoopWork.Instance.removeMission(this);
    this.clearGuideLines();
    if (this.movingItems != null) {
      this.clearCopyView();
      var endPoints = this.movingItems.map(
        x => new Point2D(x.AbsoluteLeft, x.AbsoluteTop),
      );
      if (
        this.startRects.length == endPoints.length &&
        this.startRects.length > 0
      ) {
        if (this.moveVector.length == 0) {
          ///没有移动
          if (
            element != null &&
            this._isStartSelected &&
            KeyHelper.checkCtrlOrMeta(e)
          ) {
            //原本被选中的元素若在按ctrl键时未移动被释放则取消选中
            element.IsSelected = false;
          }
        } else {
          RUHelper.Core.CreateTransaction();
          if (!this.isCtrlDown) {
            this.movingItems.forEach((item, i) => {
              if (!endPoints[i].equals(this.startRects[i].lefttop)) {
                RUHelper.SetProperty(
                  item,
                  'AbsolutePosition',
                  endPoints[i],
                  this.startRects[i].lefttop,
                );
              }
            });

            var fathers = ArrayHelper.distinct(
              this.movingItems.map(x => x.Father).filter(x => x != null),
            );
            fathers.forEach(x => x.ResetBoundary());
          } else if (this.moveVector.length > 5) {
            //复制
            element.Scene?.PasteItems(
              this.movingItems,
              '-复制',
              this.moveVector,
            );
            //复制拖动时处理
          }

          RUHelper.Core.CommitTransaction();
        }
      }
    }
    e.preventDefault();
  };

  mouseEnter = e => {
    const { dataContext } = this.props;
    var element = dataContext as CWElement;
    var scene = element.Scene;

    var div = e.currentTarget as HTMLElement;
    if (div && div.classList.contains('elementItemBorder'))
      div.style.border = `1px ${
        element.IsSelected ? 'solid' : 'dashed'
      } rgba(250,200,0,0.7)`;
  };

  mouseLeave = e => {
    const { dataContext } = this.props;
    var element = dataContext as CWElement;
    var div = e.currentTarget as HTMLElement;
    if (div && div.classList.contains('elementItemBorder'))
      div.style.border = `1px ${element.IsSelected ? 'solid' : 'dashed'} ${
        element.IsSelected ? 'rgba(0,0,250,0.3)' : 'rgba(0,0,250,0.1)'
      }`;
  };
  //#endregion

  //#region 复制画面绘制

  copyViews: HTMLElement[] = [];

  drawCopyView() {
    if (this.copyViews == null || this.copyViews.length == 0) {
      var stageCanvas = UIHelper.FindAncestorByClassName(
        this.rootEl,
        'StageCanvas',
      ) as HTMLElement;
      if (stageCanvas != null && this.movingItems != null) {
        var _copyAdoners = this.movingItems.map(x => (
          <EditItemView
            dataContext={x}
            courseware={this.props.courseware}
            isMainView={false}
          ></EditItemView>
        ));
        _copyAdoners.forEach(x => {
          var div = UIHelper.AddAdorner(x, stageCanvas);
          if (div) {
            div.style.opacity = '0.6';
            this.copyViews.push(div);
          }
        });
      }
    }
    if (this.copyViews.length == this.movingItems.length) {
      var i = 0;
      this.copyViews.forEach(x => {
        UIHelper.SetAdornerLocation(
          x,
          this.startRects[i].x + this.moveVector.x,
          this.startRects[i].y + this.moveVector.y,
        );
        i++;
      });
    }
  }

  clearCopyView() {
    this.copyViews?.forEach(x => {
      ReactDOM.unmountComponentAtNode(x);
      x.remove();
    });
    this.copyViews = [];
  }

  //#endregion

  public componentDidMount() {
    const { dataContext, isMainView } = this.props;
    var element = dataContext as CWElement;
    if (element && isMainView) {
      element.IsMainViewLoaded = true;
      element.MainView = this;
    }
  }

  componentDidUpdate() {
    const { dataContext, isMainView } = this.props;
    var element = dataContext as CWElement;
    if (element && isMainView) {
      element.IsMainViewLoaded = true;
      element.MainView = this;
    }
  }

  public componentWillUnmount() {
    const { dataContext, isMainView } = this.props;
    var element = dataContext as CWElement;
    if (element && isMainView) {
      element.IsMainViewLoaded = false;
    }
    LoopWork.Instance.removeMission(this);
  }

  render() {
    const { dataContext, isMainView } = this.props;
    var element = dataContext as CWElement;
    var scene = element.Scene;
    var courseware = scene?.Courseware;
    if (scene == null || courseware == null) return null;

    var template = element.Template;
    return (
      <div
        className={`elementItemBorder ${noCalcChildrenSize}`}
        style={{
          border: isMainView
            ? `1px ${element.IsSelected ? 'solid' : 'dashed'} ${
                element.IsSelected ? 'rgba(0,0,250,0.3)' : 'rgba(0,0,250,0.1)'
              }`
            : '',
          background: `${
            element.IsSelected && isMainView
              ? 'rgba(0,0,250,0.06)'
              : 'transparent'
          }`,
          position: 'relative',
          width: `${element.Width}px`,
          height: `${element.Height}px`,

          transform: `rotate(${element.Angle}deg)`,
          zIndex: element.IsSelected || element.HasDescendantsSelected ? 1 : 0,
          pointerEvents: 'none',
          ...this.props.style,
        }}
        ref={container => (this.rootEl = container)}
        onMouseEnter={this.mouseEnter}
        onMouseLeave={this.mouseLeave}
      >
        <div
          style={{
            position: 'absolute',
            margin: '0px',
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
          }}
          // onMouseDown={event => element?.CheckSelectItem(KeyHelper.checkCtrlOrMeta(event))}
          onDoubleClick={event =>
            element.ShowUniqueToolbar(isMainView ? this.rootEl : null)
          } //进入编辑模式
        >
          <div
            style={{
              position: 'absolute',
              margin: '0px',
              width: '100%',
              height: '100%',
              cursor: 'move',
              pointerEvents:
                isMainView &&
                !(element.IsLocked || element.IsDesignHide) &&
                element.CanDragMove
                  ? 'auto'
                  : 'none',
            }}
            onMouseDown={e => this.handleDragStart(e)}
          ></div>
        </div>

        <div
          style={{
            position: 'absolute',
            margin: '0px',
            width: '100%',
            height: '100%',

            opacity: `${element.Transparent / 100}`,
            transform: `scaleX(${element.FlipX ? -1 : 1}) scaleY(${
              element.FlipY ? -1 : 1
            })`,
            pointerEvents: 'none',
          }}
        >
          <EditItemViewContent {...this.props} />
        </div>
      </div>
    );
  }
}
