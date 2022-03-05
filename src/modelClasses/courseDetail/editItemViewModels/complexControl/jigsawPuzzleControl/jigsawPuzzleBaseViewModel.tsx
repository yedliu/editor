import CWElement from '../../../cwElement';
import CWResource from '../../../cwResource';
import { batch } from '@/server/CacheEntityServer';
import IPropUndoable from '@/redoundo/IPropUndoable';
import jigsawPuzzleUnitBaseViewModel from './jigsawPuzzleUnitBaseViewModel';
import {
  ResourceRef,
  SkResRef,
} from '@/modelClasses/courseDetail/resRef/resourceRef';
import { observable } from 'mobx';
import { Expose, Type, plainToClass, classToPlain } from '@/class-transformer';
import {
  ClassType,
  CWResourceTypes,
} from '@/modelClasses/courseDetail/courseDetailenum';
import RUHelper from '@/redoundo/redoUndoHelper';
import ObjHelper from '@/utils/objHelper';
import TypeMapHelper from '@/configs/typeMapHelper';

export default class jigsawPuzzleBaseViewModel extends CWElement {
  protected UnitVMType: new (
    ...args: any[]
  ) => any = jigsawPuzzleUnitBaseViewModel;

  constructor() {
    super();
  }

  @batch(ClassType.object)
  public get thisData(): object {
    return this;
  }

  //#region 底板属性逻辑

  @observable
  private _Linefeed: number = 4;
  @batch(ClassType.number)
  @Expose()
  public get Linefeed(): number {
    return this._Linefeed;
  }
  public set Linefeed(v: number) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'Linefeed',
      () => (this._Linefeed = v),
      v,
      this._Linefeed,
    );
  }

  // @observable
  // private _MaxValueCount: Array<number> = null;
  // @batch(ClassType.object)
  // public get MaxValueCount(): Array<number> {
  //   return this._MaxValueCount;
  // }
  // public set MaxValueCount(v: Array<number>) {
  //   this._MaxValueCount = v;
  // }

  @observable
  private _CellWidth: number;
  //单元格宽度
  @Expose()
  @batch(ClassType.number)
  public get CellWidth(): number {
    return this.Width / this.Linefeed - 0.5;
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
    return this.Width / this.Linefeed - 0.5;
    //return this._CellHeight;
  }
  public set CellHeight(v: number) {
    this._CellHeight = v;
  }

  //#endregion

  //#region 集合列表

  public WEBUnits: Array<jigsawPuzzleUnitBaseViewModel>;
  @observable
  private _Units: Array<jigsawPuzzleUnitBaseViewModel> = new Array<
    jigsawPuzzleUnitBaseViewModel
  >();
  @Expose()
  @batch(ClassType.object)
  public get Units(): Array<jigsawPuzzleUnitBaseViewModel> {
    return this._Units;
  }

  // @batch(ClassType.object)
  // public get AllUnits(): Array<jigsawPuzzleUnitBaseViewModel> {
  //   return this._Units;
  // }

  public set Units(v: Array<jigsawPuzzleUnitBaseViewModel>) {
    // this.WEBUnits = v.map(x => {
    //   return plainToClass(this.UnitVMType, classToPlain(x));
    // });

    this.WEBUnits = v.map(x => {
      var result = ObjHelper.ConvertObj(
        this.UnitVMType,
        x,
        TypeMapHelper.CommonTypeMap,
      );
      return result;
    });
  }

  @observable
  private _SelectedUnits: Array<jigsawPuzzleUnitBaseViewModel>;
  @batch(ClassType.object)
  public get SelectedUnits(): Array<jigsawPuzzleUnitBaseViewModel> {
    if (!this._SelectedUnits)
      this._SelectedUnits = new Array<jigsawPuzzleUnitBaseViewModel>();
    return this._SelectedUnits;
  }
  public set SelectedUnits(v: Array<jigsawPuzzleUnitBaseViewModel>) {
    this._SelectedUnits = v;
  }

  public UnselectAll() {
    if (this._SelectedUnits) {
      do {
        if (this._SelectedUnits?.length < 1) break;
        this._SelectedUnits[0].IsSelected = false;
      } while (true);
    }
  }

  //#endregion

  //#region 属性

  @observable
  private _UnitResourceWidth: number = 10;
  @batch(ClassType.number)
  @Expose()
  public get UnitResourceWidth(): number {
    return this._UnitResourceWidth;
  }
  public set UnitResourceWidth(v: number) {
    this._UnitResourceWidth = v;
    // RUHelper.TrySetPropRedoUndo(
    //   this,
    //   'UnitResourceWidth',
    //   () => (this._UnitResourceWidth = v),
    //   v,
    //   this._UnitResourceWidth,
    // );
  }

  @observable
  private _UnitResourceHeight: number = 10;
  @batch(ClassType.number)
  @Expose()
  public get UnitResourceHeight(): number {
    return this._UnitResourceHeight;
  }
  public set UnitResourceHeight(v: number) {
    this._UnitResourceHeight = v;
    // RUHelper.TrySetPropRedoUndo(
    //   this,
    //   'UnitResourceHeight',
    //   () => (this._UnitResourceHeight = v),
    //   v,
    //   this._UnitResourceHeight,
    // );
  }

  @observable
  private _UnitZoom: number = 100;
  @batch(ClassType.number)
  @Expose()
  public get UnitZoom(): number {
    return this._UnitZoom;
  }
  public set UnitZoom(v: number) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'UnitZoom',
      () => {
        this._UnitZoom = v;

        if (
          this.UnitResource != null &&
          this.UnitResource.Resource != null &&
          this.IsSelected
        ) {
          this.UnitResourceWidth = v * 0.01 * this.UnitResource.Resource.width;
          this.UnitResourceHeight =
            v * 0.01 * this.UnitResource.Resource.height;
        }
      },
      v,
      this._UnitZoom,
    );
  }

  //#endregion

  //#region  资源

  @observable
  private _Background: ResourceRef;
  @Expose()
  @batch(ClassType.resource)
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
  private _UnitResource: ResourceRef;
  @Expose()
  @batch(ClassType.resource)
  @Type(() => ResourceRef)
  public get UnitResource(): ResourceRef {
    return this._UnitResource;
  }
  public set UnitResource(v: ResourceRef) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'UnitResource',
      () => (this._UnitResource = v),
      v,
      this._UnitResource,
    );
  }

  @observable
  private _SelectVoice: ResourceRef;
  @Expose()
  @batch(ClassType.resource)
  @Type(() => ResourceRef)
  public get SelectVoice(): ResourceRef {
    return this._SelectVoice;
  }
  public set SelectVoice(v: ResourceRef) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'SelectVoice',
      () => (this._SelectVoice = v),
      v,
      this._SelectVoice,
    );
  }

  //#region  资源加载

  public SetResourcesFromLib(reslib: CWResource[]) {
    if (!reslib) return;
    this.Background?.SearchResource(reslib);
    this.UnitResource?.SearchResource(reslib);
    this.SelectVoice?.SearchResource(reslib);

    this.InitUnits(reslib);
  }

  ///初始化获取的参数
  public InitUnits(reslib: Array<CWResource>) {
    // for (let i = 0; i < this.Units?.length; i++) {
    //   this.Units[i].Father = this;
    //   this.Units[i].SeachRes(reslib);
    // }
    if (this.WEBUnits != null) {
      this._Units = null;
      this._Units = Array<jigsawPuzzleUnitBaseViewModel>();
      for (let i = 0; i < this.WEBUnits.length; i++) {
        this.WEBUnits[i].SeachRes(reslib);
        this.WEBUnits[i].Father = this;
        this._Units.push(this.WEBUnits[i]);
      }
      this.WEBUnits = null;
    } else {
    }
  }

  public GetDependencyResources(): CWResource[] {
    var res = super.GetDependencyResources();
    if (this.Background != null && this.Background.Resource != null)
      res.push(this.Background.Resource);
    if (this.UnitResource != null && this.UnitResource.Resource != null)
      res.push(this.UnitResource.Resource);
    if (this.SelectVoice != null && this.SelectVoice.Resource != null)
      res.push(this.SelectVoice.Resource);

    if (this.Units != null && this.Units.length > 0)
      this.Units.forEach(unit => {
        res.push(...unit.GetDependencyResources());
      });
    return res;
  }

  // public AttachResource(source: CWResource) {
  //   if (source != null) {
  //     if (source.resourceType == CWResourceTypes.Image) {
  //       this.Background = new ResourceRef(source);
  //     } else if (
  //       source.resourceType == CWResourceTypes.SkeletalAni &&
  //       source.boneList != null &&
  //       source.boneList.length > 0
  //     ) {
  //       this.Background = new SkResRef(
  //         source,
  //         source.boneList[0].value,
  //         0,
  //       );
  //     }
  //   }
  // }

  //#endregion

  //#endregion
}
