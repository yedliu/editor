import { batch } from '@/server/CacheEntityServer';
import IPropUndoable from '@/redoundo/IPropUndoable';
import speechRecognitionBaseViewModel from './speechRecognitionBaseViewModel';
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

export default class speechRecognitionUnitBaseViewModel
  implements IPropUndoable {
  protected UnitVMType: new (
    ...args: any[]
  ) => any = speechRecognitionUnitBaseViewModel;

  public Father: speechRecognitionBaseViewModel;

  public get CanRecordRedoUndo(): boolean {
    return this.Father != null && this.Father.CanRecordRedoUndo;
  }

  constructor() {}

  @observable
  private _Id: string;
  @batch(ClassType.string)
  @Expose()
  public get Id(): string {
    return this._Id;
  }
  public set Id(v: string) {
    this._Id = v;
  }

  @observable
  private _ModelType: string;
  @batch(ClassType.string)
  @Expose()
  public get ModelType(): string {
    return this._ModelType;
  }
  public set ModelType(v: string) {
    this._ModelType = v;
  }

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
  private _Width: number;
  @batch(ClassType.number)
  @Expose()
  public get Width(): number {
    return MathHelper.round(this._Width, 2);
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

  @batch()
  public get unitPercentSize(): number {
    if (
      this.NormalRes != null &&
      this.NormalRes.Resource.width > 0 &&
      this.NormalRes.Resource.height > 0
    ) {
      var widthScale = this.Width / this.NormalRes.Resource.width;
      var heightScale = this.Height / this.NormalRes.Resource.height;
      if (
        widthScale != 0 &&
        heightScale != 0 &&
        widthScale / heightScale < 1.001 &&
        heightScale / widthScale < 1.001
      ) {
        return Math.round(widthScale * 10000.0) / 100.0; //防止因精度问题造成EditItemGroup取得的属性不相等为null
      }
    }
    return null;
  }

  public set unitPercentSize(v: number) {
    if (
      this.NormalRes != null &&
      this.NormalRes.Resource.width > 0 &&
      this.NormalRes.Resource.height > 0 &&
      v != null &&
      v > 0
    ) {
      this.Width = (this.NormalRes.Resource.width * Number(v)) / 100.0;
      this.Height = (this.NormalRes.Resource.height * Number(v)) / 100.0;
    }
  }

  @observable
  private _flipX: boolean = false;
  @batch(ClassType.bool)
  @Expose()
  public get FlipX(): boolean {
    // 是否横向翻转
    return this._flipX == true;
  }
  public set FlipX(v: boolean) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'FlipX',
      () => (this._flipX = v),
      v,
      this.FlipX,
    );
  }
  @observable
  private _flipY: boolean = false;
  @batch(ClassType.bool)
  @Expose()
  public get FlipY(): boolean {
    // 是否纵向翻转
    return this._flipY == true;
  }

  public set FlipY(v: boolean) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'FlipY',
      () => (this._flipY = v),
      v,
      this.FlipY,
    );
  }

  @observable private _Angle: number = 0; // 元素旋转角度
  @batch()
  @Expose()
  public get Angle(): number {
    return MathHelper.round(this._Angle ? this._Angle : 0, 2);
  }

  public set Angle(v: number) {
    var newValue = MathHelper.round(v, 2);
    RUHelper.TrySetPropRedoUndo(
      this,
      'Angle',
      () => (this._Angle = newValue),
      newValue,
      this.Angle,
    );
  }

  @observable
  private _Height: number;
  @batch(ClassType.number)
  @Expose()
  public get Height(): number {
    return MathHelper.round(this._Height, 2);
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
  private _IsEditText: boolean = false;
  // @Expose()
  @batch(ClassType.bool)
  public get IsEditText(): boolean {
    return this._IsEditText;
  }
  public set IsEditText(v: boolean) {
    this._IsEditText = v;
  }

  @observable
  private _IsSelected: boolean = false;
  // @Expose()
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
      this.IsEditText = false;
    }
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

  //#region  命令

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

  public DoubleClick(e: React.MouseEvent<HTMLElement>) {
    this.IsEditText = true;
  }

  public UnitOnMouseUp(e: React.MouseEvent<HTMLElement>) {
    if (
      this.Father?.AllUnits.filter(
        x => x.ModelType == 'TextTemplate' && x.IsSelected,
      ).length < 1
    )
      this.Father.HandShowToolbar = false;
  }

  public DragSize(e: React.MouseEvent<HTMLElement>, direction) {
    var uiElement = e.target as HTMLElement;
    if (uiElement != null) {
      if (e.button == 0) {
        e.stopPropagation();
        e.preventDefault();
        var isonMove = false;
        this.startMovePositions = this.Father.SelectedUnits?.map(
          x => x.Position,
        );

        var Xs = new Array<any>();
        var Ys = new Array<any>();
        var Widths = new Array<any>();
        var Heights = new Array<any>();
        this.Father.SelectedUnits?.map(x => {
          Xs.push(x.X);
          Ys.push(x.Y);
          Widths.push(x.Width);
          Heights.push(x.Height);
        });

        var canvas = UIHelper.FindAncestorByClassName(uiElement, 'unit');
        this.mouseStartPosition = GeometryHelper.GetPosition(
          canvas,
          new Point2D(e.clientX, e.clientY),
        );
        uiElement.focus();
        this.mouseDownHtmlElement = uiElement;
        const onMove = e => {
          isonMove = true;
          this.MoveDragSize(e, Xs, Ys, Widths, Heights, direction);
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

  public MoveDragSize(
    e: React.MouseEvent<HTMLElement>,
    Xs,
    Ys,
    Widths,
    Heights,
    direction,
  ) {
    if (this.mouseDownHtmlElement != null && this != null) {
      if (e.button == 0 && this.mouseStartPosition != null) {
        var canvas = UIHelper.FindAncestorByClassName(
          this.mouseDownHtmlElement,
          'unit',
        );
        var movedelta = GeometryHelper.GetPosition(
          canvas,
          new Point2D(e.clientX, e.clientY),
        ).minus(this.mouseStartPosition);

        var StageScale = this.Father.Scene.Courseware.StageScale;
        movedelta.x = movedelta.x * (1 / StageScale);
        movedelta.y = movedelta.y * (1 / StageScale);

        RUHelper.Core.CreateTransaction('MoveDragUnitItem');
        var i = 0;
        this.Father.SelectedUnits?.forEach(x => {
          if (direction == 'left') {
            var leftOffset =
              Xs[i] - movedelta.translatePoint(this.startMovePositions[i]).x;
            var leftWidth = x.Width + leftOffset;
            if (leftWidth > 10) {
              x.X = x.X - leftOffset;
              x.Width = leftWidth;
            }
          } else if (direction == 'right') {
            var offset =
              x.Position.x -
              movedelta.translatePoint(this.startMovePositions[i]).x;
            var ridthWidth = Widths[i] - offset;
            if (ridthWidth > 10) {
              x.Width = ridthWidth;
            }
          } else if (direction == 'top') {
            var topOffset =
              Ys[i] - movedelta.translatePoint(this.startMovePositions[i]).y;
            var lefttop = x.Height + topOffset;
            if (lefttop > 10) {
              x.Y = x.Y - topOffset;
              x.Height = lefttop;
            }
          } else if (direction == 'botton') {
            var bottonOffset =
              x.Position.y -
              movedelta.translatePoint(this.startMovePositions[i]).y;
            var bottonWidth = Heights[i] - bottonOffset;
            if (bottonWidth > 10) {
              x.Height = bottonWidth;
            }
          }
          i++;
        });
        RUHelper.Core.CommitTransaction();
      }
    }
  }

  public PressLogicItem(e: React.MouseEvent<HTMLElement>) {
    var uiElement = e.target as HTMLElement;
    if (uiElement != null) {
      if (e.button == 0) {
        // e.stopPropagation();
        // e.preventDefault();

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
        var canvas = UIHelper.FindAncestorByClassName(
          uiElement,
          'speechRecognitionCanvas',
        );
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

        if (this.ModelType == 'TextTemplate') {
          if (this.IsSelected) {
            this.Father.HandShowToolbar = true;
          }
        }
      }
    }
  }

  public MoveLogicItem(e: React.MouseEvent<HTMLElement>) {
    if (this.mouseDownHtmlElement != null && this != null) {
      if (e.button == 0 && this.mouseStartPosition != null) {
        var canvas = UIHelper.FindAncestorByClassName(
          this.mouseDownHtmlElement,
          'speechRecognitionCanvas',
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
    this.mouseStartPosition = null;
    this.startMovePositions = null;
    this.mouseDownHtmlElement = null;
  }

  //#endregion

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
