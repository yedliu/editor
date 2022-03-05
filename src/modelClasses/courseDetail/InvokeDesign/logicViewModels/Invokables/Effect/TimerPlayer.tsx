import InvokableBase from '@/modelClasses/courseDetail/InvokableBase';
import { observable } from 'mobx';
import RUHelper from '@/redoundo/redoUndoHelper';
import { Expose, Type } from '@/class-transformer';
import {
  ResourceRef,
  RefSelectorType,
} from '@/modelClasses/courseDetail/resRef/resourceRef';
import { InvHandler, InvokerType } from '../../../InvokeHandlerMeta';
import CWResource from '@/modelClasses/courseDetail/cwResource';
import IdHelper from '@/utils/idHelper';
import { InvokeHandlerListItem } from '../../../InvokeHandler';
import React from 'react';
import { InputNumber, Checkbox } from 'antd';
import ResourceRefView from '@/components/cwDesignUI/control/resourceRefView';
import IPropUndoable from '@/redoundo/IPropUndoable';
import { stores } from '@/pages';
import ActionManager from '@/redoundo/actionManager';
import { ElementTypes } from '@/modelClasses/courseDetail/courseDetailenum';
import { Radio, Select, AutoComplete } from 'antd';
import CommonElementsSelector from '@/components/cwDesignUI/control/showHideItems/commonElementsSelector';
import { AppearItemIcon } from '@/svgs/designIcons';

const TimerPlayerTriggersTemplate = (invHandler: InvokeHandlerListItem) => {
  if (invHandler) {
    return (
      <InputNumber
        style={{
          marginLeft: '8px',
          width: '60px',
        }}
        value={Number(invHandler.DataObj.Delay || 0)}
        min={0}
        max={Number.POSITIVE_INFINITY}
        step={0.1}
        onChange={v => (invHandler.DataObj.Delay = Number(v || 0))}
        size="small"
        height="15px"
        width="60px"
      ></InputNumber>
    );
  }
  return null;
};

const TimerPlayerSettingTemplate = (inv: TimerPlayer) => {
  if (inv) {
    return (
      <div
        style={{
          display: '-webkit-box',
          WebkitBoxOrient: 'vertical',
          WebkitBoxPack: 'start',
        }}
      >
        <div
          style={{
            marginTop: '2px',
            display: '-webkit-box',
            WebkitBoxOrient: 'horizontal',
            WebkitBoxPack: 'start',
            WebkitBoxAlign: 'center',
            whiteSpace: 'nowrap',
          }}
        >
          <div>计时声音</div>
          <div style={{ background: '#FFFFFF1F', marginLeft: '5px' }}>
            <ResourceRefView
              style={{
                border: '1px solid #676767',
              }}
              refType={RefSelectorType.Audio}
              height={50}
              width={160}
              resRef={inv.ClockVoice}
              selectionChanged={resref => (inv.ClockVoice = resref)}
            />
          </div>
        </div>

        <div
          style={{
            display: '-webkit-box',
            WebkitBoxOrient: 'horizontal',
            WebkitBoxPack: 'start',
            whiteSpace: 'nowrap',
            marginTop: '5px',
          }}
        >
          {'倒计时长'}
          <InputNumber
            style={{
              width: 160,
              marginLeft: '5px',
            }}
            value={Number(inv.Timer || 0)}
            min={0}
            max={Number.POSITIVE_INFINITY}
            step={0.1}
            precision={2}
            onChange={v => (inv.Timer = Number(v || 0))}
            size="small"
            height="15px"
          ></InputNumber>
        </div>

        <div
          style={{
            marginTop: '8px',
            display: '-webkit-box',
            WebkitBoxOrient: 'horizontal',
            WebkitBoxPack: 'start',
            whiteSpace: 'nowrap',
          }}
          onWheel={e => e.stopPropagation()}
        >
          计时格式
          <Select
            size={'small'}
            style={{ marginLeft: '5px', width: 160 }}
            value={Number(inv.TimerFormatMode || 0)}
            onChange={value => {
              inv.TimerFormatMode = String(value || 0);
            }}
          >
            <Select.Option value={0}>秒</Select.Option>
            <Select.Option value={1}>分秒</Select.Option>
            <Select.Option value={2}>时分秒</Select.Option>
          </Select>
        </div>

        <div
          style={{
            marginTop: '8px',
            display: '-webkit-box',
            WebkitBoxOrient: 'horizontal',
            WebkitBoxPack: 'start',
            whiteSpace: 'nowrap',
          }}
          onWheel={e => e.stopPropagation()}
        >
          计时分隔
          <Select
            size={'small'}
            style={{ marginLeft: '5px', width: 160 }}
            value={Number(inv.TimerSplit || 0)}
            onChange={value => {
              inv.TimerSplit = String(value || 0);
            }}
          >
            <Select.Option value={0}>-</Select.Option>
            <Select.Option value={1}>/</Select.Option>
            <Select.Option value={2}>:</Select.Option>
            <Select.Option value={3}>中文</Select.Option>
          </Select>
        </div>

        <div
          style={{
            marginTop: '8px',
            display: '-webkit-box',
            WebkitBoxOrient: 'horizontal',
            WebkitBoxPack: 'start',
            whiteSpace: 'nowrap',
          }}
          onWheel={e => e.stopPropagation()}
        >
          计时方式
          <Select
            // getPopupContainer={triggerNode => {
            //   //var node = document.getElementsByClassName("noCalcChildrenSize")[0] as HTMLElement;
            //    var node = triggerNode.parentElement as HTMLElement;
            //   return node;
            // }}
            size={'small'}
            dropdownMatchSelectWidth={true}
            style={{ marginLeft: '5px', width: 160 }}
            value={Number(inv.TimerMode || 0)}
            onChange={value => {
              inv.TimerMode = Number(value || 0);
            }}
          >
            <Select.Option value={0}>正常计时</Select.Option>
            <Select.Option value={1}>倒计时</Select.Option>
          </Select>
        </div>

        <div
          style={{
            marginTop: '8px',
            display: '-webkit-box',
            WebkitBoxOrient: 'horizontal',
            WebkitBoxPack: 'start',
            whiteSpace: 'nowrap',
          }}
        >
          重置页面
          <Checkbox
            style={{ marginLeft: '5px' }}
            checked={inv.IsReset || false}
            onChange={e => (inv.IsReset = e.target.checked)}
          />
        </div>

        <div
          style={{
            marginTop: '8px',
            display: '-webkit-box',
            WebkitBoxOrient: 'horizontal',
            WebkitBoxPack: 'start',
            whiteSpace: 'nowrap',
          }}
        >
          <div style={{ width: '48px' }}>可暂停</div>
          <Checkbox
            style={{ marginLeft: '5px' }}
            checked={inv.IsSuspend || false}
            onChange={e => (inv.IsSuspend = e.target.checked)}
          />
        </div>

        <div
          style={{
            marginTop: '8px',
            display: '-webkit-box',
            WebkitBoxOrient: 'horizontal',
            WebkitBoxPack: 'start',
            whiteSpace: 'nowrap',
          }}
        >
          输出计时
          <Checkbox
            style={{ marginLeft: '5px' }}
            checked={inv.IsOutTimer || false}
            onChange={e => (inv.IsOutTimer = e.target.checked)}
          />
        </div>
        {inv.IsOutTimer ? (
          <div
            style={{
              marginTop: '8px',
              display: '-webkit-box',
              WebkitBoxOrient: 'horizontal',
              WebkitBoxPack: 'start',
              whiteSpace: 'nowrap',
              WebkitBoxAlign: 'center',
            }}
          >
            目标文本
            <CommonElementsSelector
              scene={inv.Scene}
              style={{ width: '14px', height: '14px', marginLeft: '3px' }}
              selectorName="选择元素"
              icon={AppearItemIcon}
              elementIds={inv.OutPutTextId}
              elementIdsChanged={newIds => (inv.OutPutTextId = newIds)}
              isSingle={false}
              isDisableCombined={true}
              whiteList={[ElementTypes.Text]}
            ></CommonElementsSelector>
          </div>
        ) : null}
      </div>
    );
  }
  return null;
};

class TimePoint implements IPropUndoable {
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
  private _Delay: number = 0;
  @Expose()
  public get Delay(): number {
    return this._Delay;
  }
  public set Delay(v: number) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'Delay',
      () => (this._Delay = v),
      v,
      this._Delay,
    );
  }

  @observable
  private _InvId: string;
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

  ReplaceIds(map: Map<string, string>) {
    if (map != null) {
      map.forEach((v, k) => {
        this.InvId = IdHelper.ReplaceId(this.InvId, k, v);
      });
    }
  }
}

export default class TimerPlayer extends InvokableBase {
  constructor() {
    super();

    this.SettingTemplate = TimerPlayerSettingTemplate;
  }

  @observable
  private _OutPutTextId: string;
  @Expose()
  public get OutPutTextId(): string {
    return this._OutPutTextId;
  }
  public set OutPutTextId(v: string) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'OutPutTextId',
      () => (this._OutPutTextId = v),
      v,
      this._OutPutTextId,
    );
  }

  @observable
  private _Timer: number;
  @Expose()
  public get Timer(): number {
    return this._Timer;
  }
  public set Timer(v: number) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'Timer',
      () => (this._Timer = v),
      v,
      this._Timer,
    );
  }

  @observable
  private _TimerMode: number = 0;
  @Expose()
  public get TimerMode(): number {
    return this._TimerMode;
  }
  public set TimerMode(v: number) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'TimerMode',
      () => (this._TimerMode = v),
      v,
      this._TimerMode,
    );
  }

  @observable
  private _IsSuspend: boolean;
  @Expose()
  public get IsSuspend(): boolean {
    return this._IsSuspend;
  }
  public set IsSuspend(v: boolean) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'IsSuspend',
      () => (this._IsSuspend = v),
      v,
      this._IsSuspend,
    );
  }

  @observable
  private _IsReset: boolean;
  @Expose()
  public get IsReset(): boolean {
    return this._IsReset;
  }
  public set IsReset(v: boolean) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'IsReset',
      () => (this._IsReset = v),
      v,
      this._IsReset,
    );
  }

  @observable
  private _ClockVoice: ResourceRef;
  @Expose()
  @Type(() => ResourceRef)
  public get ClockVoice(): ResourceRef {
    return this._ClockVoice;
  }
  public set ClockVoice(v: ResourceRef) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'ClockVoice',
      () => (this._ClockVoice = v),
      v,
      this._ClockVoice,
    );
  }

  @observable
  private _TimerFormatMode: string = '0';
  @Expose()
  public get TimerFormatMode(): string {
    return this._TimerFormatMode;
  }
  public set TimerFormatMode(v: string) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'TimerFormatMode',
      () => (this._TimerFormatMode = v),
      v,
      this._TimerFormatMode,
    );
  }

  @observable
  private _TimerSplit: string = '0';
  @Expose()
  public get TimerSplit(): string {
    return this._TimerSplit;
  }
  public set TimerSplit(v: string) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'TimerSplit',
      () => (this._TimerSplit = v),
      v,
      this._TimerSplit,
    );
  }

  @observable
  private _IsOutTimer: boolean;
  @Expose()
  public get IsOutTimer(): boolean {
    return this._IsOutTimer;
  }
  public set IsOutTimer(v: boolean) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'IsOutTimer',
      () => (this._IsOutTimer = v),
      v,
      this._IsOutTimer,
    );
  }

  @observable
  private _TimerList: TimePoint[];
  @Expose()
  @InvHandler({
    DisplayName: '倒计时触发列表',
    Type: InvokerType.Event,
    IsList: true,
    Addable: true,
    AllowMulti: true,
    Template: TimerPlayerTriggersTemplate,
    ValuePropertyName: 'InvId',
    ListItemType: TimePoint,
  })
  @Type(() => TimePoint)
  public get TimerList(): TimePoint[] {
    return this._TimerList;
  }
  public set TimerList(v: TimePoint[]) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'TimerList',
      () => (this._TimerList = v),
      v,
      this._TimerList,
    );
  }

  GetDependencyResources(): CWResource[] {
    if (this.ClockVoice != null && this.ClockVoice.Resource != null)
      return [this.ClockVoice.Resource];
    return [];
  }

  SearchRes(reslib: CWResource[]) {
    this.ClockVoice?.SearchResource(reslib);
  }

  ReplaceRelativeIds(map: Map<string, string>) {
    super.ReplaceRelativeIds(map);
    this.OutPutTextId = IdHelper.ReplaceIdByMap(this.OutPutTextId, map);
  }
}
