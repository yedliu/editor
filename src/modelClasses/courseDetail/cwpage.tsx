import {
  CirculationMode,
  ElementTypes,
  OpAnimationType,
  AdornerMode,
} from './courseDetailenum';
import CWElement from './cwElement';
import { Type, Exclude, Expose } from '@/class-transformer';
import CombinedEditItem from './editItemViewModels/combinedEditItem';
import CWResource from './cwResource';
import { observable, autorun, reaction, computed, action } from 'mobx';
import { from } from 'linq-to-typescript';
import { Rect2D, Vector2D, Point2D } from '@/utils/Math2D';
import CWSubstance from './cwSubstance';
import ElementsCopyBox from './toolbox/elementsCopyBox';
import ObjHelper from '@/utils/objHelper';
import TypeMapHelper from '@/configs/typeMapHelper';
import RUHelper from '@/redoundo/redoUndoHelper';
import IPropUndoable from '@/redoundo/IPropUndoable';
import InvokableBase from './InvokableBase';
import InvokableGroup from './InvokeDesign/logicViewModels/Invokables/InvokableGroup';
import LogicDesign from './logicDesign';
import IdHelper from '@/utils/idHelper';
import InvokeTriggerBase from './triggers/invokeTriggerBase';
import ILogicDesignItem from './InvokeDesign/logicViewModels/ILogicDesignItem';
import ArrayHelper from '@/utils/arrayHelper';
//import { stores } from '@/pages';
import ActionManager from '@/redoundo/actionManager';
import { ResourceRef } from './resRef/resourceRef';
import CacheHelper from '@/utils/cacheHelper';
import { Courseware } from '../courseware';

class PageCaptionsViewModel implements IPropUndoable {
  get CanRecordRedoUndo(): boolean {
    if (
      // stores.courseware &&
      // !stores.courseware.isLoading &&
      this.Page != null &&
      this.Page.CanRecordRedoUndo &&
      !ActionManager.Instance.ActionIsExecuting
    )
      return true;
    return false;
  }

  private _Page: CWPage;
  public get Page(): CWPage {
    return this._Page;
  }
  public set Page(v: CWPage) {
    this._Page = v;
  }

  public Lang: { configKey: string; configValue: string } = null;

  @observable
  private _Captions: ResourceRef;
  //@Expose({ groups: ['Clone'] })
  public get Captions(): ResourceRef {
    return this._Captions;
  }
  public set Captions(v: ResourceRef) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'Captions',
      () => (this._Captions = v),
      v,
      this._Captions,
    );
  }
}

export default class CWPage implements IPropUndoable {
  public get CanRecordRedoUndo(): boolean {
    return this.Courseware != null && !RUHelper.Core.ActionIsExecuting;
  }

  constructor() {
    this.Id = IdHelper.NewId();
  }

  static stores;

  //#region   可序列化
  //页面编号
  @Expose()
  Id: string;

  //页面版本
  @observable
  private _Version: number = null;
  @Expose()
  public get Version(): number {
    return this._Version;
  }
  public set Version(v: number) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'Version',
      () => (this._Version = v),
      v,
      this._Version,
    );
  }

  //针对消息发送器hover页面ID时，给页面列表增加样式
  @observable
  public IsHoverId: boolean = false;

  //页面名称
  @observable
  private _Name: string;
  @Expose()
  public get Name(): string {
    return this._Name;
  }
  public set Name(v: string) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'Name',
      () => (this._Name = v),
      v,
      this._Name,
    );
  }

  //页码
  _PageIndex: number;
  @computed
  @Expose()
  get PageIndex(): number {
    if (this.Courseware && this.Courseware.Pages) {
      var index = this.Courseware.Pages.indexOf(this);
      if (index >= 0) {
        var pindex = index + 1;
        if (this._PageIndex != pindex) this._PageIndex = pindex;
      }
    }
    return this._PageIndex;
  }
  set PageIndex(v: number) {
    this._PageIndex = v;
  }

  //是否是从模板导入的页
  @Expose()
  @observable
  IsTemplated: boolean;

  //页面背景循环播放方式
  @observable
  private _CirculationMode: CirculationMode = CirculationMode.Static;
  @Expose()
  public get CirculationMode(): CirculationMode {
    return this._CirculationMode;
  }
  public set CirculationMode(v: CirculationMode) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'CirculationMode',
      () => (this._CirculationMode = v),
      v,
      this._CirculationMode,
    );
  }

  //背景循环速度
  @observable
  private _CirculationSpeed: number = 0;
  @Expose()
  public get CirculationSpeed(): number {
    return this._CirculationSpeed;
  }
  public set CirculationSpeed(v: number) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'CirculationSpeed',
      () => (this._CirculationSpeed = v),
      v,
      this._CirculationSpeed,
    );
  }

  // 是否自动播放提示音
  @observable
  private _HasAutoPrompt: boolean = false;
  @Expose()
  public get HasAutoPrompt(): boolean {
    return this._HasAutoPrompt;
  }
  public set HasAutoPrompt(v: boolean) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'HasAutoPrompt',
      () => (this._HasAutoPrompt = v),
      v,
      this._HasAutoPrompt,
    );
  }

  //背景图片ID
  private _BgImgId: string;
  @Expose()
  public get BgImgId() {
    if (this.BgImgRes) return this.BgImgRes.resourceId;
    return this._BgImgId;
  }
  public set BgImgId(v: string) {
    this._BgImgId = v;
  }

  @observable
  private _BgImgRes: CWResource = null;
  public get BgImgRes(): CWResource {
    return this._BgImgRes;
  }
  public set BgImgRes(v: CWResource) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'BgImgRes',
      () => (this._BgImgRes = v),
      v,
      this._BgImgRes,
    );
  }

  @observable
  private _BgAudioId: string;
  @Expose()
  public get BgAudioId(): string {
    if (this.BgAudio) return this.BgAudio.resourceId;
    return this._BgAudioId;
  }
  public set BgAudioId(v: string) {
    this._BgAudioId = v;
  }

  @observable
  private _BgAudioVolume: number = 100;
  @Expose()
  public get BgAudioVolume(): number {
    return this._BgAudioVolume;
  }
  public set BgAudioVolume(v: number) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'BgAudioVolume',
      () => (this._BgAudioVolume = v),
      v,
      this._BgAudioVolume,
    );
  }

  @observable
  private _BgAudio: CWResource = null;
  public get BgAudio(): CWResource {
    return this._BgAudio;
  }
  public set BgAudio(v: CWResource) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'BgAudio',
      () => (this._BgAudio = v),
      v,
      this._BgAudio,
    );
  }

  // 是否有新视频控件，用来判断是否添加字幕
  @observable
  private _HasNewVideoPlayerComplex: boolean = false;
  public get HasNewVideoPlayerComplex(): boolean {
    return this._HasNewVideoPlayerComplex;
  }
  public set HasNewVideoPlayerComplex(v: boolean) {
    this._HasNewVideoPlayerComplex = v;
  }

  @observable
  protected ChangeElements = reaction(
    () => this.Elements?.filter(p => p.ElementType == 1023),
    data => {
      if (data.length > 0) {
        this._HasNewVideoPlayerComplex = true;
      } else {
        this._HasNewVideoPlayerComplex = false;
      }
    },
  );

  //背景音是否循环
  @observable
  private _IsBgAudioRecycle: boolean = false;
  @Expose()
  public get IsBgAudioRecycle(): boolean {
    return this._IsBgAudioRecycle;
  }
  public set IsBgAudioRecycle(v: boolean) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'IsBgAudioRecycle',
      () => (this._IsBgAudioRecycle = v),
      v,
      this._IsBgAudioRecycle,
    );
  }

  //页面全屏视频ID
  private _FSVideoId: string;
  @Expose()
  public get FSVideoId(): string {
    if (this.FullScreenVideo) return this.FullScreenVideo.resourceId;
    return this._FSVideoId;
  }
  public set FSVideoId(v: string) {
    this._FSVideoId = v;
  }

  @observable
  private _FullScreenVideo: CWResource = null;
  public get FullScreenVideo(): CWResource {
    return this._FullScreenVideo;
  }
  public set FullScreenVideo(v: CWResource) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'FullScreenVideo',
      () => (this._FullScreenVideo = v),
      v,
      this._FullScreenVideo,
    );
  }

  @observable
  private _CaptionsDetail: PageCaptionsViewModel[];
  public get CaptionsDetail(): PageCaptionsViewModel[] {
    return this._CaptionsDetail;
  }
  public set CaptionsDetail(v: PageCaptionsViewModel[]) {
    var cwprofile = CWPage.stores.courseware.Profile as Courseware;
    this._CaptionsDetail = [];
    if (cwprofile != null && cwprofile.subTitlesStr) {
      var langs = cwprofile.subTitlesStr.split(',');
      if (langs.length > 0) {
        var langCodeList = CacheHelper.LanguageCodeList;
        var langsValueNames = langCodeList?.filter(x =>
          langs.includes(x.configKey),
        );
        if (langsValueNames && langsValueNames.length > 0) {
          for (var langVN of langsValueNames) {
            var exsit = v?.find(x => x.Lang.configKey == langVN.configKey);
            this._CaptionsDetail.push(
              Object.assign(new PageCaptionsViewModel(), {
                Lang: langVN,
                Page: this,
                Captions: exsit?.Captions,
              }),
            );
          }
        }
      }
    }
  }

  private _Captions: Map<string, string>;
  @Expose()
  @Type(() => Map)
  public get Captions() {
    if (this._CaptionsDetail == null || this._CaptionsDetail.length == 0)
      return this._Captions;
    else {
      var captions = new Map<string, string>();
      this.CaptionsDetail?.forEach(x => {
        var lang = x.Lang.configKey;
        var resId = x.Captions?.ResourceId;
        if (lang && !captions.has(lang) && resId) captions.set(lang, resId);
      });
      if (captions.size > 0) return captions;
      return undefined;
    }
  }
  public set Captions(v: Map<string, string>) {
    this._Captions = v;
  }

  @observable
  @Type(() => CWElement)
  @Expose()
  Elements: Array<CWElement> = [];

  private _oldEles: CWElement[] = [];
  protected elementsChanged = reaction(
    () => {
      var oldItems = this._oldEles.filter(x => !this.Elements.includes(x));
      var newItems = this.Elements.filter(x => !this._oldEles.includes(x));
      this._oldEles = [...this.Elements];
      return { oldItems, newItems };
    },
    ({ oldItems, newItems }) => {
      oldItems?.forEach(x => {
        x.Scene = null;
        x.Father = null;
      });
      newItems?.forEach(x => {
        x.Scene = this;
        x.Father = this.Father;
      });
    },
    { fireImmediately: true },
  );

  //是否关闭视频
  @observable
  private _IsClosedVideo: boolean = false;
  @Expose()
  public get IsClosedVideo(): boolean {
    return this._IsClosedVideo;
  }
  public set IsClosedVideo(v: boolean) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'IsClosedVideo',
      () => (this._IsClosedVideo = v),
      v,
      this._IsClosedVideo,
    );
  }

  //过场动画
  @observable
  private _OpAnimationType: OpAnimationType = OpAnimationType.Default;
  @Expose()
  public get OpAnimationType(): OpAnimationType {
    return this._OpAnimationType;
  }
  public set OpAnimationType(v: OpAnimationType) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'OpAnimationType',
      () => (this._OpAnimationType = v),
      v,
      this._OpAnimationType,
    );
  }

  //播放旋律
  @observable
  private _HasOpAnimationAudio: boolean = false;
  @Expose()
  public get HasOpAnimationAudio(): boolean {
    return this._HasOpAnimationAudio;
  }
  public set HasOpAnimationAudio(v: boolean) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'HasOpAnimationAudio',
      () => (this._HasOpAnimationAudio = v),
      v,
      this._HasOpAnimationAudio,
    );
  }

  //装饰器下标类型
  @observable
  private _AdornerMode: AdornerMode = AdornerMode.GenerationOrder;
  @Expose()
  public get AdornerMode(): AdornerMode {
    return this._AdornerMode;
  }
  public set AdornerMode(v: AdornerMode) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'AdornerMode',
      () => (this._AdornerMode = v),
      v,
      this._AdornerMode,
    );
  }

  @observable
  private _AdornerIndex: number = 0;
  @Expose()
  public get AdornerIndex(): number {
    return this._AdornerIndex;
  }
  public set AdornerIndex(v: number) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'AdornerIndex',
      () => (this._AdornerIndex = v),
      v,
      this._AdornerIndex,
    );
  }

  //作答用时
  @observable
  private _QuizTime: number = 0;
  @Expose()
  public get QuizTime(): number {
    return this._QuizTime;
  }
  public set QuizTime(v: number) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'QuizTime',
      () => (this._QuizTime = v),
      v,
      this._QuizTime,
    );
  }

  @observable
  private _PageType: number = 0;
  @Expose()
  public get PageType(): number {
    return this._PageType;
  }
  public set PageType(v: number) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'PageType',
      () => (this._PageType = v),
      v,
      this._PageType,
    );
  }

  //是否初始化1.0
  @observable
  private _IsOldInit: boolean = false;
  @Expose()
  public get IsOldInit(): boolean {
    return this._IsOldInit;
  }
  public set IsOldInit(v: boolean) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'IsOldInit',
      () => (this._IsOldInit = v),
      v,
      this._IsOldInit,
    );
  }

  //1.0倒计时长。不用展示，默认值给0，有值读取
  @observable
  private _Timer: number = 0;
  @Expose()
  public get Timer(): number {
    return this._Timer;
  }
  public set Timer(v: number) {
    this._Timer = v;
  }

  //#endregion

  //#region   父级信息

  private _Father: CombinedEditItem = null;
  public get Father(): CombinedEditItem {
    return this._Father;
  }
  public set Father(v: CombinedEditItem) {
    this._Father = v;
  }

  @Exclude()
  private _Courseware: CWSubstance;
  @Exclude()
  public get Courseware(): CWSubstance {
    return this._Courseware;
  }
  public set Courseware(v: CWSubstance) {
    this._Courseware = v;
    if (this.Version == null) {
      if (this.Courseware.Profile.extendInfo?.version) {
        this.Version = Number(this.Courseware.Profile.extendInfo.version);
      } else {
        this.Version = 0;
      }
    }
  }

  //#endregion

  /**
   * 页面是否被选中
   */
  @observable
  private _isSelected: boolean = false;
  public get IsSelected(): boolean {
    return this._isSelected;
  }
  public set IsSelected(v: boolean) {
    if (this._isSelected != v) {
      this._isSelected = v;
      this.HasSelectionChangedBeforeRecord = true;

      if (!this.IsSelected) {
        this.DeselectAll();
        this.LogicDesign.SelectedLogicDItems?.forEach(
          x => (x.IsSelectedInDesign = false),
        );
      } else {
        this.LogicDesign.Scale = 1.0;
        this.LogicDesign.ImportDataFromScene();
      }
    }
  }

  HasSelectionChangedBeforeRecord: boolean = false;

  //是否因为是模板而锁定
  public get IsTemplateLockEnable(): boolean {
    return this.IsTemplated && !this.Courseware?.IsTemplateCW;
  }

  //#region   元素相关属性

  public get TotalEditItemList(): CWElement[] {
    var result: CWElement[] = [];
    this.Elements?.forEach(element => {
      result = [...result, element];
      if (element instanceof CombinedEditItem) {
        result = [...result, ...element.TotalSubItemList];
      }
    });
    return result;
  }

  //#region 元素的选中
  @observable
  private _selectedItems: CWElement[] = [];
  public get SelectedItems(): CWElement[] {
    return this._selectedItems;
  }
  private itemSelectedChanged = reaction(
    () => this.TotalEditItemList.map(item => item.IsSelected),
    isSelected => {
      this.RefreshSelectedItems();
    },
    { fireImmediately: false },
  );

  @action
  RefreshSelectedItems(): void {
    var totalItems = this.TotalEditItemList;
    var selectChangesItems = totalItems.filter(
      x => x.HasSelectionChangedBeforeRecord,
    );
    var itemsDeleted = this._selectedItems
      ? ArrayHelper.except(this._selectedItems, totalItems)
      : [];
    if (
      this._selectedItems == null ||
      selectChangesItems.length > 0 ||
      (itemsDeleted != null && itemsDeleted.length > 0)
    ) {
      if (this._selectedItems == null) this._selectedItems = [];
      this._selectedItems = ArrayHelper.intersect(
        this._selectedItems,
        totalItems,
      );
      var new_selectedItems = selectChangesItems.filter(x => x.IsSelected);
      var new_unselectedItems = selectChangesItems.filter(x => !x.IsSelected);
      this._selectedItems = ArrayHelper.except(
        this._selectedItems,
        new_unselectedItems,
      );
      if (new_selectedItems.length > 0) {
        this._selectedItems = [
          ...this._selectedItems,
          ...ArrayHelper.except(new_selectedItems, this._selectedItems),
        ];
      }
      if (this.Father == null)
        //所有选中状态报告完毕时清除FLAG
        selectChangesItems?.forEach(selectChangesItem => {
          selectChangesItem.HasSelectionChangedBeforeRecord = false;
        });
    }
  }

  public get SelectedItem(): CWElement {
    var selectItems = this.SelectedItems;
    if (selectItems.length == 1) {
      return selectItems[0];
    } else {
      return null;
    }
  }

  public set SelectedItem(v: CWElement) {
    var selectedItem = v;
    this.DeselectAll();
    if (v != null && !v.IsSelected) {
      selectedItem.IsSelected = true;
    }
  }

  @action
  public DeselectAll(): void {
    this.SelectedItems?.forEach(item => {
      item.IsSelected = false;
      item.HasSelectionChangedBeforeRecord = true;
    });
  }

  //#endregion

  //#region 选中元素状态统计
  public get HasSelectedItemLocked(): boolean {
    return this.SelectedItems.filter(x => x.IsLocked).length != 0;
  }

  public get HasSelectedItemUnlocked(): boolean {
    return this.SelectedItems.filter(x => !x.IsLocked).length != 0;
  }

  public get HasSelectedItemUnhided(): boolean {
    return this.SelectedItems.filter(x => !x.IsDesignHide).length != 0;
  }

  public get HasSelectedItemHided(): boolean {
    return this.SelectedItems.filter(x => x.IsDesignHide).length != 0;
  }

  public get HasSelectedItemSolidified(): boolean {
    return (
      this.SelectedItems.filter(x => x instanceof CombinedEditItem).filter(
        x => x.IsSolidified,
      ).length != 0
    );
  }

  public get HasSelectedItemNotSolidified(): boolean {
    return (
      this.SelectedItems.filter(x => x instanceof CombinedEditItem).filter(
        x => !x.IsSolidified,
      ).length != 0
    );
  }

  public get HasSelectedItemPageTemplateLocked(): boolean {
    return this.SelectedItems.find(x => x.IsPageTemplateLocked) != null;
  }

  public get HasSelectedItemPageTemplateUnLocked(): boolean {
    return this.SelectedItems.find(x => !x.IsPageTemplateLocked) != null;
  }
  //#endregion

  //#endregion

  //#region 可执行组件

  @observable
  private _Invokables: InvokableBase[] = [];

  public get Invokables() {
    return this._Invokables;
  }

  public set Invokables(v: InvokableBase[]) {
    var invTrees: InvokableBase[] = [];
    this._Invokables = invTrees;
    for (var invokableItem of v) {
      invokableItem.Scene = this;
      if (invokableItem.SetFatherId == null)
        this.Invokables.push(invokableItem);
      else {
        var father = ArrayHelper.lastOrDefault(
          this.TotalInvItems,
          x => x.Id == invokableItem.SetFatherId,
        );
        if (father != null) {
          father.SubItems?.push(invokableItem);
          invokableItem.FatherItem = father;
        }
      }
    }
  }

  private _oldInvs: InvokableBase[] = [];
  protected invsChanged = reaction(
    () => {
      var oldItems = ArrayHelper.except(this._oldInvs, this.Invokables);
      var newItems = ArrayHelper.except(this.Invokables, this._oldInvs);
      this._oldInvs = [...this.Invokables];
      return { oldItems, newItems };
    },
    ({ oldItems, newItems }) => {
      newItems?.forEach(newItem => {
        newItem.Scene = this;
        if (
          this.LogicDesign != null &&
          this.LogicDesign.LogicDItems != null &&
          !this.LogicDesign.LogicDItems.includes(newItem)
        ) {
          this.LogicDesign.LogicDItems.push(newItem);
        }
      });
      oldItems?.forEach(oldItem => {
        if (
          this.LogicDesign != null &&
          this.LogicDesign.LogicDItems != null &&
          this.LogicDesign.LogicDItems.includes(oldItem)
        ) {
          this.LogicDesign.LogicDItems.splice(
            this.LogicDesign.LogicDItems.indexOf(oldItem),
            1,
          );
        }
        oldItem.Scene = null;
      });
    },
    { fireImmediately: true },
  );

  @Expose({ name: 'Invokables' })
  @Type(() => InvokableBase)
  public get InvokablesExpose(): Array<InvokableBase> {
    return this.TotalInvItems;
  }

  public set InvokablesExpose(v: InvokableBase[]) {
    this.Invokables = v;
  }

  get TotalInvItems(): InvokableBase[] {
    var result: InvokableBase[] = [];
    for (var item of this.Invokables) {
      result.push(item);
      if (item instanceof InvokableGroup) {
        result.push(...item.TotalInvItems);
      }
    }
    return result;
  }
  private _selectedInvs: InvokableBase[] = null;

  public get SelectedInvs(): InvokableBase[] {
    var totalItems = this.TotalInvItems;
    var selectChangesItems = totalItems.filter(
      x => x.HasSelectionChangedBeforeRecord,
    );
    var itemsDeleted = ArrayHelper.except(this._selectedInvs, totalItems);
    if (
      this._selectedInvs == null ||
      selectChangesItems.length > 0 ||
      (itemsDeleted != null && itemsDeleted.length > 0)
    ) {
      if (this._selectedInvs == null) this._selectedInvs = [];
      this._selectedInvs = ArrayHelper.intersect(
        this._selectedInvs,
        totalItems,
      );
      var new_selectedItems = selectChangesItems.filter(x => x.IsSelected);
      var new_unselectedItems = selectChangesItems.filter(x => !x.IsSelected);
      this._selectedInvs = ArrayHelper.except(
        this._selectedInvs,
        new_unselectedItems,
      );
      if (new_selectedItems.length > 0) {
        this._selectedInvs.push(
          ...ArrayHelper.except(new_selectedItems, this._selectedInvs),
        );
      }
      for (var selectChangesItem of selectChangesItems) {
        selectChangesItem.HasSelectionChangedBeforeRecord = false;
      }
    }
    return this._selectedInvs;
  }

  private _LogicDesign: LogicDesign;
  public get LogicDesign(): LogicDesign {
    if (this._LogicDesign == null) {
      this._LogicDesign = new LogicDesign();
      this._LogicDesign.Scene = this;
    }
    return this._LogicDesign;
  }
  public set LogicDesign(v: LogicDesign) {
    var oldLd = this._LogicDesign;
    if (oldLd != null) oldLd.Scene = null;
    this._LogicDesign = v;
    if (this._LogicDesign != null) this._LogicDesign.Scene = this;
  }

  //#endregion

  //#region 渲染计算

  //内容真正的大小
  @computed
  public get ContentRect(): Rect2D {
    var stageRect = new Rect2D(
      0,
      0,
      this.Courseware.StageSize.x,
      this.Courseware.StageSize.y,
    );
    var itemrects = this.Elements?.map(item =>
      item.AbsoluteMatrix.TransformRect(
        new Rect2D(0, 0, item.Width, item.Height),
      ),
    );
    var itemsRect = Rect2D.union(...itemrects);
    return Rect2D.union(itemsRect, stageRect);
  }

  // 题目属性控件下标处理
  @observable
  protected ElementsChanged = reaction(
    () => this.Elements?.filter(p => p.ElementType == 1024),
    Elements => {
      var i = 1;
      Elements?.forEach(p => {
        p.questionIndex = i++;
      });
    },
    { fireImmediately: true },
  );

  //#endregion

  //#region 初始化子项
  /*
  初始化详情元素内容
  reslib:课件元素对象集合
  */
  public InitDetailsContent(reslib: CWResource[]) {
    this.Elements?.forEach(x => {
      x.Scene = this;
      x.Father = this.Father;
    });
    this.LogicDesign = new LogicDesign();
    if (!reslib) return;
    this.BgImgRes = reslib.find(x => x.resourceId == this.BgImgId);
    this.BgAudio = reslib.find(x => x.resourceId == this.BgAudioId);
    this.FullScreenVideo = reslib.find(x => x.resourceId == this.FSVideoId);

    var captions = this._Captions;
    var inputCaptions: PageCaptionsViewModel[] = [];
    if (captions != null) {
      var keys = Array.from(captions.keys());
      for (var k of keys) {
        var v = captions.get(k);
        var lang = k;
        var captionres = reslib?.find(res => res.resourceId == v);
        if (lang && captionres != null) {
          inputCaptions.push(
            Object.assign(new PageCaptionsViewModel(), {
              Lang: { configKey: lang },
              Captions: new ResourceRef(captionres),
            }),
          );
        }
      }
    }
    this.CaptionsDetail = inputCaptions; //在这里赋值保证字幕附加器的数量是正确的

    this.Elements?.forEach(element => {
      element.SetResourcesFromLib(reslib);
    });
    this.Invokables?.forEach(inv => inv.SearchRes(reslib));
  }

  public GetDependencyResources(): CWResource[] {
    var result: CWResource[] = [];
    if (this.BgImgRes != null && this.BgImgRes.resourceId != null)
      result.push(this.BgImgRes);
    if (this.BgAudio != null && this.BgAudio.resourceId != null)
      result.push(this.BgAudio);
    if (this.FullScreenVideo != null && this.FullScreenVideo.resourceId != null)
      result.push(this.FullScreenVideo);

    this.CaptionsDetail?.forEach(x => {
      var captions = x?.Captions?.Resource;
      if (captions != null && captions.resourceId) result.push(captions);
    });

    this.TotalInvItems?.forEach(x => {
      var subres = x.GetDependencyResources();
      if (subres != null && subres.length > 0) result.push(...subres);
    });

    this.Elements?.forEach(x => {
      var itemResLib = x.GetDependencyResources();
      if (itemResLib != null) result.push(...itemResLib);
    });
    return result;
  }

  public GetDependencyFonts(): string[] {
    var result: string[] = [];
    this.Elements.forEach(x => {
      var itemFontLib = x.GetDependencyFonts();
      if (itemFontLib != null) result.push(...itemFontLib);
    });

    return result;
  }

  public PasteItems(
    editItems: CWElement[],
    renameAddition: string,
    deltaMove: Vector2D,
  ): CWElement[] {
    if (editItems == null || editItems.length == 0) return null;

    var newItems: CWElement[] = [];
    this.DeselectAll();
    if (deltaMove == null) {
      var firstItem = editItems?.[0] || null;
      deltaMove = Vector2D.Zero;
      if (firstItem != null) {
        var newPos = this.FindPastePosition(
          new Point2D(firstItem.AbsoluteLeft, firstItem.AbsoluteTop),
          new Vector2D(firstItem.Width, firstItem.Height),
        );
        deltaMove = newPos.minus(new Point2D(firstItem.X, firstItem.Y));
      }
    }
    var idChanges = new Map<string, string>();
    var newPositions = editItems.map(x =>
      deltaMove.translatePoint(x.AbsolutePosition),
    );
    var i = 0;
    var nameCheckedEitems: CWElement[] = [];
    newItems = editItems.map(x => x.SafeDeepClone(false));
    var totalEditItems = CWElement.GetAllItemsWithSub(newItems);
    for (var eitem of totalEditItems) {
      var oldId = eitem.Id;
      var newId = IdHelper.NewId();
      idChanges.set(oldId, newId);
      eitem.Id = newId;
      if (newItems.includes(eitem)) {
        eitem.AbsolutePosition = newPositions[i];
        i++;
      }
      if (
        renameAddition == null ||
        renameAddition == '' ||
        eitem.Name.includes(renameAddition)
      )
        eitem.Name = CWElement.NewItemStringName(
          eitem.Name,
          this,
          nameCheckedEitems,
        );
      else
        eitem.Name = CWElement.NewItemStringName(
          `${eitem.Name}${renameAddition}`,
          this,
          nameCheckedEitems,
        );
      nameCheckedEitems.push(eitem);
      //清除所有使用的Trigger
      eitem.TotalTriggers.forEach(x => {
        x.IsEnabled = false; //需要在未添加时处理，要不然undo时会回来
        x.Position = new Point2D(0, 0);
        x.InvokeHandlers.forEach(h => h.ClearTargetId());
      });
    }

    for (var newItem of newItems) {
      newItem.ReplaceRelativeIds(idChanges);
    }

    RUHelper.Core.CreateTransaction();
    i = 0;
    for (var newItem of newItems) {
      RUHelper.AddItem(this.Elements, newItem);
      newItem.AbsolutePosition = newPositions[i];
      newItem.AbsoluteAngle = editItems[i].AbsoluteAngle;
      RUHelper.SetProperty(newItem, 'IsSelected', true, false);
      i++;
    }
    RUHelper.Core.CommitTransaction();

    return newItems;
  }

  public ImportElementsBox(
    elementsBox: ElementsCopyBox,
    renameAddition: string = '',
    deltaMove: Vector2D = null,
  ) {
    var tempModel = elementsBox;
    //   ObjHelper.DeepClone(
    //   elementsBox,
    //   TypeMapHelper.CommonTypeMap,
    // );
    var editItems = tempModel.Elements;
    editItems.forEach(x => x.SetResourcesFromLib(tempModel.ResLib));
    var totalEditItems = CWElement.GetAllItemsWithSub(editItems);
    var invItems = ObjHelper.DeepClone(
      tempModel.Invokables,
      TypeMapHelper.CommonTypeMap,
    );
    for (var _invItem of invItems) {
      var fatherId = _invItem.SetFatherId;
      var father = invItems.find(x => x.Id == fatherId);
      if (father) {
        father.SubItems.push(_invItem);
        _invItem.FatherItem = father;
      }
    }

    var totalInvs = [...invItems];
    invItems = invItems.filter(x => x.FatherItem == null);

    invItems?.forEach(x => x.SearchRes(tempModel.ResLib || []));
    var idChanges = new Map<string, string>();
    var enabledTriggers: InvokeTriggerBase[] = []; //触发器列表
    if (deltaMove == null) {
      var firstItem = editItems?.[0] || null;
      deltaMove = Vector2D.Zero;
      if (firstItem != null) {
        var newPos = this.FindPastePosition(
          new Point2D(firstItem.AbsoluteLeft, firstItem.AbsoluteTop),
          new Vector2D(firstItem.Width, firstItem.Height),
        );
        deltaMove = newPos.minus(new Point2D(firstItem.X, firstItem.Y));
      }
    }

    var newPositions = editItems.map(x =>
      deltaMove.translatePoint(x.AbsolutePosition),
    );
    var i = 0;
    var nameCheckedEitems: CWElement[] = [];
    for (var eitem of totalEditItems) {
      var oldId = eitem.Id;
      var newId = IdHelper.NewId();
      idChanges.set(oldId, newId);
      eitem.Id = newId;
      if (editItems.includes(eitem)) {
        eitem.AbsolutePosition = newPositions[i];
        i++;
      }

      if (
        renameAddition == null ||
        renameAddition == '' ||
        eitem.Name.includes(renameAddition)
      )
        eitem.Name = CWElement.NewItemStringName(
          eitem.Name,
          this,
          nameCheckedEitems,
        );
      else
        eitem.Name = CWElement.NewItemStringName(
          `${eitem.Name}${renameAddition}`,
          this,
          nameCheckedEitems,
        );
      nameCheckedEitems.push(eitem);

      //复制触发器
      var triggers = eitem.TotalTriggers?.filter(x => x.IsEnabled);
      if (triggers != null) enabledTriggers.push(...triggers);
    }
    //复制触发器
    for (var invitem of totalInvs) {
      var oldId = invitem.Id;
      var newId = IdHelper.NewId();
      idChanges.set(oldId, newId);
      invitem.Id = newId;
    }
    //置换原来的ID
    totalEditItems?.forEach(x => x.ReplaceRelativeIds(idChanges));
    var logicItemsToAdd: ILogicDesignItem[] = [];
    logicItemsToAdd.push(...enabledTriggers);
    logicItemsToAdd.push(...invItems);

    //置换原来的ID(触发器已经置换过了，不能多次置换)
    invItems?.forEach(x => x.ReplaceRelativeIds(idChanges));

    //摆放复制的逻辑组件的位置
    var exist_maxY =
      this.LogicDesign.LogicDItems.length == 0
        ? 0
        : Math.max(...this.LogicDesign.LogicDItems.map(x => x.Position.y)); //已存在组件的最大Y坐标
    if (logicItemsToAdd.length > 0) {
      var add_minY = Math.min(...logicItemsToAdd.map(x => x.Position.y));
      var add_minX = Math.min(...logicItemsToAdd.map(x => x.Position.x));
      var deltaPosVector = new Vector2D(
        -add_minX + 10,
        -add_minY + exist_maxY + 200,
      );
      logicItemsToAdd.forEach(
        x => (x.Position = deltaPosVector.translatePoint(x.Position)),
      );
    }

    this.DeselectAll();

    RUHelper.Core.CreateTransaction();
    for (var eitem of editItems) {
      RUHelper.AddItem(this.Elements, eitem);
      RUHelper.SetProperty(eitem, 'IsSelected', true, false);
    }

    for (var inv of invItems) {
      RUHelper.AddItem(this.Invokables, inv);
    }

    RUHelper.Core.CommitTransaction(() =>
      this.LogicDesign?.ImportDataFromScene(),
    );
  }

  private FindPastePosition(point: Point2D, size: Vector2D): Point2D {
    var exsitItem = this.TotalEditItemList.find(
      x =>
        x.AbsoluteLeft == point.x &&
        x.AbsoluteTop == point.y &&
        x.Width == size.x &&
        x.Height == size.y,
    );
    if (exsitItem != null)
      return this.FindPastePosition(
        new Point2D(point.x + 50, point.y + 50),
        size,
      );
    return point;
  }
  //#endregion

  //#region 复制
  public SafeClone(): CWPage {
    var newPage = ObjHelper.DeepClone(this, TypeMapHelper.CommonTypeMap);
    newPage.Id = IdHelper.NewId();

    newPage.InitDetailsContent(this.GetDependencyResources());
    return newPage;
  }
  //#endregion
}
