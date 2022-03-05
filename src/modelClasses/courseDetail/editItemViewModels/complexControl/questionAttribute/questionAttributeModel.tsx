import CWElement from '@/modelClasses/courseDetail/cwElement';
import questionAttributeTemplate, {
  PropPanelTemplate as QuestionAttributeTemplatePropPanelTemplate,
} from '@/components/cwDesignUI/elements/controlTemplates/questionAttributeTemplate';
import MathHelper from '@/utils/MathHelper';
import { InvokeTriggerSetting } from '@/modelClasses/courseDetail/triggers/invokeTriggerSetting';
import { ValueChangedTrigger } from '@/modelClasses/courseDetail/triggers/extendedTrigger';
import { observable } from 'mobx';
import { Expose, Type } from '@/class-transformer';
import { batch } from '@/server/CacheEntityServer';
import { ResourceRef } from '@/modelClasses/courseDetail/resRef/resourceRef';
import { ClassType } from '@/modelClasses/courseDetail/courseDetailenum';
import RUHelper from '@/redoundo/redoUndoHelper';
import CWResource from '@/modelClasses/courseDetail/cwResource';

export default class QuestionAttribute extends CWElement {
  public get Template(): any {
    return questionAttributeTemplate;
  }

  public get PropPanelTemplate(): any {
    return QuestionAttributeTemplatePropPanelTemplate;
  }

  constructor() {
    super();
  }

  public GetExtendedTriggerSettings() {
    var triggers = super.GetExtendedTriggerSettings();
    triggers.push(
      new InvokeTriggerSetting('ValueChanged', '值改变', ValueChangedTrigger),
    );
    return triggers;
  }

  public get Width(): number {
    return super.Width;
  }

  public get Height(): number {
    return super.Height;
  }
  public set Width(v: number) {
    var val = MathHelper.round(v, 2);
    super.Width = val;
    if (this.Height != val && !this.IsOprating) this.Height = val;
  }

  public set Height(v: number) {
    var val = MathHelper.round(v, 2);
    super.Height = val;
    if (this.Width != val && !this.IsOprating) this.Width = val;
  }

  // 示范图片
  @observable
  private _QuestionExampleBg: ResourceRef;
  @Expose()
  @batch(ClassType.resource)
  @Type(() => ResourceRef)
  public get QuestionExampleBg(): ResourceRef {
    return this._QuestionExampleBg;
  }
  public set QuestionExampleBg(v: ResourceRef) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'QuestionExampleBg',
      () => (this._QuestionExampleBg = v),
      v,
      this._QuestionExampleBg,
    );
  }

  //#region  示范音频
  @observable
  private _QuestionExampleAudio: ResourceRef;
  @Expose()
  @batch(ClassType.resource)
  @Type(() => ResourceRef)
  public get QuestionExampleAudio(): ResourceRef {
    return this._QuestionExampleAudio;
  }
  public set QuestionExampleAudio(v: ResourceRef) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'QuestionExampleAudio',
      () => (this._QuestionExampleAudio = v),
      v,
      this._QuestionExampleAudio,
    );
  }

  //#region  示范视频
  @observable
  private _QuestionExampleVideo: ResourceRef;
  @Expose()
  @batch(ClassType.resource)
  @Type(() => ResourceRef)
  public get QuestionExampleVideo(): ResourceRef {
    return this._QuestionExampleVideo;
  }
  public set QuestionExampleVideo(v: ResourceRef) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'QuestionExampleVideo',
      () => (this._QuestionExampleVideo = v),
      v,
      this._QuestionExampleVideo,
    );
  }

  // 题目顺序
  @observable
  private _QuestionSequence: number;
  @Expose()
  @batch(ClassType.number)
  public get QuestionSequence(): number {
    return this._QuestionSequence || super.questionIndex;
  }
  public set QuestionSequence(v: number) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'QuestionSequence',
      () => (this._QuestionSequence = v),
      v,
      this._QuestionSequence,
    );
  }

  // 解析音频
  @observable
  private _QuestionParseAudio: ResourceRef;
  @Expose()
  @batch(ClassType.resource)
  @Type(() => ResourceRef)
  public get QuestionParseAudio(): ResourceRef {
    return this._QuestionParseAudio;
  }
  public set QuestionParseAudio(v: ResourceRef) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'QuestionParseAudio',
      () => (this._QuestionParseAudio = v),
      v,
      this._QuestionParseAudio,
    );
  }

  // 解析视频
  @observable
  private _QuestionParseVideo: ResourceRef;
  @Expose()
  @batch(ClassType.resource)
  @Type(() => ResourceRef)
  public get QuestionParseVideo(): ResourceRef {
    return this._QuestionParseVideo;
  }
  public set QuestionParseVideo(v: ResourceRef) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'QuestionParseVideo',
      () => (this._QuestionParseVideo = v),
      v,
      this._QuestionParseVideo,
    );
  }

  // 解析文案
  @observable
  private _QuestionParseText: string;
  @Expose()
  @batch(ClassType.string)
  public get QuestionParseText(): string {
    return this._QuestionParseText;
  }
  public set QuestionParseText(v: string) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'QuestionParseText',
      () => (this._QuestionParseText = v),
      v,
      this._QuestionParseText,
    );
  }

  public SetResourcesFromLib(reslib: CWResource[]) {
    if (!reslib) return;
    this.QuestionExampleBg?.SearchResource(reslib);
    this.QuestionExampleAudio?.SearchResource(reslib);
    this.QuestionParseAudio?.SearchResource(reslib);
    this.QuestionExampleVideo?.SearchResource(reslib);
    this.QuestionParseVideo?.SearchResource(reslib);
  }

  public GetDependencyResources(): CWResource[] {
    var res: CWResource[] = [];
    if (
      this.QuestionExampleBg != null &&
      this.QuestionExampleBg.Resource != null
    )
      res.push(this.QuestionExampleBg.Resource);
    if (
      this.QuestionExampleAudio != null &&
      this.QuestionExampleAudio.Resource != null
    )
      res.push(this.QuestionExampleAudio.Resource);
    if (
      this.QuestionParseAudio != null &&
      this.QuestionParseAudio.Resource != null
    )
      res.push(this.QuestionParseAudio.Resource);
    if (
      this.QuestionExampleVideo != null &&
      this.QuestionExampleVideo.Resource != null
    )
      res.push(this.QuestionExampleVideo.Resource);
    if (
      this.QuestionParseVideo != null &&
      this.QuestionParseVideo.Resource != null
    )
      res.push(this.QuestionParseVideo.Resource);
    return res;
  }
}
