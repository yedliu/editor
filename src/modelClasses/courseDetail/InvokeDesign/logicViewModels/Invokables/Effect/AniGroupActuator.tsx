import { Exclude, Expose, Type } from '@/class-transformer';
import RUHelper from '@/redoundo/redoUndoHelper';
import { InputNumber, Select } from 'antd';
import { reaction } from 'mobx';
import { observable } from 'mobx';
import React from 'react';
import { InvokeHandlerListItem } from '../../../InvokeHandler';
import { InvHandler, InvokerType } from '../../../InvokeHandlerMeta';
import InvokableGroup from '../InvokableGroup';
import SimpleAniActuator, {
  SimpleAniActuatorTemplate,
} from './SimpleAniActuator';

const AniGroupActuatorTemplate = (inv: AniGroupActuator) => {
  if (inv) {
    return (
      <div>
        <div
          style={{
            marginTop: '2px',
            display: '-webkit-box',
            WebkitBoxOrient: 'horizontal',
            WebkitBoxPack: 'start',
            WebkitBoxAlign: 'center',
            whiteSpace: 'nowrap',
          }}
          onWheel={e => e.stopPropagation()}
        >
          <div style={{ width: '60px' }}>播放模式</div>
          <Select
            style={{ width: '100px' }}
            value={Number(inv.PlayType)}
            onChange={v => {
              inv.PlayType = Number(v);
            }}
          >
            <Select.Option value={0}>同时播放</Select.Option>
            <Select.Option value={1}>顺序播放</Select.Option>
          </Select>
        </div>
      </div>
    );
  }
};

const AniGroupUnitTemplate = (invHandler: InvokeHandlerListItem) => {
  var unit: AniUnit = invHandler.DataObj;
  return (
    <div
      style={{
        borderRadius: '4px',
        border: `1px solid ${unit.IsSelected ? '#3333336F' : '#6666664F'}`,
        padding: '3px',
        background: 'transparent',
        position: 'relative',
        width: '280px',
      }}
      onMouseDown={() => (unit.FatherItem.IsSelected = true)}
    >
      {SimpleAniActuatorTemplate(unit)}
      {unit.TargetId ? (
        <div
          style={{
            position: 'absolute',
            right: '6px',
            top: unit.IsMustSelectSingleTarget ? '5px' : '52px',
            width: '120px',
            height: '25px',
          }}
        >
          {'延时:'}
          <InputNumber
            style={{ marginLeft: '3px', width: '60px' }}
            size="small"
            min={0}
            max={Number.POSITIVE_INFINITY}
            step={0.1}
            precision={2}
            value={Number(unit.Delay) || 0}
            onChange={v => (unit.Delay = Number(v))}
          />
        </div>
      ) : null}
    </div>
  );
};

class AniUnit extends SimpleAniActuator {
  @Exclude()
  get Id() {
    return null;
  }
  set Id(v) {
    super.Id = v;
  }

  get Position() {
    return null;
  }
  set Position(v) {
    super.Position = v;
  }

  @Exclude()
  get Type() {
    return null;
  }
  set Type(v) {
    super.Type = v;
  }

  @Exclude()
  get IsShowDetail() {
    return null;
  }
  set IsShowDetail(v) {
    super.IsShowDetail = v;
  }

  @Exclude()
  get FatherId() {
    return null;
  }
  set FatherId(v) {
    super.FatherId = v;
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
}

export default class AniGroupActuator extends InvokableGroup {
  constructor() {
    super();
    this.SettingTemplate = AniGroupActuatorTemplate;
  }

  public get CanInvoke() {
    return true;
  }
  public set CanInvoke(v) {
    super.CanInvoke = true;
  }

  @observable
  private _AniUnits: AniUnit[] = [];
  @Expose()
  @Type(() => AniUnit)
  @InvHandler({
    DisplayName: '动画列表',
    Type: InvokerType.Event,
    IsList: true,
    Addable: true,
    AllowMulti: true,
    Template: AniGroupUnitTemplate,
    ValuePropertyName: 'InvId',
    ListItemType: AniUnit,
  })
  public get AniUnits(): AniUnit[] {
    return this._AniUnits;
  }
  public set AniUnits(v: AniUnit[]) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'AniUnits',
      () => (this._AniUnits = v),
      v,
      this._AniUnits,
    );
  }

  private oldulist: AniUnit[] = [];
  protected unitChanged = reaction(
    () => this.AniUnits.map(u => u),
    ulist => {
      ulist
        .filter(u => !this.oldulist.includes(u))
        .forEach(u => {
          u.FatherItem = this;
          u.IsSelected = this.IsSelected;
        });
      ulist.forEach(u => (u.FatherItem = this));
      this.oldulist
        .filter(u => !ulist.includes(u))
        .forEach(u => {
          u.ClearTransResult();
          u.IsSelected = false;
          u.FatherItem = null;
        });
      this.oldulist = [...ulist];
    },
    {
      fireImmediately: true,
    },
  );

  @InvHandler({ DisplayName: '全部完成', Type: InvokerType.Event })
  public get InvId() {
    return super.InvId;
  }
  public set InvId(v) {
    super.InvId = v;
  }

  @observable
  private _PlayType: number = 0;
  @Expose()
  public get PlayType(): number {
    return this._PlayType;
  }
  public set PlayType(v: number) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'PlayType',
      () => (this._PlayType = v),
      v,
      this._PlayType,
    );
  }

  public OnIsSelectedChanged() {
    super.OnIsSelectedChanged();
    if (!this.IsSelected) {
      this.AniUnits.forEach(x => (x.IsSelected = false));
    } else {
      this.AniUnits.forEach(x => (x.IsSelected = true));
    }
  }

  OnDeleting() {
    super.OnDeleting();
    this.AniUnits.forEach(x => (x.IsSelected = false));
  }

  public ReplaceRelativeIds(map) {
    super.ReplaceRelativeIds(map);
    this.AniUnits.forEach(x => x.ReplaceRelativeIds(map));
  }
}
