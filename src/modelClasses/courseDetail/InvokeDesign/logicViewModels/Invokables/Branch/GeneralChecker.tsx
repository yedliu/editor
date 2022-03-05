import InvokableBase from '@/modelClasses/courseDetail/InvokableBase';
import { observable } from 'mobx';
import RUHelper from '@/redoundo/redoUndoHelper';
import InvokeHandler from '../../../InvokeHandler';
import { InvHandler, InvokerType } from '../../../InvokeHandlerMeta';
import { SymbolSelectSettingTemplate } from '@/components/cwDesignUI/logicView/invSettingTemplates/GeneralInvSettingTemps';
import { Expose } from '@/class-transformer';

export default class GeneralChecker extends InvokableBase {
  constructor() {
    super();
    this.SettingTemplate = SymbolSelectSettingTemplate;
  }

  readonly HeaderBg = '#9F6F7F';
  readonly DetailBg = '#D8C8C8';

  readonly SymbolName = '比较符号';

  private _SymbolSource: string[];
  get SymbolSource() {
    if (this._SymbolSource == null)
      this._SymbolSource = ['＝', '＞', '≥', '＜', '≤', '≠', '字符相同'];
    return this._SymbolSource;
  }

  @observable
  private _SymbolType: number = 0;
  @Expose()
  public get SymbolType(): number {
    return this._SymbolType;
  }
  public set SymbolType(v: number) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'SymbolType',
      () => (this._SymbolType = v),
      v,
      this._SymbolType,
    );
  }

  @observable
  private _SuccessId: string;

  @InvHandler({ Type: InvokerType.Invoke, DisplayName: '正确', OrderIndex: 0 })
  @Expose({ name: 'SucessId' })
  public get SuccessId(): string {
    return this._SuccessId;
  }
  public set SuccessId(v: string) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'SuccessId',
      () => (this._SuccessId = v),
      v,
      this._SuccessId,
    );
  }

  @observable
  private _ErrorId: string;
  @InvHandler({ Type: InvokerType.Invoke, DisplayName: '错误', OrderIndex: 1 })
  @Expose()
  public get ErrorId(): string {
    return this._ErrorId;
  }
  public set ErrorId(v: string) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'ErrorId',
      () => (this._ErrorId = v),
      v,
      this._ErrorId,
    );
  }

  GetInputParameters() {
    return ['左值', '右值'];
  }
}
