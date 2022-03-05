import ResizableRect from './resizable';
import React from 'react';
import CWElement from '@/modelClasses/courseDetail/cwElement';
import EditItemView from './elementItemUI';
import { element } from 'prop-types';
import { observer } from 'mobx-react';
import { takeWhile, from } from 'linq-to-typescript';
import { getNewStyle, centerToTL } from './resizable/utils';
import { Point2D } from '@/utils/Math2D';
import RUHelper from '@/redoundo/redoUndoHelper';
import CWSubstance from '@/modelClasses/courseDetail/cwSubstance';
import CombinedEditItem from '@/modelClasses/courseDetail/editItemViewModels/combinedEditItem';
import { runInAction } from 'mobx';
import LoopWork from '@/modelClasses/courseDetail/toolbox/LoopWork';
import StopWatch from '@/utils/stopWatch';
import KeyHelper from '@/utils/keyHelper';
import ArrayHelper from '@/utils/arrayHelper';

@observer
export default class ElementResizerUI extends React.PureComponent<any> {
  //#region 缩放相关

  isResizing = false;
  private resizingItems: CWElement[];
  private startResizeStates: {
    centerX: number;
    centerY: number;
    width: number;
    height: number;
    rotateAngle: number;
    flipX: boolean;
    flipY: boolean;
  }[] = [];
  private resizeType: string = '';
  private deltaWPercent: number = 0;
  private deltaHPercent: number = 0;

  handleResizeStart = e => {
    this.isResizing = true;
    var element = this.props.dataContext as CWElement;
    element?.HideUniqueToolbar();

    var selectedItems = element.Scene.SelectedItems;

    selectedItems?.forEach(element => {
      element.IsOprating = true;
    });

    this.resizingItems = CWElement.ClearDescendants(selectedItems);
    this.startResizeStates = this.resizingItems?.map(item => {
      return {
        centerX: item.AbsolutePosition.x + item.Width / 2,
        centerY: item.AbsolutePosition.y + item.Height / 2,
        width: item.Width,
        height: item.Height,
        rotateAngle: item.AbsoluteAngle,
        flipX: item.FlipX,
        flipY: item.FlipY,
      };
    });
  };
  handleUp = e => {
    this.isResizing = false;
    var element = this.props.dataContext as CWElement;
    var selectedItems = element.Scene.SelectedItems;
    selectedItems?.forEach(element => {
      element.IsOprating = false;
    });
    LoopWork.Instance.removeMission(this);
    RUHelper.Core.CreateTransaction();
    if (this.resizingItems != null) {
      for (let i = 0; i < this.resizingItems.length; i++) {
        var item = this.resizingItems[i];
        var endLeft = item.AbsoluteLeft;
        var endTop = item.AbsoluteTop;
        var endWidth = item.Width;
        var endHeight = item.Height;
        var endFlipX = item.FlipX;
        var endFlipY = item.FlipY;

        RUHelper.SetProperty(
          item,
          'AbsolutePosition',
          item.AbsolutePosition,
          new Point2D(
            this.startResizeStates[i].centerX -
              this.startResizeStates[i].width / 2,
            this.startResizeStates[i].centerY -
              this.startResizeStates[i].height / 2,
          ),
        );
        //RUHelper.SetProperty(item, "Y", endTop, this.startResizeStates[i].centerY - this.startResizeStates[i].height / 2);
        RUHelper.SetProperty(
          item,
          'Width',
          endWidth,
          this.startResizeStates[i].width,
        );
        RUHelper.SetProperty(
          item,
          'Height',
          endHeight,
          this.startResizeStates[i].height,
        );
        RUHelper.SetProperty(
          item,
          'FlipX',
          endFlipX,
          this.startResizeStates[i].flipX,
        );
        RUHelper.SetProperty(
          item,
          'FlipY',
          endFlipY,
          this.startResizeStates[i].flipY,
        );
        if (item instanceof CombinedEditItem) item.ResetBoundary();
      }
      var fathers = ArrayHelper.distinct(
        this.resizingItems.map(x => x.Father).filter(x => x != null),
      );
      fathers.forEach(x => x.ResetBoundary());
    }
    RUHelper.Core.CommitTransaction();

    this.isResizing = false;
    this.resizingItems = null;
    this.startResizeStates = null;
  };

  handleResize = (
    isShiftKey: boolean,
    type: string,
    { startRect, deltaW, deltaH },
    e,
  ) => {
    this.deltaWPercent = deltaW / startRect.width;
    this.deltaHPercent = deltaH / startRect.height;
    this.resizeType = type;
    LoopWork.Instance.setMission(this, this.ResizeRendering.bind(this));
  };
  ResizeRendering() {
    if (!this.isResizing) return;
    var element = this.props.dataContext as CWElement;
    var selectedItems = element.Scene.SelectedItems;

    runInAction(() => {
      var i = 0;
      var isShiftKey = KeyHelper.isKeyPressed('Shift');
      if (this.resizeType.length == 2) isShiftKey = !isShiftKey;
      selectedItems?.forEach(item => {
        var startState = this.startResizeStates[i];
        var itemDeltaW = startState.width * this.deltaWPercent;
        var itemDeltaH = startState.height * this.deltaHPercent;

        const ratio = isShiftKey ? startState.width / startState.height : null;
        const {
          position: { centerX, centerY },
          size: { width, height },
        } = getNewStyle(
          this.resizeType,
          startState,
          itemDeltaW,
          itemDeltaH,
          ratio,
          -Infinity,
          -Infinity,
        );
        var left = centerX - width / 2;
        var top = centerY - height / 2;

        var realwidth = Math.abs(width);
        var realheight = Math.abs(height);
        var realleft = width >= 0 ? left : left + width;
        var realtop = height >= 0 ? top : top + height;
        item.Width = realwidth;
        item.Height = realheight;
        item.AbsolutePosition = new Point2D(realleft, realtop);
        item.FlipX = width < 0 ? !startState.flipX : startState.flipX;
        item.FlipY = height < 0 ? !startState.flipY : startState.flipY;

        i++;
      });
    });
  }
  //#endregion

  //#region 旋转相关
  startAngles: number[];
  private rotatingItems: CWElement[];
  private deltaAngle = 0;
  handleRotateStart = e => {
    var element = this.props.dataContext as CWElement;
    var selectedItems = element?.Scene?.SelectedItems;
    selectedItems?.forEach(element => {
      element.IsOprating = true;
    });
    this.rotatingItems = CWElement.ClearDescendants(selectedItems);
    this.startAngles = this.rotatingItems?.map(item => item.Angle);
    this.deltaAngle = 0;
    LoopWork.Instance.setMission(this, this.RotateRendering.bind(this));
  };
  handleRotateEnd = e => {
    var element = this.props.dataContext as CWElement;
    var selectedItems = element?.Scene?.SelectedItems;
    selectedItems?.forEach(element => {
      element.IsOprating = false;
    });
    LoopWork.Instance.removeMission(this);
    RUHelper.Core.CreateTransaction();
    if (this.rotatingItems != null) {
      if (this.startAngles) {
        for (let i = 0; i < this.startAngles.length; i++) {
          RUHelper.SetProperty(
            this.rotatingItems[i],
            'AbsoluteAngle',
            this.rotatingItems[i].AbsoluteAngle,
            this.startAngles[i],
            true,
          );
        }
      }

      var fathers = ArrayHelper.distinct(
        this.rotatingItems.map(x => x.Father).filter(x => x != null),
      );
      fathers.forEach(x => x.ResetBoundary());
    }

    RUHelper.Core.CommitTransaction();
    this.startAngles = null;
    this.rotatingItems = null;
  };
  handleRotate = (deltaAngle, e) => {
    this.deltaAngle = deltaAngle;
  };

  RotateRendering() {
    var i = 0;
    if (
      this.startAngles &&
      this.startAngles.length == this.rotatingItems.length
    )
      runInAction(() => {
        this.rotatingItems?.forEach(element => {
          element.Angle = this.startAngles[i++] + this.deltaAngle;
        });
      });
  }
  //#endregion

  componentWillUnmount() {
    LoopWork.Instance.removeMission(this);
  }

  render() {
    var element = this.props.dataContext as CWElement;
    const { courseware } = this.props;
    return (
      <ResizableRect
        {...{
          dataContext: element,
          stageScale: courseware.StageScale,
          top: element.AbsoluteTop,
          left: element.AbsoluteLeft,
          width: element.Width,
          height: element.Height,
          rotateAngle: element.AbsoluteAngle,
          minWidth: -Infinity,
          minHeight: -Infinity,
          zoomable: !(element.IsLocked || element.IsDesignHide)
            ? 'n, w, s, e, nw, ne, se, sw'
            : '',
          rotatable: !(element.IsLocked || element.IsDesignHide),
          dragable: false,
          onRotateStart: this.handleRotateStart,
          onRotate: this.handleRotate,
          onRotateEnd: this.handleRotateEnd,
          onResizeStart: this.handleResizeStart,
          onResize: this.handleResize,
          onResizeEnd: this.handleUp,
          // onDragStart: this.handleDragStart,
          // onDrag: this.handleDrag,
          // onDragEnd: this.handleDragEnd,
        }}
      />
    );
  }
}
