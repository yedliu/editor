import InvokableBase from '@/modelClasses/courseDetail/InvokableBase';
import { observable, action, runInAction } from 'mobx';
import { Expose } from '@/class-transformer';
import RUHelper from '@/redoundo/redoUndoHelper';
import { InvHandler, InvokerType } from '../../../InvokeHandlerMeta';
import HttpService from '@/server/httpServer';
import React from 'react';
import { InputNumber, Select } from 'antd';
import CacheHelper from '@/utils/cacheHelper';

const ReceiveMessageSettingTemplate = (inv: ReceiveMessage) => {
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
            marginTop: '8px',
            display: '-webkit-box',
            WebkitBoxOrient: 'horizontal',
            WebkitBoxPack: 'start',
            whiteSpace: 'nowrap',
          }}
        >
          消息类型
          <Select
            size={'small'}
            style={{ marginLeft: '5px' }}
            value={inv.MessageType || '0'}
            onChange={value => {
              inv.MessageType = value?.toString() || '0';
            }}
          >
            {CacheHelper.ReceiveMessageList?.map((v, i) => {
              return (
                <Select.Option value={v.configKey} key={v.configKey}>
                  {v.configValue}
                </Select.Option>
              );
            })}
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
          延迟时间
          <InputNumber
            style={{
              marginLeft: '5px',
              width: '60px',
            }}
            value={Number(inv.Delay || 0)}
            min={0}
            max={Number.POSITIVE_INFINITY}
            step={0.1}
            onChange={v => (inv.Delay = Number(v || 0))}
            size="small"
            height="15px"
            width="60px"
          ></InputNumber>
        </div>
      </div>
    );
  }
  return null;
};

export default class ReceiveMessage extends InvokableBase {
  constructor() {
    super();
    this.SettingTemplate = ReceiveMessageSettingTemplate;
  }

  get CanInvoke() {
    return false;
  }
  set CanInvoke(v) {
    super.CanInvoke = false;
  }

  @observable
  private _MessageType: string = '0';
  @Expose()
  public get MessageType(): string {
    return this._MessageType;
  }
  public set MessageType(v: string) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'MessageType',
      () => (this._MessageType = v),
      v,
      this._MessageType,
    );
  }

  @observable
  private _Delay: number;
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

  @InvHandler({ DisplayName: '触发', Type: InvokerType.Event })
  public get InvId() {
    return super.InvId;
  }

  public set InvId(v) {
    super.InvId = v;
  }
}
