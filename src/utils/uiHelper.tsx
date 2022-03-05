import ReactDOM from 'react-dom';

export default class UIHelper {
  public static FindAncestorByClassName(
    el: HTMLElement | SVGElement,
    classname: string,
  ): HTMLElement | SVGElement {
    if (el) {
      var target = el.parentElement;
      while (target != null && !target.classList.contains(classname)) {
        target = target.parentElement;
      }
      return target;
    }
    return null;
  }

  public static FindAncestorByTagName(
    el: HTMLElement | SVGElement,
    tagName: string,
  ): HTMLElement | SVGElement {
    var target = el?.parentElement;
    while (target != null && target.tagName != tagName?.toUpperCase()) {
      target = target.parentElement;
    }
    return target;
  }
  public static FindAncestorById(
    el: HTMLElement | SVGElement,
    id: string,
  ): HTMLElement | SVGElement {
    var target = el?.parentElement;
    while (target != null && target.id != id) {
      target = target.parentElement;
    }
    return target;
  }

  static currentDragImage: HTMLElement;
  public static getDragImage(
    target: HTMLElement | JSX.Element,
    needclone: boolean = true,
  ): HTMLElement {
    var div = document.createElement('div');
    div.style.background = 'transparent';
    div.style.position = 'absolute';
    div.style.overflow = 'hidden';

    var renderTarget: HTMLElement;
    if (target instanceof HTMLElement) {
      var rect = target.getBoundingClientRect();
      renderTarget = target.cloneNode(needclone) as HTMLElement;
      div.style.width = `${rect.width}px`;
      div.style.height = `${rect.height}px`;
      div.style.top = `${-rect.height * 20}px`;
      div.style.left = `${-rect.width * 20}px`;

      renderTarget.style.width = `${rect.width}px`;
      renderTarget.style.height = `${rect.height}px`;
      div.appendChild(renderTarget);
    } else {
      ReactDOM.render(target, div);
      renderTarget = div.firstElementChild as HTMLElement;
      div.style.top = `${-10000}px`;
      div.style.left = `${-10000}px`;
    }

    renderTarget.style.left = `0px`;
    renderTarget.style.top = `0px`;
    renderTarget.style.float = '';
    renderTarget.draggable = false;

    document.querySelector('body').appendChild(div);
    UIHelper.currentDragImage = div;
    return div;
  }

  public static clearDragImage() {
    if (UIHelper.currentDragImage) {
      ReactDOM.unmountComponentAtNode(UIHelper.currentDragImage);
      UIHelper.currentDragImage?.remove();
      UIHelper.currentDragImage = null;
    }
  }

  public static AddAdorner(
    adorner: HTMLElement | JSX.Element,
    container?: HTMLElement,
  ): HTMLElement {
    var div = document.createElement('div');
    div.style.background = 'transparent';
    div.style.position = 'absolute';
    div.style.zIndex = '10';
    // div.style.overflow = 'hidden';
    var x = 0,
      y = 0;

    var renderTarget: HTMLElement;
    if (adorner instanceof HTMLElement) {
      renderTarget = adorner.cloneNode(true) as HTMLElement;
      div.appendChild(renderTarget);
    } else {
      ReactDOM.render(adorner, div);
      renderTarget = div.firstElementChild as HTMLElement;
    }
    div.style.top = `${x}px`;
    div.style.left = `${y}px`;

    renderTarget.style.left = `0px`;
    renderTarget.style.top = `0px`;
    renderTarget.style.float = '';
    renderTarget.draggable = false;

    container = container ? container : document.querySelector('body');
    container.appendChild(div);

    return div;
  }

  public static SetAdornerLocation(div: HTMLElement, x: number, y: number) {
    div.style.top = `${y}px`;
    div.style.left = `${x}px`;
  }

  public static DestroyUI(div: HTMLElement) {
    if (div) ReactDOM.unmountComponentAtNode(div);
    div?.remove();
  }
}
