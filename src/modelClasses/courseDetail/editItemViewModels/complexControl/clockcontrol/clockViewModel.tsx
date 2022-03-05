import CWElement from '@/modelClasses/courseDetail/cwElement';
import ClockTemplate, {
  PropPanelTemplate as ClockTemplatePropPanelTemplate,
} from '@/components/cwDesignUI/elements/controlTemplates/clockTemplate';
import MathHelper from '@/utils/MathHelper';
import { InvokeTriggerSetting } from '@/modelClasses/courseDetail/triggers/invokeTriggerSetting';
import { ValueChangedTrigger } from '@/modelClasses/courseDetail/triggers/extendedTrigger';
import { observable } from 'mobx';
import { Expose, Type } from '@/class-transformer';
import { batch } from '@/server/CacheEntityServer';
import { ResourceRef } from '@/modelClasses/courseDetail/resRef/resourceRef';
import { ClassType } from '@/modelClasses/courseDetail/courseDetailenum';
import RUHelper from '@/redoundo/redoUndoHelper';
import CWResource from '@/modelClasses/courseDetail/cwResource';

export default class ClockViewModel extends CWElement {
  public get Template(): any {
    return ClockTemplate;
  }

  public get PropPanelTemplate(): any {
    return ClockTemplatePropPanelTemplate;
  }

  constructor() {
    super();
  }

  public GetExtendedTriggerSettings() {
    var triggers = super.GetExtendedTriggerSettings();
    triggers.push(
      new InvokeTriggerSetting('ValueChanged', '值改变', ValueChangedTrigger),
    );
    return triggers;
  }

  public get Width(): number {
    return super.Width;
  }

  public get Height(): number {
    return super.Height;
  }
  public set Width(v: number) {
    var val = MathHelper.round(v, 2);
    super.Width = val;
    if (this.Height != val && !this.IsOprating) this.Height = val;
  }

  public set Height(v: number) {
    var val = MathHelper.round(v, 2);
    super.Height = val;
    if (this.Width != val && !this.IsOprating) this.Width = val;
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

  //#region  Hour
  @observable
  private _HourRes: ResourceRef;
  @Expose()
  @batch(ClassType.resource)
  @Type(() => ResourceRef)
  public get HourRes(): ResourceRef {
    return this._HourRes;
  }
  public set HourRes(v: ResourceRef) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'HourRes',
      () => (this._HourRes = v),
      v,
      this._HourRes,
    );
  }

  @observable
  private _PHourH: number = 150;
  @Expose()
  @batch(ClassType.number)
  public get PHourH(): number {
    return this._PHourH;
  }
  public set PHourH(v: number) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'PHourH',
      () => (this._PHourH = v),
      v,
      this._PHourH,
    );
  }

  @observable
  private _PHourW: number = 25;
  @Expose()
  @batch(ClassType.number)
  public get PHourW(): number {
    return this._PHourW;
  }
  public set PHourW(v: number) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'PHourW',
      () => (this._PHourW = v),
      v,
      this._PHourW,
    );
  }

  //#endregion

  //#region  Minute
  @observable
  private _MinuteRes: ResourceRef;
  @Expose()
  @batch(ClassType.resource)
  @Type(() => ResourceRef)
  public get MinuteRes(): ResourceRef {
    return this._MinuteRes;
  }
  public set MinuteRes(v: ResourceRef) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'MinuteRes',
      () => (this._MinuteRes = v),
      v,
      this._MinuteRes,
    );
  }

  @observable
  private _PMinuteW: number = 15;
  @Expose()
  @batch(ClassType.number)
  public get PMinuteW(): number {
    return this._PMinuteW;
  }
  public set PMinuteW(v: number) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'PMinuteW',
      () => (this._PMinuteW = v),
      v,
      this._PMinuteW,
    );
  }

  @observable
  private _PMinuteH: number = 190;
  @Expose()
  @batch(ClassType.number)
  public get PMinuteH(): number {
    return this._PMinuteH;
  }
  public set PMinuteH(v: number) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'PMinuteH',
      () => (this._PMinuteH = v),
      v,
      this._PMinuteH,
    );
  }
  //#endregion

  @observable
  private _Hour: number = 0;
  @Expose()
  @batch(ClassType.number)
  public get Hour(): number {
    return this._Hour;
  }
  public set Hour(v: number) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'Hour',
      () => (this._Hour = v),
      v,
      this._Hour,
    );
    this.SetTimerAngle();
  }

  @observable
  private _Minute: number = 0;
  @Expose()
  @batch(ClassType.number)
  public get Minute(): number {
    return this._Minute;
  }
  public set Minute(v: number) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'Minute',
      () => (this._Minute = v),
      v,
      this._Minute,
    );
    this.SetTimerAngle();
  }

  @observable
  private _HourAngle: number;
  public get HourAngle(): number {
    return this._HourAngle;
  }
  public set HourAngle(v: number) {
    this._HourAngle = v;
  }

  @observable
  private _MinuteAngle: number;
  public get MinuteAngle(): number {
    return this._MinuteAngle;
  }
  public set MinuteAngle(v: number) {
    this._MinuteAngle = v;
  }

  @observable
  private _ClockMode: number = 0;
  @Expose()
  @batch(ClassType.number)
  public get ClockMode(): number {
    return this._ClockMode;
  }
  public set ClockMode(v: number) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'ClockMode',
      () => (this._ClockMode = v),
      v,
      this._ClockMode,
    );
  }

  SetTimerAngle(): void {
    this.MinuteAngle = (this.Minute / 60) * 360;
    var hourTemp = this.Hour;
    if (hourTemp >= 12) {
      hourTemp = hourTemp - 12;
    }
    this.HourAngle = hourTemp * 30 + (this.Minute / 60) * 30;
  }

  public SetResourcesFromLib(reslib: CWResource[]) {
    if (!reslib) return;
    this.Background?.SearchResource(reslib);
    this.MinuteRes?.SearchResource(reslib);
    this.HourRes?.SearchResource(reslib);
  }

  public GetDependencyResources(): CWResource[] {
    var res: CWResource[] = [];
    if (this.Background != null && this.Background.Resource != null)
      res.push(this.Background.Resource);
    if (this.MinuteRes != null && this.MinuteRes.Resource != null)
      res.push(this.MinuteRes.Resource);
    if (this.HourRes != null && this.HourRes.Resource != null)
      res.push(this.HourRes.Resource);
    return res;
  }
}
