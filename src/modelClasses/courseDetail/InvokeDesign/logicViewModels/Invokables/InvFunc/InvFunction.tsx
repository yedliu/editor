import { observable, computed } from 'mobx';
import InvokableGroup from '../InvokableGroup';
import LogicDesign from '@/modelClasses/courseDetail/logicDesign';
import {
  FuncInvokeProxy,
  FuncInput,
  FuncOutput,
  FuncDataInput,
  FuncDataOutput,
} from './FuncInvokeProxy';
import { from } from 'linq-to-typescript';
import InvokeHandler from '../../../InvokeHandler';
import {
  InputDataPoint,
  OutputDataPoint,
} from '@/modelClasses/courseDetail/DataPoint';
import RUHelper from '@/redoundo/redoUndoHelper';
import InnerWindow from '@/components/controls/innerWindow';
import LogicDesignView from '@/components/cwDesignUI/logicView/logicDesignView';
import React from 'react';

export default class InvFunction extends InvokableGroup {
  readonly Role = 'Func';
  readonly HeaderBg = '#CC8888';
  readonly DetailBg = '#CCB2B2';

  get InputInvokeProxys(): FuncInput[] {
    if (this.SubItems)
      return from(
        this.SubItems.filter(x => x instanceof FuncInput).map(
          x => x as FuncInput,
        ),
      )
        ?.orderBy(x => x.OrderIndex)
        .toArray();
    return [];
  }

  get OutputInvokeProxys(): FuncOutput[] {
    if (this.SubItems)
      return from(
        this.SubItems?.filter(x => x instanceof FuncOutput).map(
          x => x as FuncOutput,
        ),
      )
        ?.orderBy(x => x.OrderIndex)
        .toArray();
    return null;
  }

  get InputDataProxys(): FuncDataInput[] {
    if (this.SubItems)
      return from(
        this.SubItems?.filter(x => x instanceof FuncDataInput).map(
          x => x as FuncDataInput,
        ),
      )
        ?.orderBy(x => x.OrderIndex)
        .toArray();
    return null;
  }

  get OutputDataProxys(): FuncDataOutput[] {
    if (this.SubItems)
      return from(
        this.SubItems?.filter(x => x instanceof FuncDataOutput).map(
          x => x as FuncDataOutput,
        ),
      )
        ?.orderBy(x => x.OrderIndex)
        .toArray();
    return null;
  }

  @observable
  private _InnerLogicDesign: LogicDesign;
  public get InnerLogicDesign(): LogicDesign {
    return this._InnerLogicDesign;
  }
  public set InnerLogicDesign(v: LogicDesign) {
    this._InnerLogicDesign = v;
  }

  // @observable
  // needRebuildInvHandlers: boolean = false;
  // get InvokeHandlers(): InvokeHandler[] {
  //   if (this._InvokeHandlers == null || this.needRebuildInvHandlers) {
  //     this._InvokeHandlers = this.OutputInvokeProxys?.map(x => x.InvHandler);
  //     this.needRebuildInvHandlers = false;
  //   }
  //   if (this._InvokeHandlers) return this._InvokeHandlers;
  //   return [];
  // }

  @computed
  get InvokeHandlers(): InvokeHandler[] {
    return this.OutputInvokeProxys?.map(x => x.InvHandler) || [];
  }

  get InputDataInfos() {
    return null;
  }
  set InputDataInfos(v) {}

  get InputDataPoints(): InputDataPoint[] {
    return this.InputDataProxys?.map(x => x.InputDataPoints[0]);
  }

  get OutputDataPoints(): OutputDataPoint[] {
    return this.OutputDataProxys?.map(x => x.OutputDataPoints[0]);
  }

  ResettingPortsOrder: boolean = false;

  OpenWindow() {
    if (this.LogicDesign != null) {
      this.ActiveWindow();
      if (!this.LogicDesign.OpennedSubFuncs.includes(this)) {
        this.InitInnerLogicDesign();
        var index = this.LogicDesign.OpennedSubFuncs.indexOf(null);
        if (index == -1) this.LogicDesign.OpennedSubFuncs.push(this);
        else this.LogicDesign.OpennedSubFuncs.splice(index, 0, this);
      }
    }
  }

  CloseWindow() {
    if (
      this.LogicDesign != null &&
      this.LogicDesign.OpennedSubFuncs.includes(this)
    ) {
      var index = this.LogicDesign.OpennedSubFuncs.indexOf(this);
      this.LogicDesign.OpennedSubFuncs[index] = null;
    }
  }

  @observable
  isWindowActived: boolean = false;

  ActiveWindow() {
    this.LogicDesign?.OpennedSubFuncs?.forEach(x => {
      if (x && x != this) x.isWindowActived = false;
    });
    this.isWindowActived = true;
  }

  /** 切页时关闭编辑框 */
  CheckIsCurrentPage() {
    if (
      this.Scene == null ||
      (this.Scene.Courseware != null &&
        this.Scene != this.Scene.Courseware.SelectedPage)
    ) {
      //editDialog?.Close();
      this.TotalInvItems.filter(x => x instanceof InvFunction)
        .map(x => x as InvFunction)
        .forEach(x => x.CloseWindow());
      this.CloseWindow();
    }
  }

  //#region 初始化

  InitInnerLogicDesign() {
    if (this.InnerLogicDesign == null)
      this.InnerLogicDesign = new LogicDesign();
    this.InnerLogicDesign.InvFunc = this;
  }

  OnSubItemsChanged({ oldItems, newItems }) {
    super.OnSubItemsChanged({ oldItems, newItems });
    var inProxyChanged = false;
    var outProxyChanged = false;
    var inDataProxyChanged = false;
    var outDataProxyChanged = false;
    if (oldItems != null) {
      for (var item of oldItems) {
        var fatherlist = this.InnerLogicDesign?.LogicDItems;
        if (fatherlist && fatherlist.includes(item))
          fatherlist.splice(fatherlist.indexOf(item), 1);
        if (item instanceof FuncInput) inProxyChanged = true;
        else if (item instanceof FuncOutput) outProxyChanged = true;
        else if (item instanceof FuncDataInput) inDataProxyChanged = true;
        else if (item instanceof FuncDataOutput) outDataProxyChanged = true;
      }
    }
    if (newItems != null) {
      for (var item of newItems) {
        this.InnerLogicDesign?.LogicDItems?.push(item);
        if (item instanceof FuncInput) inProxyChanged = true;
        else if (item instanceof FuncOutput) outProxyChanged = true;
        else if (item instanceof FuncDataInput) inDataProxyChanged = true;
        else if (item instanceof FuncDataOutput) outDataProxyChanged = true;
      }
    }
    if (inProxyChanged) this.RaiseInputInvokeProxys();
    if (outProxyChanged) this.RaiseOutputInvokeProxys();
    if (inDataProxyChanged) this.RaiseInputDataProxys();
    if (outDataProxyChanged) this.RaiseOutputDataProxys();
  }

  //#endregion

  OnDeleting() {
    super.OnDeleting();
    this.InputInvokeProxys?.forEach(x => x.OnDeleting());
    this.OutputDataProxys?.forEach(x => x.OnDeleting());
    this.CloseWindow();
  }
  //#region 接口排序

  public RaiseInputInvokeProxys() {
    this.ResetPortsOrderIndex('InputInvokeProxys');
  }

  public RaiseOutputInvokeProxys() {
    this.ResetPortsOrderIndex('OutputInvokeProxys');
    //this.needRebuildInvHandlers = true;
  }

  public RaiseInputDataProxys() {
    this.ResetPortsOrderIndex('InputDataProxys');
  }

  public RaiseOutputDataProxys() {
    this.ResetPortsOrderIndex('OutputDataProxys');
  }

  ResetPortsOrderIndex(listName: string) {
    if (!this.CanRecordRedoUndo) return;
    this.ResettingPortsOrder = true;

    var list: FuncInvokeProxy[] = null;

    switch (listName) {
      case 'InputInvokeProxys':
        list = this.InputInvokeProxys;
        break;
      case 'OutputInvokeProxys':
        list = this.OutputInvokeProxys;
        break;
      case 'InputDataProxys':
        list = this.InputDataProxys;
        break;
      case 'OutputDataProxys':
        list = this.OutputDataProxys;
        break;
    }
    var i = 0;
    list?.forEach(x => (x.OrderIndex = i++));
    this.ResettingPortsOrder = false;
  }

  /**
   * 对代理接口进行排序
   */
  SetOrderIndex(invProxy: FuncInvokeProxy, targetIndex: number) {
    this.ResettingPortsOrder = true;
    if (invProxy != null) {
      var list: FuncInvokeProxy[] = null;

      switch (invProxy.Type) {
        case 'FuncInput':
          list = this.InputInvokeProxys;
          break;
        case 'FuncOutput':
          list = this.OutputInvokeProxys;
          break;
        case 'FuncDataInput':
          list = this.InputDataProxys;
          break;
        case 'FuncDataOutput':
          list = this.OutputDataProxys;
          break;
      }
      if (list != null) {
        var proxylist = [...list];
        if (
          proxylist.includes(invProxy) &&
          targetIndex != invProxy.OrderIndex
        ) {
          if (targetIndex < invProxy.OrderIndex) {
            var targetToReplace = proxylist.find(
              x => x.OrderIndex >= targetIndex,
            );
            var i = proxylist.indexOf(targetToReplace);
            if (i < proxylist.indexOf(invProxy)) {
              proxylist.splice(proxylist.indexOf(invProxy), 1);
              proxylist.splice(i, 0, invProxy);
            }
          } else {
            var targetToReplace = from(proxylist).lastOrDefault(
              x => x.OrderIndex <= targetIndex,
            );
            var i = proxylist.indexOf(targetToReplace);
            if (i > proxylist.indexOf(invProxy)) {
              proxylist.splice(proxylist.indexOf(invProxy), 1);
              proxylist.splice(i, 0, invProxy);
            }
          }
          var order = 0;
          RUHelper.Core.CreateTransaction();
          proxylist?.forEach(x => (x.OrderIndex = order++));
          RUHelper.Core.CommitTransaction();
        }
      }
    }

    this.ResettingPortsOrder = false;
  }
  //#endregion
}
