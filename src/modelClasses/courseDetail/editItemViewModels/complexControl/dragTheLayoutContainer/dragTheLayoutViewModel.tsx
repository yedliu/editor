import CWElement from '../../../cwElement';
import CWResource from '../../../cwResource';
import { batch } from '@/server/CacheEntityServer';
import RUHelper from '@/redoundo/redoUndoHelper';
import { Expose, Type, plainToClass, classToPlain } from '@/class-transformer';
import { observable, computed } from 'mobx';
import { ResourceRef, SkResRef } from '../../../resRef/resourceRef';
import {
  AnimationType,
  IncludedType,
  ZoomType,
  AppearTypes,
  ClassType,
  ElementTypes,
  CWResourceTypes,
} from '../../../courseDetailenum';

import dragTheLayoutTemplate, {
  PropPanelTemplate as dragTheLayoutTemplatePropPanelTemplate,
} from '@/components/cwDesignUI/elements/controlTemplates/dragTheLayoutTemplate';
import MathHelper from '@/utils/MathHelper';
import { number } from 'prop-types';
import { InvokeTriggerSetting } from '@/modelClasses/courseDetail/triggers/invokeTriggerSetting';
import { ValueChangedTrigger } from '@/modelClasses/courseDetail/triggers/extendedTrigger';

export default class dragTheLayoutViewModel extends CWElement {
  // protected UnitVMType: new (
  //   ...args: any[]
  // ) => any = speechRecognitionUnitBaseViewModel;

  public get Template(): any {
    return dragTheLayoutTemplate;
  }

  public get PropPanelTemplate(): any {
    return dragTheLayoutTemplatePropPanelTemplate;
  }

  constructor() {
    super();
  }

  // public componentDidUpdate(){
  //     this.UpdateCount();
  // }
  //#region 属性

  @observable
  private _Background: ResourceRef;
  @Expose()
  @batch(ClassType.resource)
  @Type(() => ResourceRef)
  public get Background(): ResourceRef {
    return this._Background;
  }
  public set Background(v: ResourceRef) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'Background',
      () => (this._Background = v),
      v,
      this._Background,
    );
  }

  @observable
  private _Tag: string;
  //限制标签
  @Expose()
  @batch(ClassType.string)
  public get Tag(): string {
    return this._Tag;
  }
  public set Tag(v: string) {
    this._Tag = v;
  }

  @observable
  private _JumpInMode: number = 0;
  //0=横向换行，1=竖向换行 ，2=叠加
  @Expose()
  @batch(ClassType.number)
  public get JumpInMode(): number {
    return this._JumpInMode;
  }
  public set JumpInMode(v: number) {
    this._JumpInMode = v;
  }

  @observable
  private _Linefeed: number = 4;
  //换行数量/换列数量
  @Expose()
  @batch(ClassType.number)
  public get Linefeed(): number {
    return this._Linefeed;
  }
  public set Linefeed(v: number) {
    this._Linefeed = v;
  }

  @observable
  private _IsOutputTag: boolean;
  //输出标签
  @Expose()
  @batch(ClassType.bool)
  public get IsOutputTag(): boolean {
    return this._IsOutputTag;
  }
  public set IsOutputTag(v: boolean) {
    this._IsOutputTag = v;
  }

  @observable
  private _IsEqualRatio: boolean;
  //等比例
  @Expose()
  @batch(ClassType.bool)
  public get IsEqualRatio(): boolean {
    return this._IsEqualRatio;
  }
  public set IsEqualRatio(v: boolean) {
    this._IsEqualRatio = v;
  }

  @observable
  private _CellWidth: number = 0;
  //单元格宽度
  @Expose()
  @batch(ClassType.number)
  public get CellWidth(): number {
    if (this.JumpInMode == 0) {
      return this.Width / this.Linefeed - 0.5;
    } else if (this.JumpInMode == 1) {
      return this.CellHeight;
    }
    return 0;
    //return this._CellWidth;
  }
  public set CellWidth(v: number) {
    this._CellWidth = v;
  }

  @observable
  private _CellHeight: number = 0;
  //单元格高度
  @Expose()
  @batch(ClassType.number)
  public get CellHeight(): number {
    if (this.JumpInMode == 0) {
      return this.CellWidth;
    } else if (this.JumpInMode == 1) {
      return this.Height / this.Linefeed - 0.5;
    }
    return 0;
    //return this._CellHeight;
  }
  public set CellHeight(v: number) {
    this._CellHeight = v;
  }

  // @observable
  // private _MaxValueCount: Array<number> = new Array<number>();
  // @batch(ClassType.object)
  // public get MaxValueCount(): Array<number> {
  //   return this._MaxValueCount;
  // }
  // public set MaxValueCount(v: Array<number>) {
  //   this._MaxValueCount = v;
  // }

  //#endregion

  //#region 资源导入导出

  public SetResourcesFromLib(reslib: CWResource[]) {
    if (!reslib) return;
    this.Background?.SearchResource(reslib);
  }

  public GetDependencyResources(): CWResource[] {
    var res = super.GetDependencyResources();
    if (this.Background != null && this.Background.Resource != null)
      res.push(this.Background.Resource);
    return res;
  }

  public AttachResource(source: CWResource) {
    if (source != null) {
      if (source.resourceType == CWResourceTypes.Image) {
        this.Background = new ResourceRef(source);
      } else if (
        source.resourceType == CWResourceTypes.SkeletalAni &&
        source.boneList != null &&
        source.boneList.length > 0
      ) {
        this.Background = new SkResRef(source, source.boneList[0].value, 0);
      }
    }
  }

  //#endregion

  //#region

  // @batch(ClassType.object)
  // public UpdateCount(SelectedItem = null, Linefeed = null, JumpInMode = null) {
  //   var error = 0.5;
  //   var vCellWidth = 0;
  //   var vCellHeight = 0;
  //   var _Linefeed;
  //   if (Linefeed == null) {
  //     _Linefeed = this.Linefeed;
  //   } else {
  //     _Linefeed = Linefeed;
  //   }

  //   if (_Linefeed <= 3) {
  //     error = 1;
  //   }

  //   var _JumpInMode = JumpInMode == null ? this.JumpInMode : JumpInMode;
  //   if (_JumpInMode == 2) return;
  //   switch (_JumpInMode) {
  //     case 0:
  //       vCellWidth = this.Width / _Linefeed - error;
  //       vCellHeight = vCellWidth - error;
  //       break;
  //     case 1:
  //       vCellHeight = this.Height / _Linefeed - error;
  //       vCellWidth = vCellHeight;
  //       break;
  //   }
  //   if (SelectedItem == null) {
  //     this.CellWidth = vCellWidth;
  //     this.CellHeight = vCellHeight;
  //   } else {
  //     SelectedItem.setValue('CellWidth', vCellWidth, ClassType.number);
  //     SelectedItem.setValue('CellHeight', vCellHeight, ClassType.number);
  //   }

  //   var w = this.Width / vCellWidth;
  //   var h = this.Height / vCellHeight;
  //   //console.log('------------------');
  //   //console.log('Linefeed-----------' + _Linefeed);
  //   var js = Number(w.toFixed(0)) * Number(h.toFixed(0));
  //   //console.log(js);
  //   var _MaxValueCount = new Array<number>();

  //   for (let index = 0; index < js; index++) {
  //     _MaxValueCount.push(index);
  //   }

  //   if (SelectedItem == null) {
  //     this.MaxValueCount = _MaxValueCount;
  //   } else {
  //     SelectedItem.setValue('MaxValueCount', _MaxValueCount, ClassType.object);
  //   }
  // }

  //#endregion

  public GetExtendedTriggerSettings() {
    var triggers = super.GetExtendedTriggerSettings();
    triggers.push(
      new InvokeTriggerSetting('ValueChanged', '值改变', ValueChangedTrigger),
    );
    return triggers;
  }
}
