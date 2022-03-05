import MissionBase, { IsErrorRepeatSettingTemplate } from './MissionBase';
import { observable } from 'mobx';
import RUHelper from '@/redoundo/redoUndoHelper';
import { Expose } from '@/class-transformer';
import { InvHandler, InvokerType } from '../../../InvokeHandlerMeta';
import MetaHelper from '@/utils/metaHelper';
import React from 'react';
import { Input, InputNumber, Select } from 'antd';

const MissonMathsSettingTemplate = (inv: MissonMaths) => {
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
          onWheel={e => e.stopPropagation()}
        >
          {'判断类型'}
          <Select
            size="small"
            style={{
              marginLeft: '5px',
              width: '90px',
            }}
            value={Number(inv.MathsType) || 0}
            onChange={v => (inv.MathsType = Number(v) || 0)}
          >
            <Select.Option value={0} key={0}>
              等式
            </Select.Option>
            <Select.Option value={1} key={1}>
              非等式
            </Select.Option>
          </Select>
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
          {'运算等式'}
          <Input
            size="small"
            style={{
              marginLeft: '5px',
              maxWidth: '90px',
            }}
            value={String(inv.MathsTag || '')}
            onChange={e => (inv.MathsTag = String(e.target.value || ''))}
          ></Input>
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
          {'保护时间'}
          <InputNumber
            style={{
              marginLeft: '5px',
            }}
            value={Number(inv.LockedTimer || 0)}
            min={0}
            max={Number.POSITIVE_INFINITY}
            step={0.1}
            precision={2}
            onChange={v => (inv.LockedTimer = Number(v || 0))}
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

export default class MissonMaths extends MissionBase {
  constructor() {
    super();
    this.SettingTemplate = MissonMathsSettingTemplate;
  }

  @observable
  private _MathsTag: string;
  @Expose()
  public get MathsTag(): string {
    return this._MathsTag;
  }
  public set MathsTag(v: string) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'MathsTag',
      () => (this._MathsTag = v),
      v,
      this._MathsTag,
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
  private _MathsType: number;
  @Expose()
  public get MathsType(): number {
    return this._MathsType;
  }
  public set MathsType(v: number) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'MathsType',
      () => (this._MathsType = v),
      v,
      this._MathsType,
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
  private _OldRepeatId: string;
  @InvHandler({
    DisplayName: '重复触发[过时]',
    Type: InvokerType.Invoke,
    Checker: _cons => {
      return (
        !_cons.prototype.IsMissionReceiver &&
        !MetaHelper.getAncestors(_cons).includes(MissionBase)
      );
    },
    OrderIndex: 3,
  })
  @Expose()
  public get OldRepeatId(): string {
    return this._OldRepeatId;
  }
  public set OldRepeatId(v: string) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'OldRepeatId',
      () => (this._OldRepeatId = v),
      v,
      this._OldRepeatId,
    );
  }
}
