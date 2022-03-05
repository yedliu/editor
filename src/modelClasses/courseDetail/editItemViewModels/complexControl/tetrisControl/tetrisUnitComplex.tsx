import CWResource from '../../../cwResource';
import { batch } from '@/server/CacheEntityServer';
import { observable } from 'mobx';
import RUHelper from '@/redoundo/redoUndoHelper';
import { Expose, Type } from '@/class-transformer';
import RectMazeUnitBase from '../RectMazeUnitBase';
import { ResourceRef } from '../../../resRef/resourceRef';
import { ClassType } from '../../../courseDetailenum';

export default class tetrisUnitComplex extends RectMazeUnitBase {
  constructor() {
    super();
  }

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

  public GetDependencyResources(): CWResource[] {
    var res: CWResource[] = [];
    if (this.NormalRes != null && this.NormalRes.Resource != null)
      res.push(this.NormalRes.Resource);
    return res;
  }

  public SeachRes(reslib: Array<CWResource>) {
    this.NormalRes?.SearchResource(reslib);
  }
}
