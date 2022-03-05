import CWElement from '../../../cwElement';
import CWResource from '../../../cwResource';
import { batch } from '@/server/CacheEntityServer';
import IPropUndoable from '@/redoundo/IPropUndoable';
import speechRecognitionUnitBaseViewModel from './speechRecognitionUnitBaseViewModel';
import ActionManager from '@/redoundo/actionManager';
import RUHelper from '@/redoundo/redoUndoHelper';
import { from, elementAtOrDefault } from 'linq-to-typescript';
import { array } from 'prop-types';
import { Expose, Type, plainToClass, classToPlain } from '@/class-transformer';
// import { observable } from 'mobx';

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
import InvokeTriggerBase from '../../../triggers/invokeTriggerBase';
import RichTextEditItemViewModel from '../richTextControl/richTextEditItemViewModel';
import Base from 'antd/lib/typography/Base';
import IdHelper from '@/utils/idHelper';
import cWRichTextModel from '../richTextControl/cWRichTextModel';
import ObjHelper from '@/utils/objHelper';
import TypeMapHelper from '@/configs/typeMapHelper';

export default class speechRecognitionBaseViewModel extends RichTextEditItemViewModel {
  protected UnitVMType: new (
    ...args: any[]
  ) => any = speechRecognitionUnitBaseViewModel;

  constructor() {
    super();
  }

  @observable
  private _ModeSelection: number = 0;
  //模式 0 = 文字 ，1 = 图片 ,2 = 混合
  @batch(ClassType.number)
  @Expose()
  public get ModeSelection(): number {
    return this._ModeSelection;
  }
  public set ModeSelection(value: number) {
    if ((value == 0 || value == 2) && this.AllUnits != null) {
      if (this.AllUnits.filter(x => x.ModelType == 'TextTemplate').length < 1) {
        this.RichTextInfo = new Array<cWRichTextModel>();
        this.AddText();
        //RUHelper.AddItem(this.AllUnits, unit);
      }
    }
    this.UnselectAll();

    this._ModeSelection = value;
  }
  public AddText() {
    var unit = new speechRecognitionUnitBaseViewModel();
    unit.Id = IdHelper.NewId();
    unit.X = 0;
    unit.Y = 0;
    unit.Width = 200;
    unit.Height = 150;
    unit.ModelType = 'TextTemplate';
    unit.Father = this;
    unit.IsSelected = false;
    this.AllUnits.push(unit);
  }

  public WEBUnits: Array<speechRecognitionUnitBaseViewModel>;

  @observable
  public _Units: Array<speechRecognitionUnitBaseViewModel>; // =new Array<speechRecognitionUnitBaseViewModel>()

  //@batch(ClassType.object)
  @Expose()
  public get Units(): Array<speechRecognitionUnitBaseViewModel> {
    if (this._Units == null) {
      return this._Units;
    } else {
      var unit = this._Units.filter(
        x => x.NormalRes != null || x.ModelType == 'TextTemplate',
      );

      //ModeSelection 0文字 1图片 2混合
      if (this.ModeSelection != 2) {
        if (this.ModeSelection == 0) {
          unit = unit.filter(x => x.ModelType != 'TopicTemplate');
        } else {
          unit = unit.filter(x => x.ModelType != 'TextTemplate');
        }
      }
      return unit;
    }
  }

  @batch(ClassType.object)
  //@Expose()
  public get AllUnits(): Array<speechRecognitionUnitBaseViewModel> {
    return this._Units;
  }

  public set Units(v: Array<speechRecognitionUnitBaseViewModel>) {
    this.WEBUnits = v.map(x => {
      var result = ObjHelper.ConvertObj(
        this.UnitVMType,
        x,
        TypeMapHelper.CommonTypeMap,
      );
      return result;
    });
  }

  @observable
  private _SelectedUnits: Array<speechRecognitionUnitBaseViewModel>;
  @batch(ClassType.object)
  public get SelectedUnits(): Array<speechRecognitionUnitBaseViewModel> {
    if (!this._SelectedUnits)
      this._SelectedUnits = new Array<speechRecognitionUnitBaseViewModel>();
    return this._SelectedUnits;
  }
  public set SelectedUnits(v: Array<speechRecognitionUnitBaseViewModel>) {
    this._SelectedUnits = v;
  }

  @observable
  private _BackgroundNormalRes: ResourceRef;
  @Expose()
  @batch(ClassType.resource)
  @Type(() => ResourceRef)
  public get BackgroundNormalRes(): ResourceRef {
    return this._BackgroundNormalRes;
  }
  public set BackgroundNormalRes(v: ResourceRef) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'BackgroundNormalRes',
      () => (this._BackgroundNormalRes = v),
      v,
      this._BackgroundNormalRes,
    );
  }

  @observable
  private _VoiceText: ResourceRef;
  @Expose()
  @batch(ClassType.resource)
  @Type(() => ResourceRef)
  public get VoiceText(): ResourceRef {
    return this._VoiceText;
  }
  public set VoiceText(v: ResourceRef) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'VoiceText',
      () => (this._VoiceText = v),
      v,
      this._VoiceText,
    );
  }

  //@batch(ClassType.object)
  public UnselectAll() {
    if (this._SelectedUnits) {
      do {
        if (this._SelectedUnits?.length < 1) break;
        this._SelectedUnits[0].IsSelected = false;
      } while (true);
    }
  }

  public HideUniqueToolbar() {
    super.HideUniqueToolbar();
    this.UnselectAll();
  }

  public ShowUniqueToolbar(itemView: HTMLElement) {
    super.ShowUniqueToolbar(itemView);
  }

  public SetResourcesFromLib(reslib: CWResource[]) {
    if (!reslib) return;
    super.SetResourcesFromLib(reslib);
    this.BackgroundNormalRes?.SearchResource(reslib);
    this.VoiceText?.SearchResource(reslib);
  }

  public GetDependencyResources(): CWResource[] {
    var res = super.GetDependencyResources();
    if (
      this.BackgroundNormalRes != null &&
      this.BackgroundNormalRes.Resource != null
    )
      res.push(this.BackgroundNormalRes.Resource);
    if (this.VoiceText != null && this.VoiceText.Resource != null)
      res.push(this.VoiceText.Resource);

    if (this.AllUnits != null && this.AllUnits.length > 0)
      this.AllUnits.forEach(unit => {
        res.push(...unit.GetDependencyResources());
      });
    return res;
  }

  public AttachResource(source: CWResource) {
    if (source != null) {
      if (source.resourceType == CWResourceTypes.Image) {
        this.BackgroundNormalRes = new ResourceRef(source);
      } else if (
        source.resourceType == CWResourceTypes.SkeletalAni &&
        source.boneList != null &&
        source.boneList.length > 0
      ) {
        this.BackgroundNormalRes = new SkResRef(
          source,
          source.boneList[0].value,
          0,
        );
      }
    }
  }
}
