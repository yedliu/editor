import 'reflect-metadata';
import React from 'react';
import { observer } from 'mobx-react';
import {
  Table,
  Pagination,
  Input,
  Cascader,
  Radio,
  Select,
  Modal,
  Button,
  Menu,
  Dropdown,
  Tooltip,
  Popover,
  message,
  Popconfirm,
} from 'antd';
import { Courseware } from '@/modelClasses/courseware';
import { action, runInAction, observable } from 'mobx';
import HttpService from '@/server/httpServer';
import TimerHelper from '@/utils/timerHelper';
import { removeEmptyVoList } from '@/models/designres';
import { PlayCoursePreiew } from '../PlayCoursePreview';
import TextArea from 'antd/lib/input/TextArea';
import {
  CloseIcon,
  NewMoreIcon,
  NewUploadingIcon,
  NewCoursewareListIcon,
  NewCoursewareGridIcon,
} from '@/utils/customIcon';
import { EditableTagGroup } from '@/components/controls/editableTagGroup';
import IdHelper from '@/utils/idHelper';
import '@/styles/property.less';
import CacheHelper from '@/utils/cacheHelper';
const { Search } = Input;
const { Option } = Select;
import QRCode from 'qrcode.react';
import '@/styles/body.less';
import {
  StatisticEntity,
  StatisticPanel,
} from '@/components/cwDesignUI/logicView/StatisticPanel';
import antStyle from '@/styles/defaultAnt.less';
import GridItemView from './gridItemView';
import { deserializeArray } from '@/class-transformer';
import CWPage from '@/modelClasses/courseDetail/cwpage';
import TypeMapHelper from '@/configs/typeMapHelper';
import TypeMapConfig from '@/configs/typeMapConfig';
import FolderView from '../folderView';
import copy from 'copy-to-clipboard';
import { serialize, classToPlain } from '@/class-transformer';
import CWResource from '@/modelClasses/courseDetail/cwResource';

@observer
class CoursePage extends React.Component<any, any> {
  constructor(props) {
    super(props);
  }

  //在table里面@observable不起作用
  state = {
    visible: false,
    visibleModal: false,
    rechristenVisible: false,
    RechristenText: String,
    //delVisible:false,
  };

  //#region  首页改版添加

  @observable
  selectCId: string = null;

  //#region 删除相关方法

  // deleteAffirmShow = () => {
  //   this.setState({
  //     delVisible: true,
  //   });
  // };

  // deleteAffirmHide = () => {
  //   this.setState({
  //     delVisible: false,
  //   });
  // };

  // deleteHandleOk(cwId){
  //     this.deleteCourseWare(cwId);
  //     this.deleteAffirmHide();
  // }

  // deleteHandleCancel(){
  //     this.deleteAffirmHide();
  // }

  //#endregion

  //#endregion

  @observable
  statisticEntity: StatisticEntity;
  //复制和二维码使用
  @observable
  cid: string;

  //#region 复制删除弹出确认
  //是否删除操作
  @observable
  isDel: boolean = false;
  //是否复制操作
  @observable
  isCopy: boolean = false;
  //是否拆分操作
  @observable
  isSplit: boolean = false;

  @observable
  promptText: string;

  showModal = () => {
    this.setState({
      visibleModal: true,
    });
  };

  handleOk = e => {
    if (this.isDel) this.deleteCourseWare(this.cid);
    else if (this.isCopy) this.CopyCourseWare(this.cid);
    else if (this.isSplit) this.SplitCourseWare(this.cid);

    this.setState({
      visibleModal: false,
    });
  };

  handleCancel = e => {
    if (this.state.visibleModal == false) return;
    this.setState({
      visibleModal: false,
    });
  };

  //#endregion

  //#region 重命名

  // @observable
  // RechristenText:string = '';

  showRechristen = () => {
    this.setState({
      rechristenVisible: true,
    });
  };

  hideRechristen = () => {
    if (this.state.rechristenVisible == false) return;
    this.setState({
      rechristenVisible: false,
    });
  };

  setRechristenText = text => {
    this.setState({
      RechristenText: text,
    });
  };

  updateName() {
    console.log(this.state.RechristenText.toString().trim());
    if (this.state.RechristenText.toString().trim() == '') {
      message.info('课件名称不能是空的');
      return;
    }
    let profile = {
      coursewareId: this.cid,
      coursewareName: this.state.RechristenText.toString().trim(),
    };
    this.UpdateCourseWareName(profile);
  }

  @action UpdateCourseWareName = async (course: any) => {
    var data = await HttpService.UpdateCourse(course);
    runInAction(() => {
      if (data) {
        this.LookupCourseWareAsync(
          this.keywords,
          this.domain,
          this.upload,
          this.directoryId,
          this.bu,
          1,
        );
        message.success('重命名成功');
        this.setRechristenText('');
        this.hideRechristen();
      } else {
        //message.error('修改失败');
      }
    });
  };

  //#endregion

  //#region 二维码

  showQRCode = () => {
    this.setState({
      visible: true,
    });
  };

  hideQRCode = () => {
    if (this.state.visible == false) return;
    this.setState({
      visible: false,
    });
  };

  handleVisibleChange = visible => {
    this.setState({ visible });
  };

  @observable
  QRCodeText: string;

  @action GetQRCode = async cid => {
    var data = await HttpService.GetQRCode(cid);
    runInAction(() => {
      if (data) {
        this.QRCodeText = data;
        this.showQRCode();
      }
    });
  };

  //  @observable
  //  isQrCodeShow: boolean = false;

  //#endregion

  //#region 共享/取消共享
  @action SharedOperation = async (courseware: Courseware) => {
    var bool = courseware.shared == 0 ? 1 : 0;
    var data = await HttpService.sharedOperation(courseware.coursewareId, bool);
    runInAction(() => {
      if (data) {
        //var _coursewares= this.coursewares;//刷新coursewares
        //this.coursewares =new Array<Courseware>();
        if (courseware.shared == 0) {
          message.success('共享成功');
          courseware.shared = 1;
        } else {
          message.success('取消共享成功');
          courseware.shared = 0;
        }

        this.LookupCourseWareAsync(
          this.keywords,
          this.domain,
          this.upload,
          this.directoryId,
          this.bu,
          1,
        );
        //this.coursewares =_coursewares;
      }
    });
  };
  //#endregion

  //#region 删除课件
  @action deleteCourseWare = async cid => {
    var data = await HttpService.deleteCourseWare(cid);
    runInAction(() => {
      if (data) {
        message.success('删除成功');
        this.LookupCourseWareAsync(
          this.keywords,
          this.domain,
          this.upload,
          this.directoryId,
          this.bu,
          1,
        );
      } else {
        message.success('删除失败');
      }
    });
  };
  //#endregion

  @observable
  coursewares: Array<Courseware>;
  @observable
  totalCounts: number = 0;
  @observable
  domain: number = 0;
  @observable
  keywords: string;
  @observable
  pageIndex: number = 1;
  @observable
  bu: number;
  @observable
  upload: number = -1;

  // @observable
  // directoryId: any;
  @observable
  showDirectory: boolean = false;
  @observable
  private _directoryId: any[];
  public get directoryId(): any[] {
    return this._directoryId;
  }
  public set directoryId(v: any[]) {
    this.showDirectory = false;
    this._directoryId = v;
    if (v) {
      var id = v[v.length - 1];
      this.directoryCountList?.forEach(element => {
        if (element.id == id) {
          this.showDirectory = true;
          return;
        }
      });
    }
  }

  @observable
  bulist: any[];
  @observable
  courseWareTypeList: any[];
  @observable
  coursewaresSum: number = 0;
  @observable
  private _directoryCountList: any[];
  public get directoryCountList(): any[] {
    return this._directoryCountList;
  }
  public set directoryCountList(v: any[]) {
    this._directoryCountList = v;
    this.coursewaresSum = 0;
    v?.forEach(element => {
      this.coursewaresSum += element.useCount;
    });
  }

  @observable
  isDoubleOpen: boolean = true;
  //表格列表高度滚动条
  @observable
  scrollY: number = 0;
  scrollHeight: number = 240;

  ///子集合
  @observable
  courseWareTypeChildList: any[];

  //当前选中项情况
  selectedCourse: Courseware;
  //上传项目字段
  @observable
  uploadText: string;

  //新增修改项目字段
  @observable
  addupdateCourseTitle: string = '新增项目';

  //Model 窗口属性通知
  @observable
  windowWidth: number = 400;
  @observable
  isWindowShow: boolean = false;
  ///1上传项目 2新增修改
  @observable
  windowsStyle: number = 0;

  //上传新增项目字段
  @observable
  itemCourseBu: number;
  @observable
  itemCourseName: string;
  @observable
  itemCourseType: string;
  @observable
  itemDicId: any;
  @observable
  itemremark: string;
  @observable
  itemtasklabel: string[];
  @observable
  itemratio: string;
  @observable
  itemsafetyzone: string;
  @observable
  selectedlanguage: string[];

  @action LookupCourseWareAsync = async (
    keywords: string,
    domain: number,
    upload: number,
    directoryId: any,
    bu: number,
    pageIndex: number,
    createNewFolder: boolean = false,
    OpenCW: boolean = false,
  ) => {
    this.upload = upload;
    this.pageIndex = pageIndex;

    this.directoryId = directoryId;
    this.keywords = keywords;
    this.bu = bu;
    var data = await HttpService.getCourseList(
      keywords,
      pageIndex,
      domain,
      upload == -1 ? null : upload,
      directoryId ? directoryId[directoryId.length - 1] : null,
      bu,
    );
    runInAction(() => {
      if (data && data.coursewares) {
        this.coursewares = data.coursewares as Array<Courseware>;
        this.totalCounts = data.totalCounts;
      } else {
        this.coursewares = null;
        this.totalCounts = 0;
      }
      this.domain = domain;
      this.directoryCount(this.domain);

      if (createNewFolder) {
        this.createNewFolder();
      }

      if (OpenCW) {
        if (this.coursewares != null && this.coursewares.length > 0) {
          this.onclick(null, this.coursewares[0]);
        }
      }
    });
  };

  @action SearchCourseBu = async () => {
    var data = await HttpService.getCourseBu();
    runInAction(() => {
      if (data) {
        this.bulist = data;
      }
    });
  };

  @action CopyCourseWare = async coursewareId => {
    var test = CacheHelper.UserInfo;
    let test1 = CacheHelper.UserInfo;
    var data = await HttpService.copyCourseWare({
      courseWareId: coursewareId,
      userIds: [CacheHelper.UserInfo.me.userId],
    });
    runInAction(() => {
      if (data) {
        this.LookupCourseWareAsync(
          this.keywords,
          this.domain,
          this.upload,
          this.directoryId,
          this.bu,
          1,
        );
        message.success('复制成功');
      } else {
        message.error('复制失败');
      }
    });
  };

  //拆分课件
  @action SplitCourseWare = async coursewareId => {
    var data = await HttpService.splitCourseWare({
      courseWareId: coursewareId,
    });
    runInAction(() => {
      if (data) {
        this.LookupCourseWareAsync(
          this.keywords,
          this.domain,
          this.upload,
          this.directoryId,
          this.bu,
          1,
        );
        message.success('拆分成功');
      } else {
        message.error('拆分失败');
      }
    });
  };

  @action SearchCourseTypeCascade = async () => {
    var data = await HttpService.getCourseTypeCascade();
    runInAction(() => {
      if (data) {
        data.forEach(x => removeEmptyVoList(x));
        this.courseWareTypeList = data;
      }
    });
  };

  @action directoryCount = async searchDomain => {
    return;
    var data = await HttpService.directoryCount(searchDomain);
    runInAction(() => {
      if (data) {
        data.forEach(x => removeEmptyVoList(x));
        this.directoryCountList = data;
      }
    });
  };

  @action SetUpLoadCourse = async (courseId: string, remark: string) => {
    var data = await HttpService.SetUploadCourse(courseId, remark);
    if (data.code == '0') {
      data = data.data;
      runInAction(() => {
        if (data) {
          this.LookupCourseWareAsync(
            this.keywords,
            this.domain,
            this.upload,
            this.directoryId,
            this.bu,
            this.pageIndex,
          );
          this.uploadDialogClose();
          message.success('上传成功');
        }
      });
    } else {
      message.error(data?.message);
    }
  };

  @action AddCourseWare = async (course: any) => {
    var data = await HttpService.AddCourse(course);
    runInAction(() => {
      if (data) {
        this.LookupCourseWareAsync(
          this.keywords,
          this.domain,
          this.upload,
          this.directoryId,
          this.bu,
          1,
          false,
          true,
        );
        this.addUpdateDialogClose();
        message.success('创建成功');
      }
    });
  };

  @action UpdateCourseWare = async (course: any) => {
    var data = await HttpService.UpdateCourse(course);
    runInAction(() => {
      if (data) {
        this.LookupCourseWareAsync(
          this.keywords,
          this.domain,
          this.upload,
          this.directoryId,
          this.bu,
          1,
        );
        message.success('编辑成功');
        this.addUpdateDialogClose();
      }
    });
  };

  init() {
    if (!this.bulist) {
      this.SearchCourseBu();
    }
    if (!this.courseWareTypeList) this.SearchCourseTypeCascade();
    this.LookupCourseWareAsync(
      this.keywords,
      this.domain,
      this.upload,
      this.directoryId,
      this.bu,
      1,
    );
  }

  //#region  基础事件
  componentDidMount() {
    TypeMapConfig.BuildTypeMap();
    this.init();
    window.addEventListener('resize', this.handleScorllY);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleScorllY);
  }

  handleScorllY = () => {
    this.scrollY = window.innerHeight - this.scrollHeight;
  };

  modalDialogShow(width: number) {
    this.isWindowShow = true;
    this.windowWidth = width;
  }

  modalDialogClose() {
    this.windowsStyle = 0;
    this.isWindowShow = false;
  }

  //#endregion

  //#region  上传项目子界面
  uploadDialog(courseware: Courseware) {
    this.windowsStyle = 1;
    this.selectedCourse = courseware;
    this.modalDialogShow(400);
  }

  uploadDialogClose() {
    this.uploadText = '';
    this.modalDialogClose();
  }

  //#endregion

  //#region  新增修改项目

  addUpdateDialog(courseware: Courseware = null) {
    this.selectedCourse = courseware;
    this.windowsStyle = 2;
    if (courseware) {
      this.addupdateCourseTitle = '修改项目';
      this.itemCourseBu = courseware.bu;
      this.itemCourseName = courseware.coursewareName;
      this.itemCourseType = courseware.purposeVo.id;
      this.itemCourseWareTypeChanged(this.itemCourseType);
      this.itemDicId = courseware.directoryList.map(x => x.id);
      this.itemremark = courseware.description;
      this.itemtasklabel = [];
      if (courseware.strList) this.itemtasklabel = [...courseware.strList];

      let stringJson = JSON.parse(courseware.extendInfo);
      let stageWidth = stringJson.stageWidth ? stringJson.stageWidth : '1920';
      let stageHeight = stringJson.stageHeight
        ? stringJson.stageHeight
        : '1080';
      this.itemratio = stageWidth + '*' + stageHeight;
      this.itemsafetyzone = stringJson.ratio;
      this.selectedlanguage = courseware.subTitlesStr
        ? courseware.subTitlesStr.split(',')
        : undefined;
    } else this.addupdateCourseTitle = '新建项目';
    this.modalDialogShow(580);
  }

  itemCourseWareTypeChanged(courseType: string) {
    this.itemCourseType = courseType;
    let childrenCourseType = this.courseWareTypeList.find(
      p => p.id == this.itemCourseType,
    );
    //分辨率增加逻辑
    //互动绘本
    if (childrenCourseType.code == 'PICTRUE_BOOK') {
      this.resolutionList = ['1920*1080', '1280*720', '1536*768'];
    } else if (childrenCourseType.code == 'VIDEO_AI') {
      // this.resolutionList = ['1920*1080', '1280*720', '2400*1080', '1600*720'];
      this.resolutionList = ['1600*720'];
    } else if (childrenCourseType.code == 'MULTI_BRANCH') {
      this.resolutionList = ['1600*720'];
    } else if (childrenCourseType.code == 'CLASSROOM_COURSEWARE') {
      this.resolutionList = ['1280*720'];
    } else {
      this.resolutionList = ['1920*1080', '1280*720', '1600*720'];
    }

    // this.itemratio = '1920*1080';

    // // 视频AI课件只能选择1600*720
    // if (childrenCourseType.code == 'VIDEO_AI') {
    //   this.itemratio = '1600*720';
    // }

    this.itemratio = this.resolutionList[0];

    //
    if (
      childrenCourseType &&
      childrenCourseType.voList &&
      childrenCourseType.voList.length > 0
    ) {
      this.courseWareTypeChildList = childrenCourseType.voList;
    } else this.courseWareTypeChildList = null;
    this.itemDicId = null;
  }

  addUpdateSumbit() {
    var _version = 1;
    if (this.selectedCourse) {
      _version = 0;
      var json = JSON.parse(this.selectedCourse.extendInfo);
      if (json && json.version) {
        _version = json.version;
      }
    }

    //分辨率
    let resolution = this.itemratio ? this.itemratio.split('*') : [1920, 1080];
    //ExtendInfo 字段
    let jsonVal = JSON.stringify({
      ratio: this.itemsafetyzone,
      stageWidth: Number(resolution[0]),
      stageHeight: Number(resolution[1]),
      version: _version,
    });

    if (this.selectedCourse) {
      console.log('现在是编辑：' + jsonVal);
    } else {
      console.log('现在是添加：' + jsonVal);
    }

    let profileAdd = {
      coursewareName: this.itemCourseName.trim(),
      coursewareId: 'p_' + IdHelper.NewId(),
      directoryId: Number(this.itemDicId[this.itemDicId.length - 1]),
      labelNames: this.itemtasklabel,
      description: this.itemremark,
      extendInfo: jsonVal,
      self: true,
      coursewareVersion: 2,
      bu: this.itemCourseBu,
      subTitlesStr: this.selectedlanguage
        ? this.selectedlanguage.join(',')
        : null,
    };
    if (this.selectedCourse) {
      profileAdd.coursewareId = this.selectedCourse.coursewareId;
      this.UpdateCourseWare(profileAdd);
    } else this.AddCourseWare(profileAdd);
  }

  addUpdateDialogClose() {
    this.itemCourseBu = null;
    this.itemCourseName = null;
    this.itemCourseType = null;
    this.itemDicId = null;
    this.itemremark = null;
    this.itemtasklabel = [];
    this.itemratio = null;
    this.itemsafetyzone = null;
    this.selectedlanguage = undefined;
    this.modalDialogClose();
  }
  //#endregion

  onclick(event: any, record: Courseware) {
    if (window['loginToken'] && window['loginToken'].token) {
      var ws = new WebSocket('ws://localhost:' + process.env.port);
      ws.onopen = function(evt) {
        ws.send(
          JSON.stringify({
            webReqType: 0,
            Data: JSON.stringify(record),
          }),
        );
      };
      ws.onmessage = function(event) {
        ws.close();
      };
    } else {
      let url = document.URL + 'designer?cwId=' + record.coursewareId;
      window.open(url);
    }
  }

  //预览
  playCoursePreview(courseware: Courseware) {
    //练习作业(多页)
    if (
      courseware.purposeVo.code &&
      courseware.purposeVo.code == 'PRACTICE_MULTI_PAGE'
    ) {
      var mainUrl = process.env.prevUrl;
      var url = `${mainUrl}?editorPreview=1&coursewareId=${
        courseware.coursewareId
      }&checkFlag=true&userId=${
        courseware.userId
      }&rand=${Math.random()}&isEidtExercises=true`;
      var homeworkjson = {
        tkyun: CacheHelper.UserInfo.userToken,
        homeworkurl: url,
        coursewareId: courseware.coursewareId,
        userId: courseware.userId,
        bu: courseware.bu,
      };
      var homeworkurl = `${process.env.kidsHomeWorkUrl}?mode=1`;
      PlayCoursePreiew.isplayCourse = true;
      PlayCoursePreiew.playConfig = [];
      PlayCoursePreiew.playConfig.push(
        homeworkurl,
        courseware.coursewareName,
        homeworkjson,
      );
      PlayCoursePreiew.playWidth = 1540;
      PlayCoursePreiew.playHeight = 720;
    }
    //合成课件
    else if (
      courseware.purposeVo.code &&
      courseware.purposeVo.code == 'COMPOUND_COURSE_WARE'
    ) {
      var url = `./formworkcombined?editorPreview=1&coursewareId=${courseware.coursewareId}&checkFlag=true&quId=${courseware.questionId}`;
      PlayCoursePreiew.isplayCourse = true;
      PlayCoursePreiew.playConfig = [];
      PlayCoursePreiew.playConfig.push(url, courseware.coursewareName);
      PlayCoursePreiew.playWidth = 1280;
      PlayCoursePreiew.playHeight = 720;
    }
    //视频AI课件
    else if (
      courseware.purposeVo.code &&
      courseware.purposeVo.code == 'VIDEO_AI'
    ) {
      var prevVideoAIUrl = `${
        process.env.prevVideoAIUrl
      }&editorPreview=1&coursewareId=${
        courseware.coursewareId
      }&checkFlag=true&userId=${courseware.userId}&tkyun=${
        CacheHelper.UserInfo.userToken
      }&rand=${Math.random()}`;

      PlayCoursePreiew.isplayCourse = true;
      PlayCoursePreiew.playConfig = [];
      PlayCoursePreiew.playConfig.push(
        prevVideoAIUrl,
        courseware.coursewareName,
      );
      PlayCoursePreiew.playHeight = 720;
      PlayCoursePreiew.playWidth = 1600;
    }
    //多分支课件
    else if (
      courseware.purposeVo.code &&
      courseware.purposeVo.code == 'MULTI_BRANCH'
    ) {
      var prevVoiceClassUrl = `${
        process.env.prevVoiceClassUrl
      }&editorPreview=1&coursewareId=${
        courseware.coursewareId
      }&checkFlag=true&userId=${courseware.userId}&tkyun=${
        CacheHelper.UserInfo.userToken
      }&rand=${Math.random()}`;

      PlayCoursePreiew.isplayCourse = true;
      PlayCoursePreiew.playConfig = [];
      PlayCoursePreiew.playConfig.push(
        prevVoiceClassUrl,
        courseware.coursewareName,
      );
      PlayCoursePreiew.playHeight = 720;
      PlayCoursePreiew.playWidth = 1600;
    }
    //其他
    else {
      var mainUrl = process.env.prevUrl;
      var url = `${mainUrl}?editorPreview=1&coursewareId=${
        courseware.coursewareId
      }&checkFlag=true&userId=${courseware.userId}&tkyun=${
        CacheHelper.UserInfo.userToken
      }&rand=${Math.random()}`;

      PlayCoursePreiew.isplayCourse = true;
      //互动绘本
      if (
        courseware.purposeVo.code &&
        courseware.purposeVo.code == 'PICTRUE_BOOK'
      ) {
        PlayCoursePreiew.playHeight = 1280 / 2;
      } else {
        PlayCoursePreiew.playHeight = 720;
      }
      PlayCoursePreiew.playConfig = [];
      PlayCoursePreiew.playConfig.push(url, courseware.coursewareName);
      PlayCoursePreiew.playWidth = 1280;
      console.log(url);
    }
  }

  onMenuClick(key: any, courseware: Courseware) {
    this.isDoubleOpen = false;
    if (key == '0') {
      this.addUpdateDialog(courseware);
    } else if (key == '1') {
      this.isDel = false;
      this.isCopy = true;
      this.isSplit = false;
      this.cid = courseware.coursewareId;
      this.promptText = '确定复制课件吗？';
      this.showModal();
    } else if (key == '2') {
      this.cid = courseware.coursewareId;
      this.GetQRCode(this.cid);
    } else if (key == '3') {
      this.SharedOperation(courseware);
    } else if (key == '4') {
      this.isDel = true;
      this.isCopy = false;
      this.isSplit = false;
      this.cid = courseware.coursewareId;
      this.promptText = '确定删除项目？ 删除后内容不可恢复';
      this.showModal();
      //this.deleteAffirmShow();
    } else if (key == '5') {
      this.GetResourceList(courseware.coursewareId);
    } else if (key == '6') {
      //复制到
      FolderView.isWindowShow = true;
    } else if (key == '7') {
      //移动到
      FolderView.isWindowShow = true;
    } else if (key == '8') {
      //重命名
      this.cid = courseware.coursewareId;
      this.setRechristenText(courseware.coursewareName);
      this.showRechristen();
    } else if (key == '9') {
      // 复制预览链接
      //练习作业(多页)
      let URL = '';
      if (
        courseware.purposeVo.code &&
        courseware.purposeVo.code == 'PRACTICE_MULTI_PAGE'
      ) {
        URL = `${process.env.kidsHomeWorkUrl}?mode=1`;
      }
      //合成课件
      else if (
        courseware.purposeVo.code &&
        courseware.purposeVo.code == 'COMPOUND_COURSE_WARE'
      ) {
        URL = `./formworkcombined?editorPreview=1&coursewareId=${courseware.coursewareId}&checkFlag=true&quId=${courseware.questionId}`;
      }
      //视频AI课件
      else if (
        courseware.purposeVo.code &&
        courseware.purposeVo.code == 'VIDEO_AI'
      ) {
        URL = `${process.env.prevVideoAIUrl}&editorPreview=1&coursewareId=${
          courseware.coursewareId
        }&checkFlag=true&userId=${courseware.userId}&tkyun=${
          CacheHelper.UserInfo.userToken
        }&rand=${Math.random()}`;
      }
      //多分支课件
      else if (
        courseware.purposeVo.code &&
        courseware.purposeVo.code == 'MULTI_BRANCH'
      ) {
        URL = `${process.env.prevVoiceClassUrl}&editorPreview=1&coursewareId=${
          courseware.coursewareId
        }&checkFlag=true&userId=${courseware.userId}&tkyun=${
          CacheHelper.UserInfo.userToken
        }&rand=${Math.random()}`;
      }
      //其他
      else {
        var mainUrl = process.env.prevUrl;
        URL = `${mainUrl}?editorPreview=1&coursewareId=${
          courseware.coursewareId
        }&checkFlag=true&userId=${courseware.userId}&tkyun=${
          CacheHelper.UserInfo.userToken
        }&rand=${Math.random()}`;
      }
      copy(URL);
      message.success('复制成功');
    } else if (key == '10') {
      this.isDel = false;
      this.isCopy = false;
      this.isSplit = true;
      this.cid = courseware.coursewareId;
      this.promptText = '确定拆分课件吗？';
      this.showModal();
    }
  }

  // 课件id
  @observable
  private cwId: string = '';

  //课件整体数据
  @observable
  private courseData: any;

  //课件页面集合
  @observable
  private pages: any;

  @observable
  private showSet: boolean = false;

  @action GetResourceList = async (cwId: string) => {
    this.cwId = cwId;
    this.showSet = true;
    var data = await HttpService.getCouresWareDetail(cwId);
    this.courseData = data;
    var pages = deserializeArray(CWPage, data.coursewareContent || '[{}]', {
      typeMaps: TypeMapHelper.CommonTypeMap,
    });
    this.pages = pages;
    let invokeablesCount = 0;
    pages?.forEach(x => {
      invokeablesCount += x.TotalInvItems.length;
    });
    this.statisticEntity = new StatisticEntity();
    this.statisticEntity.statisticresources = data.gameResourceList;
    this.statisticEntity.invokeablesCount = invokeablesCount;
    this.statisticEntity.visible = true;
  };

  // 刷新
  @action GetRefresh = async () => {
    var data = await HttpService.getCouresWareDetail(this.cwId);
    this.courseData = data;
    var pages = deserializeArray(CWPage, data.coursewareContent || '[{}]', {
      typeMaps: TypeMapHelper.CommonTypeMap,
    });
    this.pages = pages;
    let invokeablesCount = 0;
    pages?.forEach(x => {
      invokeablesCount += x.TotalInvItems.length;
    });
    this.statisticEntity = new StatisticEntity();
    this.statisticEntity.statisticresources = data.gameResourceList;
    this.statisticEntity.invokeablesCount = invokeablesCount;
    this.statisticEntity.visible = true;
  };

  //页面类对象转换为json对象
  @action GetPagesPlain(
    resLib: CWResource[],
    fontLib: string[],
    pages?: CWPage[],
  ) {
    if (!pages) pages = this.pages;
    var pagesPlain = classToPlain(pages, {
      strategy: 'excludeAll',
      typeMaps: TypeMapHelper.CommonTypeMap,
    });
    var p_index = 0;
    pages.forEach(x => {
      if (resLib) {
        var depReses = x.GetDependencyResources();
        if (depReses) resLib.push(...depReses);
      }
      if (fontLib) {
        var depFonts = x.GetDependencyFonts();
        if (depFonts) fontLib.push(...depFonts);
      }
      var map = new Map<string, number>();
      var i = 0;
      x.TotalEditItemList.forEach(eitem => map.set(eitem.Id, i++));
      x.TotalInvItems.forEach(invitem => map.set(invitem.Id, i++));
      pagesPlain[p_index++].IdMap = classToPlain(map);
    });
    return pagesPlain;
  }

  // 提交修改
  @action SumitData = async () => {
    if (!window.navigator.onLine) {
      message.error('网络异常，请检查网络');
      return;
    }
    const ids = [];
    this.courseData.gameResourceList.map(item => {
      ids.push(item.resourceId);
    });
    let fontLib: string[] = [];
    let resLib: CWResource[] = [];
    let pages = this.GetPagesPlain(resLib, fontLib);
    const updateObj = {
      coursewareId: this.cwId,
      coursewareName: this.courseData.coursewareName,
      coursewareContent: serialize(pages),
      coursewareNum: this.pages.length,
      resourceIds: ids,
      purposeVo: this.courseData.purposeVo,
      extendInfo: serialize(this.courseData.extendInfo),
      coursewareVersion: this.courseData.coursewareVersion,
      pageInfoList: (pages as CWPage[]).map(p => {
        return { pageUuid: p.Id, pageIndex: p.PageIndex };
      }),
      labelNames: this.courseData.labelNames,
      subTitlesStr: this.courseData.subTitlesStr,
    };

    var saveResult = await HttpService.updateCourseWareDetail(updateObj);
    runInAction(() => {
      if (saveResult) {
        message.success('修改成功');
      } else message.error('修改失败');
    });
  };

  courseMenu(courseware: Courseware) {
    return (
      <Menu onClick={event => this.onMenuClick(event.key, courseware)}>
        <Menu.Item key="0" disabled={!courseware.self}>
          编辑属性
        </Menu.Item>
        <Menu.Item key="2">二维码</Menu.Item>
        <Menu.Item key="5">课件资源分析</Menu.Item>
        <Menu.Item key="1">复制课件</Menu.Item>
        {/* <Menu.Item key="6">复制到...</Menu.Item>
        <Menu.Item key="7">移动到...</Menu.Item> */}
        <Menu.Item key="10" disabled={!courseware.self}>
          拆分课件
        </Menu.Item>
        <Menu.Item key="3" disabled={!courseware.self}>
          {courseware.shared ? '取消共享' : '共享'}
        </Menu.Item>
        <Menu.Item key="8" disabled={!courseware.self}>
          重命名
        </Menu.Item>
        <Menu.Item key="4" disabled={!courseware.self}>
          删除
        </Menu.Item>
        <Menu.Item key="9">复制预览链接</Menu.Item>
      </Menu>
    );
  }

  //#region 首页改版新增逻辑

  //#region 属性

  // t = 列表 f = 宫格
  @observable
  listState: boolean = false;

  //选择的id
  //   @observable
  //   selectMenuId :number = -1;

  //移动选择的id
  @observable
  selectMoveMenuId: number = null;

  @observable
  resolutionList: Array<string> = ['1920*1080', '1280*720', '1600*720'];

  //#endregion

  //#region 方法

  switchList() {
    this.listState = !this.listState;
  }

  getIconUrl(code) {
    if (code == 'CLASSROOM_COURSEWARE') {
      return require('@/assets/mainlist/icon_classroom.png');
    } else if (code == 'PRACTICE') {
      return require('@/assets/mainlist/icon_task.png');
    } else if (code == 'PRACTICE_MULTI_PAGE') {
      return require('@/assets/mainlist/icon_task_more.png');
    } else if (code == 'TEMPLATE') {
      return require('@/assets/mainlist/icon_courseware.png');
    }
    return require('@/assets/mainlist/icon_moren.png');
  }

  //#endregion

  //#endregion

  //#region 文件夹相关逻辑

  //#region 属性
  @observable
  loseFocusCreateFolder: boolean = true;
  //#endregion

  //#region 方法
  createFolder(createNewFolder: boolean = false) {
    for (let index = 0; index < this.coursewares?.length; index++) {
      var element = this.coursewares[index];
      if (element.coursewareId == 'newFolderGUID') {
        this.fileDirAdd(element.coursewareName, 0, createNewFolder);
        //element.coursewareId=null;
        return; //正常情况应该只循环1次
      }
    }
    if (createNewFolder) this.createNewFolder();
  }
  createNewFolder() {
    var courseware = new Courseware();
    courseware.coursewareId = 'newFolderGUID';
    courseware.coursewareName = '新建文件夹';
    courseware.compiler = CacheHelper.UserInfo?.me.personName;
    courseware.updateTime = Date.parse(new Date().toString());
    courseware.self = true;
    // this.coursewares.splice(0,0,courseware);
    if (this.coursewares == null) this.coursewares = new Array<Courseware>();
    let data = [...this.coursewares];
    data.splice(0, 0, courseware);
    this.coursewares = data;
  }

  //#endregion

  //#region 请求

  @action fileDirAdd = async (
    //directoryId: number, //文件夹所属目录
    name: string, //文件夹名
    parentId: number = 0, //文件夹的上级目录,不传默认为0（最顶层）
    createNewFolder: boolean = false,
  ) => {
    if (name == null || name.trim() == '') {
      message.info('文件夹名称不能是空');
      return;
    }
    var dId = this.directoryId
      ? this.directoryId[this.directoryId.length - 1]
      : null;
    if (dId == null) {
      message.info('文件夹必须建在目录下');
      return;
    }
    var data = await HttpService.fileDirAdd(dId, name, parentId);
    runInAction(() => {
      if (data) {
        this.LookupCourseWareAsync(
          this.keywords,
          this.domain,
          this.upload,
          this.directoryId,
          this.bu,
          1,
          createNewFolder,
        );

        message.success('创建成功');
      }
    });
  };

  //#endregion

  //#endregion

  render() {
    //#region 课件列表的columns

    const columns = [
      {
        title: '项目',
        dataIndex: 'coursewareName',
        key: 'coursewareName',
        width: '44%',
        render: (text, record: Courseware) => (
          <div
            style={{
              width: '100%',
              height: '100%',
              color: '#666666',
              // display: '-webkit-box',
              // WebkitBoxOrient: 'horizontal',
              // WebkitBoxPack: 'start',
              // whiteSpace: 'nowrap',
            }}
          >
            <div
              style={{
                top: '0px',
                bottom: '0px',
                left: '0px',
                width: '100px',
                position: 'absolute',
                //float:'left',
              }}
            >
              {record.coursewareId != 'newFolderGUID' ? (
                record.cover ? (
                  <img
                    src={record.cover}
                    style={{
                      margin: '10px',
                      height: '60px',
                      width: '107px',
                      objectFit: 'cover',
                      background: '#F8F8F8',
                      borderRadius: '10px',
                    }}
                  ></img>
                ) : (
                  <img
                    src={require('@/assets/mainlist/courseDefault.png')}
                    style={{
                      margin: '10px',
                      height: '60px',
                      width: '107px',
                      objectFit: 'contain',
                      background: '#F8F8F8',
                      borderRadius: '10px',
                    }}
                  ></img>
                )
              ) : (
                <img
                  src={require('@/assets/mainlist/icon_folder.png')}
                  style={{
                    height: '60px',
                    width: '60px',
                    objectFit: 'cover',
                    //background: '#F8F8F8',
                    borderRadius: '10px',
                    marginLeft: '29px',
                    marginTop: '10px',
                  }}
                ></img>
              )}
            </div>

            <div
              style={{
                left: '130px',
                top: '0px',
                right: '46px',
                bottom: '0px',
                position: 'absolute',
                //background: '#fe33',
              }}
            >
              <div className={antStyle.spanHover}>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    whiteSpace: 'nowrap',
                    marginTop: '19px',
                  }}
                >
                  <Tooltip
                    style={{ width: '100%', marginTop: '50px' }}
                    placement="topLeft"
                    title={text}
                  >
                    <Popover
                      //className={antStyle.antPopover}
                      overlayClassName={antStyle.antPopover}
                      placement="right"
                      trigger="click"
                      visible={
                        record.coursewareId == this.cid
                          ? this.state.rechristenVisible
                          : false
                      }
                      content={
                        <div
                          style={{
                            width: '277.5px',
                            height: '116px',
                            //background:'#00eeff71'
                          }}
                          onMouseDown={e => {
                            //e.preventDefault();
                            e.stopPropagation();
                          }}
                        >
                          <div
                            style={{
                              color: '#333333FF',
                              fontSize: '14px',
                              width: '100%',
                              display: '-webkit-box',
                              WebkitBoxAlign: 'center',
                              WebkitBoxPack: 'center',
                              height: '20px',
                              fontWeight: 'bold',
                              marginTop: '4px',
                            }}
                          >
                            <span>重命名</span>
                          </div>

                          <div
                            style={{
                              color: '#333333FF',
                              fontSize: '14px',
                              width: '100%',
                              display: '-webkit-box',
                              //WebkitBoxAlign:'center',
                              WebkitBoxPack: 'center',
                              //height:'28px',
                              fontWeight: 'bold',
                              marginTop: '15px',
                            }}
                          >
                            <Input
                              value={this.state.RechristenText.toString()}
                              onChange={value => {
                                this.setRechristenText(value.target.value);
                              }}
                              style={{ width: '260px', borderRadius: '5px' }}
                            ></Input>
                          </div>

                          <div
                            style={{
                              marginTop: '15px',
                              width: '100%',
                              display: '-webkit-box',
                              //WebkitBoxAlign:'center',
                              WebkitBoxPack: 'center',
                            }}
                          >
                            <Button
                              style={{
                                width: '90px',
                                height: '32',
                                borderRadius: '3px',
                              }}
                              onClick={event => this.hideRechristen()}
                            >
                              取消
                            </Button>

                            <Button
                              disabled={
                                this.state.RechristenText.toString().trim() ==
                                ''
                              }
                              type="primary"
                              style={{
                                width: '90px',
                                height: '32',
                                marginLeft: '16px',
                                borderRadius: '3px',
                              }}
                              onClick={event => this.updateName()}
                            >
                              确定
                            </Button>
                          </div>
                        </div>
                      }
                    >
                      <div
                        style={{
                          textOverflow: 'ellipsis',
                          //width: '300px',
                          overflow: 'hidden',
                          width: '100%',
                          marginTop:
                            record.coursewareId != 'newFolderGUID' ? 0 : 5,
                        }}
                      >
                        {record.shared && this.domain == 0 ? (
                          <img
                            style={{
                              marginRight: '3px',
                              width: '16px',
                              height: '16px',
                              marginBottom: '3px',
                            }}
                            alt="example"
                            src={require('@/assets/mainlist/icon_share.png')}
                          />
                        ) : null}
                        {record.self && this.domain == 1 ? (
                          <img
                            style={{
                              marginRight: '3px',
                              width: '16px',
                              height: '16px',
                              marginBottom: '3px',
                            }}
                            alt="example"
                            src={require('@/assets/mainlist/icon_me.png')}
                          />
                        ) : null}
                        {record.coursewareId != 'newFolderGUID' ? (
                          <span>{text}</span>
                        ) : (
                          <Input
                            onBlur={e => {
                              if (this.loseFocusCreateFolder)
                                this.createFolder();
                              console.log('失去焦点');
                            }}
                            onKeyUp={e => {
                              if (e.key == 'Enter') {
                                this.createFolder();
                              }
                            }}
                            autoFocus={true}
                            size="middle"
                            value={record.coursewareName}
                            onChange={value => {
                              record.coursewareName = value.target.value;
                              let data = [...this.coursewares];
                              this.coursewares = data;
                            }}
                            style={{
                              width: '100%',
                              borderRadius: '5px',
                            }}
                          ></Input>
                        )}
                      </div>
                    </Popover>
                  </Tooltip>
                </div>

                {record.coursewareId != 'newFolderGUID' ? (
                  <label
                    style={{
                      width: '100%',
                      marginTop: '20px',
                      color: '#999999',
                    }}
                  >
                    修改时间：{TimerHelper.stringToDate(record.updateTime)}
                  </label>
                ) : null}
              </div>
            </div>
          </div>
        ),
      },
      {
        title: '编辑者',
        dataIndex: 'compiler',
        key: 'compiler',
        width: '18%',
      },
      {
        title: '状态',
        dataIndex: 'upload',
        key: 'upload',
        width: '18%',
        render: (text, record: Courseware) => (
          <div>
            {record.coursewareId ? (
              record.upload == 1 ? (
                <div style={{ display: 'flex' }}>
                  <span>已上传</span>
                </div>
              ) : (
                <div style={{ display: 'flex' }}>
                  <div
                    style={{
                      borderRadius: '50%',
                      background: 'red',
                      width: 5,
                      height: 5,
                      marginTop: 9,
                      marginRight: 5,
                    }}
                  />
                  <span>未上传</span>
                  {record?.upload == 0 && record.self ? (
                    <div
                      style={{ cursor: 'pointer', marginTop: 3, marginLeft: 2 }}
                      onClick={event => this.uploadDialog(record)}
                    >
                      <NewUploadingIcon svgColor={['#1D91FC']} />
                    </div>
                  ) : null}
                </div>
              )
            ) : (
              '-'
            )}
          </div>
        ),
      },
      {
        width: '18%',
        title: '修改时间',
        dataIndex: 'updateTime',
        key: 'updateTime',
        render: (text, record: Courseware) => (
          // <label>{TimerHelper.stringToDate(record.updateTime)}</label>
          <div
            className="editbtns"
            style={{
              display: '-webkit-box',
              //opacity: '0',
              WebkitBoxAlign: 'center',
              WebkitBoxPack: 'center',
            }}
          >
            {record.coursewareId ? (
              <div
                style={{
                  width: '170px',
                  display: '-webkit-box',
                  WebkitBoxAlign: 'center',
                  WebkitBoxPack: 'end',
                }}
              >
                {record?.upload == 0 && record.self ? (
                  <label
                    style={{
                      marginLeft: 20,
                      cursor: 'pointer',
                      color: '#1D91FC',
                    }}
                    onClick={event => this.uploadDialog(record)}
                  >
                    上传
                  </label>
                ) : null}
                <label
                  style={{
                    marginLeft: 20,
                    cursor: 'pointer',
                    color: '#1D91FC',
                  }}
                  onClick={event => this.playCoursePreview(record)}
                >
                  预览
                </label>

                <Popover
                  placement="bottom"
                  trigger="click"
                  visible={
                    record.coursewareId == this.cid ? this.state.visible : false
                  }
                  content={
                    <QRCode
                      value={this.QRCodeText} //value参数为生成二维码的链接
                      size={200} //二维码的宽高尺寸
                      fgColor="#000000" //二维码的颜色
                    />
                  }
                >
                  <label
                    style={{
                      marginLeft: 20,
                      cursor: 'pointer',
                      color: '#1D91FC',
                    }}
                    onClick={event => this.onclick(event, record)}
                  >
                    打开
                  </label>
                </Popover>
                {/* {record.coursewareId == this.cid?'显':''}
              {this.state.visibleModal?'vvvvv':''} */}
                <Popconfirm
                  //getPopupContainer={triggerNode => triggerNode.parentElement}
                  cancelText="取消"
                  okText="继续"
                  placement="left"
                  title={this.promptText}
                  visible={
                    record.coursewareId == this.cid
                      ? this.state.visibleModal
                      : false
                  }
                  onConfirm={this.handleOk}
                  onCancel={this.handleCancel}
                >
                  <div
                    style={{
                      marginLeft: 10,
                      marginRight: 15,
                      marginTop: 3,
                      cursor: 'pointer',
                    }}
                  >
                    <Dropdown
                      getPopupContainer={triggerNode =>
                        triggerNode.parentElement
                      }
                      overlayClassName={antStyle.antMenuHover}
                      overlay={this.courseMenu(record)}
                      trigger={['click']}
                    >
                      <div onClick={e => e.preventDefault()}>
                        <NewMoreIcon svgColor={['#1D91FC']} />
                      </div>
                    </Dropdown>
                  </div>
                </Popconfirm>
              </div>
            ) : null}
          </div>
        ),
      },
    ];

    //#endregion
    let widthUi = '350px';
    return (
      <div className={antStyle.antCommon}>
        {/* 弹出框 */}
        {/* <Modal
          centered
          title="确认操作"
          visible={this.state.visibleModal}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          cancelText="取消"
          okText="确认"
        >
          <p>{this.promptText}</p>
        </Modal> */}

        {/* 文件夹 */}
        <FolderView></FolderView>
        {/* 上传/创建/编辑 */}
        <Modal
          className={antStyle.antCreateView}
          style={{ padding: '0px' }}
          //width={`${this.windowWidth}px`}
          width={490}
          closable={false}
          title={null}
          centered
          visible={this.isWindowShow}
          maskClosable={false}
          footer={false}
        >
          <div style={{ padding: '-24px' }}>
            {this.windowsStyle == 1 ? (
              <div>
                <div
                  style={{
                    marginBottom: 20,
                    fontSize: 16,
                    background: '#F6F9FBFF',
                    height: '40px',
                    display: '-webkit-box',
                    WebkitBoxAlign: 'center',
                    WebkitBoxPack: 'center',
                    borderRadius: '5px 5px 0px 0px',
                  }}
                >
                  <div style={{ textAlign: 'center' }}>
                    <label
                      style={{
                        textAlign: 'center',
                        marginTop: '14px',
                        color: '#333333FF',
                        fontSize: '14px',
                      }}
                    >
                      上传项目
                    </label>
                  </div>
                  <div
                    style={{
                      position: 'absolute',
                      width: 20,
                      height: 20,
                      right: 5,
                      top: 5,
                      cursor: 'pointer',
                    }}
                    onClick={event => this.uploadDialogClose()}
                  >
                    <CloseIcon />
                  </div>
                </div>
                <div
                  style={{ height: 150, width: '460px', marginLeft: '15px' }}
                >
                  <TextArea
                    value={this.uploadText}
                    onChange={event => (this.uploadText = event.target.value)}
                    placeholder="请备注上传项目的修改内容，必填，最大100个字"
                    maxLength={100}
                    autoSize={{ minRows: 4, maxRows: 4 }}
                  />
                  <Button
                    type="primary"
                    style={{ float: 'right', marginTop: '12px' }}
                    onClick={event =>
                      this.SetUpLoadCourse(
                        this.selectedCourse?.coursewareId,
                        this.uploadText,
                      )
                    }
                  >
                    确定上传
                  </Button>
                </div>
              </div>
            ) : null}
            {this.windowsStyle == 2 ? (
              <div>
                <div
                  style={{
                    marginBottom: 20,
                    fontSize: 16,
                    background: '#F6F9FBFF',
                    height: '40px',
                    display: '-webkit-box',
                    WebkitBoxAlign: 'center',
                    WebkitBoxPack: 'center',
                    borderRadius: '5px 5px 0px 0px',
                  }}
                >
                  <div style={{ textAlign: 'center' }}>
                    <label
                      style={{
                        textAlign: 'center',
                        marginTop: '14px',
                        color: '#333333FF',
                        fontSize: '14px',
                      }}
                    >
                      {' '}
                      {this.addupdateCourseTitle}
                    </label>
                  </div>
                  <div
                    style={{
                      position: 'absolute',
                      width: 20,
                      height: 20,
                      right: 5,
                      top: 5,
                      cursor: 'pointer',
                    }}
                    onClick={event => this.addUpdateDialogClose()}
                  >
                    <CloseIcon />
                  </div>
                </div>

                <div style={{ height: 550, marginLeft: '24px' }}>
                  <div style={{ display: 'flex' }}>
                    <div style={{ width: '65px', lineHeight: '30px' }}>
                      <span style={{ color: 'red' }}>*</span>项目BU
                    </div>
                    <Select
                      style={{ width: widthUi, marginLeft: '20px' }}
                      placeholder="请选择"
                      value={this.itemCourseBu}
                      onChange={value => (this.itemCourseBu = value)}
                    >
                      {this.bulist?.map(buitem => {
                        return (
                          <Option value={buitem.bu} key={buitem.bu}>
                            {buitem.buName}
                          </Option>
                        );
                      })}
                    </Select>
                  </div>
                  <div style={{ display: 'flex', marginTop: 10 }}>
                    <div style={{ width: '65px', lineHeight: '30px' }}>
                      <span style={{ color: 'red' }}>*</span>项目名称
                    </div>
                    <Input
                      style={{ width: widthUi, marginLeft: '20px' }}
                      value={this.itemCourseName || ''}
                      onChange={event =>
                        (this.itemCourseName = event.target.value)
                      }
                      placeholder="请选择项目名"
                    />
                  </div>
                  <div style={{ display: 'flex', marginTop: 10 }}>
                    <div style={{ width: '65px', lineHeight: '30px' }}>
                      <span style={{ color: 'red' }}>*</span>项目类型
                    </div>
                    <Select
                      style={{ width: widthUi, marginLeft: '20px' }}
                      placeholder="选择项目类型位置"
                      value={this.itemCourseType}
                      onChange={value => this.itemCourseWareTypeChanged(value)}
                    >
                      {this.courseWareTypeList?.map(buitem => {
                        return (
                          <Option value={buitem.id} key={buitem.id}>
                            {buitem.title}
                          </Option>
                        );
                      })}
                    </Select>
                  </div>
                  <div style={{ display: 'flex', marginTop: 10 }}>
                    <div style={{ width: '65px', lineHeight: '30px' }}>
                      <span style={{ color: 'red' }}>*</span>存储位置
                    </div>
                    <Cascader
                      placeholder="选择存储位置"
                      allowClear={false}
                      changeOnSelect={false}
                      expandTrigger="hover"
                      options={this.courseWareTypeChildList}
                      value={
                        this.courseWareTypeChildList ? this.itemDicId : null
                      }
                      onChange={(value, selectedOptions) => {
                        this.itemDicId = value;
                      }}
                      fieldNames={{
                        label: 'title',
                        value: 'id',
                        children: 'voList',
                      }}
                      style={{
                        background: 'transparent',
                        width: widthUi,
                        marginLeft: '20px',
                        borderRadius: '5px',
                      }}
                    />
                  </div>
                  <div style={{ display: 'flex', marginTop: 10 }}>
                    <div style={{ width: '65px', lineHeight: '30px' }}>
                      <span style={{ color: 'red' }}>*</span>项目描述
                    </div>
                    <TextArea
                      style={{
                        width: widthUi,
                        height: '120px',
                        marginLeft: '20px',
                      }}
                      value={this.itemremark || ''}
                      onChange={event => (this.itemremark = event.target.value)}
                      placeholder="输入项目描述"
                    />
                  </div>
                  <div style={{ display: 'flex', marginTop: 10 }}>
                    <div style={{ width: '65px', lineHeight: '30px' }}>
                      <span style={{ color: 'red' }}>*</span>分辨率
                    </div>
                    <Select
                      style={{ width: widthUi, marginLeft: '20px' }}
                      placeholder="分辨率选择"
                      value={this.itemratio}
                      onChange={value => (this.itemratio = value)}
                    >
                      {this.resolutionList?.map(item => {
                        return (
                          <Option value={item} key={item}>
                            {item}
                          </Option>
                        );
                      })}
                      {/* <Option value="1920*1080">1920*1080</Option>
                      <Option value="1280*720">1280*720</Option>
                      <Option value="1536*768">1536*768</Option>
                      <Option value="1536*768">2400*1080</Option> */}
                    </Select>
                  </div>
                  <div style={{ display: 'flex', marginTop: 10 }}>
                    <div style={{ width: '65px', lineHeight: '30px' }}>
                      <span style={{ color: 'red' }}>*</span>安全区域
                    </div>
                    <Select
                      style={{ width: widthUi, marginLeft: '20px' }}
                      placeholder="安全区域选择"
                      value={this.itemsafetyzone}
                      onChange={value => (this.itemsafetyzone = value)}
                    >
                      <Option key={0} value="16:9">
                        16:9
                      </Option>
                      <Option key={1} value="4:3">
                        4:3
                      </Option>
                      <Option key={2} value="ZMAI_ZUOYE">
                        小狸课后练习
                      </Option>
                      <Option key={3} value="ZMKID_YX">
                        少儿预习
                      </Option>
                      <Option key={4} value="21:9">
                        21:9
                      </Option>
                    </Select>
                  </div>
                  <div style={{ display: 'flex', marginTop: 10 }}>
                    <div style={{ width: '65px', lineHeight: '30px' }}>
                      <span style={{ color: 'white' }}>*</span>字幕选择
                    </div>
                    <Select
                      mode="multiple"
                      allowClear
                      style={{ width: widthUi, marginLeft: '20px' }}
                      placeholder="请选择字幕类型"
                      value={this.selectedlanguage}
                      onChange={value => (this.selectedlanguage = value)}
                    >
                      {CacheHelper.LanguageCodeList?.map((v, i) => {
                        return (
                          <Option value={v.configKey} key={v.configKey}>
                            {v.configValue}
                          </Option>
                        );
                      })}
                    </Select>
                  </div>
                  <div style={{ display: 'flex', marginTop: 15 }}>
                    <div style={{ width: '65px' }}>
                      <span style={{ color: 'white' }}>*</span>项目标签
                    </div>
                    <div
                      style={{
                        height: '50px',
                        marginLeft: '20px',
                        width: widthUi,
                        overflow: 'auto',
                      }}
                    >
                      <EditableTagGroup
                        labels={this.itemtasklabel}
                        onChange={value => (this.itemtasklabel = value)}
                      />
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      textAlign: 'center',
                      marginTop: '20px',
                    }}
                  >
                    <Button
                      style={{
                        width: '90px',
                        height: '32',
                        marginLeft: '140px',
                      }}
                      onClick={event => this.addUpdateDialogClose()}
                    >
                      取消
                    </Button>

                    <Button
                      disabled={
                        this.itemDicId &&
                        this.itemratio &&
                        this.itemsafetyzone &&
                        this.itemremark &&
                        this.itemCourseName &&
                        this.itemCourseBu &&
                        this.itemCourseName.trim() != ''
                          ? false
                          : true
                      }
                      type="primary"
                      style={{
                        width: '90px',
                        height: '32',
                        marginLeft: '16px',
                      }}
                      onClick={event => this.addUpdateSumbit()}
                    >
                      确定
                    </Button>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </Modal>

        {/* 头部分 */}
        <div
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'row-reverse',
            whiteSpace: 'nowrap',
            background: '#FFFFFF',
            height: '56px',
          }}
        >
          <Search
            className={antStyle.antSearch}
            placeholder="输入课件名称"
            style={{
              width: '300px',
              marginTop: '12px',
              marginRight: '138px',
            }}
            onSearch={value =>
              this.LookupCourseWareAsync(
                value,
                this.domain,
                this.upload,
                this.directoryId,
                this.bu,
                1,
              )
            }
            //enterButton
            allowClear
          />
        </div>
        {/* 中部内容*/}
        <div
          style={{
            width: '100%',
            //height:'600px',
            display: 'flex',
            //lineHeight:'260px',
            //flexDirection:'row',
            background: '#F6F9FB',
          }}
        >
          {/* 左边布局 */}
          <div
            style={{
              flex: '0 0 260px',
              //height: '260px',
              //background:'#a3e7de'
            }}
          >
            <div
              style={{
                display: '-webkit-box',
                WebkitBoxPack: 'center',
                WebkitBoxAlign: 'center',
                width: '100%',
              }}
            >
              <div
                style={{
                  width: '226px',
                  height: '95%',
                  marginTop: '20px',
                  //background:'#e2e9cb',
                }}
              >
                <div
                  style={{
                    width: '100%',
                    height: '30px',
                  }}
                >
                  <Radio.Group
                    size="middle"
                    buttonStyle="solid"
                    value={this.domain}
                    onChange={event =>
                      this.LookupCourseWareAsync(
                        this.keywords,
                        event.target.value,
                        this.upload,
                        this.directoryId,
                        this.bu,
                        1,
                      )
                    }
                  >
                    <Radio.Button
                      style={{
                        width: '113px',
                        textAlign: 'center',
                        borderRadius: '5px 0px 0px 5px',
                      }}
                      value={0}
                    >
                      我的项目
                    </Radio.Button>
                    <Radio.Button
                      style={{
                        width: '113px',
                        textAlign: 'center',
                        borderRadius: '0px 5px 5px 0px',
                      }}
                      value={1}
                    >
                      云项目
                    </Radio.Button>
                  </Radio.Group>
                </div>

                <div
                  style={{
                    width: '100%',
                    //background:'#3e72d38a',
                    //height: '100px',
                    marginTop: '15px',
                  }}
                >
                  <div
                    style={{
                      cursor: 'pointer',
                      background:
                        this.directoryId == null
                          ? '#E4EAF2'
                          : this.directoryId?.length > 0
                          ? this.directoryId[0] == null
                            ? '#E4EAF2'
                            : this.selectMoveMenuId != null &&
                              this.selectMoveMenuId == -1
                            ? '#e4eaf25d'
                            : null
                          : this.selectMoveMenuId != null &&
                            this.selectMoveMenuId == -1
                          ? '#e4eaf25d'
                          : null,
                      height: '40px',
                      borderRadius: '7px',
                      display: '-webkit-box',
                      WebkitBoxAlign: 'center',
                      WebkitBoxPack: 'center',
                    }}
                    onClick={() =>
                      this.LookupCourseWareAsync(
                        this.keywords,
                        this.domain,
                        this.upload,
                        null,
                        this.bu,
                        1,
                      )
                    }
                    onMouseEnter={() => (this.selectMoveMenuId = -1)}
                    onMouseLeave={() => (this.selectMoveMenuId = null)}
                  >
                    <div
                      style={{
                        height: '20px',
                        width: '85%',
                        display: 'flex',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      <img
                        style={{ width: '20px', height: '20px' }}
                        src={require('@/assets/mainlist/icon_lately.png')}
                      ></img>
                      <div
                        style={{
                          width: '129px',
                          textOverflow: 'ellipsis',
                          overflow: 'hidden',
                          whiteSpace: 'nowrap',
                          marginLeft: '10px',
                          //background:'#7eeb9562'
                        }}
                      >
                        <Tooltip
                          mouseEnterDelay={1}
                          placement="topLeft"
                          title={'最近'}
                        >
                          <span>{'最近'}</span>
                        </Tooltip>
                      </div>
                      <div
                        style={{
                          width: '33px',
                          textOverflow: 'ellipsis',
                          overflow: 'hidden',
                          whiteSpace: 'nowrap',
                          marginLeft: '5px',
                          color: '#B4B6BCFF',
                          textAlign: 'center',
                        }}
                      >
                        {/* <Tooltip
                          mouseEnterDelay={1}
                          placement="topLeft"
                          title={this.coursewaresSum}
                        >
                          <span>{this.coursewaresSum}</span>
                        </Tooltip> */}
                      </div>
                    </div>
                  </div>
                  {/* {this.directoryCountList?.map((x, i) => { */}
                  {this.courseWareTypeList?.map((x, i) => {
                    var iconurl = this.getIconUrl(x.code);
                    return (
                      <div
                        key={i}
                        style={{
                          marginTop: '2px',
                          cursor: 'pointer',
                          background:
                            this.directoryId == x.id
                              ? '#E4EAF2'
                              : this.directoryId?.length > 0
                              ? this.directoryId[0] == x.id
                                ? '#E4EAF2'
                                : this.selectMoveMenuId != null &&
                                  this.selectMoveMenuId == x.id
                                ? '#e4eaf25d'
                                : null
                              : this.selectMoveMenuId != null &&
                                this.selectMoveMenuId == x.id
                              ? '#e4eaf25d'
                              : null,
                          height: '40px',
                          borderRadius: '7px',
                          display: '-webkit-box',
                          WebkitBoxAlign: 'center',
                          WebkitBoxPack: 'center',
                        }}
                        onClick={() => {
                          console.log('---------' + x.id);
                          var _id = x.id;
                          this.LookupCourseWareAsync(
                            this.keywords,
                            this.domain,
                            this.upload,
                            [_id],
                            this.bu,
                            1,
                          );
                        }}
                        onMouseEnter={() => (this.selectMoveMenuId = x.id)}
                        onMouseLeave={() => (this.selectMoveMenuId = null)}
                      >
                        <div
                          style={{
                            height: '20px',
                            width: '85%',
                            display: 'flex',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          <img
                            src={iconurl}
                            style={{ width: '20px', height: '20px' }}
                          ></img>

                          <div
                            style={{
                              width: '160px',
                              textOverflow: 'ellipsis',
                              overflow: 'hidden',
                              whiteSpace: 'nowrap',
                              marginLeft: '10px',
                              //background:'#7eeb9562'
                            }}
                          >
                            <Tooltip
                              mouseEnterDelay={1}
                              placement="topLeft"
                              title={x.title}
                            >
                              <span>{x.title}</span>
                            </Tooltip>
                          </div>
                          {/* <div
                            style={{
                              width: '33px',
                              textOverflow: 'ellipsis',
                              overflow: 'hidden',
                              whiteSpace: 'nowrap',
                              marginLeft: '5px',
                              color: '#B4B6BCFF',
                              textAlign: 'center',
                            }}
                          >
                            <Tooltip
                              mouseEnterDelay={1}
                              placement="topLeft"
                              title={x.useCount}
                            >
                              <span>{x.useCount}</span>
                            </Tooltip>
                          </div> */}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* 右边布局  */}
          <div
            style={{
              width: '100%',
              //background:'#323fe2'
            }}
          >
            <div
              style={{
                display: '-webkit-box',
                WebkitBoxPack: 'center',
                //WebkitBoxAlign: 'center',
                width: '100%',
                height: '95%',
                borderLeft: 'solid 1px #EEEEEE',
              }}
            >
              <div
                style={{
                  width: '96.5%',
                  marginTop: '20px',
                  //height:'95%',
                  //background:'#e2e9cb',
                }}
              >
                {/* 创建项目 */}
                <div
                  style={{
                    width: '100%',
                    height: '32px',
                    display: 'flex',
                    flexDirection: 'row',
                  }}
                >
                  <div
                    style={{
                      width: '50%',
                      display: 'flex',
                      flexDirection: 'row',
                    }}
                  >
                    <Button
                      type="primary"
                      style={{ borderRadius: '5px', width: '118px' }}
                      onClick={event => this.addUpdateDialog()}
                      icon={
                        <img
                          style={{
                            marginBottom: '4px',
                            height: '14px',
                            width: '14px',
                            marginRight: '6px',
                          }}
                          src={require('@/assets/mainlist/icon_create_project.png')}
                        ></img>
                      }
                    >
                      创建项目
                    </Button>

                    {/* <Button
                      disabled={!this.showDirectory || this.domain != 0}
                      onMouseEnter={() => {
                        this.loseFocusCreateFolder = false;
                      }}
                      onMouseLeave={() => {
                        this.loseFocusCreateFolder = true;
                      }}
                      //type="primary"
                      style={{
                        marginLeft: '15px',
                        borderRadius: '5px',
                        width: '118px',
                      }}
                      icon={
                        <img
                          style={{
                            marginBottom: '4px',
                            height: '14px',
                            width: '14px',
                            marginRight: '6px',
                          }}
                          src={require('@/assets/mainlist/icon_create_template.png')}
                        ></img>
                      }
                      onClick={event => this.createFolder(true)}
                    >
                      创建文件夹
                    </Button> */}
                  </div>

                  <div
                    style={{
                      width: '50%',
                      display: 'flex',
                      flexDirection: 'row-reverse',
                    }}
                  >
                    <div
                      style={{
                        border: 'solid 1px #50AAFD',
                        width: '32px',
                        height: '32px',
                        marginLeft: '10px',
                        display: '-webkit-box',
                        WebkitBoxPack: 'center',
                        WebkitBoxAlign: 'center',
                        borderRadius: '5px',
                      }}
                    >
                      <div
                        style={{ marginTop: '6px', cursor: 'pointer' }}
                        onClick={() => this.switchList()}
                      >
                        {this.listState ? (
                          <NewCoursewareListIcon svgColor={['#1D91FC']} />
                        ) : (
                          <NewCoursewareGridIcon
                            svgColor={['#1D91FC']}
                          ></NewCoursewareGridIcon>
                        )}
                      </div>
                    </div>

                    <Cascader
                      placeholder="全部类型"
                      className={antStyle.antInput}
                      changeOnSelect={true}
                      expandTrigger="click"
                      options={
                        this.courseWareTypeList
                          ? [
                              { id: null, title: '全部' },
                              ...this.courseWareTypeList,
                            ]
                          : null
                      }
                      //bordered={false}
                      allowClear={false}
                      value={Array.from(this.directoryId || [])}
                      onChange={(value, selectedOptions) => {
                        this.LookupCourseWareAsync(
                          this.keywords,
                          this.domain,
                          this.upload,
                          value,
                          this.bu,
                          1,
                        );
                      }}
                      fieldNames={{
                        label: 'title',
                        value: 'id',
                        children: 'voList',
                      }}
                      style={{
                        border: 'solid 1px #E4EAF2',
                        //background: 'transparent',
                        width: '144px',
                        borderRadius: '5px',
                      }}
                    />

                    <Select
                      style={{
                        width: '144px',
                        marginRight: '10px',
                      }}
                      allowClear={true}
                      placeholder="全部项目BU"
                      //bordered={false}
                      onChange={value =>
                        this.LookupCourseWareAsync(
                          this.keywords,
                          this.domain,
                          this.upload,
                          this.directoryId,
                          Number(value),
                          1,
                        )
                      }
                    >
                      {this.bulist?.map(buitem => {
                        return (
                          <Option value={buitem.bu} key={buitem.bu}>
                            {buitem.buName}
                          </Option>
                        );
                      })}
                    </Select>
                  </div>
                </div>

                {/* 表格标题 */}
                {this.totalCounts > 0 && this.listState ? (
                  <div
                    style={{
                      width: '100%',
                      height: '40px',
                      background: '#ffffff',
                      borderRadius: '10px',
                      marginTop: '20px',
                      display: '-webkit-box',
                      WebkitBoxAlign: 'center',
                      // display: 'flex',
                      // flexDirection:'row-reverse',
                      // whiteSpace: 'nowrap',
                    }}
                  >
                    <div
                      style={{
                        color: '#999999',
                        width: '45%',
                      }}
                    >
                      <span style={{ marginLeft: '10px' }}>名称</span>
                    </div>

                    <div
                      style={{
                        color: '#999999',
                        width: '18%',
                        marginLeft: '5px',
                      }}
                    >
                      <span>编辑者</span>
                    </div>

                    <div
                      style={{
                        color: '#999999',
                        width: '18%',
                        display: '-webkit-box',
                        WebkitBoxPack: 'start',
                        WebkitBoxAlign: 'center',
                      }}
                    >
                      <span>状态</span>
                    </div>

                    <div
                      style={{
                        color: '#999999',
                        width: '17%',
                        display: '-webkit-box',
                        WebkitBoxPack: 'center',
                        WebkitBoxAlign: 'center',
                      }}
                    >
                      <span>操作</span>
                    </div>
                  </div>
                ) : null}

                {/* 课件内容 */}
                {this.totalCounts > 0 ? (
                  <div>
                    {this.listState ? (
                      <div
                        style={{
                          marginTop: '10px',
                          width: '100%',
                          // overflow: 'auto',
                          // height:
                          //   (this.scrollY == 0
                          //     ? window.innerHeight - this.scrollHeight
                          //     : this.scrollY) + 50,
                        }}
                      >
                        <Table
                          //style={{marginTop:'-20px'}}
                          showHeader={false}
                          scroll={{
                            y:
                              this.scrollY == 0
                                ? window.innerHeight - this.scrollHeight
                                : this.scrollY,
                          }}
                          rowKey={record => record.coursewareId}
                          columns={columns}
                          dataSource={this.coursewares}
                          pagination={false}
                          className={antStyle.antTablerow}
                          onRow={record => {
                            return {
                              onMouseDown: event => {
                                this.hideQRCode();
                              },
                              onWheel: event => {
                                this.hideQRCode();
                                this.handleCancel(null);
                                this.hideRechristen();
                              },

                              onMouseEnter: event => {
                                this.selectCId = record.coursewareId;
                                console.log(this.selectCId);
                              }, // 鼠标移入行
                              onMouseLeave: event => {
                                //this.selectCId = null;
                              },

                              // onMouseEnter: event => {
                              //     let element = event.currentTarget as HTMLElement;
                              //     var editbtns = element.getElementsByClassName(
                              //     'editbtns',
                              //     )?.[0] as HTMLElement;
                              //     if (editbtns) editbtns.style.opacity = '1';
                              // }, // 鼠标移入行
                              // onMouseLeave: event => {
                              //     let element = event.currentTarget as HTMLElement;
                              //     var editbtns = element.getElementsByClassName(
                              //     'editbtns',
                              //     )?.[0] as HTMLElement;
                              //     if (editbtns) editbtns.style.opacity = '0';
                              // },
                            };
                          }}
                        />
                      </div>
                    ) : (
                      // 宫格模式
                      <div
                        style={{
                          overflow: 'auto',
                          height:
                            (this.scrollY == 0
                              ? window.innerHeight - this.scrollHeight
                              : this.scrollY) + 50,
                          marginTop: '10px',
                        }}
                        onMouseDown={() => {
                          this.hideQRCode();
                          //this.handleCancel(null);
                        }}
                        onWheel={() => {
                          this.hideQRCode();
                          this.handleCancel(null);
                          this.hideRechristen();
                        }}
                      >
                        {this.coursewares.map((item, i) => {
                          //console.log(item);

                          return (
                            <div
                              key={i}
                              style={{
                                float: 'left',
                                margin: '0px 10px 10px 0px',
                              }}
                              onMouseEnter={() => {
                                this.selectCId = item.coursewareId;
                              }}
                              onMouseLeave={() => {
                                this.selectCId = null;
                              }}
                            >
                              <div
                                onDoubleClick={event => {
                                  if (this.isDoubleOpen)
                                    this.onclick(event, item);
                                }}
                              >
                                <GridItemView
                                  coursewareId={item.coursewareId}
                                  coursewareName={item.coursewareName}
                                  cover={item.cover}
                                  self={item.self}
                                  domain={this.domain}
                                  shared={item.shared}
                                  compiler={item.compiler}
                                  updateTime={item.updateTime}
                                  upload={item.upload}
                                  onUpload={() => {
                                    this.uploadDialog(item);
                                  }}
                                ></GridItemView>
                              </div>

                              <div
                                style={{
                                  marginTop: '-36px',
                                  borderRadius: '0px 0px 10px 10px',
                                  position: 'relative',
                                  width: 230,
                                  height: '36px',
                                  background: '#333333c5',
                                  visibility:
                                    this.selectCId == item.coursewareId
                                      ? 'visible'
                                      : 'collapse',
                                }}
                              >
                                <div
                                  style={{
                                    display: '-webkit-box',
                                    //opacity: '0',
                                    WebkitBoxAlign: 'center',
                                    WebkitBoxPack: 'center',
                                  }}
                                >
                                  <div
                                    className={antStyle.uploadingHover}
                                    style={{
                                      width: '200px',
                                      display: '-webkit-box',
                                      WebkitBoxAlign: 'center',
                                      WebkitBoxPack: 'center',
                                      marginTop: '5px',
                                    }}
                                  >
                                    {item.upload == 0 && item.self ? (
                                      <span
                                        style={{
                                          marginLeft: 15,
                                          cursor: 'pointer',
                                        }}
                                        onClick={event =>
                                          this.uploadDialog(item)
                                        }
                                      >
                                        上传
                                      </span>
                                    ) : null}
                                    <span
                                      style={{
                                        marginLeft: 20,
                                        cursor: 'pointer',
                                      }}
                                      onClick={event =>
                                        this.playCoursePreview(item)
                                      }
                                    >
                                      预览
                                    </span>

                                    <Popover
                                      placement="bottom"
                                      trigger="click"
                                      visible={
                                        item.coursewareId == this.cid
                                          ? this.state.visible
                                          : false
                                      }
                                      content={
                                        <QRCode
                                          value={this.QRCodeText} //value参数为生成二维码的链接
                                          size={200} //二维码的宽高尺寸
                                          fgColor="#000000" //二维码的颜色
                                        />
                                      }
                                    >
                                      <span
                                        style={{
                                          marginLeft: 20,
                                          cursor: 'pointer',
                                        }}
                                        onClick={event =>
                                          this.onclick(event, item)
                                        }
                                      >
                                        打开
                                      </span>
                                    </Popover>

                                    <Popover
                                      //getPopupContainer={triggerNode => triggerNode.parentElement}
                                      //className={antStyle.antPopover}
                                      overlayClassName={antStyle.antPopover}
                                      placement="top"
                                      trigger="click"
                                      visible={
                                        item.coursewareId == this.cid
                                          ? this.state.rechristenVisible
                                          : false
                                      }
                                      content={
                                        <div
                                          style={{
                                            width: '277.5px',
                                            height: '116px',
                                            //background:'#00eeff71'
                                          }}
                                          onMouseDown={e => {
                                            //e.preventDefault();
                                            e.stopPropagation();
                                          }}
                                        >
                                          <div
                                            style={{
                                              color: '#333333FF',
                                              fontSize: '14px',
                                              width: '100%',
                                              display: '-webkit-box',
                                              WebkitBoxAlign: 'center',
                                              WebkitBoxPack: 'center',
                                              height: '20px',
                                              fontWeight: 'bold',
                                              marginTop: '2px',
                                            }}
                                          >
                                            <span>重命名</span>
                                          </div>

                                          <div
                                            style={{
                                              color: '#333333FF',
                                              fontSize: '14px',
                                              width: '100%',
                                              display: '-webkit-box',
                                              //WebkitBoxAlign:'center',
                                              WebkitBoxPack: 'center',
                                              //height:'28px',
                                              fontWeight: 'bold',
                                              marginTop: '15px',
                                            }}
                                          >
                                            <Input
                                              value={this.state.RechristenText.toString()}
                                              onChange={value => {
                                                this.setRechristenText(
                                                  value.target.value,
                                                );
                                              }}
                                              style={{
                                                width: '260px',
                                                borderRadius: '5px',
                                              }}
                                            ></Input>
                                          </div>

                                          <div
                                            style={{
                                              marginTop: '15px',
                                              width: '100%',
                                              display: '-webkit-box',
                                              //WebkitBoxAlign:'center',
                                              WebkitBoxPack: 'center',
                                            }}
                                          >
                                            <Button
                                              style={{
                                                width: '90px',
                                                height: '32',
                                                borderRadius: '3px',
                                              }}
                                              onClick={event =>
                                                this.hideRechristen()
                                              }
                                            >
                                              取消
                                            </Button>

                                            <Button
                                              disabled={
                                                this.state.RechristenText.toString().trim() ==
                                                ''
                                              }
                                              type="primary"
                                              style={{
                                                width: '90px',
                                                height: '32',
                                                marginLeft: '16px',
                                                borderRadius: '3px',
                                              }}
                                              onClick={event =>
                                                this.updateName()
                                              }
                                            >
                                              确定
                                            </Button>
                                          </div>
                                        </div>
                                      }
                                    >
                                      <Popconfirm
                                        //getPopupContainer={triggerNode => triggerNode.parentElement}
                                        cancelText="取消"
                                        okText="继续"
                                        placement="top"
                                        title={this.promptText}
                                        visible={
                                          item.coursewareId == this.cid
                                            ? this.state.visibleModal
                                            : false
                                        }
                                        onConfirm={this.handleOk}
                                        onCancel={this.handleCancel}
                                      >
                                        <div
                                          style={{
                                            marginLeft: 15,
                                            marginRight: 15,
                                            marginTop: 3,
                                            cursor: 'pointer',
                                          }}
                                        >
                                          <Dropdown
                                            //getPopupContainer={triggerNode => triggerNode.parentElement}
                                            overlayClassName={
                                              antStyle.antMenuHover
                                            }
                                            placement="bottomCenter"
                                            overlay={this.courseMenu(item)}
                                            trigger={['click']}
                                          >
                                            <div
                                              onClick={e => e.preventDefault()}
                                            >
                                              <NewMoreIcon
                                                svgColor={['#FFFFFFFF']}
                                              />
                                            </div>
                                          </Dropdown>
                                        </div>
                                      </Popconfirm>
                                    </Popover>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                    <StatisticPanel
                      statisticprops={this.statisticEntity}
                      refresh={this.GetRefresh}
                      submit={this.SumitData}
                      showSet={this.showSet}
                    />
                    <PlayCoursePreiew />
                    {/* 分页 */}
                    <div
                      style={{
                        width: '100%',
                        height: '70px',
                        display: '-webkit-box',
                        WebkitBoxPack: 'center',
                        WebkitBoxAlign: 'center',
                      }}
                    >
                      <Pagination
                        total={this.totalCounts}
                        showSizeChanger={false}
                        showQuickJumper
                        showTotal={total => `总数： ${this.totalCounts}`}
                        defaultPageSize={24}
                        defaultCurrent={1}
                        current={this.pageIndex}
                        onChange={(page, pageSize) =>
                          this.LookupCourseWareAsync(
                            this.keywords,
                            this.domain,
                            this.upload,
                            this.directoryId,
                            this.bu,
                            page,
                          )
                        }
                      />
                    </div>
                  </div>
                ) : null}

                {this.totalCounts <= 0 ? (
                  <div
                    style={{
                      display: '-webkit-Box',
                      WebkitBoxAlign: 'center',
                      WebkitBoxPack: 'center',
                      width: '100%',
                      height: '100%',
                    }}
                  >
                    <div style={{}}>
                      <img
                        style={{ display: 'block' }}
                        src={require('@/assets/mainlist/png_no_content.png')}
                      ></img>
                      <label style={{ marginLeft: '55px' }}>还没有内容</label>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CoursePage;
