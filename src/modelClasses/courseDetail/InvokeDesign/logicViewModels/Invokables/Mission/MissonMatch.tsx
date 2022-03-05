import MissionBase, { IsErrorRepeatSettingTemplate } from './MissionBase';
import { observable } from 'mobx';
import RUHelper from '@/redoundo/redoUndoHelper';
import { Expose } from '@/class-transformer';
import { InvHandler, InvokerType } from '../../../InvokeHandlerMeta';
import MetaHelper from '@/utils/metaHelper';
import InvokeHandler from '../../../InvokeHandler';
import { Dropdown, Checkbox, InputNumber, Input, Select } from 'antd';
import React from 'react';

const MissonMatchSettingTemplate = (inv: MissonMatch) => {
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
          {'匹配模式'}
          <Select
            size={'small'}
            style={{
              marginLeft: '5px',
              width: '100px',
            }}
            value={Number(inv.MatchType || 0)}
            onChange={value => (inv.MatchType = Number(value || 0))}
          >
            {inv.MatchTypeList?.map((v, i) => {
              return (
                <Select.Option key={i} value={i}>
                  {v}
                </Select.Option>
              );
            })}
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
          {'匹配标签'}
          <Input
            size="small"
            style={{
              marginLeft: '5px',
              width: '100px',
            }}
            value={String(inv.Tag || '')}
            onChange={e => (inv.Tag = String(e.target.value || ''))}
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
              width: '100px',
            }}
            value={Number(inv.LockedTimer || 0)}
            min={0}
            max={Number.POSITIVE_INFINITY}
            step={0.1}
            precision={2}
            onChange={v => (inv.LockedTimer = Number(v || 0))}
            size="small"
            height="15px"
            width="100px"
          ></InputNumber>
        </div>
      </div>
    );
  }
  return null;
};

export default class MissonMatch extends MissionBase {
  constructor() {
    super();
    this.SettingTemplate = MissonMatchSettingTemplate;
  }

  public get MatchTypeList() {
    return ['字符相等', '等式', '非等式'];
  }

  //匹配类型
  @observable
  private _MatchType: number = 0;
  @Expose()
  public get MatchType(): number {
    return this._MatchType;
  }
  public set MatchType(v: number) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'MatchType',
      () => (this._MatchType = v),
      v,
      this._MatchType,
    );
  }

  @observable
  private _Tag: string = '';
  @Expose()
  public get Tag(): string {
    return this._Tag;
  }
  public set Tag(v: string) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'Tag',
      () => (this._Tag = v),
      v,
      this._Tag,
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
  private _IsErrorRepeat: boolean = false;
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
