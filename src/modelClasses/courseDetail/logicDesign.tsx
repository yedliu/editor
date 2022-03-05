import CWPage from './cwpage';
import LogicLinkLine from './InvokeDesign/LogicLinkLine';
import { observable, computed, runInAction } from 'mobx';
import InvokableBase from './InvokableBase';
import ILogicDesignItem from './InvokeDesign/logicViewModels/ILogicDesignItem';
import InvFunction from './InvokeDesign/logicViewModels/Invokables/InvFunc/InvFunction';
import {
  FuncInput,
  FuncDataInput,
  FuncDataOutput,
  FuncOutput,
} from './InvokeDesign/logicViewModels/Invokables/InvFunc/FuncInvokeProxy';
import {
  DataPoint,
  DataPointInfo,
  DataSourceType,
  InputDataPoint,
} from './DataPoint';
import { Point2D, GeometryHelper, Vector2D } from '@/utils/Math2D';
import UIHelper from '@/utils/uiHelper';
import RUHelper from '@/redoundo/redoUndoHelper';
import { message } from 'antd';
import InvokeTriggerBase from './triggers/invokeTriggerBase';
import ObjHelper from '@/utils/objHelper';
import TypeMapHelper from '@/configs/typeMapHelper';
import InvokableGroup from './InvokeDesign/logicViewModels/Invokables/InvokableGroup';
import MouseHelper from '@/utils/mouseHelper';
import IdHelper from '@/utils/idHelper';
import ElementsCopyBox from './toolbox/elementsCopyBox';
import CWElement from './cwElement';
import ItemsTreeView from '@/components/cwDesignUI/itemstree/itemstreeUI';
import DraggingData from './toolbox/DraggingData';
import InvokeHandler from './InvokeDesign/InvokeHandler';
import CWResource from './cwResource';
import { classToPlain, deserialize, serialize } from '@/class-transformer';
import { CWResourceTypes } from './courseDetailenum';
import { InvStructNode } from './InvokeDesign/invStructTree';
import KeyHelper from '@/utils/keyHelper';
import LoopWork from './toolbox/LoopWork';
import copy from 'copy-to-clipboard';
import StrCompressHelper from '@/utils/strCompressHelper';
import ClipboardHelper from '@/utils/clipboardHelper';
import { isValidElement } from 'react';

export default class LogicDesign {
  //当前选中的页面
  @observable
  private _Scene: CWPage;
  public get Scene(): CWPage {
    return this._Scene;
  }
  public set Scene(v: CWPage) {
    this._Scene = v;

    if (this.InvFunc == null) {
      this.ImportDataFromScene();
    }
  }

  ImportDataFromScene() {
    this.LogicDItems = [];
    this.Links = [];
    this.DataLinks = [];
    this.OpennedSubFuncs = [];
    if (this.Scene != null) {
      var invItems = this.Scene.Invokables;
      var invTriggersList = this.Scene.TotalEditItemList.map(x => {
        var gtriggers = x.GeneralTriggers?.filter(t => t.IsEnabled);
        var etriggers = x.ExtendedTriggers?.filter(t => t.IsEnabled);
        var alltriggers: ILogicDesignItem[] = [];
        if (gtriggers != null) alltriggers.push(...gtriggers);
        if (etriggers != null) alltriggers.push(...etriggers);
        return alltriggers;
      });
      var allTiggers: ILogicDesignItem[] = [];
      for (var list of invTriggersList) allTiggers.push(...list);

      this.LogicDItems.push(...allTiggers);
      this.LogicDItems.push(...invItems);

      for (var ldItem of this.LogicDItems) {
        for (var ivHandler of ldItem.InvokeHandlers) {
          ivHandler.RefreshLinks();
        }

        if (ldItem instanceof InvokableBase && ldItem.InputDataPoints)
          for (var idp of ldItem.InputDataPoints) {
            idp.RefreshLinkLine();
          }
      }

      this.FullInvCreateTreeMap = InvStructNode.GetInvTypeStruct(this, null);
    }
  }

  @observable
  private _InvFunc: InvFunction;
  public get InvFunc(): InvFunction {
    return this._InvFunc;
  }
  public set InvFunc(v: InvFunction) {
    this._InvFunc = v;
    this.ImportDataFromInvFunc();
  }

  @observable
  OpennedSubFuncs: InvFunction[] = [];

  ImportDataFromInvFunc() {
    if (this.InvFunc != null) {
      this.Scene = this.InvFunc.Scene;
      this.LogicDItems = [];
      this.Links = [];
      this.DataLinks = [];
      this.OpennedSubFuncs = [];
      var invItems = this.InvFunc.SubItems;
      this.LogicDItems.push(...invItems);
      for (var ldItem of this.LogicDItems) {
        for (var ivHandler of ldItem.InvokeHandlers) {
          ivHandler.RefreshLinks();
        }
        //数据接口
        if (ldItem instanceof InvokableBase)
          for (var idp of ldItem.InputDataPoints) {
            idp.RefreshLinkLine();
          }
      }

      this.FullInvCreateTreeMap = InvStructNode.GetInvTypeStruct(this, null);
    }
  }

  RefreshAll() {
    if (this.InvFunc) this.ImportDataFromInvFunc();
    else this.ImportDataFromScene();
  }

  public get Commander(): any {
    return this.Scene?.Courseware?.Commander;
  }

  @observable
  private _Scale: number = 1.0;
  public get Scale(): number {
    return this._Scale;
  }
  public set Scale(v: number) {
    this._Scale = v;
  }

  /**
   * 当前视图的所有可执行组件
   */
  public get SubInvs(): InvokableBase[] {
    if (this.InvFunc != null) return this.InvFunc.SubItems;
    else if (this.Scene != null) return this.Scene.Invokables;
    return null;
  }

  /**
   * 取得当前视图可被连接的目标可执行组件
   */
  public get AvailableLinkTargets(): InvokableBase[] {
    var result: InvokableBase[] = [];
    if (this.SubInvs != null) {
      result.push(
        ...this.SubInvs.filter(
          x => !(x instanceof InvFunction) && !(x instanceof FuncInput),
        ),
      );
      var funcInputs = this.SubInvs.filter(
        x => x instanceof InvFunction,
      ).map(x => x.SubItems?.filter(t => t instanceof FuncInput));
      funcInputs.forEach(x => {
        if (x != null && x.length > 0) result.push(...x);
      });
      var funcDataPoints = this.SubInvs.filter(
        x => x instanceof InvFunction,
      ).map(x =>
        x.SubItems?.filter(
          t => t instanceof FuncDataInput || t instanceof FuncDataOutput,
        ),
      );
      funcDataPoints.forEach(x => {
        if (x != null && x.length > 0) result.push(...x);
      });
    }
    return result;
  }

  /**
   * 所有可执行组件和触发器（触发器和控制器）
   */
  @observable
  private _LogicDItems: ILogicDesignItem[];
  public get LogicDItems(): ILogicDesignItem[] {
    return this._LogicDItems;
  }
  public set LogicDItems(v: ILogicDesignItem[]) {
    this._LogicDItems = v;
  }

  /**
   * 所有被选中的可执行组件和触发器
   */
  get SelectedLogicDItems(): ILogicDesignItem[] {
    return this.LogicDItems?.filter(x => x.IsSelectedInDesign) || [];
  }

  /**
   *  被复制的可执行组件
   *
   */
  @observable
  private static _CopyedInvs: ElementsCopyBox;
  public get CopyedInvs(): ElementsCopyBox {
    return LogicDesign._CopyedInvs;
  }
  public set CopyedInvs(v: ElementsCopyBox) {
    LogicDesign._CopyedInvs = v;
  }

  /**
   * 调用连接线
   */
  @observable
  private _Links: LogicLinkLine[];
  public get Links(): LogicLinkLine[] {
    return this._Links;
  }
  public set Links(v: LogicLinkLine[]) {
    this._Links = v;
  }

  /**
   * 数据连接线
   */
  @observable
  private _DataLinks: DataPoint[];
  public get DataLinks(): DataPoint[] {
    return this._DataLinks;
  }
  public set DataLinks(v: DataPoint[]) {
    this._DataLinks = v;
  }

  /**
   * 添加新组件的位置
   */

  @observable
  AddPosition: Point2D = Point2D.Zero;
  /**
   * 背景的UI元素
   */
  LDViewBg: HTMLElement = null;

  @observable
  private _IsShowTriggerAddMenu: boolean = false;
  /**
   * 是否正在添加触发器
   */
  get IsShowTriggerAddMenu() {
    return this._IsShowTriggerAddMenu;
  }
  set IsShowTriggerAddMenu(v) {
    this._IsShowTriggerAddMenu = v;
    if (!v) {
      this.TriggerAttachedItems = null;
    }
  }

  @observable
  private _TriggerAttachedItems: CWElement[];
  /**
   * 正在添加触发器的元素
   */
  public get TriggerAttachedItems(): CWElement[] {
    return this._TriggerAttachedItems;
  }
  public set TriggerAttachedItems(v: CWElement[]) {
    this._TriggerAttachedItems = v;
  }

  public get TriggerAddNameList(): string[] {
    var result: string[] = [];
    if (
      this.TriggerAttachedItems != null &&
      this.TriggerAttachedItems.length > 0
    ) {
      for (var trigger of this.TriggerAttachedItems[0].TotalTriggers) {
        var contains = true;
        for (var attachedItem of this.TriggerAttachedItems) {
          if (
            attachedItem.TotalTriggers.find(
              x => x.DisplayName == trigger.DisplayName,
            ) == null
          ) {
            contains = false;
            break;
          }
        }
        if (contains) result.push(trigger.DisplayName);
      }
    }
    return result;
  }

  @observable
  private _IsShowInvAddMenu: boolean = false;
  /**
   * 是否正在添加可执行组件(点击鼠标右键、连线展示控制器)
   */
  get IsShowInvAddMenu() {
    return this._IsShowInvAddMenu;
  }
  set IsShowInvAddMenu(v) {
    this._IsShowInvAddMenu = v;
    if (!v) {
      //重置正在添加的可执行组件分类树
      this.LinkingInvHandler = null;
    } else {
      this.isAddInvWithShiftKey = KeyHelper.isKeyPressed('Shift');
    }
  }

  private isAddInvWithShiftKey = false;

  /**
   * 添加可执行组件的分类树
   */
  InvCreateTreeMap: InvStructNode[] = null;
  FullInvCreateTreeMap: InvStructNode[] = null;

  @observable
  private _LinkingInvHandler: InvokeHandler;
  public get LinkingInvHandler(): InvokeHandler {
    return this._LinkingInvHandler;
  }
  public set LinkingInvHandler(v: InvokeHandler) {
    this._LinkingInvHandler = v;
  }

  //#region 添加触发器和可执行组件

  lgBgMouseDragOver(e: React.DragEvent<HTMLElement>) {
    if (
      e.target instanceof HTMLElement &&
      e.target.classList.contains('lgBg')
    ) {
      //元素拖动到逻辑面板
      var editItemContext = DraggingData.getData('dragitems') as CWElement[];
      //逻辑面板里触发器、控制器连线拖动
      var invHandler = InvokeHandler.DraggingHandler;
      //资源拖动到逻辑面板
      var audioResItem: CWResource = DraggingData.getData('res');
      //逻辑头部控制器拖动到逻辑面板
      var draggingAddInv = this.draggingAddInv;
      if (
        editItemContext != null &&
        editItemContext.length > 0 &&
        !this.Scene.IsTemplateLockEnable &&
        this.InvFunc == null
      ) {
        e.preventDefault();
      } else if (
        invHandler != null &&
        invHandler.VisualLogicDesign == this &&
        !this.Scene.IsTemplateLockEnable
      )
        e.preventDefault();
      else if (
        audioResItem != null &&
        this.CanCreateInvokableInstanceByResType(audioResItem.resourceType) &&
        !this.Scene.IsTemplateLockEnable
      )
        e.preventDefault();
      else if (draggingAddInv != null) e.preventDefault();
    }
  }

  lgBgDrop(e: React.DragEvent<HTMLElement>) {
    if (
      e.target instanceof HTMLElement &&
      e.target.classList.contains('lgBg')
    ) {
      //元素拖动到逻辑面板
      var editItemContext = DraggingData.getData('dragitems') as CWElement[];
      //逻辑面板里触发器、控制器连线拖动
      var invHandler = InvokeHandler.DraggingHandler;
      //资源拖动到逻辑面板
      var audioResItem: CWResource = DraggingData.getData('res');

      var s = e.currentTarget;
      var scrollViewer = UIHelper.FindAncestorByClassName(s, 'lgScrollViewer');
      var canvas = scrollViewer?.getElementsByClassName(
        'lgCanvas',
      )?.[0] as HTMLElement;
      if (canvas == null) return;
      var mousePos = GeometryHelper.GetPosition(
        canvas,
        new Point2D(e.clientX, e.clientY),
        true,
      );
      if (this.Scene.IsTemplateLockEnable) {
        message.error('模板页面不能添加逻辑');
      }
      //元素拖动到面板
      else if (
        null != editItemContext &&
        editItemContext.length > 0 &&
        this.InvFunc == null
      ) {
        this.AddPosition = mousePos;
        this.IsShowTriggerAddMenu = true;
        this.TriggerAttachedItems = editItemContext;
      }
      //事件（连接线）拖动到面板
      else if (null != invHandler && invHandler.VisualLogicDesign == this) {
        this.AddPosition = mousePos;
        //创建正在添加的可执行组件分类树
        this.InvCreateTreeMap = InvStructNode.GetInvTypeStruct(
          this,
          invHandler,
        );
        this.LinkingInvHandler = invHandler;
        this.IsShowInvAddMenu = true;
        this.isAddInvWithShiftKey = e.shiftKey;
      }
      //资源拖动音频到面板
      else if (
        null != audioResItem &&
        this.CanCreateInvokableInstanceByResType(audioResItem.resourceType)
      ) {
        var newInv = this.CreateInvokableInstanceByResType(audioResItem);
        if (newInv != null) {
          newInv.Position = mousePos;
          if (this.Scene != null) {
            RUHelper.Core.CreateTransaction();
            this.LogicDItems?.forEach(x => (x.IsSelectedInDesign = false));
            if (this.SubInvs != null) RUHelper.AddItem(this.SubInvs, newInv);
            RUHelper.SetProperty(newInv, 'IsSelectedInDesign', true, false);
            if (this.LinkingInvHandler != null) {
              this.LinkingInvHandler.AddTargetId(newInv.Id);
            }
            RUHelper.Core.CommitTransaction();
          }
        }
      }
      //头部拖动控制器到面板
      else if (null != this.draggingAddInv) {
        this.AddPosition = mousePos;
        this.AddNewInv(this.draggingAddInv.constructor);
        this.draggingAddInv.callback?.();
        this.draggingAddInv = null;
      }
    }
  }

  /**
   * 能否從資源创建可执行组件
   */
  CanCreateInvokableInstanceByResType(resType: CWResourceTypes) {
    var maps = TypeMapHelper.InvokableTypeDiscriminator.subTypes;
    var map = maps.find(x => x.resBuild == resType);
    if (map != null) return true;
    return false;
  }
  /**
   *從資源创建可执行组件
   */
  CreateInvokableInstanceByResType(res: CWResource) {
    if (res != null) {
      var maps = TypeMapHelper.InvokableTypeDiscriminator.subTypes;
      var map = maps.find(x => x.resBuild == res.resourceType);
      if (map != null) return new map.value(res);
    }
    return null;
  }

  //元素拖拽到逻辑面板时添加触发器
  AddTrigger(dName: string) {
    if (dName != null && dName != '') {
      //添加触发器
      var triggersToAdd = this.TriggerAttachedItems.map(x =>
        x.TotalTriggers.find(y => y.DisplayName == dName),
      );
      var index = 0;
      this.LogicDItems?.forEach(x => (x.IsSelectedInDesign = false));
      RUHelper.Core.CreateTransaction();
      for (var obj of triggersToAdd) {
        if (!this.LogicDItems.includes(obj)) {
          //ActionManager.Instance.AddItem(LogicDItems, obj);
          obj.IsEnabled = true;
          obj.Position = new Vector2D(0, index * 50).translatePoint(
            this.AddPosition,
          );
          index++;
        }
        obj.IsSelectedInDesign = true;
      }
      RUHelper.Core.CommitTransaction(() => this.LDViewBg?.focus());
    }

    this.IsShowTriggerAddMenu = false;
  }

  //头部控制器拖拽到逻辑面板时添加控制器
  AddNewInv(_constructor: new () => InvokableBase) {
    if (_constructor != null) {
      var newInv = new _constructor();
      if (newInv != null) {
        if (
          newInv.IsUnique &&
          this.Scene.TotalInvItems.find(x => x.Type == newInv.Type) != null
        ) {
          message.warning(
            '当前添加的组件为唯一组件，并且当前页面已存在相同组件',
          );
          return;
        }

        newInv.Position = this.AddPosition;
        if (this.Scene != null && this.CheckInvsCount(1)) {
          RUHelper.Core.CreateTransaction();
          if (this.SubInvs != null) RUHelper.AddItem(this.SubInvs, newInv);

          // ActionManager.Instance.AddItem(LogicDItems, newInv);//已经联动添加了，不需要再添加
          if (this.LinkingInvHandler != null) {
            this.LinkingInvHandler.AddTargetId(newInv.Id);
            if (
              this.LinkingInvHandler.Owner.IsSelectedInDesign &&
              (this.isAddInvWithShiftKey || KeyHelper.isKeyPressed('Shift'))
            ) {
              var handlersTogether = this.SelectedLogicDItems.map(x =>
                x
                  .GetAllLinkableInvokeHandlers()
                  ?.find(
                    h =>
                      h.InvokerProperty ==
                      this.LinkingInvHandler.InvokerProperty,
                  ),
              ).filter(x => x != null && x != this.LinkingInvHandler);
              handlersTogether?.forEach(x => x.AddTargetId(newInv.Id));
            }
          }
          this.LogicDItems?.forEach(x => (x.IsSelectedInDesign = false));
          RUHelper.SetProperty(newInv, 'IsSelectedInDesign', true, false);
          RUHelper.Core.CommitTransaction();
        }
      }
    }
  }

  draggingAddInv: {
    constructor: new () => InvokableBase;
    callback: () => void;
  } = null;
  StartDragInv(
    e: React.MouseEvent,
    _constructor: new () => InvokableBase,
    dragEndCallback: () => void,
  ) {
    if (_constructor)
      this.draggingAddInv = {
        constructor: _constructor,
        callback: dragEndCallback,
      };
  }

  //#endregion

  //#region 选择、移动触发器和组件

  private startMovePositions: Point2D[] = null;
  private mouseStartPosition: Point2D = null;
  private mouseDownHtmlElement: HTMLElement = null;
  private moveDItemDelta: Vector2D = Vector2D.Zero;
  private moveDItemKey = {};

  //触发器、控制器选中效果
  public PressLogicItem(
    e: React.MouseEvent<HTMLElement>,
    item: ILogicDesignItem,
  ) {
    var uiElement = e.target as HTMLElement;
    if (uiElement != null && item != null) {
      if (e.button == 0 || e.button == 2) {
        if (!KeyHelper.checkCtrlOrMeta(e)) {
          if (!item.IsSelectedInDesign) {
            this.SelectedLogicDItems?.forEach(x => {
              if (x != item) x.IsSelectedInDesign = false;
            });
            item.IsSelectedInDesign = true;
          }
        } else item.IsSelectedInDesign = !item.IsSelectedInDesign;
        this.startMovePositions = this.SelectedLogicDItems?.map(
          x => x.Position,
        );
        var canvas = UIHelper.FindAncestorByClassName(uiElement, 'lgCanvas');
        this.mouseStartPosition = GeometryHelper.GetPosition(
          canvas,
          new Point2D(e.clientX, e.clientY),
        );
        uiElement.focus();
        this.mouseDownHtmlElement = uiElement;

        const onMove = e => {
          this.MoveLogicItem(e, item);
        };
        const onUp = e => {
          document.removeEventListener('mousemove', onMove);
          document.removeEventListener('mouseup', onUp);
          this.ReleaseLogicItem(e, item);
        };

        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);
        LoopWork.Instance.setMission(
          this.moveDItemKey,
          this.MoveLItemRender.bind(this),
        );
      }
    }
  }

  public MoveLogicItem(
    e: React.MouseEvent<HTMLElement>,
    item: ILogicDesignItem,
  ) {
    if (this.mouseDownHtmlElement != null && item != null) {
      if (e.button == 0 && this.mouseStartPosition != null) {
        var canvas = UIHelper.FindAncestorByClassName(
          this.mouseDownHtmlElement,
          'lgCanvas',
        );
        this.moveDItemDelta = GeometryHelper.GetPosition(
          canvas,
          new Point2D(e.clientX, e.clientY),
        ).minus(this.mouseStartPosition);
      }
    }
  }
  public ReleaseLogicItem(
    e: React.MouseEvent<HTMLElement>,
    item: ILogicDesignItem,
  ) {
    LoopWork.Instance.removeMission(this.moveDItemKey);
    this.mouseStartPosition = null;
    this.startMovePositions = null;
    this.mouseDownHtmlElement = null;
    this.moveDItemDelta = Vector2D.Zero;
  }

  MoveLItemRender() {
    if (this.startMovePositions && this.startMovePositions.length > 0) {
      runInAction(() => {
        RUHelper.Core.CreateTransaction('MoveLogicDItem');
        var i = 0;
        this.SelectedLogicDItems?.forEach(
          x =>
            (x.Position = this.moveDItemDelta?.translatePoint(
              this.startMovePositions[i++],
            )),
        );

        RUHelper.Core.CommitTransaction();
      });
    }
  }

  //#endregion

  //#region 对齐

  LogicItemAlign(cmd: 'LeftAlign' | 'TopAlign') {
    switch (cmd) {
      case 'LeftAlign':
        RUHelper.Core.CreateTransaction('LeftAlignDItem');
        var minLeft = Math.min(
          ...this.SelectedLogicDItems.map(p => p.Position.x),
        );
        for (var i = 0; i < this.SelectedLogicDItems.length; i++) {
          this.SelectedLogicDItems[i].Position = new Point2D(
            minLeft,
            this.SelectedLogicDItems[i].Position.y,
          );
        }
        RUHelper.Core.CommitTransaction();
        break;
      case 'TopAlign':
        RUHelper.Core.CreateTransaction('TopAlign');
        var minTop = Math.min(
          ...this.SelectedLogicDItems.map(p => p.Position.y),
        );
        for (var i = 0; i < this.SelectedLogicDItems.length; i++) {
          this.SelectedLogicDItems[i].Position = new Point2D(
            this.SelectedLogicDItems[i].Position.x,
            minTop,
          );
        }
        RUHelper.Core.CommitTransaction();
        break;
      default:
        break;
    }
  }

  //#endregion

  //#region 删除触发器和可执行组件

  DeleteLogicDItem() {
    var selectedDItems = this.SelectedLogicDItems;
    this.DoDeleteLDItems(selectedDItems);
  }

  DoDeleteLDItems(selectedDItems: ILogicDesignItem[]) {
    if (selectedDItems != null && selectedDItems.length > 0) {
      if (this.Scene != null && this.Scene.IsTemplateLockEnable) {
        message.error('模板页面不能删除逻辑');
        return;
      }

      RUHelper.Core.CreateTransaction();
      for (var item of selectedDItems) {
        var handlers = item.GetAllLinkableInvokeHandlers();
        handlers.forEach(x => (x.HandlerValue = null));

        if (item instanceof InvokableBase) {
          var inv: InvokableBase = item;

          inv.OnDeleting();
          if (inv.FatherList != null) {
            var fatherlist = inv.FatherList;
            RUHelper.SetProperty(inv, 'Scene', null, this.Scene);
            if (inv.FatherItem)
              RUHelper.SetProperty(inv, 'FatherItem', null, inv.FatherItem);

            RUHelper.RemoveItem(fatherlist, inv);
          }
        } else if (item instanceof InvokeTriggerBase) {
          var trigger: InvokeTriggerBase = item;
          var effectivelinks = this.DataLinks.filter(
            x =>
              x instanceof InputDataPoint &&
              x.FromInfo != null &&
              x.FromInfo.DataSourceId == trigger.AttachedItem.Id &&
              x.FromInfo.TriggerName == trigger.TriggerName,
          ).map(x => x as InputDataPoint);
          effectivelinks?.forEach(x => (x.FromInfo = null));
          trigger.IsEnabled = false;
          var attachedItem = trigger.AttachedItem;
          var newTrigger = Reflect.construct(trigger.constructor, []);
          if (newTrigger != null) {
            newTrigger.TriggerName = trigger.TriggerName;
            newTrigger.DisplayName = trigger.DisplayName;
            var targetTriggerList: InvokeTriggerBase[] = null;

            if (attachedItem.GeneralTriggers.includes(trigger))
              targetTriggerList = attachedItem.GeneralTriggers;
            else if (attachedItem.ExtendedTriggers.includes(trigger))
              targetTriggerList = attachedItem.ExtendedTriggers;
            if (targetTriggerList != null) {
              var index = targetTriggerList.indexOf(trigger);
              RUHelper.RemoveItem(targetTriggerList, trigger);
              RUHelper.AddItem(targetTriggerList, newTrigger, index);
              RUHelper.SetProperty(trigger, 'AttachedItem', null, attachedItem);
              RUHelper.SetProperty(
                newTrigger,
                'AttachedItem',
                attachedItem,
                null,
              );
            }
          } //将目标对象的相应触发器重置
        }
      }
      RUHelper.Core.CommitTransaction();
    }
  }

  //#endregion

  //#region 复制粘贴可执行组件
  private invExportSign = 'invexport';
  CopySelectedLDItems() {
    var selectInvs = this.SelectedLogicDItems.filter(
      x => x instanceof InvokableBase,
    ).map(x => x as InvokableBase);
    var itemsToClone = InvokableBase.GetAllInvsWithSub(
      InvokableBase.ClearDescendants(selectInvs),
    );
    if (itemsToClone != null && itemsToClone.length > 0) {
      var reslibs = itemsToClone.map(x => x.GetDependencyResources());
      var reslib = [];
      reslibs?.forEach(x => reslib.push(...x));
      reslib = reslib?.map(x => ObjHelper.ConvertObj(CWResource, x));
      var copyedInfo = new ElementsCopyBox();
      copyedInfo.Invokables = ObjHelper.DeepClone(
        itemsToClone,
        TypeMapHelper.CommonTypeMap,
      );
      copyedInfo.ResLib = reslib;

      var serializedData = serialize(copyedInfo, {
        strategy: 'excludeAll',
        typeMaps: TypeMapHelper.CommonTypeMap,
      });
      var zipedData = StrCompressHelper.zip(serializedData);
      ClipboardHelper.copyToClipboard(this.invExportSign + zipedData);

      this.CopyedInvs = copyedInfo;
    }
  }

  PasteLDItems() {
    if (this.Scene != null && this.Scene.IsTemplateLockEnable) {
      message.error('模板页面不能添加逻辑');
      return;
    }
    ClipboardHelper.getClipboardText(
      (v => {
        var templateModel: ElementsCopyBox = null;
        if (v.startsWith(this.invExportSign)) {
          var zipedData = v.substr(this.invExportSign.length);
          var clipboardDataStr = StrCompressHelper.unzip(zipedData);
          templateModel = deserialize(
            ElementsCopyBox,
            clipboardDataStr || '{}',
            {
              typeMaps: TypeMapHelper.CommonTypeMap,
            },
          );
        }
        if (
          templateModel &&
          templateModel.Invokables &&
          templateModel.Invokables.length > 0 &&
          this.CheckInvsCount(templateModel.Invokables.length)
        ) {
          var resultInvs = ObjHelper.DeepClone(
            templateModel.Invokables,
            TypeMapHelper.CommonTypeMap,
          );

          for (var _invItem of resultInvs) {
            var fatherId = _invItem.SetFatherId;
            var father = resultInvs.find(x => x.Id == fatherId);
            if (father) {
              father.SubItems.push(_invItem);
              _invItem.FatherItem = father;
            }
          }

          var totalInvs = [...resultInvs];

          resultInvs = resultInvs.filter(x => x.FatherItem == null);

          if (this.Scene != null) {
            var map = new Map<string, string>();

            if (this.LDViewBg != null) {
              var canvas = this.LDViewBg.getElementsByClassName(
                'lgCanvas',
              )?.[0] as HTMLElement;
              var container = UIHelper.FindAncestorByClassName(
                this.LDViewBg,
                'lgScrollViewer',
              ) as HTMLElement;
              if (canvas && container && MouseHelper.isMouseOver(container)) {
                //鼠标在画布上
                this.AddPosition = MouseHelper.getMousePositionIn(canvas);
              } else {
                var windowPos = GeometryHelper.GetPositionInWindow(
                  container,
                  new Point2D(
                    container.clientWidth / 2,
                    container.clientHeight / 2,
                  ),
                );
                this.AddPosition = GeometryHelper.GetPosition(
                  canvas,
                  windowPos,
                );
              }
            }
            if (totalInvs != null && totalInvs.length > 0) {
              var uniqueInvs = totalInvs.filter(x => x.IsUnique);
              for (var uniqueInv of uniqueInvs) {
                if (
                  this.Scene.TotalInvItems.find(
                    x => x.Type == uniqueInv.Type,
                  ) != null
                ) {
                  totalInvs.splice(totalInvs.indexOf(uniqueInv), 1);
                  if (resultInvs.includes(uniqueInv))
                    resultInvs.splice(resultInvs.indexOf(uniqueInv), 1);
                  else if (uniqueInv.FatherList != null)
                    uniqueInv.FatherList.splice(
                      uniqueInv.FatherList.indexOf(uniqueInv),
                      1,
                    );
                }
              }

              if (resultInvs.length > 0) {
                var deltaMove = this.AddPosition.minus(totalInvs[0].Position);

                for (var newInv of totalInvs) {
                  var oldId = newInv.Id;
                  var newId = IdHelper.NewId();
                  newInv.Id = newId; //为每一个可执行组件替换新的ID
                  if (newInv.FatherItem == null)
                    newInv.Position = deltaMove.translatePoint(newInv.Position);
                  map.set(oldId, newId);
                }
              }
            }
            resultInvs.forEach(x => {
              x.ReplaceRelativeIds(map);
              x.SearchRes(templateModel.ResLib);
            });

            RUHelper.Core.CreateTransaction();

            if (this.SubInvs != null) {
              for (var i = 0; i < resultInvs.length; i++) {
                RUHelper.AddItem(this.SubInvs, resultInvs[i]);
                RUHelper.SetProperty(resultInvs[i], 'Scene', this.Scene, null);
              }
            }
            this.SelectedLogicDItems.forEach(x =>
              RUHelper.SetProperty(x, 'IsSelectedInDesign', false, true),
            );
            resultInvs?.forEach(newInv => {
              RUHelper.SetProperty(newInv, 'IsSelectedInDesign', true, false);
            });

            RUHelper.Core.CommitTransaction(
              this.ClearUnuseLines.bind(this),
              () =>
                resultInvs?.forEach(newInv => {
                  newInv.RefreshInputDataLinks();
                  newInv.InvokeHandlers?.forEach(handler =>
                    handler.RefreshLinks(),
                  );
                }),
            );
          }
        }
      }).bind(this),
    );
  }

  //#endregion

  //#region 自动清除多余连线

  public ClearUnuseLines() {
    var unuseLinks = this.Links?.filter(
      x => x.StartHandler?.VisualLogicDesign != this,
    );
    var unuseDataLinks = this.DataLinks?.filter(
      x =>
        x.VisualLogicDesign != this ||
        (x instanceof InputDataPoint && x.From?.VisualLogicDesign != this),
    );
    unuseLinks?.forEach(x => this.Links.splice(this.Links.indexOf(x), 1));
    unuseDataLinks?.forEach(x =>
      this.DataLinks.splice(this.DataLinks.indexOf(x), 1),
    );
  }

  //#endregion

  //#region   判断是否超限

  private noticeInvsCount = 75;
  private forbiddenInvsCount = 150;
  //提示次数
  private tipsCount = 0;

  public CheckInvsCount(addCount) {
    var exsitInvsCount = this.SubInvs.length;
    var targetInvsCount = exsitInvsCount + addCount;

    if (targetInvsCount > this.forbiddenInvsCount) {
      alert(
        `目标执行组件数量超过${this.forbiddenInvsCount},不可添加,请将达成同一功能目的的执行组件合并为函数,减少卡顿`,
      );
      return false;
    } else if (targetInvsCount > this.noticeInvsCount) {
      this.tipsCount++;
      if (this.tipsCount <= 1) {
        alert(
          `目标执行组件数量超过${this.noticeInvsCount},请将达成同一功能目的的执行组件合并为函数,减少卡顿`,
        );
      }
    } else {
      this.tipsCount = 0;
    }
    return true;
  }

  //#endregion

  //#region 将选中的可执行组件生成函数

  CombineInvs() {
    var invs: InvokableBase[] = this.SelectedLogicDItems.filter(
      x => x instanceof InvokableBase,
    ).map(x => x as InvokableBase);
    var _continue: boolean = true;
    if (invs.find(x => !x.CanBeCombined)) {
      _continue = confirm(
        '选中的组件中包含函数接口等不可组合的组件，是否继续？',
      );
    }
    if (_continue) {
      invs = invs.filter(x => x.CanBeCombined);

      if (invs.length < 2) return;

      var funcAddPosition: Point2D = Point2D.Zero;
      var invsMoveVector: Vector2D = Vector2D.Zero;
      invs.forEach(_inv => {
        funcAddPosition.x += _inv.Position.x;
        funcAddPosition.y += _inv.Position.y;
        invsMoveVector.x = Math.min(_inv.Position.x, invsMoveVector.x);
        invsMoveVector.y = Math.min(_inv.Position.y, invsMoveVector.y);
      });
      funcAddPosition.x /= invs.length;
      funcAddPosition.y /= invs.length;
      invsMoveVector.x = -invsMoveVector.x + 200;
      invsMoveVector.y = -invsMoveVector.y + 200;

      var inputLinks = this.GetInvsInputLinks(invs);
      var outputLinks = this.GetInvsOutputLinks(invs);
      var datainputLinks = this.GetInvsDataInputLinks(invs);
      var dataoutputLinks = this.GetInvsDataOutputLinks(invs);

      var funcInv = new InvFunction();
      funcInv.Note = '请自行编辑接口名称';
      funcInv.Position = funcAddPosition;

      RUHelper.Core.CreateTransaction('Combine-Invs');
      RUHelper.AddItem(this.SubInvs, funcInv);
      if (this.InvFunc)
        RUHelper.SetProperty(funcInv, 'FatherItem', this.InvFunc, null);
      else RUHelper.SetProperty(funcInv, 'Scene', this.Scene, null);

      inputLinks.forEach(inputl => {
        var funcI = new FuncInput();
        var target = inputl.GetEndAccepter();
        var fromHandler = inputl.StartHandler;
        funcI.Position = invsMoveVector
          .add(new Vector2D(-160, -80))
          .translatePoint(target.AccepterPosition);
        while (
          funcInv.SubItems.find(
            x => x.Position.minus(funcI.Position).length < 60,
          )
        ) {
          funcI.Position.y += 100;
        }
        funcI.InvId = target.Id;
        RUHelper.AddItem(funcInv.SubItems, funcI);
        RUHelper.SetProperty(funcI, 'FatherItem', funcInv, null);
        fromHandler.HandlerValue = IdHelper.ReplaceId(
          fromHandler.HandlerValue,
          target.Id,
          funcI.Id,
        );
      });

      outputLinks.forEach(outputl => {
        var funcO = new FuncOutput();
        var target = outputl.GetEndAccepter();
        var fromHandler = outputl.StartHandler;
        funcO.Position = invsMoveVector
          .add(new Vector2D(100, -80))
          .translatePoint(fromHandler.HandlerPosition);
        while (
          funcInv.SubItems.find(
            x => x.Position.minus(funcO.Position).length < 60,
          )
        ) {
          funcO.Position.y += 100;
        }
        fromHandler.HandlerValue = IdHelper.ReplaceId(
          fromHandler.HandlerValue,
          target.Id,
          funcO.Id,
        );
        funcO.InvId = target.Id;
        RUHelper.AddItem(funcInv.SubItems, funcO);
        RUHelper.SetProperty(funcO, 'FatherItem', funcInv, null);
      });

      datainputLinks.forEach((dinputl: InputDataPoint) => {
        var dfuncI = new FuncDataInput();
        var fromInfo = dinputl.FromInfo;
        dfuncI.Position = invsMoveVector
          .add(new Vector2D(-160, -80))
          .translatePoint(dinputl.PointPosition);
        while (
          funcInv.SubItems.find(
            x => x.Position.minus(dfuncI.Position).length < 60,
          )
        ) {
          dfuncI.Position.y += 100;
        }
        dfuncI.InputDataInfos = [fromInfo];
        var swapfrominfo = new DataPointInfo();
        swapfrominfo.DataSourceType = DataSourceType.Invoke;
        swapfrominfo.DataSourceId = dfuncI.Id;
        swapfrominfo.DataIndex = 0;
        dinputl.FromInfo = swapfrominfo;
        RUHelper.AddItem(funcInv.SubItems, dfuncI);
        RUHelper.SetProperty(dfuncI, 'FatherItem', funcInv, null);
      });

      dataoutputLinks.forEach((doutputl: InputDataPoint) => {
        var dfuncO = new FuncDataOutput();
        var fromInfo = doutputl.FromInfo;
        dfuncO.Position = invsMoveVector
          .add(new Vector2D(100, -80))
          .translatePoint(doutputl.From?.PointPosition);
        while (
          funcInv.SubItems.find(
            x => x.Position.minus(dfuncO.Position).length < 60,
          )
        ) {
          dfuncO.Position.y += 100;
        }
        dfuncO.InputDataInfos = [fromInfo];
        var swapfrominfo = new DataPointInfo();
        swapfrominfo.DataSourceType = DataSourceType.Invoke;
        swapfrominfo.DataSourceId = dfuncO.Id;
        swapfrominfo.DataIndex = 0;
        doutputl.FromInfo = swapfrominfo;
        RUHelper.AddItem(funcInv.SubItems, dfuncO);
        RUHelper.SetProperty(dfuncO, 'FatherItem', funcInv, null);
      });

      for (var inv of invs) {
        if (inv.FatherList != null) {
          var fatherlist = inv.FatherList;
          RUHelper.SetProperty(inv, 'Scene', null, this.Scene);
          RUHelper.SetProperty(inv, 'FatherItem', funcInv, inv.FatherItem);

          RUHelper.RemoveItem(fatherlist, inv);
          RUHelper.AddItem(funcInv.SubItems, inv);
          inv.Position = invsMoveVector.translatePoint(inv.Position);
        }
      }

      RUHelper.Core.CommitTransaction(
        (() => {
          invs.forEach(x => {
            x.RefreshInputDataLinks();
            x.InvokeHandlers?.forEach(h => h.RefreshLinks());
          });
          funcInv?.RefreshInputDataLinks();
          funcInv?.InvokeHandlers?.forEach(h => h.RefreshLinks());
          this.ClearUnuseLines();
        }).bind(this),
      );
    }
  }

  GetTotalInvs(selectedInvs: InvokableBase[]) {
    var result = [];
    selectedInvs?.forEach(x => {
      result.push(x);
      if (x instanceof InvokableGroup) result.push(...x.TotalInvItems);
    });
    return result;
  }

  GetInvsInputLinks(selectedInvs) {
    var allInvs = this.GetTotalInvs(selectedInvs);

    return this.Links.filter(
      x =>
        allInvs.includes(x.GetEndAccepter()) &&
        !allInvs.includes(x.StartHandler.Owner),
    ).sort(x => x.GetEndAccepter().AccepterPosition.y);
  }

  GetInvsOutputLinks(selectedInvs) {
    var allInvs = this.GetTotalInvs(selectedInvs);
    return this.Links.filter(
      x =>
        !allInvs.includes(x.GetEndAccepter()) &&
        allInvs.includes(x.StartHandler.Owner),
    ).sort(x => x.StartHandler.HandlerPosition.y);
  }

  GetInvsDataInputLinks(selectedInvs) {
    var allInvs = this.GetTotalInvs(selectedInvs);
    return this.DataLinks.filter(
      x =>
        allInvs.includes(x.Owner) &&
        x instanceof InputDataPoint &&
        x.From != null &&
        !allInvs.includes(x.From.Owner),
    ).sort(x => x.PointPosition.y);
  }

  GetInvsDataOutputLinks(selectedInvs) {
    var allInvs = this.GetTotalInvs(selectedInvs);
    return this.DataLinks.filter(
      x =>
        !allInvs.includes(x.Owner) &&
        x instanceof InputDataPoint &&
        x.From != null &&
        allInvs.includes(x.From.Owner),
    )
      .map(x => x as InputDataPoint)
      .sort(x => x.From.PointPosition.y);
  }

  //#endregion

  //#region 导入导出

  //#endregion
}
