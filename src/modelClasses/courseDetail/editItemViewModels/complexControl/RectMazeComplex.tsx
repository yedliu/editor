import RectMazeBase from './RectMazeBase';
import RectMazeUnitComplex from './RectMazeUnitComplex';
import rectMazeTemplate, {
  PropPanelTemplate as rectMazeTemplatePropPanelTemplate,
} from '@/components/cwDesignUI/elements/controlTemplates/rectMazeTemplate';
import { observable } from 'mobx';
import { Expose, Type } from '@/class-transformer';
import { batch } from '@/server/CacheEntityServer';
import { ClassType } from '../../courseDetailenum';
import RUHelper from '@/redoundo/redoUndoHelper';
import { ResourceRef } from '../../resRef/resourceRef';
import { ActionViewModel } from '../../ShowHideViewModels/ActionViewModel';
import CWResource from '../../cwResource';

export default class RectMazeComplex extends RectMazeBase {
  public get Template(): any {
    return rectMazeTemplate;
  }

  public get PropPanelTemplate(): any {
    return rectMazeTemplatePropPanelTemplate;
  }

  constructor() {
    super();
    this.UnitVMType = RectMazeUnitComplex;
    this.RowNum = 2;
    this.ColNum = 2;
  }

  //#region 属性

  //#region 行动主体相关属性

  //棋子
  @observable
  private _ChessmanId: string = '';
  @Expose()
  @batch(ClassType.string)
  public get ChessmanId(): string {
    return this._ChessmanId;
  }
  public set ChessmanId(v: string) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'ChessmanId',
      () => (this._ChessmanId = v),
      v,
      this._ChessmanId,
    );
  }

  //非法提示
  @observable
  private _IllegalVoice: ResourceRef;
  @Expose()
  @batch(ClassType.resource)
  @Type(() => ResourceRef)
  public get IllegalVoice(): ResourceRef {
    return this._IllegalVoice;
  }
  public set IllegalVoice(v: ResourceRef) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'IllegalVoice',
      () => (this._IllegalVoice = v),
      v,
      this._IllegalVoice,
    );
  }

  //进入迷宫的形式 0 直接变入 1 飞入
  @observable
  private _JumpInMode: number;
  @Expose()
  @batch(ClassType.number)
  public get JumpInMode(): number {
    return this._JumpInMode;
  }
  public set JumpInMode(v: number) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'JumpInMode',
      () => (this._JumpInMode = v),
      v,
      this._JumpInMode,
    );
  }

  //飞入迷宫的时间
  @observable
  private _JumpInTime: number = 2.0;
  @Expose()
  @batch(ClassType.number)
  public get JumpInTime(): number {
    return this._JumpInTime;
  }
  public set JumpInTime(v: number) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'JumpInTime',
      () => (this._JumpInTime = v),
      v,
      this._JumpInTime,
    );
  }

  @observable
  private _MoveMode: number = 0;
  @Expose()
  @batch(ClassType.number)
  public get MoveMode(): number {
    return this._MoveMode;
  }
  public set MoveMode(v: number) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'MoveMode',
      () => (this._MoveMode = v),
      v,
      this._MoveMode,
    );
  }

  //开始时的行号
  @observable
  private _StartRowIndex: number = 0;
  @Expose()
  @batch(ClassType.number)
  public get StartRowIndex(): number {
    return this._StartRowIndex;
  }
  public set StartRowIndex(v: number) {
    //-----------------------------------------
    RUHelper.TrySetPropRedoUndo(
      this,
      'StartRowIndex',
      () => (this._StartRowIndex = v),
      v,
      this._StartRowIndex,
    );
  }

  //显示的起始行号
  // @observable
  // private _StartRow: number = 0;
  //@Expose()
  @batch(ClassType.number)
  public get StartRow(): number {
    return this.StartRowIndex + 1;
  }
  public set StartRow(v: number) {
    this.StartRowIndex = v - 1;
  }

  //开始时的列号
  @observable
  private _StartColIndex: number = 0;
  @Expose()
  @batch(ClassType.number)
  public get StartColIndex(): number {
    return this._StartColIndex;
  }
  public set StartColIndex(v: number) {
    //-----------------------------------------
    RUHelper.TrySetPropRedoUndo(
      this,
      'StartColIndex',
      () => (this._StartColIndex = v),
      v,
      this._StartColIndex,
    );
  }

  // 显示的起始列号
  // @observable
  // private _StartRow: number = 0;
  //@Expose()
  @batch(ClassType.number)
  public get StartCol(): number {
    return this.StartColIndex + 1;
  }
  public set StartCol(v: number) {
    this.StartColIndex = v - 1;
  }

  //StartUnit

  // 是否设置终点
  @observable
  private _HasEndUnit: boolean = true;
  @Expose()
  @batch(ClassType.bool)
  public get HasEndUnit(): boolean {
    return this._HasEndUnit;
  }
  public set HasEndUnit(v: boolean) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'HasEndUnit',
      () => (this._HasEndUnit = v),
      v,
      this._HasEndUnit,
    );
  }

  // 是否重置
  @observable
  private _IsErrorReset: boolean = true;
  //@Expose()
  @batch(ClassType.bool)
  public get IsErrorReset(): boolean {
    return this._IsErrorReset;
  }
  public set IsErrorReset(v: boolean) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'IsErrorReset',
      () => (this._IsErrorReset = v),
      v,
      this._IsErrorReset,
    );
  }

  //错误后重置延迟
  @observable
  private _ErrorResetTimer: number = 0;
  @Expose()
  @batch(ClassType.number)
  public get ErrorResetTimer(): number {
    return this._ErrorResetTimer;
  }
  public set ErrorResetTimer(v: number) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'ErrorResetTimer',
      () => (this._ErrorResetTimer = v),
      v,
      this._ErrorResetTimer,
    );
  }

  //到达终点成功触发的事件
  @observable
  private _SuccessEvents: ActionViewModel[];
  @Expose()
  @Type(() => ActionViewModel)
  @batch(ClassType.object)
  public get SuccessEvents(): ActionViewModel[] {
    if (this.HasEndUnit) {
      if (!this._SuccessEvents) this._SuccessEvents = [new ActionViewModel()];
      return this._SuccessEvents;
    } else {
      return null;
    }
  }
  public set SuccessEvents(v: ActionViewModel[]) {
    this._SuccessEvents = v;
  }

  //到达终点失败触发的事件
  @observable
  private _FailEvents: ActionViewModel[];
  @Expose()
  @Type(() => ActionViewModel)
  @batch(ClassType.object)
  public get FailEvents(): ActionViewModel[] {
    if (this.HasEndUnit) {
      if (!this._FailEvents) this._FailEvents = [new ActionViewModel()];
      return this._FailEvents;
    } else {
      return null;
    }
  }
  public set FailEvents(v: ActionViewModel[]) {
    this._FailEvents = v;
  }

  //终点时的行号
  @observable
  private _EndRowIndex: number = 1;
  @Expose()
  @batch(ClassType.number)
  public get EndRowIndex(): number {
    return this._EndRowIndex;
  }
  public set EndRowIndex(v: number) {
    //-----------------------------------------
    RUHelper.TrySetPropRedoUndo(
      this,
      'EndRowIndex',
      () => (this._EndRowIndex = v),
      v,
      this._EndRowIndex,
    );
  }

  // 显示的终点行号
  // @observable
  // private _StartRow: number = 0;
  //@Expose()
  @batch(ClassType.number)
  public get EndRow(): number {
    return this.EndRowIndex + 1;
  }
  public set EndRow(v: number) {
    this.EndRowIndex = v - 1;
  }

  //终点时的列号
  @observable
  private _EndColIndex: number = 1;
  @Expose()
  @batch(ClassType.number)
  public get EndColIndex(): number {
    return this._EndColIndex;
  }
  public set EndColIndex(v: number) {
    //-----------------------------------------
    RUHelper.TrySetPropRedoUndo(
      this,
      'EndColIndex',
      () => (this._EndColIndex = v),
      v,
      this._EndColIndex,
    );
  }

  // 显示的终点列号
  // @observable
  // private _StartRow: number = 0;
  //@Expose()
  @batch(ClassType.number)
  public get EndCol(): number {
    return this.EndColIndex + 1;
  }
  public set EndCol(v: number) {
    this.EndColIndex = v - 1;
  }

  //EndUnit

  //最大步数
  @observable
  private _MaxStep: number = 1;
  @Expose()
  @batch(ClassType.number)
  public get MaxStep(): number {
    return this._MaxStep;
  }
  public set MaxStep(v: number) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'MaxStep',
      () => (this._MaxStep = v),
      v,
      this._MaxStep,
    );
  }

  //棋子的移动步长
  @observable
  private _MoveStep: number = 1;
  @Expose()
  @batch(ClassType.number)
  public get MoveStep(): number {
    return this._MoveStep;
  }
  public set MoveStep(v: number) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'MoveStep',
      () => (this._MoveStep = v),
      v,
      this._MoveStep,
    );
  }

  //#endregion

  //#region 控制器

  //棋子
  @observable
  private _CtrlerId: string = '';
  @Expose()
  @batch(ClassType.string)
  public get CtrlerId(): string {
    return this._CtrlerId;
  }
  public set CtrlerId(v: string) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'CtrlerId',
      () => (this._CtrlerId = v),
      v,
      this._CtrlerId,
    );
  }

  //引导箭头
  @observable
  private _GuideArrow: ResourceRef;
  @Expose()
  @batch(ClassType.resource)
  @Type(() => ResourceRef)
  public get GuideArrow(): ResourceRef {
    return this._GuideArrow;
    // if(this.CtrlerId == null || this.CtrlerId == ''){
    //   return null;
    // }else
    //   return this._GuideArrow;
  }
  public set GuideArrow(v: ResourceRef) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'GuideArrow',
      () => (this._GuideArrow = v),
      v,
      this._GuideArrow,
    );
  }

  //#endregion

  //#endregion

  SetResourcesFromLib(reslib: CWResource[]) {
    if (!reslib) return;
    super.SetResourcesFromLib(reslib);
    this.IllegalVoice?.SearchResource(reslib);
    this.GuideArrow?.SearchResource(reslib);
  }

  public GetDependencyResources(): CWResource[] {
    var res = super.GetDependencyResources();
    if (this.IllegalVoice != null && this.IllegalVoice.Resource != null)
      res.push(this.IllegalVoice.Resource);
    if (this.GuideArrow != null && this.GuideArrow.Resource != null)
      res.push(this.GuideArrow.Resource);
    return res;
  }
}
