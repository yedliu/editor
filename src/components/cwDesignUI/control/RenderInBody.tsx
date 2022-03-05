import React from 'react';
import ReactDOM from 'react-dom';
import UIHelper from '@/utils/uiHelper';
import { GeometryHelper, Point2D } from '@/utils/Math2D';
import richTextEditItemViewModel from '@/modelClasses/courseDetail/editItemViewModels/complexControl/richTextControl/richTextEditItemViewModel';

const modalRoot = document.body;

export default class RenderInBody extends React.Component<any, any> {
  el;
  constructor(props) {
    super(props);

    const { container, richTextComplex, x, y } = this.props;
    var val = container as HTMLElement;

    var _x = x ? x : 0;
    var _y = y ? y : 0;

    if (val != null) {
      var rect = val.getBoundingClientRect();
      var _richTextComplex = richTextComplex as richTextEditItemViewModel;

      var StageScale = _richTextComplex.Scene.Courseware.StageScale;

      this.el = document.createElement('div');
      this.el.style.position = 'absolute';
      this.el.style.top = `${rect.y +
        (_richTextComplex.Height - _y) * StageScale}px`;
      this.el.style.left = `${rect.x +
        ((_richTextComplex.Width - _x) * StageScale) / 2 -
        100}px`;
    }
  }

  // componentDidUpdate(){
  //   console.log("11111111");
  // }

  componentDidMount() {
    modalRoot.appendChild(this.el);
  }

  componentWillUnmount() {
    modalRoot.removeChild(this.el);
  }

  render() {
    return ReactDOM.createPortal(this.props.children, this.el);
  }
}
