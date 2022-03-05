import InvokableBase from '@/modelClasses/courseDetail/InvokableBase';
import { observable } from 'mobx';
import RUHelper from '@/redoundo/redoUndoHelper';
import { Expose } from '@/class-transformer';
import React from 'react';
import CacheHelper from '@/utils/cacheHelper';
import { Select } from 'antd';

export const SingleParamSettingTemplate = inv => {
  return (
    <div
      style={{
        display: '-webkit-box',
        WebkitBoxOrient: 'horizontal',
        WebkitBoxAlign: 'center',
        WebkitBoxPack: 'start',
        margin: '2px',
        whiteSpace: 'nowrap',
      }}
    >
      <label>{inv.SymbolName}</label>
      <Select
        size={'small'}
        style={{
          marginLeft: '3px',
          minWidth: '95px',
        }}
        defaultValue={'0'}
        value={String(inv.SymbolType)}
        onChange={value => (inv.SymbolType = value || '0')}
      >
        {CacheHelper.SymbolList?.map((v, i) => {
          return (
            <Select.Option value={v.configKey} key={v.configKey}>
              {v.configValue}
            </Select.Option>
          );
        })}
      </Select>
    </div>
  );
};
export default class SingleParamCaculator extends InvokableBase {
  constructor() {
    super();
    this.SettingTemplate = SingleParamSettingTemplate;
  }

  readonly HeaderBg = '#AF9F7F';
  readonly DetailBg = '#C8C8C8';
  get CanInvoke() {
    return false;
  }
  set CanInvoke(v: boolean) {
    super.CanInvoke = false;
  }

  readonly SymbolName = '计算方法';

  @observable
  private _SymbolType: string = '0';
  @Expose()
  public get SymbolType(): string {
    return this._SymbolType;
  }
  public set SymbolType(v: string) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'SymbolType',
      () => (this._SymbolType = v),
      v,
      this._SymbolType,
    );
  }
  GetInputParameters() {
    return ['参数'];
  }

  GetOutputParameters() {
    return ['结果'];
  }
}
