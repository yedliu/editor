import InvokableBase from '@/modelClasses/courseDetail/InvokableBase';
import { observable, action, runInAction } from 'mobx';
import RUHelper from '@/redoundo/redoUndoHelper';
import { Expose } from '@/class-transformer';
import { InvHandler, InvokerType } from '../../../InvokeHandlerMeta';
import React from 'react';
import { InputNumber, Select, Input, Checkbox } from 'antd';
import HttpService from '@/server/httpServer';
import CacheHelper from '@/utils/cacheHelper';

const SendMessageSettingTemplate = (inv: SendMessage) => {
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
          onWheel={e => e.stopPropagation()}
        >
          消息类型
          <Select
            size={'small'}
            style={{ marginLeft: '5px', width: '100px' }}
            listHeight={385}
            value={inv.MessageType || '0'}
            onChange={value => {
              inv.MessageType = value?.toString() || '0';
            }}
          >
            {CacheHelper.MessageModeList?.map((v, i) => {
              return (
                <Select.Option value={v.configKey} key={v.configKey}>
                  {v.configValue}
                </Select.Option>
              );
            })}
          </Select>
        </div>

        {inv.MessageType == '2' ? (
          <div
            style={{
              marginTop: '8px',
              display: '-webkit-box',
              WebkitBoxOrient: 'horizontal',
              WebkitBoxPack: 'start',
              whiteSpace: 'nowrap',
            }}
          >
            难度级别
            <Select
              size={'small'}
              style={{ marginLeft: '5px', width: '60px' }}
              value={
                inv.DifficultyLevel ||
                CacheHelper.DifficultyLevelList?.[0].configKey ||
                undefined
              }
              onChange={value => {
                inv.DifficultyLevel = value?.toString();
              }}
            >
              {CacheHelper.DifficultyLevelList?.map((v, i) => {
                return (
                  <Select.Option value={v.configKey} key={v.configKey}>
                    {v.configValue}
                  </Select.Option>
                );
              })}
            </Select>
          </div>
        ) : null}
        {inv.MessageType == '12' ? (
          <div>
            <div
              style={{
                marginTop: '8px',
                display: '-webkit-box',
                WebkitBoxOrient: 'horizontal',
                WebkitBoxPack: 'start',
                whiteSpace: 'nowrap',
              }}
            >
              {'页面编号'}
              <Select
                size={'small'}
                style={{ marginLeft: '5px', width: '290px' }}
                value={inv.PageId || ''}
                onChange={value => {
                  inv.PageId = value?.toString() || '';
                }}
              >
                <Select.Option value="" key="">
                  {' '}
                </Select.Option>
                {inv.Scene.Courseware?.Pages?.map((v, i) => {
                  return (
                    <Select.Option
                      value={v.Id}
                      key={v.Id}
                      onMouseEnter={e => {
                        v.IsHoverId = true;
                      }}
                      onMouseLeave={e => {
                        v.IsHoverId = false;
                      }}
                    >
                      {v.PageIndex}-{v.Id}
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
              是否发送正确消息
              <Checkbox
                style={{ marginLeft: '10px' }}
                checked={inv.IsSendMessage || false}
                onChange={e => {
                  if (inv) inv.IsSendMessage = e.target.checked || false;
                }}
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
              {'视频开始时间'}
              <InputNumber
                style={{
                  marginLeft: '5px',
                  maxWidth: '80px',
                }}
                value={Number(inv.StartTimer || 0)}
                min={0}
                max={Number.POSITIVE_INFINITY}
                step={0.1}
                precision={2}
                onChange={v => (inv.StartTimer = Number(v || 0))}
                size="small"
              ></InputNumber>
            </div>
          </div>
        ) : null}

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
            precision={2}
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

export default class SendMessage extends InvokableBase {
  constructor() {
    super();
    this.SettingTemplate = SendMessageSettingTemplate;
  }

  public get SelfInvokable() {
    return false;
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

  //#region  只有类型为：跳转指定页才生效
  //页面编号
  @observable
  private _PageId: string = null;
  @Expose()
  public get PageId(): string {
    return this._PageId;
  }
  public set PageId(v: string) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'PageId',
      () => (this._PageId = v),
      v,
      this._PageId,
    );
  }

  //是否发送正确消息
  @observable
  private _IsSendMessage: boolean = false;
  @Expose()
  public get IsSendMessage(): boolean {
    return this._IsSendMessage;
  }
  public set IsSendMessage(v: boolean) {
    this._IsSendMessage = v;
  }

  //跳转视频开始时间（只有类型为：跳转指定页才生效）
  @observable
  private _StartTimer: number;
  @Expose()
  public get StartTimer(): number {
    return this._StartTimer;
  }
  public set StartTimer(v: number) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'StartTimer',
      () => (this._StartTimer = v),
      v,
      this._StartTimer,
    );
  }
  //#endregion

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

  @observable
  private _DifficultyLevel: string;
  @Expose()
  public get DifficultyLevel(): string {
    return this._DifficultyLevel;
  }
  public set DifficultyLevel(v: string) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'DifficultyLevel',
      () => (this._DifficultyLevel = v),
      v,
      this._DifficultyLevel,
    );
  }

  @InvHandler({ DisplayName: '完成后执行', Type: InvokerType.Invoke })
  public get InvId() {
    return super.InvId;
  }

  public set InvId(v) {
    super.InvId = v;
  }
}
