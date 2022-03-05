import CWResource from '../../../cwResource';
import { batch } from '@/server/CacheEntityServer';
import { observable } from 'mobx';
import RUHelper from '@/redoundo/redoUndoHelper';
import { Expose, Type } from '@/class-transformer';
import RectMazeUnitBase from '../RectMazeUnitBase';
import { ResourceRef } from '../../../resRef/resourceRef';
import { ClassType } from '../../../courseDetailenum';

export default class KeyboardUnitComplex extends RectMazeUnitBase {
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
  private _PromptVoice: ResourceRef;
  @Expose()
  @batch(ClassType.resource)
  @Type(() => ResourceRef)
  public get PromptVoice(): ResourceRef {
    return this._PromptVoice;
  }
  public set PromptVoice(v: ResourceRef) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'PromptVoice',
      () => (this._PromptVoice = v),
      v,
      this._PromptVoice,
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

  @observable
  private _OutPutRes: ResourceRef;
  @batch(ClassType.resource)
  @Expose()
  @Type(() => ResourceRef)
  public get OutPutRes(): ResourceRef {
    return this._OutPutRes;
  }
  public set OutPutRes(v: ResourceRef) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'OutPutRes',
      () => (this._OutPutRes = v),
      v,
      this._OutPutRes,
    );
  }

  public GetDependencyResources(): CWResource[] {
    var res: CWResource[] = [];
    if (this.NormalRes != null && this.NormalRes.Resource != null)
      res.push(this.NormalRes.Resource);
    if (this.PressedRes != null && this.PressedRes.Resource != null)
      res.push(this.PressedRes.Resource);
    if (this.OutPutRes != null && this.OutPutRes.Resource != null)
      res.push(this.OutPutRes.Resource);
    if (this.PromptVoice != null && this.PromptVoice.Resource != null)
      res.push(this.PromptVoice.Resource);
    return res;
  }

  public SeachRes(reslib: Array<CWResource>) {
    this.NormalRes?.SearchResource(reslib);
    this.PressedRes?.SearchResource(reslib);
    this.OutPutRes?.SearchResource(reslib);
    this.PromptVoice?.SearchResource(reslib);
  }
}
