import MissionBase from './MissionBase';
import { InvHandler, InvokerType } from '../../../InvokeHandlerMeta';
import { Expose } from '@/class-transformer';
import { observable } from 'mobx';
import RUHelper from '@/redoundo/redoUndoHelper';
import React from 'react';
import { Select } from 'antd';

const StopMissionSettingTemplate = (inv: StopMisson) => {
  if (inv) {
    return (
      <div
        style={{
          display: '-webkit-box',
          WebkitBoxOrient: 'horizontal',
          WebkitBoxPack: 'start',
          whiteSpace: 'nowrap',
          marginTop: '5px',
        }}
        onWheel={e => e.stopPropagation()}
      >
        {'模式'}
        <Select
          size={'small'}
          style={{
            marginLeft: '5px',
            width: '80px',
          }}
          value={Number(inv.ControlMode || 0)}
          onChange={value => (inv.ControlMode = Number(value || 0))}
        >
          <Select.Option value={0}>终止</Select.Option>
          <Select.Option value={1}>重置</Select.Option>
        </Select>
      </div>
    );
  }
  return null;
};

export default class StopMisson extends MissionBase {
  constructor() {
    super();
    this.SettingTemplate = StopMissionSettingTemplate;
  }

  @InvHandler({ DisplayName: '停止执行', Type: InvokerType.Invoke })
  public get InvId(): string {
    return super.InvId;
  }
  public set InvId(v: string) {
    super.InvId = v;
  }

  @observable
  private _ControlMode: number;
  @Expose()
  public get ControlMode(): number {
    return this._ControlMode;
  }
  public set ControlMode(v: number) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'ControlMode',
      () => (this._ControlMode = v),
      v,
      this._ControlMode,
    );
  }

  @Expose({ groups: ['不导出'] })
  @InvHandler({
    DisplayName: '',
    Type: InvokerType.Invoke,
    DisplayInOwner: false,
  })
  public get SuccessId(): string {
    return super.SuccessId;
  }
  public set SuccessId(v: string) {
    super.SuccessId = v;
  }
}
