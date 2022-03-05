import RectMazeBase from '../RectMazeBase';
import dragSeekBarUnitComplex from './dragSeekBarUnitComplex';
import dragSeekBarTemplate, {
  PropPanelTemplate as dragSeekBarTemplatePropPanelTemplate,
} from '@/components/cwDesignUI/elements/controlTemplates/dragSeekBarTemplate';
import { observable } from 'mobx';
import { Expose, Type } from '@/class-transformer';
import { batch } from '@/server/CacheEntityServer';
import { ClassType } from '@/modelClasses/courseDetail/courseDetailenum';
import RUHelper from '@/redoundo/redoUndoHelper';
import { ActionViewModel } from '@/modelClasses/courseDetail/ShowHideViewModels/ActionViewModel';

export default class dragSeekBarComplex extends RectMazeBase {
  public get Template(): any {
    return dragSeekBarTemplate;
  }

  public get PropPanelTemplate(): any {
    return dragSeekBarTemplatePropPanelTemplate;
  }

  constructor() {
    super();
    this.UnitVMType = dragSeekBarUnitComplex;
    this.RowNum = 1;
    this.ColNum = 1;
  }

  //
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

  //均分格数
  @observable
  private _Equipartition: number = 1;
  @Expose()
  @batch(ClassType.number)
  public get Equipartition(): number {
    return this._Equipartition;
  }
  public set Equipartition(v: number) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'Equipartition',
      () => (this._Equipartition = v),
      v,
      this._Equipartition,
    );
  }

  //拖动模式 0=遮罩 ，1=单元格 , 2=滑动格
  @observable
  private _JumpInMode: number = 1;
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

  //终点列号
  @observable
  private _EndColIndex: number = 1;
  @Expose()
  @batch(ClassType.number)
  public get EndColIndex(): number {
    return this._EndColIndex;
  }
  public set EndColIndex(v: number) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'EndColIndex',
      () => (this._EndColIndex = v),
      v,
      this._EndColIndex,
    );
  }

  @batch(ClassType.number)
  public get EndCol(): number {
    return this.EndColIndex + 1;
  }
  public set EndCol(v: number) {
    this.EndColIndex = v - 1;
  }

  //到达终点成功触发的事件
  @observable
  private _SuccessEvents: ActionViewModel[];
  @Expose()
  @Type(() => ActionViewModel)
  @batch(ClassType.object)
  public get SuccessEvents(): ActionViewModel[] {
    if (!this._SuccessEvents) this._SuccessEvents = [new ActionViewModel()];
    return this._SuccessEvents;
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
    if (!this._FailEvents) this._FailEvents = [new ActionViewModel()];
    return this._FailEvents;
  }
  public set FailEvents(v: ActionViewModel[]) {
    this._FailEvents = v;
  }

  //过程中触发事件
  @observable
  private _TriggerEvents: ActionViewModel[];
  @Expose()
  @Type(() => ActionViewModel)
  @batch(ClassType.object)
  public get TriggerEvents(): ActionViewModel[] {
    return this._TriggerEvents;
  }
  public set TriggerEvents(v: ActionViewModel[]) {
    this._TriggerEvents = v;
  }

  //   SetResourcesFromLib(reslib: CWResource[]) {
  //     if (!reslib) return;
  //     super.SetResourcesFromLib(reslib);
  //     this.IllegalVoice?.SearchResource(reslib);
  //     this.GuideArrow?.SearchResource(reslib);
  //   }

  //   public GetDependencyResources(): CWResource[] {
  //     var res = super.GetDependencyResources();
  //     if (this.IllegalVoice != null && this.IllegalVoice.Resource != null)
  //       res.push(this.IllegalVoice.Resource);
  //     if (this.GuideArrow != null && this.GuideArrow.Resource != null)
  //       res.push(this.GuideArrow.Resource);
  //     return res;
  //   }
}
