import { Expose } from '@/class-transformer';
import { observable } from 'mobx';

export enum CWResourceTypes {
  Text = -1,
  RichText = 10,
  Image = 0, //图片
  Audio = 1, //音频
  Video = 2, //视频
  SkeletalAni = 3, //动画
  Font = 4, //字体
  TextImage = 5, //文字转图片
  Captions = 6, //字幕
  ComplexControl = 1000, //控件
  All = 99999,
}

export enum ElementTypes {
  Image = 0,
  Text = 1,
  Skeleton = 2,
  Combined = 3,
  RichText = 4,
  RectMazeController = 1002,
  RectMaze = 1001,
  Chessman = 1003,
  Keyboard = 1004,
  CustomText = 1005,
  Writing = 1013,
  ProgressBar = 1015,
  SpeechRecognition = 1012,
  dragTheLayoutController = 1014,
  sortRectBox = 1017,
  jigsawPuzzle = 1016,
  tetris = 1019,
  videoPlayer = 1018,
  dragSeekBar = 1011,
  captions = 1020,
  colorMatrix = 1021,
  Clock = 1022,
  newVideoPlayer = 1023,
  questionAttribute = 1024,
  FloatVideoPlayer = 1025, //浮动视频控件
}

/// <summary>
/// 背景循环模式
/// </summary>
export enum CirculationMode {
  Static, //静止
  RightToLeft, //从右到左
  LeftToRight, //从左到右
  TopToDown, //从上到下
  DownToTop, //从下到上
}

/// <summary>
/// 页面过场动画
/// </summary>
export enum OpAnimationType {
  Default, //默认
  Road, //公路
  Fly, //飞行
  Walk, //散步
  Abrase, //擦除
}

/// <summary>
/// 装饰下标类型
/// </summary>
export enum AdornerMode {
  GenerationOrder, //生成顺序
  ParentOrder, //父元素顺序
}

export enum AnimationType {
  Gradual, //渐进
  Zoom, // 缩放
  Bounce, //弹跳
  Included, //滑入
  FloatIn, //浮入
  Abrase, //擦除
}

//划入-浮入-擦除方式
export enum IncludedType {
  Left,
  Right,
  Top,
  Bottom,
}

/// <summary>
/// 缩放方式
/// </summary>
export enum ZoomType {
  Self, //自身为中心
  Center, //课件为中心
}

/// <summary>
/// 元素出现形式
/// </summary>
export enum AppearTypes {
  Auto = 0,
  CEvent = 1,
}

export enum ClassType {
  string = 0,
  number = 1,
  bool = 2,
  json = 3,
  resource = 4,
  enum = 5,
  object = 6,
}

export class ElementAnimation {
  @Expose()
  @observable
  public AntType: AnimationType = AnimationType.Gradual;
  @Expose()
  @observable
  IcdType: IncludedType = IncludedType.Left;
  @Expose()
  @observable
  ZoomType: ZoomType = ZoomType.Self;
  @Expose()
  @observable
  Timer: number = 0;
}

export enum Alignment {
  Left,
  Center,
  Right,
  Default,
}

export enum VAlignment {
  Top,
  Center,
  Bottom,
  Default,
}
