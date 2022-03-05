import IPropUndoable from '@/redoundo/IPropUndoable';
import ILogicDesignItem from './logicViewModels/ILogicDesignItem';
import RUHelper from '@/redoundo/redoUndoHelper';
import LogicDesign from '../logicDesign';
import { FuncOutput } from './logicViewModels/Invokables/InvFunc/FuncInvokeProxy';
import {
  InvokeHandlerOption,
  InvokeHandlerMetaStorage,
} from './InvokeHandlerMeta';
import { from } from 'linq-to-typescript';
import { ViewTemplate, defaultValue } from '../toolbox/CustomTypeDefine';
import { Point2D, GeometryHelper } from '@/utils/Math2D';
import { observable, reaction, computed } from 'mobx';
import LogicLinkLine from './LogicLinkLine';
import { ClassType } from '@/class-transformer/ClassTransformer';
import MetaHelper from '@/utils/metaHelper';
import TypeMapHelper from '@/configs/typeMapHelper';
import { OutputDataPoint, DataSourceType, DataPointInfo } from '../DataPoint';
import InvokeTriggerBase from '../triggers/invokeTriggerBase';
import InvokableBase from '../InvokableBase';
import { deserialize, serialize } from '@/class-transformer';
import React from 'react';
import UIHelper from '@/utils/uiHelper';

export default class InvokeHandler implements IPropUndoable {
  constructor(owner?: ILogicDesignItem) {
    this.Owner = owner;
  }

  //#region RedoUndo判断
  public get CanRecordRedoUndo(): boolean {
    return (
      this.Owner != null &&
      this.VisualLogicDesign != null &&
      this.VisualLogicDesign.Scene != null &&
      this.VisualLogicDesign.Scene.Courseware != null &&
      this.VisualLogicDesign.Scene.Courseware.SelectedPage ==
        this.VisualLogicDesign.Scene &&
      !RUHelper.Core.ActionIsExecuting
    );
  }

  //#endregion

  @observable
  private _Owner: ILogicDesignItem;
  public get Owner(): ILogicDesignItem {
    return this._Owner;
  }
  public set Owner(v: ILogicDesignItem) {
    this._Owner = v;
  }

  public get VisualLogicDesign(): LogicDesign {
    if (this.Owner != null) {
      var owner = this.Owner;
      if (owner instanceof FuncOutput && owner.FatherItem != null)
        return owner.FatherItem.LogicDesign;
      return owner.LogicDesign;
    }
    return null;
  }
  protected lDChanged = reaction(
    () => this.VisualLogicDesign,
    v => this.RefreshLinks(),
  );

  public get InvokerInfo(): InvokeHandlerOption {
    if (this.InvokerProperty == null) return null;
    var metas = InvokeHandlerMetaStorage.findInvHandlerMetasByClassType(
      this.Owner.constructor,
    );
    if (metas && metas.length > 0) {
      return metas.find(x => x.propertyName == this.InvokerProperty)?.option;
    }
    return null;
  }

  /**
   * 被附加到的属性名称
   */
  @observable
  InvokerProperty: string;

  public get DataObj(): any {
    return this.Owner;
  }

  get ExtendTemplate(): ViewTemplate {
    return this.InvokerInfo?.Template;
  }

  private _LineColor: string;
  public get LineColor(): string {
    return this._LineColor;
  }
  public set LineColor(v: string) {
    this._LineColor = v;
  }

  @observable
  private _HandlerValue: string = null;
  public get HandlerValue(): string {
    if (this.Owner != null) this._HandlerValue = this.GetHandlerValue<string>();
    else return null;
    return this._HandlerValue;
  }
  public set HandlerValue(v: string) {
    var oldValue = this.HandlerValue || '';
    this.handlerValueChangeByRedoUndo = RUHelper.Core.ActionIsExecuting;
    RUHelper.TrySetPropRedoUndo(
      this,
      'HandlerValue',
      () => {
        this.SetHandlerValue(v);
        this.RefreshLinks();
        this.refreshed = true;
      },
      v,
      oldValue,
    );
    if (this.handlerValueChangeByRedoUndo)
      //因为重做时原始数据已经变化，不会刷新线，所以强刷
      this.RefreshLinks();
  }

  private refreshed = false;
  private handlerValueChangeByRedoUndo = false;
  protected handlerValueChanged = reaction(
    () => this.HandlerValue,
    v => {
      if (this.refreshed || this.handlerValueChangeByRedoUndo) {
        this.refreshed = false;
        this.handlerValueChangeByRedoUndo = false; //重做时不刷，因为是异步的，会造成重新记录操作
      } else this.RefreshLinks();
    },
  );

  GetHandlerValue<T>(): T {
    if (
      this.InvokerProperty != null &&
      this.InvokerProperty != '' &&
      this.Owner != null &&
      Reflect.has(this.Owner, this.InvokerProperty)
    ) {
      var result = Reflect.get(this.Owner, this.InvokerProperty);
      if (result != null) return result as T;
    }
    return null;
  }

  SetHandlerValue<T>(v: T) {
    if (
      this.InvokerProperty != null &&
      this.InvokerProperty != '' &&
      this.Owner != null &&
      Reflect.has(this.Owner, this.InvokerProperty)
    ) {
      Reflect.set(this.Owner, this.InvokerProperty, v);
    }
  }

  @observable
  private _HandlerPosition: Point2D;
  public get HandlerPosition(): Point2D {
    return this._HandlerPosition;
  }
  public set HandlerPosition(v: Point2D) {
    if (
      this._HandlerPosition == null ||
      this._HandlerPosition.minus(v || Point2D.Zero).length > 2
    ) {
      this._HandlerPosition = v;
      // from( this.VisualLogicDesign?.Links)?.where(x => x.StartHandler == this)?.toArray().forEach(x => x.Refresh());
    }
  }

  /**
   * 数据输出接口
   */
  @observable
  private _OutputDataPoints: OutputDataPoint[] = null;
  public get OutputDataPoints(): OutputDataPoint[] {
    if (this._OutputDataPoints == null) {
      this._OutputDataPoints = [];
      var dst: DataSourceType = DataSourceType.Invoke;
      var dataSourceId = '';
      var triggername: string = null;
      if (this.Owner instanceof InvokeTriggerBase) {
        dst = DataSourceType.Trigger;
        dataSourceId = this.Owner.AttachedItem.Id;
        triggername = this.Owner.TriggerName;
      } else if (this.Owner instanceof InvokableBase) {
        dst = DataSourceType.Invoke;
        dataSourceId = this.Owner.Id;
      }
      var handlerIndex: number = null;
      var outpDisplayNames = this.InvokerInfo.OutputDataDisplayNames;
      if (this instanceof InvokeHandlerListItem) {
        handlerIndex = this.Father.SubHandlers.indexOf(this);
      } else if (this instanceof InvokeHandlerList)
        outpDisplayNames = this.InvokerInfo.HeaderOutputDataDisplayNames;

      var index: number = 0;
      var points = outpDisplayNames?.map(x =>
        Object.assign(
          new OutputDataPoint(
            Object.assign(new DataPointInfo(), {
              DataSourceType: dst,
              DataSourceId: dataSourceId,
              TriggerName: triggername,
              InvokeHandlerName: this.InvokerProperty,
              InvokeHandlerIndex: handlerIndex,
              DataIndex: index++,
            }),
          ),
          { Owner: this.Owner, DisplayName: x },
        ),
      );
      if (points != null) this._OutputDataPoints.push(...points);
    }
    return this._OutputDataPoints;
  }

  /** 为可执行组件或触发器创建调用接口 */
  static CreateInvokeHandlers(owner: ILogicDesignItem): InvokeHandler[] {
    var metas =
      InvokeHandlerMetaStorage.findInvHandlerMetasByClassType(
        owner.constructor,
      ) || [];
    var options = metas
      .map(x => x.option)
      .filter(x => x != null && x.DisplayInOwner);
    var typesMap = TypeMapHelper.InvokableTypeDiscriminator.subTypes;
    var ownerTypeMap = typesMap.find(x => x.value === owner.constructor);
    var lineColors = ownerTypeMap?.linecolor || 'black';
    return options
      ?.sort((a, b) => {
        return a.OrderIndex - b.OrderIndex;
      })
      .map(x => {
        var color = 'black';
        if (lineColors != null) {
          var color_str = lineColors[x.PropertyName];
          if (color_str) {
            color = color_str;
          }
        }
        var result: InvokeHandler;
        if (x.IsList) {
          result = new InvokeHandlerList(owner);
        } else result = new InvokeHandler(owner);
        //result.Owner = owner;
        result.InvokerProperty = x.PropertyName;
        result.LineColor = color;
        return result;
      });
  }

  //#region 连线控制

  public RefreshLinks() {
    if (!this.VisualLogicDesign) return;
    var targetIds = this.HandlerValue?.split(',') || [];

    var relativedLinks = this.GetRelativedLinks();

    var linksToRemove: LogicLinkLine[] = [];
    if (relativedLinks != null) {
      if (targetIds == null || targetIds.length == 0)
        linksToRemove.push(...relativedLinks);
      else
        linksToRemove.push(
          ...relativedLinks?.filter(x => !targetIds.includes(x.TargetId)),
        );
      linksToRemove.push(...relativedLinks.filter(x => x.IsLinking));
    }

    var targetIdsToAdd =
      relativedLinks == null
        ? [...targetIds]
        : from(targetIds)
            ?.except(from(relativedLinks).select(x => x.TargetId))
            .toArray();

    var links = this.VisualLogicDesign.Links;
    var logicDesign = this.VisualLogicDesign;
    for (var linkToRemove of linksToRemove) {
      var oldAccepter = linkToRemove.GetEndAccepter();
      var delindex = links?.indexOf(linkToRemove);
      if (delindex != null && delindex >= 0) links.splice(delindex, 1);
      if (oldAccepter != null) {
        oldAccepter?.OnLinkChanged(linkToRemove.StartHandler, false);
      }
    }
    if (targetIdsToAdd != null) {
      for (var targetId of targetIdsToAdd) {
        if (targetId != null && targetId != '') {
          var link = new LogicLinkLine();
          link.StartHandler = this;
          link.TargetId = targetId;
          var accetper = link.GetEndAccepter();
          if (accetper != null) {
            links?.push(link);
            accetper.OnLinkChanged(link.StartHandler, true);
          }
        }
      }
    }
  }

  public CheckIfCanLink(type: ClassType<any>): boolean {
    if (this.InvokerInfo.Checker && !this.InvokerInfo.Checker(type))
      return false;

    return true;
  }

  public AddTargetId(targetId: string) {
    if (this.Owner != null) {
      var exsitedIds = from(this.GetRelativedLinks())
        ?.where(x => x.GetEndAccepter() != null)
        ?.select(x => x.TargetId)
        .distinct()
        .toArray();
      var targetInv = this.VisualLogicDesign.AvailableLinkTargets.find(
        x => x.Id == targetId,
      );
      if (targetInv != null) {
        if (
          exsitedIds == null ||
          exsitedIds.length == 0 ||
          !this.InvokerInfo.AllowMulti
        )
          this.HandlerValue = targetId;
        else {
          var targetValue = exsitedIds.join(',');
          if (!exsitedIds.includes(targetId))
            targetValue = `${targetValue},${targetId}`;
          this.HandlerValue = targetValue;
        }
      }
    }
  }

  public RemoveTargetId(targetId: string) {
    if (this.Owner != null) {
      var exsitedIds = this.GetRelativedLinks()
        ?.filter(x => x.GetEndAccepter() != null)
        ?.map(x => x.TargetId);
      if (exsitedIds != null && exsitedIds.includes(targetId)) {
        var rmIndex = exsitedIds.indexOf(targetId);
        exsitedIds.splice(rmIndex, 1);
      }
      if (exsitedIds == null || exsitedIds.length == 0)
        this.HandlerValue = null;
      else {
        var targetValue = exsitedIds.join(',');
        this.HandlerValue = targetValue;
      }
      this.RefreshLinks();
    }
  }

  public ClearTargetId() {
    this.HandlerValue = null;
  }

  public GetRelativedLinks(): LogicLinkLine[] {
    return this.VisualLogicDesign?.Links?.filter(x => x.StartHandler == this);
  }
  //#endregion

  //#region 更新连接点坐标

  public RefreshHandlerPosition(handlerUI: HTMLElement) {
    if (this.Owner == null || handlerUI == null) return;
    var logicDesign = this.VisualLogicDesign;
    if (logicDesign == null) return;
    if (
      logicDesign.Scene != null &&
      logicDesign.Scene.Courseware != null &&
      logicDesign.Scene == logicDesign.Scene.Courseware.SelectedPage
    ) {
      if (handlerUI != null) {
        var canvas = UIHelper.FindAncestorByClassName(handlerUI, 'lgCanvas');
        //var relativeLinks = this.GetRelativedLinks();
        if (canvas != null) {
          // && relativeLinks && relativeLinks.length > 0) {
          var handlerRect = handlerUI.getBoundingClientRect();
          var handlerClientPoint = new Point2D(
            handlerRect.x + handlerRect.width,
            handlerRect.y + handlerRect.height / 2,
          );
          this.HandlerPosition = GeometryHelper.GetPosition(
            canvas,
            handlerClientPoint,
          );
        }
      }
    }
  }

  //#endregion

  //#region 拖动连线逻辑
  public static DraggingHandler: InvokeHandler = null;
  public startHandlerDrag(e: React.DragEvent<HTMLElement>) {
    e.dataTransfer.setDragImage(
      UIHelper.getDragImage(
        // <div style={{ width: 10, height: 10, border: '2px dashed #499149' }} />,
        <i />,
      ),
      10,
      10,
    );
    InvokeHandler.DraggingHandler = this;
  }
  private tempLink: LogicLinkLine = null;
  private lastUpdateLinkPosTime: number = Date.now();
  public onHandlerDrag(e: React.DragEvent<HTMLElement>) {
    e.dataTransfer.effectAllowed = 'copyMove';
    var target = e.target as HTMLElement;
    if (e.button == 0 && target != null) {
      var canvas = UIHelper.FindAncestorByClassName(
        target,
        'lgCanvas',
      ) as HTMLElement;
      if (canvas != null && !(e.clientX == 0 && e.clientY == 0)) {
        if (!this.InvokerInfo.AllowMulti) {
          //只允许单链
          if (this.HandlerValue) this.HandlerValue = null;
          //this.RefreshLinks();
        }
        let now = Date.now();

        if (this.tempLink == null) {
          this.tempLink = new LogicLinkLine();
          this.tempLink.StartHandler = this;
          this.tempLink.IsLinking = true;
          this.VisualLogicDesign.Links.push(this.tempLink);
        }
        if (this.tempLink != null && now - this.lastUpdateLinkPosTime > 120) {
          let linkPosition = GeometryHelper.GetPosition(
            canvas,
            new Point2D(e.clientX, e.clientY),
          );
          this.tempLink.LinkingPosition = linkPosition;
          this.lastUpdateLinkPosTime = now;
        }
      }
    }
  }
  public onHandlerDragEnd(e: React.DragEvent<HTMLElement>) {
    UIHelper.clearDragImage();
    if (this.tempLink != null) {
      var links = this.VisualLogicDesign.Links;
      var index = links.indexOf(this.tempLink);
      if (index >= 0) links.splice(index, 1);
      this.tempLink = null;
      this.RefreshLinks();
    }
    InvokeHandler.DraggingHandler = null;
    e.preventDefault();
  }

  //#endregion
}

export class InvokeHandlerList extends InvokeHandler {
  get HeaderTemplate(): ViewTemplate {
    return this.InvokerInfo?.HeaderTemplate;
  }
  @observable
  private _SubHandlers: InvokeHandlerListItem[];
  get SubHandlers(): InvokeHandlerListItem[] {
    return this._SubHandlers;
  }

  CreateSubHandlers() {
    if (this._SubHandlers == null) {
      if (
        this.Owner != null &&
        this.InvokerProperty != null &&
        this.InvokerProperty != ''
      ) {
        var result = [];
        if (Reflect.has(this.Owner, this.InvokerProperty)) {
          var list = Reflect.get(this.Owner, this.InvokerProperty);
          if (list != null && Array.isArray(list)) {
            var count = list.length;
            for (var i = 0; i < count; i++) {
              var newHandler = new InvokeHandlerListItem();
              newHandler.Father = this;
              result.push(newHandler);
            }
            this.InvokerInfo.ListUpdated?.(list);
          }
        }
        this._SubHandlers = result;
      }
      this.RefreshLinks();
    }
  }

  protected onOwnerSetted = reaction(
    () => this.Owner && this.InvokerProperty,
    () => this.CreateSubHandlers(),
    {
      fireImmediately: true,
    },
  );

  public AddSubHandler() {
    var list = this.GetHandlerValue<any[]>();
    if (list == null) {
      if (
        this.InvokerProperty != null &&
        this.InvokerProperty != '' &&
        this.Owner != null &&
        Reflect.has(this.Owner, this.InvokerProperty)
      ) {
        this.SetHandlerValue([]);
        list = this.GetHandlerValue<any[]>();
      }
    }
    if (list != null) {
      var newValue = null;
      var _constructor = this.InvokerInfo.ListItemType;
      if (_constructor != null) newValue = new _constructor();
      else if (this.InvokerInfo.ListItemType == String) newValue = '';
      if (newValue != null) {
        RUHelper.Core.CreateTransaction();
        RUHelper.AddItem(list, newValue);
        var newHandler = new InvokeHandlerListItem();
        newHandler.Father = this;
        RUHelper.AddItem(this.SubHandlers, newHandler);
        RUHelper.Core.CommitTransaction(() =>
          this.InvokerInfo.ListUpdated?.(list),
        );
        newHandler.RefreshLinks();
      }
    }
  }

  public RemoveSubHandler(subHandler: InvokeHandlerListItem) {
    var list = this.GetHandlerValue<any[]>();
    if (list != null && this.SubHandlers.includes(subHandler)) {
      var index = this.SubHandlers.indexOf(subHandler);
      RUHelper.Core.CreateTransaction();
      subHandler.HandlerValue = null;
      RUHelper.RemoveItem(this.SubHandlers, subHandler);
      RUHelper.RemoveItem(list, list[index]);
      RUHelper.Core.CommitTransaction(() =>
        this.InvokerInfo.ListUpdated?.(list),
      );

      this.RefreshLinks();
    }
  }

  MoveSubHandlerUp(subHandler: InvokeHandlerListItem) {
    if (subHandler != null) {
      var list = this.GetHandlerValue<any[]>();
      if (list != null && this.SubHandlers.includes(subHandler)) {
        var index = this.SubHandlers.indexOf(subHandler);
        if (index > 0) {
          RUHelper.Core.CreateTransaction();
          RUHelper.RemoveItem(this.SubHandlers, subHandler);
          var data = list[index];
          RUHelper.RemoveItem(list, data);
          RUHelper.AddItem(list, data, index - 1);
          RUHelper.AddItem(this.SubHandlers, subHandler, index - 1);
          RUHelper.Core.CommitTransaction(() =>
            this.InvokerInfo.ListUpdated?.(list),
          );
          this.RefreshLinks();
        }
      }
    }
  }
  MoveSubHandlerDown(subHandler: InvokeHandlerListItem) {
    if (subHandler != null) {
      var list = this.GetHandlerValue<any[]>();
      if (list != null && this.SubHandlers.includes(subHandler)) {
        var index = this.SubHandlers.indexOf(subHandler);
        if (index < list.length - 1) {
          RUHelper.Core.CreateTransaction();
          RUHelper.RemoveItem(this.SubHandlers, subHandler);
          var data = list[index];
          RUHelper.RemoveItem(list, data);
          RUHelper.AddItem(list, data, index + 1);
          RUHelper.AddItem(this.SubHandlers, subHandler, index + 1);
          RUHelper.Core.CommitTransaction(() =>
            this.InvokerInfo.ListUpdated?.(list),
          );
          this.RefreshLinks();
        }
      }
    }
  }

  RefreshLinks() {
    this.SubHandlers?.forEach(x => x.RefreshLinks());
  }

  ClearTargetId() {
    var subhandlers = [...this.SubHandlers];
    RUHelper.Core.CreateTransaction();
    for (var subhandler of subhandlers) {
      //RemoveSubHandler(subhandler);
    }
    RUHelper.Core.CommitTransaction();
  }
}

export class InvokeHandlerListItem extends InvokeHandler {
  private _Father: InvokeHandlerList;
  public get Father(): InvokeHandlerList {
    return this._Father;
  }
  public set Father(v: InvokeHandlerList) {
    this._Father = v;
    if (v) this.Owner = this._Father.Owner;
  }

  public get InvokerInfo() {
    return this.Father?.InvokerInfo;
  }

  public get LineColor() {
    return this.Father ? this.Father.LineColor : super.LineColor;
  }
  public set LineColor(v) {
    super.LineColor = v;
  }

  public get DataObj() {
    if (
      this.Father != null &&
      this.Owner != null &&
      this.Father.InvokerProperty != null
    ) {
      var index = this.Father.SubHandlers.indexOf(this);
      if (Reflect.has(this.Owner, this.Father.InvokerProperty)) {
        var list = Reflect.get(this.Owner, this.Father.InvokerProperty);
        if (list != null && Array.isArray(list) && list.length > index) {
          var resultOwner = list[index];
          return resultOwner;
        }
      }
    }
    return null;
  }

  GetHandlerValue<T>(): T {
    var resultOwner = this.DataObj;
    if (resultOwner != null) {
      var result = null;
      if (
        this.InvokerInfo.ListItemType == String ||
        this.InvokerInfo.ValuePropertyName == null ||
        this.InvokerInfo.ValuePropertyName == ''
      ) {
        result = resultOwner;
      } else if (resultOwner != null) {
        var propInfo = this.InvokerInfo.ValuePropertyName;
        if (propInfo != null && Reflect.has(resultOwner, propInfo)) {
          result = Reflect.get(resultOwner, propInfo);
        }
      }
      if (result != null) return result as T;
    }
    return null;
  }

  SetHandlerValue<T>(value: T) {
    if (
      this.Father != null &&
      this.Owner != null &&
      this.Father.InvokerProperty != null
    ) {
      var index = this.Father.SubHandlers.indexOf(this);
      if (Reflect.has(this.Owner, this.Father.InvokerProperty)) {
        var list = this.Father.GetHandlerValue<any[]>();
        if (list != null && list.length > index) {
          if (
            this.InvokerInfo.ValuePropertyName == null ||
            this.InvokerInfo.ValuePropertyName == ''
          ) {
            try {
              list[index] = value;
            } catch (ex) {
              console.error(ex);
              return;
            }
          } else {
            var resultOwner = list[index];
            if (resultOwner != null) {
              var propInfo = this.InvokerInfo.ValuePropertyName;
              if (propInfo != null && propInfo != '') {
                Reflect.set(resultOwner, propInfo, value);
              }
            }
          }
        }
      }
    }
  }
}
