import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Rect from './Rect';
import { centerToTL, tLToCenter, getNewStyle, degToRadian } from './utils';
import { observer } from 'mobx-react';

@observer
export default class ResizableRect extends Component {
  static propTypes = {
    left: PropTypes.number.isRequired,
    top: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    rotatable: PropTypes.bool,
    dragable: PropTypes.bool,
    rotateAngle: PropTypes.number,
    parentRotateAngle: PropTypes.number,
    zoomable: PropTypes.string,
    minWidth: PropTypes.number,
    minHeight: PropTypes.number,
    aspectRatio: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
    onRotateStart: PropTypes.func,
    onRotate: PropTypes.func,
    onRotateEnd: PropTypes.func,
    onResizeStart: PropTypes.func,
    onResize: PropTypes.func,
    onResizeEnd: PropTypes.func,
    onDragStart: PropTypes.func,
    onDrag: PropTypes.func,
    onDragEnd: PropTypes.func,
  };

  static defaultProps = {
    parentRotateAngle: 0,
    rotateAngle: 0,
    rotatable: true,
    zoomable: '',
    dragable: true,
    minWidth: 10,
    minHeight: 10,
  };

  handleRotate = (angle, startAngle, e) => {
    if (!this.props.onRotate) return;
    // let rotateAngle = Math.round(startAngle + angle);
    // if (rotateAngle >= 360) {
    //   rotateAngle -= 360;
    // } else if (rotateAngle < 0) {
    //   rotateAngle += 360;
    // }
    // if (rotateAngle > 356 || rotateAngle < 4) {
    //   rotateAngle = 0;
    // } else if (rotateAngle > 86 && rotateAngle < 94) {
    //   rotateAngle = 90;
    // } else if (rotateAngle > 176 && rotateAngle < 184) {
    //   rotateAngle = 180;
    // } else if (rotateAngle > 266 && rotateAngle < 274) {
    //   rotateAngle = 270;
    // }
    this.props.onRotate(angle, e);
  };

  handleResize = (length, alpha, rect, type, isShiftKey, e) => {
    if (!this.props.onResize) return;
    const {
      rotateAngle,
      aspectRatio,
      minWidth,
      minHeight,
      parentRotateAngle,
    } = this.props;
    const beta = alpha - degToRadian(rotateAngle + parentRotateAngle);
    const deltaW = length * Math.cos(beta);
    const deltaH = length * Math.sin(beta);
    const ratio =
      isShiftKey && !aspectRatio ? rect.width / rect.height : aspectRatio;
    // const {
    //   position: { centerX, centerY },
    //   size: { width, height },
    // } = getNewStyle(
    //   type,
    //   { ...rect, rotateAngle },
    //   deltaW,
    //   deltaH,
    //   ratio,
    //   minWidth,
    //   minHeight,
    // );

    this.props.onResize(
      //centerToTL({ centerX, centerY, width, height, rotateAngle }),
      isShiftKey,
      type,
      { startRect: rect, deltaW, deltaH },
      e,
    );
  };

  handleDrag = (deltaX, deltaY, e) => {
    this.props.onDrag && this.props.onDrag(deltaX, deltaY, e);
  };

  render() {
    const {
      stageScale,
      top,
      left,
      width,
      height,
      rotateAngle,
      parentRotateAngle,
      zoomable,
      dragable,
      rotatable,
      onRotate,
      onResizeStart,
      onResizeEnd,
      onRotateStart,
      onRotateEnd,
      onDragStart,
      onDragEnd,
    } = this.props;

    const styles = tLToCenter({ top, left, width, height, rotateAngle });
    return (
      <Rect
        styles={styles}
        stageScale={stageScale || 1}
        zoomable={zoomable}
        rotatable={Boolean(rotatable && onRotate)}
        dragable={dragable}
        parentRotateAngle={parentRotateAngle}
        onResizeStart={onResizeStart}
        onResize={this.handleResize}
        onResizeEnd={onResizeEnd}
        onRotateStart={onRotateStart}
        onRotate={this.handleRotate}
        onRotateEnd={onRotateEnd}
        onDragStart={onDragStart}
        onDrag={this.handleDrag}
        onDragEnd={onDragEnd}
      />
    );
  }
}