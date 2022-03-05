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
} from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { Courseware } from '@/modelClasses/courseware';
import { action, runInAction, observable } from 'mobx';
import HttpService from '@/server/httpServer';
import TimerHelper from '@/utils/timerHelper';
import { display } from 'html2canvas/dist/types/css/property-descriptors/display';
import { element } from 'prop-types';
import ElementsCopyBox from '@/modelClasses/courseDetail/toolbox/elementsCopyBox';
import { removeEmptyVoList } from '@/models/designres';
import { PlayCoursePreiew } from './PlayCoursePreview';
import TextArea from 'antd/lib/input/TextArea';
import { CloseIcon, MoreIcon } from '@/utils/customIcon';
import { from } from 'linq-to-typescript';
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
import StrCompressHelper from '@/utils/strCompressHelper';
import { TripleDES, mode, pad, enc } from 'crypto-js';
// import '@/styles/defaultAnt.less';//不要直接引用

@observer
class CourseList extends React.Component<any, any> {
  constructor(props) {
    super(props);
  }

  @observable
  statisticEntity: StatisticEntity;
  //复制和二维码使用
  @observable
  cid: string;

  state = {
    visible: false,
    visibleModal: false,
  };

  //#region 复制删除弹出确认
  @observable
  isDel: boolean = false;

  @observable
  promptText: string;

  showModal = () => {
    this.setState({
      visibleModal: true,
    });
  };

  handleOk = e => {
    if (this.isDel) this.deleteCourseWare(this.cid);
    else this.CopyCourseWare(this.cid);

    this.setState({
      visibleModal: false,
    });
  };

  handleCancel = e => {
    this.setState({
      visibleModal: false,
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
  totalCounts: number = 0;
  domain: number = 0;
  keywords: string;
  @observable
  pageIndex: number = 1;
  bu: number;
  @observable
  upload: number = -1;
  @observable
  directoryId: any;
  @observable
  bulist: any[];
  @observable
  courseWareTypeList: any[];

  //表格列表高度滚动条
  @observable
  scrollY: number = 0;
  scrollHeight: number = 270;

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
  ) => {
    this.upload = upload;
    this.pageIndex = pageIndex;
    this.domain = domain;
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
        );
        this.addUpdateDialogClose();
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
        this.addUpdateDialogClose();
      }
    });
  };

  init() {
    this.CompressToDES();
    this.DESToCompress();
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

  @action CompressToDES = async () => {
    console.time('timer');
    var data = await HttpService.getcompessAndDES(
      'https://web-data.zmlearn.com/doc/xpRB3hMbsvqHu9EQEwqQcz/compressand1234.txt',
    );
    runInAction(() => {
      if (data) {
        const keyHex = enc.Utf8.parse('12b7c9b9c3f04cdc93c73bed');
        const decrypted = TripleDES.decrypt(
          {
            ciphertext: enc.Base64.parse(data),
          },
          keyHex,
          {
            mode: mode.ECB,
            padding: pad.Pkcs7,
          },
        );
        var decryptedData = decrypted.toString(enc.Utf8);
        var dataCompress = StrCompressHelper.unzipUTF8(decryptedData);
      }
    });
  };

  @action DESToCompress = async () => {
    console.time('timer-noDEST');
    var data = await HttpService.getcompessAndDES(
      'https://web-data.zmlearn.com/doc/gYL8m3feAMXHVxQNbNMtNB/1234.txt',
    );
    runInAction(() => {
      if (data) {
        console.timeEnd('timer-noDEST');
      }
    });
  };

  //#region  基础事件
  componentDidMount() {
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

  playCoursePreview(courseware: Courseware) {
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
    } else {
      var mainUrl = process.env.prevUrl;
      var url = `${mainUrl}?editorPreview=1&coursewareId=${
        courseware.coursewareId
      }&checkFlag=true&userId=${courseware.userId}&tkyun=${
        CacheHelper.UserInfo.userToken
      }&rand=${Math.random()}`;
      if (
        courseware.purposeVo.code &&
        courseware.purposeVo.code == 'PICTRUE_BOOK'
      ) {
        PlayCoursePreiew.playHeight = 1280 / 2;
      }
      PlayCoursePreiew.isplayCourse = true;
      PlayCoursePreiew.playConfig = [];
      PlayCoursePreiew.playConfig.push(url, courseware.coursewareName);
      PlayCoursePreiew.playWidth = 1280;
    }
  }

  onMenuClick(key: any, courseware: Courseware) {
    if (key == '0') {
      this.addUpdateDialog(courseware);
    } else if (key == '1') {
      this.isDel = false;
      this.cid = courseware.coursewareId;
      this.promptText = '确认复制"' + courseware.coursewareName + '"课件吗？';
      this.showModal();
    } else if (key == '2') {
      this.cid = courseware.coursewareId;
      this.GetQRCode(this.cid);
    } else if (key == '3') {
      this.SharedOperation(courseware);
    } else if (key == '4') {
      this.isDel = true;
      this.cid = courseware.coursewareId;
      this.promptText = '确认删除"' + courseware.coursewareName + '"课件吗？';
      this.showModal();
    } else if (key == '5') {
      this.GetResourceList(courseware.coursewareId);
    }
  }

  @action GetResourceList = async (cwId: string) => {
    var data = await HttpService.getCouresWareDetail(cwId);
    this.statisticEntity = new StatisticEntity();
    this.statisticEntity.statisticresources = data.gameResourceList;
    this.statisticEntity.visible = true;
  };

  courseMenu(courseware: Courseware) {
    return (
      <Menu onClick={event => this.onMenuClick(event.key, courseware)}>
        <Menu.Item key="0">编辑属性</Menu.Item>
        <Menu.Item key="1">复制课件</Menu.Item>
        <Menu.Item key="2">二维码</Menu.Item>
        <Menu.Item key="3" disabled={!courseware.self}>
          共享/取消共享
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="4" disabled={!courseware.self}>
          删除
        </Menu.Item>
        <Menu.Item key="5">课件资源分析</Menu.Item>
      </Menu>
    );
  }

  render() {
    const columns = [
      {
        title: '项目',
        dataIndex: 'coursewareName',
        key: 'coursewareName',
        width: '64%',
        render: (text, record: Courseware) => (
          <div
            style={{
              color: '#666666',
              display: '-webkit-box',
              WebkitBoxOrient: 'horizontal',
              WebkitBoxPack: 'start',
              whiteSpace: 'nowrap',
            }}
          >
            {record.cover ? (
              <img
                src={record.cover}
                style={{
                  margin: '10px',
                  height: '50px',
                  width: '50px',
                  objectFit: 'cover',
                  background: '#F8F8F8',
                }}
              ></img>
            ) : (
              <img
                src={require('@/assets/mainlist/defaultbg.png')}
                style={{
                  margin: '10px',
                  height: '50px',
                  width: '50px',
                  objectFit: 'contain',
                  background: '#F8F8F8',
                }}
              ></img>
            )}
            <div
              style={{
                display: '-webkit-box',
                WebkitBoxAlign: 'center',
                marginLeft: 30,
                width: '300px',
              }}
            >
              <Tooltip placement="topLeft" title={text}>
                <div
                  style={{
                    textOverflow: 'ellipsis',
                    width: '300px',
                    overflow: 'hidden',
                  }}
                >
                  <span style={{ color: '#0aa6e4' }}>
                    {record.shared && this.domain == 0 ? '[享]' : null}
                  </span>
                  <span style={{ color: '#0aa6e4' }}>
                    {record.self && this.domain == 1 ? '[自己]' : null}
                  </span>
                  {text}
                </div>
              </Tooltip>
            </div>
            <div
              className="editbtns"
              style={{
                width: '40%',
                display: '-webkit-box',
                opacity: '0',
                WebkitBoxAlign: 'center',
                WebkitBoxPack: 'end',
              }}
            >
              {record?.upload != 1 && this.domain != 1 ? (
                <label
                  style={{ marginLeft: 20, cursor: 'pointer' }}
                  onClick={event => this.uploadDialog(record)}
                >
                  上传
                </label>
              ) : null}
              <label
                style={{ marginLeft: 20, cursor: 'pointer' }}
                onClick={event => this.playCoursePreview(record)}
              >
                预览
              </label>

              <Popover
                placement="bottom"
                trigger="click"
                visible={
                  record.coursewareId == this.cid ? this.state.visible : null
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
                  style={{ marginLeft: 20, cursor: 'pointer' }}
                  onClick={event => this.onclick(event, record)}
                >
                  打开
                </label>
              </Popover>

              <div style={{ marginLeft: 10, marginTop: 3, cursor: 'pointer' }}>
                <Dropdown overlay={this.courseMenu(record)} trigger={['click']}>
                  <div onClick={e => e.preventDefault()}>
                    <MoreIcon />
                  </div>
                </Dropdown>
              </div>
            </div>
          </div>
        ),
      },
      {
        title: '编辑者',
        dataIndex: 'compiler',
        key: 'compiler',
        width: '10%',
      },
      {
        title: '状态',
        dataIndex: 'upload',
        key: 'upload',
        width: '10%',
        render: (text, record: Courseware) => (
          <div>
            {record.upload == 1 ? (
              <div style={{ display: 'flex' }}>
                <div
                  style={{
                    borderRadius: '50%',
                    background: 'green',
                    width: 5,
                    height: 5,
                    marginTop: 9,
                    marginRight: 5,
                  }}
                />
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
              </div>
            )}
          </div>
        ),
      },
      {
        width: '15%',
        title: '修改时间',
        dataIndex: 'updateTime',
        key: 'updateTime',
        render: (text, record: Courseware) => (
          <label>{TimerHelper.stringToDate(record.updateTime)}</label>
        ),
      },
    ];

    let widthUi = '350px';
    return (
      <div>
        <Modal
          centered
          title="确认操作"
          visible={this.state.visibleModal}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          cancelText="取消"
          okText="确认"
        >
          <p>{this.promptText}</p>
          {/* <p>确认复制{this.CopyNmae}课件吗？</p> */}
        </Modal>
        <div
          style={{
            width: '100%',
            margin: '10px',
          }}
        >
          <Radio.Group
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
            <Radio.Button value={0}>我的项目</Radio.Button>
            <Radio.Button value={1}>云项目</Radio.Button>
          </Radio.Group>
          <div
            style={{
              marginTop: '10px',
              width: '100%',
              display: '-webkit-box',
              WebkitBoxOrient: 'horizontal',
              WebkitBoxPack: 'justify',
              whiteSpace: 'nowrap',
            }}
          >
            <div
              style={{ WebkitBoxOrient: 'horizontal', display: '-webkit-box' }}
            >
              <Radio.Group
                buttonStyle="solid"
                value={this.upload}
                onChange={event =>
                  this.LookupCourseWareAsync(
                    this.keywords,
                    this.domain,
                    event.target.value,
                    this.directoryId,
                    this.bu,
                    1,
                  )
                }
              >
                <Radio.Button value={-1}>全部类型</Radio.Button>
                <Radio.Button value={0}>未上传</Radio.Button>
                <Radio.Button value={1}>已上传</Radio.Button>
              </Radio.Group>
              <Search
                placeholder="查询课件"
                style={{
                  width: '400px',
                  marginLeft: 10,
                  display: '-webkit-box',
                  WebkitBoxAlign: 'center',
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
                enterButton
                allowClear
              />
            </div>
            <div style={{ marginRight: '60px' }}>
              <Button
                //icon={Icon_create_folder()}
                type="primary"
                style={{}}
                onClick={event => this.addUpdateDialog()}
              >
                新建项目
              </Button>
            </div>
          </div>
        </div>
        <div
          style={{
            margin: '10px',
            display: '-webkit-box',
            WebkitBoxOrient: 'horizontal',
            WebkitBoxPack: 'start',
            whiteSpace: 'nowrap',
          }}
        >
          <Select
            style={{ width: '120px' }}
            allowClear={true}
            placeholder="全部项目BU"
            bordered={false}
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
          <Cascader
            placeholder="全部类型"
            size="small"
            changeOnSelect={true}
            expandTrigger="hover"
            options={
              this.courseWareTypeList
                ? [{ id: null, title: '全部' }, ...this.courseWareTypeList]
                : null
            }
            bordered={false}
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
            fieldNames={{ label: 'title', value: 'id', children: 'voList' }}
            style={{
              background: 'transparent',
              width: '300px',
            }}
          />
        </div>
        <Table
          style={{ margin: '10px' }}
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
          onRow={record => {
            return {
              onMouseDown: event => {
                this.hideQRCode();
              },
              onWheel: event => {
                this.hideQRCode();
              },
              onMouseEnter: event => {
                let element = event.currentTarget as HTMLElement;
                var editbtns = element.getElementsByClassName(
                  'editbtns',
                )?.[0] as HTMLElement;
                if (editbtns) editbtns.style.opacity = '1';
              }, // 鼠标移入行
              onMouseLeave: event => {
                let element = event.currentTarget as HTMLElement;
                var editbtns = element.getElementsByClassName(
                  'editbtns',
                )?.[0] as HTMLElement;
                if (editbtns) editbtns.style.opacity = '0';
              },
            };
          }}
        />
        <StatisticPanel statisticprops={this.statisticEntity} />
        <PlayCoursePreiew />
        <div style={{ float: 'right', margin: '10px' }}>
          <Pagination
            total={this.totalCounts}
            showSizeChanger={false}
            showQuickJumper
            showTotal={total => `总数： ${this.totalCounts}`}
            defaultPageSize={20}
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
        <div style={{ position: 'absolute' }}>
          <Modal
            style={{ padding: '0px' }}
            width={`${this.windowWidth}px`}
            closable={false}
            title={null}
            centered
            visible={this.isWindowShow}
            maskClosable={false}
            footer={false}
          >
            <div>
              {this.windowsStyle == 1 ? (
                <div>
                  <div
                    style={{ marginTop: -10, marginBottom: 20, fontSize: 16 }}
                  >
                    <div style={{ textAlign: 'center' }}>上传项目</div>
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
                  <div style={{ height: 130 }}>
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
                      {' '}
                      确定上传
                    </Button>
                  </div>
                </div>
              ) : null}
              {this.windowsStyle == 2 ? (
                <div>
                  <div
                    style={{ marginTop: -10, marginBottom: 20, fontSize: 16 }}
                  >
                    <div style={{ textAlign: 'center' }}>
                      {this.addupdateCourseTitle}
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
                  <div style={{ height: 550 }}>
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
                        onChange={value =>
                          this.itemCourseWareTypeChanged(value)
                        }
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
                        onChange={event =>
                          (this.itemremark = event.target.value)
                        }
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
                        <Option value="1920*1080">1920*1080</Option>
                        <Option value="1280*720">1280*720</Option>
                        <Option value="1536*768">1536*768</Option>
                        <Option value="1600*720">1600*720</Option>
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

                    <div style={{ textAlign: 'center', marginTop: '20px' }}>
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
                        style={{ width: '200px' }}
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
        </div>
      </div>
    );
  }
}

export default CourseList;
