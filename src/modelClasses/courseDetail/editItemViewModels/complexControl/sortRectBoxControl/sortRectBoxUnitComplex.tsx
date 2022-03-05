import CWResource from '../../../cwResource';
import { batch } from '@/server/CacheEntityServer';
import { observable } from 'mobx';
import RUHelper from '@/redoundo/redoUndoHelper';
import { Expose, Type } from '@/class-transformer';
import RectMazeUnitBase from '../RectMazeUnitBase';
import { ResourceRef } from '../../../resRef/resourceRef';
import { ClassType } from '../../../courseDetailenum';

export default class sortRectBoxUnitComplex extends RectMazeUnitBase {
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
  private _LogicTag: string;
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
