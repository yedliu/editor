import InvokableBase from '@/modelClasses/courseDetail/InvokableBase';
import { SymbolSelectSettingTemplate } from '@/components/cwDesignUI/logicView/invSettingTemplates/GeneralInvSettingTemps';
import { observable } from 'mobx';
import RUHelper from '@/redoundo/redoUndoHelper';
import { Expose } from '@/class-transformer';

export default class SimpleCaculator extends InvokableBase {
  constructor() {
    super();
    this.SettingTemplate = SymbolSelectSettingTemplate;
  }

  get CanInvoke() {
    return false;
  }
  set CanInvoke(v: boolean) {
    super.CanInvoke = false;
  }

  readonly HeaderBg = '#AF9F7F';
  readonly DetailBg = '#C8C8C8';

  readonly SymbolName = '计算符号';

  private _SymbolSource: string[];
  get SymbolSource() {
    if (this._SymbolSource == null)
      this._SymbolSource = ['＋', '－', '×', '÷', '取余'];
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
  GetInputParameters() {
    return ['左值', '右值'];
  }

  GetOutputParameters() {
    return ['结果'];
  }
}
