import InvokableBase from '@/modelClasses/courseDetail/InvokableBase';
import { observable } from 'mobx';
import RUHelper from '@/redoundo/redoUndoHelper';
import IPropUndoable from '@/redoundo/IPropUndoable';
import { stores } from '@/pages';
import ActionManager from '@/redoundo/actionManager';
import { Expose, Type } from '@/class-transformer';
import IdHelper from '@/utils/idHelper';
import { InvHandler, InvokerType } from '../../../InvokeHandlerMeta';
import React from 'react';
import { InputNumber, Checkbox, Select } from 'antd';
import { InvokeHandlerListItem } from '../../../InvokeHandler';
import CommonElementsSelector from '@/components/cwDesignUI/control/showHideItems/commonElementsSelector';
import { AppearItemIcon } from '@/svgs/designIcons';
import SketchColor from '@/components/cwDesignUI/control/sketchColor';

const MissionMultipleLineTemplate = (inv: MissionMultipleLine) => {
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
            marginTop: '2px',
            display: '-webkit-box',
            WebkitBoxOrient: 'horizontal',
            WebkitBoxPack: 'start',
            WebkitBoxAlign: 'center',
            whiteSpace: 'nowrap',
          }}
          onWheel={e => e.stopPropagation()}
        >
          <div style={{ width: '90px' }}>模式</div>
          <Select
            size={'small'}
            style={{ marginLeft: '5px', width: '100px' }}
            value={Number(inv.RunMode || 0)}
            onChange={value => {
              inv.RunMode = Number(value || 0);
            }}
          >
            <Select.Option value={0}>运行模式</Select.Option>
            <Select.Option value={1}>对象模式</Select.Option>
          </Select>
        </div>
        <div
          style={{
            marginTop: '5px',
            display: '-webkit-box',
            WebkitBoxOrient: 'horizontal',
            WebkitBoxPack: 'start',
            WebkitBoxAlign: 'center',
            whiteSpace: 'nowrap',
          }}
        >
          <div style={{ width: '90px' }}>粗细</div>
          <InputNumber
            style={{ marginLeft: '5px', width: '85px' }}
            size="small"
            height="18px"
            max={Number.POSITIVE_INFINITY}
            min={0}
            step={0.5}
            value={Number(inv.LineThickness || 0)}
            onChange={v => (inv.LineThickness = Number(v || 0))}
          ></InputNumber>
        </div>

        <div
          style={{
            marginTop: '5px',
            display: '-webkit-box',
            WebkitBoxOrient: 'horizontal',
            WebkitBoxPack: 'start',
            WebkitBoxAlign: 'center',
            whiteSpace: 'nowrap',
          }}
        >
          <div style={{ width: '90px' }}>线色</div>
          <SketchColor
            style={{ marginLeft: '5px', width: '85px' }}
            selectedcolor={String(inv.LineColor || '#FF333333')}
            selectedcolorchanged={value =>
              (inv.LineColor = String(value || '#FF333333'))
            }
          />
        </div>

        <div
          style={{
            marginTop: '2px',
            display: '-webkit-box',
            WebkitBoxOrient: 'horizontal',
            WebkitBoxPack: 'start',
            WebkitBoxAlign: 'center',
            whiteSpace: 'nowrap',
          }}
        >
          <div style={{ width: '90px' }}>起始线透明</div>
          <InputNumber
            style={{ marginLeft: '5px', width: '85px' }}
            size="small"
            height="18px"
            max={1}
            min={0}
            step={0.1}
            value={Number(inv.StartLineOpacity || 0)}
            onChange={v => (inv.StartLineOpacity = Number(v || 0))}
          ></InputNumber>
        </div>

        <div
          style={{
            marginTop: '5px',
            display: '-webkit-box',
            WebkitBoxOrient: 'horizontal',
            WebkitBoxPack: 'start',
            WebkitBoxAlign: 'center',
            whiteSpace: 'nowrap',
          }}
        >
          <div style={{ width: '90px' }}>结束线透明</div>
          <InputNumber
            style={{ marginLeft: '5px', width: '85px' }}
            size="small"
            height="18px"
            max={1}
            min={0}
            step={0.1}
            value={Number(inv.EndLineOpacity || 0)}
            onChange={v => (inv.StartLineOpacity = Number(v || 0))}
          ></InputNumber>
        </div>

        <div
          style={{
            marginTop: '2px',
            display: '-webkit-box',
            WebkitBoxOrient: 'horizontal',
            WebkitBoxPack: 'start',
            WebkitBoxAlign: 'center',
            whiteSpace: 'nowrap',
          }}
        >
          <div>结束点是否清除</div>
          <Checkbox
            style={{ marginLeft: '10px' }}
            checked={inv.IsEndClear || false}
            onChange={e => {
              if (inv) inv.IsEndClear = e.target.checked || false;
            }}
          />
        </div>
      </div>
    );
  }
  return null;
};

const MultipleLineTriggersTemplate = (invHandler: InvokeHandlerListItem) => {
  if (invHandler && invHandler.DataObj) {
    var data: SingleLineConfig = invHandler.DataObj;
    var inv: MissionMultipleLine = invHandler.Owner as MissionMultipleLine;
    return (
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
        {inv?.RunMode == 1 ? (
          <div
            style={{
              display: '-webkit-box',
              WebkitBoxOrient: 'horizontal',
              WebkitBoxPack: 'start',
              WebkitBoxAlign: 'center',
              whiteSpace: 'nowrap',
            }}
          >
            起始对象
            <CommonElementsSelector
              scene={inv.Scene}
              style={{ width: '14px', height: '14px', marginLeft: '3px' }}
              selectorName="起始对象"
              icon={AppearItemIcon}
              elementIds={data.StartId}
              elementIdsChanged={v => (data.StartId = v)}
              isSingle={true}
              isDisableCombined={false}
            ></CommonElementsSelector>
          </div>
        ) : null}
        <div
          style={{
            display: '-webkit-box',
            WebkitBoxOrient: 'horizontal',
            WebkitBoxPack: 'start',
            WebkitBoxAlign: 'center',
            whiteSpace: 'nowrap',
            marginLeft: '6px',
          }}
        >
          结束对象
          <CommonElementsSelector
            scene={inv.Scene}
            style={{ width: '14px', height: '14px', marginLeft: '3px' }}
            selectorName="结束对象"
            icon={AppearItemIcon}
            elementIds={data.EndId}
            elementIdsChanged={v => (data.EndId = v)}
            isSingle={true}
            isDisableCombined={false}
          ></CommonElementsSelector>
        </div>
      </div>
    );
  }
  return null;
};

class SingleLineConfig implements IPropUndoable {
  get CanRecordRedoUndo(): boolean {
    if (
      stores.courseware &&
      !stores.courseware.isLoading &&
      !ActionManager.Instance.ActionIsExecuting
    )
      return true;
    return false;
  }

  @observable
  private _InvId: string;
  @Expose()
  public get InvId(): string {
    return this._InvId;
  }
  public set InvId(v: string) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'InvId',
      () => (this._InvId = v),
      v,
      this._InvId,
    );
  }

  @observable
  private _StartId: string;
  @Expose()
  public get StartId(): string {
    return this._StartId;
  }
  public set StartId(v: string) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'StartId',
      () => (this._StartId = v),
      v,
      this._StartId,
    );
  }

  @observable
  private _EndId: string;
  @Expose()
  public get EndId(): string {
    return this._EndId;
  }
  public set EndId(v: string) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'EndId',
      () => (this._EndId = v),
      v,
      this._EndId,
    );
  }

  ReplaceIds(map: Map<string, string>) {
    this.InvId = IdHelper.ReplaceIdByMap(this.InvId, map);
    this.StartId = IdHelper.ReplaceIdByMap(this.StartId, map);
    this.EndId = IdHelper.ReplaceIdByMap(this.EndId, map);
  }
}

export default class MissionMultipleLine extends InvokableBase {
  constructor() {
    super();
    this.SettingTemplate = MissionMultipleLineTemplate;
  }

  @observable
  private _MultipleLineList: SingleLineConfig[];
  @InvHandler({
    DisplayName: '连线配置行为列表',
    Type: InvokerType.Event,
    IsList: true,
    ValuePropertyName: 'InvId',
    ListItemType: SingleLineConfig,
    Template: MultipleLineTriggersTemplate,
  })
  @Expose()
  @Type(() => SingleLineConfig)
  public get MultipleLineList(): SingleLineConfig[] {
    return this._MultipleLineList;
  }
  public set MultipleLineList(v: SingleLineConfig[]) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'MultipleLineList',
      () => (this._MultipleLineList = v),
      v,
      this._MultipleLineList,
    );
  }

  @observable
  private _RunMode: number = 0;
  @Expose()
  public get RunMode(): number {
    return this._RunMode;
  }
  public set RunMode(v: number) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'RunMode',
      () => (this._RunMode = v),
      v,
      this._RunMode,
    );
  }

  @observable
  private _LineColor: string = '#FF8ccfd5';
  @Expose()
  public get LineColor(): string {
    return this._LineColor;
  }
  public set LineColor(v: string) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'LineColor',
      () => (this._LineColor = v),
      v,
      this._LineColor,
    );
  }

  @observable
  private _LineThickness: number = 8;
  @Expose()
  public get LineThickness(): number {
    return this._LineThickness;
  }
  public set LineThickness(v: number) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'LineThickness',
      () => (this._LineThickness = v),
      v,
      this._LineThickness,
    );
  }

  @observable
  private _StartLineOpacity: number = 0.5;
  @Expose()
  public get StartLineOpacity(): number {
    return this._StartLineOpacity;
  }
  public set StartLineOpacity(v: number) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'StartLineOpacity',
      () => (this._StartLineOpacity = v),
      v,
      this._StartLineOpacity,
    );
  }

  @observable
  private _EndLineOpacity: number = 1.0;
  @Expose()
  public get EndLineOpacity(): number {
    return this._EndLineOpacity;
  }
  public set EndLineOpacity(v: number) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'EndLineOpacity',
      () => (this._EndLineOpacity = v),
      v,
      this._EndLineOpacity,
    );
  }

  @observable
  private _IsEndClear: boolean = false;
  @Expose()
  public get IsEndClear(): boolean {
    return this._IsEndClear;
  }
  public set IsEndClear(v: boolean) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'IsEndClear',
      () => (this._IsEndClear = v),
      v,
      this._IsEndClear,
    );
  }

  get InvId() {
    return null;
  }
  set InvId(v) {}
}
