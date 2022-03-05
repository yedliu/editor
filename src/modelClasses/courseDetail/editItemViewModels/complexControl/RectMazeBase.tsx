import React from 'react';
import CWElement from '../../cwElement';
import CWResource from '../../cwResource';
import { batch } from '@/server/CacheEntityServer';
import IPropUndoable from '@/redoundo/IPropUndoable';
import RectMazeUnitBase from './RectMazeUnitBase';
import ActionManager from '@/redoundo/actionManager';
import RUHelper from '@/redoundo/redoUndoHelper';
import { from, elementAtOrDefault } from 'linq-to-typescript';
import { array } from 'prop-types';
import { Expose, Type, plainToClass, classToPlain } from '@/class-transformer';
import { observable } from 'mobx';
import { ResourceRef, SkResRef } from '../../resRef/resourceRef';
import {
  CWResourceTypes,
  ElementTypes,
  ClassType,
} from '../../courseDetailenum';
import ObjHelper from '@/utils/objHelper';
import TypeMapHelper from '@/configs/typeMapHelper';

export default class RectMazeBase extends CWElement {
  protected UnitVMType: new (...args: any[]) => any = RectMazeUnitBase;

  constructor() {
    super();
  }

  @observable
  private _Background: ResourceRef;
  @Expose()
  @batch(ClassType.resource)
  @Type(() => ResourceRef)
  public get Background(): ResourceRef {
    return this._Background;
  }
  public set Background(v: ResourceRef) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'Background',
      () => (this._Background = v),
      v,
      this._Background,
    );
  }

  @observable
  private _ColNum: number;
  @Expose()
  @batch(ClassType.number)
  public get ColNum(): number {
    if (this.UnitsMatrix == null || this.UnitsMatrix.length == 0) {
      return 0;
    } else return this.UnitsMatrix[0].length;
  }
  public set ColNum(value: number) {
    var newValue = Math.max(value, 1);
    var oldValue = this.ColNum;
    if (newValue != oldValue) {
      if (newValue > oldValue) {
        this.InsertCols(oldValue, newValue - oldValue);
      } else {
        this.DeleteCols(newValue, oldValue - newValue);
      }
    }
  }

  @observable
  private _RowNum: number;
  @Expose()
  @batch(ClassType.number)
  public get RowNum(): number {
    return this.UnitsMatrix == null ? 0 : this.UnitsMatrix.length;
  }
  public set RowNum(value: number) {
    var newValue = Math.max(value, 1);
    var oldValue = this.RowNum;
    if (newValue != oldValue) {
      if (newValue > oldValue) {
        this.InsertRows(oldValue, newValue - oldValue);
      } else {
        this.DeleteRows(newValue, oldValue - newValue);
      }
    }
  }

  public WEBUnits: Array<RectMazeUnitBase>;
  @observable
  private _Units: Array<RectMazeUnitBase>;
  @Expose()
  // @Type(() => RectMazeUnitBase)
  public get Units(): Array<RectMazeUnitBase> {
    var result = new Array<RectMazeUnitBase>();
    if (this.UnitsMatrix != null) {
      this.UnitsMatrix.forEach(row => {
        result.push(...row);
      });
    }
    return result;
  }
  public set Units(v: Array<RectMazeUnitBase>) {
    this.WEBUnits = v.map(x => {
      var result = ObjHelper.ConvertObj(
        this.UnitVMType,
        x,
        TypeMapHelper.CommonTypeMap,
      );
      return result;
    });
  }
  @observable
  private _UnitsMatrix: Array<Array<RectMazeUnitBase>>;
  public get UnitsMatrix(): Array<Array<RectMazeUnitBase>> {
    if (!this._UnitsMatrix)
      this._UnitsMatrix = new Array<Array<RectMazeUnitBase>>();
    return this._UnitsMatrix;
  }
  public set UnitsMatrix(v: Array<Array<RectMazeUnitBase>>) {
    this._UnitsMatrix = v;
  }

  //#region 操作行列数变化（引起RedoUndo）
  public InsertRows(rowIndex: number, count: number = 1): void {
    rowIndex = Math.max(0, Math.min(this.RowNum, rowIndex));
    var colNum = Math.max(1, this.ColNum);
    ActionManager.Instance.ExcuteWithoutPutInHistory = !this.CanRecordRedoUndo; //防止复制时记录
    ActionManager.Instance.CreateTransaction();
    for (let i = 0; i < count; i++) {
      var row = new Array<RectMazeUnitBase>();
      RUHelper.AddItem(this.UnitsMatrix, row, rowIndex);
      for (let j = 0; j < colNum; j++) {
        var unitVM = new this.UnitVMType() as RectMazeUnitBase;
        unitVM.Father = this;
        if (unitVM != null)
          RUHelper.AddItem(this.UnitsMatrix[rowIndex], unitVM);
      }
    }
    RUHelper.Core.CommitTransaction(this.SyncIndexs.bind(this));
    ActionManager.Instance.ExcuteWithoutPutInHistory = false;
  }

  public InsertCols(colIndex: number, count: number = 1): void {
    if (this.UnitsMatrix.length == 0)
      this.UnitsMatrix.push(new Array<RectMazeUnitBase>());
    colIndex = Math.max(0, Math.min(this.ColNum, colIndex));
    var rowNum = Math.max(1, this.RowNum);
    ActionManager.Instance.ExcuteWithoutPutInHistory = !this.CanRecordRedoUndo; //防止复制时记录
    ActionManager.Instance.CreateTransaction();

    for (let i = 0; i < rowNum; i++) {
      var row = this.UnitsMatrix[i];
      for (let j = 0; j < count; j++) {
        var unitVM = new this.UnitVMType() as RectMazeUnitBase;
        unitVM.Father = this;
        if (unitVM != null) {
          RUHelper.AddItem(row, unitVM, colIndex + j);
        }
      }
    }

    RUHelper.Core.CommitTransaction(this.SyncIndexs.bind(this));
    ActionManager.Instance.ExcuteWithoutPutInHistory = false;
  }

  public DeleteRows(rowIndex: number, count: number = 1): void {
    var rowNum = this.RowNum;
    if (rowIndex < 0 || rowIndex >= rowNum) return;

    if (rowIndex + count - 1 >= rowNum) return;

    if (count >= rowNum)
      //不能删完
      return;

    ActionManager.Instance.CreateTransaction();
    for (let i = 0; i < count; i++)
      RUHelper.RemoveItem(this.UnitsMatrix, this.UnitsMatrix[rowIndex]); //删掉
    ActionManager.Instance.CommitTransaction(this.SyncIndexs.bind(this));
  }

  public DeleteCols(colIndex: number, count: number = 1): void {
    var colNum = this.ColNum;
    var rowNum = this.RowNum;
    if (colIndex < 0 || colIndex >= colNum) return;

    if (colIndex + count - 1 >= colNum) return;

    if (count >= colNum)
      //不能删完
      return;

    ActionManager.Instance.CreateTransaction();
    for (let r = 0; r < rowNum; r++) {
      var row = this.UnitsMatrix[r];
      for (let i = 0; i < count; i++) RUHelper.RemoveItem(row, row[colIndex]); //删掉
    }
    ActionManager.Instance.CommitTransaction(this.SyncIndexs.bind(this));
  }

  public SyncIndexs(): void {
    let rowindex = 0,
      colindex = 0;
    if (this.UnitsMatrix != null) {
      this.UnitsMatrix?.forEach(rowCollection => {
        colindex = 0;
        rowCollection.forEach(unit => {
          unit.ColIndex = colindex;
          unit.RowIndex = rowindex;
          colindex++;
        });

        rowindex++;
      });
    }
  }

  //#endregion
  @observable
  private _SelectedUnits: Array<RectMazeUnitBase>;
  @batch(ClassType.object)
  public get SelectedUnits(): Array<RectMazeUnitBase> {
    if (!this._SelectedUnits) this._SelectedUnits = [];
    return this._SelectedUnits;
  }
  public set SelectedUnits(v: Array<RectMazeUnitBase>) {
    this._SelectedUnits = v;
  }

  SetUnits(rowNum: number, colNum: number, reslib: Array<CWResource>) {
    if (
      this.WEBUnits != null &&
      rowNum > 0 &&
      colNum > 0 &&
      this.WEBUnits.length == rowNum * colNum
    ) {
      this.UnitsMatrix = null;
      this.UnitsMatrix = [];
      for (let i = 0; i < this.WEBUnits.length; i++) {
        var rowindex = Math.floor(i / colNum);
        var colindex = i % colNum;
        if (colindex == 0) {
          this.UnitsMatrix.push([]);
        }
        this.WEBUnits[i].SeachRes(reslib);
        this.WEBUnits[i].Father = this;
        this.UnitsMatrix[rowindex].push(this.WEBUnits[i]);
      }
      this.WEBUnits = null;
    }
  }

  public UnselectAll() {
    this.Units?.forEach(item => {
      item.IsSelected = false;
    });
  }

  public HideUniqueToolbar() {
    super.HideUniqueToolbar();
    this.UnselectAll();
  }

  public ShowUniqueToolbar(itemView: HTMLElement) {
    super.ShowUniqueToolbar(itemView);
  }

  public SetResourcesFromLib(reslib: CWResource[]) {
    if (!reslib) return;
    this.Background?.SearchResource(reslib);
    this.SetUnits(this.RowNum, this.ColNum, reslib);
  }

  public GetDependencyResources(): CWResource[] {
    var res: CWResource[] = [];
    if (this.Background != null && this.Background.Resource != null)
      res.push(this.Background.Resource);
    if (this.Units != null && this.Units.length > 0)
      this.Units.forEach(unit => {
        res.push(...unit.GetDependencyResources());
      });
    return res;
  }

  public AttachResource(source: CWResource) {
    if (source != null) {
      if (source.resourceType == CWResourceTypes.Image) {
        this.Background = new ResourceRef(source);
      } else if (
        source.resourceType == CWResourceTypes.SkeletalAni &&
        source.boneList != null &&
        source.boneList.length > 0
      ) {
        this.Background = new SkResRef(source, source.boneList[0].value, 0);
      }
    }
  }
}
