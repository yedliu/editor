import MissionBase from '../Mission/MissionBase';
import { observable, reaction } from 'mobx';
import RUHelper from '@/redoundo/redoUndoHelper';
import {
  Expose,
  serialize,
  deserializeArray,
  Exclude,
  Type,
} from '@/class-transformer';
import InvokableBase from '@/modelClasses/courseDetail/InvokableBase';
import IdHelper from '@/utils/idHelper';
import { InvHandler, InvokerType } from '../../../InvokeHandlerMeta';
import MetaHelper from '@/utils/metaHelper';
import InvokeTriggerBase from '@/modelClasses/courseDetail/triggers/invokeTriggerBase';
import InvokeHandler from '../../../InvokeHandler';
import IPropUndoable from '@/redoundo/IPropUndoable';
import { stores } from '@/pages';
import ActionManager from '@/redoundo/actionManager';
import StopMisson from '../Mission/StopMisson';

export class MissionInfo implements IPropUndoable {
  get CanRecordRedoUndo(): boolean {
    if (
      stores.courseware &&
      !stores.courseware.isLoading &&
      !ActionManager.Instance.ActionIsExecuting
    )
      return true;
    return false;
  }
  @observable
  private _MissionReceiver: MissionBase;
  public get MissionReceiver(): MissionBase {
    return this._MissionReceiver;
  }
  public set MissionReceiver(v: MissionBase) {
    this._MissionReceiver = v;
  }

  @observable
  private _OrderIndex: number = 0;
  @Expose()
  public get OrderIndex(): number {
    return this._OrderIndex;
  }
  public set OrderIndex(v: number) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'OrderIndex',
      () => (this._OrderIndex = v),
      v,
      this._OrderIndex,
    );
  }

  @observable
  private _SubmitterId: string;
  @Expose()
  public get SubmitterId(): string {
    return this._SubmitterId;
  }
  public set SubmitterId(v: string) {
    this._SubmitterId = v;
  }

  @observable
  private _TriggerName: string;
  @Expose()
  public get TriggerName(): string {
    return this._TriggerName;
  }
  public set TriggerName(v: string) {
    this._TriggerName = v;
  }

  @Exclude()
  get Submitter() {
    if (!this.TriggerName) {
      return this.MissionReceiver?.Scene?.TotalInvItems?.find(
        x => x.Id == this.SubmitterId,
      ) as InvokableBase;
    } else {
      var editItem = this.MissionReceiver?.Scene?.TotalEditItemList.find(
        x => x.Id == this.SubmitterId,
      );
      if (editItem != null) {
        return editItem.TotalTriggers.find(
          x => x.TriggerName == this.TriggerName,
        );
      }
      return null;
    }
  }

  @observable
  private _Count: number = 1;
  @Expose()
  public get Count(): number {
    return this._Count;
  }
  public set Count(v: number) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'Count',
      () => (this._Count = v),
      v,
      this._Count,
    );
  }

  @observable
  private _MaxCount: number = 0;
  @Expose()
  public get MaxCount(): number {
    return this._MaxCount;
  }
  public set MaxCount(v: number) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'MaxCount',
      () => (this._MaxCount = v),
      v,
      this._MaxCount,
    );
  }

  ReplaceIds(map: Map<string, string>) {
    if (map && this.SubmitterId) {
      if (map.has(this.SubmitterId))
        this.SubmitterId = IdHelper.ReplaceIdByMap(this.SubmitterId, map);
      else this.SubmitterId = null;
    }
  }
}

export default class MissionGroup extends MissionBase {
  static readonly IsMissionReceiver = true;

  get Id() {
    return super.Id;
  }
  set Id(v) {
    super.Id = v;
    this.RemoveNotExistMissionInfo(this.Missions);
  }

  @observable
  private _ResetWhenSuccess: boolean;
  @Expose()
  public get ResetWhenSuccess(): boolean {
    return this._ResetWhenSuccess;
  }
  public set ResetWhenSuccess(v: boolean) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'ResetWhenSuccess',
      () => (this._ResetWhenSuccess = v),
      v,
      this._ResetWhenSuccess,
    );
  }

  @observable
  private _Missions: MissionInfo[];
  @Expose()
  @Type(() => MissionInfo)
  public get Missions(): MissionInfo[] {
    return this._Missions;
  }
  public set Missions(v: MissionInfo[]) {
    var action = () => {
      this._Missions = v;
      this.FindSubmitters();
      if (!ActionManager.Instance.ActionIsExecuting)
        this.RemoveNotExistMissionInfo(this.Missions);
    };
    RUHelper.TrySetPropRedoUndo(this, 'Missions', action, v, this._Missions);
  }

  @InvHandler({
    DisplayName: '成功效果',
    Type: InvokerType.Invoke,
    Checker: _cons => {
      return (
        !_cons.prototype.IsMissionReceiver &&
        !MetaHelper.getAncestors(_cons).includes(MissionBase)
      );
    },
    OrderIndex: 1,
  })
  @Expose({ name: 'SucessId' })
  get SuccessId() {
    return super.SuccessId;
  }
  set SuccessId(v) {
    super.SuccessId = v;
  }

  @observable
  private _ErrorId: string;
  @InvHandler({
    DisplayName: '失败效果',
    Type: InvokerType.Invoke,
    Checker: _cons => {
      return (
        !_cons.prototype.IsMissionReceiver &&
        !MetaHelper.getAncestors(_cons).includes(MissionBase)
      );
    },
    OrderIndex: 2,
  })
  @Expose()
  public get ErrorId(): string {
    return this._ErrorId;
  }
  public set ErrorId(v: string) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'ErrorId',
      () => (this._ErrorId = v),
      v,
      this._ErrorId,
    );
  }

  AddMissionInfoBySubmitter(missionSubmitter: MissionBase) {
    var missionInfo = new MissionInfo();
    missionInfo.SubmitterId = missionSubmitter.Id;
    this.AddMissionInfo(missionInfo);
  }

  RemoveMissionInfoBySubmitter(missionSubmitter: MissionBase) {
    var missionInfo = new MissionInfo();
    missionInfo.SubmitterId = missionSubmitter.Id;
    this.RemoveMissionInfo(missionInfo);
  }

  public AddMissionInfoByTrigger(trigger: InvokeTriggerBase) {
    var missionInfo = new MissionInfo();
    missionInfo.SubmitterId = trigger.AttachedItem.Id;
    missionInfo.TriggerName = trigger.TriggerName;
    this.AddMissionInfo(missionInfo);
  }

  RemoveMissionInfoByTrigger(trigger: InvokeTriggerBase) {
    var missionInfo = new MissionInfo();
    missionInfo.SubmitterId = trigger.AttachedItem.Id;
    missionInfo.TriggerName = trigger.TriggerName;
    this.RemoveMissionInfo(missionInfo);
  }

  AddMissionInfo(minfo: MissionInfo) {
    if (!this.CanRecordRedoUndo || minfo == null) return;
    var exsit = this.Missions?.find(
      x =>
        x.SubmitterId == minfo.SubmitterId &&
        x.TriggerName == minfo.TriggerName,
    );
    if (exsit == null) {
      var list: MissionInfo[] = [];
      if (this.Missions != null) list = [...this.Missions];
      minfo.MissionReceiver = this;
      list.push(minfo);
      this.RemoveNotExistMissionInfo(list);
      this.Missions = list.sort((a, b) => a.OrderIndex - b.OrderIndex);
    }
  }

  public RemoveMissionInfo(minfo: MissionInfo) {
    if (!this.CanRecordRedoUndo || minfo == null) return;
    var exsit = this.Missions?.find(
      x =>
        x.SubmitterId == minfo.SubmitterId &&
        x.TriggerName == minfo.TriggerName,
    );
    if (exsit != null) {
      var list = [...(this.Missions || [])];
      list.splice(list.indexOf(exsit), 1);
      exsit.MissionReceiver = null;
      this.RemoveNotExistMissionInfo(list);
      this.Missions = list.sort((a, b) => a.OrderIndex - b.OrderIndex);
    }
  }

  public SortMissions() {
    var list = [...(this.Missions || [])];
    this.Missions = list.sort((a, b) => a.OrderIndex - b.OrderIndex);
  }

  public RemoveNotExistMissionInfo(missionInfos: MissionInfo[]) {
    if (missionInfos != null && this.Scene != null) {
      var notExistInfos = missionInfos.filter(info => {
        if (info.MissionReceiver == null) info.MissionReceiver = this;
        var existSubmitter = info.Submitter;
        if (existSubmitter == null) return true;
        else {
          var invokeInvs = existSubmitter.GetDirectlyInvs();
          if (invokeInvs == null || !invokeInvs.includes(this)) return true;
          return false;
        }
      });
      for (var notExistInfo of notExistInfos)
        missionInfos.splice(missionInfos.indexOf(notExistInfo), 1);
    }
  }

  OnLinkChanged(from: InvokeHandler, isLink: boolean) {
    super.OnLinkChanged(from, isLink);
    var fromItem = from.Owner;
    if (fromItem != null) {
      if (fromItem instanceof MissionBase) {
        if (!(fromItem instanceof StopMisson)) {
          //终止器不会加入任务列表
          if (isLink) this.AddMissionInfoBySubmitter(fromItem);
          else this.RemoveMissionInfoBySubmitter(fromItem);
        }
      } else if (fromItem instanceof InvokeTriggerBase) {
        if (isLink) this.AddMissionInfoByTrigger(fromItem);
        else if (
          fromItem.InvokeHandlers?.filter(x => x.HandlerValue == this.Id)?.find(
            x => x != from,
          ) == null
        )
          //如果触发器不存在其它连接到当前记录器的线
          this.RemoveMissionInfoByTrigger(fromItem);
      }
    }
  }

  FindSubmitters() {
    for (var missioninfo of this.Missions) {
      missioninfo.MissionReceiver = this;
    }
  }

  ReplaceRelativeIds(map: Map<string, string>) {
    super.ReplaceRelativeIds(map);
    this.Missions?.forEach(x => x.ReplaceIds(map));
    var emptyMission = this.Missions.filter(x => !x.SubmitterId);
    emptyMission?.forEach(x =>
      this.Missions.splice(this.Missions.indexOf(x), 1),
    );
  }
}
