import { Component, CSSProperties } from 'react';
import React from 'react';
import { Vector2D, Point2D } from '@/utils/Math2D';
import { observer } from 'mobx-react';
import { observable } from 'mobx';

export type ViewboxStretch = 'fill' | 'uniform' | 'uniformToFill';

type ViewboxProps = {
  stretch?: ViewboxStretch;
  overflow?: any;
  getWidth?: any;
};

@observer
export class Viewbox extends Component<ViewboxProps, any> {
  static timer: NodeJS.Timeout;
  static aliveViewbox: Viewbox[] = [];
  static loopDelay = 180;

  rootDiv: HTMLDivElement;

  @observable
  hasFirstResized = false;

  constructor(props) {
    super(props);
    this.state = {
      x: 0,
      y: 0,
      scalex: 1,
      scaley: 1,
      box_size: Vector2D.Zero,
      child_size: Vector2D.Zero,
    };
  }

  rootLoaded = div => {
    this.rootDiv = div;
  };

  calculateSizeChange = () => {
    const { stretch, getWidth } = this.props;

    var child = this.rootDiv?.firstElementChild
      ?.firstElementChild as HTMLElement;
    if (child) {
      var needResetScale = false;
      const {
        left: l,
        top: t,
        width: w,
        height: h,
      } = this.rootDiv.getBoundingClientRect();
      getWidth && getWidth(w);
      var containerCenter = new Point2D(l + w / 2, t + h / 2);
      var newSize = new Vector2D(w, h);
      if (!newSize.equals(this.state.box_size)) needResetScale = true;
      const {
        left: cl,
        top: ct,
        width: cw,
        height: ch,
      } = child.getBoundingClientRect();
      var newChildSize = new Vector2D(
        cw / this.state.scalex,
        ch / this.state.scaley,
      );
      if (!needResetScale) {
        if (!newChildSize.equals(this.state.child_size)) needResetScale = true;
      }
      if (needResetScale && w * h * cw * ch > 0) {
        var scalex = w / newChildSize.x;
        var scaley = h / newChildSize.y;
        if (stretch == 'uniform') {
          if (scalex > scaley) {
            scalex = scaley;
          } else {
            scaley = scalex;
          }
        } else if (stretch == 'uniformToFill') {
          if (scalex > scaley) {
            scaley = scalex;
          } else {
            scalex = scaley;
          }
        }
        var childCenter = new Point2D(
          cl + (cw / 2) * (scalex / this.state.scalex),
          ct + (ch / 2) * (scaley / this.state.scaley),
        );
        var offsetX = this.state.x + containerCenter.x - childCenter.x;
        var offsetY = this.state.y + containerCenter.y - childCenter.y;

        return {
          x: offsetX,
          y: offsetY,
          scalex: scalex,
          scaley: scaley,
          box_size: newSize,
          child_size: newChildSize,
        };
      }
    }
    return false;
  };

  checkAndDoSizeChange() {
    var caculateResult = this.calculateSizeChange();
    if (caculateResult) {
      this.setState(caculateResult);
      //if (!this.hasFirstResized)
      this.hasFirstResized = true;
    }
  }

  public componentDidUpdate() {}

  public componentDidMount() {
    // this.state = {
    //   x: 0,
    //   y: 0,
    //   scalex: 1,
    //   scaley: 1,
    //   box_size: Vector2D.Zero,
    //   child_size: Vector2D.Zero,
    // };

    this.hasFirstResized = false;
    Viewbox.aliveViewbox.push(this);

    if (!Viewbox.timer) {
      Viewbox.timer = setInterval(Viewbox.loopUpdate, Viewbox.loopDelay);
    }
  }

  public componentWillUnmount() {
    var index = Viewbox.aliveViewbox.indexOf(this);
    if (index >= 0) Viewbox.aliveViewbox.splice(index, 1);

    //if (this.timer) window.clearInterval(this.timer);
  }

  static loopUpdate() {
    Viewbox.aliveViewbox.forEach(v => {
      v.checkAndDoSizeChange();
    });
  }

  render() {
    if (this.props.children) {
      var child = this.props.children[0]
        ? this.props.children[0]
        : this.props.children;
      var scaleStyle: CSSProperties = {
        position: 'absolute',
        left: `${this.state?.x || 0}px`,
        top: `${this.state?.y || 0}px`,
        transformOrigin: '0 0',
        transform: `scaleX(${this.state?.scalex || 1}) scaleY(${this.state
          ?.scaley || 1})`,
      };
      var result = (
        <div
          ref={this.rootLoaded}
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            opacity: this.hasFirstResized ? '1.0' : '0.0',
            overflow: this.props.overflow || 'hidden',
          }}
        >
          <div style={scaleStyle}>{child}</div>
        </div>
      );
      return result;
    }
    return <div></div>;
  }
}
