import InvokableBase from '@/modelClasses/courseDetail/InvokableBase';
import { InvHandler, InvokerType } from '../../../InvokeHandlerMeta';
import { observable, reaction } from 'mobx';
import RUHelper from '@/redoundo/redoUndoHelper';
import { Expose } from '@/class-transformer';
import React from 'react';
import { ElementTypes } from '@/modelClasses/courseDetail/courseDetailenum';
import { InputNumber, Select } from 'antd';
import UIHelper from '@/utils/uiHelper';
import ReactDOM from 'react-dom';
import TransformAdorner, {
  AdornerTrans,
} from '@/components/cwDesignUI/control/transfromAdorner';
import EditItemView from '@/components/cwDesignUI/elements/elementItemUI';
import { Point2D, Vector2D } from '@/utils/Math2D';
import LoopWork from '@/modelClasses/courseDetail/toolbox/LoopWork';
import { stores } from '@/pages';
import IdHelper from '@/utils/idHelper';
import CommonElementsSelector from '@/components/cwDesignUI/control/showHideItems/commonElementsSelector';
import { AppearItemIcon } from '@/svgs/designIcons';

export const SimpleAniActuatorTemplate = (inv: SimpleAniActuator) => {
  if (inv) {
    return (
      <div
        style={{
          display: '-webkit-box',
          WebkitBoxOrient: 'vertical',
          WebkitBoxPack: 'start',
        }}
      >
        <div
          style={{
            display: '-webkit-box',
            WebkitBoxOrient: 'horizontal',
            WebkitBoxPack: 'start',
            WebkitBoxAlign: 'center',
            whiteSpace: 'nowrap',
            marginTop: '5px',
          }}
        >
          {'目标'}
          <CommonElementsSelector
            scene={inv.Scene}
            style={{ width: '14px', height: '14px', marginLeft: '3px' }}
            selectorName="选择元素"
            icon={AppearItemIcon}
            elementIds={inv.TargetId}
            elementIdsChanged={newIds => (inv.TargetId = newIds)}
            isSingle={inv.IsMustSelectSingleTarget}
            isDisableCombined={false}
          ></CommonElementsSelector>
        </div>
        {inv.TargetId ? (
          <div
            style={{
              display: '-webkit-box',
              WebkitBoxOrient: 'horizontal',
              WebkitBoxPack: 'start',
              WebkitBoxAlign: 'center',
              whiteSpace: 'nowrap',
              marginTop: '5px',
            }}
            onWheel={e => e.stopPropagation()}
          >
            {'变换'}
            <Select
              size="small"
              style={{
                marginLeft: '6px',
                marginRight: '6px',
                height: '24px',
                width: '80px',
              }}
              value={String(inv.PropertyName || '')}
              onChange={v => (inv.PropertyName = String(v || ''))}
            >
              {Array.from(inv.Properties).map((kvp, i) => {
                return (
                  <Select.Option key={i} value={kvp[0]}>
                    {kvp[1]}
                  </Select.Option>
                );
              })}
            </Select>
            {inv.NeedDuration ? (
              <div style={{ display: 'inline-block' }}>
                {'动画时长'}
                <InputNumber
                  style={{ marginLeft: '10px', width: '60px' }}
                  size="small"
                  min={0}
                  max={Number.POSITIVE_INFINITY}
                  step={0.1}
                  precision={2}
                  value={Number(inv.Duration) || 0}
                  onChange={v => (inv.Duration = Number(v))}
                />
              </div>
            ) : null}
          </div>
        ) : null}
        <div
          style={{
            display: '-webkit-box',
            WebkitBoxOrient: 'horizontal',
            WebkitBoxPack: 'start',
            WebkitBoxAlign: 'center',
            whiteSpace: 'nowrap',
            marginTop: '5px',
          }}
        >
          {(() => {
            if (inv.TargetId) {
              switch (inv.PropertyName) {
                case 'Position':
                  return [
                    <label key={0}>目标位置</label>,
                    <label key={1} style={{ marginLeft: '3px' }}>
                      X:
                    </label>,
                    <InputNumber
                      key={2}
                      style={{ marginLeft: '3px', width: '80px' }}
                      size="small"
                      step={10}
                      value={Number(inv.TargetValue?.[0] || 0)}
                      onChange={v => {
                        if (inv.TargetValue && inv.TargetValue.length > 1)
                          inv.TargetValue = [
                            Number(v || 0),
                            inv.TargetValue[1],
                          ];
                      }}
                    />,
                    <label key={3} style={{ marginLeft: '3px' }}>
                      Y:
                    </label>,
                    <InputNumber
                      key={4}
                      style={{ marginLeft: '3px', width: '80px' }}
                      size="small"
                      step={10}
                      value={Number(inv.TargetValue?.[1] || 0)}
                      onChange={v => {
                        if (inv.TargetValue && inv.TargetValue.length > 1)
                          inv.TargetValue = [
                            inv.TargetValue[0],
                            Number(v || 0),
                          ];
                      }}
                    />,
                  ];
                case 'Move':
                  return [
                    <label key={0}>移动向量</label>,
                    <label key={1} style={{ marginLeft: '3px' }}>
                      X:
                    </label>,
                    <InputNumber
                      key={2}
                      style={{ marginLeft: '3px', width: '80px' }}
                      size="small"
                      step={10}
                      value={Number(inv.TargetValue?.[0] || 0)}
                      onChange={v => {
                        if (inv.TargetValue && inv.TargetValue.length > 1)
                          inv.TargetValue = [
                            Number(v || 0),
                            inv.TargetValue[1],
                          ];
                      }}
                    />,
                    <label key={3} style={{ marginLeft: '3px' }}>
                      Y:
                    </label>,
                    <InputNumber
                      key={4}
                      style={{ marginLeft: '3px', width: '80px' }}
                      size="small"
                      step={10}
                      value={Number(inv.TargetValue?.[1] || 0)}
                      onChange={v => {
                        if (inv.TargetValue && inv.TargetValue.length > 1)
                          inv.TargetValue = [
                            inv.TargetValue[0],
                            Number(v || 0),
                          ];
                      }}
                    />,
                  ];
                case 'Angle':
                  return [
                    <label key={0}>目标角度</label>,
                    <InputNumber
                      key={1}
                      style={{ marginLeft: '3px', width: '80px' }}
                      size="small"
                      step={10}
                      value={Number(inv.TargetValue?.[0] || 0)}
                      onChange={v => {
                        if (inv.TargetValue && inv.TargetValue.length > 0)
                          inv.TargetValue = [Number(v || 0)];
                      }}
                    />,
                  ];
                case 'Scale':
                  return [
                    <label key={0}>目标缩放比</label>,
                    <label key={1} style={{ marginLeft: '3px' }}>
                      宽:
                    </label>,
                    <InputNumber
                      key={2}
                      style={{ marginLeft: '3px', width: '80px' }}
                      size="small"
                      step={5}
                      value={Number(inv.TargetValue?.[0] || 0)}
                      onChange={v => {
                        if (inv.TargetValue && inv.TargetValue.length > 1)
                          inv.TargetValue = [
                            Number(v || 0),
                            inv.TargetValue[1],
                          ];
                      }}
                      formatter={v => v + '%'}
                      parser={value => value.replaceAll('%', '')}
                    />,
                    <label key={3} style={{ marginLeft: '3px' }}>
                      高:
                    </label>,
                    <InputNumber
                      key={4}
                      style={{ marginLeft: '3px', width: '80px' }}
                      size="small"
                      step={5}
                      value={Number(inv.TargetValue?.[1] || 0)}
                      onChange={v => {
                        if (inv.TargetValue && inv.TargetValue.length > 1)
                          inv.TargetValue = [
                            inv.TargetValue[0],
                            Number(v || 0),
                          ];
                      }}
                      formatter={v => v + '%'}
                      parser={value => value.replaceAll('%', '')}
                    />,
                  ];
                case 'Transparent':
                  return [
                    <label key={0}>目标不透明度</label>,
                    <InputNumber
                      key={1}
                      style={{ marginLeft: '3px', width: '80px' }}
                      size="small"
                      step={5}
                      max={100}
                      min={0}
                      value={Number(inv.TargetValue?.[0] || 0)}
                      onChange={v => {
                        if (inv.TargetValue && inv.TargetValue.length > 0)
                          inv.TargetValue = [Number(v || 0)];
                      }}
                      formatter={v => v + '%'}
                      parser={value => value.replaceAll('%', '')}
                    />,
                  ];
              }
            }
            return null;
          })()}
        </div>
      </div>
    );
  }
  return null;
};

export default class SimpleAniActuator extends InvokableBase {
  constructor() {
    super();
    this.SettingTemplate = SimpleAniActuatorTemplate;
  }

  static propertiesDic: Map<string, string> = new Map<string, string>([
    ['Show', '出现'],
    ['Hide', '消失'],
    ['Position', '位置'],
    ['Move', '移动'],
    ['Angle', '旋转'],
    ['Scale', '比例'],
    ['Transparent', '透明度'],
    ['Cursor', '鼠标'],
  ]);

  static multiTargetPropertiesDic: Map<string, string> = new Map<
    string,
    string
  >([
    ['Show', '出现'],
    ['Hide', '消失'],
  ]);

  @InvHandler({ DisplayName: '完成后执行', Type: InvokerType.Event })
  public get InvId() {
    return super.InvId;
  }
  public set InvId(v) {
    super.InvId = v;
  }

  @observable
  private _TargetId: string;
  @Expose()
  public get TargetId(): string {
    return this._TargetId;
  }
  public set TargetId(v: string) {
    var action = () => {
      this.ClearTransResult();
      this._TargetId = v;
      this.InitTargetValue();
    };
    RUHelper.TrySetPropRedoUndo(
      this,
      'TargetId',
      action.bind(this),
      v,
      this._TargetId,
    );
  }

  get IsMultiTarget() {
    var idList = IdHelper.ToIdList(this.TargetId);
    return idList.length > 1;
  }

  get IsMustSelectSingleTarget() {
    if (!this.PropertyName) return false;
    if (!SimpleAniActuator.multiTargetPropertiesDic.has(this.PropertyName))
      return true;
    return false;
  }

  get Properties() {
    return this.IsMultiTarget
      ? SimpleAniActuator.multiTargetPropertiesDic
      : SimpleAniActuator.propertiesDic;
  }

  @observable
  private _PropertyName: string = 'Position';
  @Expose()
  public get PropertyName(): string {
    return this._PropertyName;
  }
  public set PropertyName(v: string) {
    var action = () => {
      this._PropertyName = v;
      this.InitTargetValue();
    };
    RUHelper.TrySetPropRedoUndo(
      this,
      'PropertyName',
      action.bind(this),
      v,
      this._PropertyName,
    );
  }

  @observable
  private _Duration: number = 0.8;
  @Expose()
  public get Duration(): number {
    return this._Duration;
  }
  public set Duration(v: number) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'Duration',
      () => (this._Duration = v),
      v,
      this._Duration,
    );
  }

  public get NeedDuration() {
    switch (this.PropertyName) {
      case 'Show':
      case 'Hide':
        return false;
      default:
        return true;
    }
  }

  @observable
  private _TargetValue: any[];
  public get TargetValue(): any[] {
    return this._TargetValue;
  }
  public set TargetValue(v: any[]) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'TargetValue',
      () => (this._TargetValue = v),
      v,
      this._TargetValue,
    );
  }

  private _tempTargetValueStr: string;
  @Expose()
  public get TargetValueStr(): string {
    if (this.TargetValue != null && this.TargetValue.length > 0)
      return this.TargetValue?.map(x => x.toString()).join(',');
    if (this._tempTargetValueStr) return this._tempTargetValueStr;
    return null;
  }
  public set TargetValueStr(v: string) {
    this._tempTargetValueStr = v;
    switch (this.PropertyName) {
      case 'Position':
      case 'Move':
      case 'Angle':
      case 'Scale':
      case 'Transparent':
        if (v) {
          var tValue = [];
          try {
            var decs = v.split(',').map(x => Number(x || 0));
            for (var _dec of decs) tValue.push(_dec);
          } catch (ex) {
            console.log(ex);
          }
          this.TargetValue = tValue;
        } else this.TargetValue = null;
        break;
      case 'Cursor':
        break;
      default:
        break;
    }
  }

  protected targetValueChanged = reaction(
    () => this.TargetValueStr,
    str => {
      this.DrawTransResult();
    },
    {
      fireImmediately: false,
    },
  );

  OnIsSelectedChanged() {
    super.OnIsSelectedChanged();
    if (!this.IsSelected) {
      this.ClearTransResult();
      LoopWork.Instance.removeMission(this);
    } else {
      this.DrawTransResult();
      LoopWork.Instance.setMission(
        this,
        this.UnSelectWhenStageActive.bind(this),
      );
    }
  }

  OnDeleting() {
    super.OnDeleting();
    this.ClearTransResult();
    LoopWork.Instance.removeMission(this);
  }

  UnSelectWhenStageActive() {
    if (!stores.commander.IsActiveLogicDesign) {
      this.ClearTransResult();
    }
    // else if (this.IsSelected) {
    //   this.DrawTransResult();
    // }
  }

  @observable
  adorner: AdornerTrans;

  ClearTransResult() {
    var targetItem = this.Scene?.TotalEditItemList?.find(
      x => x.Id == this.TargetId,
    );

    var adorner = this.FindExsitAdorner();
    if (adorner != null && this.Scene != null) {
      this.RemoveAdorner(adorner);
      if (!SimpleAniActuator.adornerDic.has(adorner)) {
        ReactDOM.unmountComponentAtNode(adorner.adornerDiv);
        adorner.adornerDiv.remove();
        // if (targetItem != null)
        //   targetItem.IsEmphasized = false;
      }
    }
  }

  InitTargetValue() {
    var targetItem = this.Scene?.TotalEditItemList?.find(
      x => x.Id == this.TargetId,
    );
    if (targetItem != null) {
      switch (this.PropertyName) {
        case 'Angle':
          this.TargetValue = [targetItem.Angle];
          break;
        case 'Scale':
          this.TargetValue = [100.0, 100.0];
          break;
        case 'Position':
          this.TargetValue = [targetItem.X, targetItem.Y];
          break;
        case 'Move':
          this.TargetValue = [0.0, 0.0];
          break;
        case 'Transparent':
          this.TargetValue = [targetItem.Transparent];
          break;
        default:
          break;
      }
      this.ClearTransResult();
      this.DrawTransResult();
    }
  }

  DrawTransResult() {
    var targetItem = this.Scene?.TotalEditItemList?.find(
      x => x.Id == this.TargetId,
    );

    if (!this.IsSelected) this.IsSelected = true;

    if (targetItem != null) {
      targetItem.IsOprating = true;
      // targetItem.IsEmphasized = true;
      // if (targetItem.Father != null)
      // {
      //     targetItem.Father.IsAutoSelectingByTriggers = true;
      //     this.Scene.SelectedItem = targetItem.Father;
      //     targetItem.Father.IsAutoSelectingByTriggers = false;
      // }

      var itemMainView = targetItem.MainView;
      this.adorner = this.FindExsitAdorner();
      if (this.adorner == null && itemMainView) {
        var stageCanvas = UIHelper.FindAncestorByClassName(
          itemMainView.rootEl,
          'StageCanvas',
        );
        var adornerLayer = stageCanvas?.getElementsByClassName(
          'adornerLayer',
        )?.[0];
        if (adornerLayer) {
          var angle = 0.0;
          if (targetItem.Father != null)
            angle = targetItem.Father.AbsoluteAngle;
          this.adorner = new AdornerTrans();
          var div = document.createElement('div');
          this.adorner.adornerDiv = div;
          this.adorner.fatherAngle = angle;
          this.adorner.defaultAngle = targetItem.Angle;
          this.adorner.attchedTo = itemMainView.rootEl;
          this.adorner.container = stageCanvas as HTMLElement;
          ReactDOM.render(
            <TransformAdorner
              transform={this.adorner}
              // followElement={true}
            >
              <EditItemView
                isMainView={false}
                dataContext={targetItem}
                style={{ background: '#FF00002F', transform: '' }}
              ></EditItemView>
            </TransformAdorner>,
            div,
          );
          adornerLayer.appendChild(div);
        }
      }
      if (this.adorner != null) {
        this.SetAdorner(this.adorner);
        switch (this.PropertyName) {
          case 'Angle':
            var target_angle = Number(this.TargetValueStr);
            if (this.adorner.angle != target_angle)
              this.adorner.angle = target_angle;
            break;
          case 'Transparent':
            var opacity = Number(this.TargetValueStr) / 100.0;
            this.adorner.adornerDiv.style.opacity = `${opacity}`;
            break;
          case 'Scale':
            var scale_pos = Vector2D.parseFromString(this.TargetValueStr);
            var res_scale = new Vector2D(
              scale_pos.x / 100.0,
              scale_pos.y / 100.0,
            );
            if (!res_scale.equals(this.adorner.scale))
              this.adorner.scale = res_scale;
            break;
          case 'Position':
            var target_pos = Vector2D.parseFromString(this.TargetValueStr);
            var target_abs_pos = target_pos;
            if (targetItem.Father != null)
              target_abs_pos = targetItem.Father.AbsoluteMatrix.TransformVector(
                new Vector2D(
                  target_pos.x + targetItem.Width / 2,
                  target_pos.y + targetItem.Height / 2,
                ),
              ).minus(
                new Vector2D(targetItem.Width / 2, targetItem.Height / 2),
              );
            var originPos = targetItem.AbsolutePosition;
            var res_pos = new Vector2D(
              target_abs_pos.x - originPos.x,
              target_abs_pos.y - originPos.y,
            );
            if (!res_pos.equals(this.adorner.translate))
              this.adorner.translate = res_pos;
            break;
          case 'Move':
            var move_vector = Vector2D.parseFromString(this.TargetValueStr);
            if (!move_vector.equals(this.adorner.translate))
              this.adorner.translate = move_vector;
            break;
          default:
            break;
        }
      }
      targetItem.IsOprating = false;
    }
  }

  static adornerDic: Map<AdornerTrans, SimpleAniActuator[]> = new Map<
    AdornerTrans,
    SimpleAniActuator[]
  >();

  getAdornerLayer() {
    var targetItem = this.Scene?.TotalEditItemList?.find(
      x => x.Id == this.TargetId,
    );
    var itemMainView = targetItem?.MainView;
    if (itemMainView) {
      var stageCanvas = UIHelper.FindAncestorByClassName(
        itemMainView?.rootEl,
        'StageCanvas',
      );
      var adornerLayer = stageCanvas.getElementsByClassName(
        'adornerLayer',
      )?.[0];
      return adornerLayer;
    }
    return null;
  }

  FindExsitAdorner() {
    var targetItem = this.Scene?.TotalEditItemList?.find(
      x => x.Id == this.TargetId,
    );
    var itemMainView = targetItem?.MainView;
    if (itemMainView) {
      for (var kvp of SimpleAniActuator.adornerDic) {
        var adorner = kvp[0];
        if (adorner.attchedTo == itemMainView.rootEl) return adorner;
      }
    }
    return null;
  }

  SetAdorner(adorner: AdornerTrans) {
    var adornerDic = SimpleAniActuator.adornerDic;
    if (!adornerDic.has(adorner)) {
      adornerDic.set(adorner, []);
    }
    var list = adornerDic.get(adorner);
    if (list.includes(this)) return;
    if (this.PropertyName) {
      //移除相同属性的执行器
      var exsitSamePropActuator = list.find(
        x => x.PropertyName == this.PropertyName,
      );
      if (exsitSamePropActuator != null)
        list.splice(list.indexOf(exsitSamePropActuator), 1);
      list.push(this);
    }
  }

  RemoveAdorner(adorner: AdornerTrans) {
    if (SimpleAniActuator.adornerDic.has(adorner)) {
      var list = SimpleAniActuator.adornerDic.get(adorner);
      if (list.includes(this)) {
        list.splice(list.indexOf(this), 1);
        switch (this.PropertyName) {
          case 'Angle':
            adorner.angle = null;
            break;
          case 'Transparent':
            this.adorner.adornerDiv.style.opacity = '1.0';
            break;
          case 'Scale':
            adorner.scale = null;
            break;
          case 'Position':
          case 'Move':
            adorner.translate = null;
            break;
        }
      }
      if (list.length == 0) SimpleAniActuator.adornerDic.delete(adorner);
    }
  }
}
