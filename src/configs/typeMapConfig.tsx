import CWElement from '@/modelClasses/courseDetail/cwElement';
import InvokableBase from '@/modelClasses/courseDetail/InvokableBase';
import ImgSkItem from '@/modelClasses/courseDetail/editItemViewModels/imgSkItem';
import {
  ElementTypes,
  CWResourceTypes,
} from '@/modelClasses/courseDetail/courseDetailenum';
import TextEditItem from '@/modelClasses/courseDetail/editItemViewModels/textEditItem';
import CombinedEditItem from '@/modelClasses/courseDetail/editItemViewModels/combinedEditItem';
import TypeMapHelper, { InvokableTypeDesc } from './typeMapHelper';
import { AudioPlayer } from '@/modelClasses/courseDetail/InvokeDesign/logicViewModels/Invokables/Effect/AudioPlayer';
import WritingComplex from '@/modelClasses/courseDetail/editItemViewModels/complexControl/WritingControl/WritingComplex';
import SpeechRecognition from '@/modelClasses/courseDetail/editItemViewModels/complexControl/speechRecognitionControl/speechRecognitionControllerViewModel';
import dragTheLayoutController from '@/modelClasses/courseDetail/editItemViewModels/complexControl/dragTheLayoutContainer/dragTheLayoutViewModel';
import sortRectBox from '@/modelClasses/courseDetail/editItemViewModels/complexControl/sortRectBoxControl/sortRectBoxComplex';
import jigsawPuzzle from '@/modelClasses/courseDetail/editItemViewModels/complexControl/jigsawPuzzleControl/jigsawPuzzleViewModel';
import RectMaze from '@/modelClasses/courseDetail/editItemViewModels/complexControl/RectMazeComplex';
import tetris from '@/modelClasses/courseDetail/editItemViewModels/complexControl/tetrisControl/tetrisComplex';
import videoPlayer from '@/modelClasses/courseDetail/editItemViewModels/complexControl/videoPlayerControl/videoPlayerComplex';
import newVideoPlayer from '@/modelClasses/courseDetail/editItemViewModels/complexControl/newVideoPlayerComplex/newVideoPlayerComplex';
import floatVideoPlayer from '@/modelClasses/courseDetail/editItemViewModels/complexControl/floatVideoPlayerControl/floatVideoPlayerComplex';
import dragSeekBar from '@/modelClasses/courseDetail/editItemViewModels/complexControl/dragSeekBarControl/dragSeekBarComplex';
import richTextComplex from '@/modelClasses/courseDetail/editItemViewModels/complexControl/richTextControl/richTextComplex';
import { RegisterSetter } from '@/modelClasses/courseDetail/InvokeDesign/logicViewModels/Invokables/Memory/RegisterSetter';
import RegisterGetter from '@/modelClasses/courseDetail/InvokeDesign/logicViewModels/Invokables/Memory/RegisterGetter';
import GeneralChecker from '@/modelClasses/courseDetail/InvokeDesign/logicViewModels/Invokables/Branch/GeneralChecker';
import SimpleCaculator from '@/modelClasses/courseDetail/InvokeDesign/logicViewModels/Invokables/Caculator/SimpleCaculator';
import SwitchChecker from '@/modelClasses/courseDetail/InvokeDesign/logicViewModels/Invokables/Branch/SwitchChecker';
import CommonActuator from '@/modelClasses/courseDetail/InvokeDesign/logicViewModels/Invokables/Effect/CommonActuator';
import RectMazeController from '@/modelClasses/courseDetail/editItemViewModels/complexControl/mazecontrol/rectMazeController';
import InvFunction from '@/modelClasses/courseDetail/InvokeDesign/logicViewModels/Invokables/InvFunc/InvFunction';
import {
  FuncInput,
  FuncOutput,
  FuncDataInput,
  FuncDataOutput,
} from '@/modelClasses/courseDetail/InvokeDesign/logicViewModels/Invokables/InvFunc/FuncInvokeProxy';
import Chessman from '@/modelClasses/courseDetail/editItemViewModels/complexControl/rectmazecontrol/chessman';
import KeyboardComplex from '@/modelClasses/courseDetail/editItemViewModels/complexControl/keyboardcontrol/KeyboardComplex';
import SingleParamCaculator from '@/modelClasses/courseDetail/InvokeDesign/logicViewModels/Invokables/Caculator/SingleParamCaculator';
import EditItemsGetter from '@/modelClasses/courseDetail/InvokeDesign/logicViewModels/Invokables/EditItemManage/EditItemsGetter';
import TextPainter from '@/modelClasses/courseDetail/InvokeDesign/logicViewModels/Invokables/Effect/TextPainter';
import FreeCaculator from '@/modelClasses/courseDetail/InvokeDesign/logicViewModels/Invokables/Caculator/FreeCaculator';
import CustomLogicItem from '@/modelClasses/courseDetail/InvokeDesign/logicViewModels/Invokables/Branch/CustomLogicItem';
import ElementTigger from '@/modelClasses/courseDetail/InvokeDesign/logicViewModels/Invokables/Effect/ElementTigger';
import GestureChangedAction from '@/modelClasses/courseDetail/InvokeDesign/logicViewModels/Invokables/Effect/GestureChangedAction';
import SendMessage from '@/modelClasses/courseDetail/InvokeDesign/logicViewModels/Invokables/Effect/SendMessage';
import SkReSouceValidChangedAction from '@/modelClasses/courseDetail/InvokeDesign/logicViewModels/Invokables/Effect/SkReSouceValidChangedAction';
import {
  ResourceRef,
  SkResRef,
} from '@/modelClasses/courseDetail/resRef/resourceRef';
import TimerPlayer from '@/modelClasses/courseDetail/InvokeDesign/logicViewModels/Invokables/Effect/TimerPlayer';
import SkPlayCompleted from '@/modelClasses/courseDetail/InvokeDesign/logicViewModels/Invokables/Effect/SkPlayCompleted';
import MissionMultipleLine from '@/modelClasses/courseDetail/InvokeDesign/logicViewModels/Invokables/Effect/MissionMultipleLine';
import SimpleAniActuator from '@/modelClasses/courseDetail/InvokeDesign/logicViewModels/Invokables/Effect/SimpleAniActuator';
import MissionSubmitter from '@/modelClasses/courseDetail/InvokeDesign/logicViewModels/Invokables/Mission/MissionSubmitter';
import MissionJudger from '@/modelClasses/courseDetail/InvokeDesign/logicViewModels/Invokables/MissionGroup/MissionJudger';
import MissonMatch from '@/modelClasses/courseDetail/InvokeDesign/logicViewModels/Invokables/Mission/MissonMatch';
import StopMisson from '@/modelClasses/courseDetail/InvokeDesign/logicViewModels/Invokables/Mission/StopMisson';
import MissonMaths from '@/modelClasses/courseDetail/InvokeDesign/logicViewModels/Invokables/Mission/MissonMaths';
import SkeletalFreqMission from '@/modelClasses/courseDetail/InvokeDesign/logicViewModels/Invokables/Mission/SkeletalFreqMission';
import MissionAccumulation from '@/modelClasses/courseDetail/InvokeDesign/logicViewModels/Invokables/Mission/MissionAccumulation';
import CustomText from '@/modelClasses/courseDetail/editItemViewModels/complexControl/customtextcontrol/customtext';
import MissionEntityTag from '@/modelClasses/courseDetail/InvokeDesign/logicViewModels/Invokables/MissionGroup/MissionEntityTag';
import MissionNexhaustivity from '@/modelClasses/courseDetail/InvokeDesign/logicViewModels/Invokables/MissionGroup/MissionNexhaustivity';
import ProgressBar from '@/modelClasses/courseDetail/editItemViewModels/complexControl/progressbarcontrol/progressBar';
import ReceiveMessage from '@/modelClasses/courseDetail/InvokeDesign/logicViewModels/Invokables/Effect/ReceiveMessage';
import ReceiveSpeechMessage from '@/modelClasses/courseDetail/InvokeDesign/logicViewModels/Invokables/Effect/ReceiveSpeechMessage';
import MissionLineGroup from '@/modelClasses/courseDetail/InvokeDesign/logicViewModels/Invokables/MissionGroup/MissionLineGroup';
import CaptionsViewModel from '@/modelClasses/courseDetail/editItemViewModels/complexControl/captionscontrol/captionsViewModel';
import colorMatrixComplex from '@/modelClasses/courseDetail/editItemViewModels/complexControl/colorMatrixControl/colorMatrixComplex';
import CaptionsCtrler from '@/modelClasses/courseDetail/InvokeDesign/logicViewModels/Invokables/Effect/CaptionsCtrler';
import MissionActionGroup from '@/modelClasses/courseDetail/InvokeDesign/logicViewModels/Invokables/MissionGroup/MissionActionGroup';
import SwitchResource from '@/modelClasses/courseDetail/InvokeDesign/logicViewModels/Invokables/Effect/SwitchResource';
import ClockViewModel from '@/modelClasses/courseDetail/editItemViewModels/complexControl/clockcontrol/clockViewModel';
import AniGroupActuator from '@/modelClasses/courseDetail/InvokeDesign/logicViewModels/Invokables/Effect/AniGroupActuator';
import PageControler from '@/modelClasses/courseDetail/InvokeDesign/logicViewModels/Invokables/Effect/PageControler';
import QuestionAttribute from '@/modelClasses/courseDetail/editItemViewModels/complexControl/questionAttribute/questionAttributeModel';
import PresetCommand from '@/modelClasses/courseDetail/InvokeDesign/logicViewModels/Invokables/Effect/PresetCommand';

export default class TypeMapConfig {
  static get CommonTypeMap() {
    return [
      {
        type: CWElement,
        discriminator: TypeMapConfig.ElementTypeDiscriminator,
        keepDiscriminatorProperty: true, //保持原有的类型参数值
      }, //反序列化时的类型分类器
      {
        type: InvokableBase,
        discriminator: TypeMapConfig.InvokableTypeDiscriminator,
        keepDiscriminatorProperty: true,
      },
      {
        type: ResourceRef,
        discriminator: TypeMapConfig.ResRefTypeDiscriminator,
        keepDiscriminatorProperty: true,
      },
    ];
  }

  //控件元素数据构造
  static get ElementTypeDiscriminator() {
    return {
      property: 'ElementType',
      subTypes: [
        {
          value: ImgSkItem,
          name: ElementTypes.Image,
          title: '基本元素',
          width: 100,
          height: 100,
          thumb: require('@/assets/controlthumb/img.png'),
        },
        {
          value: TextEditItem,
          name: ElementTypes.Text,
          title: '文本',
          width: 200,
          height: 100,
          thumb: require('@/assets/controlthumb/text.png'),
        },
        {
          value: richTextComplex,
          name: ElementTypes.RichText,
          title: '富文本',
          width: 450,
          height: 250,
          thumb: require('../assets/controlthumb/text.png'),
        },
        { value: ImgSkItem, name: ElementTypes.Skeleton, title: '动画' },
        {
          value: CombinedEditItem,
          name: ElementTypes.Combined,
          title: '组合元素',
        },
        {
          value: Chessman,
          name: ElementTypes.Chessman,
          title: '棋子控件',
          width: 200,
          height: 200,
          thumb: require('@/assets/controlthumb/chessman.png'),
        },
        {
          value: RectMaze,
          name: ElementTypes.RectMaze,
          title: '矩形迷宫',
          width: 500,
          height: 400,
          thumb: require('@/assets/controlthumb/maze.png'),
        },

        {
          value: RectMazeController,
          name: ElementTypes.RectMazeController,
          title: '矩阵迷宫-控制器',
          width: 200,
          height: 200,
          thumb: require('@/assets/controlthumb/controller.png'),
        },
        {
          value: KeyboardComplex,
          name: ElementTypes.Keyboard,
          title: '输出键盘',
          width: 300,
          height: 100,
          thumb: require('@/assets/controlthumb/output.png'),
        },
        {
          value: CustomText,
          name: ElementTypes.CustomText,
          title: '输入容器',
          width: 200,
          height: 200,
          thumb: require('@/assets/controlthumb/stackpanel.png'),
        },
        {
          value: ProgressBar,
          name: ElementTypes.ProgressBar,
          title: '滑动控件',
          width: 200,
          height: 200,
          thumb: require('@/assets/controlthumb/sliders.png'),
        },
        {
          value: WritingComplex,
          name: ElementTypes.Writing,
          title: '文字书写',
          width: 350,
          height: 350,
          thumb: require('@/assets/controlthumb/write.png'),
        },
        {
          value: SpeechRecognition,
          name: ElementTypes.SpeechRecognition,
          title: '语音识别',
          width: 350,
          height: 200,
          thumb: require('@/assets/controlthumb/voice.png'),
        },
        {
          value: dragTheLayoutController,
          name: ElementTypes.dragTheLayoutController,
          title: '布局盒子',
          width: 280,
          height: 150,
          thumb: require('@/assets/controlthumb/box.png'),
        },
        {
          value: sortRectBox,
          name: ElementTypes.sortRectBox,
          title: '排序盒子',
          width: 700,
          height: 140,
          thumb: require('@/assets/controlthumb/sort.png'),
        },
        {
          value: jigsawPuzzle,
          name: ElementTypes.jigsawPuzzle,
          title: '拼图控件',
          width: 350,
          height: 350,
          thumb: require('@/assets/controlthumb/jigsaw.png'),
        },
        {
          value: tetris,
          name: ElementTypes.tetris,
          title: '俄罗斯方块',
          width: 250,
          height: 250,
          thumb: require('@/assets/controlthumb/Tetris.png'),
        },
        {
          value: videoPlayer,
          name: ElementTypes.videoPlayer,
          title: '(旧)视频控件',
          width: 100,
          height: 100,
          thumb: require('@/assets/controlthumb/video.png'),
        },
        {
          value: dragSeekBar,
          name: ElementTypes.dragSeekBar,
          title: '拖动进度条',
          width: 350,
          height: 150,
          thumb: require('@/assets/controlthumb/dragSeek.png'),
        },
        {
          value: CaptionsViewModel,
          name: ElementTypes.captions,
          title: '自定义字幕',
          width: 550,
          height: 150,
          thumb: require('@/assets/controlthumb/captions.png'),
        },
        {
          value: colorMatrixComplex,
          name: ElementTypes.colorMatrix,
          title: '涂色矩阵',
          width: 150,
          height: 150,
          thumb: require('@/assets/controlthumb/colorMatrix.png'),
        },
        {
          value: ClockViewModel,
          name: ElementTypes.Clock,
          title: '时钟控件',
          width: 150,
          height: 150,
          thumb: require('@/assets/controlthumb/clock.png'),
        },
        {
          value: newVideoPlayer,
          name: ElementTypes.newVideoPlayer,
          title: '(新)视频控件',
          width: 150,
          height: 150,
          thumb: require('@/assets/controlthumb/video.png'),
        },
        {
          value: QuestionAttribute,
          name: ElementTypes.questionAttribute,
          title: '题目属性',
          width: 150,
          height: 150,
          thumb: require('@/assets/controlthumb/question.png'),
        },
        {
          value: floatVideoPlayer,
          name: ElementTypes.FloatVideoPlayer,
          title: '浮动视频',
          width: 400,
          height: 400,
          thumb: require('@/assets/controlthumb/video.png'),
        },
      ],
    };
  }

  //控制器数据构造
  static get InvokableTypeDiscriminator(): InvokableTypeDesc {
    return {
      property: 'Type',
      subTypes: [
        {
          value: InvFunction,
          name: 'InvFunction',
          grouptype: 'InvokableGroup',
          cat: '函数',
          type: '函数',
          desc: '函数',
        },
        {
          value: FuncInput,
          name: 'FuncInput',
          grouptype: 'InnerFunc',
          cat: '函数',
          type: '函数接口',
          desc: '函数入口',
        },
        {
          value: FuncOutput,
          name: 'FuncOutput',
          grouptype: 'InnerFunc',
          cat: '函数',
          type: '函数接口',
          desc: '函数出口',
        },
        {
          value: FuncDataInput,
          name: 'FuncDataInput',
          grouptype: 'InnerFunc',
          cat: '函数',
          type: '函数接口',
          desc: '数值输入',
        },
        {
          value: FuncDataOutput,
          name: 'FuncDataOutput',
          grouptype: 'InnerFunc',
          cat: '函数',
          type: '函数接口',
          desc: '数值输出',
        },
        {
          value: CommonActuator,
          name: 'CommonActuator',
          grouptype: 'ExecuteGroup',
          cat: '元素控制',
          type: '执行器',
          desc: '通用执行器',
          linecolor: {
            InvId: 'black',
          },
        },
        {
          value: SimpleAniActuator,
          name: 'SimpleAniActuator',
          grouptype: 'ExecuteGroup',
          cat: '元素控制',
          type: '执行器',
          desc: '简单动画执行器',
        },
        {
          value: AniGroupActuator,
          name: 'AniGroupActuator',
          grouptype: 'ExecuteGroup',
          cat: '元素控制',
          type: '执行器',
          desc: '缓动动画组',
        },
        {
          value: TextPainter,
          name: 'TextPainter',
          grouptype: 'ExecuteGroup',
          cat: '元素控制',
          type: '执行器',
          desc: '文本输出组件',
        },
        // {
        //   value: CaptionsCtrler,
        //   name: 'CaptionsCtrler',
        //   grouptype: 'ExecuteGroup',
        //   cat: '元素控制',
        //   type: '执行器',
        //   desc: '字幕控制',
        // },
        {
          value: ElementTigger,
          name: 'ElementTigger',
          grouptype: 'ExecuteGroup',
          cat: '元素控制',
          type: '执行器',
          desc: '元素触发控制器',
        },
        {
          value: GestureChangedAction,
          name: 'GestureChangedAction',
          grouptype: 'ExecuteGroup',
          cat: '元素控制',
          type: '执行器',
          desc: '手势切换器',
        },
        {
          value: SkReSouceValidChangedAction,
          name: 'SkReSouceValidChangedAction',
          grouptype: 'ExecuteGroup',
          cat: '元素控制',
          type: '执行器',
          desc: '元素动画切换器',
        },
        {
          value: EditItemsGetter,
          name: 'EditItemsGetter',
          grouptype: 'MemoryController',
          cat: '元素控制',
          type: '寄存器',
          desc: '元素选择',
        },
        {
          value: SkPlayCompleted,
          name: 'SkPlayCompleted',
          grouptype: 'ExecuteGroup',
          cat: '元素控制',
          type: '执行器',
          desc: '动画播放器',
        },

        {
          value: AudioPlayer,
          name: 'AudioPlayer',
          grouptype: 'ExecuteGroup',
          cat: '媒体控制',
          type: '执行器',
          desc: '配音播放器',
          resBuild: CWResourceTypes.Audio,
        },
        {
          value: SendMessage,
          name: 'SendMessage',
          grouptype: 'ExecuteGroup',
          cat: '剧情控制',
          type: '执行器',
          desc: '消息发送器',
        },
        // {
        //   value: ReceiveMessage,
        //   name: 'ReceiveMessage',
        //   grouptype: 'ExecuteGroup',
        //   cat: '剧情控制',
        //   type: '执行器',
        //   desc: '消息接收器',
        // },
        {
          value: ReceiveSpeechMessage,
          name: 'ReceiveSpeechMessage',
          grouptype: 'ExecuteGroup',
          cat: '剧情控制',
          type: '执行器',
          desc: '语音消息接收器',
        },
        {
          value: TimerPlayer,
          name: 'TimerPlayer',
          grouptype: 'ExecuteGroup',
          cat: '剧情控制',
          type: '执行器',
          desc: '计时执行器',
        },
        // 暂时不需要
        // {
        //   value: PresetCommand,
        //   name: 'PresetCommand',
        //   grouptype: 'ExecuteGroup',
        //   cat: '剧情控制',
        //   type: '执行器',
        //   desc: '预置命令器',
        // },
        {
          value: MissionMultipleLine,
          name: 'MissionMultipleLine',
          grouptype: 'MissionAction',
          cat: '行为控制',
          type: '执行器',
          desc: '点击连线器',
        },
        {
          value: PageControler,
          name: 'PageControler',
          grouptype: 'MissionAction',
          cat: '行为控制',
          type: '执行器',
          desc: '附加题跳转器',
        },
        {
          value: SwitchResource,
          name: 'SwitchResource',
          grouptype: 'MissionAction',
          cat: '行为控制',
          type: '执行器',
          desc: '资源替换组件',
        },
        {
          value: MissionActionGroup,
          name: 'MissionActionGroup',
          grouptype: 'MissionAction',
          cat: '行为控制',
          type: '执行器',
          desc: '元素分组器',
        },
        {
          value: MissionSubmitter,
          name: 'MissionSubmitter',
          grouptype: 'MissionGroup',
          cat: '任务控制',
          type: '提交器',
          desc: '任务提交器',
        },
        {
          value: MissonMatch,
          name: 'MissonMatch',
          grouptype: 'MissionGroup',
          cat: '任务控制',
          type: '提交器',
          desc: '标签匹配器',
        },
        {
          value: MissonMaths,
          name: 'MissonMaths',
          grouptype: 'MissionGroup',
          cat: '任务控制',
          type: '提交器',
          desc: '任务运算器',
        },
        {
          value: MissionAccumulation,
          name: 'MissionAccumulation',
          grouptype: 'MissionGroup',
          cat: '任务控制',
          type: '提交器',
          desc: '标签累加器',
        },
        {
          value: SkeletalFreqMission,
          name: 'SkeletalFreqMission',
          grouptype: 'MissionGroup',
          cat: '任务控制',
          type: '提交器',
          desc: '动画判定器',
        },
        {
          value: StopMisson,
          name: 'StopMisson',
          grouptype: 'MissionGroup',
          cat: '任务控制',
          type: '提交器',
          desc: '控制逻辑器',
        },
        {
          value: MissionJudger,
          name: 'MissionJudger',
          grouptype: 'MultiMissionGroup',
          cat: '任务控制',
          type: '记录器',
          desc: '任务记录器',
        },
        {
          value: MissionNexhaustivity,
          name: 'MissionNexhaustivity',
          grouptype: 'MultiMissionGroup',
          cat: '任务控制',
          type: '记录器',
          desc: '任务枚举器[废弃]',
        },
        {
          value: MissionLineGroup,
          name: 'MissionLineGroup',
          grouptype: 'MultiMissionGroup',
          cat: '任务控制',
          type: '记录器',
          desc: '连线任务器',
        },
        {
          value: MissionEntityTag,
          name: 'MissionEntityTag',
          grouptype: 'MultiMissionGroup',
          cat: '任务控制',
          type: '记录器',
          desc: '对象标签器',
        },
        {
          value: RegisterSetter,
          name: 'RegisterSetter',
          grouptype: 'MemoryController',
          cat: '存储',
          type: '寄存器',
          desc: '寄存器设置组件',
        },
        {
          value: RegisterGetter,
          name: 'RegisterGetter',
          grouptype: 'MemoryController',
          cat: '存储',
          type: '寄存器',
          desc: '寄存器读取组件',
        },
        {
          value: GeneralChecker,
          name: 'GeneralChecker',
          grouptype: 'Branch',
          cat: '判断',
          type: '判断',
          desc: '通用判断组件',
          linecolor: {
            SucessId: 'blue',
            ErrorId: 'red',
          },
        },
        {
          value: SwitchChecker,
          name: 'SwitchChecker',
          grouptype: 'Branch',
          cat: '判断',
          type: '判断',
          desc: '分支组件',
        },
        {
          value: CustomLogicItem,
          name: 'CustomLogicItem',
          grouptype: 'Branch',
          cat: '判断',
          type: '判断',
          desc: '自定义判断组件',
        },
        {
          value: SimpleCaculator,
          name: 'SimpleCaculator',
          grouptype: 'Caculator',
          cat: '计算',
          type: '计算',
          desc: '简单计算组件',
        },
        {
          value: SingleParamCaculator,
          name: 'SingleParamCaculator',
          grouptype: 'Caculator',
          cat: '计算',
          type: '计算',
          desc: '单值计算组件',
        },
        {
          value: FreeCaculator,
          name: 'FreeCaculator',
          grouptype: 'Caculator',
          cat: '计算',
          type: '计算',
          desc: '自定义计算组件',
        },
      ],
    };
  }

  //资源类型
  static get ResRefTypeDiscriminator() {
    return {
      property: 'ResourceType',
      subTypes: [
        {
          value: ResourceRef,
          name: CWResourceTypes.Image, //图片
        },
        {
          value: SkResRef,
          name: CWResourceTypes.SkeletalAni, //动画
        },
        {
          value: ResourceRef,
          name: CWResourceTypes.Audio, //音频
        },
        {
          value: ResourceRef,
          name: CWResourceTypes.Video, //视频
        },
      ],
    };
  }

  static BuildTypeMap() {
    TypeMapHelper.ElementTypeDiscriminator =
      TypeMapConfig.ElementTypeDiscriminator;
    TypeMapHelper.InvokableTypeDiscriminator =
      TypeMapConfig.InvokableTypeDiscriminator;
    TypeMapHelper.ResRefTypeDiscriminator =
      TypeMapConfig.ResRefTypeDiscriminator;
    TypeMapHelper.CommonTypeMap = TypeMapConfig.CommonTypeMap;
  }
}
