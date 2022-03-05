import IPropUndoable from '@/redoundo/IPropUndoable';
import CWPage from './cwpage';
import RUHelper from '@/redoundo/redoUndoHelper';
import { Expose, Transform, Type, Exclude } from '@/class-transformer';
import { observable, computed, reaction } from 'mobx';
import { Point2D, GeometryHelper } from '@/utils/Math2D';
import { from } from 'linq-to-typescript';
import CWResource from './cwResource';
import LogicDesign from './logicDesign';
import { ViewTemplate } from './toolbox/CustomTypeDefine';
import TypeMapHelper from '@/configs/typeMapHelper';
import IdHelper from '@/utils/idHelper';
import ILogicDesignItem from './InvokeDesign/logicViewModels/ILogicDesignItem';
import InvokeHandler, { InvokeHandlerList } from './InvokeDesign/InvokeHandler';
import {
  OutputDataPoint,
  DataPointInfo,
  DataSourceType,
  InputDataPoint,
} from './DataPoint';
import { ResourceRef, SkResRef } from './resRef/resourceRef';
import { CWResourceTypes } from './courseDetailenum';
import { message } from 'antd';
import UIHelper from '@/utils/uiHelper';
import { ClassType } from '@/class-transformer/ClassTransformer';
export default class InvokableBase implements IPropUndoable, ILogicDesignItem {
  public get CanRecordRedoUndo(): boolean {
    if (this.Scene == null) return false;
    if (this.Scene.Courseware == null) return false;
    if (this.Scene.Courseware.isLoading) return false;
    if (this.Scene != this.Scene.Courseware?.SelectedPage) return false;
    if (RUHelper.Core.ActionIsExecuting) return false;
    return true;
  }

  constructor() {
    this.Id = IdHelper.NewId();
    var typeMaps = TypeMapHelper.InvokableTypeDiscriminator.subTypes;
    var currentTypeMap = typeMaps.find(x => x.value == this.constructor);
    if (currentTypeMap != null) {
      this.Type = currentTypeMap.name;
      this.DisplayName = currentTypeMap.desc;
      this.GroupType = currentTypeMap.grouptype;
    }
  }

  static GenFromInvName(name: string): InvokableBase {
    var inv = null;
    var typeMaps = TypeMapHelper.InvokableTypeDiscriminator.subTypes;
    var typemap = typeMaps.find(x => x.name == name);
    if (typemap != null) {
      var c = typemap.value;
      if (c != null) {
        return new c();
      }
    }
    return inv;
  }

  //#region 从属关系
  @observable
  private _Scene: CWPage;
  public get Scene(): CWPage {
    if (this.FatherItem == null) return this._Scene;
    return this.FatherItem.Scene;
  }
  public set Scene(v: CWPage) {
    if (this.FatherItem == null) this._Scene = v;
  }

  public get LogicDesign(): LogicDesign {
    if (this.FatherItem != null && this.FatherItem.Role == 'Func')
      return (this.FatherItem as any).InnerLogicDesign;
    if (this.Scene != null) return this.Scene.LogicDesign;
    return null;
  }

  public get RootLogicDesign() {
    return this.Scene?.LogicDesign;
  }
  //#endregion

  // 获取当前页面元素
  @computed
  public get CurrentElements() {
    return this.Scene?.Elements;
  }

  //#region 基础属性

  private _Id: string;
  @Expose()
  public get Id(): string {
    return this._Id;
  }
  public set Id(v: string) {
    this._Id = v;
  }

  /**
   * 可执行组件类型
   */
  private _Type: string;
  @Expose()
  public get Type(): string {
    return this._Type;
  }
  public set Type(v: string) {
    this._Type = v;
  }

  private _DisplayName: string;
  public get DisplayName(): string {
    return this._DisplayName;
  }
  public set DisplayName(v: string) {
    this._DisplayName = v;
  }

  /** 按组筛选时使用 */
  private _GroupType: string;
  public get GroupType(): string {
    return this._GroupType;
  }
  public set GroupType(v: string) {
    this._GroupType = v;
  }

  /** 注释 */
  @observable
  private _Note: string;
  @Expose()
  public get Note(): string {
    return this._Note;
  }
  public set Note(v: string) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'Note',
      () => (this._Note = v),
      v,
      this._Note,
    );
  }

  //#endregion

  //#region 模板和UI相关

  private _SettingTemplate: ViewTemplate;
  public get SettingTemplate(): ViewTemplate {
    if (this.Scene != null)
      if (
        !this.Scene.IsTemplateLockEnable ||
        this.TemplateLockedSettingTemplate == null
      )
        return this._SettingTemplate;
      else return this.TemplateLockedSettingTemplate;
    else return this._SettingTemplate;
  }
  public set SettingTemplate(v: ViewTemplate) {
    this._SettingTemplate = v;
  }

  private _TemplateLockedSettingTemplate: ViewTemplate = undefined;
  public get TemplateLockedSettingTemplate(): ViewTemplate {
    return this._TemplateLockedSettingTemplate;
  }
  public set TemplateLockedSettingTemplate(v: ViewTemplate) {
    this._TemplateLockedSettingTemplate = v;
  }

  public get IsSettingReadOnly(): boolean {
    if (this.Scene != null) {
      if (!this.Scene.IsTemplateLockEnable) return false;
      else if (this.TemplateLockedSettingTemplate != null) return false;
    }
    return true;
  }

  //控制器的位置
  @observable
  private _Position: Point2D;
  @Expose()
  @Type(() => Point2D)
  @Transform(Point2D.ClassTransFn)
  public get Position(): Point2D {
    return this._Position;
  }
  public set Position(v: Point2D) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'Position',
      () => (this._Position = v),
      v,
      this._Position,
    );
  }

  //#endregion

  @observable
  protected _InvokeHandlers: InvokeHandler[] = null;
  get InvokeHandlers(): InvokeHandler[] {
    if (this._InvokeHandlers == null) {
      var list = InvokeHandler.CreateInvokeHandlers(this);
      this._InvokeHandlers = [];
      if (list != null) this._InvokeHandlers.push(...list);
    }
    return this._InvokeHandlers;
  }

  protected _OutputDataPoints: OutputDataPoint[] = null;

  get OutputDataPoints(): OutputDataPoint[] {
    if (this._OutputDataPoints == null) {
      this._OutputDataPoints = [];
      var outpDisplayNames = this.GetOutputParameters();
      var index = 0;
      var points = outpDisplayNames?.map(x =>
        Object.assign(
          new OutputDataPoint(
            Object.assign(new DataPointInfo(), {
              DataSourceId: this.Id,
              DataSourceType: DataSourceType.Invoke,
              DataIndex: index++,
            }),
          ),
          { Owner: this, DisplayName: x },
        ),
      );
      if (points != null) this._OutputDataPoints.push(...points);
    }
    return this._OutputDataPoints;
  }

  @observable
  private _InputDataInfos: DataPointInfo[] = null;
  @Expose()
  @Type(() => DataPointInfo)
  public get InputDataInfos(): DataPointInfo[] {
    var result = this.InputDataPoints?.map(x => x.FromInfo);
    if (result != null && result.length > 0) return result;
    return this._InputDataInfos;
  }
  public set InputDataInfos(v: DataPointInfo[]) {
    this._InputDataInfos = v;
    if (
      this._InputDataInfos != null &&
      this._InputDataInfos.length >= this.InputDataPoints.length
    ) {
      var i = 0;
      for (var idp of this.InputDataPoints) {
        idp.FromInfo = this._InputDataInfos[i++];
      }
    }
  }

  protected _InputDataPoints: InputDataPoint[] = null;
  get InputDataPoints(): InputDataPoint[] {
    if (this._InputDataPoints == null) {
      this._InputDataPoints = [];
      var inpDisplayNames = this.GetInputParameters();
      var points = inpDisplayNames?.map(x => {
        var splited = x.split(';');
        var displayname = splited[0];
        var disableCustom = false;
        var isMulti = false;
        if (splited.length > 1) {
          var splitedList = splited;
          splitedList.splice(0, 1);
          disableCustom = splitedList.includes('disableCustom');
          isMulti = splitedList.includes('isMulti');
        }
        var result = Object.assign(new InputDataPoint(), {
          Owner: this,
          DisplayName: displayname,
          DisableCustom: disableCustom,
          IsMulti: isMulti,
        });
        return result;
      });
      if (points != null) this._InputDataPoints.push(...points);
    }
    return this._InputDataPoints;
  }

  //#region 执行与调用相关属性

  public get SelfInvokable() {
    return false;
  }

  /// <summary>
  /// 是否可以被执行
  /// </summary>
  @observable
  private _CanInvoke: boolean = true;
  public get CanInvoke(): boolean {
    return this._CanInvoke;
  }
  public set CanInvoke(v: boolean) {
    this._CanInvoke = v;
  }

  public get CanBeCombined(): boolean {
    return true;
  }

  public get IsUnique() {
    return false;
  }

  @observable
  protected _InvId: string;
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

  //#endregion

  //#region 层级关系

  private _setfatherId: string;

  public get SetFatherId() {
    return this._setfatherId;
  }

  @Expose()
  public get FatherId(): string {
    if (this.FatherItem == null) {
      if (this.Scene == null) return this._setfatherId;
      return null;
    }
    return this.FatherItem.Id;
  }
  public set FatherId(v: string) {
    this._setfatherId = v;
  }

  @observable
  private _FatherItem: InvokableBase;
  public get FatherItem(): InvokableBase {
    return this._FatherItem;
  }
  public set FatherItem(v: InvokableBase) {
    this._FatherItem = v;
  }

  public get FatherList(): InvokableBase[] {
    if (this.FatherItem == null && this.Scene != null)
      return this.Scene.Invokables;
    else if (this.FatherItem != null) return this.FatherItem.SubItems;
    return null;
  }

  public get SubItems(): InvokableBase[] {
    return [];
  }
  public set SubItems(v) {}

  IsAncestorOf(item: InvokableBase): boolean {
    var _item = item;
    if (_item.FatherItem === this) return true;
    if (_item.FatherItem == null) return false;
    if (_item == this) return false;
    _item = _item.FatherItem;
    return this.IsAncestorOf(_item);
  }

  static ClearDescendants(_selectedItems: InvokableBase[]): InvokableBase[] {
    var result: InvokableBase[] = [];
    for (var item of _selectedItems) {
      //去除子项和祖先项一起被选中的情况
      if (_selectedItems.find(x => x.IsAncestorOf(item)) == null)
        result.push(item);
    }
    return result;
  }

  static GetAllInvsWithSub(_selectedItems: InvokableBase[]): InvokableBase[] {
    var result: InvokableBase[] = [];
    for (var item of _selectedItems) {
      //将将子项也加入进来
      result.push(item);
      var subItems = Reflect.get(item, 'SubItems');
      if (subItems != null && Array.isArray(subItems)) {
        var subs = InvokableBase.GetAllInvsWithSub(subItems);
        subs.forEach(sub => {
          if (!result.includes(sub)) result.push(sub);
        });
      }
    }
    return result;
  }
  //#endregion

  //#region 选中，展开等

  public HasSelectionChangedBeforeRecord: boolean = false;

  @observable
  private _IsSelected: boolean;
  public get IsSelected(): boolean {
    return this._IsSelected;
  }
  public set IsSelected(v: boolean) {
    var oldValue = this._IsSelected;
    if (oldValue != v) {
      this._IsSelected = v;
      this.HasSelectionChangedBeforeRecord = true;
      this.OnIsSelectedChanged();
    }
  }
  OnIsSelectedChanged() {}

  public get HasDescendantsSelected(): boolean {
    return (
      this.SubItems != null &&
      (this.SubItems || []).find(
        x => x.IsSelected || x.HasDescendantsSelected,
      ) != null
    );
  }

  public get HasAncestorSelected(): boolean {
    if (this.FatherItem == null) return false;
    else
      return this.FatherItem.IsSelected || this.FatherItem.HasAncestorSelected;
  }
  @computed
  public get Level(): number {
    if (this.FatherItem == null) return 0;
    else return this.FatherItem.Level + 1;
  }
  //#endregion

  //#region 逻辑可视化
  public readonly Role: string = 'Invokable';

  public static readonly IsMissionReceiver: boolean = false;
  public static readonly IsMissionHandler: boolean = false;

  public readonly HeaderBg: string = '#7F7F9F';
  public readonly HeaderFg: string = '#DFDFDF';
  public readonly DetailBg: string = '#BF9F9F';

  @observable
  protected _AccepterPosition: Point2D;
  @Exclude()
  public get AccepterPosition(): Point2D {
    return this._AccepterPosition;
  }
  public set AccepterPosition(v: Point2D) {
    if (
      this._AccepterPosition == null ||
      this._AccepterPosition.minus(v || Point2D.Zero).length > 2
    ) {
      this._AccepterPosition = v;
    }
  }

  @computed
  public get IsSelectedInDesign(): boolean {
    return this.IsSelected;
  }
  public set IsSelectedInDesign(v: boolean) {
    this.IsSelected = v;
  }

  //是否展示详情
  @observable
  private _IsShowDetail: boolean = true;
  @Expose()
  public get IsShowDetail(): boolean {
    return this.SettingTemplate != null && this._IsShowDetail;
  }
  public set IsShowDetail(v: boolean) {
    this._IsShowDetail = v;
  }

  // 控制逻辑组件折叠总开关
  protected changeShowDetail = reaction(
    () => this.Scene?.Courseware?.Commander?.LogicTemplteShow,
    data => {
      this.IsShowDetail = !data;
    },
  );

  //#endregion

  //#region 导入导出

  GetDependencyResources(): CWResource[] {
    return [];
  }

  SearchRes(reslib: CWResource[]) {}

  //#endregion

  //#region 资源替换过滤

  public CheckTemplatedImgSkResRefReplace(
    oldResRef: ResourceRef,
    newResRef: ResourceRef,
  ): ResourceRef {
    var outPutResRef = newResRef;
    if (
      this.CanRecordRedoUndo &&
      this.Scene.IsTemplateLockEnable &&
      oldResRef != null
    ) {
      if (newResRef == null) {
        message.error('模板相关资源不能被删除');
        return oldResRef;
      } else if (oldResRef.ResourceType != newResRef.ResourceType) {
        message.error('模板替换资源必须要和原资源类型相同');
        return oldResRef;
      } else if (newResRef.ResourceType == CWResourceTypes.SkeletalAni) {
        var targetActions = newResRef.Resource.boneList?.map(x => x.value);
        var originActions = oldResRef.Resource.boneList?.map(x => x.value);
        if (
          targetActions == null ||
          originActions == null ||
          from(originActions)
            .except(from(targetActions))
            .count() > 0
        ) {
          message.error('模板替换骨骼动画必须要保证和原本动作列表相同');
          return oldResRef;
        } else {
          var skRef = oldResRef as SkResRef;
          if (skRef != null)
            outPutResRef = new SkResRef(
              newResRef.Resource,
              skRef.Action,
              skRef.PlayTimes,
            );
        }
      }
    }

    return outPutResRef;
  }

  public CheckTemplatedAudioVideoResRefReplace(
    oldResRef: ResourceRef,
    newResRef: ResourceRef,
  ): ResourceRef {
    var outPutResRef = newResRef;
    if (
      this.CanRecordRedoUndo &&
      this.Scene.IsTemplateLockEnable &&
      oldResRef != null
    ) {
      if (newResRef == null) {
        message.error('模板资源不能被删除');
        return oldResRef;
      } else if (oldResRef.ResourceType != newResRef.ResourceType) {
        message.error('模板替换资源必须要和原资源类型相同');
        return oldResRef;
      }
    }

    return outPutResRef;
  }

  //#endregion

  //#region 调用与引用关系

  HasReference(id: string): boolean {
    return false;
  }

  CheckCanInvoke(target: InvokableBase): boolean {
    if (target == this && !this.SelfInvokable) return false;
    if (
      this.LogicDesign != null &&
      target.LogicDesign != null &&
      !this.LogicDesign.AvailableLinkTargets.includes(target)
    )
      return false;
    return true;
  }

  CheckCanBeInvoked(invoker: any): boolean {
    if (!this.CanInvoke || (invoker == this && !this.SelfInvokable))
      return false;
    return true;
  }

  GetDirectlyInvs(): InvokableBase[] {
    var result: InvokableBase[] = [];
    //寻找所有被当前连接的
    var accepterLists = this.GetAllLinkableInvokeHandlers().map(x =>
      x.GetRelativedLinks().map(y => y.GetEndAccepter()),
    );
    for (var accepterList of accepterLists) {
      if (accepterList != null && accepterList.length > 0) {
        result.push(...accepterList);
      }
    }

    //寻找单纯数据连接
    var dataRelitavedInvs = this.InputDataPoints?.filter(
      x =>
        x.FromInfo != null &&
        x.FromInfo.DataSourceType == DataSourceType.Invoke &&
        x.From != null,
    )
      .map(x => x.From.Owner as InvokableBase)
      .filter(
        x =>
          x != null &&
          !x.CanInvoke &&
          (x.InvokeHandlers == null || x.InvokeHandlers.length == 0),
      );
    if (dataRelitavedInvs != null) {
      result.push(...dataRelitavedInvs);
    }

    //剔除Group内部的Inv 将Group本身加入
    var innerInvs = result.filter(x => x.FatherItem != this.FatherItem);
    result = from(result)
      .except(innerInvs)
      .toArray();
    var invGrp = innerInvs
      .map(x => x.FatherItem)
      .filter(x => x != null)
      .filter(x => x.FatherItem == this.FatherItem);
    result.push(...invGrp);
    result = from(result)
      .distinct()
      .toArray();

    return result;
  }

  GetInvokesFrom(): InvokableBase[] {
    return this.LogicDesign.SubInvs.filter(x =>
      x.GetDirectlyInvs().includes(this),
    );
  }

  public GetAllLinkableInvokeHandlers(): InvokeHandler[] {
    var result: InvokeHandler[] = [];
    if (this.InvokeHandlers != null) {
      var listInvHandlers = this.InvokeHandlers?.filter(
        x => x.InvokerInfo.IsList && x instanceof InvokeHandlerList,
      );
      var aloneInvHandlers = from(this.InvokeHandlers)?.except(listInvHandlers);
      result.push(...aloneInvHandlers);
      for (var listInvHandler of listInvHandlers)
        result.push(...(listInvHandler as InvokeHandlerList).SubHandlers);
    }
    return result;
  }

  GetAllTargetsInInvokeTree(foundedInvs?: InvokableBase[]): InvokableBase[] {
    var result = this.GetDirectlyInvs();

    if (foundedInvs == null) foundedInvs = [];
    result = from(result)
      .except(foundedInvs)
      .toArray();
    foundedInvs.push(...result);
    foundedInvs = from(foundedInvs)
      .distinct()
      .toArray();

    var grandsons: InvokableBase[] = [];
    for (var newFindInv of result) {
      grandsons.push(...newFindInv.GetAllTargetsInInvokeTree(foundedInvs));
    }
    result.push(...grandsons);
    result = from(result)
      .distinct()
      .toArray();
    return result;
  }

  //#endregion
  //#region 被连线
  RefreshHandlerPosition(accepterIcon: HTMLElement) {
    if (
      this.LogicDesign != null &&
      this.LogicDesign.Scene != null &&
      this.LogicDesign.Scene.Courseware != null &&
      this.LogicDesign.Scene == this.LogicDesign.Scene.Courseware.SelectedPage
    ) {
      if (accepterIcon != null) {
        var canvas = UIHelper.FindAncestorByClassName(accepterIcon, 'lgCanvas');
        if (canvas != null) {
          var handlerRect = accepterIcon.getBoundingClientRect();
          var handlerClientPoint = new Point2D(
            handlerRect.x,
            handlerRect.y + handlerRect.height / 2,
          );
          this.AccepterPosition = GeometryHelper.GetPosition(
            canvas,
            handlerClientPoint,
          );
        }
      }
    }
  }

  public getClientRect(el: HTMLElement) {
    this.baseRect = el.getBoundingClientRect();
  }

  @observable
  private _baseRect: DOMRect;

  public get baseRect(): DOMRect {
    return this._baseRect;
  }

  public set baseRect(v: DOMRect) {
    this._baseRect = v;
  }

  onHandlerDragOver(e: React.DragEvent<HTMLElement>) {
    var invHandler = InvokeHandler.DraggingHandler;
    e.dataTransfer.dropEffect = 'copy';

    var candrop = false;
    if (invHandler != null) {
      candrop =
        invHandler.CheckIfCanLink(this.constructor as ClassType<any>) &&
        this.CheckCanBeInvoked(invHandler.Owner) &&
        invHandler.Owner.CheckCanInvoke(this);
    }

    // 禁止触发器连接语音消息接收器
    if (
      invHandler &&
      invHandler.Owner.Role === 'Trigger' &&
      this.Type === 'ReceiveSpeechMessage'
    ) {
      candrop = false;
    }

    if (candrop) {
      e.preventDefault();
    }
  }

  onHandlerDrop(e: React.DragEvent<HTMLElement>) {
    var invHandler = InvokeHandler.DraggingHandler;
    var candrop = false;
    if (invHandler != null) {
      candrop =
        invHandler.CheckIfCanLink(this.constructor as ClassType<any>) &&
        this.CheckCanBeInvoked(invHandler.Owner) &&
        invHandler.Owner.CheckCanInvoke(this);
    }
    var handlersTogether: InvokeHandler[] = [];
    if (candrop) {
      RUHelper.Core.CreateTransaction();
      invHandler.AddTargetId(this.Id);
      if (invHandler.Owner.IsSelectedInDesign && e.shiftKey) {
        handlersTogether = invHandler.VisualLogicDesign.SelectedLogicDItems
          //  .Where(x => x.GetType() == invHandler.Owner.GetType())//保证类型相同
          .map(x =>
            x
              .GetAllLinkableInvokeHandlers()
              ?.find(h => h.InvokerProperty == invHandler.InvokerProperty),
          )
          ?.filter(x => x != null && x != invHandler);
        handlersTogether?.forEach(x => x.AddTargetId(this.Id));
      }
      RUHelper.Core.CommitTransaction(() =>
        handlersTogether.forEach(x => x.RefreshLinks()),
      );
    }
    InvokeHandler.DraggingHandler = null;
  }

  //#endregion

  ReplaceRelativeIds(map: Map<string, string>) {
    var linkableHandlers = this.GetAllLinkableInvokeHandlers();
    if (linkableHandlers != null) {
      var mapValues = Array.from(map.values());
      for (var invHandler of linkableHandlers) {
        var originValue = invHandler.HandlerValue;
        if (originValue != null && originValue != '') {
          var targetValue = '';
          var ori_targetIds = originValue.split(',');
          if (ori_targetIds != null && ori_targetIds.length > 0) {
            var targetIds = [];
            ori_targetIds.forEach(x => {
              if (map.has(x)) targetIds.push(map.get(x));
              else if (mapValues.includes(x)) targetIds.push(x);
            });
            if (targetIds.length > 0) {
              targetValue = targetIds.join(',');
            }
          }
          invHandler.HandlerValue = targetValue;
        }
      }
    }
    if (this.InputDataPoints != null) {
      this.InputDataPoints.forEach(x => {
        //函数的数据接口在内部自己替换，防上两次替换后变空 所以加上 x.Owner == this
        if (
          x.FromInfo != null &&
          x.Owner == this &&
          x.FromInfo.DataSourceType != DataSourceType.Custom
        ) {
          if (map.has(x.FromInfo.DataSourceId)) {
            var newFromInfo = Object.assign(new DataPointInfo(), {
              ...x.FromInfo,
            });
            newFromInfo.DataSourceId = map.get(x.FromInfo.DataSourceId);
            x.FromInfo = newFromInfo;
          } else x.FromInfo = null;
        }
      });
    }
  }

  OnDeleting() {
    if (this.LogicDesign != null) {
      var invLinks = this.LogicDesign.Links.filter(x => x.TargetId == this.Id);
      if (invLinks != null && invLinks.length > 0)
        invLinks.forEach(x => x.StartHandler.RemoveTargetId(this.Id));
      var effectivelinks = this.LogicDesign.DataLinks.filter(
        x =>
          x instanceof InputDataPoint &&
          x.FromInfo != null &&
          x.FromInfo.DataSourceId == this.Id,
      ).map(x => x as InputDataPoint);
      effectivelinks.forEach(x => (x.FromInfo = null));
      this.InputDataPoints?.forEach(x => (x.FromInfo = null));
    }
  }

  //#region 连线相关逻辑

  //#region 被连线变化回调
  OnLinkChanged(from: any, isLink: boolean) {}
  //#endregion

  //#region 数据接口初始化信息
  GetOutputParameters(): string[] {
    return null;
  }

  GetInputParameters(): string[] {
    return null;
  }

  public RefreshInvHandlerLinks() {
    this.InvokeHandlers?.forEach(x => x.RefreshLinks());
  }

  public RefreshInputDataLinks() {
    this.InputDataPoints?.forEach(x => x.RefreshLinkLine());
  }

  CheckCanInputData(): boolean {
    return true;
  }
  CheckCanOutputData(): boolean {
    return true;
  }

  //#endregion

  //#endregion

  //声明验证数据基类方法
  public Validate(): string {
    return '';
  }
}
