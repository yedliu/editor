import InvokeHandler from './InvokeHandler';
import { observable } from 'mobx';
import { Point2D, Vector2D, Rect2D, noCalcChildrenSize } from '@/utils/Math2D';
import InvokableBase from '../InvokableBase';
import React, { PureComponent } from 'react';
import { observer } from 'mobx-react';
import IdHelper from '@/utils/idHelper';

@observer
export class LogicLinkLineView extends PureComponent<any> {
  render() {
    const { link } = this.props;

    var gRect = link.GetGeometryRect();
    var gRectHeight = Math.max(1, gRect.height);
    var viewBox = `0,0,${gRect.width},${gRectHeight}`;
    return (
      <div
        className={`logicLinkLine ${noCalcChildrenSize}`}
        style={{
          position: 'absolute',
          // left: `${gRect.x}px`,
          // top: `${gRect.y}px`,
          transform: `translate3d(${gRect.x}px, ${gRect.y}px, 0)`,
          width: `${gRect.width}px`,
          height: `${gRectHeight}px`,
          pointerEvents: 'none',
        }}
      >
        <svg
          style={{
            position: 'absolute',
            left: '0px',
            top: '0px',
            cursor: 'pointer',
            pointerEvents: 'none',
          }}
          width={gRect.width}
          height={gRectHeight}
          viewBox={viewBox}
          preserveAspectRatio="xMinYMin meet"
        >
          <defs pointerEvents="none">
            <filter id="f1" x="-5%" y="-5%" width="110%" height="110%">
              <feOffset result="offOut" in="SourceGraphic" dx="0" dy="0" />
              <feGaussianBlur result="blurOut" in="offOut" stdDeviation="1.5" />
              <feBlend in="SourceGraphic" in2="blurOut" mode="normal" />
            </filter>
          </defs>
          <path
            stroke="transparent"
            d={link.PathData}
            strokeWidth={
              link.StartHandler?.VisualLogicDesign
                ? 12 / link.StartHandler.VisualLogicDesign.Scale
                : 12
            }
            fill="transparent"
            pointerEvents={link.IsLinking ? 'none' : 'stroke'}
            onMouseEnter={e => {
              var target = e.target as SVGPathElement;
              var realline = target.parentElement.children[2];
              if (realline) realline.setAttribute('filter', 'url(#f1)');
              var orderIndexDiv = target.parentElement.parentElement
                ?.children[1] as HTMLElement;
              if (orderIndexDiv) orderIndexDiv.style.display = 'block';
            }}
            onMouseLeave={e => {
              var target = e.target as SVGPathElement;
              var realline = target.parentElement.children[2];
              if (realline) realline.setAttribute('filter', '');
              var orderIndexDiv = target.parentElement.parentElement
                ?.children[1] as HTMLElement;
              if (orderIndexDiv) orderIndexDiv.style.display = 'none';
            }}
            onDoubleClick={e => link.Delete()}
          />
          <path
            className="realline"
            stroke={link.StartHandler.LineColor || 'black'}
            d={link.PathData}
            strokeWidth="1"
            fill="transparent"
            pointerEvents="none"
          ></path>
        </svg>

        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            pointerEvents: 'none',
            textAlign: 'center',
            display: 'none',
            lineHeight: `${gRectHeight}px`,
            fontSize: '18px',
            color: '#772244',
            transform: 'translate(9px,9px)',
          }}
        >
          {link.ShowOrderIndex}
        </div>
      </div>
    );
  }
}

export default class LogicLinkLine {
  @observable
  private _StartHandler: InvokeHandler;
  public get StartHandler(): InvokeHandler {
    return this._StartHandler;
  }
  public set StartHandler(v: InvokeHandler) {
    this._StartHandler = v;
  }

  /**
   * 目标Id
   */
  @observable
  private _TargetId: string;
  public get TargetId(): string {
    return this._TargetId;
  }
  public set TargetId(v: string) {
    this._TargetId = v;
  }

  public get ShowOrderIndex() {
    if (this.StartHandler && this.TargetId) {
      var ids = this.StartHandler.GetHandlerValue<string>();
      var idList = IdHelper.ToIdList(ids);
      if (idList && idList.length > 1) {
        var index = idList.indexOf(this.TargetId);
        if (index != -1) return index + 1;
      }
    }
    return null;
  }

  /**
   * 是否正在连接
   */
  @observable
  private _IsLinking: boolean;
  public get IsLinking(): boolean {
    return this._IsLinking;
  }
  public set IsLinking(v: boolean) {
    this._IsLinking = v;
  }

  /**
   * 正在连接时的鼠标位置
   */
  @observable
  private _LinkingPosition: Point2D;
  public get LinkingPosition(): Point2D {
    return this._LinkingPosition;
  }
  public set LinkingPosition(v: Point2D) {
    if (
      this._LinkingPosition == null ||
      this._LinkingPosition.minus(v || Point2D.Zero).length > 2
    ) {
      this._LinkingPosition = v;
    }
  }

  public get PathData(): string {
    return this.GetGeometryData();
  }

  Delete() {
    if (this.TargetId != null && this.TargetId != '')
      this.StartHandler?.RemoveTargetId(this.TargetId);
  }

  public GetEndAccepter(): InvokableBase {
    if (
      this.StartHandler != null &&
      this.StartHandler.VisualLogicDesign != null
    ) {
      var targetId = this.TargetId;
      if (this.TargetId != null && this.TargetId != '') {
        var targetInv = this.StartHandler.VisualLogicDesign?.AvailableLinkTargets?.find(
          x => x.Id == targetId,
        );
        if (targetInv != null) return targetInv;
      }
    }
    return null;
  }

  GetGeomertyKeyPoints(): Point2D[] {
    if (this.StartHandler != null) {
      var startPoint = this.StartHandler?.HandlerPosition;
      if (startPoint == null || (startPoint.x == 0 && startPoint.y == 0))
        return null;
      var endPoint = this.LinkingPosition;
      if (!this.IsLinking) {
        var accepter = this.GetEndAccepter();
        if (accepter != null && accepter.AccepterPosition != null) {
          endPoint = new Vector2D(-3, 0).translatePoint(
            accepter.AccepterPosition,
          );
        } else return null;
      }
      var xdistance = endPoint.x - startPoint.x;
      var ydistance = Math.abs(endPoint.y - startPoint.y);
      var arrowSize = 5;

      var helpPointDisX = Math.abs(xdistance / 3);
      helpPointDisX +=
        (Math.min(1.0, Math.abs(xdistance) / 50.0) * ydistance) / 2;
      helpPointDisX = Math.max(ydistance / 2, helpPointDisX);
      var helpPointDisY = 0.0;
      if (xdistance < 0)
        helpPointDisY =
          (Math.sign(endPoint.y - startPoint.y) *
            Math.min(1.0, Math.abs(xdistance) / 50.0) *
            ydistance) /
          4;
      return [
        new Point2D(startPoint.x, startPoint.y),
        new Point2D(startPoint.x + helpPointDisX, startPoint.y + helpPointDisY),
        new Point2D(endPoint.x - helpPointDisX, endPoint.y - helpPointDisY),
        new Point2D(endPoint.x, endPoint.y),
        new Point2D(endPoint.x - arrowSize, endPoint.y - arrowSize),
        new Point2D(endPoint.x, endPoint.y),
        new Point2D(endPoint.x - arrowSize, endPoint.y + arrowSize),
      ];
    }
    return [];
  }

  GetGeometryData(): string {
    var keyPoints = this.GetGeomertyKeyPoints();
    if (keyPoints && keyPoints.length > 0) {
      var gRect = this.GetGeometryRect();
      keyPoints = keyPoints.map(x => new Point2D(x.x - gRect.x, x.y - gRect.y));
      return (
        `M${keyPoints[0].toString()} C${keyPoints[1].toString()}` +
        ` ${keyPoints[2].toString()}` +
        ` ${keyPoints[3].toString()} M${keyPoints[4].toString()}` +
        ` L${keyPoints[5].toString()} L${keyPoints[6].toString()}`
      );
      // return (
      //   `M${keyPoints[0].toString()}`+

      //   ` ${keyPoints[3].toString()} M${keyPoints[4].toString()}` +
      //   ` L${keyPoints[5].toString()} L${keyPoints[6].toString()}`
      // );
    }
    return null;
  }

  GetGeometryRect(): Rect2D {
    var points = this.GetGeomertyKeyPoints();
    if (points != null && points.length > 0) {
      var left = Math.min(...points.map(x => x.x));
      var top = Math.min(...points.map(x => x.y));
      var right = Math.max(...points.map(x => x.x));
      var bottom = Math.max(...points.map(x => x.y));

      return new Rect2D(left, top, right - left, bottom - top);
    }
    return Rect2D.Empty;
  }
}
