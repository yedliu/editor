import InvokableBase from '@/modelClasses/courseDetail/InvokableBase';
import { observable, reaction } from 'mobx';
import RUHelper from '@/redoundo/redoUndoHelper';
import { Exclude, Expose } from '@/class-transformer';
import { from } from 'linq-to-typescript';
import { RegisterWorkBase } from '../Memory/RegisterWorkBase';
import LogicDesign from '@/modelClasses/courseDetail/logicDesign';
import { FreeScriptSettingTemplate } from '@/components/cwDesignUI/logicView/invSettingTemplates/GeneralInvSettingTemps';

export default class FreeCaculator extends RegisterWorkBase {
  constructor() {
    super();
    this.SettingTemplate = FreeScriptSettingTemplate;
  }

  readonly HeaderBg = '#AF9F7F';

  readonly DetailBg = '#C8C8C8';

  @Exclude()
  public get TargetRegister(): string {
    return undefined;
  }
  public set TargetRegister(v: string) {
    super.TargetRegister = v;
  }

  @Expose()
  public get IsPageGlobal(): boolean {
    return super.IsPageGlobal;
  }
  public set IsPageGlobal(v: boolean) {
    if (
      RUHelper.TrySetPropRedoUndo(
        this,
        'IsPageGlobal',
        () => (this._IsPageGlobal = v),
        v,
        this._IsPageGlobal,
      )
    ) {
      this.ScriptError = this.CheckScriptError(this.ScriptString);
    }
  }

  get CanInvoke() {
    return false;
  }
  set CanInvoke(v: boolean) {
    super.CanInvoke = false;
  }

  get Tips() {
    return `可以通过输入包含寄存器名的算式输出结果，寄存器名由花括号包括，如:
                {A}+{B}
表示寄存器A和寄存器B相加的值，也可以使用等式不等式输出比较结果，如:
                {A}+1>={B} 或 {A}*{B}=={C}
若等式不等式结果成立则结果为1，不成立则结果为0`;
  }

  get InputAreaName() {
    return '计算公式';
  }

  @observable
  private _ScriptString: string;
  @Expose()
  public get ScriptString(): string {
    return this._ScriptString;
  }
  public set ScriptString(v: string) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'ScriptString',
      () => {
        this._ScriptString = v;
        this.ScriptError = this.CheckScriptError(v);
      },
      v,
      this._ScriptString,
    );
  }

  @observable
  private _ScriptError: string = '式子不能为空';
  public get ScriptError(): string {
    return this._ScriptError;
  }
  public set ScriptError(v: string) {
    this._ScriptError = v;
  }

  protected logicDesignChanged = reaction(
    () => this.LogicDesign,
    logicDesign => {
      if (logicDesign == null) {
        RegisterWorkBase.RegisterListChanged?.splice(
          RegisterWorkBase.RegisterListChanged.indexOf(
            this._RegisterListChanged,
          ),
          1,
        );
      } else {
        if (
          !RegisterWorkBase.RegisterListChanged.includes(
            this._RegisterListChanged,
          )
        )
          RegisterWorkBase.RegisterListChanged.push(this._RegisterListChanged);
        this.RegisterListChanged(this.RootLogicDesign);
      }
    },
    {
      fireImmediately: true,
    },
  );

  RegisterListChanged(logicDesign: LogicDesign) {
    if (logicDesign == this.RootLogicDesign) {
      this.ScriptError = this.CheckScriptError(this.ScriptString);
    }
  }
  _RegisterListChanged = this.RegisterListChanged.bind(this);

  CheckScriptError(script: string) {
    if (script == null || script == '') return '式子不能为空';
    var charArray = [];
    for (var i = 0; i < script.length; i++) charArray.push(script.charAt(i));
    if (
      from(charArray).count(x => x == '{') !=
      from(charArray).count(x => x == '}')
    )
      return '花括号必须成对出现';
    var started = false;
    var exceptRegisterStr = ''; //除去寄存器之外剩下的字符串
    var registersUsed = new Array<string>();
    var currentRegisterName = '';
    for (var c of charArray) {
      if (c == '{' && started) return '花括号不能互相嵌套';
      if (c == '{') started = true;
      else if (c == '}') {
        registersUsed.push(currentRegisterName);
        started = false;
        currentRegisterName = '';
        exceptRegisterStr += '(1+1)';
      } else if (!started) exceptRegisterStr += c;
      else {
        currentRegisterName += c;
      }
    }
    registersUsed = from(registersUsed)
      .distinct()
      .toArray();
    if (registersUsed.find(x => x == '') != null)
      return '不能使用空的寄存器名称';
    if (this.LogicDesign != null && registersUsed.length > 0) {
      var registers = this.AccessableRegisters;
      if (!registers || registers.length == 0) return '当前区域还未设置寄存器';
      var notExsitRegist = from(registersUsed)
        .except(registers)
        .toArray();
      if (notExsitRegist.length > 0)
        return '寄存器{' + notExsitRegist.join('},{') + '}不存在';
    }

    if (
      from(charArray).count(x => x == '(') !=
      from(charArray).count(x => x == ')')
    )
      return '括号必须成对出现';

    try {
      new Function('return ' + exceptRegisterStr)();
    } catch (err) {
      if (err instanceof Error) return err.message;
      return err;
    }
    return '';
  }

  GetOutputParameters() {
    return ['结果'];
  }
}
