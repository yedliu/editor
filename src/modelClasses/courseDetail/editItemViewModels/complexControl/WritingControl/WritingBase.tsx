import CWElement from '../../../cwElement';
import CWResource from '../../../cwResource';
import { batch } from '@/server/CacheEntityServer';
import IPropUndoable from '@/redoundo/IPropUndoable';
import WritingUnitBase from './WritingUnitBase';
import WritingUnit from './WritingUnit';
import WritingPointGroup from './WritingPointGroup';
import ActionManager from '@/redoundo/actionManager';
import RUHelper from '@/redoundo/redoUndoHelper';
import { from, elementAtOrDefault } from 'linq-to-typescript';
import { array } from 'prop-types';
import { Expose, Type, plainToClass, classToPlain } from '@/class-transformer';
// import { observable } from 'mobx';

import { observable, computed } from 'mobx';
import { ResourceRef, SkResRef } from '../../../resRef/resourceRef';
import {
  AnimationType,
  IncludedType,
  ZoomType,
  AppearTypes,
  ClassType,
  ElementTypes,
  CWResourceTypes,
} from '../../../courseDetailenum';
import InvokeTriggerBase from '../../../triggers/invokeTriggerBase';
import ObjHelper from '@/utils/objHelper';
import TypeMapHelper from '@/configs/typeMapHelper';

export default class WritingBase extends CWElement {
  protected UnitVMType: new (...args: any[]) => any = WritingUnit;

  constructor() {
    super();
  }

  //@observable
  private _IsCloseList: any;
  @Expose()
  @Type(() => Map)
  public get IsCloseList(): any {
    var newCloseList = new Map<string, boolean>();
    this.PointGroup.forEach(row => {
      newCloseList.set(row.Group.toString(), row.IsClose);
    });
    return newCloseList;
  }
  public set IsCloseList(v: any) {
    this._IsCloseList = v;
  }

  public WEBUnits: Array<WritingUnit>;
  @observable
  private _Units: Array<WritingUnit>;
  @Expose()
  public get Units(): Array<WritingUnit> {
    var result = new Array<WritingUnit>();
    this.PointGroup.forEach(row => {
      row.PointList.forEach(rowj => {
        //rowj.IsClose = row.IsClose;
        result.push(rowj);
      });
    });
    return result;
  }

  public set Units(v: Array<WritingUnit>) {
    // this.WEBUnits = v.map(x => {
    //   return plainToClass(this.UnitVMType, classToPlain(x));
    // });
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
  private _PointGroup: Array<WritingPointGroup>;
  @batch(ClassType.object)
  public get PointGroup(): Array<WritingPointGroup> {
    if (!this._PointGroup) this._PointGroup = new Array<WritingPointGroup>();
    return this._PointGroup;
  }
  public set PointGroup(v: Array<WritingPointGroup>) {
    this._PointGroup = v;
  }

  @observable
  private _SelectedPointGroupValue: WritingPointGroup;
  @batch(ClassType.object)
  public get SelectedPointGroupValue(): WritingPointGroup {
    return this._SelectedPointGroupValue;
  }
  public set SelectedPointGroupValue(v: WritingPointGroup) {
    if (v != null) this.ShowAllPoint = false;
    this._SelectedPointGroupValue = v;
  }

  // @batch()
  // @Expose()

  @observable
  private _SelectedUnits: Array<WritingUnit>;
  @batch(ClassType.object)
  public get SelectedUnits(): Array<WritingUnit> {
    if (!this._SelectedUnits) this._SelectedUnits = new Array<WritingUnit>();
    return this._SelectedUnits;
  }
  public set SelectedUnits(v: Array<WritingUnit>) {
    this._SelectedUnits = v;
  }

  public UnselectAll() {
    // this._SelectedUnits?.forEach(item => {
    //   item.IsSelected = false;
    // });
    if (this._SelectedUnits) {
      do {
        if (this._SelectedUnits?.length < 1) break;
        this._SelectedUnits[0].IsSelected = false;
      } while (true);
    }
  }

  public HideUniqueToolbar() {
    super.HideUniqueToolbar();
    this.UnselectAll();
  }

  public ShowUniqueToolbar(itemView: HTMLElement) {
    super.ShowUniqueToolbar(itemView);
  }

  //#region 读取资源

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
  private _Texture: ResourceRef;
  @Expose()
  @batch(ClassType.resource)
  @Type(() => ResourceRef)
  public get Texture(): ResourceRef {
    return this._Texture;
  }
  public set Texture(v: ResourceRef) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'Texture',
      () => (this._Texture = v),
      v,
      this._Texture,
    );
  }

  public SetResourcesFromLib(reslib: CWResource[]) {
    if (!reslib) return;
    this.Background?.SearchResource(reslib);
    this.Texture?.SearchResource(reslib);

    this.InitUnits(reslib);
  }

  ///初始化获取的参数
  public InitUnits(reslib) {
    if (this.WEBUnits != null) {
      this.PointGroup = null;
      this.PointGroup = Array<WritingPointGroup>();
      for (let i = 0; i < this.WEBUnits.length; i++) {
        this.WEBUnits[i].SeachRes(reslib);
        this.WEBUnits[i].Father = this;
        if (
          this.PointGroup.filter(x => x.Group == this.WEBUnits[i].Group)
            .length == 0
        ) {
          var unit = new WritingPointGroup();
          //unit.IsClose = this.WEBUnits[i].IsClose;
          unit.Group = this.WEBUnits[i].Group;

          //通过key拿到值
          if (
            this._IsCloseList &&
            this._IsCloseList.has(this.WEBUnits[i].Group.toString())
          ) {
            unit.IsClose = this._IsCloseList.get(
              this.WEBUnits[i].Group.toString(),
            );
          }

          this.PointGroup.push(unit);
        }
        var val = this.PointGroup.filter(
          x => x.Group == this.WEBUnits[i].Group,
        );
        if (val && val.length > 0) {
          this.WEBUnits[i].SerialNumber = val[0].PointList.length + 1; // 旧版本结构重新给ID
          val[0].PointList.push(this.WEBUnits[i]);
        }
      }
      this.WEBUnits = null;
    } else {
    }
  }

  public GetDependencyResources(): CWResource[] {
    var res: CWResource[] = [];
    if (this.Background != null && this.Background.Resource != null)
      res.push(this.Background.Resource);
    if (this.Texture != null && this.Texture.Resource != null)
      res.push(this.Texture.Resource);

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

      if (source.resourceType == CWResourceTypes.Image) {
        this.Texture = new ResourceRef(source);
      } else if (
        source.resourceType == CWResourceTypes.SkeletalAni &&
        source.boneList != null &&
        source.boneList.length > 0
      ) {
        this.Texture = new SkResRef(source, source.boneList[0].value, 0);
      }
    }
  }

  @observable
  private _StrokesCount: number = 1;
  @batch()
  @Expose()
  public get StrokesCount(): number {
    return this._StrokesCount;
  }
  public set StrokesCount(v: number) {
    this._StrokesCount = v;
  }

  @observable
  private _Radius: number = 25;

  @batch()
  @Expose()
  public get Radius(): number {
    return this._Radius;
  }
  public set Radius(v: number) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'Radius',
      () => (this._Radius = v),
      v,
      this._Radius,
    );
  }

  public get Diameter(): number {
    return this._Radius * 2;
  }

  @observable
  private _Color: string = '#FF8EFFFA';

  @batch()
  @Expose()
  public get Color(): string {
    return this._Color;
  }

  @batch()
  public get subColor(): string {
    var valColor = this._Color;
    let alpha = valColor ? (1 / 255) * parseInt(valColor.substr(1, 2), 16) : 1;
    let disposeColor = {
      color: valColor
        ? `rgba(
                      ${parseInt(valColor.substr(3, 2), 16)},
                      ${parseInt(valColor.substr(5, 2), 16)},
                      ${parseInt(valColor.substr(7, 2), 16)}, ${alpha})`
        : '',
    };
    return disposeColor.color;

    //return '#' + this._Color?.substring(3);
  }
  public set Color(v: string) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'Color',
      () => (this._Color = v),
      v,
      this._Color,
    );
  }

  @observable
  private _StrokeWidth: number = 25;

  @batch()
  @Expose()
  public get StrokeWidth(): number {
    return this._StrokeWidth;
  }
  public set StrokeWidth(v: number) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'StrokeWidth',
      () => (this._StrokeWidth = v),
      v,
      this._StrokeWidth,
    );
  }

  @observable
  private _JudgeMode: number;

  @batch()
  @Expose()
  public get JudgeMode(): number {
    return this._JudgeMode;
  }
  public set JudgeMode(v: number) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'JudgeMode',
      () => (this._JudgeMode = v),
      v,
      this._JudgeMode,
    );
  }

  @observable
  private _WritingMode: number;

  @batch()
  @Expose()
  public get WritingMode(): number {
    return this._WritingMode;
  }
  public set WritingMode(v: number) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'WritingMode',
      () => (this._WritingMode = v),
      v,
      this._WritingMode,
    );
  }

  @observable
  private _KeepHandwriting: boolean = true;

  @batch()
  @Expose()
  public get KeepHandwriting(): boolean {
    return this._KeepHandwriting;
  }
  public set KeepHandwriting(v: boolean) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'KeepHandwriting',
      () => (this._KeepHandwriting = v),
      v,
      this._KeepHandwriting,
    );
  }

  @observable
  private _StrokePrompt: boolean = true;

  @batch()
  @Expose()
  public get StrokePrompt(): boolean {
    return this._StrokePrompt;
  }
  public set StrokePrompt(v: boolean) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'StrokePrompt',
      () => (this._StrokePrompt = v),
      v,
      this._StrokePrompt,
    );
  }

  //

  @observable
  private _ShowAllPoint: boolean = false;

  @batch()
  public get ShowAllPoint(): boolean {
    return this._ShowAllPoint;
  }
  public set ShowAllPoint(v: boolean) {
    this._ShowAllPoint = v;
    // RUHelper.TrySetPropRedoUndo(
    //   this,
    //   'ShowAllPoint',
    //   () => (this._ShowAllPoint = v),
    //   v,
    //   this._ShowAllPoint,
    // );
  }

  @observable
  private _ShowRemind: string = 'Alt+鼠标左键添加点';
  @batch()
  public get ShowRemind(): string {
    return this._ShowRemind;
  }
  public set ShowRemind(v: string) {
    this._ShowRemind = v;
  }
}
