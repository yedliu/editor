import ProgressBarTemplate, {
  PropPanelTemplate as ProgressBarPanelTemplate,
} from '@/components/cwDesignUI/elements/controlTemplates/progressbarTemplate';
import { ResourceRef } from '@/modelClasses/courseDetail/resRef/resourceRef';
import { observable } from 'mobx';
import { Expose, Type } from '@/class-transformer';
import RUHelper from '@/redoundo/redoUndoHelper';
import { Alignment, VAlignment } from '../../textEditItem';
import { ClassType } from '@/modelClasses/courseDetail/courseDetailenum';
import { batch } from '@/server/CacheEntityServer';
import CWResource from '@/modelClasses/courseDetail/cwResource';
import { InvokeTriggerSetting } from '@/modelClasses/courseDetail/triggers/invokeTriggerSetting';
import {
  InputInvokeTrigger,
  ValueChangedTrigger,
} from '@/modelClasses/courseDetail/triggers/extendedTrigger';
import CWElement from '@/modelClasses/courseDetail/cwElement';
export default class ProgressBar extends CWElement {
  public get Template(): any {
    return ProgressBarTemplate;
  }

  public get PropPanelTemplate(): any {
    return ProgressBarPanelTemplate;
  }

  constructor() {
    super();
  }

  @observable
  private _CurrentValue: number;
  @Expose()
  @batch(ClassType.number)
  public get CurrentValue(): number {
    return this._CurrentValue;
  }
  public set CurrentValue(v: number) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'CurrentValue',
      () => (this._CurrentValue = v),
      v,
      this._CurrentValue,
    );
  }

  @observable
  private _SliderMode: number;
  @Expose()
  @batch(ClassType.number)
  public get SliderMode(): number {
    return this._SliderMode;
  }
  public set SliderMode(v: number) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'SliderMode',
      () => (this._SliderMode = v),
      v,
      this._SliderMode,
    );
  }

  @observable
  private _InitialValue: number;
  @Expose()
  @batch(ClassType.number)
  public get InitialValue(): number {
    return this._InitialValue;
  }
  public set InitialValue(v: number) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'InitialValue',
      () => (this._InitialValue = v),
      v,
      this._InitialValue,
    );
  }

  @observable
  private _TheEndValue: number;
  @Expose()
  @batch(ClassType.number)
  public get TheEndValue(): number {
    return this._TheEndValue;
  }
  public set TheEndValue(v: number) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'TheEndValue',
      () => (this._TheEndValue = v),
      v,
      this._TheEndValue,
    );
  }

  @observable
  private _ButtonWidth: number = 100;
  @Expose()
  @batch(ClassType.number)
  public get ButtonWidth(): number {
    return this._ButtonWidth;
  }
  public set ButtonWidth(v: number) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'ButtonWidth',
      () => (this._ButtonWidth = v),
      v,
      this._ButtonWidth,
    );
  }

  @observable
  private _ButtonHeight: number = 100;
  @Expose()
  @batch(ClassType.number)
  public get ButtonHeight(): number {
    return this._ButtonHeight;
  }
  public set ButtonHeight(v: number) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'ButtonHeight',
      () => (this._ButtonHeight = v),
      v,
      this._ButtonHeight,
    );
  }

  @observable
  private _LargeChange: number = 1;
  @Expose()
  @batch(ClassType.number)
  public get LargeChange(): number {
    return this._LargeChange;
  }
  public set LargeChange(v: number) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'LargeChange',
      () => (this._LargeChange = v),
      v,
      this._LargeChange,
    );
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
  private _ButtonResource: ResourceRef;
  @Expose()
  @batch(ClassType.resource)
  @Type(() => ResourceRef)
  public get ButtonResource(): ResourceRef {
    return this._ButtonResource;
  }
  public set ButtonResource(v: ResourceRef) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'ButtonResource',
      () => (this._ButtonResource = v),
      v,
      this._ButtonResource,
    );
  }

  @observable
  private _ShadeResource: ResourceRef;
  @Expose()
  @batch(ClassType.resource)
  @Type(() => ResourceRef)
  public get ShadeResource(): ResourceRef {
    return this._ShadeResource;
  }
  public set ShadeResource(v: ResourceRef) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'ShadeResource',
      () => (this._ShadeResource = v),
      v,
      this._ShadeResource,
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
  private _IsBold: boolean;
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
  private _IsItalic: boolean;
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
  private _IsUnderLine: boolean;
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
    this.ShadeResource?.SearchResource(reslib);
    this.ButtonResource?.SearchResource(reslib);
  }

  public GetExtendedTriggerSettings() {
    var triggers = super.GetExtendedTriggerSettings();
    triggers.push(
      new InvokeTriggerSetting('ValueChanged', '值改变', ValueChangedTrigger),
    );
    return triggers;
  }

  //#region 导入导出

  public GetDependencyResources(): CWResource[] {
    var res: CWResource[] = [];
    if (this.Background != null && this.Background.Resource != null)
      res.push(this.Background.Resource);
    if (this.ShadeResource != null && this.ShadeResource.Resource != null)
      res.push(this.ShadeResource.Resource);
    if (this.ButtonResource != null && this.ButtonResource.Resource != null)
      res.push(this.ButtonResource.Resource);
    return res;
  }

  public GetDependencyFonts(): string[] {
    return [this.FamilyFont];
  }
  //#endregion
}
