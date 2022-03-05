import IPropUndoable from '@/redoundo/IPropUndoable';
import CWElement from '../cwElement';
import RUHelper from '@/redoundo/redoUndoHelper';
import { computed, observable } from 'mobx';
import { Point2D } from '@/utils/Math2D';
import { Expose, Transform, Type } from '@/class-transformer';
import ILogicDesignItem from '../InvokeDesign/logicViewModels/ILogicDesignItem';
import LogicDesign from '../logicDesign';
import InvokeHandler, {
  InvokeHandlerList,
} from '../InvokeDesign/InvokeHandler';
import { from } from 'linq-to-typescript';
import InvokableBase from '../InvokableBase';
import { OutputDataPoint, DataPointInfo, DataSourceType } from '../DataPoint';
import { InvHandler, InvokerType } from '../InvokeDesign/InvokeHandlerMeta';
import IdHelper from '@/utils/idHelper';
import copy from 'copy-to-clipboard';
import { message } from 'antd';

export default class InvokeTriggerBase
  implements IPropUndoable, ILogicDesignItem {
  readonly Role: string = 'Trigger';

  public static readonly IsMissionHandler = true;

  constructor() {
    this.Id = IdHelper.NewId();
  }

  @observable
  private _Id: string;
  @Expose()
  public get Id(): string {
    return this._Id;
  }
  public set Id(v: string) {
    this._Id = v;
  }

  copyId() {
    copy(this.Id) && message.success('复制成功');
  }

  @observable
  private _AttachedItem: CWElement;
  public get AttachedItem(): CWElement {
    return this._AttachedItem;
  }

  public set AttachedItem(v: CWElement) {
    this._AttachedItem = v;
  }

  //#region RedoUndo判断
  public get CanRecordRedoUndo(): boolean {
    return (
      this.AttachedItem &&
      this.AttachedItem.IsMainViewLoaded &&
      this.AttachedItem.CanRecordRedoUndo
    );
  }
  //#endregion

  public get LogicDesign(): LogicDesign {
    if (this.AttachedItem != null && this.AttachedItem.Scene != null)
      return this.AttachedItem.Scene.LogicDesign;
    return null;
  }

  @observable
  private _IsSelectedInDesign: boolean;
  public get IsSelectedInDesign(): boolean {
    return this._IsSelectedInDesign;
  }
  public set IsSelectedInDesign(v: boolean) {
    if (this._IsSelectedInDesign != v) {
      this._IsSelectedInDesign = v;
      //TODO:选中触发器自动选中元素
      if (
        this._IsSelectedInDesign &&
        this.AttachedItem != null &&
        this.AttachedItem.Scene != null &&
        !this.AttachedItem.IsAutoSelectingTriggers
      ) {
        this.AttachedItem.IsAutoSelectingByTriggers = true;
        this.AttachedItem.Scene.SelectedItem = this.AttachedItem;
        this.AttachedItem.IsAutoSelectingByTriggers = false;
      }
    }
  }

  @observable
  private _SettingTemplate: (...args: any[]) => JSX.Element;
  public get SettingTemplate(): (...args: any[]) => JSX.Element {
    if (this.AttachedItem?.Scene != null)
      if (
        !this.AttachedItem.Scene.IsTemplateLockEnable ||
        this.TemplateLockedSettingTemplate == null
      )
        return this._SettingTemplate;
      else return this.TemplateLockedSettingTemplate;
    else return this._SettingTemplate;
  }
  public set SettingTemplate(v: (...args: any[]) => JSX.Element) {
    this._SettingTemplate = v;
  }

  @observable
  TemplateLockedSettingTemplate: (props: any) => JSX.Element;

  public get IsSettingReadOnly(): boolean {
    if (this.AttachedItem != null && this.AttachedItem.Scene != null) {
      if (!this.AttachedItem.Scene.IsTemplateLockEnable) return false;
      else if (this.TemplateLockedSettingTemplate != null) return false;
    }
    return true;
  }

  //此处应为旧数据存在，必须写一个旧的set置空
  public set IsSettingReadOnly(v: boolean) {}

  @observable
  private _IsEnabled: boolean = false;
  @Expose()
  public get IsEnabled(): boolean {
    return this._IsEnabled;
  }
  public set IsEnabled(v: boolean) {
    var action = () => {
      this._IsEnabled = v;
      if (this.LogicDesign != null && this.LogicDesign.LogicDItems != null) {
        if (this._IsEnabled) {
          if (!this.LogicDesign.LogicDItems.includes(this))
            this.LogicDesign.LogicDItems.push(this);
        } else if (this.LogicDesign.LogicDItems.includes(this)) {
          this.GetAllLinkableInvokeHandlers().forEach(
            x => (x.HandlerValue = null),
          );
          this.LogicDesign.LogicDItems.splice(
            this.LogicDesign.LogicDItems.indexOf(this),
            1,
          );
        }
      }
    };

    RUHelper.TrySetPropRedoUndo(
      this,
      'IsEnabled',
      action.bind(this),
      v,
      this._IsEnabled,
    );
  }

  //是否展开详情
  @observable
  private _IsShowDetail: boolean = true;
  @Expose()
  public get IsShowDetail(): boolean {
    return this._IsShowDetail;
  }
  public set IsShowDetail(v: boolean) {
    this._IsShowDetail = v;
  }

  @observable
  private _TriggerName: string;
  @Expose()
  public get TriggerName(): string {
    return this._TriggerName;
  }
  public set TriggerName(v: string) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'TriggerName',
      () => (this._TriggerName = v),
      v,
      this._TriggerName,
    );
  }

  @observable
  private _DisplayName: string;
  public get DisplayName(): string {
    return this._DisplayName;
  }
  public set DisplayName(v: string) {
    this._DisplayName = v;
  }

  public get DisplayNameWithOwnerName() {
    return this.AttachedItem
      ? `${this.DisplayName}-${this.AttachedItem.Name}`
      : this.DisplayName;
  }

  @observable
  private _InvId: string;
  @Expose()
  @InvHandler({ DisplayName: '触发', Type: InvokerType.Event })
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

  public readonly HeaderBg: string = '#9F7F7F';
  public readonly HeaderFg: string = '#DFDFDF';
  public readonly DetailBg: string = '#9F9FBF';

  @observable
  private _InvokeHandlers: InvokeHandler[] = null;

  public get InvokeHandlers(): InvokeHandler[] {
    if (this._InvokeHandlers == null) {
      var list = InvokeHandler.CreateInvokeHandlers(this);
      this._InvokeHandlers = [];
      if (list != null) this._InvokeHandlers.push(...list);
    }
    return this._InvokeHandlers;
  }

  @observable
  private _OutputDataPoints: OutputDataPoint[] = null;

  public get OutputDataPoints(): OutputDataPoint[] {
    if (this._OutputDataPoints == null) {
      this._OutputDataPoints = [];
      var outpDisplayNames = this.GetOutputParameters();
      var index = 0;
      var points = outpDisplayNames?.map(x =>
        Object.assign(
          new OutputDataPoint(
            Object.assign(new DataPointInfo(), {
              DataSourceType: DataSourceType.Trigger,
              DataSourceId: this.AttachedItem.Id,
              TriggerName: this.TriggerName,
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

  //#region 数据接口定义
  GetOutputParameters(): string[] {
    return [];
  }
  //#endregion

  public RefreshInvHandlerLinks() {
    this.InvokeHandlers?.forEach(x => x.RefreshLinks());
  }

  //#region 是否可调用判定

  CheckCanInvoke(target: InvokableBase) {
    return true;
  }

  //#endregion

  //#region 引用关系
  GetDirectlyInvs(): InvokableBase[] {
    var result: InvokableBase[] = [];
    //寻找所有下一级
    var accepterLists = this.GetAllLinkableInvokeHandlers().map(x =>
      x.GetRelativedLinks().map(y => y.GetEndAccepter()),
    );
    for (var accepterList of accepterLists) {
      if (accepterList != null && accepterList.length > 0) {
        result.push(...accepterList);
      }
    }

    //剔除Group内部的Inv 将Group本身加入
    var innerInvs = result.filter(x => x.FatherItem != null);
    result = from(result)
      .except(innerInvs)
      .toArray();
    var invGrp = innerInvs
      .map(x => x.FatherItem)
      .filter(x => x != null)
      .filter(x => x.FatherItem == null);
    result.push(...invGrp);
    result = from(result)
      .distinct()
      .toArray();
    return result;
  }

  GetAllTargetsInInvokeTree() {
    var result = this.GetDirectlyInvs();

    var foundedInvs: InvokableBase[] = [];
    foundedInvs.push(...result);
    var grandsons: InvokableBase[] = [];
    for (var newFindInv of result) {
      grandsons.push(...newFindInv.GetAllTargetsInInvokeTree(foundedInvs));
    }
    grandsons.forEach(x => {
      if (!result.includes(x)) result.push(x);
    });
    return result;
  }

  GetAllLinkableInvokeHandlers(): InvokeHandler[] {
    var result: InvokeHandler[] = [];
    if (this.InvokeHandlers != null) {
      var listInvHandlers = this.InvokeHandlers?.filter(
        x => x.InvokerInfo.IsList && x instanceof InvokeHandlerList,
      );
      var aloneInvHandlers = from(this.InvokeHandlers)?.except(listInvHandlers);
      if (aloneInvHandlers) result.push(...aloneInvHandlers);
      for (var listInvHandler of listInvHandlers)
        result.push(
          ...((listInvHandler as InvokeHandlerList)?.SubHandlers || []),
        );
    }
    return result;
  }

  //#endregion

  ReplaceRelativeIds(map: Map<string, string>): void {
    //替换所有相关联的ID并清除无关ID
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
  }

  //声明验证数据基类方法
  public Validate(): string {
    return '';
  }
}
