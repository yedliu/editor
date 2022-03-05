import CWElement from '@/modelClasses/courseDetail/cwElement';
import CustomTextTemplate, {
  PropPanelTemplate as CustomTextPanelTemplate,
} from '@/components/cwDesignUI/elements/controlTemplates/customtextTemplates';
import { ResourceRef } from '@/modelClasses/courseDetail/resRef/resourceRef';
import { observable } from 'mobx';
import { Expose, Type } from '@/class-transformer';
import RUHelper from '@/redoundo/redoUndoHelper';
import { Alignment, VAlignment } from '../../textEditItem';
import { ClassType } from '@/modelClasses/courseDetail/courseDetailenum';
import { batch } from '@/server/CacheEntityServer';
import CWResource from '@/modelClasses/courseDetail/cwResource';
import { InvokeTriggerSetting } from '@/modelClasses/courseDetail/triggers/invokeTriggerSetting';
import { InputInvokeTrigger } from '@/modelClasses/courseDetail/triggers/extendedTrigger';
export default class CustomText extends CWElement {
  public get Template(): any {
    return CustomTextTemplate;
  }

  public get PropPanelTemplate(): any {
    return CustomTextPanelTemplate;
  }

  constructor() {
    super();
  }

  @observable
  private _Background: ResourceRef;
  @batch(ClassType.resource)
  @Expose()
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
  private _KeyBoardMode: string = '1';
  @batch(ClassType.string)
  @Expose()
  public get KeyBoardMode(): string {
    return this._KeyBoardMode;
  }
  public set KeyBoardMode(v: string) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'KeyBoardMode',
      () => (this._KeyBoardMode = v),
      v,
      this._KeyBoardMode,
    );
  }

  @observable
  private _TypeMode: string = '0';
  @batch(ClassType.string)
  @Expose()
  public get TypeMode(): string {
    return this._TypeMode;
  }
  public set TypeMode(v: string) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'TypeMode',
      () => (this._TypeMode = v),
      v,
      this._TypeMode,
    );

    this.KeyBoardMode = '1';
  }

  @observable
  private _MarkString: string = '+-*/><=';
  @batch(ClassType.string)
  @Expose()
  public get MarkString(): string {
    return this._MarkString;
  }
  public set MarkString(v: string) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'MarkString',
      () => (this._MarkString = v),
      v,
      this._MarkString,
    );
  }

  @observable
  private _CursorRes: ResourceRef;
  @batch(ClassType.resource)
  @Expose()
  @Type(() => ResourceRef)
  public get CursorRes(): ResourceRef {
    return this._CursorRes;
  }
  public set CursorRes(v: ResourceRef) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'CursorRes',
      () => (this._CursorRes = v),
      v,
      this._CursorRes,
    );
  }

  @observable
  private _CursorWidth: number = 0;
  @batch()
  @Expose()
  public get CursorWidth(): number {
    return this._CursorWidth;
  }
  public set CursorWidth(v: number) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'CursorWidth',
      () => (this._CursorWidth = v),
      v,
      this._CursorWidth,
    );
  }

  @observable
  private _SizeMode: string;
  @batch(ClassType.string)
  @Expose()
  public get SizeMode(): string {
    return this._SizeMode;
  }
  public set SizeMode(v: string) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'SizeMode',
      () => (this._SizeMode = v),
      v,
      this._SizeMode,
    );
  }

  @observable
  private _UnitWidth: number = 0;
  @batch()
  @Expose()
  public get UnitWidth(): number {
    return this._UnitWidth;
  }
  public set UnitWidth(v: number) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'UnitWidth',
      () => (this._UnitWidth = v),
      v,
      this._UnitWidth,
    );
  }

  @observable
  private _SelectedRes: ResourceRef;
  @batch(ClassType.resource)
  @Expose()
  @Type(() => ResourceRef)
  public get SelectedRes(): ResourceRef {
    return this._SelectedRes;
  }
  public set SelectedRes(v: ResourceRef) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'SelectedRes',
      () => (this._SelectedRes = v),
      v,
      this._SelectedRes,
    );
  }

  @observable
  private _InputMode: string;
  @batch(ClassType.string)
  @Expose()
  public get InputMode(): string {
    return this._InputMode;
  }
  public set InputMode(v: string) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'InputMode',
      () => (this._InputMode = v),
      v,
      this._InputMode,
    );
  }

  @observable
  private _IsSizeChanged: boolean;
  @batch(ClassType.bool)
  @Expose()
  public get IsSizeChanged(): boolean {
    return this._IsSizeChanged;
  }
  public set IsSizeChanged(v: boolean) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'IsSizeChanged',
      () => (this._IsSizeChanged = v),
      v,
      this._IsSizeChanged,
    );
  }

  @observable
  private _MaxLength: number;
  @batch()
  @Expose()
  public get MaxLength(): number {
    return this._MaxLength;
  }
  public set MaxLength(v: number) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'MaxLength',
      () => (this._MaxLength = v),
      v,
      this._MaxLength,
    );
  }

  @observable
  private _Placement: string;
  @batch(ClassType.string)
  @Expose()
  public get Placement(): string {
    return this._Placement;
  }
  public set Placement(v: string) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'Placement',
      () => (this._Placement = v),
      v,
      this._Placement,
    );
  }

  @observable
  private _KeyBoardId: string;
  @batch(ClassType.string)
  @Expose()
  public get KeyBoardId(): string {
    return this._KeyBoardId;
  }
  public set KeyBoardId(v: string) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'KeyBoardId',
      () => (this._KeyBoardId = v),
      v,
      this._KeyBoardId,
    );
  }

  @observable
  private _VerticalOffset: number = 0;
  @batch()
  @Expose()
  public get VerticalOffset(): number {
    return this._VerticalOffset;
  }
  public set VerticalOffset(v: number) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'VerticalOffset',
      () => (this._VerticalOffset = v),
      v,
      this._VerticalOffset,
    );
  }

  @observable
  private _HorizontalOffset: number = 0;
  @batch()
  @Expose()
  public get HorizontalOffset(): number {
    return this._HorizontalOffset;
  }
  public set HorizontalOffset(v: number) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'HorizontalOffset',
      () => (this._HorizontalOffset = v),
      v,
      this._HorizontalOffset,
    );
  }

  @observable
  private _IsDefaultChecked: boolean;
  @batch(ClassType.bool)
  @Expose()
  public get IsDefaultChecked(): boolean {
    return this._IsDefaultChecked;
  }
  public set IsDefaultChecked(v: boolean) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'IsDefaultChecked',
      () => (this._IsDefaultChecked = v),
      v,
      this._IsDefaultChecked,
    );
  }

  //#region  字体字段

  @observable
  private _FtSize: number = 36.0;
  @Expose()
  @batch(ClassType.number)
  public get FtSize(): number {
    return this._FtSize;
  }
  public set FtSize(v: number) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'FtSize',
      () => (this._FtSize = v),
      v,
      this._FtSize,
    );
  }

  @observable
  private _FamilyFont: string;
  @batch(ClassType.string)
  @Expose()
  public get FamilyFont(): string {
    return this._FamilyFont;
  }
  public set FamilyFont(v: string) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'FamilyFont',
      () => (this._FamilyFont = v),
      v,
      this._FamilyFont,
    );
  }

  @observable
  private _IsBold: boolean = false;
  @batch(ClassType.bool)
  @Expose()
  public get IsBold(): boolean {
    return this._IsBold;
  }
  public set IsBold(v: boolean) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'IsBold',
      () => (this._IsBold = v),
      v,
      this._IsBold,
    );
  }

  @observable
  private _IsItalic: boolean = false;
  @batch(ClassType.bool)
  @Expose()
  public get IsItalic(): boolean {
    return this._IsItalic;
  }
  public set IsItalic(v: boolean) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'IsItalic',
      () => (this._IsItalic = v),
      v,
      this._IsItalic,
    );
  }

  @observable
  private _IsUnderLine: boolean = false;
  @batch(ClassType.bool)
  @Expose()
  public get IsUnderLine(): boolean {
    return this._IsUnderLine;
  }
  public set IsUnderLine(v: boolean) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'IsUnderLine',
      () => (this._IsUnderLine = v),
      v,
      this._IsUnderLine,
    );
  }

  @observable
  private _Color: string = '#000000';
  @batch(ClassType.string)
  @Expose()
  public get Color(): string {
    return this._Color;
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
  private _Alignment: Alignment;
  @batch()
  @Expose()
  public get Alignment(): Alignment {
    return this._Alignment;
  }
  public set Alignment(v: Alignment) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'Alignment',
      () => (this._Alignment = v),
      v,
      this._Alignment,
    );
  }

  @observable
  private _VAlignment: VAlignment;
  @batch()
  @Expose()
  public get VAlignment(): VAlignment {
    return this._VAlignment;
  }
  public set VAlignment(v: VAlignment) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'VAlignment',
      () => (this._VAlignment = v),
      v,
      this._VAlignment,
    );
  }

  //#endregion

  public SetResourcesFromLib(reslib: CWResource[]) {
    if (!reslib) return;
    this.Background?.SearchResource(reslib);
    this.CursorRes?.SearchResource(reslib);
    this.SelectedRes?.SearchResource(reslib);
  }

  public GetExtendedTriggerSettings() {
    var triggers = super.GetExtendedTriggerSettings();
    triggers.push(
      new InvokeTriggerSetting('Input', '输入', InputInvokeTrigger),
    );
    return triggers;
  }

  //#region 导入导出

  public GetDependencyResources(): CWResource[] {
    var res: CWResource[] = [];
    if (this.Background != null && this.Background.Resource != null)
      res.push(this.Background.Resource);
    if (this.CursorRes != null && this.CursorRes.Resource != null)
      res.push(this.CursorRes.Resource);
    if (this.SelectedRes != null && this.SelectedRes.Resource != null)
      res.push(this.SelectedRes.Resource);
    return res;
  }

  public GetDependencyFonts(): string[] {
    return [this.FamilyFont];
  }
  //#endregion
}
