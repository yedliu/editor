import InvokableBase from '@/modelClasses/courseDetail/InvokableBase';
import { observable } from 'mobx';
import RUHelper from '@/redoundo/redoUndoHelper';
import { Expose } from '@/class-transformer';
import { InvHandler, InvokerType } from '../../../InvokeHandlerMeta';
import MetaHelper from '@/utils/metaHelper';
import InvokeHandler from '../../../InvokeHandler';
import React from 'react';
import { Checkbox, Dropdown } from 'antd';

export const IsSucessRepeatSettingTemplate = (inv: InvokeHandler) => {
  if (inv) {
    return (
      <Dropdown
        placement="topCenter"
        overlay={
          <div
            style={{
              userSelect: 'none',
              padding: '3px',
              background: 'white',
              WebkitBoxShadow: '0px 0px 10px #999999BF',
            }}
          >
            重复触发
          </div>
        }
        trigger={['hover']}
      >
        <Checkbox
          checked={inv.DataObj?.IsSucessRepeat || false}
          onChange={e => {
            if (inv.DataObj)
              inv.DataObj.IsSucessRepeat = e.target.checked || false;
          }}
        ></Checkbox>
      </Dropdown>
    );
  }
  return null;
};

export const IsErrorRepeatSettingTemplate = (inv: InvokeHandler) => {
  if (inv) {
    return (
      <Dropdown
        placement="topCenter"
        overlay={
          <div
            style={{
              userSelect: 'none',
              padding: '3px',
              background: 'white',
              WebkitBoxShadow: '0px 0px 10px #999999BF',
            }}
          >
            重复触发
          </div>
        }
        trigger={['hover']}
      >
        <Checkbox
          checked={inv.DataObj?.IsErrorRepeat || false}
          onChange={e => {
            if (inv.DataObj)
              inv.DataObj.IsErrorRepeat = e.target.checked || false;
          }}
        ></Checkbox>
      </Dropdown>
    );
  }
  return null;
};

export default class MissionBase extends InvokableBase {
  readonly HeaderBg = '#5F8362';

  static readonly IsMissionHandler: boolean = true;

  get SelfInvokable() {
    return false;
  }

  get CanBeCombined() {
    return false;
  }

  @observable
  private _LockedTimer: number;
  @Expose()
  public get LockedTimer(): number {
    return this._LockedTimer;
  }
  public set LockedTimer(v: number) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'LockedTimer',
      () => (this._LockedTimer = v),
      v,
      this._LockedTimer,
    );
  }

  @InvHandler({
    DisplayName: '提交',
    Type: InvokerType.Invoke,
    Checker: (_cons: any) => {
      return _cons.IsMissionReceiver;
    },
    AllowMulti: false,
    OrderIndex: 0,
  })
  get InvId() {
    return super.InvId;
  }
  set InvId(v) {
    super.InvId = v;
  }

  @observable
  private _SuccessId: string;
  @Expose({ name: 'SucessId' })
  @InvHandler({
    DisplayName: '成功效果',
    Type: InvokerType.Invoke,
    Checker: (_cons: any) => {
      return (
        !_cons.IsMissionReceiver &&
        !MetaHelper.getAncestors(_cons).includes(MissionBase)
      );
    },
    OrderIndex: 1,
    Template: IsSucessRepeatSettingTemplate,
  })
  public get SuccessId(): string {
    return this._SuccessId;
  }
  public set SuccessId(v: string) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'SuccessId',
      () => (this._SuccessId = v),
      v,
      this._SuccessId,
    );
  }

  @observable
  private _IsSucessRepeat: boolean = false;
  @Expose()
  public get IsSucessRepeat(): boolean {
    return this._IsSucessRepeat;
  }
  public set IsSucessRepeat(v: boolean) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'IsSucessRepeat',
      () => (this._IsSucessRepeat = v),
      v,
      this._IsSucessRepeat,
    );
  }

  OnDeleting() {
    super.OnDeleting();
    this.InvId = null;
  }
}
