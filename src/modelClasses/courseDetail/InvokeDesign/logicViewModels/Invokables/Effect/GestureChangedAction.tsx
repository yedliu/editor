import InvokableBase from '@/modelClasses/courseDetail/InvokableBase';
import { observable } from 'mobx';
import RUHelper from '@/redoundo/redoUndoHelper';
import { InvHandler, InvokerType } from '../../../InvokeHandlerMeta';
import { Expose, Type } from '@/class-transformer';
import IdHelper from '@/utils/idHelper';
import React from 'react';
import { Checkbox, Input, InputNumber, Select } from 'antd';
import ResourceRefView from '@/components/cwDesignUI/control/resourceRefView';
import { ResourceRef } from '@/modelClasses/courseDetail/resRef/resourceRef';
import CWResource from '@/modelClasses/courseDetail/cwResource';
import SketchColor from '@/components/cwDesignUI/control/sketchColor';

const TiggerSettingTemplate = (inv: GestureChangedAction) => {
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
          尺寸
          <Input
            size="small"
            suffix="W"
            style={{ width: '80px', marginLeft: '29px' }}
            value={Number(inv.Width || 0)}
            onChange={v => (inv.Width = Number(v.target.value || 0))}
          />
          <Input
            size="small"
            suffix="H"
            style={{ width: '80px', marginLeft: '12px' }}
            value={Number(inv.Height || 0)}
            onChange={v => (inv.Height = Number(v.target.value || 0))}
          />
        </div>

        <div
          style={{
            marginTop: '8px',
          }}
        >
          <label style={{ float: 'left', marginTop: '15px' }}>手势资源</label>
          <ResourceRefView
            height={60}
            width={169}
            style={{
              marginTop: '5px',
              marginLeft: '5px',
              border: '1px solid #777777',
              float: 'left',
            }}
            resRef={inv.Resource}
            selectionChanged={value => (inv.Resource = value)}
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
        >
          点击偏移
          <Input
            size="small"
            suffix="X"
            style={{ width: '80px', marginLeft: '5px' }}
            value={Number(inv.OffsetX || 0)}
            onChange={v => (inv.OffsetX = Number(v.target.value || 0))}
          />
          <Input
            size="small"
            suffix="Y"
            style={{ width: '80px', marginLeft: '12px' }}
            value={Number(inv.OffsetY || 0)}
            onChange={v => (inv.OffsetY = Number(v.target.value || 0))}
          />
        </div>

        <div
          style={{
            marginTop: '8px',
            display: '-webkit-box',
            WebkitBoxOrient: 'horizontal',
            WebkitBoxPack: 'start',
            WebkitBoxAlign: 'center',
            whiteSpace: 'nowrap',
          }}
        >
          <span>颜色</span>
          <SketchColor
            style={{ marginLeft: '29px', width: '173px' }}
            selectedcolor={String(inv.Color || '#00000000')}
            selectedcolorchanged={value =>
              (inv.Color = String(value || '#00000000'))
            }
          />
        </div>
      </div>
    );
  }
  return null;
};

export default class GestureChangedAction extends InvokableBase {
  constructor() {
    super();
    this.SettingTemplate = TiggerSettingTemplate;
  }

  @InvHandler({ DisplayName: '完成后执行', Type: InvokerType.Invoke })
  public get InvId() {
    return super.InvId;
  }

  public set InvId(v) {
    super.InvId = v;
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

  GetDependencyResources() {
    if (this.Resource != null && this.Resource.Resource != null)
      return [this.Resource.Resource];
    return [];
  }

  SearchRes(reslib: CWResource[]) {
    this.Resource?.SearchResource(reslib);
  }

  @observable
  private _Width: number = 100;
  @Expose()
  public get Width(): number {
    return this._Width;
  }
  public set Width(v: number) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'Width',
      () => (this._Width = v),
      v,
      this._Width,
    );
  }

  @observable
  private _Height: number = 100;
  @Expose()
  public get Height(): number {
    return this._Height;
  }
  public set Height(v: number) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'Height',
      () => (this._Height = v),
      v,
      this._Height,
    );
  }

  @observable
  private _OffsetX: number = 0;
  @Expose()
  public get OffsetX(): number {
    return this._OffsetX;
  }
  public set OffsetX(v: number) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'OffsetX',
      () => (this._OffsetX = v),
      v,
      this._OffsetX,
    );
  }

  @observable
  private _OffsetY: number = 0;
  @Expose()
  public get OffsetY(): number {
    return this._OffsetY;
  }
  public set OffsetY(v: number) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'OffsetY',
      () => (this._OffsetY = v),
      v,
      this._OffsetY,
    );
  }

  @observable
  private _Color: string;
  @Expose()
  public get Color(): string {
    return this._Color;
  }
  public set Color(v: string) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'Color',
      () => (this._Color = v),
      v,
      this._Color,
    );
  }
}
