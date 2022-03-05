import { batch } from '@/server/CacheEntityServer';
import { observable } from 'mobx';
import RUHelper from '@/redoundo/redoUndoHelper';
import { Expose, Type } from '@/class-transformer';
import RectMazeUnitBase from './RectMazeUnitBase';
import { ResourceRef } from '../../resRef/resourceRef';
import { ClassType } from '../../courseDetailenum';
import CWResource from '../../cwResource';
import { ActionViewModel } from '../../ShowHideViewModels/ActionViewModel';

export default class RectMazeUnitComplex extends RectMazeUnitBase {
  constructor() {
    super();
  }

  //是否是起始的地块
  @observable
  private _IsStartUnit: boolean;
  //@Expose()
  @batch(ClassType.bool)
  public get IsStartUnit(): boolean {
    return this._IsStartUnit;
  }
  public set IsStartUnit(v: boolean) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'IsStartUnit',
      () => (this._IsStartUnit = v),
      v,
      this._IsStartUnit,
    );
  }

  //是否是终点
  @observable
  private _IsEndUnit: boolean;
  //@Expose()
  @batch(ClassType.bool)
  public get IsEndUnit(): boolean {
    return this._IsEndUnit;
  }
  public set IsEndUnit(v: boolean) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'IsEndUnit',
      () => (this._IsEndUnit = v),
      v,
      this._IsEndUnit,
    );
  }

  //能否被站立
  @observable
  private _CanStandOn: boolean;
  @Expose()
  @batch(ClassType.bool)
  public get CanStandOn(): boolean {
    return this._CanStandOn;
  }
  public set CanStandOn(v: boolean) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'CanStandOn',
      () => (this._CanStandOn = v),
      v,
      this._CanStandOn,
    );
  }

  //无人站立时的资源
  @observable
  private _NormalRes: ResourceRef;
  @Expose()
  @batch(ClassType.resource)
  @Type(() => ResourceRef)
  public get NormalRes(): ResourceRef {
    return this._NormalRes;
  }
  public set NormalRes(v: ResourceRef) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'NormalRes',
      () => (this._NormalRes = v),
      v,
      this._NormalRes,
    );
  }

  //棋子正在上面时的资源
  @observable
  private _StandOnRes: ResourceRef;
  @Expose()
  @batch(ClassType.resource)
  @Type(() => ResourceRef)
  public get StandOnRes(): ResourceRef {
    return this._StandOnRes;
  }
  public set StandOnRes(v: ResourceRef) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'StandOnRes',
      () => (this._StandOnRes = v),
      v,
      this._StandOnRes,
    );
  }

  //棋子离开后的资源
  @observable
  private _LeaveRes: ResourceRef;
  @Expose()
  @batch(ClassType.resource)
  @Type(() => ResourceRef)
  public get LeaveRes(): ResourceRef {
    return this._LeaveRes;
  }
  public set LeaveRes(v: ResourceRef) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'LeaveRes',
      () => (this._LeaveRes = v),
      v,
      this._LeaveRes,
    );
  }

  //#region 逻辑属性

  //逻辑标签
  @observable
  private _LogicTag: string = '';
  @Expose()
  @batch(ClassType.string)
  public get LogicTag(): string {
    return this._LogicTag;
  }
  public set LogicTag(v: string) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'LogicTag',
      () => (this._LogicTag = v),
      v,
      this._LogicTag,
    );
  }

  //棋子进入时触发的事件
  @observable
  private _StepInEvents: ActionViewModel[];
  @Expose()
  @Type(() => ActionViewModel)
  @batch(ClassType.object)
  public get StepInEvents(): ActionViewModel[] {
    if (!this._StepInEvents) this._StepInEvents = [new ActionViewModel()];
    return this._StepInEvents;
  }
  public set StepInEvents(v: ActionViewModel[]) {
    this._StepInEvents = v;
  }

  //棋子离开时触发的事件
  @observable
  private _StepOutEvents: ActionViewModel[];
  @Expose()
  @Type(() => ActionViewModel)
  @batch(ClassType.object)
  public get StepOutEvents(): ActionViewModel[] {
    if (!this._StepOutEvents) this._StepOutEvents = [new ActionViewModel()];
    return this._StepOutEvents;
  }
  public set StepOutEvents(v: ActionViewModel[]) {
    this._StepOutEvents = v;
  }

  //#endregion

  public GetDependencyResources(): CWResource[] {
    var res: CWResource[] = [];
    if (this.NormalRes != null && this.NormalRes.Resource != null)
      res.push(this.NormalRes.Resource);
    if (this.LeaveRes != null && this.LeaveRes.Resource != null)
      res.push(this.LeaveRes.Resource);
    if (this.StandOnRes != null && this.StandOnRes.Resource != null)
      res.push(this.StandOnRes.Resource);
    return res;
  }

  public SeachRes(reslib: Array<CWResource>) {
    this.NormalRes?.SearchResource(reslib);
    this.LeaveRes?.SearchResource(reslib);
    this.StandOnRes?.SearchResource(reslib);
  }
}
