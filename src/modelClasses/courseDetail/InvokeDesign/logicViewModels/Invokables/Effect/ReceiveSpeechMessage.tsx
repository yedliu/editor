import InvokableBase from '@/modelClasses/courseDetail/InvokableBase';
import { observable, action, runInAction, values, computed } from 'mobx';
import { Expose, Type } from '@/class-transformer';
import RUHelper from '@/redoundo/redoUndoHelper';
import { InvHandler, InvokerType } from '../../../InvokeHandlerMeta';
import HttpService from '@/server/httpServer';
import React from 'react';
import { Input, InputNumber, Select } from 'antd';
import IPropUndoable from '@/redoundo/IPropUndoable';
import { stores } from '@/pages';
import {
  InvokeHandlerListItem,
  InvokeHandlerList,
} from '../../../InvokeHandler';

//与端上约定好的消息字典, 注释掉的暂时是不用的，后面需要再放开
const SpeechMessageDic = [
  // { key: 'pause', value: '暂停播放' },
  { key: 'play', value: '继续播放' },
  // { key: 'replayPreviousSection', value: '重播上一节' },
  // { key: 'playNextSection', value: '继续播放下一节' },
  { key: 'replayCurrentSection', value: '重看本节' },
  // { key: 'exitClass', value: '退出课堂' },
  // { key: 'wakeup', value: '唤醒' },
];

const ReceiveSpeechMessageHeaderTemplate = (inv: InvokeHandlerList) => {
  if (inv) {
    return (
      <div
        style={{
          display: '-webkit-box',
          WebkitBoxOrient: 'horizontal',
          WebkitBoxPack: 'justify',
          WebkitBoxAlign: 'center',
          whiteSpace: 'nowrap',
          width: '140px',
          position: 'relative',
          textAlign: 'center',
          marginLeft: '28px',
        }}
      >
        <div style={{ width: '100%' }}>消息类型</div>
        <div>选择点击模拟事件</div>
      </div>
    );
  }
  return null;
};

const ReceiveSpeechMessageTriggersTemplate = (inv: InvokeHandlerListItem) => {
  if (inv) {
    //选中的消息集合
    var selectOptionList = (inv.Owner as ReceiveSpeechMessage)
      .SpeechMessageList;

    let Triggers = (inv.Owner as ReceiveSpeechMessage).Triggers;
    let Elements = (inv.Owner as ReceiveSpeechMessage).Elements;

    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          width: '245px',
          position: 'relative',
        }}
        onWheel={e => e.stopPropagation()}
      >
        <div style={{ width: 140, position: 'relative' }}>
          <Select
            style={{
              width: '100%',
            }}
            size="small"
            value={inv.DataObj.MessageType || ''}
            onChange={value => {
              inv.DataObj.MessageType = value?.toString() || '';
            }}
          >
            {SpeechMessageDic?.map(item => {
              //下拉框里只加载没有被选中的，或者选中的值是当前自己
              if (
                selectOptionList.filter(x => x.MessageType == item.key)
                  .length == 0 ||
                item.key == inv.DataObj.MessageType
              ) {
                return (
                  <Select.Option key={item.key} value={item.key}>
                    {item.value}
                  </Select.Option>
                );
              }
            })}
          </Select>
        </div>
        <div style={{ width: 110 }}>
          <Select
            style={{
              width: '100%',
            }}
            allowClear
            value={inv.DataObj.SimulateEventId || ''}
            onChange={val => {
              inv.DataObj.SimulateEventId = val;
              Elements.map(item => {
                item.Triggers.length > 0 &&
                  item.Triggers.map(it => {
                    if (it.Id === val) {
                      inv.DataObj.ElementsId = item.Id;
                    }
                  });
              });

              Triggers.filter(item => {
                return item.Id != val;
              });
            }}
          >
            {Triggers.map(item => {
              if (
                selectOptionList.filter(x => x.SimulateEventId == item.Id)
                  .length == 0 ||
                item.Id == inv.DataObj.SimulateEventId
              ) {
                return (
                  <Select.Option key={item.Id} value={item.Id}>
                    {item.DisplayNameWithOwnerName}
                  </Select.Option>
                );
              }
            })}
          </Select>
        </div>
      </div>
    );
  }
  return null;
};

//语音消息实体
export class SpeechMessageMdel implements IPropUndoable {
  get CanRecordRedoUndo(): boolean {
    if (stores.courseware && !stores.courseware.isLoading) return true;
    return false;
  }

  //消息类型
  @observable
  private _MessageType: string = '';
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
  private _InvId: string = null;
  @Expose()
  public get InvId(): string {
    return this._InvId;
  }
  public set InvIds(v: string) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'InvId',
      () => (this._InvId = v),
      v,
      this._InvId,
    );
  }

  // 模拟触发事件ID
  @observable
  private _SimulateEventId: string = null;
  @Expose()
  public get SimulateEventId(): string {
    return this._SimulateEventId;
  }

  public set SimulateEventId(v: string) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'SimulateEventId',
      () => (this._SimulateEventId = v),
      v,
      this._SimulateEventId,
    );
  }

  // 模拟触发类型
  @observable
  private _SimulateEvent: string = 'Click';
  @Expose()
  public get SimulateEvent(): string {
    return this._SimulateEvent;
  }

  public set SimulateEvent(v: string) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'SimulateEvent',
      () => (this._SimulateEvent = v),
      v,
      this._SimulateEvent,
    );
  }

  // 所依附元素ID
  @observable
  private _ElementsId: string = '';
  @Expose()
  public get ElementsId(): string {
    return this._ElementsId;
  }

  public set ElementsId(v: string) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'ElementsId',
      () => (this._ElementsId = v),
      v,
      this._ElementsId,
    );
  }
}
export default class ReceiveSpeechMessage extends InvokableBase {
  constructor() {
    super();
  }

  get CanInvoke() {
    return true;
  }
  set CanInvoke(v) {
    super.CanInvoke = true;
  }

  @observable
  private _SpeechMessageList: SpeechMessageMdel[];
  @Expose()
  @Type(() => SpeechMessageMdel)
  @InvHandler({
    DisplayName: '消息列表',
    Type: InvokerType.Nono,
    HeaderTemplate: ReceiveSpeechMessageHeaderTemplate,
    Template: ReceiveSpeechMessageTriggersTemplate,
    IsList: true,
    ValuePropertyName: 'InvId',
    ListItemType: SpeechMessageMdel,
  })
  public get SpeechMessageList(): SpeechMessageMdel[] {
    return this._SpeechMessageList;
  }
  public set SpeechMessageList(v: SpeechMessageMdel[]) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'SpeechMessageList',
      () => (this._SpeechMessageList = v),
      v,
      this._SpeechMessageList,
    );
  }

  @computed
  public get Triggers() {
    let Triggers = [];
    if (this.CurrentElements && this.CurrentElements.length > 0) {
      this.CurrentElements.map(item => {
        item.Triggers.length > 0 &&
          item.Triggers.map(it => {
            if (it.TriggerName === 'Click') {
              Triggers.push(it);
            }
          });
      });
    }
    return Triggers;
  }

  @computed
  public get Elements() {
    return this.CurrentElements;
  }
}
