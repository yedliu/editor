import React from 'react';
import CWElement from '../../cwElement';
import CWResource from '../../cwResource';
import { from } from 'linq-to-typescript';
import { batch } from '@/server/CacheEntityServer';
import IPropUndoable from '@/redoundo/IPropUndoable';
import RectMazeBase from './RectMazeBase';
import { observable } from 'mobx';
import RUHelper from '@/redoundo/redoUndoHelper';
import { Expose } from '@/class-transformer';
import { ClassType } from '../../courseDetailenum';

export default class RectMazeUnitBase implements IPropUndoable {
  constructor() {}

  public Father: RectMazeBase;

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
  private _Margin: string;
  @Expose()
  public get Margin(): string {
    return `${this.MarginLeft},${this.MarginTop},${this.MarginRight},${this.MarginBottom}`;
  }
  public set Margin(v: string) {
    if (v) {
      let margin = v.split(',');
      this.MarginTop = Number(margin[1]);
      this.MarginRight = Number(margin[2]);
      this.MarginBottom = Number(margin[3]);
      this.MarginLeft = Number(margin[0]);
    }
  }

  @observable
  private _MarginLeft: number = 0;
  @batch()
  public get MarginLeft(): number {
    return this._MarginLeft;
  }
  public set MarginLeft(v: number) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'MarginLeft',
      () => (this._MarginLeft = v),
      v,
      this._MarginLeft,
    );
  }

  @observable
  private _MarginTop: number = 0;
  @batch()
  public get MarginTop(): number {
    return this._MarginTop;
  }
  public set MarginTop(v: number) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'MarginTop',
      () => (this._MarginTop = v),
      v,
      this._MarginTop,
    );
  }

  @observable
  private _MarginBottom: number = 0;
  @batch()
  public get MarginBottom(): number {
    return this._MarginBottom;
  }
  public set MarginBottom(v: number) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'MarginBottom',
      () => (this._MarginBottom = v),
      v,
      this._MarginBottom,
    );
  }

  @observable
  private _MarginRight: number = 0;
  @batch()
  public get MarginRight(): number {
    return this._MarginRight;
  }
  public set MarginRight(v: number) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'MarginRight',
      () => (this._MarginRight = v),
      v,
      this._MarginRight,
    );
  }

  @observable
  private _Angle: number;
  @Expose()
  @batch()
  public get Angle(): number {
    return this._Angle;
  }
  public set Angle(v: number) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'Angle',
      () => (this._Angle = v),
      v,
      this._Angle,
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
    // console.log(this.IsSelected);
    // console.log(this.Father?.SelectedUnits?.length);
  }

  public SeachRes(reslib: Array<CWResource>) {}

  public GetDependencyResources(): CWResource[] {
    return [];
  }
}
