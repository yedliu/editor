import { batch } from '@/server/CacheEntityServer';
import { observable } from 'mobx';
import RUHelper from '@/redoundo/redoUndoHelper';
import { Expose, Type } from '@/class-transformer';
import RectMazeUnitBase from '../RectMazeUnitBase';
import { ResourceRef } from '@/modelClasses/courseDetail/resRef/resourceRef';
import { ClassType } from '@/modelClasses/courseDetail/courseDetailenum';
import CWResource from '@/modelClasses/courseDetail/cwResource';
import { ActionViewModel } from '@/modelClasses/courseDetail/ShowHideViewModels/ActionViewModel';

export default class dragSeekBarUnitComplex extends RectMazeUnitBase {
  constructor() {
    super();
  }

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

  @observable
  private _MaskNormalRes: ResourceRef;
  @Expose()
  @batch(ClassType.resource)
  @Type(() => ResourceRef)
  public get MaskNormalRes(): ResourceRef {
    return this._MaskNormalRes;
  }
  public set MaskNormalRes(v: ResourceRef) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'MaskNormalRes',
      () => (this._MaskNormalRes = v),
      v,
      this._MaskNormalRes,
    );
  }

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

  public GetDependencyResources(): CWResource[] {
    var res: CWResource[] = [];
    if (this.NormalRes != null && this.NormalRes.Resource != null)
      res.push(this.NormalRes.Resource);
    if (this.MaskNormalRes != null && this.MaskNormalRes.Resource != null)
      res.push(this.MaskNormalRes.Resource);
    return res;
  }

  public SeachRes(reslib: Array<CWResource>) {
    this.NormalRes?.SearchResource(reslib);
    this.MaskNormalRes?.SearchResource(reslib);
  }
}
