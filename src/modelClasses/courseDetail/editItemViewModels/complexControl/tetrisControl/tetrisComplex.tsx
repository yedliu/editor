import RectMazeBase from '../RectMazeBase';
import tetrisTemplate, {
  PropPanelTemplate as tetrisTemplatePropPanelTemplate,
} from '@/components/cwDesignUI/elements/controlTemplates/tetrisTemplate';
import tetrisUnitComplex from './tetrisUnitComplex';
import listBlockComplex from './listBlockComplex';
import CWResource from '@/modelClasses/courseDetail/cwResource';
import { observable } from 'mobx';
import { Expose, Type } from '@/class-transformer';
import { ResourceRef } from '@/modelClasses/courseDetail/resRef/resourceRef';
import { batch } from '@/server/CacheEntityServer';
import RUHelper from '@/redoundo/redoUndoHelper';
import { ClassType } from '@/modelClasses/courseDetail/courseDetailenum';
import ObjHelper from '@/utils/objHelper';
import TypeMapHelper from '@/configs/typeMapHelper';
import CWElement from '@/modelClasses/courseDetail/cwElement';
import MathHelper from '@/utils/MathHelper';
import { InvokeTriggerSetting } from '@/modelClasses/courseDetail/triggers/invokeTriggerSetting';
import { ValueChangedTrigger } from '@/modelClasses/courseDetail/triggers/extendedTrigger';

export default class tetrisComplex extends RectMazeBase {
  public get Template(): any {
    return tetrisTemplate;
  }

  public get PropPanelTemplate(): any {
    return tetrisTemplatePropPanelTemplate;
  }

  protected UnitVMTypeBlock: new (...args: any[]) => any = listBlockComplex;

  constructor() {
    super();
    this.UnitVMType = tetrisUnitComplex;
    this.UnitVMTypeBlock = listBlockComplex;
    this.RanksCount = 5;
    this.RowNum = 5;
    this.ColNum = 5;
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

  @batch()
  public get thisData(): object {
    return this;
  }

  //#region 方块列表逻辑

  //#region 集合列表

  @observable
  private _CellWidth: number;
  //单元格宽度
  @Expose()
  @batch(ClassType.number)
  public get CellWidth(): number {
    return this.Width / this.RanksCount - 0.5;
    //return this._CellWidth;
  }
  public set CellWidth(v: number) {
    this._CellWidth = v;
  }

  @observable
  private _CellHeight: number;
  //单元格高度
  @Expose()
  @batch(ClassType.number)
  public get CellHeight(): number {
    return this.Width / this.RanksCount - 0.5;
    //return this._CellHeight;
  }
  public set CellHeight(v: number) {
    this._CellHeight = v;
  }

  public WEBUnitsBlock: Array<listBlockComplex>;
  @observable
  private _UnitsBlock: Array<listBlockComplex> = new Array<listBlockComplex>();
  @Expose()
  @batch(ClassType.object)
  public get UnitsBlock(): Array<listBlockComplex> {
    return this._UnitsBlock;
    // var result = new Array<listBlockComplex>();
    // if (this._UnitsBlock != null) {
    //   this._UnitsBlock.forEach(row => {
    //     result.push(row);
    //   });
    // }
    // return result;
  }

  public set UnitsBlock(v: Array<listBlockComplex>) {
    this.WEBUnitsBlock = v.map(x => {
      var result = ObjHelper.ConvertObj(
        this.UnitVMTypeBlock,
        x,
        TypeMapHelper.CommonTypeMap,
      );

      return result;
    });
    this.WEBUnitsBlock.forEach((x, i) => {
      if (v[i].WEBUnits == null) {
        x.Units = v[i].Units;
      } else {
        this.WEBUnitsBlock[i].Units = v[i].WEBUnits;
      }
    });
    // this.WEBUnitsBlock.forEach((x, i) => {
    //   x.WEBUnits = v[i].WEBUnits;
    // });
  }

  //   public SafeDeepClone(
  //   useNewId: boolean = true,
  //   idReplaceMap?: Map<string, string>,
  // ): CWElement {
  //   var _item = super.SafeDeepClone(useNewId,idReplaceMap) as this;

  //       // _item.UnitsBlock.forEach((x,i)=>
  //       // {
  //       //     var clone = this.UnitsBlock[i].SafeDeepClone();
  //       //     _item.UnitsBlock[i] = clone;
  //       // });

  //   return _item;
  // }

  @observable
  private _SelectedUnitsBlock: Array<listBlockComplex>;
  @batch(ClassType.object)
  public get SelectedUnitsBlock(): Array<listBlockComplex> {
    if (!this._SelectedUnitsBlock)
      this._SelectedUnitsBlock = new Array<listBlockComplex>();
    return this._SelectedUnitsBlock;
  }
  public set SelectedUnitsBlock(v: Array<listBlockComplex>) {
    this._SelectedUnitsBlock = v;
  }

  @batch(ClassType.object)
  public UnselectAllBlock() {
    this.UnitsBlock?.forEach(item => {
      item.IsSelected = false;
    });
    // if (this._SelectedUnitsBlock) {
    //   do {
    //     if (this._SelectedUnitsBlock?.length < 1) break;
    //     this._SelectedUnitsBlock[0].IsSelected = false;
    //   } while (true);
    // }
  }

  //#endregion

  //#endregion

  //#region 属性

  @observable
  private _RanksCount: number = 1;
  @batch(ClassType.number)
  @Expose()
  public get RanksCount(): number {
    return this._RanksCount;
  }
  public set RanksCount(v: number) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'RanksCount',
      () => (this._RanksCount = v),
      v,
      this._RanksCount,
    );
  }

  //#endregion

  //#region 资源属性

  @observable
  private _SelectedVoice: ResourceRef;
  @Expose()
  @batch(ClassType.resource)
  @Type(() => ResourceRef)
  public get SelectedVoice(): ResourceRef {
    return this._SelectedVoice;
  }
  public set SelectedVoice(v: ResourceRef) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'SelectedVoice',
      () => (this._SelectedVoice = v),
      v,
      this._SelectedVoice,
    );
  }

  @observable
  private _PlaceVoice: ResourceRef;
  @Expose()
  @batch(ClassType.resource)
  @Type(() => ResourceRef)
  public get PlaceVoice(): ResourceRef {
    return this._PlaceVoice;
  }
  public set PlaceVoice(v: ResourceRef) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'PlaceVoice',
      () => (this._PlaceVoice = v),
      v,
      this._PlaceVoice,
    );
  }

  @observable
  private _ReturnVoice: ResourceRef;
  @Expose()
  @batch(ClassType.resource)
  @Type(() => ResourceRef)
  public get ReturnVoice(): ResourceRef {
    return this._ReturnVoice;
  }
  public set ReturnVoice(v: ResourceRef) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'ReturnVoice',
      () => (this._ReturnVoice = v),
      v,
      this._ReturnVoice,
    );
  }

  //#endregion

  SetResourcesFromLib(reslib: CWResource[]) {
    if (!reslib) return;
    super.SetResourcesFromLib(reslib);
    this.SelectedVoice?.SearchResource(reslib);
    this.PlaceVoice?.SearchResource(reslib);
    this.ReturnVoice?.SearchResource(reslib);

    this.InitUnitsBlock(reslib);
  }

  ///初始化获取的参数
  public InitUnitsBlock(reslib: Array<CWResource>) {
    if (this.WEBUnitsBlock != null) {
      this._UnitsBlock = null;
      this._UnitsBlock = Array<listBlockComplex>();
      for (let i = 0; i < this.WEBUnitsBlock.length; i++) {
        this.WEBUnitsBlock[i].SeachRes(reslib);
        this.WEBUnitsBlock[i].Father = this;
        this._UnitsBlock.push(this.WEBUnitsBlock[i]);
      }
      this.WEBUnitsBlock = null;
    }
  }

  public GetDependencyResources(): CWResource[] {
    var res = super.GetDependencyResources();
    if (this.SelectedVoice != null && this.SelectedVoice.Resource != null)
      res.push(this.SelectedVoice.Resource);
    if (this.PlaceVoice != null && this.PlaceVoice.Resource != null)
      res.push(this.PlaceVoice.Resource);
    if (this.ReturnVoice != null && this.ReturnVoice.Resource != null)
      res.push(this.ReturnVoice.Resource);
    if (this.UnitsBlock != null && this.UnitsBlock.length > 0)
      this.UnitsBlock.forEach(unit => {
        res.push(...unit.GetDependencyResources());
      });
    return res;
  }
}
