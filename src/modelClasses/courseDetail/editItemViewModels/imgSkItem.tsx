import React from 'react';
import CWElement from '../cwElement';
import CWResource from '../cwResource';
import ImgItemTemplate, {
  PropPanelTemplate as ImgItemPropPanelTemplate,
} from '@/components/cwDesignUI/elements/controlTemplates/imgItemTemplate';
import { from } from 'linq-to-typescript';
import { batch } from '@/server/CacheEntityServer';
import {
  AnimationType,
  IncludedType,
  ZoomType,
  AppearTypes,
  ClassType,
  ElementTypes,
  CWResourceTypes,
} from '../courseDetailenum';
import { ResourceRef, SkResRef } from '../resRef/resourceRef';
import { observable, computed } from 'mobx';
import { Expose, Type } from '@/class-transformer';
import RUHelper from '@/redoundo/redoUndoHelper';
import InvokeTriggerBase from '../triggers/invokeTriggerBase';
import { InvokeTriggerSetting } from '../triggers/invokeTriggerSetting';
import { ViewTemplate } from '../toolbox/CustomTypeDefine';
import CombinedEditItem from './combinedEditItem';

export default class ImgSkItem extends CWElement {
  constructor() {
    super();
  }

  // get AutoClearWhenEmpty() { return false; }
  // get AutoResetboundary() { return false; }

  // AutoSetChildrenPosition() {
  //   this.Children?.forEach(x => x.IsDesignHide = true);
  // }

  public get Template(): ViewTemplate {
    return ImgItemTemplate;
  }

  public get PropPanelTemplate(): ViewTemplate {
    return ImgItemPropPanelTemplate;
  }

  @observable
  private _ResRef: ResourceRef;

  public HasSizableRes: boolean = true;

  @batch(ClassType.resource)
  public get ResRef(): ResourceRef {
    return this._ResRef;
  }
  public set ResRef(v: ResourceRef) {
    var action = () => {
      this._ResRef = v;
      if (
        this._ResRef == null ||
        this._ResRef.Resource == null ||
        this._ResRef.Resource.resourceType == CWResourceTypes.Image
      ) {
        this.ElementType = ElementTypes.Image;
        if (this.ExtendedTriggers != null) {
          let item = this.ExtendedTriggers.find(
            x => x.TriggerName == 'SkeletalCompleted',
          );
          if (item != null) {
            var index = this.ExtendedTriggers.indexOf(item);
            if (index > -1) this.ExtendedTriggers.splice(index, 1);
          }
        }
      } else if (
        this._ResRef?.Resource?.resourceType == CWResourceTypes.SkeletalAni
      ) {
        this.ElementType = ElementTypes.Skeleton;
        if (
          this.ExtendedTriggers &&
          this.ExtendedTriggers.find(
            x => x.TriggerName == 'SkeletalCompleted',
          ) == null
        ) {
          let tigger = {
            TriggerName: 'SkeletalCompleted',
            AttachedItem: this as CWElement,
            DisplayName: '动画结束',
          };
          // this.ExtendedTriggers.push(tigger as InvokeTriggerBase);
        }
      }
    };
    RUHelper.TrySetPropRedoUndo(this, 'ResRef', action, v, this._ResRef);
  }

  private _Res: CWResource = null;
  @batch(ClassType.resource)
  public get Res(): CWResource {
    if (this.ResRef != null) return this.ResRef.Resource;
    else return null;
  }
  public set Res(v: CWResource) {
    this._Res = v;
    this.AttachResource(this._Res);
  }

  @Expose()
  public get ResourceId(): string {
    if (this.Res) return this.Res.resourceId;
    else return super.ResourceId;
  }

  public set ResourceId(v: string) {
    super.ResourceId = v;
  }

  @Expose()
  public get DefaultAction(): string {
    if (
      this.ElementType == ElementTypes.Skeleton &&
      this.ResRef != null &&
      this.ResRef instanceof SkResRef
    ) {
      return this.ResRef.Action || this.ResRef.Resource?.boneList?.[0]?.value;
    }
    return undefined;
  }

  private _readDefaultAction: string;
  public set DefaultAction(v: string) {
    if (this.ResRef != null && this.ResRef instanceof SkResRef)
      this.ResRef = new SkResRef(
        this.ResRef.Resource,
        v,
        this.ResRef.PlayTimes,
      );
    this._readDefaultAction = v;
  }

  @Expose()
  public get SkPlayTimes(): number {
    if (
      this.ElementType == ElementTypes.Skeleton &&
      this.ResRef != null &&
      this.ResRef instanceof SkResRef
    ) {
      return this.ResRef.PlayTimes || 0;
    }
    return 0;
  }

  private _readSkPlayTimes: number;
  public set SkPlayTimes(v: number) {
    if (this.ResRef != null && this.ResRef instanceof SkResRef)
      this.ResRef = new SkResRef(this.ResRef.Resource, this.ResRef.Action, v);
    this._readSkPlayTimes = v;
  }

  // 是否支持选中
  @observable
  private _RunIsSelected: boolean = false;
  @Expose()
  @batch(ClassType.bool)
  public get RunIsSelected(): boolean {
    return this._RunIsSelected;
  }
  public set RunIsSelected(v: boolean) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'RunIsSelected',
      () => (this._RunIsSelected = v),
      v,
      this._RunIsSelected,
    );

    if (!v) {
      this.RunSelectedRes = null;
    }
  }

  //选中要切换的资源
  @observable
  private _RunSelectedRes: ResourceRef;
  @Expose()
  @batch(ClassType.resource)
  @Type(() => ResourceRef)
  public get RunSelectedRes(): ResourceRef {
    return this._RunSelectedRes;
  }
  public set RunSelectedRes(v: ResourceRef) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'RunSelectedRes',
      () => (this._RunSelectedRes = v),
      v,
      this._RunSelectedRes,
    );
  }

  //设置资源内容
  public SetResourcesFromLib(reslib: CWResource[]) {
    if (!reslib) return;
    var res = reslib.find(x => x.resourceId == super.ResourceId);
    //动画设置方式
    if (this.ElementType == ElementTypes.Skeleton) {
      this.ResRef = new SkResRef(
        res,
        this._readDefaultAction,
        this._readSkPlayTimes,
      );
    } //图片设置方式
    else {
      this.ResRef = new ResourceRef(res);
    }

    this.RunSelectedRes?.SearchResource(reslib);
  }

  public GetDependencyResources(): CWResource[] {
    var res: CWResource[] = [];
    if (this.Res != null && this.ResourceId != null && this.ResourceId != '')
      res.push(this.Res);

    if (this.RunSelectedRes != null && this.RunSelectedRes.Resource != null)
      res.push(this.RunSelectedRes.Resource);

    return res;
  }

  public AttachResource(source: CWResource) {
    if (source != null) {
      if (source.resourceType == CWResourceTypes.Image) {
        this.ResRef = new ResourceRef(source);
      } else if (
        source.resourceType == CWResourceTypes.SkeletalAni &&
        source.boneList != null &&
        source.boneList.length > 0
      ) {
        this.ResRef = new SkResRef(source, source.boneList[0].value, 0);
      }
    }
  }
  public GetExtendedTriggerSettings() {
    var triggers = super.GetExtendedTriggerSettings();
    if (this.ElementType == ElementTypes.Skeleton) {
      triggers.push(
        new InvokeTriggerSetting(
          'SkeletalCompleted',
          '动画结束',
          InvokeTriggerBase,
        ),
      );
    }
    return triggers;
  }
}
