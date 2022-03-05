import MissionBase, { IsErrorRepeatSettingTemplate } from './MissionBase';
import { observable } from 'mobx';
import RUHelper from '@/redoundo/redoUndoHelper';
import IPropUndoable from '@/redoundo/IPropUndoable';
import { stores } from '@/pages';
import ActionManager from '@/redoundo/actionManager';
import { Expose, Type } from '@/class-transformer';
import { InvHandler, InvokerType } from '../../../InvokeHandlerMeta';
import MetaHelper from '@/utils/metaHelper';
import React from 'react';
import {
  InvokeHandlerListItem,
  InvokeHandlerList,
} from '../../../InvokeHandler';
import { Checkbox, Input, InputNumber, Popover } from 'antd';
import { TextAutomaticTag } from '@/components/controls/textAutomaticTag';

const MissionAccumulationTriggersTemplate = (inv: InvokeHandlerListItem) => {
  if (inv) {
    return (
      <div
        style={{
          display: '-webkit-box',
          WebkitBoxOrient: 'horizontal',
          WebkitBoxPack: 'justify',
          WebkitBoxAlign: 'center',
          whiteSpace: 'nowrap',
          width: '170px',
          position: 'relative',
          textAlign: 'center',
        }}
      >
        <div style={{ width: '25%', position: 'relative' }}>
          <InputNumber
            style={{
              width: '100%',
            }}
            value={Number(inv.DataObj?.OrderIndex || 0)}
            min={0}
            max={Number.POSITIVE_INFINITY}
            step={1}
            onChange={v => (inv.DataObj.OrderIndex = Number(v || 0))}
            size="small"
            height="15px"
            width="80px"
          ></InputNumber>
        </div>
        <div style={{ width: '55%', position: 'relative', paddingLeft: '3px' }}>
          {/* <Input
            size="small"
            style={{
              width: '100%',
            }}
            value={String(inv.DataObj?.Content || '')}
            onChange={e => (inv.DataObj.Content = String(e.target.value || ''))}
          ></Input> */}
          <TextAutomaticTag
            //regular='^[0-9,]*$' //支持正则验证
            onChange={value => (inv.DataObj.Content = String(value || ''))}
            separator=","
            value={String(inv.DataObj?.Content || '')}
          ></TextAutomaticTag>
        </div>
        <div style={{ width: '20%', position: 'relative' }}>
          <Popover content={'选中为精确，不选为模糊'}>
            <Checkbox
              checked={inv.DataObj?.IsExact || false}
              onChange={e => (inv.DataObj.IsExact = e.target.checked || false)}
            ></Checkbox>
          </Popover>
        </div>
      </div>
    );
  }
  return null;
};

const MissionAccumulationHeaderTemplate = (inv: InvokeHandlerList) => {
  if (inv) {
    return (
      <div
        style={{
          display: '-webkit-box',
          WebkitBoxOrient: 'horizontal',
          WebkitBoxPack: 'justify',
          WebkitBoxAlign: 'center',
          whiteSpace: 'nowrap',
          width: '170px',

          position: 'relative',
          textAlign: 'center',
          marginLeft: '28px',
        }}
      >
        <div style={{ width: '25%' }}>序号</div>
        <div style={{ width: '55%' }}>累加标签</div>
        <div style={{ width: '20%' }}>方式</div>
      </div>
    );
  }
  return null;
};

const MissionAccumulationTemplate = (inv: MissionAccumulation) => {
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
            display: '-webkit-box',
            WebkitBoxOrient: 'horizontal',
            WebkitBoxPack: 'start',
            WebkitBoxAlign: 'center',
            whiteSpace: 'nowrap',
            marginTop: '5px',
          }}
        >
          <div style={{}}>成功后重算</div>
          <Checkbox
            style={{ marginLeft: '5px' }}
            checked={inv.ResetWhenSuccess || false}
            onChange={e => (inv.ResetWhenSuccess = e.target.checked)}
          />
          <div style={{ marginLeft: '5px' }}>出错后重算</div>
          <Checkbox
            style={{ marginLeft: '5px' }}
            checked={inv.ResetWhenError || false}
            onChange={e => (inv.ResetWhenError = e.target.checked)}
          />
        </div>
        <div
          style={{
            display: '-webkit-box',
            WebkitBoxOrient: 'horizontal',
            WebkitBoxPack: 'start',
            WebkitBoxAlign: 'center',
            whiteSpace: 'nowrap',
            marginTop: '5px',
          }}
        >
          期望答对数
          <InputNumber
            style={{
              marginLeft: '5px',
              width: '80px',
            }}
            value={Number(inv.Count || 0)}
            min={0}
            max={Number.POSITIVE_INFINITY}
            step={1}
            onChange={v => (inv.Count = Number(v || 0))}
            size="small"
            height="15px"
            width="80px"
          ></InputNumber>
        </div>
      </div>
    );
  }
  return null;
};

export class AccumulationMdel implements IPropUndoable {
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
  private _IsExact: boolean = false;
  /**
   * 是否精确定义
   */
  @Expose()
  public get IsExact(): boolean {
    return this._IsExact;
  }
  public set IsExact(v: boolean) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'IsExact',
      () => (this._IsExact = v),
      v,
      this._IsExact,
    );
  }

  @observable
  private _OrderIndex: number = 0;
  /**
   * 是否精确定义
   */
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
}

export default class MissionAccumulation extends MissionBase {
  constructor() {
    super();
    this.SettingTemplate = MissionAccumulationTemplate;
  }

  @observable
  private _AccumulationList: AccumulationMdel[];
  @Expose()
  @Type(() => AccumulationMdel)
  @InvHandler({
    DisplayName: '累加列表',
    Type: InvokerType.Event,
    HeaderTemplate: MissionAccumulationHeaderTemplate,
    Template: MissionAccumulationTriggersTemplate,
    IsList: true,
    Checker: (_cons: any) => {
      return (
        !_cons.IsMissionReceiver &&
        !MetaHelper.getAncestors(_cons).includes(MissionBase)
      );
    },
    ValuePropertyName: 'InvId',
    ListItemType: AccumulationMdel,
    OrderIndex: 0,
  })
  public get AccumulationList(): AccumulationMdel[] {
    return this._AccumulationList;
  }
  public set AccumulationList(v: AccumulationMdel[]) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'AccumulationList',
      () => (this._AccumulationList = v),
      v,
      this._AccumulationList,
    );
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
    Template: IsErrorRepeatSettingTemplate,
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

  @observable
  private _IsErrorRepeat: boolean;
  @Expose()
  public get IsErrorRepeat(): boolean {
    return this._IsErrorRepeat;
  }
  public set IsErrorRepeat(v: boolean) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'IsErrorRepeat',
      () => (this._IsErrorRepeat = v),
      v,
      this._IsErrorRepeat,
    );
  }

  @observable
  private _Count: number = 0;
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
  private _ResetWhenError: boolean;
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
}
