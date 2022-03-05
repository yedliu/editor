import InvokeTriggerBase from './invokeTriggerBase';
import { observable, computed } from 'mobx';
import { observer } from 'mobx-react';
import React, { PureComponent } from 'react';
import { Expose, Type } from '@/class-transformer';
import RUHelper from '@/redoundo/redoUndoHelper';
import { InputInvokeTriggerTemplate } from '@/components/cwDesignUI/logicView/triggerSettingTemplates/generalTriggerSettingTemplates';
import { InvHandler, InvokerType } from '../InvokeDesign/InvokeHandlerMeta';
import { Select, Input } from 'antd';
import speechRecognitionControllerViewModel, {
  AnswerBranchModel,
} from '@/modelClasses/courseDetail/editItemViewModels/complexControl/speechRecognitionControl/speechRecognitionControllerViewModel';
import IPropUndoable from '@/redoundo/IPropUndoable';
import { stores } from '@/pages';
export class InputInvokeTrigger extends InvokeTriggerBase {
  constructor() {
    super();
    this.SettingTemplate = InputInvokeTriggerTemplate;
  }

  @observable
  private _ErrorTimer: number;
  @Expose()
  public get ErrorTimer(): number {
    return this._ErrorTimer;
  }
  public set ErrorTimer(v: number) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'ErrorTimer',
      () => (this._ErrorTimer = v),
      v,
      this._ErrorTimer,
    );
  }

  @observable
  private _IsErrorClear: boolean;
  @Expose()
  public get IsErrorClear(): boolean {
    return this._IsErrorClear;
  }
  public set IsErrorClear(v: boolean) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'IsErrorClear',
      () => (this._IsErrorClear = v),
      v,
      this._IsErrorClear,
    );
  }

  @observable
  private _IsSuccessClear: boolean;
  @Expose()
  public get IsSuccessClear(): boolean {
    return this._IsSuccessClear;
  }
  public set IsSuccessClear(v: boolean) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'IsSuccessClear',
      () => (this._IsSuccessClear = v),
      v,
      this._IsSuccessClear,
    );
  }

  @observable
  private _SuccessTimer: number;
  @Expose()
  public get SuccessTimer(): number {
    return this._SuccessTimer;
  }
  public set SuccessTimer(v: number) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'SuccessTimer',
      () => (this._SuccessTimer = v),
      v,
      this._SuccessTimer,
    );
  }

  public GetOutputParameters() {
    return ['内容输出'];
  }
}

export class ValueChangedTrigger extends InvokeTriggerBase {
  public GetOutputParameters() {
    return ['当前值'];
  }
}

const VoiceMessageTriggersTemplate = inv => {
  const { List, AnswerList } = inv.Owner;
  return (
    <div
      style={{
        display: '-webkit-box',
        WebkitBoxOrient: 'horizontal',
        WebkitBoxPack: 'justify',
        WebkitBoxAlign: 'center',
        whiteSpace: 'nowrap',
        width: '140px',
        position: 'relative',
        textAlign: 'center',
      }}
    >
      <div style={{ width: '100%', position: 'relative' }}>
        {/* <Select
          style={{
            width: '100%',
          }}
          size="small"
          value={inv.DataObj?.Text || ''}
          onChange={value => {
            inv.DataObj.Text = value?.toString() || '';
          }}
        >
          {List?.map((item, index) => {
            //下拉框里只加载没有被选中的，或者选中的值是当前自己
            if (
              AnswerList.filter(x => x?.Text == item?.Text).length == 0 ||
              item?.Text == inv.DataObj?.Text
            ) {
              return (
                <Select.Option key={index} value={item?.Text}>
                  {item?.Text}
                </Select.Option>
              );
            }
          })}
        </Select> */}
        <Input style={{ width: '100%' }} value={inv.DataObj?.Text || ''} />
      </div>
    </div>
  );
};

class AnswerModel implements IPropUndoable {
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

export class VoiceChangedTrigger extends InvokeTriggerBase {
  // public GetOutputParameters() {
  //   return ['当前值'];
  // }

  constructor(props) {
    super();
  }

  private _VocieSuccessInvId: string;
  @Expose()
  @InvHandler({ DisplayName: '成功消息触发', Type: InvokerType.Event })
  public get VocieSuccessInvId(): string {
    return this._VocieSuccessInvId;
  }
  public set VocieSuccessInvId(v: string) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'VocieSuccessInvId',
      () => (this._VocieSuccessInvId = v),
      v,
      this._VocieSuccessInvId,
    );
  }

  private _VocieErrorInvId: string;
  @Expose()
  @InvHandler({ DisplayName: '错误消息触发', Type: InvokerType.Event })
  public get VocieErrorInvId(): string {
    return this._VocieErrorInvId;
  }
  public set VocieErrorInvId(v: string) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'VocieErrorInvId',
      () => (this._VocieErrorInvId = v),
      v,
      this._VocieErrorInvId,
    );
  }

  @observable
  private _AnswerList: AnswerBranchModel[] = [];

  @Expose()
  @Type(() => AnswerModel)
  @InvHandler({
    DisplayName: '答案列表',
    Type: InvokerType.Event,
    Template: VoiceMessageTriggersTemplate,
    IsList: true,
    ValuePropertyName: 'InvId',
    ListItemType: AnswerModel,
  })

  // 获取语音组件中的答案列表
  public get AnswerList(): AnswerBranchModel[] {
    const answerList = (this
      .AttachedItem as speechRecognitionControllerViewModel)?.AnswerBranchList;
    this._AnswerList = answerList;

    return answerList;
  }
  public set AnswerList(v: AnswerBranchModel[]) {
    const answerList = (this
      .AttachedItem as speechRecognitionControllerViewModel)?.AnswerBranchList;
    RUHelper.TrySetPropRedoUndo(
      this,
      'AnswerList',
      () => (this._AnswerList = answerList),
      v,
      this._AnswerList,
    );
  }

  @computed
  public get List(): Array<AnswerBranchModel> {
    const answerList = (this
      .AttachedItem as speechRecognitionControllerViewModel)?.AnswerBranchList;
    return answerList;
  }
}
