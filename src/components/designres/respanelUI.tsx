import React from 'react';
import HttpService from '@/server/httpServer';
import { connect } from 'dva';
import { CWResourceTypes } from '@/modelClasses/courseDetail/courseDetailenum';
import {
  Input,
  Button,
  Radio,
  Cascader,
  Pagination,
  Checkbox,
  Tooltip,
} from 'antd';
import ResItemUI from '@/components/designres/resItemUI';
import { observer } from 'mobx-react';
import { action, runInAction, observable } from 'mobx';
import CWResource from '@/modelClasses/courseDetail/cwResource';
import TypeMapHelper from '@/configs/typeMapHelper';
import antStyle from '@/styles/defaultAnt.less';
import { searchColor } from '@/svgs/designIcons';

const { Search } = Input;

enum SearchType {
  exact = 0,
  similar = 1,
}

export interface DicStructNode {
  id: number;
  title: string;
  voList: Array<DicStructNode>;
}

export function removeEmptyVoList(node: DicStructNode | any) {
  if (node) {
    if (node.voList != null && node.voList.length == 0) node.voList = null;
    else if (node.voList != null) {
      node.voList.forEach(subnode => removeEmptyVoList(subnode));
    }
  }
}

@observer
class LayoutResourcePanel extends React.Component<any> {
  constructor(props: React.Props<any>) {
    super(props);
  }

  //资源名称
  @observable
  keywords: string = '';
  //资源类型
  @observable
  resourceType: number = CWResourceTypes.Image;
  //图片目录Id
  @observable
  imageDirectoryId: any = null;
  //图片目录
  @observable
  imageDirectoryPath: any = null;
  //图片目录名称
  @observable
  imageDirectoryPathName: any = '';
  //音频目录Id
  @observable
  audioDirectoryId: any = null;
  //音频目录
  @observable
  audioDirectoryPath: any = null;
  //音频目录名称
  @observable
  audioDirectoryPathName: any = '';
  //视频目录Id
  @observable
  videoDirectoryId: any = null;
  //视频目录
  @observable
  videoDirectoryPath: any = null;
  //视频目录名称
  @observable
  videoDirectoryPathName: any = '';
  //动画目录Id
  @observable
  skeletalAniDirectoryId: any = null;
  //动画目录
  @observable
  skeletalAniDirectoryPath: any = null;
  //动画目录名称
  @observable
  skeletalAniDirectoryPathName: any = '';
  //字幕目录Id
  @observable
  captionsDirectoryId: any = null;
  //字幕目录
  @observable
  captionsDirectoryPath: any = null;
  //字幕目录名称
  @observable
  captionsDirectoryPathName: any = '';
  //搜索字幕音频
  @observable
  tencentSubTitle: boolean = false;
  //列表总数
  totalCounts: number = 0;
  //分页下标
  @observable
  pageIndex: number = 1;
  //分页数量
  pageSize: number = 20;
  //结果列表
  @observable
  resList: any;
  //资源类型
  @observable
  dicTypeMap: any;
  //资源类型与对应的目录结构
  @observable
  cascadeDic: any;

  //当前根目录
  @observable
  currentCascadeDicRoot: any = null;
  //当前目录ID
  @observable
  currentDirId: any = null;
  //当前目录
  @observable
  currentDirPath: any = null;
  //当前目录名称
  @observable
  currentDirPathName: any = '';

  //是否是查询我的收藏 0-否 1-是
  @observable
  queryMyCollect: number = 0;
  //是否是查询我的上传 0-否 1-是
  @observable
  queryMyUpload: number = 0;

  //收藏选项卡，默认全部
  @observable
  selectRadio: string = 'all';
  //鼠标是否移动到元素上
  @observable
  isMouse: boolean = false;
  //是否显示选择目录弹层
  @observable
  isShowCascader: boolean = false;
  @observable
  scrollDiv: any;

  //滚动到最上方
  scrollTop() {
    this.scrollDiv?.scrollTo(0, 0);
  }

  //加载资源类型
  @action loadDicTypeMapAsync = async () => {
    let data = await HttpService.fetchResDicTypeMap();
    runInAction(() => {
      if (data) {
        this.dicTypeMap = data;
      } else {
        this.dicTypeMap = [];
      }
    });
  };

  //加载资源类型与对应的目录结构
  @action loadResCascadeDicStructAsync = async () => {
    let data = await HttpService.fetchResDics();
    runInAction(() => {
      if (data) {
        data.forEach(x => removeEmptyVoList(x));
        this.cascadeDic = data;
      } else {
        this.cascadeDic = [];
      }
    });
  };

  //查询结果
  @action searchResAsync = async (
    resourceName: string,
    resourceType: number,
    directoryId: any,
    tencentSubTitle: boolean,
    queryMyCollect: number,
    queryMyUpload: number,
    pageIndex: number,
  ) => {
    let queryInfo = {
      pageNo: pageIndex,
      pageSize: this.pageSize,
      resourceType: resourceType == CWResourceTypes.All ? null : resourceType,
      directoryId: directoryId,
      field: 'updateTime',
      sort: 'desc',
      resourceName: resourceName,
      searchType: SearchType.similar,
      tencentSubTitle: tencentSubTitle ? 1 : null,
      queryMyCollect: queryMyCollect,
      queryMyUpload: queryMyUpload,
    };

    let data = null;
    if (queryInfo.resourceType == CWResourceTypes.ComplexControl) {
      let cwResouceList: Array<CWResource> = new Array<CWResource>();
      let subTypes = TypeMapHelper.ElementTypeDiscriminator.subTypes.filter(
        x => x.thumb,
      );
      if (queryInfo.resourceName) {
        subTypes = subTypes?.filter(
          p => p.title.indexOf(queryInfo.resourceName) > -1,
        );
      }
      subTypes.map(subType => {
        let cwResource = {
          resourceId: subType.name.toString(),
          resourceKey: subType.thumb,
          resourceName: subType.title,
          resourceType: CWResourceTypes.ComplexControl,
          width: subType.width,
          height: subType.height,
        };
        cwResouceList.push(cwResource as CWResource);
      });
      var start = queryInfo.pageSize * (queryInfo.pageNo - 1);
      var end = cwResouceList.length - start;
      data = {
        total: subTypes.length,
        list: cwResouceList.slice(
          start,
          start + (end < queryInfo.pageSize ? end : queryInfo.pageSize),
        ),
      };
    } else {
      data = await HttpService.queryResPage(queryInfo);
    }

    runInAction(() => {
      if (data) {
        this.resList = data?.list || [];
        this.totalCounts = data?.total || 0;
      } else {
        this.resList = [];
        this.totalCounts = 0;
      }
    });
  };

  //绑定目录数据
  bindCascadeData(resourceType: number) {
    if (this.dicTypeMap && this.cascadeDic) {
      //类型为控件
      if (resourceType == CWResourceTypes.ComplexControl) {
        this.currentCascadeDicRoot = null;
        this.currentDirId = null;
        this.currentDirPath = null;
        this.currentDirPathName = '';
      } else {
        //根目录编号
        let currentCascadeDicRootId = this.dicTypeMap?.find(
          map => map.type == resourceType,
        )?.directoryId;
        //根目录集合
        let currentCascadeDicRoot = this.cascadeDic?.find(
          dic => dic.id == currentCascadeDicRootId,
        );
        if (
          currentCascadeDicRoot &&
          currentCascadeDicRoot.voList &&
          currentCascadeDicRoot.voList[0].id != currentCascadeDicRoot.id
        ) {
          currentCascadeDicRoot.voList = [
            { id: currentCascadeDicRoot.id, title: '全部' },
            ...currentCascadeDicRoot.voList,
          ];
        }
        this.currentCascadeDicRoot = currentCascadeDicRoot;
        this.currentDirId = currentCascadeDicRoot?.id;
        this.currentDirPath = [currentCascadeDicRoot?.id];
        this.currentDirPathName = '';

        if (
          resourceType == CWResourceTypes.Image &&
          this.imageDirectoryId != null &&
          this.imageDirectoryPath != null
        ) {
          this.currentDirId = this.imageDirectoryId;
          this.currentDirPath = this.imageDirectoryPath;
          this.currentDirPathName = this.imageDirectoryPathName;
        } else if (
          resourceType == CWResourceTypes.Audio &&
          this.audioDirectoryId != null &&
          this.audioDirectoryPath != null
        ) {
          this.currentDirId = this.audioDirectoryId;
          this.currentDirPath = this.audioDirectoryPath;
          this.currentDirPathName = this.audioDirectoryPathName;
        } else if (
          resourceType == CWResourceTypes.Video &&
          this.videoDirectoryId != null &&
          this.videoDirectoryPath != null
        ) {
          this.currentDirId = this.videoDirectoryId;
          this.currentDirPath = this.videoDirectoryPath;
          this.currentDirPathName = this.videoDirectoryPathName;
        } else if (
          resourceType == CWResourceTypes.SkeletalAni &&
          this.skeletalAniDirectoryId != null &&
          this.skeletalAniDirectoryPath != null
        ) {
          this.currentDirId = this.skeletalAniDirectoryId;
          this.currentDirPath = this.skeletalAniDirectoryPath;
          this.currentDirPathName = this.skeletalAniDirectoryPathName;
        } else if (
          resourceType == CWResourceTypes.Captions &&
          this.captionsDirectoryId != null &&
          this.captionsDirectoryPath != null
        ) {
          this.currentDirId = this.captionsDirectoryId;
          this.currentDirPath = this.captionsDirectoryPath;
          this.currentDirPathName = this.captionsDirectoryPathName;
        }
      }
    }
  }

  async componentDidMount() {
    await this.loadDicTypeMapAsync();
    await this.loadResCascadeDicStructAsync();

    this.bindCascadeData(this.resourceType);
    if (this.dicTypeMap && this.cascadeDic) {
      //自动搜索全部
      this.searchResAsync(
        this.keywords,
        this.resourceType,
        this.currentDirId,
        this.tencentSubTitle,
        this.queryMyCollect,
        this.queryMyUpload,
        this.pageIndex,
      );
    }
  }

  render() {
    if (!this.dicTypeMap || !this.cascadeDic) {
      return <div>连接服务器失败</div>;
    }
    return (
      <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
        <div style={{ marginTop: '14px', marginLeft: '10px' }}>
          <Radio.Group
            className={antStyle.antRadioButton}
            value={this.resourceType}
            size="small"
            style={{ margin: 'auto auto', whiteSpace: 'nowrap' }}
            onChange={value => {
              this.scrollTop();
              this.tencentSubTitle = false;
              this.resourceType = value.target.value;
              this.bindCascadeData(this.resourceType);
              this.pageIndex = 1;
              this.searchResAsync(
                this.keywords,
                this.resourceType,
                this.currentDirId,
                this.tencentSubTitle,
                this.queryMyCollect,
                this.queryMyUpload,
                this.pageIndex,
              );
            }}
          >
            <Radio.Button value={CWResourceTypes.Image}>图片</Radio.Button>
            <Radio.Button value={CWResourceTypes.Audio}>音频</Radio.Button>
            <Radio.Button value={CWResourceTypes.Video}>视频</Radio.Button>
            <Radio.Button value={CWResourceTypes.SkeletalAni}>
              动画
            </Radio.Button>
            <Radio.Button value={CWResourceTypes.Captions}>字幕</Radio.Button>
            <Radio.Button value={CWResourceTypes.ComplexControl}>
              控件
            </Radio.Button>
          </Radio.Group>
        </div>
        {this.resourceType != CWResourceTypes.ComplexControl ? (
          <div
            style={{
              marginTop: '12px',
              marginLeft: '15px',
              width: '300px',
              display: 'flex',
            }}
          >
            <Radio.Group
              size="small"
              onChange={e => {
                this.scrollTop();
                this.selectRadio = e.target.value;
                if (e.target.value == 'all') {
                  this.queryMyCollect = 0;
                  this.queryMyUpload = 0;
                } else if (e.target.value == 'Collect') {
                  this.queryMyCollect = 1;
                  this.queryMyUpload = 0;
                } else if (e.target.value == 'Upload') {
                  this.queryMyCollect = 0;
                  this.queryMyUpload = 1;
                }
                this.pageIndex = 1;
                this.searchResAsync(
                  this.keywords,
                  this.resourceType,
                  this.currentDirId,
                  this.tencentSubTitle,
                  this.queryMyCollect,
                  this.queryMyUpload,
                  this.pageIndex,
                );
              }}
              value={this.selectRadio}
              optionType="button"
              buttonStyle="solid"
            >
              <Radio.Button
                style={{
                  //width: '113px',
                  textAlign: 'center',
                  borderRadius: '4px 0px 0px 4px',
                }}
                value="all"
              >
                全部
              </Radio.Button>
              <Radio.Button
                style={{
                  //width: '113px',
                  textAlign: 'center',
                }}
                value="Collect"
              >
                已收藏
              </Radio.Button>
              <Radio.Button
                style={{
                  //width: '113px',
                  textAlign: 'center',
                  borderRadius: '0px 4px 4px 0px',
                }}
                value="Upload"
              >
                已上传
              </Radio.Button>
            </Radio.Group>
            {this.resourceType == CWResourceTypes.Audio ? (
              <Checkbox
                style={{ marginLeft: '2px' }}
                checked={this.tencentSubTitle || false}
                onChange={val => {
                  this.tencentSubTitle = val.target.checked;
                  this.pageIndex = 1;
                  this.searchResAsync(
                    this.keywords,
                    this.resourceType,
                    this.currentDirId,
                    this.tencentSubTitle,
                    this.queryMyCollect,
                    this.queryMyUpload,
                    this.pageIndex,
                  );
                }}
              >
                搜索字幕音频
              </Checkbox>
            ) : null}
          </div>
        ) : null}

        <div
          style={{
            marginTop: '8px',
            marginLeft: '15px',
            width: '100%',
            display: 'flex',
          }}
          className={antStyle.antCollectCommon}
        >
          {this.resourceType != CWResourceTypes.ComplexControl ? (
            <div style={{ width: '24px' }}>
              <Cascader
                placeholder="选择目录"
                size="small"
                changeOnSelect={true}
                popupVisible={this.isShowCascader}
                onChange={(value, selectedOptions) => {
                  this.currentDirPath = value;
                  this.currentDirId = value[value.length - 1];
                  this.currentDirPathName = '';

                  //如果选择的目录没有子目录，选择此目录后就隐藏弹框
                  if (
                    selectedOptions[selectedOptions.length - 1].voList == null
                  ) {
                    this.isShowCascader = !this.isShowCascader;
                  }
                  //冒泡显示选择目录的路径名称
                  if (
                    this.currentCascadeDicRoot?.voList[0].id !=
                    this.currentDirPath
                  ) {
                    selectedOptions?.map(
                      x => (this.currentDirPathName += x.title + '/'),
                    );
                    this.currentDirPathName = this.currentDirPathName.substr(
                      0,
                      this.currentDirPathName.length - 1,
                    );
                  }

                  if (this.resourceType == CWResourceTypes.Image) {
                    this.imageDirectoryId = this.currentDirId;
                    this.imageDirectoryPath = this.currentDirPath;
                    this.imageDirectoryPathName = this.currentDirPathName;
                  } else if (this.resourceType == CWResourceTypes.Audio) {
                    this.audioDirectoryId = this.currentDirId;
                    this.audioDirectoryPath = this.currentDirPath;
                    this.audioDirectoryPathName = this.currentDirPathName;
                  } else if (this.resourceType == CWResourceTypes.Video) {
                    this.videoDirectoryId = this.currentDirId;
                    this.videoDirectoryPath = this.currentDirPath;
                    this.videoDirectoryPathName = this.currentDirPathName;
                  } else if (this.resourceType == CWResourceTypes.SkeletalAni) {
                    this.skeletalAniDirectoryId = this.currentDirId;
                    this.skeletalAniDirectoryPath = this.currentDirPath;
                    this.skeletalAniDirectoryPathName = this.currentDirPathName;
                  } else if (this.resourceType == CWResourceTypes.Captions) {
                    this.captionsDirectoryId = this.currentDirId;
                    this.captionsDirectoryPath = this.currentDirPath;
                    this.captionsDirectoryPathName = this.currentDirPathName;
                  }
                  this.pageIndex = 1;
                  this.searchResAsync(
                    this.keywords,
                    this.resourceType,
                    this.currentDirId,
                    this.tencentSubTitle,
                    this.queryMyCollect,
                    this.queryMyUpload,
                    this.pageIndex,
                  );
                }}
                options={this.currentCascadeDicRoot?.voList}
                bordered={false}
                allowClear={false}
                value={this.currentDirPath}
                fieldNames={{ label: 'title', value: 'id', children: 'voList' }}
                style={{
                  visibility: 'hidden',
                  background: 'transparent',
                  display:
                    this.currentCascadeDicRoot != null ? 'block' : 'none',
                  position: 'absolute',
                }}
              />
              <Tooltip
                mouseEnterDelay={0.5}
                placement="top"
                title={this.currentDirPathName}
              >
                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    background: '#FFFFFF',
                    borderRadius: '4px',
                    border: this.isMouse
                      ? '1px solid #8DC8FEFF'
                      : '1px solid #B9B9B9',
                    backgroundColor: this.isMouse
                      ? 'transparent'
                      : this.currentCascadeDicRoot?.voList[0].id !=
                        this.currentDirPath
                      ? '#1D91FCFF'
                      : this.currentCascadeDicRoot?.voList[0].id !=
                        this.currentDirPath
                      ? '1px solid #1D91FCFF'
                      : 'transparent',
                  }}
                  onMouseEnter={() => (this.isMouse = true)}
                  onMouseLeave={() => (this.isMouse = false)}
                  onClick={() => {
                    this.isShowCascader = !this.isShowCascader;
                  }}
                >
                  <div
                    style={{
                      marginLeft: '4px',
                      marginTop: '2px',
                      width: '14px',
                      height: '14px',
                      cursor: 'pointer',
                    }}
                  >
                    {searchColor(
                      this.isMouse
                        ? '#8DC8FEFF'
                        : this.currentCascadeDicRoot?.voList[0].id !=
                          this.currentDirPath
                        ? '#D0E8FEFF'
                        : '#989897FF',
                    )}
                  </div>
                </div>
              </Tooltip>
            </div>
          ) : null}
          <Search
            className={antStyle.antCollectSearch}
            placeholder="搜索关键字"
            onChange={e => {
              this.keywords = e.target.value;
            }}
            onSearch={value => {
              this.pageIndex = 1;
              this.keywords = value;
              this.searchResAsync(
                this.keywords,
                this.resourceType,
                this.currentDirId,
                this.tencentSubTitle,
                this.queryMyCollect,
                this.queryMyUpload,
                this.pageIndex,
              );
            }}
            style={{
              width: '214px',
              height: '24px',
              marginLeft:
                this.resourceType != CWResourceTypes.ComplexControl
                  ? '3px'
                  : '0px',
            }}
            allowClear
          />
        </div>
        <div
          ref={x => (this.scrollDiv = x)}
          className="scrollableView"
          style={{
            overflowY: 'auto',
            position: 'absolute',
            width: '100%',
            top:
              this.resourceType == CWResourceTypes.ComplexControl
                ? '75px'
                : '110px',
            bottom: '40px',
            //left:'15px',
            display: 'flex',
            textAlign: 'center',
            padding: '20px, 0px,0px,0px',
            //background:'red'
          }}
          // onLoad={e => {
          //   e.currentTarget?.scrollTo(0, 0);
          // }}
        >
          {this.resList && this.resList.length > 0 ? (
            <div style={{ marginLeft: '15px' }}>
              {this.resList.map((item, i) => {
                return (
                  <ResItemUI
                    onChange={() => {
                      this.searchResAsync(
                        this.keywords,
                        this.resourceType,
                        this.currentDirId,
                        this.tencentSubTitle,
                        this.queryMyCollect,
                        this.queryMyUpload,
                        this.pageIndex,
                      );
                    }}
                    key={i}
                    data={item}
                    fatherList={this.resList}
                  />
                );
              })}
            </div>
          ) : (
            <div
              style={{
                width: '100%',
                height: '100%',
                fontSize: '12px',
                display: '-webkit-box',
                WebkitBoxAlign: 'center',
                WebkitBoxPack: 'center',
                WebkitBoxOrient: 'vertical',
              }}
            >
              <div
                style={{
                  width: '120px',
                  height: '80px',
                  background: `url(${require('@/assets/no_sucai_icon.svg')})`,
                  backgroundSize: '100% 100%',
                }}
              ></div>
              <div style={{ color: '#666666' }}>{'系统中还没有素材'}</div>
              <div style={{ color: '#999999' }}>{'请先将资源上传至系统中'}</div>
            </div>
          )}
        </div>

        <Pagination
          className={antStyle.antPagination}
          style={{
            position: 'absolute',
            bottom: '10px',
            left: '10px',
            right: '10px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textAlign: 'center',
          }}
          responsive
          showLessItems
          hideOnSinglePage
          showSizeChanger={false}
          pageSize={this.pageSize}
          total={this.totalCounts}
          current={this.pageIndex}
          onChange={value => {
            this.scrollTop();
            this.pageIndex = value;
            this.searchResAsync(
              this.keywords,
              this.resourceType,
              this.currentDirId,
              this.tencentSubTitle,
              this.queryMyCollect,
              this.queryMyUpload,
              this.pageIndex,
            );
          }}
        />
      </div>
    );
  }
}

export default LayoutResourcePanel;
