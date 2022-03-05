import { observable } from 'mobx';
import { Expose, serialize, deserializeArray } from '@/class-transformer';
import IdHelper from '@/utils/idHelper';
import SwitchSketelonAction from './SwitchSketelonAction';

export class BaseTiggerActionModel {
  @observable
  private _Delay: number = 0.0;
  @Expose()
  public get Delay(): number {
    return this._Delay;
  }
  public set Delay(v: number) {
    this._Delay = v;
  }

  @observable
  private _InvId: string;
  @Expose()
  public get InvId(): string {
    return this._InvId;
  }
  public set InvId(v: string) {
    this._InvId = v;
  }

  ReplaceIds(map: Map<string, string>) {
    if (map != null) {
      map.forEach((v, k) => {
        this.InvId = IdHelper.ReplaceId(this.InvId, k, v);
      });
    }
  }
}

export class ActuatorActionModel extends BaseTiggerActionModel {
  @observable
  private _ElementId: string;
  @Expose()
  public get ElementId(): string {
    return this._ElementId;
  }
  public set ElementId(v: string) {
    this._ElementId = v;
  }

  @observable
  private _ClearElementId: string;
  @Expose()
  public get ClearElementId(): string {
    return this._ClearElementId;
  }
  public set ClearElementId(v: string) {
    this._ClearElementId = v;
  }

  @Expose()
  public get SwitchBoneId(): string {
    return this.SwitchBoneIds ? serialize(this.SwitchBoneIds) : null;
  }
  public set SwitchBoneId(v: string) {
    this.SwitchBoneIds =
      v != null && v != '' ? deserializeArray(SwitchSketelonAction, v) : [];
  }

  get AppearIds() {
    return this.ElementId;
  }
  set AppearIds(v) {
    this.ElementId = v;
  }

  get DisappearIds() {
    return this.ClearElementId;
  }
  set DisappearIds(v) {
    this.ClearElementId = v;
  }

  @observable
  private _SwitchBoneIds: SwitchSketelonAction[] = [];
  public get SwitchBoneIds(): SwitchSketelonAction[] {
    return this._SwitchBoneIds;
  }
  public set SwitchBoneIds(v: SwitchSketelonAction[]) {
    this._SwitchBoneIds = v;
  }

  ReplaceIds(map: Map<string, string>) {
    if (map) {
      map.forEach((v, k) => {
        var oldId = k;
        var newId = v;
        this.ElementId = IdHelper.ReplaceId(this.AppearIds, oldId, newId);
        this.ClearElementId = IdHelper.ReplaceId(
          this.DisappearIds,
          oldId,
          newId,
        );
        this.InvId = IdHelper.ReplaceId(this.InvId, oldId, newId);
        var oldActions = this.SwitchBoneIds?.filter(x => x.Id == oldId);
        if (oldActions) for (var oldact of oldActions) oldact.Id = newId;
      });
    }
  }
}

export class ActionViewModel extends ActuatorActionModel {
  @observable
  private _RepeatDelay: number = 0;
  @Expose()
  public get RepeatDelay(): number {
    return this._RepeatDelay;
  }
  public set RepeatDelay(v: number) {
    this._RepeatDelay = v;
  }
}
