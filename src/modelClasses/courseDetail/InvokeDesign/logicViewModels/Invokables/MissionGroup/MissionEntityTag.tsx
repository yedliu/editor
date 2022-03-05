import MissionGroup from './MissionGroup';
import IPropUndoable from '@/redoundo/IPropUndoable';
import { stores } from '@/pages';
import ActionManager from '@/redoundo/actionManager';
import { observable } from 'mobx';
import { Expose, Type } from '@/class-transformer';
import RUHelper from '@/redoundo/redoUndoHelper';
import IdHelper from '@/utils/idHelper';
import { InvHandler, InvokerType } from '../../../InvokeHandlerMeta';
import MetaHelper from '@/utils/metaHelper';
import MissionBase from '../Mission/MissionBase';
import ILogicDesignItem from '../../ILogicDesignItem';
import React from 'react';
import { InputNumber, Checkbox, Input } from 'antd';
import InvokableBase from '@/modelClasses/courseDetail/InvokableBase';
import { InvokeHandlerListItem } from '../../../InvokeHandler';
import CommonElementsSelector from '@/components/cwDesignUI/control/showHideItems/commonElementsSelector';
import { AppearItemIcon } from '@/svgs/designIcons';
import { TextAutomaticTag } from '@/components/controls/textAutomaticTag';
import { ElementTypes } from '@/modelClasses/courseDetail/courseDetailenum';

const MissionEntityItemsTemplate = (inv: InvokeHandlerListItem) => {
  if (inv && inv.DataObj && inv.Owner) {
    var data = inv.DataObj as MissionEntityItem;
    return (
      <div
        style={{
          display: '-webkit-box',
          WebkitBoxOrient: 'horizontal',
          WebkitBoxPack: 'start',
          WebkitBoxAlign: 'center',
          whiteSpace: 'nowrap',
        }}
      >
        <CommonElementsSelector
          scene={inv.Owner.LogicDesign?.Scene}
          style={{ width: '14px', height: '14px', marginLeft: '3px' }}
          selectorName="出现-焦点获取"
          icon={AppearItemIcon}
          elementIds={data.FocusId}
          elementIdsChanged={v => (data.FocusId = v)}
          isSingle={true}
          isDisableCombined={true}
          whiteList={[ElementTypes.CustomText]}
        ></CommonElementsSelector>
        {/* <Input
          size="small"
          style={{
            marginLeft: '5px',
            width: '60px',
            height: '16px',
          }}
          value={String(data.Content || '')}
          onChange={e => (data.Content = String(e.target.value || ''))}
        ></Input> */}
        <div
          style={{
            marginLeft: '5px',
            width: '100px',
            //height: '16px',
          }}
        >
          <TextAutomaticTag
            //regular='^[0-9,]*$' //支持正则验证
            onChange={value => (data.Content = String(value || ''))}
            separator=","
            value={String(data.Content || '')}
          ></TextAutomaticTag>
        </div>
      </div>
    );
  }
  return null;
};

const MissionEntityTagSettingTemplate = (inv: MissionEntityTag) => {
  if (inv) {
    return (
      <div
        style={{
          display: '-webkit-box',
          WebkitBoxOrient: 'vertical',
          WebkitBoxPack: 'justify',
        }}
      >
        <div
          style={{
            display: '-webkit-box',
            WebkitBoxOrient: 'horizontal',
            WebkitBoxPack: 'justify',
            WebkitBoxAlign: 'center',
            whiteSpace: 'nowrap',
            marginTop: '5px',
          }}
        >
          {'期望答对数'}
          <InputNumber
            style={{ marginLeft: '4px', width: '90px' }}
            size="small"
            min={0}
            step={1}
            value={Number(inv.Count || 0)}
            onChange={e => (inv.Count = Number(e || 0))}
          ></InputNumber>
        </div>
        <div
          style={{
            display: '-webkit-box',
            WebkitBoxOrient: 'horizontal',
            WebkitBoxPack: 'justify',
            WebkitBoxAlign: 'center',
            whiteSpace: 'nowrap',
            marginTop: '5px',
          }}
        >
          {'期望判定数'}
          <InputNumber
            style={{ marginLeft: '4px', width: '90px' }}
            size="small"
            min={0}
            step={1}
            value={Number(inv.JudgementCount || 0)}
            onChange={e => (inv.JudgementCount = Number(e || 0))}
          ></InputNumber>
        </div>

        <div
          style={{
            display: '-webkit-box',
            WebkitBoxOrient: 'horizontal',
            WebkitBoxPack: 'justify',
            WebkitBoxAlign: 'center',
            whiteSpace: 'nowrap',
            marginTop: '5px',
          }}
        >
          {'模糊匹配'}
          <Checkbox
            style={{ marginLeft: '4px', marginRight: '6px' }}
            checked={inv.IsLike || false}
            onChange={e => (inv.IsLike = e.target.checked || false)}
          ></Checkbox>
        </div>
        <div
          style={{
            display: '-webkit-box',
            WebkitBoxOrient: 'horizontal',
            WebkitBoxPack: 'justify',
            WebkitBoxAlign: 'center',
            whiteSpace: 'nowrap',
            marginTop: '5px',
          }}
        >
          {'错误是否还原'}
          <Checkbox
            style={{ marginLeft: '4px', marginRight: '4px' }}
            checked={inv.ResetWhenError || false}
            onChange={e => (inv.ResetWhenError = e.target.checked || false)}
          ></Checkbox>
          {'成功后重算'}
          <Checkbox
            style={{ marginLeft: '4px', marginRight: '4px' }}
            checked={inv.ResetWhenSuccess || false}
            onChange={e => (inv.ResetWhenSuccess = e.target.checked || false)}
          ></Checkbox>
        </div>
        <div
          style={{
            border: '1px solid #CCCCCC',
            borderRadius: '3px',
            width: '200px',
            minHeight: '35px',
            marginTop: '3px',
          }}
        >
          任务清单
          <div
            style={{
              width: '98%',
              background: '#EEEEEE',
              height: '20px',
              display: '-webkit-box',
              WebkitBoxOrient: 'horizontal',
              WebkitBoxPack: 'justify',
              WebkitBoxAlign: 'center',
              whiteSpace: 'nowrap',
              marginLeft: '2px',
              marginRight: '2px',
            }}
          >
            <div style={{ width: '20%' }}>序号</div>
            <div style={{ width: '80%', textAlign: 'center' }}>组件注释</div>
          </div>
          {inv.Missions?.map((mission, i) => {
            return (
              <div
                key={i}
                style={{
                  width: '98%',
                  background: '#EEEEEE',
                  height: '25px',
                  display: '-webkit-box',
                  WebkitBoxOrient: 'horizontal',
                  WebkitBoxPack: 'justify',
                  WebkitBoxAlign: 'center',
                  whiteSpace: 'nowrap',
                  marginLeft: '2px',
                  marginRight: '2px',
                  marginTop: '2px',
                }}
              >
                <div style={{ width: '20%', position: 'relative' }}>
                  <InputNumber
                    style={{ width: '95%' }}
                    size="small"
                    min={0}
                    value={mission.OrderIndex}
                    onChange={e => (mission.OrderIndex = Number(e || 0))}
                  ></InputNumber>
                </div>
                <div
                  style={{
                    width: '80%',
                    position: 'relative',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                  }}
                >
                  {mission.Submitter
                    ? mission.Submitter instanceof InvokableBase
                      ? mission.Submitter.Note
                      : mission.Submitter.DisplayNameWithOwnerName
                    : null}
                </div>
              </div>
            );
          })}
          <div
            style={{
              color: '#66669F',
              cursor: 'pointer',
              marginLeft: '5px',
              marginTop: '2px',
            }}
            onClick={() => inv.SortMissions()}
          >
            排序
          </div>
        </div>
      </div>
    );
  }
  return null;
};

class MissionEntityItem implements IPropUndoable {
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
  private _Content: string = null;
  @Expose()
  public get Content(): string {
    return this._Content;
  }
  public set Content(v: string) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'Content',
      () => (this._Content = v),
      v,
      this._Content,
    );
  }

  @observable
  private _InvId: string = null;
  @Expose()
  public get InvId(): string {
    return this._InvId;
  }
  public set InvId(v: string) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'InvId',
      () => (this._InvId = v),
      v,
      this._InvId,
    );
  }

  @observable
  private _FocusId: string;
  @Expose()
  public get FocusId(): string {
    return this._FocusId;
  }
  public set FocusId(v: string) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'FocusId',
      () => (this._FocusId = v),
      v,
      this._FocusId,
    );
  }

  ReplaceIds(map: Map<string, string>) {
    if (map) {
      this.InvId = IdHelper.ReplaceIdByMap(this.InvId, map);
      this.FocusId = IdHelper.ReplaceIdByMap(this.FocusId, map);
    }
  }
}

export default class MissionEntityTag extends MissionGroup {
  constructor() {
    super();
    this.SettingTemplate = MissionEntityTagSettingTemplate;
  }

  @observable
  private _NexhaustivityList: MissionEntityItem[];
  @Expose()
  @Type(() => MissionEntityItem)
  @InvHandler({
    DisplayName: '对象列表',
    Type: InvokerType.Event,
    IsList: true,
    ValuePropertyName: 'InvId',
    Checker: (_cons: any) => {
      //不允许连接记录器和提交器
      return (
        !_cons.IsMissionReceiver &&
        !MetaHelper.getAncestors(_cons).includes(MissionBase)
      );
    },
    ListItemType: MissionEntityItem,
    Template: MissionEntityItemsTemplate,
  })
  public get NexhaustivityList(): MissionEntityItem[] {
    return this._NexhaustivityList;
  }
  public set NexhaustivityList(v: MissionEntityItem[]) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'NexhaustivityList',
      () => (this._NexhaustivityList = v),
      v,
      this._NexhaustivityList,
    );
  }

  @observable
  private _IsAutoPair: boolean;
  @Expose()
  /// <summary>
  /// 是否自动配对-只支持两两配对
  /// </summary>
  public get IsAutoPair(): boolean {
    return this._IsAutoPair;
  }
  public set IsAutoPair(v: boolean) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'IsAutoPair',
      () => {
        if (!v) this.RuleBlacklist = null;
        this._IsAutoPair = v;
      },
      v,
      this._IsAutoPair,
    );
  }

  @observable
  private _RuleBlacklist: string = '';
  /// <summary>
  /// 黑名单规则
  /// </summary>
  @Expose()
  public get RuleBlacklist(): string {
    return this._RuleBlacklist;
  }
  public set RuleBlacklist(v: string) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'RuleBlacklist',
      () => (this._RuleBlacklist = v),
      v,
      this._RuleBlacklist,
    );
  }

  @observable
  private _RepeatInvId: string;
  /// <summary>
  /// 重复过后的触发ID
  /// </summary>
  @Expose()
  @InvHandler({
    DisplayName: '重复触发',
    Type: InvokerType.Invoke,
    Checker: (_cons: any) => {
      //不允许连接记录器和提交器
      return (
        !_cons.IsMissionReceiver &&
        !MetaHelper.getAncestors(_cons).includes(MissionBase)
      );
    },
    AllowMulti: false,
    OrderIndex: 3,
  })
  public get RepeatInvId(): string {
    return this._RepeatInvId;
  }
  public set RepeatInvId(v: string) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'RepeatInvId',
      () => (this._RepeatInvId = v),
      v,
      this._RepeatInvId,
    );
  }

  @observable
  private _JudgementCount: number = 1;
  @Expose()
  /// <summary>
  /// 判定数量
  /// </summary>
  public get JudgementCount(): number {
    return this._JudgementCount;
  }
  public set JudgementCount(v: number) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'JudgementCount',
      () => (this._JudgementCount = v),
      v,
      this._JudgementCount,
    );
  }

  @observable
  private _Count: number;
  /// <summary>
  /// 期望总数
  /// </summary>
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
  private _IsLike: boolean;
  /// <summary>
  /// 是否模糊
  /// </summary>
  @Expose()
  public get IsLike(): boolean {
    return this._IsLike;
  }
  public set IsLike(v: boolean) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'IsLike',
      () => (this._IsLike = v),
      v,
      this._IsLike,
    );
  }

  @observable
  private _ResetWhenError: boolean;
  /// <summary>
  /// 错误是否还原
  /// </summary>
  @Expose()
  public get ResetWhenError(): boolean {
    return this._ResetWhenError;
  }
  public set ResetWhenError(v: boolean) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'ResetWhenError',
      () => (this._ResetWhenError = v),
      v,
      this._ResetWhenError,
    );
  }

  GetInputParameters() {
    return ['剔除列表;disableCustom'];
  }

  GetOutputParameters() {
    return ['已成功列表'];
  }

  CheckCanBeInvoked(invoker: ILogicDesignItem) {
    var temp = super.CheckCanBeInvoked(invoker);
    if ((invoker.constructor as any).IsMissionHandler) return temp;
    return false;
  }
}
