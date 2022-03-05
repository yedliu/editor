import React from 'react';
import CWElement from '../../../cwElement';
import CWResource from '../../../cwResource';
import { from } from 'linq-to-typescript';
import { batch } from '@/server/CacheEntityServer';
import IPropUndoable from '@/redoundo/IPropUndoable';
import WritingUnitBase from './WritingUnitBase';
import { observable } from 'mobx';
import RUHelper from '@/redoundo/redoUndoHelper';
import { Expose, Type } from '@/class-transformer';
import { ClassType } from '../../../courseDetailenum';
import MathHelper from '@/utils/MathHelper';
import IdHelper from '@/utils/idHelper';
import { Point2D, GeometryHelper } from '@/utils/Math2D';
import UIHelper from '@/utils/uiHelper';
import { ResourceRef } from '@/modelClasses/courseDetail/resRef/resourceRef';
import KeyHelper from '@/utils/keyHelper';

export default class WritingUnit extends WritingUnitBase {
  constructor() {
    super();
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
    }
  }

  @observable
  private _Group: number;
  @Expose()
  @batch(ClassType.number)
  public get Group(): number {
    return this._Group;
  }
  public set Group(v: number) {
    if (this.Father != null) this.Father.StrokesCount = v;

    this._Group = v;
  }

  private startMovePositions: Point2D[] = null;
  private mouseStartPosition: Point2D = null;
  private mouseDownHtmlElement: HTMLElement = null;

  private IsSelectedInDesign: Boolean = false;

  public PressLogicItem(e: React.MouseEvent<HTMLElement>) {
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
        var canvas = UIHelper.FindAncestorByClassName(
          uiElement,
          'WritingCanvas',
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
      }
    }
  }

  public MoveLogicItem(e: React.MouseEvent<HTMLElement>) {
    if (this.mouseDownHtmlElement != null && this != null) {
      if (e.button == 0 && this.mouseStartPosition != null) {
        var canvas = UIHelper.FindAncestorByClassName(
          this.mouseDownHtmlElement,
          'WritingCanvas',
        );
        var movedelta = GeometryHelper.GetPosition(
          canvas,
          new Point2D(e.clientX, e.clientY),
        ).minus(this.mouseStartPosition);
        //.minus(this.mouseStartPosition);
        //movedelta.minus(this.mouseStartPosition);

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
        // this.X =this.Position.x,
        // this.Y =this.Position.y,
        RUHelper.Core.CommitTransaction();
      }
    }
  }
  public ReleaseLogicItem(e: React.MouseEvent<HTMLElement>) {
    this.mouseStartPosition = null;
    this.startMovePositions = null;
    this.mouseDownHtmlElement = null;
  }
}
