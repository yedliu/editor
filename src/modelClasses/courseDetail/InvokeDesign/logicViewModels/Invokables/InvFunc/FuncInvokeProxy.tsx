import { observable } from 'mobx';
import RUHelper from '@/redoundo/redoUndoHelper';
import React from 'react';
import { InvHandler, InvokerType } from '../../../InvokeHandlerMeta';
import { ViewTemplate } from '@/modelClasses/courseDetail/toolbox/CustomTypeDefine';
import InvokableBase from '@/modelClasses/courseDetail/InvokableBase';
import InvFunction from './InvFunction';
import { Point2D, GeometryHelper } from '@/utils/Math2D';
import ILogicDesignItem from '../../ILogicDesignItem';
import UIHelper from '@/utils/uiHelper';
import InvokeHandler from '../../../InvokeHandler';
import { Expose } from '@/class-transformer';
import {
  InputDataPoint,
  OutputDataPoint,
  DataSourceType,
  DataPointInfo,
} from '@/modelClasses/courseDetail/DataPoint';
import ObjHelper from '@/utils/objHelper';
import { InputNumber } from 'antd';
import TypeMapHelper from '@/configs/typeMapHelper';

export class FuncInvokeProxy extends InvokableBase {
  public get SelfInvokable() {
    return false;
  }

  get CanBeCombined() {
    return false;
  }

  public readonly HeaderBg: string = '#CF8FCF';
  public readonly HeaderFg: string = '#DFDFDF';
  public readonly DetailBg: string = '#BFBFBF';

  public get FatherFunc(): InvFunction {
    if (this.FatherItem && this.FatherItem instanceof InvFunction)
      return this.FatherItem as InvFunction;
    return null;
  }

  @observable
  private _OrderIndex: number;
  @Expose()
  public get OrderIndex(): number {
    return this._OrderIndex;
  }
  public set OrderIndex(v: number) {
    if (this.FatherFunc == null || this.FatherFunc.ResettingPortsOrder) {
      RUHelper.TrySetPropRedoUndo(
        this,
        'OrderIndex',
        () => (this._OrderIndex = v),
        v,
        this._OrderIndex,
      );
    } else {
      this.FatherFunc.SetOrderIndex(this, v);
    }
  }

  private _settingTemplate: ViewTemplate = (inv: FuncInvokeProxy) => {
    return (
      <div
        style={{
          display: '-webkit-box',
          WebkitBoxPack: 'justify',
          WebkitBoxAlign: 'center',
          whiteSpace: 'nowrap',
        }}
      >
        {'接口序号'}
        <InputNumber
          style={{
            width: '50px',
          }}
          size="small"
          defaultValue={0}
          min={0}
          max={Number.POSITIVE_INFINITY}
          step={1}
          value={Number(inv.OrderIndex)}
          onChange={v => (inv.OrderIndex = Number(v))}
        ></InputNumber>
      </div>
    );
  };

  constructor() {
    super();
    this.SettingTemplate = this._settingTemplate;
  }

  RaiseFuncPortOrder() {}
}

export class FuncInput extends FuncInvokeProxy {
  get CanInvoke() {
    return false;
  }

  @InvHandler({ Type: InvokerType.Invoke, DisplayName: '调用' })
  public get InvId(): string {
    return super.InvId;
  }
  public set InvId(v: string) {
    super.InvId = v;
  }

  //#region 连线与点的位置

  public get AccepterPosition(): Point2D {
    return super.AccepterPosition;
  }
  public set AccepterPosition(v: Point2D) {
    if (this._AccepterPosition != v) {
      this._AccepterPosition = v;
      //this.FatherItem?.LogicDesign?.Links?.filter(x => x.GetEndAccepter() == this)?.forEach(x =>x.Refresh());
    }
  }

  RefreshHandlerPosition(accepterIcon: HTMLElement) {
    var func = this.FatherItem;
    if (
      func != null &&
      func.LogicDesign != null &&
      func.Scene != null &&
      func.Scene.Courseware != null &&
      func.LogicDesign.Scene == func.LogicDesign.Scene.Courseware.SelectedPage
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

  //#endregion

  CheckCanBeInvoked(invoker: ILogicDesignItem) {
    return true;
  }

  OnDeleting() {
    super.OnDeleting();
    var invLinks = this.FatherItem?.LogicDesign?.Links.filter(
      x => x.TargetId == this.Id,
    );
    if (invLinks != null && invLinks.length > 0)
      invLinks.forEach(x => x.StartHandler.RemoveTargetId(this.Id));
  }

  RaiseFuncPortOrder() {
    this.FatherFunc?.RaiseInputInvokeProxys();
  }
}

export class FuncOutput extends FuncInvokeProxy {
  @InvHandler({
    Type: InvokerType.Invoke,
    DisplayName: '',
    DisplayInOwner: false,
  })
  public get InvId(): string {
    return super.InvId;
  }
  public set InvId(v: string) {
    if (super.InvId != v) {
      super.InvId = v;
      this.InvHandler?.RefreshLinks();
    }
  }

  @observable
  private _InvHandler: InvokeHandler = null;

  public get InvHandler(): InvokeHandler {
    if (this._InvHandler == null) {
      var typesMap = TypeMapHelper.InvokableTypeDiscriminator.subTypes;
      var ownerTypeMap = typesMap.find(x => x.value === this.constructor);
      var lineColors = ownerTypeMap?.linecolor;
      var color = 'black';
      if (lineColors != null) {
        var color_str = lineColors['InvId'];
        if (color_str) {
          color = color_str;
        }
      }
      var result = new InvokeHandler();
      result.InvokerProperty = 'InvId';
      result.Owner = this;
      result.LineColor = color;
      this._InvHandler = result;
    }
    return this._InvHandler;
  }

  CheckCanInvoke(target: InvokableBase) {
    if (target == this) return false;
    var func = this.FatherItem;
    if (
      func != null &&
      func.LogicDesign != null &&
      target.LogicDesign != null &&
      !func.LogicDesign.AvailableLinkTargets.includes(target)
    )
      return false;
    return true;
  }

  OnDeleting() {
    super.OnDeleting();
    this.InvHandler?.ClearTargetId();
  }

  RaiseFuncPortOrder() {
    this.FatherFunc?.RaiseOutputInvokeProxys();
  }
}

export class FuncDataInput extends FuncInvokeProxy {
  public readonly HeaderBg: string = '#8F8FCF';
  public readonly HeaderFg: string = '#DFDFDF';
  public readonly DetailBg: string = '#BFBFBF';

  get CanInvoke() {
    return false;
  }
  get InputDataPoints(): InputDataPoint[] {
    if (this._InputDataPoints == null) {
      var defaultInputDataPoint = new InputDataPoint();
      defaultInputDataPoint.Owner = this;
      this._InputDataPoints = [defaultInputDataPoint];
    }
    return this._InputDataPoints;
  }

  GetOutputParameters() {
    return ['数值输入'];
  }

  RaiseFuncPortOrder() {
    this.FatherFunc?.RaiseInputDataProxys();
  }
}

export class FuncDataOutput extends FuncInvokeProxy {
  get CanInvoke() {
    return false;
  }

  public readonly HeaderBg: string = '#8F8FCF';
  public readonly HeaderFg: string = '#DFDFDF';
  public readonly DetailBg: string = '#BFBFBF';

  get OutputDataPoints() {
    if (this._OutputDataPoints == null) {
      this._OutputDataPoints = [];
      var point = new OutputDataPoint(
        Object.assign(new DataPointInfo(), {
          DataSourceId: this.Id,
          DataSourceType: DataSourceType.Invoke,
        }),
      );
      point.Owner = this;
      this._OutputDataPoints.push(point);
    }
    return this._OutputDataPoints;
  }

  GetInputParameters() {
    return ['数值输出;disableCustom'];
  }

  OnDeleting() {
    super.OnDeleting();
    var effectivelinks = this.FatherItem?.LogicDesign?.DataLinks.filter(
      x =>
        x instanceof InputDataPoint &&
        x.FromInfo != null &&
        x.FromInfo.DataSourceId == this.Id,
    ).map(x => x as InputDataPoint);
    effectivelinks?.forEach(x => (x.FromInfo = null));
  }
  RaiseFuncPortOrder() {
    this.FatherFunc?.RaiseOutputDataProxys();
  }
}
