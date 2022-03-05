import InvokeTriggerBase from './invokeTriggerBase';
import { observable } from 'mobx';
import { Expose } from '@/class-transformer';
import RUHelper from '@/redoundo/redoUndoHelper';
import {
  ClickInvokeTriggerSTemplate,
  DisplayInvokeTriggerTemplate,
  DropInvokeTriggerTemplate,
  TagedInvokeTriggerTemplate,
  LineInvokeTriggerTemplate,
  SlideInvokeTriggerTemplate,
  InputInvokeTriggerTemplate,
  LongClickInvokeTriggersTemplate,
  EnterInvokeTriggerTemplate,
  LeaveInvokeTriggerTemplate,
} from '@/components/cwDesignUI/logicView/triggerSettingTemplates/generalTriggerSettingTemplates';
import { InvHandler, InvokerType } from '../InvokeDesign/InvokeHandlerMeta';

export class ClickInvokeTrigger extends InvokeTriggerBase {
  constructor() {
    super();
    this.SettingTemplate = ClickInvokeTriggerSTemplate;
  }

  @observable
  private _ValuesString: string;
  @Expose()
  public get ValuesString(): string {
    return this._ValuesString;
  }
  public set ValuesString(v: string) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'ValuesString',
      () => (this._ValuesString = v),
      v,
      this._ValuesString,
    );
  }

  public GetOutputParameters() {
    return ['当前标签'];
  }
}

export class LongClickInvokeTrigger extends InvokeTriggerBase {
  constructor() {
    super();
    this.SettingTemplate = LongClickInvokeTriggersTemplate;
  }

  @observable
  private _Interval: number = 1;
  @Expose()
  public get Interval(): number {
    return this._Interval;
  }
  public set Interval(v: number) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'Interval',
      () => (this._Interval = v),
      v,
      this._Interval,
    );
  }

  public GetOutputParameters() {
    return ['当前次数'];
  }
}

export class DisplayInvokeTrigger extends InvokeTriggerBase {
  constructor() {
    super();
    this.SettingTemplate = DisplayInvokeTriggerTemplate;
  }

  @observable
  private _DefaultValue: string;
  public get DefaultValue(): string {
    return this._DefaultValue;
  }
  @Expose()
  public set DefaultValue(v: string) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'DefaultValue',
      () => (this._DefaultValue = v),
      v,
      this._DefaultValue,
    );
  }

  @observable
  private _IsAutoRadio: boolean = false;
  @Expose()
  public get IsAutoRadio(): boolean {
    return this._IsAutoRadio;
  }
  public set IsAutoRadio(v: boolean) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'IsAutoRadio',
      () => (this._IsAutoRadio = v),
      v,
      this._IsAutoRadio,
    );
  }
}

export class DropInvokeTrigger extends InvokeTriggerBase {
  constructor() {
    super();
    this.SettingTemplate = DropInvokeTriggerTemplate;
  }

  public GetOutputParameters() {
    return ['当前标签'];
  }

  @observable
  private _ErrorNoReset: boolean;
  public get ErrorNoReset(): boolean {
    return this._ErrorNoReset;
  }
  @Expose()
  public set ErrorNoReset(v: boolean) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'ErrorNoReset',
      () => (this._ErrorNoReset = v),
      v,
      this._ErrorNoReset,
    );
  }

  @observable
  private _IsSucessLocked: boolean = false;
  public get IsSucessLocked(): boolean {
    return this._IsSucessLocked || false;
  }
  @Expose()
  public set IsSucessLocked(v: boolean) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'IsSucessLocked',
      () => (this._IsSucessLocked = v),
      v,
      this._IsSucessLocked,
    );
  }

  @observable
  private _IsNullChanged: boolean;
  @Expose()
  public get IsNullChanged(): boolean {
    return this._IsNullChanged;
  }
  public set IsNullChanged(v: boolean) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'IsNullChanged',
      () => (this._IsNullChanged = v),
      v,
      this._IsNullChanged,
    );
  }
}

export class TagedInvokeTrigger extends InvokeTriggerBase {
  constructor() {
    super();
    this.SettingTemplate = TagedInvokeTriggerTemplate;
  }

  @observable
  private _Tag: string;
  public get Tag(): string {
    return this._Tag;
  }
  @Expose()
  public set Tag(v: string) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'Tag',
      () => (this._Tag = v),
      v,
      this._Tag,
    );
  }

  @observable
  private _TagCount: number = 1;
  public get TagCount(): number {
    return this._TagCount;
  }
  @Expose()
  public set TagCount(v: number) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'TagCount',
      () => (this._TagCount = v),
      v,
      this._TagCount,
    );
  }

  @observable
  private _DragMode: string = '0';
  public get DragMode(): string {
    return this._DragMode || '0';
  }
  @Expose()
  public set DragMode(v: string) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'DragMode',
      () => (this._DragMode = v),
      v,
      this._DragMode,
    );
  }

  @observable
  private _DisplayMode: string = '0';
  public get DisplayMode(): string {
    return this._DisplayMode || '0';
  }
  @Expose()
  public set DisplayMode(v: string) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'DisplayMode',
      () => (this._DisplayMode = v),
      v,
      this._DisplayMode,
    );
  }

  @observable
  private _ActMode: string = '0';
  public get ActMode(): string {
    return this._ActMode || '0';
  }
  @Expose()
  public set ActMode(v: string) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'ActMode',
      () => (this._ActMode = v),
      v,
      this._ActMode,
    );
  }

  @observable
  private _OldMode: boolean = false;
  @Expose()
  public get OldMode(): boolean {
    return this._OldMode;
  }
  public set OldMode(v: boolean) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'OldMode',
      () => (this._OldMode = v),
      v,
      this._OldMode,
    );
  }

  @observable
  private _InitTrigger: boolean = false;
  @Expose()
  public get InitTrigger(): boolean {
    return this._InitTrigger;
  }
  public set InitTrigger(v: boolean) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'InitTrigger',
      () => (this._InitTrigger = v),
      v,
      this._InitTrigger,
    );
  }
}

export class LineInvokeTrigger extends InvokeTriggerBase {
  constructor() {
    super();
    this.SettingTemplate = LineInvokeTriggerTemplate;
  }

  @observable
  private _Tag: string;
  public get Tag(): string {
    return this._Tag;
  }
  @Expose()
  public set Tag(v: string) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'Tag',
      () => (this._Tag = v),
      v,
      this._Tag,
    );
  }

  @observable
  private _Color: string;
  public get Color(): string {
    return this._Color ? this._Color : '#8ccfd5';
  }
  @Expose()
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
  private _PointColor: string;
  @Expose()
  public get PointColor(): string {
    return this._PointColor ? this._PointColor : '#8ccfd5';
  }
  public set PointColor(v: string) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'PointColor',
      () => (this._PointColor = v),
      v,
      this._PointColor,
    );
  }

  @observable
  private _MoveColor: string;
  @Expose()
  public get MoveColor(): string {
    return this._MoveColor ? this._MoveColor : '#fccccc';
  }
  public set MoveColor(v: string) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'MoveColor',
      () => (this._MoveColor = v),
      v,
      this._MoveColor,
    );
  }

  @observable
  private _MovePointColor: string;
  @Expose()
  public get MovePointColor(): string {
    return this._MovePointColor ? this._MovePointColor : '#8ccfd5';
  }
  public set MovePointColor(v: string) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'MovePointColor',
      () => (this._MovePointColor = v),
      v,
      this._MovePointColor,
    );
  }

  @observable
  private _LineThickness: number;
  public get LineThickness(): number {
    return this._LineThickness;
  }
  @Expose()
  public set LineThickness(v: number) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'LineThickness',
      () => (this._LineThickness = v),
      v,
      this._LineThickness,
    );
  }

  @observable
  private _IsSingleLine: boolean;
  @Expose()
  public get IsSingleLine(): boolean {
    return this._IsSingleLine;
  }
  public set IsSingleLine(v: boolean) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'IsSingleLine',
      () => (this._IsSingleLine = v),
      v,
      this._IsSingleLine,
    );
  }

  @observable
  private _LineSucessInvId: string;
  @Expose()
  @InvHandler({ DisplayName: '成功后触发', Type: InvokerType.Event })
  public get LineSucessInvId(): string {
    return this._LineSucessInvId;
  }
  public set LineSucessInvId(v: string) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'LineSucessInvId',
      () => (this._LineSucessInvId = v),
      v,
      this._LineSucessInvId,
    );
  }

  @observable
  private _IsTwoWay: boolean = false;
  @Expose()
  public get IsTwoWay(): boolean {
    return this._IsTwoWay;
  }
  public set IsTwoWay(v: boolean) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'IsTwoWay',
      () => (this._IsTwoWay = v),
      v,
      this._IsTwoWay,
    );
  }
}

export class SlideInvokeTrigger extends InvokeTriggerBase {
  constructor() {
    super();
    this.SettingTemplate = SlideInvokeTriggerTemplate;
  }

  @observable
  private _SlipDirection: number;
  @Expose()
  public get SlipDirection(): number {
    return this._SlipDirection;
  }
  public set SlipDirection(v: number) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'SlipDirection',
      () => (this._SlipDirection = v),
      v,
      this._SlipDirection,
    );
  }

  @observable
  private _Angle: number;
  @Expose()
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
  private _TheInitialScope: number;
  @Expose()
  public get TheInitialScope(): number {
    return this._TheInitialScope;
  }
  public set TheInitialScope(v: number) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'TheInitialScope',
      () => (this._TheInitialScope = v),
      v,
      this._TheInitialScope,
    );
  }

  public GetOutputParameters() {
    return ['当前值'];
  }
}

//进入
export class EnterInvokeTrigger extends InvokeTriggerBase {
  constructor() {
    super();
    this.SettingTemplate = null;
  }

  public GetOutputParameters() {
    return ['当前值'];
  }
}

//离开
export class LeaveInvokeTrigger extends InvokeTriggerBase {
  constructor() {
    super();
    this.SettingTemplate = null;
  }

  public GetOutputParameters() {
    return ['当前值'];
  }
}
