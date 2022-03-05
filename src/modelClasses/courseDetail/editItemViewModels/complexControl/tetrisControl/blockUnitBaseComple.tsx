import React from 'react';
import { batch } from '@/server/CacheEntityServer';
import IPropUndoable from '@/redoundo/IPropUndoable';
import { observable } from 'mobx';
import RUHelper from '@/redoundo/redoUndoHelper';
import { Expose, Type } from '@/class-transformer';
import listBlockBaseComple from './listBlockBaseComple';
import CWResource from '@/modelClasses/courseDetail/cwResource';
import { ResourceRef } from '@/modelClasses/courseDetail/resRef/resourceRef';
import { ClassType } from '@/modelClasses/courseDetail/courseDetailenum';

export default class blockUnitBaseComple implements IPropUndoable {
  constructor() {}

  public Father: listBlockBaseComple;

  public get CanRecordRedoUndo(): boolean {
    return this.Father != null && this.Father.CanRecordRedoUndo;
  }

  @observable
  private _ColIndex: number;
  @Expose()
  public get ColIndex(): number {
    return this._ColIndex;
  }
  public set ColIndex(v: number) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'ColIndex',
      () => (this._ColIndex = v),
      v,
      this._ColIndex,
    );
  }

  @observable
  private _RowIndex: number;
  @Expose()
  public get RowIndex(): number {
    return this._RowIndex;
  }
  public set RowIndex(v: number) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'RowIndex',
      () => (this._RowIndex = v),
      v,
      this._RowIndex,
    );
  }

  @observable
  private _IsSelected: boolean;
  public get IsSelected(): boolean {
    return this._IsSelected;
  }
  public set IsSelected(v: boolean) {
    this._IsSelected = v;
    if (this._IsSelected) {
      this.Father?.SelectedUnits.push(this);
    } else {
      var index = this.Father?.SelectedUnits.indexOf(this);
      if (index > -1) {
        this.Father?.SelectedUnits.splice(index, 1);
      }
    }
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

  public SeachRes(reslib: Array<CWResource>) {
    this.NormalRes?.SearchResource(reslib);
  }

  public GetDependencyResources(): CWResource[] {
    var res: CWResource[] = [];
    if (this.NormalRes != null && this.NormalRes.Resource != null)
      res.push(this.NormalRes.Resource);
    return res;
  }
}
