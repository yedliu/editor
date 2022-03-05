import InvokableBase from '@/modelClasses/courseDetail/InvokableBase';
import { InvHandler, InvokerType } from '../../../InvokeHandlerMeta';
import { observable } from 'mobx';
import RUHelper from '@/redoundo/redoUndoHelper';
import IdHelper from '@/utils/idHelper';
import React from 'react';
import { ElementTypes } from '@/modelClasses/courseDetail/courseDetailenum';
import { InputNumber, Select } from 'antd';
import { Expose } from '@/class-transformer';
import CommonElementsSelector from '@/components/cwDesignUI/control/showHideItems/commonElementsSelector';
import { AppearItemIcon } from '@/svgs/designIcons';

const CaptionsCtrlerTemplate = (inv: CaptionsCtrler) => {
  if (inv != null && inv.Scene != null) {
    return (
      <div
        style={{
          display: '-webkit-box',
          WebkitBoxOrient: 'vertical',
          WebkitBoxPack: 'start',
          whiteSpace: 'nowrap',
        }}
      >
        <CommonElementsSelector
          scene={inv.Scene}
          style={{ width: '14px', height: '14px', marginLeft: '3px' }}
          selectorName="选择元素"
          icon={AppearItemIcon}
          elementIds={inv.TargetId}
          elementIdsChanged={newIds => (inv.TargetId = newIds)}
          isSingle={false}
          isDisableCombined={true}
          whiteList={[ElementTypes.captions]}
        ></CommonElementsSelector>
        <div
          style={{
            display: '-webkit-box',
            WebkitBoxOrient: 'horizontal',
            WebkitBoxPack: 'start',
            whiteSpace: 'nowrap',
            marginTop: '5px',
          }}
        >
          {'延时'}
          <InputNumber
            style={{
              marginLeft: '8px',
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
        <div
          style={{
            display: '-webkit-box',
            WebkitBoxOrient: 'horizontal',
            WebkitBoxPack: 'start',
            whiteSpace: 'nowrap',
            marginTop: '5px',
          }}
        >
          {'执行动作'}
          <Select
            size={'small'}
            style={{ marginLeft: '5px' }}
            value={inv.Action || 0}
            onChange={value => {
              inv.Action = Number(value) || 0;
            }}
          >
            {inv.ActionNames?.map((v, i) => {
              return (
                <Select.Option value={i} key={i}>
                  {v}
                </Select.Option>
              );
            })}
          </Select>
        </div>
      </div>
    );
  }
  return null;
};

export default class CaptionsCtrler extends InvokableBase {
  constructor() {
    super();
    this.SettingTemplate = CaptionsCtrlerTemplate;
  }

  @InvHandler({ Type: InvokerType.Invoke, DisplayName: '下一步' })
  public get InvId(): string {
    return super.InvId;
  }
  public set InvId(v: string) {
    super.InvId = v;
  }

  @observable
  private _TargetId: string;
  @Expose()
  public get TargetId(): string {
    return this._TargetId;
  }
  public set TargetId(v: string) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'TargetId',
      () => (this._TargetId = v),
      v,
      this._TargetId,
    );
  }

  @observable
  private _Delay: number = 0;
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

  private _ActionNames: string[];
  public get ActionNames() {
    if (this._ActionNames == null)
      this._ActionNames = ['播放', '暂停', '从头播放', '上一段', '下一段'];
    return this._ActionNames;
  }

  @observable
  private _Action: number;
  @Expose()
  public get Action(): number {
    return this._Action;
  }
  public set Action(v: number) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'Action',
      () => (this._Action = v),
      v,
      this._Action,
    );
  }

  ReplaceRelativeIds(map: Map<string, string>) {
    super.ReplaceRelativeIds(map);
    this.TargetId = IdHelper.ReplaceIdByMap(this.TargetId, map);
  }
}
