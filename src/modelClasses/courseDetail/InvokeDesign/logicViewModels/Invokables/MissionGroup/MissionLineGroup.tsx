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
import { InputNumber, Checkbox, Select, Input } from 'antd';
import InvokableBase from '@/modelClasses/courseDetail/InvokableBase';
import { InvokeHandlerListItem } from '../../../InvokeHandler';
import { AppearItemIcon } from '@/svgs/designIcons';
import { TextAutomaticTag } from '@/components/controls/textAutomaticTag';

const MissionLineGroupItemsTemplate = (inv: InvokeHandlerListItem) => {
  if (inv && inv.DataObj && inv.Owner) {
    var data = inv.DataObj as MissionLineGroupItem;
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
const MissionLineGroupTagSettingTemplate = (inv: MissionLineGroup) => {
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
            width: '98%',
          }}
          onWheel={e => e.stopPropagation()}
        >
          {'匹配模式'}
          <Select
            style={{ marginLeft: '4px', marginRight: '6px', width: 120 }}
            size={'small'}
            defaultValue={0}
            value={inv.PairMode}
            onChange={value => (inv.PairMode = value)}
          >
            <Select.Option value={0}>对象模式</Select.Option>
            <Select.Option value={1}>自定义模式</Select.Option>
          </Select>
        </div>
        <div
          style={{
            display: '-webkit-box',
            WebkitBoxOrient: 'horizontal',
            WebkitBoxPack: 'justify',
            WebkitBoxAlign: 'center',
            whiteSpace: 'nowrap',
            marginTop: '5px',
            width: '98%',
          }}
        >
          {'自动配对'}
          <Checkbox
            style={{ marginLeft: '4px', marginRight: '6px' }}
            checked={inv.IsAutoPair || false}
            onChange={e => (inv.IsAutoPair = e.target.checked || false)}
          ></Checkbox>
          {inv.IsAutoPair == true ? '配对错误且能连线' : null}
          {inv.IsAutoPair == true ? (
            <Checkbox
              style={{ marginLeft: '4px', marginRight: '4px' }}
              checked={inv.AutoPairIsError || false}
              onChange={e => (inv.AutoPairIsError = e.target.checked || false)}
            ></Checkbox>
          ) : null}
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
          {'剔除规则'}
          {/* <Input
            size="small"
            style={{
              marginLeft: '5px',
              width: '120px',
              height: '20px',
            }}
            value={String(inv.RuleBlacklist || '')}
            onChange={e => (inv.RuleBlacklist = String(e.target.value || ''))}
          ></Input> */}
          <div
            style={{
              marginLeft: '5px',
              width: '120px',
              //height: '20px',
            }}
          >
            <TextAutomaticTag
              regular="^[0-9,]*$" //支持正则验证
              onChange={value => (inv.RuleBlacklist = String(value || ''))}
              separator="|"
              value={String(inv.RuleBlacklist || '')}
            ></TextAutomaticTag>
          </div>
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
class MissionLineGroupItem implements IPropUndoable {
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

export default class MissionLineGroup extends MissionGroup {
  constructor() {
    super();
    this.SettingTemplate = MissionLineGroupTagSettingTemplate;
  }

  @observable
  private _LineList: MissionLineGroupItem[];
  @Expose()
  @Type(() => MissionLineGroupItem)
  @InvHandler({
    DisplayName: '连线列表',
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
    ListItemType: MissionLineGroupItem,
    Template: MissionLineGroupItemsTemplate,
  })
  public get LineList(): MissionLineGroupItem[] {
    return this._LineList;
  }
  public set LineList(v: MissionLineGroupItem[]) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'LineList',
      () => (this._LineList = v),
      v,
      this._LineList,
    );
  }

  @observable
  private _IsAutoPair: boolean = false;
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
    if (!v) {
      this.AutoPairIsError = false;
    }
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

  // @observable
  // private _RepeatInvId: string;
  // /// <summary>
  // /// 重复过后的触发ID
  // /// </summary>
  // @Expose()
  // @InvHandler({
  //   DisplayName: '重复触发',
  //   Type: InvokerType.Invoke,
  //   Checker: (_cons: any) => {
  //     //不允许连接记录器和提交器
  //     return (
  //       !_cons.IsMissionReceiver &&
  //       !MetaHelper.getAncestors(_cons).includes(MissionBase)
  //     );
  //   },
  //   AllowMulti: false,
  //   OrderIndex: 3,
  // })
  // public get RepeatInvId(): string {
  //   return this._RepeatInvId;
  // }
  // public set RepeatInvId(v: string) {
  //   RUHelper.TrySetPropRedoUndo(
  //     this,
  //     'RepeatInvId',
  //     () => (this._RepeatInvId = v),
  //     v,
  //     this._RepeatInvId,
  //   );
  // }

  @observable
  private _Count: number = 0;
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
  private _PairMode: number = 0;
  @Expose()
  public get PairMode(): number {
    return this._PairMode;
  }
  public set PairMode(v: number) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'PairMode',
      () => (this._PairMode = v),
      v,
      this._PairMode,
    );
  }

  @observable
  private _AutoPairIsError: boolean = false;
  @Expose()
  public get AutoPairIsError(): boolean {
    return this._AutoPairIsError;
  }
  public set AutoPairIsError(v: boolean) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'AutoPairIsError',
      () => (this._AutoPairIsError = v),
      v,
      this._AutoPairIsError,
    );
  }

  CheckCanBeInvoked(invoker: ILogicDesignItem) {
    var temp = super.CheckCanBeInvoked(invoker);
    if ((invoker.constructor as any).IsMissionHandler) return temp;
    return false;
  }
}
