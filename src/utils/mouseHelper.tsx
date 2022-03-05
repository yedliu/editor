import { Point2D, GeometryHelper, Rect2D } from './Math2D';

export default class MouseHelper {
  static MousePositionInWindow: Point2D = Point2D.Zero;
  static PressedBtns: number[] = [];

  static onPressBtn(btn: number) {
    if (!MouseHelper.PressedBtns.includes(btn))
      MouseHelper.PressedBtns.push(btn);
  }

  static onReleaseBtn(btn: number) {
    if (MouseHelper.PressedBtns.includes(btn))
      MouseHelper.PressedBtns.splice(MouseHelper.PressedBtns.indexOf(btn), 1);
  }

  static isBtnPressed(btn: number) {
    return MouseHelper.PressedBtns.includes(btn);
  }

  static getMousePositionIn(el: HTMLElement | SVGElement) {
    if (el)
      return GeometryHelper.GetPosition(
        el,
        MouseHelper.MousePositionInWindow,
        true,
      );
    return null;
  }

  static isMouseOver(el: HTMLElement | SVGElement) {
    if (el) {
      var temp = GeometryHelper.GetPosition(
        el,
        MouseHelper.MousePositionInWindow,
        false,
      );
      var rect = new Rect2D(0, 0, el.clientWidth, el.clientHeight);
      return rect.contains(temp);
    }
    return false;
  }
}
