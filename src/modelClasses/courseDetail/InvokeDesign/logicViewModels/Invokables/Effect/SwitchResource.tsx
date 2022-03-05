import InvokableBase from '@/modelClasses/courseDetail/InvokableBase';
import { observable } from 'mobx';
import RUHelper from '@/redoundo/redoUndoHelper';
import { Expose, Type } from '@/class-transformer';
import { InvHandler, InvokerType } from '../../../InvokeHandlerMeta';
import {
  InvokeHandlerList,
  InvokeHandlerListItem,
} from '../../../InvokeHandler';
import React from 'react';
import IPropUndoable from '@/redoundo/IPropUndoable';
import { stores } from '@/pages';
import ActionManager from '@/redoundo/actionManager';
import { Input, Select } from 'antd';
import {
  RefSelectorType,
  ResourceRef,
} from '@/modelClasses/courseDetail/resRef/resourceRef';
import ResourceRefView from '@/components/cwDesignUI/control/resourceRefView';
import IdHelper from '@/utils/idHelper';
import CWResource from '@/modelClasses/courseDetail/cwResource';
import CommonElementsSelector from '@/components/cwDesignUI/control/showHideItems/commonElementsSelector';
import { AppearItemIcon } from '@/svgs/designIcons';

const SwitchModelTemplate = (invHandler: InvokeHandlerListItem) => {
  var owner = invHandler.Owner as any;
  return (
    <div style={{ display: 'flex' }}>
      <label
        style={{ lineHeight: '60px', marginRight: '5px', marginLeft: '5px' }}
      >
        {invHandler.DataObj.Order}
      </label>
      <ResourceRefView
        width={180}
        resRef={invHandler.DataObj.Resource}
        refType={
          owner.ReplaceMode == 0
            ? RefSelectorType.Image
            : owner.ReplaceMode == 1
            ? RefSelectorType.Skeleton
            : RefSelectorType.ImageAndSkeleton
        }
        selectionChanged={value => (invHandler.DataObj.Resource = value)}
      />
    </div>
  );
};

export const SwitchResourceTemplate = inv => {
  return (
    <div
      style={{
        display: '-webkit-box',
        WebkitBoxOrient: 'vertical',
        WebkitBoxPack: 'start',
      }}
    >
      {/* <div>
        <label style={{ display: 'inline-block' }}>默认分支</label>
        <div style={{ display: 'inline-block' }}>
          <ResourceRefView
            width={180}
            resRef={inv.DefaultRef}
            refType={
              inv.ReplaceMode == 0
                ? RefSelectorType.Image
                : inv.ReplaceMode == 1
                ? RefSelectorType.Skeleton
                : RefSelectorType.ImageAndSkeleton
            }
            selectionChanged={value => (inv.DefaultRef = value)}
          />
        </div>
      </div> */}
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
        <label style={{ display: 'inline-block' }}>替换模式</label>
        <div style={{ display: 'inline-block' }}>
          <Select
            style={{ marginLeft: '6px', width: '100px' }}
            value={inv.ReplaceMode}
            onChange={v => (inv.ReplaceMode = v)}
          >
            {inv.ReplaceModesList.map((s, i) => (
              <Select.Option key={i} value={i}>
                {s}
              </Select.Option>
            ))}
          </Select>
        </div>
      </div>
      {/* <div>
        <label style={{ display: 'inline-block' }}>运行模式</label>
        <div style={{ display: 'inline-block' }}>
          <Select value={inv.RunMode} onChange={v => (inv.RunMode = v)}>
            <Select.Option value={0}>指定元素</Select.Option>
            <Select.Option value={1}>触发元素</Select.Option>
          </Select>
        </div>
      </div> */}
      {inv.RunMode == 1 ? null : (
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
          <label>选择元素</label>
          <CommonElementsSelector
            scene={inv.Scene}
            style={{ width: '14px', height: '14px', marginLeft: '3px' }}
            selectorName="选择元素"
            icon={AppearItemIcon}
            elementIds={inv.ElementIds}
            elementIdsChanged={v => (inv.ElementIds = v)}
            isSingle={true}
            isDisableCombined={true}
            whiteList={
              inv.ReplaceMode == 0 ? [0] : inv.ReplaceMode == 1 ? [2] : []
            }
          ></CommonElementsSelector>
        </div>
      )}
    </div>
  );
};

export class SwitchModel implements IPropUndoable {
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
  private _Order: number;
  public get Order(): number {
    return this._Order;
  }
  public set Order(v: number) {
    this._Order = v;
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

  @observable
  private _InvId: string = null;
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

  public GetDependencyResources(): CWResource[] {
    if (this.Resource != null && this.Resource.Resource != null)
      return [this.Resource.Resource];
    return null;
  }

  public SeachRes(reslib: CWResource[]): void {
    this.Resource?.SearchResource(reslib);
  }
}

export default class SwitchResource extends InvokableBase {
  constructor() {
    super();
    this.SettingTemplate = SwitchResourceTemplate;
  }
  readonly HeaderBg = '#5F8362';

  static replaceModes = ['替换图片', '替换骨骼'];

  public get ReplaceModesList() {
    return SwitchResource.replaceModes;
  }

  @observable
  private _ReplaceMode: number = 0;
  public get ReplaceMode(): number {
    return this._ReplaceMode;
  }
  @Expose()
  public set ReplaceMode(v: number) {
    var action = (() => {
      this._ReplaceMode = v;
      if (this.CanRecordRedoUndo) {
        this.ElementIds = '';
        var switchList = this.InvokeHandlers.find(
          x => x.InvokerProperty == 'SwitchList',
        );
        if (switchList != null && switchList instanceof InvokeHandlerList) {
          var subhandlers = [...switchList.SubHandlers];
          subhandlers?.forEach(x =>
            (switchList as InvokeHandlerList).RemoveSubHandler(x),
          );
        }
        this.DefaultRef = null;
      }
    }).bind(this);
    RUHelper.TrySetPropRedoUndo(
      this,
      'ReplaceMode',
      action,
      v,
      this._ReplaceMode,
    );
  }

  @observable
  private _SwitchList: SwitchModel[];
  @Expose()
  @Type(() => SwitchModel)
  @InvHandler({
    Type: InvokerType.Invoke,
    DisplayName: '资源列表',
    IsList: true,
    Addable: true,
    ValuePropertyName: 'InvId',
    ListItemType: SwitchModel,
    Template: SwitchModelTemplate,
    ListUpdated: list => {
      if (list) {
        for (let i = 0; i < list.length; i++) {
          list[i].Order = i + 1;
        }
      }
    },
  })
  public get SwitchList(): SwitchModel[] {
    return this._SwitchList;
  }
  public set SwitchList(v: SwitchModel[]) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'SwitchList',
      () => (this._SwitchList = v),
      v,
      this._SwitchList,
    );
  }

  @observable
  private _ElementIds: string;
  @Expose()
  public get ElementIds(): string {
    return this._ElementIds;
  }
  public set ElementIds(v: string) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'ElementIds',
      () => (this._ElementIds = v),
      v,
      this._ElementIds,
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
  private _DefaultRef: ResourceRef;
  @Expose()
  @Type(() => ResourceRef)
  public get DefaultRef(): ResourceRef {
    return this._DefaultRef;
  }
  public set DefaultRef(v: ResourceRef) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'DefaultRef',
      () => (this._DefaultRef = v),
      v,
      this._DefaultRef,
    );
  }

  GetInputParameters() {
    return ['参考值;disableCustom'];
  }

  ReplaceRelativeIds(map: Map<string, string>) {
    super.ReplaceRelativeIds(map);
    this.ElementIds = IdHelper.ReplaceIdByMap(this.ElementIds, map);
  }

  public GetDependencyResources(): CWResource[] {
    var resource = new Array<CWResource>();
    if (this.SwitchList != null) {
      this.SwitchList?.forEach(item => {
        var resouces = item.GetDependencyResources();
        if (resouces != null) resource.push(...resouces);
      });
      if (this.DefaultRef != null) resource.push(this.DefaultRef.Resource);
    }
    return resource;
  }

  public SearchRes(reslib: CWResource[]): void {
    this.SwitchList?.forEach(item => {
      item?.SeachRes(reslib);
    });
    this.DefaultRef?.SearchResource(reslib);
  }
}
