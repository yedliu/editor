import React from 'react';
import CWElement from '../../../cwElement';
import CWResource from '../../../cwResource';
import { from } from 'linq-to-typescript';
import { batch } from '@/server/CacheEntityServer';
import IPropUndoable from '@/redoundo/IPropUndoable';
import RectMazeBase from '.././RectMazeBase';
import { observable } from 'mobx';
import RUHelper from '@/redoundo/redoUndoHelper';
import { Expose, Type } from '@/class-transformer';
import RectMazeUnitBase from '.././RectMazeUnitBase';
import { ResourceRef } from '../../../resRef/resourceRef';
import { ClassType } from '../../../courseDetailenum';
import ChessManTemplate, {
  PropPanelTemplate as ChessManTemplatePropPanelTemplate,
} from '@/components/cwDesignUI/elements/controlTemplates/chessmanTemplate';
export default class Chessman extends CWElement {
  constructor() {
    super();
  }

  public get Template(): any {
    return ChessManTemplate;
  }

  public get PropPanelTemplate(): any {
    return ChessManTemplatePropPanelTemplate;
  }

  @observable
  private _StandRes: ResourceRef;
  @Expose()
  @batch(ClassType.resource)
  @Type(() => ResourceRef)
  public get StandRes(): ResourceRef {
    return this._StandRes;
  }
  public set StandRes(v: ResourceRef) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'StandRes',
      () => (this._StandRes = v),
      v,
      this._StandRes,
    );
  }

  @observable
  private _UpRes: ResourceRef;
  @Expose()
  @batch(ClassType.resource)
  @Type(() => ResourceRef)
  public get UpRes(): ResourceRef {
    return this._UpRes;
  }
  public set UpRes(v: ResourceRef) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'UpRes',
      () => (this._UpRes = v),
      v,
      this._UpRes,
    );
  }

  @observable
  private _DownRes: ResourceRef;
  @Expose()
  @batch(ClassType.resource)
  @Type(() => ResourceRef)
  public get DownRes(): ResourceRef {
    return this._DownRes;
  }
  public set DownRes(v: ResourceRef) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'DownRes',
      () => (this._DownRes = v),
      v,
      this._DownRes,
    );
  }

  @observable
  private _LeftRes: ResourceRef;
  @Expose()
  @batch(ClassType.resource)
  @Type(() => ResourceRef)
  public get LeftRes(): ResourceRef {
    return this._LeftRes;
  }
  public set LeftRes(v: ResourceRef) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'LeftRes',
      () => (this._LeftRes = v),
      v,
      this._LeftRes,
    );
  }

  @observable
  private _RightRes: ResourceRef;
  @Expose()
  @batch(ClassType.resource)
  @Type(() => ResourceRef)
  public get RightRes(): ResourceRef {
    return this._RightRes;
  }
  public set RightRes(v: ResourceRef) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'RightRes',
      () => (this._RightRes = v),
      v,
      this._RightRes,
    );
  }

  @observable
  private _UpRightRes: ResourceRef;
  @Expose()
  @batch(ClassType.resource)
  @Type(() => ResourceRef)
  public get UpRightRes(): ResourceRef {
    return this._UpRightRes;
  }
  public set UpRightRes(v: ResourceRef) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'UpRightRes',
      () => (this._UpRightRes = v),
      v,
      this._UpRightRes,
    );
  }

  @observable
  private _UpLeftRes: ResourceRef;
  @Expose()
  @batch(ClassType.resource)
  @Type(() => ResourceRef)
  public get UpLeftRes(): ResourceRef {
    return this._UpLeftRes;
  }
  public set UpLeftRes(v: ResourceRef) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'UpLeftRes',
      () => (this._UpLeftRes = v),
      v,
      this._UpLeftRes,
    );
  }

  @observable
  private _DownRightRes: ResourceRef;
  @Expose()
  @batch(ClassType.resource)
  @Type(() => ResourceRef)
  public get DownRightRes(): ResourceRef {
    return this._DownRightRes;
  }
  public set DownRightRes(v: ResourceRef) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'DownRightRes',
      () => (this._DownRightRes = v),
      v,
      this._DownRightRes,
    );
  }

  @observable
  private _DownLeftRes: ResourceRef;
  @Expose()
  @batch(ClassType.resource)
  @Type(() => ResourceRef)
  public get DownLeftRes(): ResourceRef {
    return this._DownLeftRes;
  }
  public set DownLeftRes(v: ResourceRef) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'DownLeftRes',
      () => (this._DownLeftRes = v),
      v,
      this._DownLeftRes,
    );
  }

  public SetResourcesFromLib(reslib: CWResource[]) {
    if (!reslib) return;
    this.StandRes?.SearchResource(reslib);
    this.UpRes?.SearchResource(reslib);
    this.DownRes?.SearchResource(reslib);
    this.LeftRes?.SearchResource(reslib);
    this.RightRes?.SearchResource(reslib);
    this.UpLeftRes?.SearchResource(reslib);
    this.UpRightRes?.SearchResource(reslib);
    this.DownLeftRes?.SearchResource(reslib);
    this.DownRightRes?.SearchResource(reslib);
  }

  public GetDependencyResources(): CWResource[] {
    var res: CWResource[] = [];
    if (this.StandRes != null && this.StandRes.Resource != null)
      res.push(this.StandRes.Resource);
    if (this.UpRes != null && this.UpRes.Resource != null)
      res.push(this.UpRes.Resource);
    if (this.DownRes != null && this.DownRes.Resource != null)
      res.push(this.DownRes.Resource);
    if (this.LeftRes != null && this.LeftRes.Resource != null)
      res.push(this.LeftRes.Resource);
    if (this.RightRes != null && this.RightRes.Resource != null)
      res.push(this.RightRes.Resource);
    if (this.UpLeftRes != null && this.UpLeftRes.Resource != null)
      res.push(this.UpLeftRes.Resource);
    if (this.UpRightRes != null && this.UpRightRes.Resource != null)
      res.push(this.UpRightRes.Resource);
    if (this.DownLeftRes != null && this.DownLeftRes.Resource != null)
      res.push(this.DownLeftRes.Resource);
    if (this.DownRightRes != null && this.DownRightRes.Resource != null)
      res.push(this.DownRightRes.Resource);
    return res;
  }
}
