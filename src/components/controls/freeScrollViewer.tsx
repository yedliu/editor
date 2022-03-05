import { PureComponent } from 'react';
import React from 'react';
import ReactDOM from 'react-dom';
import { observer } from 'mobx-react';
import { observable, reaction, runInAction } from 'mobx';
import KeyHelper from '@/utils/keyHelper';
import {
  Rect2D,
  GeometryHelper,
  Point2D,
  Vector2D,
  noCalcSize,
} from '@/utils/Math2D';
import { Rect } from 'flexlayout-react';
import UIHelper from '@/utils/uiHelper';
import MouseHelper from '@/utils/mouseHelper';
import LoopWork from '@/modelClasses/courseDetail/toolbox/LoopWork';
import StopWatch from '@/utils/stopWatch';
@observer
export default class FreeScrollViewer extends PureComponent<any> {
  constructor(props) {
    super(props);
  }

  rootEl: HTMLElement;
  detailEl: HTMLElement;

  @observable
  private _scrollRect: DOMRect;

  public get scrollRect(): DOMRect {
    return this._scrollRect;
  }

  public set scrollRect(v: DOMRect) {
    this._scrollRect = v;
  }

  public getScrollRect(el: HTMLElement) {
    this.scrollRect = el.getBoundingClientRect();
  }

  @observable
  private _ZeroPointX: number = 0;
  public get ZeroPointX(): number {
    return this._ZeroPointX;
  }
  public set ZeroPointX(v: number) {
    if (this._ZeroPointX != v) this._ZeroPointX = v;
  }

  @observable
  private _ZeroPointY: number = 0;
  public get ZeroPointY(): number {
    return this._ZeroPointY;
  }
  public set ZeroPointY(v: number) {
    if (this._ZeroPointY != v) this._ZeroPointY = v;
  }

  @observable
  private _ViewportWidth: number;
  public get ViewportWidth(): number {
    return this._ViewportWidth;
  }
  public set ViewportWidth(v: number) {
    if (this._ViewportWidth != v) this._ViewportWidth = v;
  }

  @observable
  private _ViewportHeight: number;
  public get ViewportHeight(): number {
    return this._ViewportHeight;
  }
  public set ViewportHeight(v: number) {
    if (this._ViewportHeight != v) this._ViewportHeight = v;
  }

  @observable
  private _ContentWidth: number;
  public get ContentWidth(): number {
    return this._ContentWidth;
  }
  public set ContentWidth(v: number) {
    if (this._ContentWidth != v) this._ContentWidth = v;
  }

  @observable
  private _ContentHeight: number;
  public get ContentHeight(): number {
    return this._ContentHeight;
  }
  public set ContentHeight(v: number) {
    if (this._ContentHeight != v) this._ContentHeight = v;
  }

  @observable
  private _ContentLeft: number;
  public get ContentLeft(): number {
    return this._ContentLeft;
  }
  public set ContentLeft(v: number) {
    this._ContentLeft = v;
  }

  @observable
  private _ContentTop: number;
  public get ContentTop(): number {
    return this._ContentTop;
  }
  public set ContentTop(v: number) {
    this._ContentTop = v;
  }

  public get ScrollOffsetX() {
    return -Math.min(this.ZeroPointX, this.ContentLeft, 0);
  }

  public get ScrollOffsetY() {
    return -Math.min(this.ZeroPointY, this.ContentTop, 0);
  }

  public get ScrollWidth() {
    var left = Math.min(this.ZeroPointX, this.ContentLeft, 0);
    var right = Math.max(
      this.ZeroPointX,
      this.ContentLeft + this.ContentWidth,
      this.ViewportWidth,
    );
    return right - left;
  }

  public get ScrollHeight() {
    var top = Math.min(this.ZeroPointY, this.ContentTop, 0);
    var bottom = Math.max(
      this.ZeroPointY,
      this.ContentTop + this.ContentHeight,
      this.ViewportHeight,
    );
    return bottom - top;
  }

  get isFnBtnPressed() {
    return (
      KeyHelper.isKeyPressed(' ') ||
      MouseHelper.isBtnPressed(2) ||
      KeyHelper.PressedKeys.includes('Control') ||
      KeyHelper.PressedKeys.includes('Meta')
    );
  }

  get isInvPressed() {
    return KeyHelper.isKeyPressed(' ') || MouseHelper.isBtnPressed(2);
  }

  onWheel(e: React.WheelEvent) {
    if (this.isFnBtnPressed) {
      var scrollViewRect = GeometryHelper.GetBounds(this.rootEl);
      var mousePos = new Point2D(
        e.clientX - scrollViewRect.x,
        e.clientY - scrollViewRect.y,
      );
      var zeroPos = new Point2D(this.ZeroPointX, this.ZeroPointY);
      var scale = 1 - this.props.onScale?.(e);
      var move = new Vector2D(
        (mousePos.x - zeroPos.x) * scale,
        (mousePos.y - zeroPos.y) * scale,
      );
      this.ZeroPointX += move.x;
      this.ZeroPointY += move.y;
      this.didSomeThingbeforeMouseUp = true;
    } else if (e.shiftKey) this.ZeroPointX = this.ZeroPointX - e.deltaY;
    else this.ZeroPointY = this.ZeroPointY - e.deltaY;
  }

  private draggingScroll = false;
  private didSomeThingbeforeMouseUp = false;
  onBgMouseDown(e: React.MouseEvent) {
    this.didSomeThingbeforeMouseUp = false;
    if (
      !this.draggingScroll &&
      (this.isInvPressed || e.button == 1 || e.button == 2)
    ) {
      var prePos = new Point2D(e.clientX, e.clientY);
      this.draggingScroll = true;
      var mousemove = (e: MouseEvent) => {
        var currentPos = new Point2D(e.clientX, e.clientY);
        var move = currentPos.minus(prePos);
        this.ZeroPointX += move.x;
        this.ZeroPointY += move.y;
        this.didSomeThingbeforeMouseUp =
          this.didSomeThingbeforeMouseUp || !currentPos.equals(prePos);
        prePos = currentPos;
      };
      var mouseup = e => {
        this.draggingScroll = false;
        document.removeEventListener('mousemove', mousemove);
        document.removeEventListener('mouseup', mouseup);
        if (!this.didSomeThingbeforeMouseUp)
          this.props.onBgMouseUp?.(e, e.target == this.rootEl);
      };
      //e.preventDefault();
      e.stopPropagation();
      document.addEventListener('mousemove', mousemove);
      document.addEventListener('mouseup', mouseup);
    } else this.props.onBgMouseDown?.(e, e.target == this.rootEl);
  }

  onBgMouseUp(e: React.MouseEvent) {
    if (!this.draggingScroll && !this.didSomeThingbeforeMouseUp) {
      this.props.onBgMouseUp?.(e, e.target == this.rootEl);
    }
  }

  private spaceUpTime: Date = new Date();
  onKeyUp(e: React.KeyboardEvent) {
    if (e.key == ' ') {
      //双击空格重置舞台位置
      var _time = new Date();
      if (_time.getTime() - this.spaceUpTime.getTime() < 300)
        this.props.onResetView?.();

      this.spaceUpTime = _time;
    }
  }

  onVBarMouseDown(e: React.MouseEvent) {
    var preY = e.clientY;
    var handler = e.currentTarget as HTMLElement;
    var track = UIHelper.FindAncestorByClassName(
      handler,
      'scrollbar-vertical-track',
    );
    if (track) {
      var mousemove = (e: MouseEvent) => {
        var handlerHeight = handler.clientHeight;
        var trackHeight = track.clientHeight;
        var currentY = e.clientY;
        if (
          handlerHeight &&
          trackHeight &&
          trackHeight > handlerHeight &&
          this.ScrollHeight > this.ViewportHeight
        ) {
          var moveY_percent = (currentY - preY) / (trackHeight - handlerHeight);
          this.ZeroPointY -=
            moveY_percent * (this.ScrollHeight - this.ViewportHeight);
          preY = currentY;
        } else {
          document.removeEventListener('mousemove', mousemove);
          document.removeEventListener('mouseup', mouseup);
        }
      };
      var mouseup = e => {
        document.removeEventListener('mousemove', mousemove);
        document.removeEventListener('mouseup', mouseup);
      };
      document.addEventListener('mousemove', mousemove);
      document.addEventListener('mouseup', mouseup);
    }
  }

  onHBarMouseDown(e: React.MouseEvent) {
    var preX = e.clientX;
    var handler = e.currentTarget as HTMLElement;
    var track = UIHelper.FindAncestorByClassName(
      handler,
      'scrollbar-horizontal-track',
    );
    if (track) {
      var mousemove = (e: MouseEvent) => {
        var handlerWidth = handler.clientWidth;
        var trackWidth = track.clientWidth;
        var currentX = e.clientX;
        if (
          handlerWidth &&
          trackWidth &&
          trackWidth > handlerWidth &&
          this.ScrollWidth > this.ViewportWidth
        ) {
          var moveX_percent = (currentX - preX) / (trackWidth - handlerWidth);
          this.ZeroPointX -=
            moveX_percent * (this.ScrollWidth - this.ViewportWidth);
          preX = currentX;
        } else {
          document.removeEventListener('mousemove', mousemove);
          document.removeEventListener('mouseup', mouseup);
        }
      };
      var mouseup = e => {
        document.removeEventListener('mousemove', mousemove);
        document.removeEventListener('mouseup', mouseup);
      };
      document.addEventListener('mousemove', mousemove);
      document.addEventListener('mouseup', mouseup);
    }
  }

  collectInfo() {
    if (this.rootEl && this.detailEl) {
      var rootBoundary = GeometryHelper.GetBounds(this.rootEl);
      var contentBoundary = GeometryHelper.GetBoundsWithChildren(this.detailEl);
      this.ViewportWidth = this.rootEl.offsetWidth;
      this.ViewportHeight = this.rootEl.offsetHeight;
      if (!contentBoundary.isEmpty) {
        this.ContentLeft = contentBoundary.left - rootBoundary.left;
        this.ContentTop = contentBoundary.top - rootBoundary.top;
        this.ContentWidth = contentBoundary.width;
        this.ContentHeight = contentBoundary.height;
      } else {
        this.ContentLeft = 0;
        this.ContentTop = 0;
        this.ContentWidth = rootBoundary.width;
        this.ContentHeight = rootBoundary.height;
      }
    }
  }
  public componentDidMount() {
    this.collectInfo();
    // LoopWork.Instance.setMission(this, this.collectInfo.bind(this));
  }

  componentDidUpdate() {
    this.collectInfo();
  }

  public componentWillUnmount() {
    LoopWork.Instance.removeMission(this);
  }

  render() {
    var vBarHeight = this.ViewportHeight / this.ScrollHeight;
    var vBarTop =
      (this.ScrollOffsetY / (this.ScrollHeight - this.ViewportHeight)) *
      (1 - vBarHeight);

    var hBarWidth = this.ViewportWidth / this.ScrollWidth;
    var hBarLeft =
      (this.ScrollOffsetX / (this.ScrollWidth - this.ViewportWidth)) *
      (1 - hBarWidth);

    return (
      <div
        style={{
          overflow: 'hidden',
          position: 'relative',
          width: '100%',
          height: '100%',
          ...this.props.style,
        }}
        tabIndex={-1}
        ref={v => (this.rootEl = v)}
        onWheel={this.onWheel.bind(this)}
        onMouseDownCapture={this.onBgMouseDown.bind(this)}
        onMouseUp={this.onBgMouseUp.bind(this)}
        onKeyUp={this.onKeyUp.bind(this)}
        className={`FreeScrollView ${this.props.className}`}
      >
        <div
          className={`detaildiv ${noCalcSize}`}
          ref={v => (this.detailEl = v)}
          style={{
            position: 'absolute',
            // left: `${this.ZeroPointX}px`,
            // top: `${this.ZeroPointY}px`,
            transform: `translate(${this.ZeroPointX}px, ${this.ZeroPointY}px)`,
            width: '0px',
            height: '0px',
          }}
        >
          {this.props.children}
        </div>
        {this.ScrollHeight > this.ViewportHeight ? (
          <div className="scrollbar-vertical-track">
            <div
              className="scrollbar-vertical-handler"
              style={{
                height: `${100 * vBarHeight}%`,
                top: `${100 * vBarTop}%`,
              }}
              onMouseDownCapture={this.onVBarMouseDown.bind(this)}
            ></div>
          </div>
        ) : null}
        {this.ScrollWidth > this.ViewportWidth ? (
          <div className="scrollbar-horizontal-track">
            <div
              className="scrollbar-horizontal-handler"
              style={{
                width: `${100 * hBarWidth}%`,
                left: `${100 * hBarLeft}%`,
              }}
              onMouseDownCapture={this.onHBarMouseDown.bind(this)}
            ></div>
          </div>
        ) : null}
      </div>
    );
  }
}
