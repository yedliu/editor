import RectMazeBase from '../RectMazeBase';
import videoPlayerTemplate, {
  PropPanelTemplate as videoPlayerTemplatePropPanelTemplate,
} from '@/components/cwDesignUI/elements/controlTemplates/videoPlayerTemplate';
import CWResource from '@/modelClasses/courseDetail/cwResource';
import { observable } from 'mobx';
import { Expose, Type } from '@/class-transformer';
import { ResourceRef } from '@/modelClasses/courseDetail/resRef/resourceRef';
import { batch } from '@/server/CacheEntityServer';
import RUHelper from '@/redoundo/redoUndoHelper';
import { ClassType } from '@/modelClasses/courseDetail/courseDetailenum';
import ObjHelper from '@/utils/objHelper';
import TypeMapHelper from '@/configs/typeMapHelper';
import CWElement from '@/modelClasses/courseDetail/cwElement';
import MathHelper from '@/utils/MathHelper';
import { InvokeTriggerSetting } from '@/modelClasses/courseDetail/triggers/invokeTriggerSetting';
import { ValueChangedTrigger } from '@/modelClasses/courseDetail/triggers/extendedTrigger';

export default class tetrisComplex extends CWElement {
  public get Template(): any {
    return videoPlayerTemplate;
  }

  public get PropPanelTemplate(): any {
    return videoPlayerTemplatePropPanelTemplate;
  }

  constructor() {
    super();
  }

  protected UnitVMType: new (...args: any[]) => any = VideoActionModel;

  public GetExtendedTriggerSettings() {
    var triggers = super.GetExtendedTriggerSettings();
    triggers.push(
      new InvokeTriggerSetting('ValueChanged', '值改变', ValueChangedTrigger),
    );
    return triggers;
  }

  public get Width(): number {
    var exInfoObj: any = null;
    exInfoObj = this.Scene?.Courseware.Profile.extendInfo;
    return exInfoObj?.stageWidth;
  }

  public get Height(): number {
    var exInfoObj: any = null;
    exInfoObj = this.Scene?.Courseware.Profile.extendInfo;
    return exInfoObj?.stageHeight;
  }

  public set Width(v: number) {
    super.Width = v;
  }

  public set Height(v: number) {
    super.Height = v;
  }

  public get X(): number {
    return 0;
  }

  public get Y(): number {
    return 0;
  }

  public set X(v: number) {
    super.X = v;
  }

  public set Y(v: number) {
    super.Y = v;
  }

  @observable
  private _media: HTMLVideoElement;
  @batch(ClassType.object)
  public get media(): HTMLVideoElement {
    return this._media;
  }
  public set media(v: HTMLVideoElement) {
    this._media = v;
  }

  @batch()
  public get thisData(): object {
    return this;
  }

  public WEBUnits: Array<VideoActionModel>;
  @observable
  private _TimerList: Array<VideoActionModel> = new Array<VideoActionModel>();
  @Expose()
  @batch(ClassType.object)
  public get TimerList(): Array<VideoActionModel> {
    return this._TimerList;
  }
  public set TimerList(v: Array<VideoActionModel>) {
    // this._TimerList = v;
    this.WEBUnits = v?.map(x => {
      var result = ObjHelper.ConvertObj(
        this.UnitVMType,
        x,
        TypeMapHelper.CommonTypeMap,
      );
      return result;
    });
  }

  @observable
  private _VideoRes: ResourceRef;
  @Expose()
  @batch(ClassType.resource)
  @Type(() => ResourceRef)
  public get VideoRes(): ResourceRef {
    return this._VideoRes;
  }
  public set VideoRes(v: ResourceRef) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'VideoRes',
      () => {
        this._VideoRes = v;
        this.media?.load();
      },
      v,
      this._VideoRes,
    );
  }

  SetResourcesFromLib(reslib: CWResource[]) {
    this.InitUnits(reslib);

    if (!reslib) return;
    super.SetResourcesFromLib(reslib);
    this.VideoRes?.SearchResource(reslib);
  }

  public InitUnits(reslib) {
    if (this.WEBUnits != null) {
      this._TimerList = null;
      this._TimerList = Array<VideoActionModel>();
      for (let i = 0; i < this.WEBUnits.length; i++) {
        this._TimerList.push(this.WEBUnits[i]);
      }
      this.WEBUnits = null;
    }
  }

  public GetDependencyResources(): CWResource[] {
    var res = super.GetDependencyResources();
    if (this.VideoRes != null && this.VideoRes.Resource != null)
      res.push(this.VideoRes.Resource);
    return res;
  }

  @batch(ClassType.object)
  public AddItemCommand() {
    var unit = new VideoActionModel();
    unit.Delay = MathHelper.round(this.media?.currentTime, 2);
    RUHelper.AddItem(this.TimerList, unit);
  }

  @batch(ClassType.object)
  public Sort(SelectedItem) {
    var obj = this.TimerList.sort((n1, n2) => {
      if (n1.Delay < n2.Delay) {
        return 1;
      }

      if (n1.Delay > n2.Delay) {
        return -1;
      }
      return 0;
    });
    //SelectedItem.setValue('TimerList', obj, ClassType.object)
    obj.forEach(x => {
      RUHelper.RemoveItem(this.TimerList, x);
    });

    obj.forEach(x => {
      RUHelper.AddItem(this.TimerList, x);
    });
  }

  @batch(ClassType.object)
  public DeleteItemCommand(unit) {
    RUHelper.RemoveItem(this.TimerList, unit);
  }
}

export class VideoActionModel {
  constructor() {}

  @observable
  @batch(ClassType.number)
  @Expose()
  Delay: number = 0;

  @observable
  @batch(ClassType.string)
  @Expose()
  VideoTag: string = '';

  @observable
  @batch(ClassType.number)
  @Expose()
  AnswerTimer: number = 0;

  @observable
  @batch(ClassType.number)
  @Expose()
  TaskType: number = 0;
}
