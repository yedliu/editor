import { TransformationType } from '@/class-transformer/TransformOperationExecutor';
import { Expose } from '@/class-transformer';
import MathHelper from './MathHelper';

export class Point2D {
  @Expose()
  x: number;
  @Expose()
  y: number;

  constructor(x: number, y: number) {
    x = x ? x : 0;
    y = y ? y : 0;
    this.x = x;
    this.y = y;
  }

  public static get Zero() {
    return new Point2D(0, 0);
  }

  public minus(from: Point2D): Vector2D {
    return new Vector2D(this.x - from.x, this.y - from.y);
  }

  public equals(p: Point2D): boolean {
    if (!p) return false;
    return this.x == p.x && this.y == p.y;
  }

  public toString(): string {
    return `${this.x},${this.y}`;
  }

  public static parseFromString(str: string): Point2D {
    if (str) {
      var temp = str.split(',');
      if (temp && temp.length == 2)
        return new Point2D(Number(temp[0]), Number(temp[1]));
    }
    return Point2D.Zero;
  }

  public static ClassTransFn = (value: Point2D | string, _obj, transType) => {
    if (transType == TransformationType.PLAIN_TO_CLASS)
      return Point2D.parseFromString(value as string);
    else if (transType == TransformationType.CLASS_TO_CLASS) return value;
    else if (
      transType == TransformationType.CLASS_TO_PLAIN &&
      value instanceof Point2D
    )
      return value ? value.toString() : '0,0';
  };
}

export class Vector2D {
  @Expose()
  x: number;
  @Expose()
  y: number;

  constructor(x: number, y: number) {
    x = x ? x : 0;
    y = y ? y : 0;
    this.x = x;

    this.y = y;
  }

  public static get Zero() {
    return new Vector2D(0, 0);
  }

  public minus(from: Vector2D): Vector2D {
    return new Vector2D(this.x - from.x, this.y - from.y);
  }

  public add(from: Vector2D): Vector2D {
    return new Vector2D(this.x + from.x, this.y + from.y);
  }
  public translatePoint(from: Point2D): Point2D {
    return new Point2D(this.x + from?.x || 0, this.y + from?.y || 0);
  }

  public dotProduct(target: Vector2D): number {
    return this.x * target.x + this.y * target.y;
  }

  public get length(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  public equals(p: Vector2D): boolean {
    if (!p) return false;
    return this.x == p.x && this.y == p.y;
  }

  public toString(): string {
    return `${this.x},${this.y}`;
  }

  public static parseFromString(str: string): Vector2D {
    if (str) {
      var temp = str.split(',');
      if (temp && temp.length == 2)
        return new Vector2D(Number(temp[0]), Number(temp[1]));
    }
    return Vector2D.Zero;
  }

  public static ClassTransFn = (value, _obj, transType) => {
    if (transType == TransformationType.PLAIN_TO_CLASS)
      return Vector2D.parseFromString(value);
    else if (transType == TransformationType.CLASS_TO_CLASS) return value;
    else if (transType == TransformationType.CLASS_TO_PLAIN)
      return value ? value.toString() : '0,0';
  };
}

export class Rect2D {
  @Expose()
  x: number = 0;
  @Expose()
  y: number = 0;
  @Expose()
  width: number = 0;
  @Expose()
  height: number = 0;

  constructor(x: number, y: number, width: number, height: number) {
    if (width >= 0 && height >= 0) {
      x = x ? x : 0;
      y = y ? y : 0;
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
    }
  }

  public static get Empty() {
    return new Rect2D(0, 0, 0, 0);
  }

  public get left(): number {
    return this.x;
  }

  public get top(): number {
    return this.y;
  }

  public get right(): number {
    return this.x + this.width;
  }

  public get bottom(): number {
    return this.y + this.height;
  }

  public get lefttop(): Point2D {
    return new Point2D(this.left, this.top);
  }

  public get leftbottom(): Point2D {
    return new Point2D(this.left, this.bottom);
  }

  public get righttop(): Point2D {
    return new Point2D(this.right, this.top);
  }

  public get rightbottom(): Point2D {
    return new Point2D(this.right, this.bottom);
  }

  public static union(...rects: Rect2D[]): Rect2D {
    rects = rects.filter(
      x => x.x != null && x.y != null && x.width != null && x.height != null,
    );
    var left = Math.min(...rects.map(r => r.left));
    var top = Math.min(...rects.map(r => r.top));
    var right = Math.max(...rects.map(r => r.right));
    var bottom = Math.max(...rects.map(r => r.bottom));
    return new Rect2D(left, top, right - left, bottom - top);
  }

  public union(rect: Rect2D): Rect2D {
    return Rect2D.union(this, rect);
  }

  public intersect(rect: Rect2D): Rect2D {
    var left = Math.max(this.left, rect.left);
    var top = Math.max(this.top, rect.top);
    var right = Math.min(this.right, rect.right);
    var bottom = Math.min(this.bottom, rect.bottom);
    var width = right - left;
    var height = bottom - top;
    if (width < 0 || height < 0) return Rect2D.Empty;
    return new Rect2D(left, top, width, height);
  }

  public get isEmpty(): boolean {
    return this.width == 0 || this.height == 0;
  }

  public contains(p: Point2D | Rect2D): boolean {
    if (p instanceof Point2D)
      return (
        !this.isEmpty &&
        p.x >= this.left &&
        p.x <= this.right &&
        p.y >= this.top &&
        p.y <= this.bottom
      );
    else if (p instanceof Rect2D)
      return !this.isEmpty && !p.isEmpty && p.intersect(this).equals(p);
  }

  public equals(rect: Rect2D): boolean {
    return (
      this.x == rect.x &&
      this.y == rect.y &&
      this.width == rect.width &&
      this.height == rect.height
    );
  }

  public toString(): string {
    return `${this.x},${this.y},${this.width},${this.height}`;
  }

  public static parseFromString(str: string): Rect2D {
    if (str) {
      var temp = str.split(',');
      if (temp && temp.length == 4)
        return new Rect2D(
          Number(temp[0]),
          Number(temp[1]),
          Number(temp[2]),
          Number(temp[3]),
        );
    }
    return Rect2D.Empty;
  }
  public static ClassTransFn = (value, _obj, transType) => {
    if (transType == TransformationType.PLAIN_TO_CLASS)
      return Rect2D.parseFromString(value);
    else if (transType == TransformationType.CLASS_TO_CLASS) return value;
    else if (transType == TransformationType.CLASS_TO_PLAIN)
      return value ? value.toString() : '0,0,0,0';
  };
}

export class Matrix2D extends DOMMatrix {
  constructor(init?: string | number[]) {
    super(init);
  }
  public static Rotate(angle: number): Matrix2D {
    if (!angle) angle = 0;
    var a = (Math.PI * angle) / 180.0;
    var m = new Matrix2D([
      Math.cos(a),
      Math.sin(a),
      -Math.sin(a),
      Math.cos(a),
      0,
      0,
    ]);
    return m;
  }

  public static RotateAt(angle: number, x: number, y: number): Matrix2D {
    var m = new Matrix2D();
    m = m.Append(Matrix2D.Translate(-x, -y));
    m = m.Append(Matrix2D.Rotate(angle));
    m = m.Append(Matrix2D.Translate(x, y));
    return m;
  }

  public static Scale(scalex: number, scaley: number): Matrix2D {
    scalex = scalex ? scalex : 1;
    scaley = scaley ? scaley : 1;
    var m = new Matrix2D([scalex, 0, 0, scaley, 0, 0]);
    return m;
  }

  public static ScaleAt(
    scalex: number,
    scaley: number,
    x: number,
    y: number,
  ): Matrix2D {
    var m = new Matrix2D();
    m = m.Append(Matrix2D.Translate(-x, -y));
    m = m.Append(Matrix2D.Scale(scalex, scaley));
    m = m.Append(Matrix2D.Translate(x, y));
    return m;
  }

  public static Translate(x: number, y: number): Matrix2D {
    x = x ? x : 0;
    y = y ? y : 0;
    var m = new Matrix2D([1, 0, 0, 1, x, y]);
    return m;
  }

  public Append(m: Matrix2D): Matrix2D {
    this.preMultiplySelf(m);
    return this;
  }

  public getInverse(): Matrix2D {
    var m = this.inverse();
    return new Matrix2D(m.toString());
  }

  public Rotate(angle: number): Matrix2D {
    this.Append(Matrix2D.Rotate(angle));
    return this;
  }

  public RotateAt(angle: number, x: number, y: number): Matrix2D {
    this.Append(Matrix2D.RotateAt(angle, x, y));
    return this;
  }

  public Scale(scalex: number, scaley: number): Matrix2D {
    this.Append(Matrix2D.Scale(scalex, scaley));
    return this;
  }

  public ScaleAt(
    scalex: number,
    scaley: number,
    x: number,
    y: number,
  ): Matrix2D {
    this.Append(Matrix2D.ScaleAt(scalex, scaley, x, y));
    return this;
  }

  public Translate(x: number, y: number): Matrix2D {
    this.Append(Matrix2D.Translate(x, y));
    return this;
  }

  public TransformPoint(p: Point2D): Point2D {
    var x = p.x;
    var y = p.y;
    return new Point2D(
      x * this.a + y * this.c + this.e,
      x * this.b + y * this.d + this.f,
    );
  }

  public TransformVector(v: Vector2D): Vector2D {
    var x = v.x;
    var y = v.y;
    return new Vector2D(
      x * this.a + y * this.c + this.e,
      x * this.b + y * this.d + this.f,
    );
  }

  public TransformRect(r: Rect2D): Rect2D {
    var p1 = this.TransformPoint(r.lefttop);
    var p2 = this.TransformPoint(r.leftbottom);
    var p3 = this.TransformPoint(r.righttop);
    var p4 = this.TransformPoint(r.rightbottom);
    var points = [p1, p2, p3, p4];
    var left = Math.min(...points.map(p => p.x));
    var top = Math.min(...points.map(p => p.y));
    var right = Math.max(...points.map(p => p.x));
    var bottom = Math.max(...points.map(p => p.y));
    return new Rect2D(left, top, right - left, bottom - top);
  }
}

export const noCalcSize = 'noCalcSize';
export const noCalcChildrenSize = 'noCalcChildrenSize';

export class GeometryHelper {
  /// <summary>
  /// 通过四个点和角度算出左上边距和宽高
  /// </summary>
  /// <param name="cornerPoints"></param>
  /// <param name="angle"></param>
  /// <returns></returns>
  public static GetRectFrom4Points(
    cornerPoints: Point2D[],
    angle: number,
    p0Index: number = 0,
  ): Rect2D {
    var rect = Rect2D.Empty;
    if (cornerPoints.length == 4) {
      var p0 = cornerPoints[p0Index];
      var p2 = cornerPoints[(p0Index + 2) % 4];
      var centerPoint = new Point2D((p0.x + p2.x) / 2, (p0.y + p2.y) / 2);
      var m = new Matrix2D();
      m.RotateAt(-angle, centerPoint.x, centerPoint.y);
      var _p0 = m.TransformPoint(p0);
      var _p2 = m.TransformPoint(p2);

      rect = new Rect2D(
        Math.min(_p0.x, _p2.x),
        Math.min(_p0.y, _p2.y),
        Math.abs(_p0.x - _p2.x),
        Math.abs(_p0.y - _p2.x),
      );
    }
    return rect;
  }

  /// <summary>
  /// 通过对角两个点和角度算出左上边距和宽高
  /// </summary>
  /// <param name="cornerPoints"></param>
  /// <param name="angle"></param>
  /// <returns></returns>
  public static GetRectFrom2Points(
    p0: Point2D,
    p2: Point2D,
    angle: number,
  ): Rect2D {
    var rect = Rect2D.Empty;

    var centerPoint = new Point2D((p0.x + p2.x) / 2, (p0.y + p2.y) / 2);
    var m = new Matrix2D();
    m.RotateAt(-angle, centerPoint.x, centerPoint.y);
    var _p0 = m.TransformPoint(p0);
    var _p2 = m.TransformPoint(p2);

    rect = new Rect2D(
      Math.min(_p0.x, _p2.x),
      Math.min(_p0.y, _p2.y),
      Math.abs(_p0.x - _p2.x),
      Math.abs(_p0.y - _p2.y),
    );

    return rect;
  }

  public static GetRotatedRectPoints(rect: Rect2D, angle: number): Point2D[] {
    var centerPoint = new Point2D(
      rect.x + 0.5 * rect.width,
      rect.y + 0.5 * rect.height,
    );
    var m = new Matrix2D();
    m.RotateAt(angle, centerPoint.x, centerPoint.y);
    var origin_cornerPoints: Point2D[] = [
      rect.lefttop,
      rect.righttop,
      rect.rightbottom,
      rect.leftbottom,
    ];
    return origin_cornerPoints.map(x => m.TransformPoint(x));
  }

  public static GetBounds(element: Element): Rect2D {
    if (element) {
      var _rect = element.getBoundingClientRect();

      return new Rect2D(_rect.x, _rect.y, _rect.width, _rect.height);
    }
    return Rect2D.Empty;
  }

  public static GetBoundsWithChildren(element: Element): Rect2D {
    if (element) {
      let doNotCalcSize =
        element.classList.contains(noCalcSize) || element.tagName == 'svg';
      let doNotCalcChildren = element.classList.contains(noCalcChildrenSize);
      let currentBounds = doNotCalcSize
        ? Rect2D.Empty
        : GeometryHelper.GetBounds(element);
      let totalBoundary = currentBounds;
      if (element.childElementCount > 0 && !doNotCalcChildren) {
        let childrenRects = [];
        for (let i = 0; i < element.childElementCount; i++) {
          let c_element = element.children.item(i);
          let c_rect = GeometryHelper.GetBoundsWithChildren(c_element);
          if (c_rect && !c_rect.isEmpty) childrenRects.push(c_rect);
          c_rect = null;
        }
        totalBoundary = Rect2D.union(...childrenRects);
        if (totalBoundary.isEmpty) totalBoundary = currentBounds;
        else if (!currentBounds.isEmpty && !doNotCalcSize)
          totalBoundary = Rect2D.union(currentBounds, totalBoundary);
        childrenRects = null;
      }
      // if (totalBoundary.height > 10000) {
      //   console.log(element, currentBounds, totalBoundary);
      // }
      return totalBoundary;
    }
    return Rect2D.Empty;
  }

  public static GetPosition(
    element: HTMLElement | SVGElement,
    windowPosition: Point2D,
    applyTransform: boolean = true,
  ): Point2D {
    var rect = this.GetBounds(element);
    var point = new Point2D(
      windowPosition.x - rect.x,
      windowPosition.y - rect.y,
    );
    if (element?.style?.transform != null && applyTransform) {
      var m = new Matrix2D(element.style.transform);
      point = m.getInverse().TransformPoint(point);
    }
    return point;
  }

  /**
   * 元素本身的transform不能包含位移，不然计算会出错
   */
  public static GetPositionInWindow(
    element: HTMLElement | SVGElement,
    elementPosition: Point2D,
    applyTransform: boolean = true,
  ) {
    if (element?.style?.transform != null && applyTransform) {
      var m = new Matrix2D(element.style.transform);
      elementPosition = m.TransformPoint(elementPosition);
    }
    var bound = element?.getBoundingClientRect();
    var point = new Point2D(
      elementPosition.x + bound?.left || 0,
      elementPosition.y + bound?.top || 0,
    );

    return point;
  }

  public static GetBoundsFrom(
    target: HTMLElement,
    container: HTMLElement,
  ): Rect2D {
    var rect1 = GeometryHelper.GetBounds(target);
    var rect2 = GeometryHelper.GetBounds(container);
    return new Rect2D(
      rect1.x - rect2.x,
      rect1.y - rect2.y,
      rect1.width,
      rect1.height,
    );
  }
}
