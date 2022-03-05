import { observable, action, runInAction } from 'mobx';
import React from 'react';
import {
  Modal,
  Radio,
  Table,
  message,
  Carousel,
  Row,
  Col,
  Statistic,
  Button,
  InputNumber,
} from 'antd';
import { inject, observer } from 'mobx-react';
import { classToPlain } from '@/class-transformer';
import CWResource from '@/modelClasses/courseDetail/cwResource';
import CWPage from '@/modelClasses/courseDetail/cwpage';
import CacheHelper from '@/utils/cacheHelper';
import { CWResourceTypes } from '@/modelClasses/courseDetail/courseDetailenum';
import { reaction } from 'mobx';
import copy from 'copy-to-clipboard';
import ReactEcharts from 'echarts-for-react';
import Tabs from 'antd/lib/tabs';
import InvokableBase from '@/modelClasses/courseDetail/InvokableBase';
import HttpService from '@/server/httpServer';
export class StatisticEntity {
  @observable
  visible: boolean = false;
  statisticresources: CWResource[];
  invokeablesCount: number;
}

const { TabPane } = Tabs;
@observer
export class StatisticPanel extends React.Component<any, any> {
  constructor(props) {
    super(props);
  }

  @observable
  private sourceTable: Array<CWResource>;
  private pageAllSource: Array<CWResource>;

  @observable
  private currentSize: number;
  @observable
  private allSize: number;
  getOption = (texttitle: string, seriesdataMode: number = 0) => {
    let seriesdata;
    if (seriesdataMode == 1) {
      let imageSize = 0;
      let skSize = 0;
      let audioSize = 0;
      let videoSize = 0;
      let captionSize = 0;
      let fontSize = 0;
      let otherSize = 0;
      this.pageAllSource.forEach(item => {
        switch (item.resourceType) {
          case CWResourceTypes.Audio:
            audioSize += item.resourceSize;
            break;
          case CWResourceTypes.Captions:
            captionSize += item.resourceSize;
            break;
          case CWResourceTypes.Image:
            imageSize += item.resourceSize;
            break;
          case CWResourceTypes.SkeletalAni:
            skSize += item.resourceSize;
            break;
          case CWResourceTypes.Video:
            videoSize += item.resourceSize;
            break;
          case CWResourceTypes.Font:
            fontSize += item.resourceSize;
            break;
          default:
            otherSize += item.resourceSize;
            break;
        }
      });
      seriesdata = [
        {
          value: imageSize,
          name: this.convertToCwResourceTypeToZh_Cn(CWResourceTypes.Image),
        },
        {
          value: skSize,
          name: this.convertToCwResourceTypeToZh_Cn(
            CWResourceTypes.SkeletalAni,
          ),
        },
        {
          value: audioSize,
          name: this.convertToCwResourceTypeToZh_Cn(CWResourceTypes.Audio),
        },
        {
          value: videoSize,
          name: this.convertToCwResourceTypeToZh_Cn(CWResourceTypes.Video),
        },
        {
          value: fontSize,
          name: this.convertToCwResourceTypeToZh_Cn(CWResourceTypes.Font),
        },
        {
          value: captionSize,
          name: this.convertToCwResourceTypeToZh_Cn(CWResourceTypes.Captions),
        },
        { value: otherSize, name: this.convertToCwResourceTypeToZh_Cn(null) },
      ];
    } else if (seriesdataMode == 0) {
      seriesdata = [
        {
          value: this.pageAllSource.filter(
            p => p.resourceType == CWResourceTypes.Image,
          ).length,
          name: this.convertToCwResourceTypeToZh_Cn(CWResourceTypes.Image),
        },
        {
          value: this.pageAllSource.filter(
            p => p.resourceType == CWResourceTypes.SkeletalAni,
          ).length,
          name: this.convertToCwResourceTypeToZh_Cn(
            CWResourceTypes.SkeletalAni,
          ),
        },
        {
          value: this.pageAllSource.filter(
            p => p.resourceType == CWResourceTypes.Audio,
          ).length,
          name: this.convertToCwResourceTypeToZh_Cn(CWResourceTypes.Audio),
        },
        {
          value: this.pageAllSource.filter(
            p => p.resourceType == CWResourceTypes.Video,
          ).length,
          name: this.convertToCwResourceTypeToZh_Cn(CWResourceTypes.Video),
        },
        {
          value: this.pageAllSource.filter(
            p => p.resourceType == CWResourceTypes.Font,
          ).length,
          name: this.convertToCwResourceTypeToZh_Cn(CWResourceTypes.Font),
        },
        {
          value: this.pageAllSource.filter(
            p => p.resourceType == CWResourceTypes.Captions,
          ).length,
          name: this.convertToCwResourceTypeToZh_Cn(CWResourceTypes.Captions),
        },
      ];
    }

    let option = {
      title: {
        text: '当前' + texttitle + '图形分析',
        x: 'center',
      },
      tooltip: {
        trigger: 'item',
        //提示框浮层内容格式器，支持字符串模板和回调函数形式。
        //formatter: "{a} <br/>{b} : {c} ({d}%)"
        formatter: function(params) {
          let value = params.value;
          if (seriesdataMode == 1) value = CacheHelper.ConvertSize(value);
          return (
            params.seriesName +
            ':' +
            '<br/>' +
            value +
            '(' +
            params.percent +
            '%)'
          );
        },
      },
      legend: {
        orient: 'horizontal',
        x: 'center',
        y: 'bottom',
        data: [
          this.convertToCwResourceTypeToZh_Cn(CWResourceTypes.Image),
          this.convertToCwResourceTypeToZh_Cn(CWResourceTypes.SkeletalAni),
          this.convertToCwResourceTypeToZh_Cn(CWResourceTypes.Audio),
          this.convertToCwResourceTypeToZh_Cn(CWResourceTypes.Video),
          this.convertToCwResourceTypeToZh_Cn(CWResourceTypes.Font),
          this.convertToCwResourceTypeToZh_Cn(CWResourceTypes.Captions),
        ],
      },
      series: [
        {
          name: '资源' + texttitle,
          type: 'pie',
          data: seriesdata,
        },
      ],
    };
    return option;
  };

  convertToCwResourceTypeToZh_Cn(type: CWResourceTypes) {
    switch (type) {
      case CWResourceTypes.Audio:
        return '音频';
      case CWResourceTypes.Captions:
        return '字幕';
      case CWResourceTypes.Image:
        return '图片';
      case CWResourceTypes.SkeletalAni:
        return '动画';
      case CWResourceTypes.Video:
        return '视频';
      case CWResourceTypes.Font:
        return '字体';
      default:
        return '其他';
    }
  }

  seachResouceAll() {
    const { statisticprops } = this.props;
    this.pageAllSource = statisticprops.statisticresources;
    this.allSize = 0;
    this.pageAllSource.forEach(item => {
      this.allSize += item.resourceName
        ? Number(item.resourceSize ? item.resourceSize : 0)
        : 0;
    });
  }

  @observable
  private tabType: any = CWResourceTypes.All;

  //可查询最小类别
  searchResourceType(event: any) {
    this.tabType = event;
    this.sourceTable = new Array<CWResource>();
    let page = this.pageAllSource;
    this.currentSize = 0;
    if (page) {
      if (CWResourceTypes.All != event) {
        page = page.filter(p => p.resourceType == event);
      }
      for (let index = 0; index < page.length; index++) {
        var resouce = this.sourceTable.filter(
          p => p.resourceId == page[index].resourceId,
        );
        this.currentSize += page[index].resourceName
          ? Number(page[index].resourceSize)
          : 0;
        if (resouce && resouce.length > 0) {
          resouce[0].referenceCount += 1;
        } else {
          if (page[index].resourceType != CWResourceTypes.Font)
            page[index].referenceCount = 1;
          else if (!page[index].referenceCount) page[index].referenceCount = 1;
          this.sourceTable.push(page[index]);
        }
      }
    }
  }

  outResouceUrlClick(event: any) {
    if (this.sourceTable && this.sourceTable) {
      copy(JSON.stringify(this.sourceTable));
      message.success('资源信息导出完成');
    }
  }

  private lastvisible: boolean = false;
  protected visibleChanged = reaction(
    () => this.props.statisticprops?.visible,
    visible => {
      if (visible) {
        this.seachResouceAll();
        this.searchResourceType(this.tabType);
      }
    },
  );

  @observable
  private setVisible: boolean = false;

  // 资源原本数据
  @observable
  private RecordData: any = null;

  @observable
  private newRecordData: any = null;

  @observable
  private volume: number = 0;

  @observable
  private isOpenPreview: boolean = false;

  @observable
  private checkLoading: boolean = false;

  @observable
  private replaceLoading: boolean = false;

  @observable
  private prviewData: any = null;

  // 音频预览
  renderPrivew = () => {
    return (
      <Modal
        title={this.prviewData?.resourceName}
        width={800}
        centered
        visible={this.isOpenPreview}
        onCancel={() => {
          this.isOpenPreview = false;
        }}
        footer={null}
        maskClosable={false}
        destroyOnClose={true}
      >
        <div
          style={{
            background: '#333333',
            height: 520,
            WebkitBoxPack: 'justify',
            display: '-webkit-box',
            WebkitBoxOrient: 'horizontal',
            position: 'relative',
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: '10px',
              top: '10px',
              right: '10px',
              bottom: '10px',
            }}
          >
            <img
              src={require('@/assets/mp3_icon.png')}
              style={{
                width: '100%',
                height: '90%',
                objectFit: 'contain',
              }}
            ></img>
            <audio
              autoPlay={true}
              controls={true}
              controlsList="nodownload"
              src={
                this.prviewData?.outResourceKey
                  ? this.prviewData?.outResourceKey
                  : this.prviewData?.resourceKey
              }
              style={{
                width: '100%',
                height: '50px',
                objectFit: 'contain',
                position: 'absolute',
                left: 0,
                bottom: 0,
              }}
            ></audio>
          </div>
        </div>
      </Modal>
    );
  };

  renderModal = () => {
    return (
      <Modal
        title="音频设置"
        visible={this.setVisible}
        destroyOnClose={true}
        onCancel={() => {
          this.setVisible = false;
          this.volume = 0;
          this.RecordData = null;
          this.newRecordData = null;
          this.prviewData = null;
        }}
        footer={null}
        maskClosable={false}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <label>音量大小：</label>
            <InputNumber
              onChange={this.handleChange}
              value={this.volume}
              min={-100}
              max={100}
              formatter={this.limitNumber}
              parser={this.limitNumber}
              style={{ width: 100, marginRight: 5 }}
            />
            <span style={{ marginRight: 15 }}>DB</span>
            <Button
              type="primary"
              size="small"
              loading={this.checkLoading}
              onClick={this.hanldeBrushVolume}
            >
              确定
            </Button>
          </div>
          <div style={{ marginTop: 10 }}>
            <label>原始音频：</label>
            <a
              style={{ width: 50 }}
              onClick={() => {
                this.isOpenPreview = true;
                this.prviewData = this.RecordData;
              }}
            >
              播放
            </a>
          </div>
          {this.newRecordData && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                marginTop: 10,
              }}
            >
              <div>
                <label>修改后音频：</label>
                <a
                  style={{ width: 50 }}
                  onClick={() => {
                    this.isOpenPreview = true;
                    this.prviewData = this.newRecordData;
                  }}
                >
                  播放
                </a>
              </div>
              <div style={{ marginTop: 10 }}>
                <Button
                  onClick={this.handleReplace}
                  loading={this.replaceLoading}
                  type="primary"
                  size="small"
                >
                  确认替换
                </Button>
              </div>
            </div>
          )}
        </div>
      </Modal>
    );
  };

  // 修改音量大小
  @action hanldeBrushVolume = async () => {
    this.checkLoading = true;
    const { id, resourceId, resourceKey, resourceName } = this.RecordData;
    const params = {
      id,
      resourceId,
      resourceKey,
      resourceName,
      volume: this.volume,
    };
    const data = await HttpService.brushAudieVolume(params);
    runInAction(() => {
      if (data && Object.keys(data).length > 0) {
        this.newRecordData = data;
        this.checkLoading = false;
        message.success('修改成功');
      } else {
        this.checkLoading = false;
        message.warn('提交异常，请重试');
      }
    });
  };

  //替换音频资源
  @action handleReplace = async () => {
    this.replaceLoading = true;
    const { id, resourceId, outResourceKey, resourceName } = this.newRecordData;
    const params = {
      id,
      resourceId,
      resourceKey: outResourceKey,
      resourceName,
      volume: this.volume,
    };
    const data = await HttpService.replaceVolume(params);
    runInAction(() => {
      if (data && Object.keys(data).length > 0) {
        this.replaceLoading = false;
        message.success('替换成功, 请重新进行资源上架操作');
        this.amendFlag = true;
      } else {
        this.replaceLoading = false;
        message.warn('修改异常，请重试');
      }
    });
  };

  handleChange = e => {
    this.volume = e;
  };

  handleSet = record => {
    this.setVisible = true;
    this.RecordData = record;
  };

  // 刷新数据
  handleRefresh = () => {
    const { refresh } = this.props;
    if (refresh) {
      refresh();
      this.seachResouceAll();
      this.searchResourceType(this.tabType);
      if (this.amendFlag) {
        this.disabled = false;
      }
    }
  };

  limitNumber = value => {
    if (typeof value === 'string') {
      return value.split('.')[0];
    } else if (typeof value === 'number') {
      return String(value).split('.')[0];
    } else {
      return '';
    }
  };

  // 提交修改资源限制
  @observable
  private disabled: boolean = true;

  // 是否修改过的标志
  @observable
  private amendFlag: boolean = false;

  // 提交修改方法
  handeSumit = () => {
    const { submit } = this.props;
    if (submit && this.amendFlag) {
      submit();
    } else {
      message.info('您未修改资源');
    }
  };

  render() {
    const columns: any = [
      {
        title: '资源名称',
        dataIndex: 'resourceName',
        key: 'resourceName',
        width: '40%',
        render: (text, record: CWResource) => (
          <div
            style={{
              color: '#666666',
              display: '-webkit-box',
              WebkitBoxOrient: 'horizontal',
              WebkitBoxPack: 'start',
            }}
          >
            <span style={{ color: '#1D91FC' }}>
              [{this.convertToCwResourceTypeToZh_Cn(record.resourceType)}]
            </span>
            <div
              style={{
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                width: '400px',
                overflow: 'hidden',
              }}
            >
              {record.resourceName ? (
                record.resourceName
              ) : (
                <span style={{ color: 'green' }}>文字图</span>
              )}
            </div>
          </div>
        ),
      },
      {
        title: '尺寸',
        dataIndex: 'resourceSize',
        key: 'resourceSize',
        width: '10%',
        defaultSortOrder: 'descend',
        sorter: (a, b) => a.resourceSize - b.resourceSize,
        render: (text, record: CWResource) => (
          <label>
            {record.resourceName
              ? CacheHelper.ConvertSize(record.resourceSize)
              : '无'}
          </label>
        ),
      },
      {
        title: '引用数',
        dataIndex: 'referenceCount',
        key: 'referenceCount',
        width: '12%',
        render: (text, record: CWResource) => {
          return (
            <div style={{ display: 'flex' }}>
              <label style={{ marginLeft: 15 }}>{record.referenceCount}</label>
              {record.resourceType == 1 &&
                this.props.showSet && [
                  <a
                    style={{ paddingLeft: 10 }}
                    onClick={() => this.handleSet(record)}
                    key="1"
                  >
                    设置
                  </a>,

                  <a
                    onClick={() => {
                      this.isOpenPreview = true;
                      this.prviewData = record;
                    }}
                    style={{ marginLeft: 15 }}
                    key="2"
                  >
                    播放
                  </a>,
                ]}
            </div>
          );
        },
      },
    ];
    const { statisticprops } = this.props;

    let invokableCount = statisticprops ? statisticprops.invokeablesCount : 0;
    return (
      <div className="previewWindow" style={{ position: 'absolute' }}>
        <Modal
          style={{ padding: '0px' }}
          width={1280}
          title={'课件资源统计'}
          centered
          visible={statisticprops?.visible}
          footer={null}
          maskClosable={false}
          destroyOnClose={true}
          onCancel={() => {
            statisticprops.visible = false;
            this.amendFlag = false;
            this.disabled = true;
          }}
        >
          {this.props.showSet && [
            <a
              onClick={this.handleRefresh}
              style={{ position: 'absolute', top: 17, right: 110 }}
              key="1"
            >
              刷新
            </a>,
            <div style={{ position: 'absolute', top: 10, right: 200 }} key="2">
              <Button
                onClick={this.handeSumit}
                type="primary"
                disabled={this.disabled}
              >
                提交修改
              </Button>
              <span style={{ color: 'red', marginLeft: 5 }}>
                (提示：提交前请先刷新)
              </span>
            </div>,
          ]}

          <div
            style={{
              height: 720,
              width: 1280,
              marginLeft: -24,
              marginTop: -24,
              marginBottom: -24,
              display: 'flex',
            }}
          >
            <div
              style={{
                width: 500,
                height: 600,
                marginLeft: '10px',
                marginTop: '10px',
              }}
            >
              <Tabs defaultActiveKey="1">
                <TabPane tab="按数量统计" key="1">
                  <div>
                    {this.pageAllSource ? (
                      <ReactEcharts
                        option={this.getOption('数量', 0)}
                        style={{ width: 450, height: 400 }}
                      />
                    ) : null}
                    <div style={{ marginTop: '15px', marginLeft: '35px' }}>
                      <Row gutter={16}>
                        <Col>
                          <Statistic
                            title="当前类型数量"
                            valueStyle={{ textAlign: 'center' }}
                            value={
                              this.sourceTable ? this.sourceTable.length : 0
                            }
                          />
                        </Col>
                        <Col>
                          <Statistic
                            title="执行器数量："
                            valueStyle={{ textAlign: 'center' }}
                            value={invokableCount || 0}
                          />
                        </Col>
                        <Col>
                          <Statistic
                            title="总资源数量"
                            valueStyle={{ textAlign: 'center' }}
                            value={
                              this.pageAllSource ? this.pageAllSource.length : 0
                            }
                          />
                        </Col>
                      </Row>
                    </div>
                  </div>
                </TabPane>
                <TabPane tab="按资源大小统计" key="2">
                  <div>
                    {this.pageAllSource ? (
                      <ReactEcharts
                        option={this.getOption('文件大小', 1)}
                        style={{ width: 450, height: 400 }}
                      />
                    ) : null}
                    <div style={{ marginTop: '15px', marginLeft: '35px' }}>
                      <Row gutter={16}>
                        <Col>
                          <Statistic
                            title="当前类型文件大小"
                            valueStyle={{ textAlign: 'center' }}
                            value={CacheHelper.ConvertSize(this.currentSize)}
                          />
                        </Col>
                        <Col>
                          <Statistic
                            title="执行器数量："
                            valueStyle={{ textAlign: 'center' }}
                            value={invokableCount || 0}
                          />
                        </Col>
                        <Col>
                          <Statistic
                            title="总文件大小"
                            valueStyle={{ textAlign: 'center' }}
                            value={CacheHelper.ConvertSize(this.allSize)}
                          />
                        </Col>
                      </Row>
                    </div>
                  </div>
                </TabPane>
              </Tabs>
            </div>
            <div style={{ width: 780 }}>
              <div
                style={{
                  margin: 10,
                  display: 'flex',
                  position: 'relative',
                  width: '100%',
                }}
              >
                <Radio.Group
                  onChange={event =>
                    this.searchResourceType(event.target.value)
                  }
                  defaultValue={CWResourceTypes.All}
                  buttonStyle="solid"
                >
                  <Radio.Button value={CWResourceTypes.All}>
                    全部类型
                  </Radio.Button>
                  <Radio.Button value={CWResourceTypes.Image}>
                    图片
                  </Radio.Button>
                  <Radio.Button value={CWResourceTypes.SkeletalAni}>
                    动画
                  </Radio.Button>
                  <Radio.Button value={CWResourceTypes.Video}>
                    视频
                  </Radio.Button>
                  <Radio.Button value={CWResourceTypes.Audio}>
                    音频
                  </Radio.Button>
                  <Radio.Button value={CWResourceTypes.Font}>字体</Radio.Button>
                  <Radio.Button value={CWResourceTypes.Captions}>
                    字幕
                  </Radio.Button>
                </Radio.Group>

                {CacheHelper.UserInfo?.permission?.indexOf('JSON_RESOURCE') !=
                -1 ? (
                  <div style={{ position: 'absolute', right: 50, top: 1 }}>
                    <Button
                      type="primary"
                      size="small"
                      onClick={event => this.outResouceUrlClick(event)}
                    >
                      导出当前元素数据
                    </Button>
                  </div>
                ) : null}
              </div>
              {this.sourceTable ? (
                <Table
                  style={{ margin: '10px' }}
                  scroll={{ y: 600 }}
                  rowKey={record => record.resourceId}
                  columns={columns}
                  dataSource={this.sourceTable}
                  pagination={false}
                />
              ) : null}
            </div>
          </div>
        </Modal>
        {this.renderModal()}
        {this.renderPrivew()}
      </div>
    );
  }
}
