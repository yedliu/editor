import { batch } from '@/server/CacheEntityServer';
import IPropUndoable from '@/redoundo/IPropUndoable';
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
import listBlockBaseComple from './listBlockBaseComple';

export default class listBlockComplex extends listBlockBaseComple {
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
  private _IsSelected: boolean = false;
  @batch(ClassType.bool)
  public get IsSelected(): boolean {
    return this._IsSelected;
  }
  public set IsSelected(v: boolean) {
    this._IsSelected = v;
    if (this._IsSelected) {
      //this.Father.UnselectAll();//取消底板选中

      this.Father?.SelectedUnitsBlock.push(this);
    } else {
      var index = this.Father?.SelectedUnitsBlock.indexOf(this);
      if (index > -1) {
        this.Father?.SelectedUnitsBlock.splice(index, 1);
      }
    }
  }

  //#endregion

  //#region 资源加载
  public GetDependencyResources(): CWResource[] {
    var res = super.GetDependencyResources();
    return res;
  }

  public SeachRes(reslib: Array<CWResource>) {
    super.SetResourcesFromLib(reslib);
  }
  //#endregion

  //#region 方法

  //#region 拖动

  //#region  选中自己
  public SelectUnit() {
    this.Father?.UnselectAllBlock();
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

        if (KeyHelper.checkCtrlOrMeta(e)) this.IsSelected = true;
        else {
          if (!this.IsSelected) {
            this.Father?.UnselectAllBlock();
            this.IsSelected = true;
          }
        }
        var isonMove = false;

        this.startMovePositions = this.Father.SelectedUnitsBlock?.map(
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
        this.Father.SelectedUnitsBlock?.forEach(
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
    for (var i = 0; i < this.Father.RanksCount; i++) {
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
}
