import CWResource from '../../../cwResource';
import { batch } from '@/server/CacheEntityServer';
import { observable } from 'mobx';
import RUHelper from '@/redoundo/redoUndoHelper';
import { Expose, Type } from '@/class-transformer';
import RectMazeUnitBase from '.././RectMazeUnitBase';
import { ResourceRef } from '../../../resRef/resourceRef';
import { ClassType } from '../../../courseDetailenum';

export default class RectMazeControllerUnit extends RectMazeUnitBase {
  constructor() {
    super();
  }

  @observable
  private _IsOnControl: boolean;
  @Expose()
  @batch(ClassType.bool)
  public get IsOnControl(): boolean {
    return this._IsOnControl;
  }
  public set IsOnControl(v: boolean) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'IsOnControl',
      () => (this._IsOnControl = v),
      v,
      this._IsOnControl,
    );
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
  private _HoverRes: ResourceRef;
  @Expose()
  @batch(ClassType.resource)
  @Type(() => ResourceRef)
  public get HoverRes(): ResourceRef {
    return this._HoverRes;
  }
  public set HoverRes(v: ResourceRef) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'HoverRes',
      () => (this._HoverRes = v),
      v,
      this._HoverRes,
    );
  }

  @observable
  private _PressedRes: ResourceRef;
  @Expose()
  @batch(ClassType.resource)
  @Type(() => ResourceRef)
  public get PressedRes(): ResourceRef {
    return this._PressedRes;
  }
  public set PressedRes(v: ResourceRef) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'PressedRes',
      () => (this._PressedRes = v),
      v,
      this._PressedRes,
    );
  }

  public GetDependencyResources(): CWResource[] {
    var res: CWResource[] = [];
    if (this.NormalRes != null && this.NormalRes.Resource != null)
      res.push(this.NormalRes.Resource);
    if (this.PressedRes != null && this.PressedRes.Resource != null)
      res.push(this.PressedRes.Resource);
    if (this.HoverRes != null && this.HoverRes.Resource != null)
      res.push(this.HoverRes.Resource);
    return res;
  }

  public SeachRes(reslib: Array<CWResource>) {
    this.NormalRes?.SearchResource(reslib);
    this.PressedRes?.SearchResource(reslib);
    this.HoverRes?.SearchResource(reslib);
  }
}
