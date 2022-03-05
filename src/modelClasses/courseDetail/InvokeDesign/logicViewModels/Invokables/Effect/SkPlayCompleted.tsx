import InvokableBase from '@/modelClasses/courseDetail/InvokableBase';
import { observable } from 'mobx';
import RUHelper from '@/redoundo/redoUndoHelper';
import {
  Expose,
  serialize,
  deserialize,
  deserializeArray,
  Type,
} from '@/class-transformer';
import IPropUndoable from '@/redoundo/IPropUndoable';
import { stores } from '@/pages';
import ActionManager from '@/redoundo/actionManager';
import SwitchSketelonAction from '@/modelClasses/courseDetail/ShowHideViewModels/SwitchSketelonAction';
import IdHelper from '@/utils/idHelper';
import { InvHandler, InvokerType } from '../../../InvokeHandlerMeta';
import React from 'react';
import { InvokeHandlerListItem } from '../../../InvokeHandler';
import SkElementsSelector from '@/components/cwDesignUI/control/showHideItems/skElementsSelector';
import { SwitchBoneIcon } from '@/svgs/designIcons';
import { check } from 'prettier';
import { Checkbox, Select } from 'antd';

const SkPlayCompletedSettingTemplate = (inv: SkPlayCompleted) => {
  if (inv) {
    return (
      <div
        style={{
          display: '-webkit-box',
          WebkitBoxOrient: 'horizontal',
          WebkitBoxPack: 'start',
          whiteSpace: 'nowrap',
        }}
        onWheel={e => e.stopPropagation()}
      >
        {'触发模式'}
        <Select
          size={'small'}
          style={{
            marginLeft: '8px',
            width: '90px',
          }}
          value={Number(inv.SkMode || 0)}
          onChange={value => (inv.SkMode = Number(value || 0))}
        >
          {inv.SkModeList?.map((v, i) => {
            return (
              <Select.Option key={i} value={i}>
                {v}
              </Select.Option>
            );
          })}
        </Select>
      </div>
    );
  }
  return null;
};

const SkPlayCompletedTemplate = (invHandler: InvokeHandlerListItem) => {
  return (
    <div
      style={{
        display: '-webkit-box',
        WebkitBoxOrient: 'horizontal',
        WebkitBoxPack: 'start',
        WebkitBoxAlign: 'center',
        whiteSpace: 'nowrap',
      }}
    >
      <SkElementsSelector
        scene={invHandler.Owner?.LogicDesign?.Scene}
        style={{ width: '14px', height: '14px', marginRight: '5px' }}
        selectorName="切换动画"
        icon={SwitchBoneIcon}
        switchBoneIds={invHandler.DataObj?.SwitchBoneIds || []}
        switchBoneIdsChanged={newIds => {
          if (invHandler.DataObj && newIds != invHandler.DataObj.SwitchBoneIds)
            invHandler.DataObj.SwitchBoneIds = newIds;
        }}
        isSingle={true}
      ></SkElementsSelector>
      隐藏
      <Checkbox
        style={{ marginLeft: '10px' }}
        checked={invHandler.DataObj?.IsHide || false}
        onChange={e => {
          if (invHandler.DataObj)
            invHandler.DataObj.IsHide = e.target.checked || false;
        }}
      />
    </div>
  );
};

class SKCompletedModel implements IPropUndoable {
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
  private _InvId: string = '';
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
  private _IsHide: boolean = false;
  @Expose()
  public get IsHide(): boolean {
    return this._IsHide;
  }
  public set IsHide(v: boolean) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'IsHide',
      () => (this._IsHide = v),
      v,
      this._IsHide,
    );
  }

  private _SwitchBoneId;
  @Expose()
  public get SwitchBoneId(): string {
    return this._SwitchBoneId;
  }
  public set SwitchBoneId(v: string) {
    this._SwitchBoneId = v;
    if (v)
      this._SwitchBoneIds =
        deserializeArray(SwitchSketelonAction, v, { strategy: 'excludeAll' }) ||
        [];
  }

  @observable
  private _SwitchBoneIds: SwitchSketelonAction[];
  public get SwitchBoneIds(): SwitchSketelonAction[] {
    return this._SwitchBoneIds;
  }
  public set SwitchBoneIds(v: SwitchSketelonAction[]) {
    var str = serialize(v); //防止在原数据上修改后返回的值无法触发redoundo
    RUHelper.TrySetPropRedoUndo(
      this,
      'SwitchBoneId',
      () => (this.SwitchBoneId = str),
      str,
      this._SwitchBoneId,
    );
  }

  ReplaceIds(map: Map<string, string>) {
    this.InvId = IdHelper.ReplaceIdByMap(this.InvId, map);
    this.SwitchBoneIds.filter(x => map.has(x.Id)).forEach(
      x => (x.Id = map.get(x.Id)),
    );
  }
}

export default class SkPlayCompleted extends InvokableBase {
  constructor() {
    super();
    this.SettingTemplate = SkPlayCompletedSettingTemplate;
  }

  @InvHandler({ DisplayName: '完成后执行', Type: InvokerType.Event })
  public get InvId() {
    return super.InvId;
  }
  public set InvId(v: string) {
    super.InvId = v;
  }

  public get SkModeList() {
    return ['顺序', '并列'];
  }

  @observable
  private _SkMode: number = 0;
  /**
   * 触发模式
   */
  @Expose()
  public get SkMode(): number {
    return this._SkMode;
  }
  public set SkMode(v: number) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'SkMode',
      () => (this._SkMode = v),
      v,
      this._SkMode,
    );
  }

  @observable
  private _SkList: SKCompletedModel[] = [];
  @InvHandler({
    DisplayName: '动画触发列表',
    Type: InvokerType.Event,
    IsList: true,
    Addable: true,
    AllowMulti: true,
    ValuePropertyName: 'InvId',
    ListItemType: SKCompletedModel,
    Template: SkPlayCompletedTemplate,
  })
  @Expose()
  @Type(() => SKCompletedModel)
  public get SkList(): SKCompletedModel[] {
    return this._SkList;
  }
  public set SkList(v: SKCompletedModel[]) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'SkList',
      () => (this._SkList = v),
      v,
      this._SkList,
    );
  }
}
