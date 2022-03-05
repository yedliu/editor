import React from 'react';
import CWElement from '../../../cwElement';
import CWResource from '../../../cwResource';
import { from } from 'linq-to-typescript';
import { batch } from '@/server/CacheEntityServer';
import IPropUndoable from '@/redoundo/IPropUndoable';
import WritingUnit from './WritingUnit';
import { observable } from 'mobx';
import RUHelper from '@/redoundo/redoUndoHelper';
import { Expose } from '@/class-transformer';
import WritingUnitBase from './WritingUnitBase';
import { ClassType } from '@/modelClasses/courseDetail/courseDetailenum';

export default class WritingPointGroup {
  constructor() {}

  @observable
  private _IsClose: boolean = false;
  @batch(ClassType.bool)
  public get IsClose(): boolean {
    return this._IsClose;
  }
  public set IsClose(v: boolean) {
    this._IsClose = v;

    // this.PointList.forEach(element => {
    //   element.IsClose = v;
    // });
  }

  @observable
  private _Group: number;
  @batch()
  public get Group(): number {
    return this._Group;
  }
  public set Group(v: number) {
    this._Group = v;
  }

  @observable
  private _PointList: Array<WritingUnit>;
  @batch(ClassType.object)
  public get PointList(): Array<WritingUnit> {
    if (!this._PointList) this._PointList = new Array<WritingUnit>();
    return this._PointList;
  }
  public set PointList(v: Array<WritingUnit>) {
    this._PointList = v;
  }
}
