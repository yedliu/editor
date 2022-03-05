import {
  observable,
  autorun,
  action,
  IReactionDisposer,
  reaction,
  computed,
} from 'mobx';
import CWElement from '../cwElement';
import CWResource from '../cwResource';
import CWPage from '../cwpage';
import { Type, Exclude, Expose, classToClass } from '@/class-transformer';
import { ElementTypes } from '../courseDetailenum';
import CombinedItemTemplate from '@/components/cwDesignUI/elements/controlTemplates/combinedItemTemplate';
import {
  Matrix2D,
  Rect2D,
  Vector2D,
  Point2D,
  GeometryHelper,
} from '@/utils/Math2D';
import { from } from 'linq-to-typescript';
import RUHelper from '@/redoundo/redoUndoHelper';
import TypeMapHelper from '@/configs/typeMapHelper';
import ObjHelper from '@/utils/objHelper';

export default class CombinedEditItem extends CWElement {
  private resettingBoundary = false;

  constructor() {
    super();
  }

  public get IsOprating(): boolean {
    if (super.IsOprating) return true;
    return this.Children?.find(x => x.IsOprating) != null;
  }

  public set IsOprating(v: boolean) {
    super.IsOprating = v;
  }

  //#region  大小变化
  public get Width() {
    return super.Width;
  }

  public set Width(v: number) {
    if (v != 0) {
      var oldValue = this.Width;
      super.Width = v;
      if (oldValue > 0) {
        var _resetingboundary = this.resettingBoundary;

        this.resettingBoundary = true;
        var newValue = this.Width;

        var delta = newValue / oldValue;

        if (this.Children != null) {
          this.Children?.forEach(subitem => {
            var oprating = subitem.IsOprating;
            subitem.IsOprating = true;

            subitem.X *= delta;
            subitem.Width *= delta;

            subitem.IsOprating = oprating;
          });
        }
        this.resettingBoundary = _resetingboundary;
      }
    }
  }
  public get Height() {
    return super.Height;
  }

  public set Height(v: number) {
    if (v != 0) {
      var oldValue = this.Height;
      super.Height = v;
      if (oldValue > 0) {
        var _resetingboundary = this.resettingBoundary;
        this.resettingBoundary = true;
        var newValue = this.Height;

        var delta = newValue / oldValue;

        if (this.Children != null) {
          this.Children?.forEach(subitem => {
            var oprating = subitem.IsOprating;
            subitem.IsOprating = true;

            subitem.Y *= delta;
            subitem.Height *= delta;

            subitem.IsOprating = oprating;
          });
        }
        this.resettingBoundary = _resetingboundary;
      }
    }
  }

  public get BaseWidth(): number {
    return this._Width;
  }

  public set BaseWidth(v: number) {
    var oldWidth = this._Width;
    if (v >= 0) {
      RUHelper.TrySetPropRedoUndo(
        this,
        'BaseWidth',
        () => (this._Width = v),
        v,
        oldWidth,
      );
    }
  }

  public get BaseHeight(): number {
    return this._Height;
  }

  public set BaseHeight(v: number) {
    var oldHeight = this._Height;
    if (v >= 0) {
      RUHelper.TrySetPropRedoUndo(
        this,
        'BaseHeight',
        () => (this._Height = v),
        v,
        oldHeight,
      );
    }
  }

  //#endregion

  @observable
  private _IsSolidified: boolean = false;
  @computed
  @Expose()
  public get IsSolidified(): boolean {
    return this._IsSolidified;
  }
  public set IsSolidified(v: boolean) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'IsSolidified',
      () => (this._IsSolidified = v),
      v,
      this._IsSolidified,
    );
  }

  @observable
  private _IsExpanded: boolean;
  @Exclude()
  @computed
  public get IsExpanded(): boolean {
    if (!this.Father) return this._IsExpanded;
    return this._IsExpanded && this.Father.IsExpanded;
  }
  public set IsExpanded(v: boolean) {
    this._IsExpanded = v;
  }

  @computed
  public get HasDescendantsSelected(): boolean {
    return (
      this.Children?.find(x => x.IsSelected || x.HasDescendantsSelected) != null
    );
  }

  //#region  子项和场景
  @observable
  _Children: CWElement[] = [];

  @Type(() => CWElement)
  @Expose()
  get Children() {
    return this._Children;
  }
  set Children(v: CWElement[]) {
    if (v != null) this._Children = v;
  }

  private _oldChilren: CWElement[] = [];
  protected childrenChanged = reaction(
    () => {
      var oldItems = from(this._oldChilren)
        .except(this.Children)
        .toArray();
      var newItems = from(this.Children)
        .except(this._oldChilren)
        .toArray();
      this._oldChilren = [...this.Children];
      return { oldItems, newItems };
    },
    ({ oldItems, newItems }) => {
      newItems?.forEach(x => {
        x.Father = this;
        x.Scene = this.Scene;
      });
      oldItems?.forEach(x => {
        x.Scene = null;
        x.Father = null;
      });
      if (this.Children == null || this.Children.length == 0)
        this.IsExpanded = false;
    },
    { fireImmediately: true },
  );

  /**
   * 所有后裔元素
   */
  @computed
  public get TotalSubItemList(): CWElement[] {
    var result: CWElement[] = [];
    this.Children?.forEach(element => {
      result = [...result, element];
      if (
        element.ElementType == ElementTypes.Combined &&
        element instanceof CombinedEditItem
      ) {
        result = [...result, ...element.TotalSubItemList];
      }
    });
    return result;
  }

  public get Scene() {
    return super.Scene;
  }

  public set Scene(v: CWPage) {
    super.Scene = v;
    this.Children?.forEach(x => (x.Scene = v));
  }
  //#endregion

  ///组合只在选中时才允许拖动
  public get CanDragMove(): boolean {
    return super.CanDragMove && (this.IsSelected || this.IsSolidified);
  }

  get AutoClearWhenEmpty(): boolean {
    return true;
  }

  get AutoResetboundary(): boolean {
    return true;
  }
  //样式模板
  public get Template(): any {
    return CombinedItemTemplate;
  }

  //#region 大小及子项大小变化时的处理

  AutoSetChildrenPosition() {}

  ResetBoundary() {
    if (
      this.resettingBoundary ||
      this.IsOprating ||
      RUHelper.Core.ActionIsExecuting ||
      this.Children == null ||
      this.Children.length == 0 ||
      !this.AutoResetboundary
    )
      return;
    var needCreateTransaction = false;

    RUHelper.Core.CreateTransaction();

    this.resettingBoundary = true;

    this.AutoSetChildrenPosition();

    var unionRect = Rect2D.Empty;

    this.Children?.forEach(item => {
      var transform = new Matrix2D();
      transform = transform.RotateAt(
        item.Angle,
        item.Width / 2,
        item.Height / 2,
      );
      transform = transform.Translate(item.X, item.Y);
      var rect_to_parent = transform.TransformRect(
        new Rect2D(0, 0, item.Width, item.Height),
      );

      if (unionRect.isEmpty) unionRect = rect_to_parent;
      else unionRect = Rect2D.union(rect_to_parent, unionRect);
    });

    var p0Vector: Vector2D = new Vector2D(unionRect.left, unionRect.top);
    var p2Vector: Vector2D = new Vector2D(
      unionRect.right - (this.Width || 0),
      unionRect.bottom - (this.Height || 0),
    );

    if (this.FlipX) {
      p0Vector.x = -p0Vector.x;
      p2Vector.x = -p2Vector.x;
    }
    if (this.FlipY) {
      p0Vector.y = -p0Vector.y;
      p2Vector.y = -p2Vector.y;
    }
    var p0Index = 0;
    if (this.FlipX && !this.FlipY) p0Index = 1;
    else if (this.FlipY && !this.FlipX) p0Index = 3;
    else if (this.FlipX && this.FlipY) p0Index = 2;

    var p2Index = (p0Index + 2) % 4;

    var startRect: Rect2D = new Rect2D(
      this.X || 0,
      this.Y || 0,
      this.Width || 0,
      this.Height || 0,
    );

    var cornerPoints: Point2D[] = GeometryHelper.GetRotatedRectPoints(
      startRect,
      this.Angle,
    );

    var m = new Matrix2D();
    m = m.Rotate(this.Angle);

    var _p0Vector: Vector2D = m.TransformVector(p0Vector);
    var _p2Vector: Vector2D = m.TransformVector(p2Vector);

    cornerPoints[p0Index] = _p0Vector.translatePoint(cornerPoints[p0Index]);
    cornerPoints[p2Index] = _p2Vector.translatePoint(cornerPoints[p2Index]);

    var resRect = GeometryHelper.GetRectFrom2Points(
      cornerPoints[p0Index],
      cornerPoints[p2Index],
      this.Angle,
    );

    this.X = resRect.left;
    this.Y = resRect.top;
    this.BaseWidth = resRect.width;
    this.BaseHeight = resRect.height;

    this.Children?.forEach(item => {
      //父元素的位置宽高变化后对子元素的位置进行补偿
      item.X -= unionRect.left;
      item.Y -= unionRect.top;
    });

    this.Father?.ResetBoundary();

    RUHelper.Core.CommitTransaction();

    this.resettingBoundary = false;
  }
  //#endregion
  //#region 组合和拆分

  public static CombineItems(editItems: CWElement[]): CombinedEditItem {
    if (editItems != null && editItems.length > 1) {
      var combinedModel = new CombinedEditItem();
      combinedModel.ElementType = ElementTypes.Combined;
      combinedModel.IsSolidified = false;

      for (var item of editItems) {
        var _item = item.SafeDeepClone(false);

        //_item.EventList.Clear();
        //_item.AsideList.Clear();
        //_item.AppearType = AppearTypes.Auto;
        //_item.LogicType = LogicTypes.Normal;
        combinedModel.Children.push(_item);
      }
      combinedModel.ResetBoundary();
      combinedModel.ReBuildTriggerList();
      return combinedModel;
      //}
    }
    return null;
  }

  public SplitItem(): CWElement[] {
    var result: CWElement[] = [];
    if (this.ElementType == ElementTypes.Combined) {
      var toCanvasTransform = new Matrix2D();
      toCanvasTransform.ScaleAt(
        this.FlipX ? -1 : 1,
        this.FlipY ? -1 : 1,
        this.Width / 2,
        this.Height / 2,
      );
      toCanvasTransform.RotateAt(this.Angle, this.Width / 2, this.Height / 2);
      toCanvasTransform.Translate(this.X, this.Y);
      for (var subitem of this.Children) {
        var _subitem = subitem.SafeDeepClone(false); //保留原本ID

        var toFatherTransform = Matrix2D.RotateAt(
          _subitem.Angle,
          _subitem.Width / 2,
          _subitem.Height / 2,
        ).Translate(_subitem.X, _subitem.Y);
        var centerPoint = toCanvasTransform.TransformPoint(
          toFatherTransform.TransformPoint(
            new Point2D(_subitem.Width / 2, _subitem.Height / 2),
          ),
        );
        _subitem.X = centerPoint.x - _subitem.Width / 2;
        _subitem.Y = centerPoint.y - _subitem.Height / 2;
        _subitem.FlipX = _subitem.FlipX != this.FlipX;
        _subitem.FlipY = _subitem.FlipY != this.FlipY;
        _subitem.Angle *= this.FlipX != this.FlipY ? -1 : 1;
        _subitem.Angle += this.Angle;
        result.push(_subitem);
      }
    }
    return result;
  }

  //#endregion

  //#region 导入导出
  public SetResourcesFromLib(reslib: CWResource[]) {
    if (this.Children != null && this.Children.length > 0) {
      this.Children.forEach(x => x.SetResourcesFromLib(reslib));
    }
  }

  public GetDependencyResources(): CWResource[] {
    var result: CWResource[] = [];
    if (this.Children != null && this.Children.length > 0) {
      this.Children.forEach(x => result.push(...x.GetDependencyResources()));
    }
    return result;
  }

  public GetDependencyFonts(): string[] {
    var result: string[] = [];
    if (this.Children != null && this.Children.length > 0) {
      this.Children.forEach(x => result.push(...x.GetDependencyFonts()));
    }
    return result;
  }
  //#endregion

  //#region 复制
  public SafeDeepClone(
    useNewId: boolean = true,
    idReplaceMap?: Map<string, string>,
  ): CWElement {
    var _item = ObjHelper.DeepClone(this, TypeMapHelper.CommonTypeMap);

    if (_item != null) {
      _item.SetResourcesFromLib(this.GetDependencyResources());
      if (useNewId) {
        var oldId = this.Id;
        _item.Id = CWElement.GenerateElementId();
        idReplaceMap?.set(oldId, _item.Id);
        this.ResetChildrenIds(idReplaceMap);
      }
    }
    return _item;
  }

  public ResetChildrenIds(idReplaceMap?: Map<string, string>) {
    for (var child of this.Children) {
      var oldId = child.Id;
      child.Id = CWElement.GenerateElementId();
      idReplaceMap?.set(oldId, child.Id);
      if (child instanceof CombinedEditItem)
        child.ResetChildrenIds(idReplaceMap);
    }
  }
  //#endregion
}
