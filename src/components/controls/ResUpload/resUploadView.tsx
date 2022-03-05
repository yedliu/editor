import { Component, PureComponent } from 'react';
import React from 'react';
import { Modal, Tabs, Checkbox, Button, Cascader, message } from 'antd';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import { UploadIcon } from '@/svgs/designIcons';
import {
  imgTypeName,
  audioTypeName,
  videoTypeName,
  skTypeName,
  smallFileSize,
  UploadState,
  captionsTypeName,
  UploadFileInfo,
} from '@/modelClasses/resUpload/uploadFileInfo';
import ResUploadItemView from './resUploadItemView';
import chardet from 'chardet';
import { number } from 'prop-types';
import ErrorBoundary from 'antd/lib/alert/ErrorBoundary';

@observer
export class UploadAreaFoot extends PureComponent<{
  uploadFileInfos: UploadFileInfo[];
  type: string;
  fatherView: UploadListArea;
}> {
  static _canUpalod: boolean = true;

  static get canUpalod(): boolean {
    return this._canUpalod;
  }

  static set canUpalod(v: boolean) {
    this._canUpalod = v;
  }

  startUpload(type: string) {
    var uploadFileInfos = this.props.uploadFileInfos;
    var type = this.props.type;
    uploadFileInfos?.forEach(x => x.tryStartUpload());
  }
  render() {
    var uploadFileInfos = this.props.uploadFileInfos;
    var type = this.props.type;
    var fatherView = this.props.fatherView;
    var dic = UploadFileInfo.ResDics;
    var currentRootDicId = UploadFileInfo.ResTypeMap?.find(
      x => x.type == UploadFileInfo.getResType(type),
    )?.directoryId;
    var typeRootDic = dic?.find(x => x.id == currentRootDicId);

    var isUploading =
      uploadFileInfos.find(x => x.State == UploadState.Uploading) != null;
    return (
      <div
        className="uploadFootLine"
        style={{
          height: '50px',
          width: '100%',
          position: 'relative',
          boxShadow: '0px -1px 5px 2px #6666663F',
          background: '#F6F6F6',
          borderRadius: '0px 0px 4px 4px',
          fontSize: '12px',
          opacity: isUploading ? '0' : '1',
        }}
      >
        {uploadFileInfos.find(x => x.IsSelected) != null ? (
          <div
            style={{
              display: '-webkit-box',
              WebkitBoxPack: 'justify',
              WebkitBoxAlign: 'center',
              WebkitBoxOrient: 'horizontal',
              height: '100%',
            }}
          >
            <div
              style={{
                display: '-webkit-box',
                WebkitBoxPack: 'justify',
                WebkitBoxAlign: 'center',
                WebkitBoxOrient: 'horizontal',
              }}
            >
              <div
                style={{
                  width: '100px',
                  marginLeft: '10px',
                  position: 'relative',
                }}
              >
                <Cascader
                  //placeholder="选择目录"
                  changeOnSelect={false}
                  expandTrigger="hover"
                  displayRender={labels =>
                    labels && labels.length > 0
                      ? labels[labels.length - 1]
                      : null
                  }
                  options={typeRootDic ? [...typeRootDic.voList] : null}
                  bordered={false}
                  allowClear={false}
                  value={null}
                  popupVisible={fatherView.isShowDirSelector}
                  onChange={(value, selectedOptions) => {
                    if (value && value.length > 0)
                      uploadFileInfos
                        .filter(x => x.IsSelected)
                        .forEach(info => {
                          info.DirPath = value?.map(x => Number(x));
                          info.IsSelected = false;
                        });
                    fatherView.isShowDirSelector = false;
                  }}
                  onPopupVisibleChange={v => {
                    if (!v) fatherView.isShowDirSelector = false;
                  }}
                  fieldNames={{
                    label: 'title',
                    value: 'id',
                    children: 'voList',
                  }}
                  style={{
                    background: 'transparent',
                    position: 'absolute',
                    width: '100%',
                    display: fatherView.isShowDirSelector ? 'inline' : 'none',
                    opacity: '0',
                  }}
                />
                <Button
                  type="primary"
                  style={{ width: '100%' }}
                  onClick={e => {
                    fatherView.isShowDirSelector = true;
                  }}
                >
                  设置类目
                </Button>
              </div>

              <Button
                type="default"
                style={{ width: '100px', marginLeft: '10px' }}
                onClick={() => {
                  var list = uploadFileInfos;
                  var selectedFileInfos = list.filter(x => x.IsSelected);
                  selectedFileInfos.forEach(x =>
                    UploadFileInfo.DelUploadFileInfos(list, x),
                  );
                }}
              >
                删除
              </Button>
            </div>
            <Button
              type="default"
              style={{ width: '100px', marginRight: '10px' }}
              onClick={() => {
                uploadFileInfos.forEach(x => (x.IsSelected = false));
              }}
            >
              取消选中
            </Button>
          </div>
        ) : (
          <div
            style={{
              display: '-webkit-box',
              WebkitBoxPack: 'center',
              WebkitBoxAlign: 'center',
              height: '100%',
            }}
          >
            <Button
              type="primary"
              style={{ width: '245px' }}
              onClick={() => {
                this.startUpload(type);
              }}
            >
              上传素材
            </Button>
          </div>
        )}
      </div>
    );
  }
}

@observer
export class UploadAreaHead extends PureComponent<{
  uploadFileInfos: UploadFileInfo[];
  type: string;
  fatherView: UploadListArea;
}> {
  render() {
    var uploadFileInfos = this.props.uploadFileInfos;
    var type = this.props.type;
    var isUploading =
      uploadFileInfos?.find(x => x.State == UploadState.Uploading) != null;
    return (
      <div
        className="uploadConfigLine"
        style={{
          height: '30px',
          width: '100%',
          position: 'relative',
          opacity: isUploading ? '0' : '1',
          display: '-webkit-box',
          WebkitBoxOrient: 'horizontal',
          WebkitBoxAlign: 'center',
          WebkitBoxPack: 'start',
        }}
      >
        <Checkbox
          style={{ marginLeft: '7px', marginTop: '3px' }}
          checked={uploadFileInfos.find(x => !x.IsSelected) == null}
          onChange={e =>
            uploadFileInfos.forEach(x => (x.IsSelected = e.target.checked))
          }
        >
          全选
        </Checkbox>
        {uploadFileInfos.find(x => x.State == UploadState.Complete) ? (
          <Button
            style={{ marginLeft: '6px' }}
            size="small"
            onClick={() => {
              uploadFileInfos
                .filter(x => x.State == UploadState.Complete)
                .forEach(x =>
                  UploadFileInfo.DelUploadFileInfos(uploadFileInfos, x),
                );
            }}
          >
            清除所有成功上传
          </Button>
        ) : null}
        {uploadFileInfos.find(x => x.State == UploadState.Error) ? (
          <Button
            style={{ marginLeft: '6px' }}
            size="small"
            onClick={() => {
              uploadFileInfos
                .filter(x => x.State == UploadState.Error)
                .forEach(x =>
                  UploadFileInfo.DelUploadFileInfos(uploadFileInfos, x),
                );
            }}
          >
            清除所有错误上传
          </Button>
        ) : null}
      </div>
    );
  }
}

@observer
export class UploadListArea extends PureComponent<{
  uploadFileInfos: UploadFileInfo[];
  type: string;
}> {
  @observable
  isShowDirSelector = true;

  onFileSelected(e: React.ChangeEvent<HTMLInputElement>, type: string) {
    var files = e.target.files;
    e.target.files = undefined;
    var uploadFileInfos = this.props.uploadFileInfos;
    var list = uploadFileInfos;
    UploadFileInfo.AddUploadFileInfos(files, type, list, this);
  }

  render() {
    var uploadFileInfos = this.props.uploadFileInfos;
    var type = this.props.type;
    return (
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          overflow: 'hidden',
        }}
      >
        <UploadAreaHead
          type={type}
          uploadFileInfos={uploadFileInfos}
          fatherView={this}
        />
        <div
          className="uploadFileInfoListView"
          style={{
            width: '100%',
            height: 'calc(100% - 80px)',
            overflowX: 'hidden',
            overflowY: 'auto',
            position: 'relative',
          }}
        >
          {uploadFileInfos?.map((v, i) => {
            return (
              <ResUploadItemView
                key={i}
                fileInfo={v}
                type={type}
                fatherView={this}
              />
            );
          })}
          <ResUploadItemView type={type} fatherView={this} />
        </div>
        <UploadAreaFoot
          type={type}
          uploadFileInfos={uploadFileInfos}
          fatherView={this}
        />
      </div>
    );
  }
}

@observer
export default class ResUploadView extends PureComponent<any> {
  constructor(props) {
    super(props);
  }

  @observable
  static isShowUploadView = false;

  @observable
  currentTab = imgTypeName;

  @observable
  UploadFileInfos: Map<string, UploadFileInfo[]> = new Map<
    string,
    UploadFileInfo[]
  >();

  UploadListAreas: Map<string, UploadListArea> = new Map<
    string,
    UploadListArea
  >();

  getAddOnArea(type: string) {
    if (type != this.currentTab) return null;
    var accept = UploadFileInfo.getTypeAcceptFileExtension(type);

    var isUploading =
      this.UploadFileInfos.get(type)?.find(
        x => x.State == UploadState.Uploading,
      ) != null;
    return (
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '530px',
          background: '#F8F8F8',
          borderRadius: '4px',
          border: '1px solid #C3C3C3',
          pointerEvents: isUploading ? 'none' : 'auto',
        }}
        onDragOver={e => e.preventDefault()}
        onDrop={e => this.onFileDrop(e, type)}
      >
        {this.UploadFileInfos &&
        this.UploadFileInfos.has(type) &&
        this.UploadFileInfos.get(type) &&
        this.UploadFileInfos.get(type).length > 0 ? (
          <UploadListArea
            uploadFileInfos={this.UploadFileInfos.get(type)}
            type={type}
            ref={v => this.UploadListAreas.set(type, v)}
          />
        ) : (
          <div
            className="emptySelectSign"
            style={{
              width: '100%',
              height: '100%',
              display: '-webkit-box',
              WebkitBoxPack: 'center',
              WebkitBoxAlign: 'center',
            }}
          >
            <div
              style={{
                position: 'relative',
                width: '300px',
                display: '-webkit-box',
                textAlign: 'center',
                WebkitBoxPack: 'center',
                WebkitBoxAlign: 'center',
                WebkitBoxOrient: 'vertical',
              }}
            >
              <div style={{ width: '35px', height: '35px' }}>
                {UploadIcon()}
              </div>
              <div
                style={{ color: '#3FA1FB', fontSize: '16px', marginTop: '7px' }}
              >
                {`点击上传${type}或拖到此处上传${type}`}
              </div>
              <div style={{ color: '#98CCFC', fontSize: '13px' }}>
                {(() => {
                  switch (type) {
                    case imgTypeName:
                      return '支持jpg、jpeg、png，图片最大宽高1920x1080';
                    case audioTypeName:
                      return '支持mp3';
                    case videoTypeName:
                      return '支持mp4';
                    case skTypeName:
                      return '支持sk动画';
                    case captionsTypeName:
                      return '支持vtt字幕';
                    default:
                      return '';
                  }
                })()}
              </div>
              <div style={{ color: '#98CCFC', fontSize: '13px' }}>
                {type != captionsTypeName
                  ? type != audioTypeName
                    ? '文件名为{名称}{空格}{标签1}{空格}{标签2}'
                    : '文件名为{名称}{空格}{字幕语言}{空格}{标签1}{空格}{标签2}'
                  : '文件名为{名称}{空格}{字幕语言}{空格}{标签1}{空格}{标签2}'}
              </div>
              {type == skTypeName ? (
                <div style={{ color: '#98CCFC', fontSize: '13px' }}>
                  {'位图:{文件名}.1.png'}
                  <br />
                  {'脚本:{文件名}.sk'}
                  <br />
                  {' 贴图:{文件名}.png'}
                  <br />
                  {'三者{文件名}部分必须相同'}
                  <strong>{'且同时拖入'}</strong>
                </div>
              ) : null}
              <div style={{ color: '#98CCFC', fontSize: '13px' }}>
                {(() => {
                  switch (type) {
                    case imgTypeName:
                      return `每个文件${UploadFileInfo.ImgFileSize}M以内`;
                    case audioTypeName:
                      return `每个文件${UploadFileInfo.AudioFileSize}M以内`;
                    case skTypeName:
                      return `每个文件${UploadFileInfo.SkFileSize}M以内`;
                    case captionsTypeName:
                      return `每个文件${smallFileSize}M以内`;
                    case videoTypeName:
                      return `每个文件${UploadFileInfo.VideoFileSize}M以内`;
                    default:
                      return '';
                  }
                })()}
              </div>

              <input
                type="file"
                style={{
                  position: 'absolute',
                  left: '0px',
                  top: '0px',
                  width: '100%',
                  height: '100%',
                  cursor: 'pointer',
                  opacity: '0',
                }}
                accept={accept}
                multiple={true}
                onChange={e => {
                  this.onFileSelected(e, type);
                }}
              ></input>
            </div>
          </div>
        )}
      </div>
    );
  }

  onFileDrop(e: React.DragEvent<HTMLDivElement>, type: string): void {
    var files = e.dataTransfer.files;
    if (!this.UploadFileInfos.has(type)) this.UploadFileInfos.set(type, []);
    var list = this.UploadFileInfos.get(type);
    UploadFileInfo.AddUploadFileInfos(
      files,
      type,
      list,
      this.UploadListAreas.get(type),
    );
    e.preventDefault();
  }
  onFileSelected(e: React.ChangeEvent<HTMLInputElement>, type: string) {
    var files = e.target.files;
    e.target.files = undefined;
    if (!this.UploadFileInfos.has(type)) this.UploadFileInfos.set(type, []);
    var list = this.UploadFileInfos.get(type);
    UploadFileInfo.AddUploadFileInfos(
      files,
      type,
      list,
      this.UploadListAreas.get(type),
    );
  }

  componentDidMount() {
    UploadFileInfo.fetchResDics();
  }

  render() {
    return (
      <Modal
        title="资源上传"
        style={{ userSelect: 'none', maxWidth: '1200px' }}
        width="92%"
        footer={null}
        visible={ResUploadView.isShowUploadView}
        destroyOnClose={false}
        maskClosable={false}
        onCancel={() => {
          ResUploadView.isShowUploadView = false;
        }}
      >
        <Tabs
          tabBarExtraContent={''}
          style={{
            height: '600px',
          }}
          onChange={key => {
            this.currentTab = [
              imgTypeName,
              audioTypeName,
              videoTypeName,
              skTypeName,
              captionsTypeName,
            ][Number(key || 1) - 1];
          }}
        >
          <Tabs.TabPane
            tab={imgTypeName}
            key="1"
            style={{ position: 'relative' }}
          >
            {this.getAddOnArea(imgTypeName)}
          </Tabs.TabPane>
          <Tabs.TabPane
            tab={audioTypeName}
            key="2"
            style={{ position: 'relative' }}
          >
            {this.getAddOnArea(audioTypeName)}
          </Tabs.TabPane>
          <Tabs.TabPane
            tab={videoTypeName}
            key="3"
            style={{ position: 'relative' }}
          >
            {this.getAddOnArea(videoTypeName)}
          </Tabs.TabPane>
          <Tabs.TabPane
            tab={skTypeName}
            key="4"
            style={{ position: 'relative' }}
          >
            {this.getAddOnArea(skTypeName)}
          </Tabs.TabPane>

          <Tabs.TabPane
            tab={captionsTypeName}
            key="5"
            style={{ position: 'relative' }}
          >
            {this.getAddOnArea(captionsTypeName)}
          </Tabs.TabPane>
        </Tabs>
      </Modal>
    );
  }
}
