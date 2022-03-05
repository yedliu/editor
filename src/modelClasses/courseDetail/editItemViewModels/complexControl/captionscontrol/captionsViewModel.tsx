import TextEditItem from '../../textEditItem';

import { CaptionsContentTemplate } from '@/components/cwDesignUI/elements/controlTemplates/captionsTemplate';
import { CaptionsPropPanelTemplate } from '@/components/cwDesignUI/elements/controlTemplates/captionsTemplate';
import { ClassType } from '@/modelClasses/courseDetail/courseDetailenum';
import RUHelper from '@/redoundo/redoUndoHelper';
import { batch } from '@/server/CacheEntityServer';
import { observable } from 'mobx';
import { classToClass, Exclude, Expose, Type } from '@/class-transformer';
import { ResourceRef } from '@/modelClasses/courseDetail/resRef/resourceRef';
import CWResource from '@/modelClasses/courseDetail/cwResource';
import ObjHelper from '@/utils/objHelper';
import ActionManager from '@/redoundo/actionManager';
import { InvokeTriggerSetting } from '@/modelClasses/courseDetail/triggers/invokeTriggerSetting';
import { ValueChangedTrigger } from '@/modelClasses/courseDetail/triggers/extendedTrigger';
import InvokeTriggerBase from '@/modelClasses/courseDetail/triggers/invokeTriggerBase';

export class CaptionsLine {
  @observable
  private _LineIndex: number;
  @Expose({ name: 'no' })
  public get lineIndex(): number {
    return this._LineIndex;
  }
  public set lineIndex(v: number) {
    this._LineIndex = v;
  }

  @observable
  private _start: number;
  @Expose()
  public get start(): number {
    return this._start;
  }
  public set start(v: number) {
    v =
      Math.round(Math.min(v, this.end || Number.POSITIVE_INFINITY) * 1000) /
      1000;
    this._start = v;
  }

  @observable
  private _end: number;
  public get end(): number {
    return this._end;
  }
  @Expose()
  public set end(v: number) {
    v = Math.round(Math.max(v, this.start || 0) * 1000) / 1000;
    this._end = v;
  }

  public get duration(): number {
    return this.end || 0 - this.start || 0;
  }

  @observable
  private _content: string;
  @Expose()
  public get content(): string {
    return this._content;
  }
  public set content(v: string) {
    this._content = v;
  }

  @observable
  private _words: CaptionsWord[] = [];
  @Expose()
  @Type(() => CaptionsWord)
  public get words(): CaptionsWord[] {
    return this._words;
  }
  public set words(v: CaptionsWord[]) {
    this._words = v;
  }
}

export class CaptionsData {
  @observable
  private _lines: CaptionsLine[] = [];
  @Expose()
  @Type(() => CaptionsLine)
  public get lines(): CaptionsLine[] {
    return this._lines;
  }
  public set lines(v: CaptionsLine[]) {
    this._lines = v;
  }
}

class CaptionsWord {
  private _WordIndex: string;
  @Expose({ name: 'no' })
  public get WordIndex(): string {
    return this._WordIndex;
  }
  public set WordIndex(v: string) {
    this._WordIndex = v;
  }

  private _start: number;
  @Expose()
  public get start(): number {
    return this._start;
  }
  public set start(v: number) {
    this._start = v;
  }

  private _end: number;
  @Expose()
  public get end(): number {
    return this._end;
  }
  public set end(v: number) {
    this._end = v;
  }

  private _content: string;
  @Expose()
  public get content(): string {
    return this._content;
  }
  public set content(v: string) {
    this._content = v;
  }
}

export default class CaptionsViewModel extends TextEditItem {
  constructor() {
    super();
    this.FtSize = 28;
    this.Fonts = '汉仪粗圆简';
  }

  public get Template(): any {
    return CaptionsContentTemplate;
  }

  public get PropPanelTemplate(): any {
    return CaptionsPropPanelTemplate;
  }

  public get X(): number {
    return 256;
  }
  public set X(v: number) {
    super.X = v;
  }

  public get Width(): number {
    return this.Scene?.Courseware?.StageSize.x - 512 || 1024;
  }
  public set Width(v: number) {
    super.Width = v;
  }

  public get Y(): number {
    return (this.Scene?.Courseware?.StageSize.y || 1080) - this.Height + 1;
  }
  public set Y(v: number) {
    super.Y = v;
  }

  public get Height(): number {
    return 158;
  }
  public set Height(v: number) {
    super.Height = v;
  }

  @observable
  private _RowSpace: number;
  @batch(ClassType.number)
  @Expose()
  public get RowSpace(): number {
    return this._RowSpace;
  }
  public set RowSpace(v: number) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'RowSpace',
      () => (this._RowSpace = v),
      v,
      this._RowSpace,
    );
  }

  @observable
  private _MarginLeft: number = 14;
  @batch(ClassType.number)
  @Expose()
  public get MarginLeft(): number {
    return this._MarginLeft;
  }
  public set MarginLeft(v: number) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'MarginLeft',
      () => (this._MarginLeft = v),
      v,
      this._MarginLeft,
    );
  }

  @observable
  private _MarginRight: number = 14;
  @batch(ClassType.number)
  @Expose()
  public get MarginRight(): number {
    return this._MarginRight;
  }
  public set MarginRight(v: number) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'MarginRight',
      () => (this._MarginRight = v),
      v,
      this._MarginRight,
    );
  }

  @observable
  private _MarginTop: number = 23;
  @batch(ClassType.number)
  @Expose()
  public get MarginTop(): number {
    return this._MarginTop;
  }
  public set MarginTop(v: number) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'MarginTop',
      () => (this._MarginTop = v),
      v,
      this._MarginTop,
    );
  }

  @observable
  private _MarginBottom: number = 23;
  @batch(ClassType.number)
  @Expose()
  public get MarginBottom(): number {
    return this._MarginBottom;
  }
  public set MarginBottom(v: number) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'MarginBottom',
      () => (this._MarginBottom = v),
      v,
      this._MarginBottom,
    );
  }

  @observable
  private _ReadColor: string = '#000033';
  @batch(ClassType.string)
  @Expose()
  public get ReadColor(): string {
    return this._ReadColor;
  }
  public set ReadColor(v: string) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'ReadColor',
      () => (this._ReadColor = v),
      v,
      this._ReadColor,
    );
  }

  // @observable
  // private _HeadIcon: ResourceRef;
  // @batch(ClassType.resource)
  // @Expose()
  // @Type(() => ResourceRef)
  // public get HeadIcon(): ResourceRef {
  //   return this._HeadIcon;
  // }
  // public set HeadIcon(v: ResourceRef) {
  //   RUHelper.TrySetPropRedoUndo(
  //     this,
  //     'HeadIcon',
  //     () => (this._HeadIcon = v),
  //     v,
  //     this._HeadIcon,
  //   );
  // }

  @observable
  private _Background: ResourceRef;
  @batch(ClassType.resource)
  @Expose()
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
  private _BgAudioVolume: number = 100;
  @batch(ClassType.number)
  @Expose()
  public get BgAudioVolume(): number {
    return this._BgAudioVolume;
  }
  public set BgAudioVolume(v: number) {
    v = Math.max(0, Math.min(100, v));
    RUHelper.TrySetPropRedoUndo(
      this,
      'BgAudioVolume',
      () => (this._BgAudioVolume = v),
      v,
      this._BgAudioVolume,
    );
  }

  @observable
  private _IsRestoreBgVolume: boolean = true;
  @batch(ClassType.bool)
  @Expose()
  public get IsRestoreBgVolume(): boolean {
    return this._IsRestoreBgVolume;
  }
  public set IsRestoreBgVolume(v: boolean) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'IsRestoreBgVolume',
      () => (this._IsRestoreBgVolume = v),
      v,
      this._IsRestoreBgVolume,
    );
  }

  @observable
  private _Mode: number;
  @batch(ClassType.number)
  @Expose() //Mode要在refs和Captions前面
  public get Mode(): number {
    return this._Mode;
  }
  public set Mode(v: number) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'Mode',
      () => {
        this._Mode = v;
        if (
          this.Scene != null &&
          this.Scene.Courseware != null &&
          !this.Scene.Courseware.isLoading
        ) {
          this.Captions = new CaptionsData();
          this.AudioRefs = [];
        }
      },
      v,
      this._Mode,
    );
  }

  @batch(ClassType.object)
  @Type(() => ResourceRef)
  public get AudioRef(): ResourceRef {
    if (this.AudioRefs == null || this.AudioRefs.length == 0) return null;
    return this.AudioRefs[0];
  }
  public set AudioRef(v: ResourceRef) {
    var oldRef = this.AudioRef;
    if (oldRef != v) {
      ActionManager.Instance.CreateTransaction();
      if (this.AudioRefs == null) this.AudioRefs = [];
      if (this.AudioRefs.length > 0) RUHelper.RemoveItemAt(this.AudioRefs, 0);
      RUHelper.AddItem(this.AudioRefs, v, 0);
      ActionManager.Instance.CommitTransaction();
    }
  }

  @observable
  private _AudioRefs: ResourceRef[] = [];
  @batch(ClassType.object)
  @Expose()
  @Type(() => ResourceRef)
  public get AudioRefs(): ResourceRef[] {
    return this._AudioRefs;
  }
  public set AudioRefs(v: ResourceRef[]) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'AudioRefs',
      () => (this._AudioRefs = v),
      v,
      this._AudioRefs,
    );
  }

  @observable
  private _Captions: CaptionsData;
  @batch(ClassType.object)
  @Expose()
  @Type(() => CaptionsData)
  public get Captions(): CaptionsData {
    return this._Captions;
  }
  public set Captions(v: CaptionsData) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'Captions',
      () => (this._Captions = v),
      v,
      this._Captions,
    );
  }

  @observable
  private _CurrntCaptionsIndex: number = 0;
  @batch(ClassType.number)
  public get CurrentCaptionsIndex(): number {
    return this._CurrntCaptionsIndex;
  }
  public set CurrentCaptionsIndex(v: number) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'CurrntCaptionsIndex',
      () => (this._CurrntCaptionsIndex = v),
      v,
      this._CurrntCaptionsIndex,
    );
  }

  @batch(ClassType.string)
  public get Text(): string {
    if (
      this.Captions != null &&
      this.Captions.lines != null &&
      this.CurrentCaptionsIndex >= 0 &&
      this.CurrentCaptionsIndex < this.Captions.lines.length
    )
      return this.Captions.lines[this.CurrentCaptionsIndex]?.content;
    return null;
  }
  public set Text(v: string) {
    if (
      this.Captions != null &&
      this.Captions.lines != null &&
      this.CurrentCaptionsIndex >= 0 &&
      this.CurrentCaptionsIndex < this.Captions.lines.length
    ) {
      var currentLine = this.Captions.lines[this.CurrentCaptionsIndex];
      var oldvalue = this.Text;
      if (oldvalue != v) {
        var oldCaptions = classToClass(this.Captions);
        currentLine.content = v;
        RUHelper.Core.CreateTransaction(
          `${this.Id}-Text-${this.CurrentCaptionsIndex}`,
        );
        RUHelper.TryRecordRedoUndo(this, 'Text', v, oldvalue, true);
        RUHelper.TryRecordRedoUndo(
          this,
          'Captions',
          this.Captions,
          oldCaptions,
          true,
        );
        RUHelper.Core.CommitTransaction();
      }
    }
  }

  @observable
  @batch(ClassType.bool)
  isShowCaptionsModal: boolean = false;

  public TextToImg(
    SelectedItem,
    TextControl,
    isline = false,
    Width = 0,
    Height = 0,
  ) {}

  //#region 音频操作
  @batch(ClassType.object)
  addNewAudio = () => {
    ActionManager.Instance.CreateTransaction();
    RUHelper.AddItem(this.AudioRefs, null);
    if (this.Captions == null) this.Captions = new CaptionsData();
    RUHelper.AddItem(this.Captions.lines, null);
    ActionManager.Instance.CommitTransaction();
  };

  @batch(ClassType.object)
  replaceAudio = (resRef: ResourceRef, index: number) => {
    if (this.AudioRefs.length > index && index >= 0) {
      var oldResRef = this.AudioRefs[index];
      if (oldResRef != resRef) {
        ActionManager.Instance.CreateTransaction();
        RUHelper.RemoveItemAt(this.AudioRefs, index);
        RUHelper.AddItem(this.AudioRefs, resRef, index);
        ActionManager.Instance.CommitTransaction();
      }
    }
  };

  @batch(ClassType.object)
  removeAudioCaptions = (index: number) => {
    if (
      this.AudioRefs.length > index &&
      this.Captions?.lines != null &&
      this.Captions.lines.length > index &&
      index >= 0
    ) {
      ActionManager.Instance.CreateTransaction();
      RUHelper.RemoveItemAt(this.AudioRefs, index);
      RUHelper.RemoveItemAt(this.Captions.lines, index);
      ActionManager.Instance.CommitTransaction();
    }
  };

  @batch(ClassType.object)
  viewAudioCaptions = (index: number) => {
    if (
      this.AudioRefs.length > index &&
      this.Captions?.lines != null &&
      this.Captions.lines.length > index &&
      index >= 0
    ) {
      this.CurrentCaptionsIndex = index;
    }
  };

  @batch(ClassType.object)
  moveAudioCaptions = (index: number, direction: string) => {
    var targetIndex = direction == 'up' ? index - 1 : index + 1;
    if (
      this.AudioRefs.length > index &&
      this.Captions?.lines != null &&
      this.Captions.lines.length > index &&
      index >= 0 &&
      targetIndex >= 0 &&
      this.AudioRefs.length > targetIndex &&
      this.Captions.lines.length > targetIndex
    ) {
      var resref = this.AudioRefs[index];
      var line = this.Captions.lines[index];
      ActionManager.Instance.CreateTransaction();
      RUHelper.RemoveItemAt(this.AudioRefs, index);
      RUHelper.RemoveItemAt(this.Captions.lines, index);

      RUHelper.AddItem(this.AudioRefs, resref, targetIndex);
      RUHelper.AddItem(this.Captions.lines, line, targetIndex);
      ActionManager.Instance.CommitTransaction();
    }
  };

  //#endregion

  public GetExtendedTriggerSettings() {
    var triggers = super.GetExtendedTriggerSettings();
    triggers.push(
      new InvokeTriggerSetting(
        'CurrentAudioStart',
        '当前段音频开始',
        ValueChangedTrigger,
      ),
    );
    triggers.push(
      new InvokeTriggerSetting(
        'CurrentAudioPause',
        '当前段音频暂停',
        ValueChangedTrigger,
      ),
    );
    triggers.push(
      new InvokeTriggerSetting(
        'CurrentAudioEnd',
        '当前段音频结束',
        ValueChangedTrigger,
      ),
    );
    triggers.push(
      new InvokeTriggerSetting(
        'WordStart',
        '开始读词（词号）',
        ValueChangedTrigger,
      ),
    );
    triggers.push(
      new InvokeTriggerSetting(
        'WordEnd',
        '结束读词（词号）',
        ValueChangedTrigger,
      ),
    );
    return triggers;
  }

  GetDependencyResources() {
    var res: CWResource[] = [];

    if (this.AudioRefs != null) {
      this.AudioRefs.forEach(x => {
        if (x?.Resource != null) res.push(x.Resource);
      });
    }
    if (this.Background != null && this.Background.Resource != null)
      res.push(this.Background.Resource);
    // if (this.HeadIcon != null && this.HeadIcon.Resource != null)
    //   res.push(this.HeadIcon.Resource);
    return res;
  }

  SetResourcesFromLib(reslib: CWResource[]) {
    if (!reslib) return;
    this.AudioRefs?.forEach(x => x?.SearchResource?.(reslib));
    //this.AudioRef?.SearchResource?.(reslib);
    this.Background?.SearchResource(reslib);
    // this.HeadIcon?.SearchResource(reslib);
  }
}
