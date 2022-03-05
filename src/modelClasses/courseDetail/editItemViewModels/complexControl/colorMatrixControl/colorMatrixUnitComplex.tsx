import CWResource from '../../../cwResource';
import { batch } from '@/server/CacheEntityServer';
import { observable } from 'mobx';
import RUHelper from '@/redoundo/redoUndoHelper';
import { Expose, Type } from '@/class-transformer';
import RectMazeUnitBase from '../RectMazeUnitBase';
import { ResourceRef } from '../../../resRef/resourceRef';
import { ClassType } from '../../../courseDetailenum';

export default class colorMatrixUnitComplex extends RectMazeUnitBase {
  constructor() {
    super();
  }

  @observable
  private _IsOnControl: boolean = true;
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
  private _Color: string = null;
  @Expose()
  @batch(ClassType.string)
  public get Color(): string {
    return this._Color;
  }

  @batch()
  public get subColor(): string {
    var valColor = this._Color;
    let alpha = valColor ? (1 / 255) * parseInt(valColor.substr(1, 2), 16) : 1;
    let disposeColor = {
      color: valColor
        ? `rgba(
                      ${parseInt(valColor.substr(3, 2), 16)}, 
                      ${parseInt(valColor.substr(5, 2), 16)}, 
                      ${parseInt(valColor.substr(7, 2), 16)}, ${alpha})`
        : '',
    };
    return disposeColor.color;
  }

  public set Color(v: string) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'Color',
      () => (this._Color = v),
      v,
      this._Color,
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
