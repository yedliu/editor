import React from 'react';
import StageCanvas from './stageCanvasUI';
import { observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import FreeScrollbar from '@/components/controls/scrollviewer';
import CWSubstance from '@/modelClasses/courseDetail/cwSubstance';
import {
  Rect2D,
  Point2D,
  GeometryHelper,
  Matrix2D,
  noCalcSize,
} from '@/utils/Math2D';
import CWElement from '@/modelClasses/courseDetail/cwElement';
import { from } from 'linq-to-typescript';
import CourseCommander from '@/modelClasses/courseDetail/courseCommander';
import LoopWork from '@/modelClasses/courseDetail/toolbox/LoopWork';
import KeyHelper from '@/utils/keyHelper';
import FreeScrollViewer from '@/components/controls/freeScrollViewer';
import StopWatch from '@/utils/stopWatch';

@inject('courseware', 'commander')
@observer
class Stage extends React.Component<any> {
  scrollview: FreeScrollViewer;
  selectAreaLayer: HTMLDivElement;

  @observable
  dragingSelectArea: boolean = false;
  @observable
  dragRect: Rect2D = Rect2D.Empty;

  startSelectedItems = null;
  startPoint: Point2D = Point2D.Zero;
  newSelectItems: CWElement[] = [];
  unSelectItems: CWElement[] = [];

  constructor(props: any) {
    super(props);
  }

  handlScrollView = sv => {
    const { commander: _commander } = this.props;
    var commander = _commander as CourseCommander;
    if (commander) commander.StageUIRoot = sv;
    this.scrollview = sv;
    this.resetStage();
  };

  onDragSelect = (e: React.MouseEvent, isScrollViewBg: boolean = false) => {
    var target = e.target as HTMLElement;
    if (
      e.button == 0 &&
      target &&
      this.selectAreaLayer &&
      (isScrollViewBg || target.classList.contains('stageBg'))
    ) {
      this.dragingSelectArea = true;
      const { clientX, clientY } = e;
      this.startPoint = GeometryHelper.GetPosition(
        this.selectAreaLayer,
        new Point2D(clientX, clientY),
      );
      this.dragRect = new Rect2D(this.startPoint.x, this.startPoint.y, 0, 0);

      const { courseware } = this.props;
      const { SelectedPage } = courseware as CWSubstance;

      if (!KeyHelper.checkCtrlOrMeta(e)) SelectedPage?.DeselectAll();

      this.startSelectedItems = SelectedPage?.SelectedItems;

      document.addEventListener('mousemove', this.dragAreaMouseMove, {
        passive: false,
        capture: true,
        once: false,
      });
      document.addEventListener('mouseup', this.dragAreaMouseUp, {
        passive: false,
        capture: true,
        once: true,
      });
    }
  };

  dragAreaMouseMove = e => {
    if (!this.dragingSelectArea) return; // patch: fix windows press win key during mouseup issue
    //e.stopImmediatePropagation();
    const { clientX, clientY } = e;
    var endPoint = GeometryHelper.GetPosition(
      this.selectAreaLayer,
      new Point2D(clientX, clientY),
    );
    var leftTop = new Point2D(
      Math.min(endPoint.x, this.startPoint.x),
      Math.min(endPoint.y, this.startPoint.y),
    );
    var rightbottom = new Point2D(
      Math.max(endPoint.x, this.startPoint.x),
      Math.max(endPoint.y, this.startPoint.y),
    );
    this.dragRect = new Rect2D(
      leftTop.x,
      leftTop.y,
      rightbottom.x - leftTop.x,
      rightbottom.y - leftTop.y,
    );
  };

  dragAreaMouseUp = e => {
    document.removeEventListener('mousemove', this.dragAreaMouseMove);
    document.removeEventListener('mouseup', this.dragAreaMouseUp);
    if (!this.dragingSelectArea) return;

    var itemsInRect = this.getItemsInRect(this.dragRect);

    const { courseware } = this.props;
    const { SelectedPage } = courseware as CWSubstance;
    this.newSelectItems = [];
    this.unSelectItems = [];
    SelectedPage?.TotalEditItemList?.forEach(item => {
      var hasAncestorSelected =
        item.HasAncestorSelected ||
        this.newSelectItems.find(x => x.IsAncestorOf(item)) != null;
      if (itemsInRect.includes(item)) {
        if (!item.IsSelected && !item.IsLocked && !item.IsDesignHide) {
          if (!hasAncestorSelected && !item.HasAncestorSolidified) {
            //item.IsSelected = true;
            this.newSelectItems.push(item);
          }
        } else if (hasAncestorSelected) {
          //item.IsSelected = false;
          if (item.IsSelected) this.unSelectItems.push(item);
          else if (this.newSelectItems.includes(item))
            this.newSelectItems.splice(this.newSelectItems.indexOf(item), 1);
        }
      } else if (
        this.newSelectItems.includes(item) &&
        !this.startSelectedItems.includes(item)
      ) {
        //item.IsSelected = false;
        this.newSelectItems.splice(this.newSelectItems.indexOf(item), 1);
      }
    });

    this.dragingSelectArea = false;
    this.dragRect = Rect2D.Empty;
  };

  onScale = (e: React.WheelEvent) => {
    const { courseware: _cw } = this.props;
    var courseware: CWSubstance = _cw;
    var preScale = courseware.StageScale;
    courseware.StageScale = Math.min(
      5,
      Math.max(0.1, courseware.StageScale * (1 - e.deltaY / 1000)),
    );
    // e.preventDefault();
    e.stopPropagation();
    return courseware.StageScale / preScale;
  };

  getItemsInRect(rect: Rect2D): CWElement[] {
    const { courseware } = this.props;
    const { SelectedPage } = courseware as CWSubstance;

    var _rect = new Rect2D(
      rect.x / courseware.StageScale,
      rect.y / courseware.StageScale,
      rect.width / courseware.StageScale,
      rect.height / courseware.StageScale,
    );

    var totalElements = SelectedPage?.TotalEditItemList?.filter(
      x => !x.IsLocked && !x.IsDesignHide,
    );
    var result = totalElements?.filter(item => {
      var m = new Matrix2D();
      m.RotateAt(item.AbsoluteAngle, item.Width / 2, item.Height / 2);
      m.Translate(item.AbsoluteLeft, item.AbsoluteTop);
      var itemBound = m.TransformRect(
        new Rect2D(0, 0, item.Width, item.Height),
      );
      if (_rect.contains(itemBound)) {
        return true;
      }
      return false;
    });

    return result;
  }

  resetStage() {
    if (this.scrollview) {
      const { courseware: _cw } = this.props;
      var courseware: CWSubstance = _cw;
      var stageSize = courseware.StageSize;
      var targetScale = Math.min(
        (this.scrollview.ViewportWidth - 60) / stageSize.x,
        (this.scrollview.ViewportHeight - 60) / stageSize.y,
      );
      var scaleStageSize = {
        x: stageSize.x * targetScale,
        y: stageSize.y * targetScale,
      };
      this.scrollview.ZeroPointX =
        (this.scrollview.ViewportWidth - scaleStageSize.x) / 2;
      this.scrollview.ZeroPointY =
        (this.scrollview.ViewportHeight - scaleStageSize.y) / 2;
      courseware.StageScale = targetScale;
    }
  }

  public componentDidMount() {}

  public componentWillUnmount() {}

  componentDidUpdate() {
    if (
      !this.dragingSelectArea &&
      ((this.newSelectItems && this.newSelectItems.length > 0) ||
        (this.unSelectItems && this.unSelectItems.length > 0))
    ) {
      for (var i = 0; i < this.newSelectItems?.length || 0; i++)
        this.newSelectItems[i].IsSelected = true;
      for (var i = 0; i < this.unSelectItems?.length || 0; i++)
        this.unSelectItems[i].IsSelected = false;
      this.newSelectItems = [];
      this.unSelectItems = [];
    }
  }

  render() {
    const { courseware } = this.props;
    const { SelectedPage } = courseware as CWSubstance;
    var commander = this.props.commander as CourseCommander;
    if (!courseware || courseware.isLoading) return <div>正在加载</div>;
    return (
      <FreeScrollViewer
        className="stageScrollViewer"
        ref={this.handlScrollView}
        onScale={this.onScale.bind(this)}
        onBgMouseDown={this.onDragSelect.bind(this)}
        onResetView={this.resetStage.bind(this)}
      >
        <div className="stageBg">
          <StageCanvas PageData={SelectedPage} isMainView={true}></StageCanvas>

          <div
            className="selectAreaLayer"
            style={{
              position: 'absolute',
              pointerEvents: 'none',
            }}
            ref={div => (this.selectAreaLayer = div)}
          >
            {this.dragingSelectArea ? (
              <div
                className={`selectArea ${noCalcSize}`}
                style={{
                  position: 'absolute',
                  left: `${this.dragRect.x}px`,
                  top: `${this.dragRect.y}px`,
                  width: `${this.dragRect.width}px`,
                  height: `${this.dragRect.height}px`,
                  background: '#2222E42B',
                  border: '2px dashed #2222E45B',
                  //display: `${this.dragingSelectArea ? 'inline' : 'none'}`,
                }}
              ></div>
            ) : null}
          </div>
        </div>
      </FreeScrollViewer>
    );
  }
}

export default Stage;
