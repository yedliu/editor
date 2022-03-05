import CWElement from '../../../cwElement';
import CWResource from '../../../cwResource';
import { batch } from '@/server/CacheEntityServer';
import IPropUndoable from '@/redoundo/IPropUndoable';
import speechRecognitionUnitBaseViewModel from './speechRecognitionUnitBaseViewModel';
import ActionManager from '@/redoundo/actionManager';
import RUHelper from '@/redoundo/redoUndoHelper';
import { from, elementAtOrDefault } from 'linq-to-typescript';
import { array, string } from 'prop-types';
import { Expose, Type, plainToClass, classToPlain } from '@/class-transformer';
// import { observable } from 'mobx';
import speechRecognitionBaseViewModel from './speechRecognitionBaseViewModel';
import { observable, computed, reaction } from 'mobx';
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

import speechRecognitionTemplate, {
  PropPanelTemplate as speechRecognitionPropPanelTemplate,
} from '@/components/cwDesignUI/elements/controlTemplates/speechRecognitionTemplate';
import IdHelper from '@/utils/idHelper';
import cWRichTextModel from '../richTextControl/cWRichTextModel';
import { InvokeTriggerSetting } from '@/modelClasses/courseDetail/triggers/invokeTriggerSetting';
import { VoiceChangedTrigger } from '@/modelClasses/courseDetail/triggers/extendedTrigger';
import ObjHelper from '@/utils/objHelper';
import TypeMapHelper from '@/configs/typeMapHelper';
import { stores } from '@/pages';

export class AnswerBranchModel implements IPropUndoable {
  get CanRecordRedoUndo(): boolean {
    if (stores.courseware && !stores.courseware.isLoading) return true;
    return false;
  }

  constructor() {}

  @observable
  private _Id: string;
  @Expose()
  public get Id(): string {
    return this._Id;
  }
  public set Id(v: string) {
    this._Id = v;
  }

  @observable
  private _Text: string;
  @Expose()
  public get Text(): string {
    return this._Text;
  }
  public set Text(v: string) {
    this._Text = v;
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
}

export default class speechRecognitionControllerViewModel extends speechRecognitionBaseViewModel {
  protected UnitVMType: new (
    ...args: any[]
  ) => any = speechRecognitionUnitBaseViewModel;

  protected AnsVMType: new (...args: any[]) => any = AnswerBranchModel;

  public get Template(): any {
    return speechRecognitionTemplate;
  }

  public get PropPanelTemplate(): any {
    return speechRecognitionPropPanelTemplate;
  }

  constructor() {
    super();

    var _TextSource = new Array<any>();
    // _TextSource.push({ value: 0, label: '中文字词评测-汉字' });
    // _TextSource.push({ value: 1, label: '中文句子评测-汉字' });
    // _TextSource.push({ value: 2, label: '中文段落评测-汉字' });
    // _TextSource.push({ value: 3, label: '中文字词评测-拼音' });
    // _TextSource.push({ value: 4, label: '中文句子评测-拼音' });
    // _TextSource.push({ value: 5, label: '中文AI talk-汉字' });

    // 第三方默认值，后面其他识别模式放出后删除，用上面的
    _TextSource.push({ value: 0, label: '一个汉字' });
    _TextSource.push({ value: 1, label: '句子' });
    _TextSource.push({ value: 2, label: '段落' });
    _TextSource.push({ value: 3, label: '句子中含关键词' });
    _TextSource.push({ value: 4, label: '自由说' });
    _TextSource.push({ value: 6, label: '多答案分支' });
    this.TextTypeSource = _TextSource;

    this._Units = new Array<speechRecognitionUnitBaseViewModel>();
    var unit = new speechRecognitionUnitBaseViewModel();
    unit.Id = IdHelper.NewId();
    unit.X = 0;
    unit.Y = 0;
    unit.Width = 200;
    unit.Height = 150;
    unit.ModelType = 'TextTemplate';
    unit.Father = this;
    unit.IsSelected = false;
    this._Units.push(unit);
  }

  // 获取课件类型
  public get CourseType(): string {
    const { courseware } = stores;
    const { Profile } = courseware;
    return Profile?.purposeVo.code;
  }

  // 添加语音消息触发器
  public GetExtendedTriggerSettings() {
    const { courseware } = stores;
    const { Profile } = courseware;
    var triggers = super.GetExtendedTriggerSettings();
    // 只有语音场景课件才有语音消息触发器
    if (
      Profile &&
      Profile.purposeVo.code &&
      (Profile.purposeVo.code == 'MULTI_BRANCH' ||
        Profile.purposeVo.code == 'VIDEO_AI')
    ) {
      triggers.push(
        new InvokeTriggerSetting(
          'VoiceChanged',
          '语音消息触发',
          VoiceChangedTrigger,
        ),
      );
    }
    return triggers;
  }

  public ANSUnits: Array<AnswerBranchModel>;

  // 多答案分支数据存储
  @observable
  private _AnswerBranchList: Array<AnswerBranchModel> = new Array<
    AnswerBranchModel
  >();

  @Expose()
  @batch(ClassType.object)
  public get AnswerBranchList(): Array<AnswerBranchModel> {
    //  if (this._AnswerBranchList == null) {
    //    this._AnswerBranchList = new Array<AnswerBranchModel>()
    //    let Answer = new AnswerBranchModel();
    //    Answer.Id = IdHelper.NewId();
    //    Answer.Text = '';
    //    this._AnswerBranchList.push(Answer)
    //    return this._AnswerBranchList;
    //  }
    return this._AnswerBranchList;
  }
  public set AnswerBranchList(v: Array<AnswerBranchModel>) {
    //  this._AnswerBranchList = v;
    this.ANSUnits = v.map(x => {
      var result = ObjHelper.ConvertObj(
        this.AnsVMType,
        x,
        TypeMapHelper.CommonTypeMap,
      );
      return result;
    });
  }

  // protected AnswerChanged = reaction(
  //   () => this.TextIndex,
  //   text => {
  //     if (text != 6)
  //     this._AnswerBranchList = []
  //   },
  // );

  @observable
  private _IsPlayStudentVideo: Boolean = true;
  //是否播放学生音频
  @batch(ClassType.bool)
  @Expose()
  public get IsPlayStudentVideo(): Boolean {
    return this._IsPlayStudentVideo;
  }
  public set IsPlayStudentVideo(v: Boolean) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'IsPlayStudentVideo',
      () => (this._IsPlayStudentVideo = v),
      v,
      this._IsPlayStudentVideo,
    );
  }

  @observable
  private _IdentifyTheParties: number = 2; // 0 掌门识别, 1 驰声识别, 2 第三方识别(目前先禁用0，1)
  //识别方
  @batch(ClassType.number)
  @Expose()
  public get IdentifyTheParties(): number {
    return this._IdentifyTheParties;
  }
  public set IdentifyTheParties(v: number) {
    this._IdentifyTheParties = v;
    //this.LanguageMode = 0;
  }

  @observable
  private _LanguageMode: number = 0;
  //语言 0 = 中文 ，1 = 英文
  @batch(ClassType.number)
  @Expose()
  public get LanguageMode(): number {
    return this._LanguageMode;
  }
  public set LanguageMode(v: number) {
    this._LanguageMode = v;
  }

  @observable
  private _TextType: number = 0;
  //二级语言分类
  @batch(ClassType.number)
  @Expose()
  public get TextType(): number {
    return this._TextType;
  }
  public set TextType(v: number) {
    this._TextType = v;
  }

  @observable
  private _TextIndex: number = 0;

  @batch(ClassType.number)
  @Expose()
  public get TextIndex(): number {
    var ti = this._TextIndex;
    if (this.LanguageMode == 1 && this.IdentifyTheParties != 2) {
      if (ti >= 1) {
        ti += 1;
      }
    }
    return ti;
  }

  @batch(ClassType.number)
  public get WebTextIndex(): number {
    return this._TextIndex;
  }

  public set TextIndex(v: number) {
    this.ShowKeywords = false;

    this._TextIndex = v;

    if (this.IdentifyTheParties == 0 || this.IdentifyTheParties == 1) {
      if (v == 5) this.ShowKeywords = true;
    } else {
      if (this.LanguageMode == 0 && this.TextType == 0 && v == 3) {
        this.ShowKeywords = true;
      }
    }
  }
  //#region  TextTypeCode导出逻辑
  // @observable
  private _TextTypeCode: string;
  // @batch(ClassType.string)
  @Expose()
  public get TextTypeCode(): string {
    var _Code = '';
    if (this.IdentifyTheParties == 0 || this.IdentifyTheParties == 1) {
      switch (this.LanguageMode) {
        case 0:
          switch (this.WebTextIndex) {
            case 0:
              _Code = 'cn.word.raw';
              break;
            case 1:
              _Code = 'cn.sent.raw';
              break;
            case 2:
              _Code = 'cn.pred.raw';
              break;
            case 3:
              _Code = 'cn.word.score';
              break;
            case 4:
              _Code = 'cn.sent.score';
              break;
            case 5:
              _Code = 'cn.recscore.raw';
              break;
          }
          break;
        case 1:
          switch (this.TextIndex) {
            case 0:
              _Code = 'en.word.score';
              break;
            case 1:
              _Code = 'en.word.pron';
              break;
            case 2:
              _Code = 'en.sent.score';
              break;
            case 3:
              _Code = 'en.pred.exam';
              break;
          }
          break;
      }
    } else
      _Code =
        this.IdentifyTheParties +
        '' +
        this.LanguageMode +
        '' +
        this.TextType +
        '' +
        this.TextIndex;

    return _Code;
  }
  public set TextTypeCode(v: string) {
    this._TextTypeCode = v;
  }

  //#endregion
  @observable
  private _SaveText: string = '';

  @batch(ClassType.string)
  public get SaveText(): string {
    return this._SaveText;
  }
  public set SaveText(v: string) {
    this._SaveText = v;
  }

  @observable
  private _TextContent: string;
  @batch(ClassType.string)
  @Expose()
  public get TextContent(): string {
    let subText: any = [];
    if (this.TextIndex === 6) {
      this.AnswerBranchList.map(item => {
        if (item.Text) {
          subText.push(item.Text);
        }
      });
      return subText.join('|');
    }

    return this._TextContent;
  }
  public set TextContent(v: string) {
    this._TextContent = v;
  }

  @observable
  private _Keywords: string;
  @batch(ClassType.string)
  @Expose()
  public get Keywords(): string {
    return this._Keywords;
  }
  public set Keywords(v: string) {
    this._Keywords = v;
  }

  @observable
  private _AnswerTime: number = 2;
  @batch(ClassType.string)
  @Expose()
  public get AnswerTime(): number {
    return this._AnswerTime;
  }
  public set AnswerTime(v: number) {
    this._AnswerTime = v;
  }

  @observable
  private _AnswerAnimationTime: number = 0;
  @batch(ClassType.number)
  @Expose()
  public get AnswerAnimationTime(): number {
    return this._AnswerAnimationTime;
  }
  public set AnswerAnimationTime(v: number) {
    this._AnswerAnimationTime = v;
  }

  // @observable
  // private _IsAutoPlay: Boolean;
  // @batch(ClassType.bool)
  // @Expose()
  // public get IsAutoPlay(): Boolean {
  //   return this._IsAutoPlay;
  // }
  // public set IsAutoPlay(v: Boolean) {
  //   this._IsAutoPlay = v;
  // }
  @observable
  private _IsSendVoiceEvent: Boolean;
  @batch(ClassType.bool)
  @Expose()
  public get IsSendVoiceEvent(): Boolean {
    return this._IsSendVoiceEvent;
  }
  public set IsSendVoiceEvent(v: Boolean) {
    this._IsSendVoiceEvent = v;
  }

  @observable
  private _ShowKeywords: Boolean;
  @batch(ClassType.bool)
  // @Expose()
  public get ShowKeywords(): Boolean {
    return this._ShowKeywords;
  }
  public set ShowKeywords(v: Boolean) {
    this._ShowKeywords = v;
  }

  //显示授权
  @observable
  private _ShowAuthorize: Boolean;
  @batch(ClassType.bool)
  // @Expose()
  public get ShowAuthorize(): Boolean {
    return this._ShowAuthorize;
  }
  public set ShowAuthorize(value: Boolean) {
    var AuthorizeUnit = this.AllUnits.filter(x => x.ModelType == 'Authorize');
    if (value && AuthorizeUnit.length <= 0) {
      var unit = new speechRecognitionUnitBaseViewModel();
      unit.Id = IdHelper.NewId();
      unit.X = this.Width / 2 - this.Height / 3 / 2;
      unit.Y = this.Height / 2 - this.Height / 3 / 2;
      unit.Width = this.Height / 3;
      unit.Height = this.Height / 3;
      unit.ModelType = 'Authorize';
      unit.Father = this;
      unit.IsSelected = false;
      //RUHelper.AddItem(this.Units, unit);
      this.AllUnits.push(unit);
    }

    if (!value && AuthorizeUnit.length > 0) {
      //RUHelper.RemoveItem(this.Units, unit);
      var index = this.AllUnits.indexOf(AuthorizeUnit[0]);
      if (index > -1) this.AllUnits.splice(index, 1);
    }

    this._ShowAuthorize = value;
  }

  //显示播放按钮
  @observable
  private _ShowPaly: Boolean;
  @batch(ClassType.bool)
  // @Expose()
  public get ShowPaly(): Boolean {
    return this._ShowPaly;
  }
  public set ShowPaly(value: Boolean) {
    var UnitTemplate = this.AllUnits.filter(x => x.ModelType == 'PalyTemplate');
    if (value && UnitTemplate.length <= 0) {
      var unit = new speechRecognitionUnitBaseViewModel();
      unit.Id = IdHelper.NewId();
      unit.X = this.Width / 2 - this.Height / 3 / 2;
      unit.Y = this.Height / 2 - this.Height / 3 / 2;
      unit.Width = this.Height / 3;
      unit.Height = this.Height / 3;
      unit.ModelType = 'PalyTemplate';
      unit.Father = this;
      unit.IsSelected = false;
      this.AllUnits.push(unit);
    }
    if (!value && UnitTemplate.length > 0) {
      var index = this.AllUnits.indexOf(UnitTemplate[0]);
      if (index > -1) this.AllUnits.splice(index, 1);
    }
    this._ShowPaly = value;
  }

  //#region 下拉框选择数据源

  //文本类型数据源
  @observable
  private _TextTypeSource: any[];
  @batch(ClassType.object)
  //@Expose()
  public get TextTypeSource(): any[] {
    return this._TextTypeSource;
  }
  public set TextTypeSource(v: any[]) {
    if (this.CourseType == 'MULTI_BRANCH' || this.CourseType == 'VIDEO_AI') {
      this._TextTypeSource = v;
    } else {
      let sourceList: any[] = v.filter(item => item.value != 6); // 非语音课件和视频课件过滤掉多答案分支
      this._TextTypeSource = sourceList;
    }
  }

  //语言模式数据源
  @observable
  private _languageModelSource: any[] = [
    { value: 0, label: '普通' },
    { value: 1, label: '汉语拼音' },
  ]; // 只有第三方语言时需添加默认值，后面其他的放出来后这个默认值要去掉
  @batch(ClassType.object)
  //@Expose()
  public get languageModelSource(): any[] {
    return this._languageModelSource;
  }
  public set languageModelSource(v: any[]) {
    this._languageModelSource = v;
  }

  //#endregion

  //#region 属性连动
  @batch(ClassType.object)
  public UpdateLanguageSource(value, SelectedItem, IdentifyTheParties) {
    var _TextSource = new Array<any>();
    var _IdentifyTheParties =
      IdentifyTheParties == null ? this.IdentifyTheParties : IdentifyTheParties;
    if (_IdentifyTheParties == 0 || _IdentifyTheParties == 1) {
      switch (value) {
        case 0:
          _TextSource.push({ value: 0, label: '中文字词评测-汉字' });
          _TextSource.push({ value: 1, label: '中文句子评测-汉字' });
          _TextSource.push({ value: 2, label: '中文段落评测-汉字' });
          _TextSource.push({ value: 3, label: '中文字词评测-拼音' });
          _TextSource.push({ value: 4, label: '中文句子评测-拼音' });
          _TextSource.push({ value: 5, label: '中文AI talk-汉字' });
          break;
        case 1:
          _TextSource.push({ value: 0, label: '英文单词' });
          //this.TextTypeSource.push({value:1,label:'英文单词纠音评测' });
          _TextSource.push({ value: 1, label: '英文句子' });
          _TextSource.push({ value: 2, label: '段落朗读' });
          break;
      }
      if (SelectedItem == null) {
        this.TextTypeSource = _TextSource;
      } else {
        SelectedItem.setValue('TextTypeSource', _TextSource);
      }
    } else {
      switch (value) {
        case 0: //中文
          _TextSource.push({ value: 0, label: '普通' });
          _TextSource.push({ value: 1, label: '汉语拼音' });
          break;
        case 1: //英文
          _TextSource.push({ value: 0, label: '普通' });
          break;
      }
      if (SelectedItem == null) {
        this.languageModelSource = _TextSource;
      } else {
        SelectedItem.setValue('languageModelSource', _TextSource);
      }
      //this.TextType = 0;
    }

    //this.TextIndex = 0;
  }

  @batch(ClassType.object)
  public UpdateTextType(value, SelectedItem, LanguageMode, IdentifyTheParties) {
    if (
      (IdentifyTheParties == null
        ? this.IdentifyTheParties
        : IdentifyTheParties) > 1
    ) {
      var _TextSource = new Array<any>();
      //第三方
      switch (LanguageMode == null ? this.LanguageMode : LanguageMode) {
        case 0: //中文
          switch (value) {
            case 0: //中文-普通模式
              _TextSource.push({ value: 0, label: '一个汉字' });
              _TextSource.push({ value: 1, label: '句子' });
              _TextSource.push({ value: 2, label: '段落' });
              _TextSource.push({ value: 3, label: '句子中含关键词' });
              _TextSource.push({ value: 4, label: '自由说' });
              _TextSource.push({ value: 6, label: '多答案分支' });
              break;
            case 1: //中文-拼音模式
              _TextSource.push({ value: 0, label: '字词' });
              _TextSource.push({ value: 1, label: '句子' });
              break;
          }
          break;
        case 1: //英文
          _TextSource.push({ value: 0, label: '1个单词' });
          _TextSource.push({ value: 1, label: '句子' });
          _TextSource.push({ value: 2, label: '段落' });
          _TextSource.push({ value: 6, label: '多答案分支' });
          break;
      }
      if (SelectedItem == null) {
        this.TextTypeSource = _TextSource;
      } else {
        SelectedItem.setValue('TextTypeSource', _TextSource);
      }
    }
    //this.TextIndex = 0;
  }

  //#endregion

  public SetResourcesFromLib(reslib: CWResource[]) {
    this.InitUnits(reslib);
    if (!reslib) return;
    super.SetResourcesFromLib(reslib);
    this.InitUnitsResources(reslib);
  }

  public InitUnits(reslib) {
    if (this.ANSUnits != null) {
      this._AnswerBranchList = null;
      this._AnswerBranchList = Array<AnswerBranchModel>();
      for (let i = 0; i < this.ANSUnits.length; i++) {
        this._AnswerBranchList.push(this.ANSUnits[i]);
      }
      this.ANSUnits = null;
    }
  }

  public InitUnitsResources(reslib) {
    if (this.WEBUnits != null) {
      this._Units = null;
      this._Units = new Array<speechRecognitionUnitBaseViewModel>();
      for (let i = 0; i < this.WEBUnits.length; i++) {
        this.WEBUnits[i].SeachRes(reslib);
        this.WEBUnits[i].Father = this;
        this._Units.push(this.WEBUnits[i]);
      }

      //查看是否显示授权播放按钮
      var Authorize = this.AllUnits.filter(x => x.ModelType == 'Authorize');
      if (
        Authorize != null &&
        Authorize.length >= 1 &&
        Authorize[0].NormalRes != null
      )
        //没有授权按钮
        this.ShowAuthorize = true;
      else this.ShowAuthorize = false;

      var PalyTemplate = this.AllUnits.filter(
        x => x.ModelType == 'PalyTemplate',
      );
      if (
        PalyTemplate != null &&
        PalyTemplate.length >= 1 &&
        PalyTemplate[0].NormalRes != null
      )
        //没有播放按钮
        this.ShowPaly = true;
      else this.ShowPaly = false;

      this.WEBUnits = null;

      //处理值--------------------------------------------------------------------
      var ti = this.WebTextIndex;
      if (this.LanguageMode == 1 && this.IdentifyTheParties != 2) {
        if (ti == 1) ti = 0;

        if (ti >= 1) ti -= 1;
      }
      this.TextIndex = ti;
      this.UpdateLanguageSource(this.LanguageMode, null, null);
      this.UpdateTextType(this.TextType, null, null, null);
      //处理值--------------------------------------------------------------------
    }
  }
}
