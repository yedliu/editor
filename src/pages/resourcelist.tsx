import 'reflect-metadata';
import React from 'react';
import { connect } from 'dva';
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
  message,
  Popover,
  Checkbox,
} from 'antd';
import HttpService from '@/server/httpServer';
import { RedoOutlined } from '@ant-design/icons';
import TimerHelper from '@/utils/timerHelper';
import { display } from 'html2canvas/dist/types/css/property-descriptors/display';
import { element } from 'prop-types';
import ElementsCopyBox from '@/modelClasses/courseDetail/toolbox/elementsCopyBox';
import { removeEmptyVoList } from '@/models/designres';
import { PlayCoursePreiew } from './PlayCoursePreview';
import TextArea from 'antd/lib/input/TextArea';
import { CloseIcon, MoreIcon } from '@/utils/customIcon';
import { EditableTagGroup } from '@/components/controls/editableTagGroup';
import IdHelper from '@/utils/idHelper';
import '@/styles/property.less';
import { observable, action, runInAction } from 'mobx';
import CWResource from '@/modelClasses/courseDetail/cwResource';
import { CWResourceTypes } from '@/modelClasses/courseDetail/courseDetailenum';
import {
  PreviewResource,
  ResConfig,
} from '@/components/controls/previewResource';
import ResUploadView from '@/components/controls/ResUpload/resUploadView';
import CacheHelper from '@/utils/cacheHelper';
import convertHelper from '@/utils/convertHelper';
import { CaptionsIcon } from '@/svgs/designIcons';
import UploadVoiceView from '@/components/cwDesignUI/uploadVoice/uploadVoiceView';
const { Search } = Input;
const { Option } = Select;
import antStyle from '@/styles/defaultAnt.less';

@observer
class ResourceList extends React.Component<any, any> {
  constructor(props) {
    super(props);
  }
  @observable
  isShowUploadVoiceView: boolean = false;

  //#region 搜索字幕音频添加

  @observable
  selectedValue: any;

  @observable
  selectedOptions: any = null;

  @observable
  tencentSubTitle: boolean = false;
  //#endregion

  @observable
  resources: Array<CWResource>;
  totalCounts: number = 0;
  keywords: string = null;
  @observable
  pageIndex: number = 1;
  @observable
  directoryId: any = null;
  @observable
  field: string = 'updateTime';
  @observable
  sort: string = 'desc';
  resourceTypeList: any[];
  fetchResDicTypes: any[];

  //Model 窗口属性通知
  @observable
  isWindowShow: boolean = false;
  //表格列表高度滚动条
  @observable
  scrollY: number = 0;
  scrollHeight: number = 240;

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

  resourceMenu(resource: CWResource) {
    return (
      <Menu>
        <Menu.Item key="0" onClick={event => this.modalDialogShow(resource)}>
          编辑属性
        </Menu.Item>
      </Menu>
    );
  }

  init() {
    if (!this.resourceTypeList) this.SearchResourceTypeCascade();
    if (!this.fetchResDicTypes) this.fetchResDicTypeMap();
    this.SearchResAsync(this.keywords, this.directoryId, 1);
  }

  resourceId: string;
  @observable
  resouceName: string;
  @observable
  itemtasklabel: string[];
  @observable
  dicName: string;
  @observable
  selectedResouce: CWResource;
  @observable
  selectedatcionArray: string[];

  @observable
  private _CaptionLanguageKey: number = null;
  public get CaptionLanguageKey(): number {
    return this._CaptionLanguageKey;
  }
  public set CaptionLanguageKey(v: number) {
    this._CaptionLanguageKey = v;
    this.StatusDesc = '';
  }

  @observable
  StatusDesc: string = '';

  @observable
  resconfig: ResConfig;

  resPreview(resource: CWResource) {
    this.resconfig = new ResConfig();
    this.resconfig.resourceList = this.resources;
    this.resconfig.selectedresouceIndex = this.resources.indexOf(resource);
    this.resconfig.visible = true;
  }

  modalDialogShow(resource: CWResource) {
    this.selectedResouce = resource;
    this.resourceId = resource.resourceId;
    this.resouceName = resource.resourceName;
    this.itemtasklabel = resource.strList;
    this.dicName =
      resource.purpose + '-' + resource.directorys.replaceAll('>', '-');
    this.isWindowShow = true;
    if (resource.statusVO) {
      this.CaptionLanguageKey = resource.statusVO.language;
      this.StatusDesc = resource.statusVO.statusDesc;
    }
  }

  modalDialogClose() {
    this.isWindowShow = false;
    this.resourceId = null;
    this.resouceName = null;
    this.itemtasklabel = null;
    this.dicName = null;
    this.selectedatcionArray = null;
    this.selectedResouce = null;
    this.CaptionLanguageKey = null;
    this.StatusDesc = null;
  }

  onLoadSkImage(
    event: React.SyntheticEvent<HTMLIFrameElement, Event>,
    name: string,
  ) {
    let element = event.currentTarget;
    let skcontrol = element.contentWindow as any;
    skcontrol.LoadSkResPlayName(
      200,
      200,
      this.selectedResouce.boneSource,
      this.selectedResouce.boneJs,
      200 /
        (this.selectedResouce.width > this.selectedResouce.height
          ? this.selectedResouce.width
          : this.selectedResouce.height),
      name,
    );
  }

  convertImageUrl(source: CWResource) {
    switch (source.resourceType) {
      case CWResourceTypes.Image:
        return source.resourceKey?.concat('?x-oss-process=image/resize,l_60');
      case CWResourceTypes.SkeletalAni:
        return source.resourceKey?.concat('?x-oss-process=image/resize,l_60');
      case CWResourceTypes.Audio:
        return require('@/assets/mp3_icon.png');
      case CWResourceTypes.Video:
        return source.resourceKey?.concat(
          '?x-oss-process=video/snapshot,t_100,m_fast',
        );
    }
  }

  @action modalDialogEditSumbit = async () => {
    //是否选择了字幕音频语言
    var captionsLanguage = null;
    if (this.CaptionLanguageKey != null) {
      captionsLanguage = {
        tencentSubtitleReq: {
          language: this.CaptionLanguageKey,
        },
      };
    }

    var data = await HttpService.UpdateResource({
      resourceName: this.resouceName,
      resourceId: this.resourceId,
      labelNames: this.itemtasklabel,
      resourceType: this.selectedResouce.resourceType,
      boneList:
        this.selectedResouce.resourceType == CWResourceTypes.SkeletalAni
          ? this.selectedResouce.boneList
          : null,
      ...captionsLanguage,
    });
    runInAction(() => {
      if (data) {
        if (data.code != '0') {
          message.error(data ? data.message : '请确认网络连接和服务器状态');
        } else {
          this.modalDialogClose();
          this.SearchResAsync(this.keywords, this.directoryId, 1);
        }
      }
    });
  };

  @action SearchResourceTypeCascade = async () => {
    var data = await HttpService.fetchResDics();
    runInAction(() => {
      if (data) {
        data.forEach(x => removeEmptyVoList(x));
        this.resourceTypeList = data;
      }
    });
  };

  @action fetchResDicTypeMap = async () => {
    var data = await HttpService.fetchResDicTypeMap();
    runInAction(() => {
      if (data) {
        this.fetchResDicTypes = data;
      }
    });
  };

  renderCaptionsPreview(record: CWResource) {
    return (
      <div
        style={{
          height: '50px',
          width: '50px',
          position: 'relative',
        }}
      >
        <div style={{ margin: '2px' }}>{CaptionsIcon()}</div>
        <div
          style={{
            position: 'absolute',
            left: '2px',
            bottom: '2px',
            padding: '2px',
            borderRadius: '3px',
            background: '#3333CC5F',
            maxWidth: '40px',
            color: '#FFFFFFCF',
            fontSize: '8px',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            userSelect: 'none',
            transform: 'scale(0.7,0.7)',
            transformOrigin: '0% 100%',
          }}
        >
          {record.language}
        </div>
      </div>
    );
  }

  audioCaptionsPreview(record: CWResource) {
    return (
      <div
        style={{
          height: '50px',
          width: '50px',
          position: 'relative',
        }}
      >
        <div style={{ margin: '2px' }}>
          <img
            onDoubleClick={event => this.resPreview(record)}
            src={this.convertImageUrl(record)}
            style={{
              margin: '10px',
              height: '50px',
              width: '50px',
              cursor: 'pointer',
              objectFit: 'contain',
              background: '#F8F8F8',
              position: 'absolute',
            }}
          ></img>
        </div>
        <div
          style={{
            position: 'absolute',
            left: '12px',
            top: '10px',
            padding: '2px',
            borderRadius: '3px',
            background: '#3333CC5F',
            color: '#FFFFFFCF',
            transform: 'scale(0.7,0.7)',
          }}
        >
          字幕
        </div>
      </div>
    );
  }

  @action SearchResAsync = async (
    keywords: string,
    directoryId: any,
    pageIndex: number,
    searchType: number = 1,
    tencentSubTitle: number = null,
  ) => {
    this.pageIndex = pageIndex;
    this.directoryId = directoryId;
    this.keywords = keywords;
    let resourcetype = null;
    if (directoryId && directoryId[0] != null)
      resourcetype = this.fetchResDicTypes.find(
        p => p.directoryId == directoryId[0],
      )?.type;
    var data = await HttpService.queryResPage({
      pageNo: pageIndex,
      pageSize: 48,
      resourceType: resourcetype,
      field: this.field,
      sort: this.sort,
      resourceName: keywords,
      searchType: searchType,
      directoryId: directoryId ? directoryId[directoryId.length - 1] : null,
      tencentSubTitle: tencentSubTitle,
    });
    runInAction(() => {
      if (data && data.list) {
        this.resources = data.list as Array<CWResource>;
        this.totalCounts = data.total;
      } else {
        this.resources = null;
        this.totalCounts = 0;
      }
    });
  };

  TableOnChange(pagination, filters, sorter, extra) {
    var keywordtemp = this.keywords;
    var directoryIdtemp = this.directoryId;
    var pageIndextemp = this.pageIndex;
    var selectedOptionstemp = this.selectedOptions;

    if (sorter.order) {
      this.sort = sorter.order == 'descend' ? 'desc' : 'asc';
      this.field = sorter.field;
      this.SearchResAsync(
        keywordtemp,
        directoryIdtemp,
        pageIndextemp,
        1,
        selectedOptionstemp?.[0]?.code == 'FREQUENCY'
          ? this.tencentSubTitle
            ? 1
            : null
          : null,
      );
    } else {
      this.sort = 'desc';
      this.field = 'updateTime';
      this.SearchResAsync(
        keywordtemp,
        directoryIdtemp,
        pageIndextemp,
        1,
        selectedOptionstemp?.[0]?.code == 'FREQUENCY'
          ? this.tencentSubTitle
            ? 1
            : null
          : null,
      );
    }
  }

  render() {
    const columns = [
      {
        title: '项目',
        dataIndex: 'resourceName',
        key: 'resourceName',
        width: '60%',
        render: (text, record: CWResource) => (
          <div
            style={{
              color: '#666666',
              display: '-webkit-box',
              WebkitBoxOrient: 'horizontal',
              WebkitBoxPack: 'start',
              whiteSpace: 'nowrap',
            }}
          >
            <div
              style={{
                display: '-webkit-box',
                WebkitBoxAlign: 'center',
                width: '40px',
              }}
            >
              <span style={{ color: '#1D91FC' }}>
                [{convertHelper.convertToCwResourceTypeToZh_Cn(record)}]
              </span>
            </div>

            {record.resourceType == CWResourceTypes.Captions ? (
              this.renderCaptionsPreview(record)
            ) : record.resourceType == CWResourceTypes.Audio &&
              record.statusVO ? (
              this.audioCaptionsPreview(record)
            ) : (
              <img
                onDoubleClick={event => this.resPreview(record)}
                src={this.convertImageUrl(record)}
                style={{
                  margin: '10px',
                  height: '50px',
                  width: '50px',
                  cursor: 'pointer',
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
                width: '400px',
              }}
            >
              <Tooltip placement="topLeft" title={text}>
                <div
                  style={{
                    textOverflow: 'ellipsis',
                    width: '400px',
                    overflow: 'hidden',
                  }}
                >
                  {text}
                </div>
              </Tooltip>
            </div>
            <div
              className="editbtns"
              style={{
                display: '-webkit-box',
                opacity: '0',
                WebkitBoxPack: 'end',
                WebkitBoxAlign: 'center',
              }}
            >
              <label
                style={{ marginLeft: 20, cursor: 'pointer' }}
                onClick={event => this.resPreview(record)}
              >
                预览
              </label>

              <div style={{ marginLeft: 10, marginTop: 3, cursor: 'pointer' }}>
                <Dropdown
                  overlay={this.resourceMenu(record)}
                  trigger={['click']}
                >
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
        title: '尺寸',
        dataIndex: 'resourceSize',
        key: 'resourceSize',
        width: '10%',
        sorter: (a, b) => 0,
        render: (text, record: CWResource) => (
          <label>{CacheHelper.ConvertSize(record.resourceSize)}</label>
        ),
      },
      {
        title: '编辑者',
        dataIndex: 'userName',
        key: 'userName',
        width: '14%',
        render: (text, record: CWResource) => <label>{record.userName}</label>,
      },
      {
        title: '修改时间',
        dataIndex: 'updateTime',
        key: 'updateTime',
        width: '15%',
        render: (text, record: CWResource) => (
          <label>{TimerHelper.stringToDate(record.updateTime)}</label>
        ),
      },
    ];

    return (
      <div
        className={antStyle.antCommon}
        style={{
          position: 'absolute',
          left: '0px',
          top: '0px',
          bottom: '0px',
          right: '0px',
          background: '#FFFFFFFF',
        }}
      >
        <Modal
          title="第三方语音"
          style={{ userSelect: 'none' }}
          visible={this.isShowUploadVoiceView}
          width="820px"
          footer={null}
          destroyOnClose={true}
          onCancel={() => {
            this.isShowUploadVoiceView = false;
          }}
        >
          <UploadVoiceView
            onClose={() => {
              this.isShowUploadVoiceView = false;
            }}
            update={() => {
              this.SearchResAsync(
                this.keywords,
                this.selectedValue,
                1,
                1,
                this.selectedOptions &&
                  this.selectedOptions[0]?.code == 'FREQUENCY' &&
                  this.tencentSubTitle
                  ? 1
                  : null,
              );
            }}
          />
        </Modal>
        <div
          style={{
            position: 'relative',
            left: '10px',
          }}
        >
          <div
            style={{
              marginTop: '0px',
              right: '130px',
              display: '-webkit-box',
              WebkitBoxOrient: 'horizontal',
              WebkitBoxPack: 'end',
              whiteSpace: 'nowrap',
            }}
          >
            <Search
              className={antStyle.antSearch}
              placeholder="输入资源名称"
              style={{
                width: '300px',
                marginTop: '12px',
                marginRight: '148px',
              }}
              onSearch={value => {
                this.SearchResAsync(
                  value,
                  this.directoryId,
                  1,
                  1,
                  this.selectedOptions
                    ? this.selectedOptions[0]?.code == 'FREQUENCY'
                      ? this.tencentSubTitle
                        ? 1
                        : null
                      : null
                    : null,
                );
              }}
              allowClear
            />
          </div>
        </div>
        <div
          style={{
            position: 'relative',
            margin: '10px 10px',
            display: '-webkit-box',
            WebkitBoxOrient: 'horizontal',
            WebkitBoxPack: 'start',
            whiteSpace: 'nowrap',
          }}
        >
          <Cascader
            placeholder="全部类型"
            className={antStyle.antInput}
            //size="small"
            changeOnSelect={true}
            expandTrigger="hover"
            options={
              this.resourceTypeList
                ? [{ id: null, title: '全部' }, ...this.resourceTypeList]
                : null
            }
            bordered={false}
            allowClear={false}
            value={Array.from(this.directoryId || [])}
            onChange={(value, selectedOptions) => {
              this.selectedOptions = selectedOptions;
              this.selectedValue = value;
              this.SearchResAsync(
                this.keywords,
                value,
                1,
                1,
                this.selectedOptions[0]?.code == 'FREQUENCY'
                  ? this.tencentSubTitle
                    ? 1
                    : null
                  : null,
              );
            }}
            fieldNames={{ label: 'title', value: 'id', children: 'voList' }}
            style={{
              border: 'solid 1px #E4EAF2',
              background: 'transparent',
              width: '300px',
            }}
          />
          {this.selectedOptions != null &&
          this.selectedOptions[0]?.code == 'FREQUENCY' ? (
            <Checkbox
              checked={this.tencentSubTitle || false}
              onChange={val => {
                this.tencentSubTitle = val.target.checked;
                this.SearchResAsync(
                  this.keywords,
                  this.selectedValue,
                  1,
                  1,
                  val.target.checked ? 1 : null,
                );
              }}
            >
              搜索字幕音频
            </Checkbox>
          ) : null}

          <div style={{ position: 'absolute', right: '138px', top: '0px' }}>
            <Button
              type="primary"
              onClick={() => (this.isShowUploadVoiceView = true)}
            >
              合成语音
            </Button>
            <Button
              style={{ marginLeft: '5px' }}
              type="primary"
              onClick={() => {
                if (window['loginToken'] && window['loginToken'].token) {
                  //TODO:打开本地程序上传
                  var ws = new WebSocket('ws://localhost:' + process.env.port);
                  ws.onopen = evt => {
                    ws.send(
                      JSON.stringify({
                        webReqType: 2,
                      }),
                    );
                  };
                  ws.onmessage = (msgevent => {
                    ws.close();
                    this.SearchResAsync(this.keywords, this.directoryId, 1);
                  }).bind(this);
                } else ResUploadView.isShowUploadView = true;
              }}
            >
              上传素材
            </Button>
          </div>
        </div>
        <Table
          style={{ margin: '10px' }}
          scroll={{
            y:
              this.scrollY == 0
                ? window.innerHeight - this.scrollHeight
                : this.scrollY,
          }}
          rowKey={record => record.resourceId}
          columns={columns}
          dataSource={this.resources}
          pagination={false}
          onChange={this.TableOnChange.bind(this)}
          onRow={record => {
            return {
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

        <div style={{ float: 'right', margin: '10px' }}>
          <Pagination
            total={this.totalCounts}
            showSizeChanger={false}
            showQuickJumper
            showTotal={total => `总数： ${this.totalCounts}`}
            defaultPageSize={48}
            defaultCurrent={1}
            current={this.pageIndex}
            onChange={(page, pageSize) =>
              this.SearchResAsync(this.keywords, this.directoryId, page)
            }
          />
        </div>
        <div style={{ position: 'absolute' }}>
          <Modal
            style={{ padding: '0px' }}
            width={'400px'}
            closable={false}
            title={null}
            centered
            visible={this.isWindowShow}
            maskClosable={false}
            footer={false}
          >
            <div>
              <div style={{ marginTop: -10, marginBottom: 20, fontSize: 16 }}>
                <div
                  style={{
                    position: 'absolute',
                    width: 20,
                    height: 20,
                    right: 5,
                    top: 5,
                    cursor: 'pointer',
                  }}
                  onClick={event => this.modalDialogClose()}
                >
                  <CloseIcon />
                </div>
              </div>
              <div style={{ height: 160 }}>
                <div style={{ display: 'flex', marginTop: 10 }}>
                  <div style={{ width: '65px', lineHeight: '30px' }}>
                    <span style={{ color: 'red' }}>*</span>素材名称
                  </div>
                  <Input
                    style={{ width: '250px', marginLeft: '20px' }}
                    value={this.resouceName || ''}
                    onChange={event => (this.resouceName = event.target.value)}
                    placeholder="请输入素材名称"
                  />
                </div>
                <div style={{ display: 'flex', marginTop: 10 }}>
                  <div style={{ width: '65px', lineHeight: '30px' }}>
                    <span style={{ color: 'red' }}>*</span>存储位置
                  </div>
                  <div
                    style={{
                      width: '250px',
                      marginLeft: '22px',
                      lineHeight: '30px',
                    }}
                  >
                    {this.dicName}
                  </div>
                </div>

                {this.selectedResouce?.resourceType == CWResourceTypes.Audio ? (
                  <div>
                    <div style={{ display: 'flex', marginTop: 15 }}>
                      <div style={{ width: '65px' }}>
                        <span style={{ marginLeft: '5px' }}>字幕音频</span>
                      </div>
                      <div
                        style={{
                          marginLeft: '20px',
                          width: '250px',
                          overflow: 'auto',
                        }}
                      >
                        <Select
                          //getPopupContainer={triggerNode => triggerNode.parentElement}
                          style={{ width: 250 }}
                          size={'small'}
                          value={this.CaptionLanguageKey}
                          onChange={value => (this.CaptionLanguageKey = value)}
                        >
                          {CacheHelper.CaptionLanguage?.map(item => {
                            return (
                              <Option
                                value={Number(item.configKey)}
                                key={item.configKey}
                              >
                                {item.configValue}
                              </Option>
                            );
                          })}
                        </Select>
                      </div>
                    </div>

                    <div style={{ display: 'flex', marginTop: 0 }}>
                      <span style={{ marginLeft: '92px' }}>
                        {this.StatusDesc}
                      </span>
                    </div>
                  </div>
                ) : null}

                <div style={{ display: 'flex', marginTop: 15 }}>
                  <div style={{ width: '65px' }}>
                    <span style={{ color: 'white' }}>*</span>素材标签
                  </div>
                  <div
                    style={{
                      height: '50px',
                      marginLeft: '20px',
                      width: '250px',
                      overflow: 'auto',
                    }}
                  >
                    <EditableTagGroup
                      labels={this.itemtasklabel}
                      onChange={value => (this.itemtasklabel = value)}
                    />
                  </div>
                </div>
              </div>

              {this.selectedResouce?.resourceType ==
              CWResourceTypes.SkeletalAni ? (
                <div>
                  <div style={{ display: 'flex', marginTop: 15 }}>
                    <div style={{ width: '95px' }}>动作名称设置</div>
                  </div>
                  {this.selectedResouce.boneList.map(item => {
                    return (
                      <div key={item.value}>
                        <div style={{ display: 'flex', marginTop: 10 }}>
                          <div style={{ width: '65px', lineHeight: '30px' }}>
                            动作名称
                          </div>
                          <div
                            style={{
                              width: '250px',
                              marginLeft: '22px',
                              lineHeight: '30px',
                              display: '-webkit-box',
                              WebkitBoxOrient: 'horizontal',
                              WebkitBoxPack: 'justify',
                              background: 'rgba(232, 232, 232, 1)',
                            }}
                          >
                            <div
                              style={{
                                marginLeft: '10px',
                                WebkitBoxPack: 'start',
                              }}
                            >
                              {item.value}
                            </div>
                            <Popover
                              content={
                                item.visiblePop == true ? (
                                  <iframe
                                    src="./layaboxIndex.html"
                                    className="layaboxIndex"
                                    style={{
                                      margin: '0px',
                                      padding: '0px',
                                      overflow: 'hidden',
                                      border: 'none',
                                      userSelect: 'none',
                                      width: '200px',
                                      height: '200px',
                                    }}
                                    onLoad={event =>
                                      this.onLoadSkImage(event, item.value)
                                    }
                                  ></iframe>
                                ) : null
                              }
                              visible={item.visiblePop}
                              trigger="hover"
                              onVisibleChange={visible =>
                                (item.visiblePop = visible)
                              }
                            >
                              <div
                                style={{
                                  textAlign: 'right',
                                  WebkitBoxPack: 'end',
                                  marginRight: 10,
                                  cursor: 'pointer',
                                }}
                              >
                                预览
                              </div>
                            </Popover>
                          </div>
                        </div>
                        <div style={{ display: 'flex', marginTop: 10 }}>
                          <div style={{ width: '65px', lineHeight: '30px' }}>
                            显示名称
                          </div>
                          <Input
                            style={{ width: '250px', marginLeft: '20px' }}
                            value={item.name || ''}
                            onChange={event => (item.name = event.target.value)}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : null}
              <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <Button
                  type="primary"
                  style={{ width: '200px' }}
                  onClick={event => this.modalDialogEditSumbit()}
                >
                  确定
                </Button>
              </div>
            </div>
          </Modal>
        </div>
        <PlayCoursePreiew />
        <ResUploadView />
        <PreviewResource resconfig={this.resconfig} />
      </div>
    );
  }
}
export default ResourceList;
