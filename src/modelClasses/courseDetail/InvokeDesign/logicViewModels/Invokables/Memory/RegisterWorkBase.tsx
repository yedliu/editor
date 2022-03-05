import InvokableBase from '@/modelClasses/courseDetail/InvokableBase';
import LogicDesign from '@/modelClasses/courseDetail/logicDesign';
import RUHelper from '@/redoundo/redoUndoHelper';
import { observable, computed, reaction } from 'mobx';
import { Expose } from '@/class-transformer';
import { RegisterSetter } from './RegisterSetter';
import ArrayHelper from '@/utils/arrayHelper';

export class RegisterWorkBase extends InvokableBase {
  constructor() {
    super();
  }

  // @observable
  // static existRegisters: Map<LogicDesign, Set<string>> = new Map<
  //   LogicDesign,
  //   Set<string>
  // >();

  static RegisterListChanged: ((ld: LogicDesign) => void)[] = [];

  // static get ExistRegisters(): Map<LogicDesign, Set<string>> {
  //   return this.existRegisters;
  // }

  readonly HeaderBg: string = '#9F9F7F';
  readonly DetailBg: string = '#C8C8C8';

  @observable
  protected _IsPageGlobal: boolean;
  @Expose()
  public get IsPageGlobal(): boolean {
    return this._IsPageGlobal;
  }
  public set IsPageGlobal(v: boolean) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'IsPageGlobal',
      () => (this._IsPageGlobal = v),
      v,
      this._IsPageGlobal,
    );
  }

  protected fatherItemChanged = reaction(
    () => !this.FatherItem && this.Scene,
    hasfatherItem => {
      if (!this.FatherItem && this.Scene) this._IsPageGlobal = true;
    },
    {
      fireImmediately: true,
    },
  );

  get CanBeCombined() {
    return this.IsPageGlobal;
  }

  @observable
  protected _TargetRegister: string = null;
  @Expose()
  public get TargetRegister(): string {
    if (!this._TargetRegister) {
      var registerList = this.AccessableRegisters;
      if (
        !this.RootLogicDesign ||
        !registerList ||
        registerList.length == 0 ||
        !registerList[0]
      )
        return 'A';
      else return Array.from(registerList)[0];
    }
    return this._TargetRegister;
  }
  public set TargetRegister(v: string) {
    if (v != null) {
      if (this._TargetRegister == null) {
        //未初始化时不进RedoUndo
        this._TargetRegister = v;
      } else
        RUHelper.TrySetPropRedoUndo(
          this,
          'TargetRegister',
          () => {
            this._TargetRegister = v;
          },
          v,
          this._TargetRegister,
        );
    }
  }

  public get AccessableRegisters(): string[] {
    var result = RegisterWorkBase.GetAccessableRegisters(
      this,
      this.IsPageGlobal,
    );
    return result;
  }

  protected logicDesignChanged = reaction(
    () => this.LogicDesign,
    logicDesign => {
      if (logicDesign != null) {
        if (this.RootLogicDesign) {
          var registerList = this.AccessableRegisters;
          if (registerList && registerList.length > 0 && !this._TargetRegister)
            this._TargetRegister = registerList[0];
        }
        //RegisterWorkBase.RefreshRegisterList(this.RootLogicDesign);
      }
    },
    {
      fireImmediately: true,
    },
  );

  static GetAccessableRegisters(inv: InvokableBase, isGlobal: boolean) {
    var result = [];
    if (inv != null) {
      if (isGlobal) {
        var rootLogicDesign = inv.RootLogicDesign;

        var registers = rootLogicDesign?.Scene.TotalInvItems.filter(
          x =>
            x instanceof RegisterSetter && x.IsPageGlobal && x._TargetRegister,
        ).map(x => (x as RegisterSetter).TargetRegister);
        registers = ArrayHelper.distinct(registers);
        if (registers != null) result.push(...registers);
      } else {
        var logicDesign = inv.LogicDesign;
        var registers = logicDesign?.SubInvs.filter(
          x =>
            x instanceof RegisterSetter && !x.IsPageGlobal && x._TargetRegister,
        ).map(x => (x as RegisterSetter).TargetRegister);
        registers = ArrayHelper.distinct(registers);
        if (registers != null) result.push(...registers);
      }
    }

    return result;
  }

  NotifyRegisterListChanged() {
    RegisterWorkBase.RegisterListChanged?.forEach(x =>
      x?.(this.RootLogicDesign),
    );
  }

  // static RefreshRegisterList(_logicDesign?: LogicDesign): void {
  //   var logicDesign = _logicDesign?.Scene?.LogicDesign;
  //   if (logicDesign != null) {
  //     var registers = _logicDesign.Scene.TotalInvItems.filter(
  //       x =>
  //         x instanceof RegisterSetter &&
  //         x.TargetRegister != null &&
  //         x.TargetRegister != '',
  //     ).map(x => (x as RegisterWorkBase).TargetRegister);
  //     if (!RegisterWorkBase.existRegisters.has(logicDesign))
  //       RegisterWorkBase.existRegisters.set(logicDesign, new Set<string>());
  //     var tagset = RegisterWorkBase.existRegisters.get(logicDesign);
  //     var oldstrs = Array.from(tagset).join('');
  //     tagset?.clear();
  //     registers?.forEach(x => tagset?.add(x));
  //     var newstrs = Array.from(tagset).join('');
  //     RegisterWorkBase.existRegisters.set(logicDesign, new Set(tagset));
  //     if (newstrs != oldstrs) {
  //       RegisterWorkBase.RegisterListChanged?.forEach(x => x?.(logicDesign));
  //     }
  //   }
  // }

  // ClearUnusedRegisters(): void {
  //   if (this.RootLogicDesign != null) {
  //     var registers = this.Scene.TotalInvItems.filter(
  //       x =>
  //         x instanceof RegisterSetter &&
  //         x.TargetRegister != null &&
  //         x.TargetRegister != '',
  //     ).map(x => (x as RegisterWorkBase).TargetRegister);
  //     if (!RegisterWorkBase.existRegisters.has(this.RootLogicDesign))
  //       RegisterWorkBase.existRegisters.set(
  //         this.RootLogicDesign,
  //         new Set<string>(),
  //       );
  //     var tagset = RegisterWorkBase.existRegisters.get(this.RootLogicDesign);
  //     var oldCount = tagset.size;
  //     if (registers.length == 0) registers.push('A');
  //     RegisterWorkBase.existRegisters.set(
  //       this.RootLogicDesign,
  //       new Set(registers),
  //     );
  //     var newCount = RegisterWorkBase.existRegisters.get(this.RootLogicDesign)
  //       .size;
  //     if (newCount != oldCount) {
  //       RegisterWorkBase.RegisterListChanged?.forEach(x =>
  //         x?.(this.RootLogicDesign),
  //       );
  //     }
  //   }
  // }
}
