import RectMazeBase from '../RectMazeBase';
import newVideoPlayerTemplate, {
  PropPanelTemplate as newVideoPlayerTemplatePropPanelTemplate,
} from '@/components/cwDesignUI/elements/controlTemplates/newVideoPlayerTemplate';
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
import IdHelper from '@/utils/idHelper';

export default class newVideoPlayerComplex extends CWElement {
  public get Template(): any {
    return newVideoPlayerTemplate;
  }

  public get PropPanelTemplate(): any {
    return newVideoPlayerTemplatePropPanelTemplate;
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
    exInfoObj = this.Scene?.Courseware?.Profile?.extendInfo;
    return exInfoObj?.stageWidth;
  }

  public get Height(): number {
    var exInfoObj: any = null;
    exInfoObj = this.Scene?.Courseware?.Profile?.extendInfo;
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
  @Type(() => VideoActionModel)
  public get TimerList(): Array<VideoActionModel> {
    return this._TimerList;
  }
  public set TimerList(v: Array<VideoActionModel>) {
    if (this.WEBUnits != null) {
      this.WEBUnits = v?.map(x => {
        var result = ObjHelper.ConvertObj(
          this.UnitVMType,
          x,
          TypeMapHelper.CommonTypeMap,
        );
        return result;
      });
    } else {
      this._TimerList = v;
    }
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
    var array = new Array<number>();
    for (let index = 0; index < this.TimerList.length; index++) {
      const element = this.TimerList[index];
      array.push(element.Serial);
    }
    var maxVal = Math.max(...array);
    unit.Serial = array.length <= 0 ? 0 : maxVal + 1;
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

  //校验
  public Validate(): string {
    //视频时长
    var videoDuration = this.VideoRes.Duration;
    let isValidData = true;
    if (this.TimerList) {
      let voideDuration = parseInt(videoDuration / 1000 + '');
      if (voideDuration > 0) {
        this.TimerList.forEach(item => {
          if (item.Delay <= 3 || item.Delay >= voideDuration - 3) {
            isValidData = false;
          }
        });
      }
    }
    if (!isValidData) {
      return '时间必须大于3秒并且小于视频总时长前3秒（例如：视频总时长100秒，总时长前3秒为97秒）';
    } else {
      return '';
    }
  }
}

export class VideoActionModel {
  constructor() {}

  @observable
  @Expose()
  Guid: string = IdHelper.NewId();

  @observable
  @Expose()
  Serial: number = 0; // 序号

  //触发时是否暂停播放
  @observable
  private _IsPause: boolean = false;
  @Expose()
  public get IsPause(): boolean {
    return this._IsPause;
  }
  public set IsPause(v: boolean) {
    this._IsPause = v;

    this.AstrictAnswerTime = false;
    this.IsAutoEnd = false;
  }

  @observable
  @Expose()
  IsHideClientClock: boolean = false; // 隐藏课堂原生倒计时

  @observable
  @Expose()
  AstrictAnswerTime: boolean = false; // 不限制答题时长

  @observable
  @Expose()
  IsHideAnswerFeedback: boolean = false; // 隐藏答题反馈

  @observable
  @Expose()
  IsAutoEnd: boolean = false; // 答对自动结束

  @observable
  @Expose()
  EndTimer: number = 0; //自动前进的时间

  @observable
  @Expose()
  Delay: number = 0;

  @observable
  @Expose()
  VideoTag: string = '';

  @observable
  @Expose()
  AnswerTimer: number = 0;

  @observable
  @Expose()
  TaskType: number = 0;

  @observable
  @Expose()
  QuestionWidget: string = '';

  //是否语音控制
  @observable
  @Expose()
  IsSpeechControl: boolean = false;

  //语音控制延迟
  @observable
  @Expose()
  SpeechControlDelay: number = 0;
}
