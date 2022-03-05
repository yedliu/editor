import CWResource from './cwResource';
import {
  AnimationType,
  IncludedType,
  ZoomType,
  AppearTypes,
  ClassType,
  ElementTypes,
  ElementAnimation,
} from './courseDetailenum';
import CWPage from './cwpage';
import {
  Type,
  Exclude,
  Expose,
  classToClass,
  classToPlain,
  plainToClass,
} from '@/class-transformer';
import { Matrix2D, Point2D } from '@/utils/Math2D';

import { batch } from '@/server/CacheEntityServer';
import { observable, reaction, computed, autorun, action } from 'mobx';
import IPropUndoable from '@/redoundo/IPropUndoable';
import ActionManager from '@/redoundo/actionManager';
import { from } from 'linq-to-typescript';
import RUHelper from '@/redoundo/redoUndoHelper';
import MathHelper from '@/utils/MathHelper';
import TypeMapHelper from '@/configs/typeMapHelper';
import { InvokeTriggerSetting } from './triggers/invokeTriggerSetting';

import InvokeTriggerBase from './triggers/invokeTriggerBase';
import ObjHelper from '@/utils/objHelper';
import { ViewTemplate } from './toolbox/CustomTypeDefine';
import IdHelper from '@/utils/idHelper';
import {
  DisplayInvokeTrigger,
  ClickInvokeTrigger,
  TagedInvokeTrigger,
  LineInvokeTrigger,
  DropInvokeTrigger,
  SlideInvokeTrigger,
  LongClickInvokeTrigger,
  EnterInvokeTrigger,
  LeaveInvokeTrigger,
} from './triggers/generalTrigger';
import InvokableBase from './InvokableBase';
import EditItemView from '@/components/cwDesignUI/elements/elementItemUI';

export default class CWElement implements IPropUndoable {
  constructor() {
    this.Id = IdHelper.NewId();
  }

  //#region RedoUndo判断

  @Exclude()
  public get CanRecordRedoUndo(): boolean {
    return (
      !this.IsOprating &&
      this.Scene != null &&
      this.Scene == this.Scene.Courseware?.SelectedPage &&
      this.IsMainViewLoaded &&
      !ActionManager.Instance.ActionIsExecuting
    );
  }
  //#endregion

  @Expose() @batch() Id: string;
  @observable
  private _Name: string;
  @batch(ClassType.string)
  @Expose()
  public get Name(): string {
    return this._Name;
  }
  public set Name(v: string) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'Name',
      () => (this._Name = v),
      v,
      this._Name,
    );
  }

  @batch(ClassType.enum) @observable @Expose() ElementType: number; // 元素类型

  private _IsMainViewLoaded: boolean;
  @Exclude() //是否在被主界面渲染
  public get IsMainViewLoaded(): boolean {
    return this._IsMainViewLoaded;
  }
  public set IsMainViewLoaded(v: boolean) {
    this._IsMainViewLoaded = v;
  }

  private _MainView: EditItemView;
  /** 主界面UI结点 */
  @Exclude()
  public get MainView(): EditItemView {
    return this._MainView;
  }
  public set MainView(v: EditItemView) {
    this._MainView = v;
  }

  //#region 相对坐标

  @observable private _X: number; // 左上角X坐标

  @batch()
  @Expose()
  public get X(): number {
    return MathHelper.round(this._X, 2);
  }
  public set X(value: number) {
    var oldLeft = this.X;
    var newValue = MathHelper.round(value, 2);
    if (oldLeft != newValue) {
      RUHelper.TrySetPropRedoUndo(
        this,
        'X',
        () => (this._X = newValue),
        newValue,
        this._X,
      );
      this.Father?.ResetBoundary();
    }
  }

  @observable private _Y: number; // 左上角Y坐标

  @batch()
  @Expose()
  public get Y(): number {
    return MathHelper.round(this._Y, 2);
  }
  public set Y(value: number) {
    var oldTop = this.Y;
    var newValue = MathHelper.round(value, 2);
    if (oldTop != newValue) {
      RUHelper.TrySetPropRedoUndo(
        this,
        'Y',
        () => (this._Y = newValue),
        newValue,
        this._Y,
      );
      this.Father?.ResetBoundary();
    }
  }

  @observable protected _Width: number; // 元素宽度

  @batch()
  @Expose()
  public get Width(): number {
    return MathHelper.round(this._Width, 2);
  }
  public set Width(v: number) {
    var oldWidth = this._Width;
    if (v >= 0) {
      var newValue = MathHelper.round(v, 2);
      if (newValue != oldWidth) {
        if (
          RUHelper.TrySetPropRedoUndo(
            this,
            'Width',
            () => (this._Width = newValue),
            newValue,
            this.Width,
          )
        )
          this.Father?.ResetBoundary();
      }
    }
  }

  @observable protected _Height: number; //元素高度
  @batch()
  @Expose()
  public get Height(): number {
    return MathHelper.round(this._Height, 2);
  }
  public set Height(v: number) {
    var oldHeight = this._Height;
    if (v >= 0) {
      var newValue = MathHelper.round(v, 2);
      if (newValue != oldHeight) {
        if (
          RUHelper.TrySetPropRedoUndo(
            this,
            'Height',
            () => (this._Height = newValue),
            newValue,
            this.Height,
          )
        )
          this.Father?.ResetBoundary();
      }
    }
  }

  @batch()
  public HasSizableRes: boolean = false;

  @batch()
  public get PercentSize(): number {
    if (
      this.HasSizableRes &&
      this.Res != null &&
      this.Res.width > 0 &&
      this.Res.height > 0
    ) {
      var widthScale = this.Width / this.Res.width;
      var heightScale = this.Height / this.Res.height;
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
  public set PercentSize(v: number) {
    if (
      this.HasSizableRes &&
      this.Res != null &&
      this.Res.width > 0 &&
      this.Res.height > 0 &&
      v != null &&
      v > 0
    ) {
      this.Width = (this.Res.width * Number(v)) / 100.0;
      this.Height = (this.Res.height * Number(v)) / 100.0;
    }
  }

  @observable private _Angle: number = 0; // 元素旋转角度
  @batch()
  @Expose()
  public get Angle(): number {
    return MathHelper.round(this._Angle ? this._Angle : 0, 2);
  }
  public set Angle(v: number) {
    var oldAngle = this._Angle;
    var newValue = MathHelper.round(v, 2);
    if (newValue != oldAngle) {
      if (
        RUHelper.TrySetPropRedoUndo(
          this,
          'Angle',
          () => (this._Angle = newValue),
          newValue,
          this.Angle,
        )
      )
        this.Father?.ResetBoundary(); //如果是组合元素的子元素则重置父元素的边界
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

  //#endregion

  //#region 绝对坐标

  // @computed
  @Exclude()
  public get AbsolutePosition(): Point2D {
    if (this.Father == null) return new Point2D(this.X, this.Y);
    var p = this.Father.AbsoluteMatrix.transformPoint(
      new Point2D(this.X + this.Width / 2, this.Y + this.Height / 2),
    );
    return new Point2D(p.x - this.Width / 2, p.y - this.Height / 2);
  }
  public set AbsolutePosition(v: Point2D) {
    if (this.Father == null) {
      this.X = v.x;
      this.Y = v.y;
    } else {
      var m = this.Father.AbsoluteMatrix;
      m = m.getInverse();
      var point = m.TransformPoint(
        new Point2D(v.x + this.Width / 2, v.y + this.Height / 2),
      );
      this.X = point.x - this.Width / 2;
      this.Y = point.y - this.Height / 2;
    }
  }

  // @computed
  @batch()
  @Exclude()
  public get AbsoluteLeft(): number {
    return MathHelper.round(this.AbsolutePosition.x, 2);
  }
  public set AbsoluteLeft(v: number) {
    this.AbsolutePosition = new Point2D(v, this.AbsolutePosition.y);
  }

  // @computed
  @batch()
  @Exclude()
  public get AbsoluteTop(): number {
    return MathHelper.round(this.AbsolutePosition.y, 2);
  }
  public set AbsoluteTop(v: number) {
    this.AbsolutePosition = new Point2D(this.AbsolutePosition.x, v);
  }

  @computed
  @batch()
  @Exclude()
  public get AbsoluteAngle(): number {
    if (this.Father == null) return this.Angle;
    return (
      this.Father.AbsoluteAngle +
      (this.Father.AbsoluteFlipX == this.Father.AbsoluteFlipY ? 1 : -1) *
        this.Angle
    );
  }
  public set AbsoluteAngle(value: number) {
    if (this.Father == null) this.Angle = value;
    else
      this.Angle =
        (this.Father.AbsoluteFlipX == this.Father.AbsoluteFlipY ? 1 : -1) *
        (value - this.Father.AbsoluteAngle);
  }

  @computed
  @Exclude()
  public get AbsoluteFlipX(): boolean {
    if (this.Father == null) return this.FlipX;
    return this.Father.FlipX != this.FlipX;
  }
  public set AbsoluteFlipX(value: boolean) {
    if (this.Father == null) this.FlipX = value;
    else this.FlipX = this.Father.AbsoluteFlipX != value;
  }

  @computed
  @Exclude()
  public get AbsoluteFlipY(): boolean {
    if (this.Father == null) return this.FlipY;
    return this.Father.FlipY != this.FlipY;
  }
  public set AbsoluteFlipY(value: boolean) {
    if (this.Father == null) this.FlipY = value;
    else this.FlipY = this.Father.AbsoluteFlipY != value;
  }

  @computed
  @Exclude()
  public get AbsoluteMatrix(): Matrix2D {
    var m = new Matrix2D();
    m.ScaleAt(
      this.FlipX ? -1 : 1,
      this.FlipY ? -1 : 1,
      this.Width / 2,
      this.Height / 2,
    )
      .RotateAt(this.Angle, this.Width / 2, this.Height / 2)
      .Translate(this.X, this.Y);
    if (this.Father == null) return m;
    m = m.Append(this.Father.AbsoluteMatrix);
    return m;
  }

  //#endregion

  //是否正在被操作（拖动，变换大小，旋转之类）
  @observable
  private _IsOprating: boolean = false;
  @Exclude() //相当于JsonIgnore
  public get IsOprating(): boolean {
    return this._IsOprating;
  }
  public set IsOprating(v: boolean) {
    this._IsOprating = v;
  }

  @observable // 是否被锁定
  @Expose({ name: 'IsLocked' })
  private _IsLocked: boolean = false;
  @Exclude()
  public get IsLocked(): boolean {
    return this.Father == null
      ? this._IsLocked
      : this._IsLocked || this.Father.IsLocked;
  }
  public set IsLocked(v: boolean) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'IsLocked',
      () => (this._IsLocked = v),
      v,
      this._IsLocked,
    );
  }

  @observable // 是否被隐藏
  @Expose({ name: 'IsDesignHide' })
  _IsDesignHide: boolean = false;
  @Exclude()
  public get IsDesignHide(): boolean {
    return this.Father == null
      ? this._IsDesignHide
      : this._IsDesignHide || this.Father.IsDesignHide;
  }
  public set IsDesignHide(v: boolean) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'IsDesignHide',
      () => (this._IsDesignHide = v),
      v,
      this._IsDesignHide,
    );
  }
  // 是否作为模板页内含元素被锁定
  @observable
  private _IsPageTemplateLocked: boolean;
  @Expose()
  public get IsPageTemplateLocked(): boolean {
    return this._IsPageTemplateLocked;
  }
  public set IsPageTemplateLocked(v: boolean) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'IsPageTemplateLocked',
      () => (this._IsPageTemplateLocked = v),
      v,
      this._IsPageTemplateLocked,
    );
  }

  @computed
  @Exclude()
  public get IsRealPageTemplateLocked(): boolean {
    return this.IsPageTemplateLocked;
  }

  @computed
  @Exclude()
  public get IsPageTemplateLockEnabled(): boolean {
    var cwprofile = this.Scene?.Courseware?.Profile;
    var cwCode = cwprofile?.purposeVo['code'];
    if (cwCode && cwCode != 'TEMPLATE') return this.IsRealPageTemplateLocked;
    return false;
  }

  // 题目属性控件下标
  private _questionIndex: number;
  @computed
  @batch()
  public get questionIndex(): number {
    if (this.Scene?.Elements) {
      var index = this.Scene?.Elements.filter(
        item => item.ElementType == 1024,
      ).indexOf(this);
      if (index >= 0) {
        var pindex = index + 1;
        if (this._questionIndex != pindex) this._questionIndex = pindex;
      }
    }
    return this._questionIndex;
  }

  public set questionIndex(v: number) {
    this._questionIndex = v;
  }

  //透明度
  @observable
  private _Transparent: number = 100;
  @batch()
  @Expose()
  public get Transparent(): number {
    return this._Transparent;
  }
  public set Transparent(v: number) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'Transparent',
      () => (this._Transparent = v),
      v,
      this._Transparent,
    );
  }

  private _ResourceId: string;
  @Expose()
  public get ResourceId(): string {
    return this._ResourceId;
  }
  public set ResourceId(v: string) {
    this._ResourceId = v;
  } //元素相关的资源ID

  public get Res(): CWResource {
    return null;
  }
  public set Res(v: CWResource) {}

  // 元素的出场方式
  @observable
  private _AppearType: AppearTypes = AppearTypes.Auto;
  @batch()
  @Expose()
  public get AppearType(): AppearTypes {
    return this._AppearType;
  }
  public set AppearType(v: AppearTypes) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'AppearType',
      () => (this._AppearType = v),
      v,
      this._AppearType,
    );
  }

  //元素的默认出场顺序
  @observable
  private _AppearIndex: number = 0;
  @batch()
  @Expose()
  public get AppearIndex(): number {
    return this._AppearIndex;
  }
  public set AppearIndex(v: number) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'AppearIndex',
      () => (this._AppearIndex = v),
      v,
      this._AppearIndex,
    );
  }

  @observable
  private _IsRotate: boolean = false;
  @batch(ClassType.bool)
  @Expose()
  public get IsRotate(): boolean {
    return this._IsRotate;
  }
  public set IsRotate(v: boolean) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'IsRotate',
      () => (this._IsRotate = v),
      v,
      this._IsRotate,
    );
  }
  @observable
  private _RotateAngle: number = 0;
  @batch(ClassType.number)
  @Expose()
  public get RotateAngle(): number {
    return this._RotateAngle;
  }
  public set RotateAngle(v: number) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'RotateAngle',
      () => (this._RotateAngle = v),
      v,
      this._RotateAngle,
    );
  }
  //是否穿透2.0属性
  @observable
  private _IsPenetrate: boolean = false;
  @batch(ClassType.bool)
  @Expose()
  public get IsPenetrate(): boolean {
    return this._IsPenetrate;
  }
  public set IsPenetrate(v: boolean) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'IsPenetrate',
      () => (this._IsPenetrate = v),
      v,
      this._IsPenetrate,
    );
  }

  //元素的出现动画描述
  @observable
  _ElemAni: ElementAnimation = new ElementAnimation();
  //@batch(ClassType.json)
  @Expose()
  @Type(() => ElementAnimation)
  public get ElemAni(): ElementAnimation {
    return this._ElemAni;
  }
  public set ElemAni(v: ElementAnimation) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'ElemAni',
      () => (this._ElemAni = v),
      v,
      this._ElemAni,
    );
  }

  @batch(ClassType.number)
  public get AntType(): AnimationType {
    if (this.ElemAni == undefined) return 0;
    return this.ElemAni.AntType;
  }
  public set AntType(v: AnimationType) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'AntType',
      () => (this.ElemAni.AntType = v),
      v,
      this.AntType,
    );
  }

  @batch(ClassType.number)
  public get IcdType(): IncludedType {
    if (this.ElemAni == undefined) return 0;
    return this.ElemAni.IcdType;
  }
  public set IcdType(v: IncludedType) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'IcdType',
      () => (this.ElemAni.IcdType = v),
      v,
      this.IcdType,
    );
  }

  @batch(ClassType.number)
  public get ZoomType(): ZoomType {
    if (this.ElemAni == undefined) return 0;
    return this.ElemAni.ZoomType;
  }

  public set ZoomType(v: ZoomType) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'ZoomType',
      () => (this.ElemAni.ZoomType = v),
      v,
      this.ZoomType,
    );
  }

  @batch(ClassType.number)
  public get Timer(): number {
    if (this.ElemAni == undefined) return 0;
    return this.ElemAni.Timer;
  }

  public set Timer(v: number) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'Timer',
      () => (this.ElemAni.Timer = v),
      v,
      this.Timer,
    );
  }

  //#region 父级信息
  @observable
  protected _Scene: CWPage;
  @Exclude()
  @computed
  public get Scene(): CWPage {
    if (this.Father == null) return this._Scene;
    return this.Father.Scene;
  }
  public set Scene(v: CWPage) {
    this._Scene = v;
  }

  @observable
  private _Father: any = null;
  @Exclude()
  public get Father(): any {
    return this._Father;
  }
  public set Father(v: any) {
    this._Father = v;
  }

  @Exclude()
  public get FatherList(): CWElement[] {
    return this.Father ? this.Father.Children : this.Scene?.Elements;
  }

  //#endregion

  //#region 界面模板和样式
  @Exclude()
  public get Template(): ViewTemplate {
    return null;
  }

  @Exclude()
  @batch(ClassType.object)
  public get PropPanelTemplate(): ViewTemplate {
    return null;
  }
  //#endregion

  //#region 选中控制
  @Exclude()
  HasSelectionChangedBeforeRecord: boolean;

  @observable
  private _IsSelected: boolean = false;

  @computed
  public get IsSelected(): boolean {
    return this._IsSelected;
  }

  public set IsSelected(v: boolean) {
    var oldValue = this._IsSelected;
    if (oldValue != v) {
      this._IsSelected = v;
      this.HasSelectionChangedBeforeRecord = true;

      if (!v) {
        this.IsShowToolbar = false;
        this.HideUniqueToolbar();
        // this.IsRenameActived = false;
      } else {
        if (!this.IsAutoSelectingByTriggers) {
          this.IsAutoSelectingTriggers = true;
          this.Scene?.LogicDesign?.LogicDItems?.forEach(
            x => (x.IsSelectedInDesign = false),
          );
          this.TotalTriggers?.forEach(
            x => (x.IsSelectedInDesign = x.IsEnabled),
          );
          this.IsAutoSelectingTriggers = false;
        }
      }
    }
  }

  private _IsAutoSelectingTriggers: boolean;
  public get IsAutoSelectingTriggers(): boolean {
    return this._IsAutoSelectingTriggers;
  }
  public set IsAutoSelectingTriggers(v: boolean) {
    this._IsAutoSelectingTriggers = v;
  }

  private _IsAutoSelectingByTriggers: boolean;
  public get IsAutoSelectingByTriggers(): boolean {
    return this._IsAutoSelectingByTriggers;
  }
  public set IsAutoSelectingByTriggers(v: boolean) {
    this._IsAutoSelectingByTriggers = v;
  }

  @computed
  @Exclude()
  public get HasAncestorSelected(): boolean {
    if (this.Father == null) return false;
    else return this.Father.IsSelected || this.Father.HasAncestorSelected;
  }

  @computed
  @Exclude()
  public get HasAncestorSolidified(): boolean {
    if (this.Father == null) return false;
    else return this.Father.IsSolidified || this.Father.HasAncestorSolidified;
  }

  @Exclude()
  public get HasAncestorNotExpanded(): boolean {
    if (this.Father == null) return false;
    else return !this.Father.IsExpanded || this.Father.HasAncestorNotExpanded;
  }

  @Exclude()
  public get IsSolidified(): boolean {
    return true;
  }

  public set IsSolidified(v: boolean) {}
  @Exclude()
  public get IsExpanded(): boolean {
    return false;
  }

  public set IsExpanded(v: boolean) {}

  @Exclude()
  public get HasDescendantsSelected(): boolean {
    return false;
  }

  @Exclude()
  public get Level(): number {
    if (this.Father == null) return 0;
    else return this.Father.Level + 1;
  }

  //#endregion

  //#region 编辑模式
  @observable
  private _IsShowToolbar;

  @Exclude()
  public get IsShowToolbar(): boolean {
    return this._IsShowToolbar;
  }

  public set IsShowToolbar(v: boolean) {
    this._IsShowToolbar = v;
  }

  HideUniqueToolbar() {
    this.IsShowToolbar = false;
  }

  public ShowUniqueToolbar(itemView: HTMLElement) {
    this.Scene?.TotalEditItemList?.forEach(x => {
      if (x != this) x.HideUniqueToolbar();
    });
    this.IsShowToolbar = true;
  }

  @Exclude()
  public get CanDragMove(): boolean {
    if (this.HasAncestorSelected) return false;
    if (this.HasAncestorSolidified) return false;
    return true;
  }
  //#endregion
  //#region 选中

  //#endregion

  //#region 从属关系管理

  IsAncestorOf(item: CWElement): boolean {
    var _item = item;
    if ((_item.Father as CWElement) == this) return true;
    if (_item.Father == null) return false;
    if (_item == this) return false;
    _item = _item.Father;
    return this.IsAncestorOf(_item);
  }

  static ClearDescendants(_selectedItems: CWElement[]): CWElement[] {
    //从选中的项中清除有从属关系中的下属
    var result: CWElement[] = [];
    _selectedItems?.forEach(item => {
      if (_selectedItems.find(x => x.IsAncestorOf(item)) == null)
        result.push(item);
    });

    return result;
  }

  static GetAllItemsWithSub(_selectedItems: CWElement[]): CWElement[] {
    var result: CWElement[] = [];
    for (var item of _selectedItems) {
      //将将子项也加入进来
      result.push(item);
      if (
        item.ElementType == ElementTypes.Combined &&
        Reflect.get(item, 'Children') != null
      ) {
        var subs = CWElement.GetAllItemsWithSub(Reflect.get(item, 'Children'));
        subs.forEach(sub => {
          if (!result.includes(sub)) result.push(sub);
        });
      }
    }
    return result;
  }
  //#endregion
  //#region 导入导出
  public SetResourcesFromLib(reslib: CWResource[]) {}

  public AttachResource(source: CWResource) {}
  public GetDependencyResources(): CWResource[] {
    return [];
  }

  public GetDependencyFonts(): string[] {
    return [];
  }
  //#endregion

  //#region   自动命名

  public static NewItemStringName(
    name: string,
    scene: CWPage,
    newAddedItems: CWElement[] = null,
  ): string {
    var existedItems = [...scene.TotalEditItemList];
    if (newAddedItems != null) existedItems.push(...newAddedItems);
    var newItemNameWithoutIndex = CWElement.GetItemNameIndex(name)[0] as string;
    var name_index = existedItems.map(p => CWElement.GetItemNameIndex(p.Name));
    var name_index_withsamename = name_index.filter(
      p => (p[0] as string) == newItemNameWithoutIndex,
    );
    if (name_index_withsamename.length == 0) return name;
    var index = Math.max(...name_index_withsamename.map(x => x[1] as number));
    index++;
    return `${newItemNameWithoutIndex}-${index}`;
  }

  static GetItemNameIndex(name: string): any[] {
    if (name != null && name != '') {
      var spliterIndex = name.lastIndexOf('-');
      if (spliterIndex != -1) {
        var indexstr = name.substring(spliterIndex + 1);

        let reg: RegExp = new RegExp('[0-9]+');
        if (indexstr != null && indexstr != '' && reg.test(indexstr)) {
          var index: number = Number(indexstr);
          var _name = name.substring(0, spliterIndex);
          return [_name, index];
        }
      }
    }
    return [name, 0];
  }

  //#endregion

  //#region 复制
  public SafeDeepClone(
    useNewId: boolean = true,
    idReplaceMap?: Map<string, string>,
  ): CWElement {
    var _item = ObjHelper.DeepClone(this, TypeMapHelper.CommonTypeMap);

    if (_item != null) {
      _item.SetResourcesFromLib(this.GetDependencyResources());
      if (useNewId) {
        var oldId = this.Id;
        _item.Id = CWElement.GenerateElementId();
        idReplaceMap?.set(oldId, _item.Id);
      }
    }
    return _item;
  }

  public ReplaceRelativeIds(map: Map<string, string>): void {
    //替换所有相关联元素上的ID
    // if (this.LogicNode != null) {
    //   this.LogicNode.ReplaceRelativeIds(map);
    // }
    this.TotalTriggers?.forEach(x => x.ReplaceRelativeIds(map));
  }

  GetAllTargetsInInvokeTree(): InvokableBase[] {
    var temp = this.TotalTriggers.filter(t => t.IsEnabled).map(t =>
      t.GetAllTargetsInInvokeTree(),
    );
    var result: InvokableBase[] = [];
    for (var inv of temp) result.push(...inv);
    return result;
  }

  //#endregion

  //region 1.0功能，不用展示，默认值给0，有值读取

  @observable
  private _MediaPlayMode: number = 0;
  @batch(ClassType.number)
  @Expose()
  public get MediaPlayMode(): number {
    return this._MediaPlayMode;
  }
  public set MediaPlayMode(v: number) {
    this._MediaPlayMode = v;
  }

  @observable
  private _MediaDelay: number = 0;
  @batch(ClassType.number)
  @Expose()
  public get MediaDelay(): number {
    return this._MediaDelay;
  }
  public set MediaDelay(v: number) {
    this._MediaDelay = v;
  }

  //endregion

  public static GenerateElementId() {
    var id: string = IdHelper.NewId();
    return id;
  }

  @Expose()
  public get Triggers() {
    return this.TotalTriggers
      ? this.TotalTriggers.filter(p => p.IsEnabled == true)
      : [];
  }
  public set Triggers(v) {
    if (v) this.ReBuildTriggerList(v);
  }

  public get TotalTriggers(): Array<InvokeTriggerBase> {
    var result = new Array<InvokeTriggerBase>();
    if (this.GeneralTriggers != null) result.push(...this.GeneralTriggers);
    if (this.ExtendedTriggers != null) result.push(...this.ExtendedTriggers);
    return result;
  }

  //#region  触发器-初始化逻辑
  GeneralTriggers: Array<InvokeTriggerBase> = new Array<InvokeTriggerBase>();
  ExtendedTriggers: Array<InvokeTriggerBase> = new Array<InvokeTriggerBase>();

  public GeneralTriggerSettings(): Array<InvokeTriggerSetting> {
    let generalTrigger = [
      new InvokeTriggerSetting('Appear', '出现', DisplayInvokeTrigger),
      new InvokeTriggerSetting('Disappear', '消失', InvokeTriggerBase),
      new InvokeTriggerSetting('LongClick', '长按', LongClickInvokeTrigger),
      new InvokeTriggerSetting('Click', '点击', ClickInvokeTrigger),
      new InvokeTriggerSetting('Drag', '拖动', TagedInvokeTrigger),
      new InvokeTriggerSetting('DragUp', '鼠标抬起', InvokeTriggerBase),
      new InvokeTriggerSetting('DragDown', '鼠标按下', ClickInvokeTrigger),
      new InvokeTriggerSetting('Line', '连线', LineInvokeTrigger),
      new InvokeTriggerSetting('Drop', '判定区', DropInvokeTrigger),
      new InvokeTriggerSetting('Slide', '滑动', SlideInvokeTrigger),
      new InvokeTriggerSetting('Enter', '进入', EnterInvokeTrigger),
      new InvokeTriggerSetting('Leave', '离开', LeaveInvokeTrigger),
    ];

    return generalTrigger;
  }

  public GetExtendedTriggerSettings(): Array<InvokeTriggerSetting> {
    return new Array<InvokeTriggerSetting>();
  }

  public ReBuildTriggerList(tiggers: Array<InvokeTriggerBase> = null) {
    this.GeneralTriggerSettings().forEach(tigger => {
      let existedTrigger = tiggers
        ? tiggers.find(p => p.TriggerName == tigger.name)
        : null;
      if (existedTrigger) {
        var triggerType = tigger.triggerType;
        var plain = classToPlain(existedTrigger);
        var ori_existedTrigger: InvokeTriggerBase = plainToClass(
          triggerType.prototype.constructor,
          plain,
          { strategy: 'excludeAll' },
        );

        ori_existedTrigger.DisplayName = tigger.displayName;
        ori_existedTrigger.AttachedItem = this;
        this.GeneralTriggers.push(ori_existedTrigger);
      } else {
        let trigger = Reflect.construct(tigger.triggerType, []);
        if (trigger != null) {
          trigger.TriggerName = tigger.name;
          trigger.DisplayName = tigger.displayName;
          trigger.AttachedItem = this;
          this.GeneralTriggers.push(trigger);
        }
      }
    });

    this.GetExtendedTriggerSettings().forEach(tigger => {
      let existedTrigger = tiggers
        ? tiggers.find(p => p.TriggerName == tigger.name)
        : null;
      if (existedTrigger) {
        var triggerType = tigger.triggerType;
        var ori_existedTrigger: InvokeTriggerBase = plainToClass(
          triggerType.prototype.constructor,
          classToPlain(existedTrigger),
        );

        ori_existedTrigger.DisplayName = tigger.displayName;
        ori_existedTrigger.AttachedItem = this;
        this.ExtendedTriggers.push(ori_existedTrigger);
      } else {
        let trigger = Reflect.construct(tigger.triggerType, []);
        if (trigger != null) {
          trigger.TriggerName = tigger.name;
          trigger.DisplayName = tigger.displayName;
          trigger.AttachedItem = this;
          this.ExtendedTriggers.push(trigger);
        }
      }
    });
  }
  //#endregion

  //声明验证数据基类方法
  public Validate(): string {
    return '';
  }
}
