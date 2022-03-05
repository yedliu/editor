import React from 'react';
import ReactDOM from 'react-dom';
import html2canvas from 'html2canvas';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import './index.css';

const INIT_NUMBER = 10;
const HIDDEN = 'hidden';
const VISIBLE = 'visible';
const GRID_COLOR = 'lightgray';
const CENTERGRID_COLOR = 'black';
const DEFAULT_COLOR = '#fff';

@observer
export class GetColor extends React.Component<any, any> {
  public moveCvas: HTMLCanvasElement;
  public CWidth: number = 160;
  public CHeight: number = 160;
  public timer: any = null;
  public videoDom: HTMLVideoElement;
  constructor(props) {
    super(props);
  }

  @observable
  private _color: string = DEFAULT_COLOR;

  public get color(): string {
    return this._color;
  }

  public set color(v: string) {
    this._color = v;
  }

  @observable
  private _visibility: string = HIDDEN;

  public get visibility(): string {
    return this._visibility;
  }

  public set visibility(v: string) {
    this._visibility = v;
  }

  // 移动的canvas
  public get MoveCvasCtx() {
    if (this.moveCvas) {
      return this.moveCvas.getContext('2d');
    }
  }

  // 生成的canvas
  @observable
  private _CCanvas: HTMLCanvasElement;

  public get CCanvas(): HTMLCanvasElement {
    return this._CCanvas;
  }

  public set CCanvas(v: HTMLCanvasElement) {
    this._CCanvas = v;
  }

  // 绘制的canvas实例
  @observable
  private _ImageCtx: any;

  public get ImageCtx(): any {
    return this._ImageCtx;
  }

  public set ImageCtx(v: any) {
    this._ImageCtx = v;
  }

  @observable
  private _centerX: number = 0;

  public get centerX(): number {
    return this._centerX;
  }

  public set centerX(v: number) {
    this._centerX = v;
  }

  @observable
  private _centerY: number = 0;

  public get centerY(): number {
    return this._centerY;
  }

  public set centerY(v: number) {
    this._centerY = v;
  }

  @observable
  private _cLeft: number = 0;

  public get cLeft(): number {
    return this._cLeft;
  }

  public set cLeft(v: number) {
    this._cLeft = v;
  }

  @observable
  private _cTop: number = 0;

  public get cTop(): number {
    return this._cTop;
  }

  public set cTop(v: number) {
    this._cTop = v;
  }

  rgb2hex_a = rgb => {
    const result = rgb.match(
      /^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+(\.\d)?)[\s+]?/i,
    );
    return result && result.length >= 4
      ? {
          hex:
            '#' +
            ('0' + parseInt(result[1], 10).toString(16)).slice(-2) +
            ('0' + parseInt(result[2], 10).toString(16)).slice(-2) +
            ('0' + parseInt(result[3], 10).toString(16)).slice(-2),
          o: +result[4],
        }
      : rgb;
  };

  // 停止捕捉屏幕
  private stopCapture = () => {
    const srcObject = this.videoDom.srcObject;
    if (srcObject && 'getTracks' in srcObject) {
      const tracks = srcObject.getTracks();
      tracks.forEach(track => track.stop());
      this.videoDom.srcObject = null;
    }
  };

  componentDidMount() {
    if (this.CCanvas) return;
    let canvas = document.createElement('canvas');
    canvas.id = 'colorCanvas';
    canvas.style.position = 'absolute';
    canvas.style.zIndex = '9';
    const width = document.body.offsetWidth;
    const height = document.body.offsetHeight;
    const scale = 1;
    canvas.width = width * scale;
    canvas.height = height * scale;
    canvas.getContext('2d').scale(scale, scale);
    const opt = {
      scale: scale,
      canvas: canvas,
      logging: false,
      width: width,
      height: height,
      useCORS: true,
      scrollY: 0,
      scrollX: 0,
    };

    const constraints = {
      audio: false,
      video: true,
    };

    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }

    // webrtc版取色
    navigator.mediaDevices
      .getDisplayMedia(constraints)
      .then(stream => {
        this.videoDom.srcObject = stream;
        this.videoDom.autoplay = true;
        this.timer = setTimeout(() => {
          this.CCanvas = canvas;
          document.body.appendChild(this.CCanvas);

          this.CCanvas.getContext('2d').drawImage(
            this.videoDom,
            0,
            0,
            width,
            height,
          );
          this.ImageCtx = this.CCanvas.getContext('2d');
          this.visibility = VISIBLE;
          document.addEventListener('mousemove', this.handleMove);
          document.addEventListener('click', this.handleClick);
          document.addEventListener('mousedown', this.handleMouseDown);
          this.stopCapture();
        }, 500);
      })
      .catch(error => {
        const { handleFlag } = this.props;
        this.visibility = HIDDEN;
        handleFlag(false);
        clearTimeout(this.timer);
        this.timer = null;
        console.log('navigator.mediaDevices.getDisplayMedia error: ', error);
      });

    // html2canvas 版取色
    // this.timer = setTimeout(() => {
    //   html2canvas(document.body, opt).then(canv => {
    //     document.body.appendChild(canv);
    //     this.ImageCtx = canv.getContext('2d');
    //     this.CCanvas = canv;
    //     this.visibility = VISIBLE;

    //     document.addEventListener('mousemove', this.handleMove);

    //     document.addEventListener('click', this.handleClick);

    //     document.addEventListener('mousedown', this.handleMouseDown);
    //   });
    // }, 500);
  }

  handleMove = e => {
    const { left, top } = this.CCanvas.getBoundingClientRect();

    this.MoveCvasCtx &&
      this.MoveCvasCtx.clearRect(0, 0, this.CWidth, this.CHeight);
    this.drawImageSmoothingEnable(this.MoveCvasCtx, false);

    let centerX = Math.floor(e.clientX - left);
    let centerY = Math.floor(e.clientY - top);
    this.cLeft = Math.floor(centerX - this.CWidth / 2);
    this.cTop = Math.floor(centerY - this.CHeight / 2);
    (this.centerX = Math.floor(e.clientX - left)),
      (this.centerY = Math.floor(e.clientY - top)),
      this.MoveCvasCtx.drawImage(
        this.CCanvas,
        Math.floor(centerX - this.CWidth / 2 / INIT_NUMBER),
        Math.floor(centerY - this.CHeight / 2 / INIT_NUMBER),
        Math.floor(this.CWidth / INIT_NUMBER),
        Math.floor(this.CHeight / INIT_NUMBER),
        -INIT_NUMBER,
        -INIT_NUMBER,
        this.CWidth,
        this.CHeight,
      );

    this.drawGrid(this.MoveCvasCtx, GRID_COLOR, INIT_NUMBER, INIT_NUMBER);

    this.drawCenterRect(
      this.MoveCvasCtx,
      CENTERGRID_COLOR,
      Math.floor(this.CWidth / 2 - INIT_NUMBER),
      Math.floor(this.CHeight / 2 - INIT_NUMBER),
      INIT_NUMBER,
      INIT_NUMBER,
    );
    this.getColor();
  };

  handleClick = () => {
    this.getColor(true);
    this.MoveCvasCtx &&
      this.MoveCvasCtx.clearRect(0, 0, this.CWidth, this.CHeight);
    this.visibility = HIDDEN;
    document.body.removeChild(this.CCanvas);
    clearTimeout(this.timer);
    this.timer = null;
  };

  handleMouseDown = e => {
    const { handleClose } = this.props;
    if (e.button === 2) {
      handleClose && handleClose();
      this.MoveCvasCtx &&
        this.MoveCvasCtx.clearRect(0, 0, this.CWidth, this.CHeight);
      this.visibility = HIDDEN;
      document.body.removeChild(this.CCanvas);
      clearTimeout(this.timer);
      this.timer = null;
      e.stopPropagation();
    }
  };

  componentWillUnmount() {
    document.removeEventListener('mousemove', this.handleMove);
    document.removeEventListener('click', this.handleClick);
    document.removeEventListener('mousedown', this.handleMouseDown);
    clearTimeout(this.timer);
    this.timer = null;
  }

  getColor = (flag = false) => {
    const { pickColor, handleClose } = this.props;
    if (this.ImageCtx) {
      const { data } = this.ImageCtx.getImageData(
        this.centerX,
        this.centerY,
        1,
        1,
      );
      const color = this.transform2rgba(data);
      this.color = color;

      if (flag) {
        pickColor && pickColor(this.rgb2hex_a(this.color).hex);
        handleClose && handleClose();
      }
    }
  };

  drawImageSmoothingEnable = (context, enable) => {
    context.mozImageSmoothingEnabled = enable;
    context.webkitImageSmoothingEnabled = enable;
    context.msImageSmoothingEnabled = enable;
    context.imageSmoothingEnabled = enable;
  };

  drawGrid = (context, color, stepx, stepy) => {
    context.strokeStyle = color;
    context.lineWidth = 0.5;

    for (let i = stepx + 0.5; i < context.canvas.width; i += stepx) {
      context.beginPath();
      context.moveTo(i, 0);
      context.lineTo(i, context.canvas.height);
      context.stroke();
    }

    for (let i = stepy + 0.5; i < context.canvas.height; i += stepy) {
      context.beginPath();
      context.moveTo(0, i);
      context.lineTo(context.canvas.width, i);
      context.stroke();
    }
  };

  drawCenterRect = (context, color, x, y, width, height) => {
    context.strokeStyle = color;
    context.lineWidth = 1;
    context.strokeRect(x, y, width, height);
  };

  transform2rgba = arr => {
    arr[3] = parseFloat(arr[3] / 255);
    return `rgba(${arr.join(', ')})`;
  };

  render() {
    return (
      <div
        className="move-canvas"
        style={{
          width: this.CWidth,
          height: this.CHeight,
          transform: `translate3d(${this.cLeft}px, ${this.cTop}px, 0)`,
          visibility: this.visibility,
        }}
      >
        <canvas
          ref={el => (this.moveCvas = el)}
          width={this.CWidth}
          height={this.CHeight}
        ></canvas>
        <div
          style={{
            width: this.CWidth,
            height: this.CHeight / 4,
            transform: `translateY(-${this.CHeight / 2 - 20}px)`,
          }}
          className="show-color"
        >
          <div>{this.color}</div>
          <div>{this.rgb2hex_a(this.color).hex}</div>
        </div>
        <video
          ref={el => (this.videoDom = el)}
          style={{ display: 'none' }}
        ></video>
      </div>
    );
  }
}

export default class PickerColor extends React.Component<any, any> {
  public node: HTMLElement = null;
  state = {
    visible: false,
  };

  componentDidUpdate(prveProps, prveState) {
    const { pickColor } = this.props;
    if (this.state.visible && !this.node && !prveState.visible) {
      this.node = document.createElement('div');
      ReactDOM.render(
        <GetColor
          pickColor={pickColor}
          handleClose={this.handleClose}
          handleFlag={this.handleFlag}
        />,
        this.node,
      );
      document.body.appendChild(this.node);
    } else {
      if (this.node) {
        ReactDOM.unmountComponentAtNode(this.node);
        this.node.remove();
        this.node = null;
      }
    }
  }

  handleClick = () => {
    this.setState({ visible: true });
  };

  handleClose = () => {
    this.setState({ visible: false });
  };

  handleFlag = flag => {
    this.setState({ visible: flag });
  };

  render() {
    const { option } = this.props;
    const { visible } = this.state;
    const styles = {
      boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
      borderRadius: 1,
      marginLeft: 7,
      cursor: 'pointer',
      pointerEvents: visible ? 'none' : 'auto',
      ...option,
    };
    return (
      <div style={styles} onClick={this.handleClick}>
        <svg
          width={option.width}
          height={option.height}
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="2113"
        >
          <path
            d="M832.853333 191.146667a66.986667 66.986667 0 0 0-95.146666 0L673.706667 256 622.933333 203.946667a42.666667 42.666667 0 0 0-60.16 0 42.666667 42.666667 0 0 0 0 60.16l26.453334 26.453333-322.133334 322.133333L256 686.506667l-67.413333 65.28a59.306667 59.306667 0 1 0 85.333333 85.333333l65.28-65.28 73.386667-13.226667 321.706666-322.133333 26.88 26.453333a42.666667 42.666667 0 0 0 29.866667 12.373334 42.666667 42.666667 0 0 0 30.293333-12.373334 42.666667 42.666667 0 0 0 0-60.16L768 349.866667l63.573333-63.573334a66.986667 66.986667 0 0 0 1.28-95.146666z m-305.493333 389.12H360.106667l259.413333-259.413334 85.333333 85.333334z"
            p-id="2114"
          ></path>
        </svg>
      </div>
    );
  }
}
