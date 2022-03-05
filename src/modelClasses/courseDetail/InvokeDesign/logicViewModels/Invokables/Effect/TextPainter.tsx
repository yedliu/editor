import InvokableBase from '@/modelClasses/courseDetail/InvokableBase';
import { InvHandler, InvokerType } from '../../../InvokeHandlerMeta';
import { observable } from 'mobx';
import RUHelper from '@/redoundo/redoUndoHelper';
import IdHelper from '@/utils/idHelper';
import React from 'react';
import { ElementTypes } from '@/modelClasses/courseDetail/courseDetailenum';
import { InputNumber } from 'antd';
import { Expose } from '@/class-transformer';
import CommonElementsSelector from '@/components/cwDesignUI/control/showHideItems/commonElementsSelector';
import { AppearItemIcon } from '@/svgs/designIcons';

const TextPainterSettingTemplate = (inv: TextPainter) => {
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
        <div
          style={{
            display: '-webkit-box',
            WebkitBoxOrient: 'horizontal',
            WebkitBoxPack: 'start',
            whiteSpace: 'nowrap',
            marginTop: '5px',
            WebkitBoxAlign: 'center',
          }}
        >
          {'目标'}
          <CommonElementsSelector
            scene={inv.Scene}
            style={{ width: '14px', height: '14px', marginLeft: '3px' }}
            selectorName="选择元素"
            icon={AppearItemIcon}
            elementIds={inv.TargetId}
            elementIdsChanged={newIds => (inv.TargetId = newIds)}
            isSingle={false}
            isDisableCombined={true}
            whiteList={[ElementTypes.Text]}
          ></CommonElementsSelector>
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
          {'延时'}
          <InputNumber
            style={{
              marginLeft: '8px',
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

export default class TextPainter extends InvokableBase {
  constructor() {
    super();
    this.SettingTemplate = TextPainterSettingTemplate;
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

  GetInputParameters() {
    return ['内容'];
  }

  ReplaceRelativeIds(map: Map<string, string>) {
    super.ReplaceRelativeIds(map);
    this.TargetId = IdHelper.ReplaceIdByMap(this.TargetId, map);
  }
}
