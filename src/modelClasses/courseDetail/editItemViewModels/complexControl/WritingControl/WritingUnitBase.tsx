import React from 'react';
import CWElement from '../../../cwElement';
import CWResource from '../../../cwResource';
import { from } from 'linq-to-typescript';
import { batch } from '@/server/CacheEntityServer';
import IPropUndoable from '@/redoundo/IPropUndoable';
import WritingBase from './WritingBase';
import { observable } from 'mobx';
import RUHelper from '@/redoundo/redoUndoHelper';
import { Expose, Type } from '@/class-transformer';
import { ClassType } from '../../../courseDetailenum';
import MathHelper from '@/utils/MathHelper';
import IdHelper from '@/utils/idHelper';
import { Point2D } from '@/utils/Math2D';
import { ResourceRef } from '@/modelClasses/courseDetail/resRef/resourceRef';

export default class WritingUnitBase implements IPropUndoable {
  constructor() {
    this.Id = IdHelper.NewId();
  }

  @Expose() @batch() Id: string;

  public Father: WritingBase;

  public get CanRecordRedoUndo(): boolean {
    return this.Father != null && this.Father.CanRecordRedoUndo;
  }

  // @observable
  // private _IsClose: boolean = false;

  // @batch(ClassType.bool)
  // @Expose()
  // public get IsClose(): boolean {
  //   return this._IsClose;
  // }
  // public set IsClose(v: boolean) {
  //   this._IsClose = v;
  //   //RUHelper.TrySetPropRedoUndo(this, 'IsClose', () => (this._IsClose = v), v, this._IsClose);
  // }

  @observable
  private _X: number;

  @batch(ClassType.number)
  @Expose()
  public get X(): number {
    return MathHelper.round(this._X, 2);
    // return this._X;
  }
  public set X(v: number) {
    RUHelper.TrySetPropRedoUndo(this, 'X', () => (this._X = v), v, this._X);
  }

  @observable
  private _Y: number;
  @batch(ClassType.number)
  @Expose()
  public get Y(): number {
    return MathHelper.round(this._Y, 2);
    // return this._Y;
  }
  public set Y(v: number) {
    RUHelper.TrySetPropRedoUndo(this, 'Y', () => (this._Y = v), v, this._Y);
  }

  public get Position(): Point2D {
    return new Point2D(this.X, this.Y);
  }
  public set Position(v: Point2D) {
    this.X = v.x;
    this.Y = v.y;
  }

  @observable
  private _SerialNumber: number;
  @batch(ClassType.number)
  @Expose()
  public get SerialNumber(): number {
    return this._SerialNumber;
  }
  public set SerialNumber(v: number) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'SerialNumber',
      () => (this._SerialNumber = v),
      v,
      this._SerialNumber,
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

  public GetDependencyResources(): CWResource[] {
    var res: CWResource[] = [];
    if (this.PromptVoice != null && this.PromptVoice.Resource != null)
      res.push(this.PromptVoice.Resource);

    return res;
  }

  public SeachRes(reslib: Array<CWResource>) {
    this.PromptVoice?.SearchResource(reslib);
  }
}
