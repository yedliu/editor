import { batch } from '@/server/CacheEntityServer';
import IPropUndoable from '@/redoundo/IPropUndoable';
import jigsawPuzzleBaseViewModel from './jigsawPuzzleBaseViewModel';
import { ClassType } from '@/modelClasses/courseDetail/courseDetailenum';
import { observable } from 'mobx';
import { Expose, Type } from '@/class-transformer';
import MathHelper from '@/utils/MathHelper';
import { Point2D, GeometryHelper } from '@/utils/Math2D';
import UIHelper from '@/utils/uiHelper';
import KeyHelper from '@/utils/keyHelper';
import RUHelper from '@/redoundo/redoUndoHelper';
import React from 'react';
import CWResource from '@/modelClasses/courseDetail/cwResource';
import { ResourceRef } from '@/modelClasses/courseDetail/resRef/resourceRef';

export default class jigsawPuzzleUnitBaseViewModel implements IPropUndoable {
  public Father: jigsawPuzzleBaseViewModel;

  public get CanRecordRedoUndo(): boolean {
    return this.Father != null && this.Father.CanRecordRedoUndo;
  }

  constructor() {}

  //#region 属性

  @Expose()
  @batch()
  Id: string;

  CurrentPosition: Point2D;

  @observable
  private _X: number = 0;
  @batch(ClassType.number)
  @Expose()
  public get X(): number {
    return MathHelper.round(this._X, 2);
  }
  public set X(v: number) {
    RUHelper.TrySetPropRedoUndo(this, 'X', () => (this._X = v), v, this._X);
  }

  @observable
  private _Y: number = 0;
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
  private _Width: number = 0;
  @batch(ClassType.number)
  @Expose()
  public get Width(): number {
    if (!this.Father) return 0;

    return MathHelper.round(this.Father.CellWidth * this.RanksCount, 2);
    //return MathHelper.round(this._Width, 2);
  }
  public set Width(v: number) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'Width',
      () => (this._Width = v),
      v,
      this._Width,
    );
  }

  @observable
  private _Height: number = 0;
  @batch(ClassType.number)
  @Expose()
  public get Height(): number {
    if (!this.Father) return 0;
    return MathHelper.round(this.Father.CellHeight * this.RanksCount, 2);
    //return MathHelper.round(this._Height, 2);
  }
  public set Height(v: number) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'Height',
      () => (this._Height = v),
      v,
      this._Height,
    );
  }

  @observable
  private _RanksCount: number;
  @batch(ClassType.number)
  @Expose()
  public get RanksCount(): number {
    return this._RanksCount;
  }
  public set RanksCount(v: number) {
    this._RanksCount = v;
  }

  @observable
  private _IsSelected: boolean = false;
  @batch(ClassType.bool)
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

  //#region 答案

  @observable
  private _AnswersRow: number = 0;
  @batch(ClassType.number)
  @Expose()
  public get AnswersRow(): number {
    return this._AnswersRow;
  }
  public set AnswersRow(v: number) {
    this._AnswersRow = v;
  }

  @observable
  private _AnswersColumn: number = 0;
  @batch(ClassType.number)
  @Expose()
  public get AnswersColumn(): number {
    return this._AnswersColumn;
  }
  public set AnswersColumn(v: number) {
    this._AnswersColumn = v;
  }

  @observable
  private _AnswersAngle: string;
  @batch(ClassType.string)
  @Expose()
  public get AnswersAngle(): string {
    return this._AnswersAngle;
  }
  public set AnswersAngle(v: string) {
    this._AnswersAngle = v;
  }

  //#endregion

  //#region 边距 旋转

  @observable
  private _Angle: number = 0;
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

  //#endregion

  //#region 资源

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
  private _ChoiceNormalRes: ResourceRef;
  @Expose()
  @batch(ClassType.resource)
  @Type(() => ResourceRef)
  public get ChoiceNormalRes(): ResourceRef {
    return this._ChoiceNormalRes;
  }
  public set ChoiceNormalRes(v: ResourceRef) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'ChoiceNormalRes',
      () => (this._ChoiceNormalRes = v),
      v,
      this._ChoiceNormalRes,
    );
  }

  //#endregion

  //#endregion

  //#region 资源加载
  public GetDependencyResources(): CWResource[] {
    var res: CWResource[] = [];
    if (this.NormalRes != null && this.NormalRes.Resource != null)
      res.push(this.NormalRes.Resource);
    if (this.ChoiceNormalRes != null && this.ChoiceNormalRes.Resource != null)
      res.push(this.ChoiceNormalRes.Resource);

    return res;
  }

  @batch(ClassType.object)
  public SeachRes(reslib: Array<CWResource>) {
    this.NormalRes?.SearchResource(reslib);
    this.ChoiceNormalRes?.SearchResource(reslib);
  }
  //#endregion

  //#region 方法

  //#region 拖动

  //#region  选中自己
  public SelectUnit() {
    this.Father?.UnselectAll();
    this.IsSelected = true;
  }
  //#endregion

  private startMovePositions: Point2D[] = null;
  private mouseStartPosition: Point2D = null;
  private mouseDownHtmlElement: HTMLElement = null;

  private IsSelectedInDesign: Boolean = false;

  public DragItemCanvas(e: React.MouseEvent<HTMLElement>) {
    var uiElement = e.target as HTMLElement;
    if (uiElement != null) {
      if (e.button == 0) {
        e.stopPropagation();
        e.preventDefault();

        if (KeyHelper.checkCtrlOrMeta(e)) this.IsSelected = !this.IsSelected;
        else {
          if (!this.IsSelected) {
            this.Father?.UnselectAll();
            this.IsSelected = true;
          }
        }
        var isonMove = false;

        this.startMovePositions = this.Father.SelectedUnits?.map(
          x => x.Position,
        );
        var canvas = UIHelper.FindAncestorByClassName(uiElement, 'DragCanvas');
        this.mouseStartPosition = GeometryHelper.GetPosition(
          canvas,
          new Point2D(e.clientX, e.clientY),
        );

        uiElement.focus();
        this.mouseDownHtmlElement = uiElement;

        const onMove = e => {
          isonMove = true;
          this.MoveLogicItem(e);
        };
        const onUp = e => {
          document.removeEventListener('mousemove', onMove);
          document.removeEventListener('mouseup', onUp);
          this.ReleaseLogicItem(e);
        };

        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);
      }
    }
  }

  public MoveLogicItem(e: React.MouseEvent<HTMLElement>) {
    if (this.mouseDownHtmlElement != null && this != null) {
      if (e.button == 0 && this.mouseStartPosition != null) {
        var canvas = UIHelper.FindAncestorByClassName(
          this.mouseDownHtmlElement,
          'DragCanvas',
        );
        var movedelta = GeometryHelper.GetPosition(
          canvas,
          new Point2D(e.clientX, e.clientY),
        ).minus(this.mouseStartPosition);

        var StageScale = this.Father.Scene.Courseware.StageScale;
        movedelta.x = movedelta.x * (1 / StageScale);
        movedelta.y = movedelta.y * (1 / StageScale);

        RUHelper.Core.CreateTransaction('MoveLogicDItem');
        var i = 0;
        this.Father.SelectedUnits?.forEach(
          x =>
            (x.Position = movedelta.translatePoint(
              this.startMovePositions[i++],
            )),
        );
        RUHelper.Core.CommitTransaction();
      }
    }
  }
  public ReleaseLogicItem(e: React.MouseEvent<HTMLElement>) {
    this.AdsorbXY();
    this.mouseStartPosition = null;
    this.startMovePositions = null;
    this.mouseDownHtmlElement = null;
  }

  //#endregion

  //#endregion

  public AdsorbXY() {
    //超出范不吸附
    if (
      this.X < 0 ||
      this.X > this.Father.Width ||
      this.Y < 0 ||
      this.Y > this.Father.Height
    )
      return;

    var distance: any[] = []; // = new Dictionary<double, Point>()
    var matrix: any[] = []; // = new Dictionary<double, Poivarnt>()
    var mixKey = 99999;
    var mixDistance;
    var adsorbPoint;
    for (var i = 0; i < this.Father.Linefeed; i++) {
      for (
        var j = 0;
        j < this.Father.Height / this.Father.CellHeight - 1;
        j++
      ) {
        var p = new Point2D(
          this.Father.CellWidth * i,
          this.Father.CellHeight * j,
        );
        var width = this.X - p.x;
        var height = this.Y - p.y;
        var result = width * width + height * height;
        result = Math.sqrt(result);
        var key = result;

        if (mixKey > key) {
          mixKey = key;
          mixDistance = p;
          adsorbPoint = new Point2D(j, i);
        }
      }
    }
    this.X = mixDistance.x;
    this.Y = mixDistance.y;
    console.log(
      'x-' + this.X + '--y-' + this.Y + '---CellWidth-' + this.Father.CellWidth,
    );
    this.CurrentPosition = adsorbPoint;
    distance = null;
    matrix = null;
  }

  @batch(ClassType.object)
  public SetSolutionCommand() {
    if (
      this.X < 0 ||
      this.X > this.Father.Width ||
      this.Y < 0 ||
      this.Y > this.Father.Height
    ) {
      this.AnswersRow = 0;
      this.AnswersColumn = 0;
    } else if (this.CurrentPosition != null) {
      this.AnswersRow = parseInt(this.CurrentPosition.x.toString());
      this.AnswersColumn = parseInt(this.CurrentPosition.y.toString());
    }
  }
}
