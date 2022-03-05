import { Expose } from '@/class-transformer';
import IPropUndoable from '@/redoundo/IPropUndoable';
import RUHelper from '@/redoundo/redoUndoHelper';
import ILogicDesignItem from './InvokeDesign/logicViewModels/ILogicDesignItem';
import LogicDesign from './logicDesign';
import { observable } from 'mobx';
import { Point2D, GeometryHelper, Rect2D } from '@/utils/Math2D';
import {
  FuncDataOutput,
  FuncDataInput,
} from './InvokeDesign/logicViewModels/Invokables/InvFunc/FuncInvokeProxy';
import InvokeHandler, { InvokeHandlerList } from './InvokeDesign/InvokeHandler';
import { from } from 'linq-to-typescript';
import InvokableBase from './InvokableBase';
import UIHelper from '@/utils/uiHelper';
import React from 'react';

export enum DataSourceType {
  Trigger,
  Invoke,
  Custom,
  Multi,
}

export class DataPointInfo {
  private _DataSourceType: DataSourceType = DataSourceType.Trigger;
  @Expose()
  public get DataSourceType(): DataSourceType {
    return this._DataSourceType;
  }
  public set DataSourceType(v: DataSourceType) {
    this._DataSourceType = v;
  }

  private _DataSourceId: string = null;
  @Expose()
  public get DataSourceId(): string {
    return this._DataSourceId;
  }
  public set DataSourceId(v: string) {
    this._DataSourceId = v;
  }

  private _TriggerName: string = null;
  @Expose()
  public get TriggerName(): string {
    return this._TriggerName;
  }
  public set TriggerName(v: string) {
    this._TriggerName = v;
  }

  private _InvokeHandlerName: string = null;
  @Expose()
  public get InvokeHandlerName(): string {
    return this._InvokeHandlerName;
  }
  public set InvokeHandlerName(v: string) {
    this._InvokeHandlerName = v;
  }

  private _InvokeHandlerIndex: number = null;
  @Expose()
  public get InvokeHandlerIndex(): number {
    return this._InvokeHandlerIndex;
  }
  public set InvokeHandlerIndex(v: number) {
    this._InvokeHandlerIndex = v;
  }

  private _DataIndex: number = null;
  @Expose()
  public get DataIndex(): number {
    return this._DataIndex;
  }
  public set DataIndex(v: number) {
    this._DataIndex = v;
  }

  private _CustomValue: string = null;
  @Expose()
  public get CustomValue(): string {
    return this._CustomValue;
  }
  public set CustomValue(v: string) {
    this._CustomValue = v;
  }

  private _ValueType: number = 0;
  @Expose()
  public get ValueType(): number {
    // if (this.DataSourceType != DataSourceType.Custom) return null;
    // return this._ValueType;
    return null;
  }
  public set ValueType(v: number) {
    this._ValueType = v == null ? 0 : v;
  }

  private _SubFromInfos: DataPointInfo[];
  @Expose()
  public get SubFromInfos(): DataPointInfo[] {
    return this._SubFromInfos;
  }
  public set SubFromInfos(v: DataPointInfo[]) {
    this._SubFromInfos = v;
  }
}

export class DataPoint implements IPropUndoable {
  //#region RedoUndo判断

  get CanRecordRedoUndo(): boolean {
    return (
      this.Owner != null &&
      this.VisualLogicDesign != null &&
      this.VisualLogicDesign.Scene != null &&
      !RUHelper.Core.ActionIsExecuting
    );
  }
  //#endregion

  private _Owner: ILogicDesignItem;
  public get Owner(): ILogicDesignItem {
    return this._Owner;
  }
  public set Owner(v: ILogicDesignItem) {
    this._Owner = v;
  }

  public get VisualLogicDesign(): LogicDesign {
    return this.Owner?.LogicDesign;
  }

  /**
   * 显示的名称
   */
  @observable
  private _DisplayName: string;
  public get DisplayName(): string {
    return this._DisplayName;
  }
  public set DisplayName(v: string) {
    this._DisplayName = v;
  }

  public get HasLinked(): boolean {
    return false;
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

  /** 正在连接时的鼠标位置 */
  @observable
  private _LinkingPosition: Point2D = Point2D.Zero;
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

  /** 当前点所在的坐标 */
  @observable
  private _PointPosition: Point2D = Point2D.Zero;
  public get PointPosition(): Point2D {
    return this._PointPosition;
  }
  public set PointPosition(v: Point2D) {
    if (
      this._PointPosition == null ||
      this._PointPosition.minus(v || Point2D.Zero).length > 2
    ) {
      this._PointPosition = v;
    }
  }

  public get PathData(): string {
    return this.GetGeometryData();
  }

  DeleteLink() {}
  GetGeometryData(): string {
    return '';
  }
  GetGeometryRect() {
    return Rect2D.Empty;
  }
  public GetGeometryKeyPointsByPoints(
    startPoint: Point2D,
    endPoint: Point2D,
  ): Point2D[] {
    if (
      (startPoint.x == 0 && startPoint.y == 0) ||
      (endPoint.x == 0 && endPoint.y == 0)
    )
      return [];
    var xdistance = endPoint.x - startPoint.x;
    var ydistance = Math.abs(endPoint.y - startPoint.y);
    var arrowSize = 4;

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
      new Point2D(endPoint.x + arrowSize, endPoint.y - arrowSize * 1.1),
      new Point2D(endPoint.x - arrowSize * 0.65, endPoint.y),
      new Point2D(endPoint.x + arrowSize, endPoint.y + arrowSize * 1.1),
    ];
  }

  GetGeometryRectByPoints(startPoint: Point2D, endPoint: Point2D): Rect2D {
    var points = this.GetGeometryKeyPointsByPoints(startPoint, endPoint);
    if (points != null && points.length > 0) {
      var left = Math.min(...points.map(x => x.x)) - 3;
      var top = Math.min(...points.map(x => x.y)) - 3;
      var right = Math.max(...points.map(x => x.x)) + 3;
      var bottom = Math.max(...points.map(x => x.y)) + 3;

      return new Rect2D(left, top, right - left, bottom - top);
    }
    return Rect2D.Empty;
  }

  public GetGeometryDataByPoints(
    startPoint: Point2D,
    endPoint: Point2D,
  ): string {
    var keyPoints = this.GetGeometryKeyPointsByPoints(startPoint, endPoint);
    if (keyPoints && keyPoints.length == 7) {
      var gRect = this.GetGeometryRectByPoints(startPoint, endPoint);
      keyPoints = keyPoints.map(x => new Point2D(x.x - gRect.x, x.y - gRect.y));
      return (
        `M${keyPoints[0].toString()}` +
        ` C${keyPoints[1].toString()}` +
        ` ${keyPoints[2].toString()}` +
        ` ${keyPoints[3].toString()}` +
        `M${keyPoints[4].toString()}` +
        ` Q${keyPoints[5].toString()} ${keyPoints[6].toString()}`
      );
    }
    return '';
  }

  // #region 移动时计算位置

  RefreshDpPosition(dpUI: HTMLElement) {
    if (this.Owner == null || dpUI == null) return;
    var logicDesign = this.VisualLogicDesign;
    if (logicDesign == null) return;
    if (
      logicDesign.Scene != null &&
      logicDesign.Scene.Courseware != null &&
      logicDesign.Scene == logicDesign.Scene.Courseware.SelectedPage
    ) {
      if (dpUI != null) {
        var canvas = UIHelper.FindAncestorByClassName(dpUI, 'lgCanvas');
        //var relativeLinks = this.GetRelativedLinks();
        if (canvas != null) {
          // && relativeLinks && relativeLinks.length > 0) {
          var handlerRect = dpUI.getBoundingClientRect();
          var handlerClientPoint = new Point2D(
            handlerRect.x + handlerRect.width,
            handlerRect.y + handlerRect.height / 2,
          );
          this.PointPosition = GeometryHelper.GetPosition(
            canvas,
            handlerClientPoint,
          );
        }
      }
    }
  }

  // #endregion

  //#region 连线逻辑
  public static DraggingDp = null;
  startPointDrag(e: React.DragEvent<HTMLElement>) {
    e.dataTransfer.setDragImage(UIHelper.getDragImage(<div />), 0, 0);
    DataPoint.DraggingDp = this;
  }

  private lastUpdateLinkPosTime: number = Date.now();
  onPointDrag(e: React.DragEvent<HTMLElement>) {
    var target = e.target as HTMLElement;
    if (e.button == 0 && target != null) {
      var canvas = UIHelper.FindAncestorByClassName(
        target,
        'lgCanvas',
      ) as HTMLElement;
      if (canvas != null && !(e.clientX == 0 && e.clientY == 0)) {
        this.IsLinking = true;
        if (Reflect.has(this, 'FromInfo')) Reflect.set(this, 'FromInfo', null);
        let now = Date.now();
        if (
          this.Owner != null &&
          this.VisualLogicDesign != null &&
          !this.VisualLogicDesign.DataLinks.includes(this)
        ) {
          this.VisualLogicDesign?.DataLinks?.push(this);
          this.lastUpdateLinkPosTime = now;
        }

        if (now - this.lastUpdateLinkPosTime > 120) {
          this.LinkingPosition = GeometryHelper.GetPosition(
            canvas,
            new Point2D(e.clientX, e.clientY),
          );
          this.lastUpdateLinkPosTime = now;
        }
        //TODO:ScrollIntoView
      }
    }
  }

  onPointDragEnd(e: React.DragEvent<HTMLElement>) {
    UIHelper.clearDragImage();
    this.IsLinking = false;
    if (!this.HasLinked && this.Owner != null) {
      var index = this.VisualLogicDesign?.DataLinks?.indexOf(this);
      if (index != null && index >= 0)
        this.VisualLogicDesign?.DataLinks.splice(index, 1);
    }
    DataPoint.DraggingDp = null;
    e.preventDefault();
  }

  //#endregion
}

export class OutputDataPoint extends DataPoint {
  constructor(dpInfo: DataPointInfo) {
    super();
    this.PointInfo = dpInfo;
  }

  public get HasLinked(): boolean {
    var linkedInputs = this.GetInputDataPointsLinked();

    return linkedInputs != null && linkedInputs.length > 0;
  }

  public get VisualLogicDesign(): LogicDesign {
    if (this.Owner instanceof FuncDataOutput)
      return this.Owner.FatherItem?.LogicDesign;
    return super.VisualLogicDesign;
  }

  private _PointInfo: DataPointInfo;
  public get PointInfo(): DataPointInfo {
    return this._PointInfo;
  }
  public set PointInfo(v: DataPointInfo) {
    this._PointInfo = v;
  }

  OutputDataPoint(dpInfo: DataPointInfo) {
    this.PointInfo = dpInfo;
  }

  GetInputDataPointsLinked(): InputDataPoint[] {
    if (this.Owner != null && this.VisualLogicDesign != null) {
      var ld = this.VisualLogicDesign;

      var allLinkedInputPoints = ld.DataLinks.filter(
        x => x instanceof InputDataPoint,
      ).map(x => x as InputDataPoint);
      return allLinkedInputPoints.filter(x => x.From == this);
    }
    return null;
  }

  GetGeometryData() {
    if (!this.IsLinking) return null;
    else {
      var startPoint = this.PointPosition;
      return this.GetGeometryDataByPoints(startPoint, this.LinkingPosition);
    }
  }

  GetGeometryRect() {
    if (!this.IsLinking) return Rect2D.Empty;
    else {
      var startPoint = this.PointPosition;
      return this.GetGeometryRectByPoints(startPoint, this.LinkingPosition);
    }
  }

  // #region 连线放置
  onPointDragOver(e: React.DragEvent<HTMLElement>) {
    var dataPoint = DataPoint.DraggingDp;
    var candrop = false;
    if (dataPoint != null && dataPoint instanceof InputDataPoint)
      candrop = dataPoint.GetCanLink(this);
    if (candrop) {
      e.preventDefault();
    }
    e.stopPropagation();
  }

  onPointDrop(e: React.DragEvent<HTMLElement>) {
    var dataPoint = DataPoint.DraggingDp;
    var candrop = false;
    if (dataPoint != null) candrop = dataPoint.GetCanLink(this);
    if (candrop && dataPoint instanceof InputDataPoint) {
      dataPoint.FromInfo = this.PointInfo;
      e.preventDefault();
    }
    e.stopPropagation();
  }
  // #endregion
}

export class InputDataPoint extends DataPoint {
  IsMulti: boolean = false;

  public get VisualLogicDesign(): LogicDesign {
    if (this.Owner instanceof FuncDataInput)
      return this.Owner.FatherItem?.LogicDesign;
    return super.VisualLogicDesign;
  }

  @observable
  private _DisableCustom: boolean;
  public get DisableCustom(): boolean {
    if (this.Father != null) return this.Father.DisableCustom;
    return this._DisableCustom;
  }
  public set DisableCustom(v: boolean) {
    this._DisableCustom = v;
  }

  @observable
  private _Father: InputDataPoint;
  public get Father(): InputDataPoint {
    return this._Father;
  }
  public set Father(v: InputDataPoint) {
    this._Father = v;
  }

  @observable
  private _SubInputDataPoints: InputDataPoint[];
  public get SubInputDataPoints(): InputDataPoint[] {
    if (this._SubInputDataPoints == null) {
      if (
        this.FromInfo != null &&
        this.IsMulti &&
        this.FromInfo.DataSourceType == DataSourceType.Multi
      ) {
        this._SubInputDataPoints = [];
        var points = this.FromInfo.SubFromInfos?.map(x => {
          var result = new InputDataPoint();
          result = Object.assign(result, {
            DisplayName: '',
            FromInfo: x,
            Owner: this.Owner,
            Father: this,
          });
          return result;
        }); //Owner设置放在FromInfo设置后面，防止触发redoundo
        if (points != null) this._SubInputDataPoints.push(...points);
      }
    }
    return this._SubInputDataPoints;
  }
  public set SubInputDataPoints(v: InputDataPoint[]) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'SubInputDataPoints',
      () => {
        this._SubInputDataPoints = v;
        this.RefreshMultiFromInfo();
      },
      v,
      this._SubInputDataPoints,
    );
  }

  private _TempCustomValue: string = null;

  @observable
  private _FromInfo: DataPointInfo;
  public get FromInfo(): DataPointInfo {
    if (
      this._FromInfo != null &&
      this._FromInfo.DataSourceType == DataSourceType.Custom &&
      (this._FromInfo.CustomValue == null || this._FromInfo.CustomValue == '')
    )
      return null;
    if (
      this._FromInfo != null &&
      this._FromInfo.DataSourceType == DataSourceType.Multi &&
      (this._FromInfo.SubFromInfos == null ||
        this._FromInfo.SubFromInfos.length == 0)
    )
      return null;
    return this._FromInfo;
  }
  public set FromInfo(v: DataPointInfo) {
    var _action = () => {
      if (
        this._FromInfo != null &&
        this._FromInfo.DataSourceType == DataSourceType.Custom
      )
        this._TempCustomValue = this._FromInfo.CustomValue;
      this._FromInfo = v;
      //同步上一级接口的数据
      if (this.Father != null && this.Father.IsMulti) {
        this.Father.RefreshMultiFromInfo();
      }
      var oldFrom = this._From;
      this.RefreshFromLink();
    };

    RUHelper.TrySetPropRedoUndo(this, 'FromInfo', _action, v, this._FromInfo);
  }

  @observable
  private _From: OutputDataPoint;
  public get From(): OutputDataPoint {
    return this._From;
  }

  public get HasLinked(): boolean {
    return this.From != null;
  }

  private _CustomValue: string;
  public get CustomValue(): string {
    if (this.FromInfo != null) return this.FromInfo.CustomValue;
    return null;
  }
  public set CustomValue(v: string) {
    if (v != this.CustomValue) {
      this._TempCustomValue = v;
      this.FromInfo = Object.assign(new DataPointInfo(), {
        DataSourceType: DataSourceType.Custom,
        //ValueType : this.ValueType,
        CustomValue: v,
      });
    }
  }

  DeleteLink() {
    this.FromInfo = Object.assign(new DataPointInfo(), {
      DataSourceType: DataSourceType.Custom,
      CustomValue: this._TempCustomValue,
    });
  }

  FindFrom(): OutputDataPoint {
    if (
      this.FromInfo != null &&
      this.Owner != null &&
      this.VisualLogicDesign != null
    ) {
      var ld = this.VisualLogicDesign;
      var invHandler: InvokeHandler = null;
      var dataindex = 0;
      if (this.FromInfo.DataIndex != null)
        dataindex = Number(this.FromInfo.DataIndex);
      if (this.FromInfo.DataSourceType == DataSourceType.Trigger) {
        var editItem = ld.Scene.TotalEditItemList?.find(
          x => x.Id == this.FromInfo.DataSourceId,
        );
        var trigger = editItem?.TotalTriggers?.find(
          x => x.TriggerName == this.FromInfo.TriggerName,
        );
        if (trigger != null) {
          if (
            this.FromInfo.InvokeHandlerName == null ||
            this.FromInfo.InvokeHandlerName == ''
          ) {
            //直接在触发器上的数据接口
            if (
              trigger.OutputDataPoints != null &&
              trigger.OutputDataPoints.length > dataindex
            )
              return trigger.OutputDataPoints[dataindex];
          } //数据接口在触发器下面的调用接口当中
          else {
            invHandler = trigger.InvokeHandlers?.find(
              x => x.InvokerProperty == this.FromInfo.InvokeHandlerName,
            );
          }
        }
      } else if (this.FromInfo.DataSourceType == DataSourceType.Invoke) {
        var invItem = ld.AvailableLinkTargets.find(
          inv => inv.Id == this.FromInfo.DataSourceId,
        ) as InvokableBase;
        if (invItem != null) {
          if (
            this.FromInfo.InvokeHandlerName == null ||
            this.FromInfo.InvokeHandlerName == ''
          ) {
            //数据接口在直接在可执行组件下
            if (
              invItem.OutputDataPoints != null &&
              invItem.OutputDataPoints.length > dataindex
            )
              return invItem.OutputDataPoints[dataindex];
          } //数据接口在可执行组件下面的调用接口当中
          else {
            invHandler = invItem.InvokeHandlers?.find(
              x => x.InvokerProperty == this.FromInfo.InvokeHandlerName,
            );
          }
        }
      } else if (
        this.FromInfo.DataSourceType == DataSourceType.Custom ||
        this.FromInfo.DataSourceType == DataSourceType.Multi
      ) {
        return null;
      }
      if (invHandler != null) {
        var targetInvHandler = invHandler;
        if (
          invHandler instanceof InvokeHandlerList &&
          this.FromInfo.InvokeHandlerIndex != null
        ) {
          if (
            invHandler.SubHandlers != null &&
            invHandler.SubHandlers.length >
              Number(this.FromInfo.InvokeHandlerIndex)
          ) {
            targetInvHandler =
              invHandler.SubHandlers[Number(this.FromInfo.InvokeHandlerIndex)];
          }
        }
        if (
          targetInvHandler.OutputDataPoints != null &&
          targetInvHandler.OutputDataPoints.length > dataindex
        ) {
          return targetInvHandler.OutputDataPoints[dataindex];
        }
      }
    }
    return null;
  }

  GetGeometryData(): string {
    var endPoint = this.PointPosition;
    var startPoint = this.LinkingPosition;
    if (this.HasLinked && !this.IsLinking) {
      startPoint = this.From.PointPosition;
    }
    if (this.IsLinking || this.HasLinked) {
      return this.GetGeometryDataByPoints(startPoint, endPoint);
    }
    return null;
  }

  GetGeometryRect() {
    var endPoint = this.PointPosition;
    var startPoint = this.LinkingPosition;
    if (this.HasLinked && !this.IsLinking) {
      startPoint = this.From.PointPosition;
    }
    if (this.IsLinking || this.HasLinked) {
      return this.GetGeometryRectByPoints(startPoint, endPoint);
    }
    return Rect2D.Empty;
  }

  //#region 移动时计算位置

  RefreshDpPosition(dpUI: HTMLElement) {
    if (this.Owner == null || dpUI == null) return;
    var logicDesign = this.VisualLogicDesign;
    if (logicDesign == null) return;
    if (
      logicDesign.Scene != null &&
      logicDesign.Scene.Courseware != null &&
      logicDesign.Scene == logicDesign.Scene.Courseware.SelectedPage
    ) {
      if (dpUI != null) {
        var canvas = UIHelper.FindAncestorByClassName(dpUI, 'lgCanvas');
        //var relativeLinks = this.GetRelativedLinks();
        if (canvas != null) {
          // && relativeLinks && relativeLinks.length > 0) {
          var handlerRect = dpUI.getBoundingClientRect();
          var handlerClientPoint = new Point2D(
            handlerRect.x,
            handlerRect.y + handlerRect.height / 2,
          );
          this.PointPosition = GeometryHelper.GetPosition(
            canvas,
            handlerClientPoint,
          );
        }
      }
    }
  }
  //#endregion

  //#region 连线放置逻辑

  onPointDragOver(e: React.DragEvent<HTMLElement>) {
    e.dataTransfer.dropEffect = 'copy';
    var dataPoint = DataPoint.DraggingDp;
    var candrop = false;
    if (dataPoint != null && dataPoint instanceof OutputDataPoint)
      candrop = this.GetCanLink(dataPoint);
    if (candrop) {
      e.preventDefault();
    }
    e.stopPropagation();
  }

  onPointDrop(e: React.DragEvent<HTMLElement>) {
    var dataPoint = DataPoint.DraggingDp;
    var candrop = false;
    if (dataPoint != null && dataPoint instanceof OutputDataPoint)
      candrop = this.GetCanLink(dataPoint);
    if (candrop) {
      this.FromInfo = dataPoint.PointInfo;
    }
    e.stopPropagation();
  }

  //#endregion

  // #region 是否可以连接

  public GetCanLink(odp: OutputDataPoint): boolean {
    if (odp.Owner == this.Owner) return false;
    return true;
  }

  // #endregion

  //#region 刷新视图上的连线
  RefreshFromLink(): void {
    this._From = this.FindFrom();
    if (this._From != null) {
      if (!this.VisualLogicDesign.DataLinks.includes(this))
        this.VisualLogicDesign.DataLinks.push(this);
    } else {
      if (
        this.Owner != null &&
        this.VisualLogicDesign != null &&
        this.VisualLogicDesign.DataLinks.includes(this)
      )
        this.VisualLogicDesign.DataLinks.splice(
          this.VisualLogicDesign.DataLinks.indexOf(this),
          1,
        );
    }
  }

  RefreshLinkLine() {
    this.RefreshFromLink();
  }

  //#endregion

  //#region 子接口控制
  RemoveSubInputDataPoint(datapoint: InputDataPoint): void {
    if (
      datapoint != null &&
      this.SubInputDataPoints != null &&
      this.SubInputDataPoints.includes(datapoint)
    ) {
      //UIHelper.FindAncestor<LogicDesignCanvas>( obj)?.Focus();//触发自定义值修改
      var result = [...this.SubInputDataPoints];
      result.splice(result.indexOf(datapoint), 1);
      this.SubInputDataPoints = result;
    }
  }

  MoveSubInputDataPointUp(datapoint: InputDataPoint): void {
    if (
      datapoint != null &&
      this.SubInputDataPoints != null &&
      this.SubInputDataPoints.includes(datapoint)
    ) {
      // UIHelper.FindAncestor<LogicDesignCanvas>( obj)?.Focus();//触发自定义值修改
      var index = this.SubInputDataPoints.indexOf(datapoint);
      if (index > 0) {
        var result = [...this.SubInputDataPoints];
        result.splice(index, 1);
        result.splice(index - 1, 0, datapoint);
        this.SubInputDataPoints = result;
      }
    }
  }
  MoveSubInputDataPointDown(datapoint: InputDataPoint): void {
    if (
      datapoint != null &&
      this.SubInputDataPoints != null &&
      this.SubInputDataPoints.includes(datapoint)
    ) {
      // UIHelper.FindAncestor<LogicDesignCanvas>( obj)?.Focus();//触发自定义值修改
      var index = this.SubInputDataPoints.indexOf(datapoint);
      if (index < this.SubInputDataPoints.length - 1) {
        var result = [...this.SubInputDataPoints];
        result.splice(index, 1);
        result.splice(index + 1, 0, datapoint);
        this.SubInputDataPoints = result;
      }
    }
  }

  AddSubInputDataPoint() {
    var result = [...(this.SubInputDataPoints || [])];
    result.push(
      Object.assign(new InputDataPoint(), {
        Owner: this.Owner,
        Father: this,
        DisplayName: '',
        DisableCustom: this.DisableCustom,
        FromInfo: null,
      }),
    );
    this.SubInputDataPoints = result;
  }

  //#endregion

  RefreshMultiFromInfo() {
    if (this.IsMulti) {
      if (this._FromInfo == null) {
        var temp = new DataPointInfo();
        temp = Object.assign(temp, { DataSourceType: DataSourceType.Multi });
        this._FromInfo = temp;
      }
      this._FromInfo.SubFromInfos = this.SubInputDataPoints?.map(
        x => x.FromInfo,
      );
    }
  }
}
