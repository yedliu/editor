import InvokableBase from '@/modelClasses/courseDetail/InvokableBase';
import { observable } from 'mobx';
import RUHelper from '@/redoundo/redoUndoHelper';
import { InvHandler, InvokerType } from '../../../InvokeHandlerMeta';
import { Expose } from '@/class-transformer';
import IdHelper from '@/utils/idHelper';
import React from 'react';
import { Checkbox, Select, InputNumber } from 'antd';
import CommonElementsSelector from '@/components/cwDesignUI/control/showHideItems/commonElementsSelector';
import { AppearItemIcon } from '@/svgs/designIcons';

const TiggerSettingTemplate = (inv: ElementTigger) => {
  if (inv != null) {
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
          是否处理触发对象
          <Checkbox
            style={{ marginLeft: '10px' }}
            checked={inv.IsCurrentMode || false}
            onChange={e => (inv.IsCurrentMode = e.target.checked)}
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
          onWheel={e => e.stopPropagation()}
        >
          控制模式
          <Select
            size={'small'}
            style={{ marginLeft: '5px', width: '100px' }}
            value={inv.TiggerMode || '0'}
            onChange={value => {
              inv.TiggerMode = value?.toString() || '0';
            }}
          >
            <Select.Option value={'0'}>打开</Select.Option>
            <Select.Option value={'1'}>关闭</Select.Option>
            <Select.Option value={'2'}>重置</Select.Option>
            <Select.Option value={'3'}>触发保护</Select.Option>
          </Select>
        </div>
        {inv.TiggerMode === '3' && (
          <div
            style={{
              marginTop: '8px',
              display: '-webkit-box',
              WebkitBoxOrient: 'horizontal',
              WebkitBoxPack: 'start',
              whiteSpace: 'nowrap',
            }}
          >
            保护时间
            <InputNumber
              style={{
                marginLeft: '8px',
                width: '60px',
              }}
              value={inv.TiggerMode === '3' ? Number(inv.Delay || 0) : 0}
              min={0}
              max={Number.POSITIVE_INFINITY}
              step={0.1}
              onChange={v => (inv.Delay = Number(v || 0))}
              size="small"
              height="15px"
              width="60px"
            ></InputNumber>
          </div>
        )}
        {inv.TiggerMode != '3' && (
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
            目标元素
            <CommonElementsSelector
              scene={inv.Scene}
              style={{ width: '14px', height: '14px', marginLeft: '3px' }}
              selectorName="选择元素"
              icon={AppearItemIcon}
              elementIds={inv.TiggerIds}
              elementIdsChanged={newIds => (inv.TiggerIds = newIds)}
              isSingle={false}
              isDisableCombined={false}
            ></CommonElementsSelector>
          </div>
        )}
      </div>
    );
  }
  return null;
};

export default class ElementTigger extends InvokableBase {
  constructor() {
    super();
    this.SettingTemplate = TiggerSettingTemplate;
  }

  @observable
  private _TiggerMode: string = '0';
  @Expose()
  public get TiggerMode(): string {
    return this._TiggerMode;
  }
  public set TiggerMode(v: string) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'TiggerMode',
      () => (this._TiggerMode = v),
      v,
      this._TiggerMode,
    );
  }

  @observable
  private _IsCurrentMode: boolean;
  @Expose()
  public get IsCurrentMode(): boolean {
    return this._IsCurrentMode;
  }
  public set IsCurrentMode(v: boolean) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'IsCurrentMode',
      () => (this._IsCurrentMode = v),
      v,
      this._IsCurrentMode,
    );
  }

  @observable
  private _TiggerIds: string;
  @Expose()
  public get TiggerIds(): string {
    if (this.TiggerMode != '3') return this._TiggerIds;
  }
  public set TiggerIds(v: string) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'TiggerIds',
      () => (this._TiggerIds = v),
      v,
      this._TiggerIds,
    );
  }

  // 保护时间
  @observable
  private _Delay: number;
  @Expose()
  public get Delay(): number {
    if (this.TiggerMode === '3') return this._Delay;
    return 0;
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

  @InvHandler({ DisplayName: '完成后执行', Type: InvokerType.Invoke })
  public get InvId() {
    return super.InvId;
  }

  public set InvId(v) {
    super.InvId = v;
  }

  ReplaceRelativeIds(map: Map<string, string>) {
    super.ReplaceRelativeIds(map);
    this.TiggerIds = IdHelper.ReplaceIdByMap(this.TiggerIds, map);
  }
}
