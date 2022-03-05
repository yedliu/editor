import { PureComponent } from 'react';
import React from 'react';
import { Point2D, GeometryHelper, Vector2D } from '@/utils/Math2D';
import { observer } from 'mobx-react';
import { observable, reaction, runInAction } from 'mobx';
import LoopWork from '@/modelClasses/courseDetail/toolbox/LoopWork';

export class AdornerTrans {
  @observable
  angle: number = null;
  @observable
  translate: Vector2D = null;
  @observable
  scale: Vector2D = null;
  @observable
  adornerDiv: HTMLElement = null;

  fatherAngle: number = 0;

  defaultAngle: number = 0;
  defaultScale: Vector2D = new Vector2D(1, 1);
  defaultTranslate: Vector2D = Vector2D.Zero;

  attchedTo: HTMLElement = null;
  container: HTMLElement = null;
}

@observer
export default class TransformAdorner extends PureComponent<any> {
  constructor(props) {
    super(props);
  }

  adornerNode: HTMLElement;

  @observable
  x: number = 0;
  @observable
  y: number = 0;

  @observable
  w: number = 0;
  @observable
  h: number = 0;

  followAttchedElement() {
    var attchedElement = this.props.transform.attchedTo as HTMLElement;
    var container = this.props.transform.container as HTMLElement;
    if (attchedElement && container) {
      var rect = attchedElement.getBoundingClientRect();
      var attchedElementPos = new Point2D(rect.x, rect.y);
      var position = GeometryHelper.GetPosition(container, attchedElementPos);
      var rightbottom = GeometryHelper.GetPosition(
        container,
        new Point2D(rect.right, rect.bottom),
      );
      runInAction(() => {
        if (this.x != position.x) this.x = position.x;
        if (this.y != position.y) this.y = position.y;
        var width = rightbottom.x - position.x;
        if (this.w != width) this.w = width;
        var height = rightbottom.y - position.y;
        if (this.h != height) this.h = height;
      });
    }
  }

  componentDidMount() {
    this.followAttchedElement();
    if (this.props.followElement)
      LoopWork.Instance.setMission(this, this.followAttchedElement.bind(this));
  }

  componentWillUnmount() {
    LoopWork.Instance.removeMission(this);
  }

  render() {
    var transform: AdornerTrans = this.props.transform;
    var translate: Vector2D =
      transform.translate != null
        ? transform.translate
        : transform.defaultTranslate;
    var angle: number =
      transform.angle != null ? transform.angle : transform.defaultAngle;
    var scale: Vector2D =
      transform.scale != null ? transform.scale : transform.defaultScale;
    var fatherAngle: number = transform.fatherAngle;

    translate = translate.add(new Vector2D(this.x, this.y));
    // var startTranslate = this.props.startTranslate;
    // var startAngle = this.props.startAngle;
    // var startScale = this.props.startScale;

    return (
      <div
        style={{
          pointerEvents: 'none',
          position: 'absolute',
          display: '-webkit-box',
          WebkitBoxAlign: 'center',
          WebkitBoxPack: 'center',
          width: `${this.w}px`,
          height: `${this.h}px`,
          transformOrigin: `50% 50%`,
          transform: `translate(${translate.x}px,${
            translate.y
          }px) rotate(${fatherAngle + angle}deg) scale(${scale.x},${
            scale.y
          })  `,
          ...this.props.style,
        }}
        ref={v => (this.adornerNode = v)}
      >
        {this.props.children}
      </div>
    );
  }
}
