import InvokableBase from '@/modelClasses/courseDetail/InvokableBase';
import { observable } from 'mobx';
import {
  ResourceRef,
  RefSelectorType,
} from '@/modelClasses/courseDetail/resRef/resourceRef';
import RUHelper from '@/redoundo/redoUndoHelper';
import { Expose, Type } from '@/class-transformer';
import { InvHandler, InvokerType } from '../../../InvokeHandlerMeta';
import CWResource from '@/modelClasses/courseDetail/cwResource';
import React from 'react';
import { InputNumber } from 'antd';
import ResourceRefView from '@/components/cwDesignUI/control/resourceRefView';

const SkReSouceValidChangedActionSettingTemplate = (
  inv: SkReSouceValidChangedAction,
) => {
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
        >
          延迟时间
          <InputNumber
            style={{
              marginLeft: '8px',
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
        <div
          style={{
            marginTop: '8px',
            display: '-webkit-box',
            WebkitBoxOrient: 'horizontal',
            WebkitBoxPack: 'start',
            whiteSpace: 'nowrap',
          }}
        >
          {'切换资源'}
          <ResourceRefView
            height={60}
            style={{ marginTop: '5px', border: '1px solid #777777' }}
            resRef={inv.Resource}
            refType={RefSelectorType.Skeleton}
            selectionChanged={value => (inv.Resource = value)}
          />
        </div>
      </div>
    );
  }
  return null;
};

export default class SkReSouceValidChangedAction extends InvokableBase {
  constructor() {
    super();
    this.SettingTemplate = SkReSouceValidChangedActionSettingTemplate;
  }

  get SelfInvokable() {
    return false;
  }

  @observable
  private _Resource: ResourceRef;
  @Expose()
  @Type(() => ResourceRef)
  public get Resource(): ResourceRef {
    return this._Resource;
  }
  public set Resource(v: ResourceRef) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'Resource',
      () => (this._Resource = v),
      v,
      this._Resource,
    );
  }

  @InvHandler({ DisplayName: '完成后执行', Type: InvokerType.Invoke })
  public get InvId() {
    return super.InvId;
  }

  public set InvId(v) {
    super.InvId = v;
  }

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

  GetDependencyResources() {
    if (this.Resource != null && this.Resource.Resource != null)
      return [this.Resource.Resource];
    return [];
  }

  SearchRes(reslib: CWResource[]) {
    this.Resource?.SearchResource(reslib);
  }
}
