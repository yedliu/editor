import { PureComponent } from 'react';
import React from 'react';
import {
  UploadFileInfo,
  UploadError,
  UploadState,
  smallFileSize,
} from '@/modelClasses/resUpload/uploadFileInfo';
import { CWResourceTypes } from '@/modelClasses/courseDetail/courseDetailenum';
import { Checkbox, Cascader, Spin, Popover, message } from 'antd';
import { SyncOutlined, ExclamationCircleTwoTone } from '@ant-design/icons';
import { observer } from 'mobx-react';
import { UploadIcon, CaptionsIcon } from '@/svgs/designIcons';
import copy from 'copy-to-clipboard';
import CWResource from '@/modelClasses/courseDetail/cwResource';
import { observable } from 'mobx';

const normalborder = '0px 0px 6px 2px #7F7F7F5F';
const mouseonborder = '0px 0px 10px 2px #7F7F7F9F';

@observer
class DirCascader extends PureComponent<{
  fileInfo: UploadFileInfo;
}> {
  render() {
    var fileInfo: UploadFileInfo = this.props.fileInfo;
    var dic = UploadFileInfo.ResDics;
    var currentRootDicId = UploadFileInfo.ResTypeMap?.find(
      x => x.type == fileInfo.ResType,
    )?.directoryId;
    var typeRootDic = dic?.find(x => x.id == currentRootDicId);
    return (
      <Cascader
        placeholder="选择目录"
        size="small"
        changeOnSelect={false}
        expandTrigger="hover"
        displayRender={labels =>
          labels && labels.length > 0 ? labels[labels.length - 1] : null
        }
        options={typeRootDic ? [...typeRootDic.voList] : null}
        bordered={false}
        allowClear={false}
        value={fileInfo.DirPath}
        onChange={(value, selectedOptions) => {
          fileInfo.DirPath = value?.map(x => Number(x));
        }}
        fieldNames={{ label: 'title', value: 'id', children: 'voList' }}
        style={{
          background: 'transparent',
          width: '100%',
        }}
      />
    );
  }
}

@observer
class SelectChecker extends PureComponent<{
  fileInfo: UploadFileInfo;
}> {
  render() {
    var fileInfo: UploadFileInfo = this.props.fileInfo;
    return (
      <Checkbox
        style={{ position: 'absolute', left: '5px', top: '6px', zIndex: 2 }}
        checked={fileInfo.IsSelected || false}
        onChange={e => (fileInfo.IsSelected = e.target.checked)}
      ></Checkbox>
    );
  }
}

@observer
class SkItemPreview extends PureComponent<{
  fileInfo: UploadFileInfo;
  tbUrl: string;
}> {
  @observable
  iframe: HTMLIFrameElement;
  prefileInfo = null;

  onLoadSkImage() {
    var fileInfo: UploadFileInfo = this.props.fileInfo;

    if (this.iframe && fileInfo.ImgWidth && fileInfo.ImgHeight) {
      var iframe = this.iframe;
      let skcontrol = iframe.contentWindow as any;
      var windowSacle = window.devicePixelRatio;
      var w = iframe.clientWidth * windowSacle;
      var h = iframe.clientHeight * windowSacle;
      var scale = Math.min(w / fileInfo.ImgWidth, h / fileInfo.ImgHeight);

      skcontrol.LoadSkRes(
        w,
        h,
        URL.createObjectURL(fileInfo.TxFile),
        URL.createObjectURL(fileInfo.SkFile),
        scale,
        _actions => {
          fileInfo.SkActions = _actions;
        },
      );
    }
  }

  changePlayAction(e: React.ChangeEvent<HTMLSelectElement>): void {
    var select = e.currentTarget;
    var actionname = e.currentTarget.value;
    var iframe = this.iframe;

    if (actionname && iframe && iframe instanceof HTMLIFrameElement) {
      let skcontrol = iframe.contentWindow as any;
      skcontrol.changePlayname(actionname);
    }
  }

  componentDidUpdate() {
    //信息变化时重新加载骨骼（在前面的info删除时，UI不会删除前面的UI,而是会删除后面的UI,信息向前移）
    if (this.prefileInfo != this.props.fileInfo) {
      this.onLoadSkImage();
      this.prefileInfo = this.props.fileInfo;
    }
  }

  render() {
    var fileInfo: UploadFileInfo = this.props.fileInfo;
    var url: string = this.props.tbUrl;
    if (fileInfo && fileInfo.ImgWidth && fileInfo.ImgHeight) {
      return (
        <div
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
          }}
        >
          <iframe
            src="./layaboxIndex.html"
            className="layaboxIndex"
            style={{
              margin: '0px',
              padding: '0px',
              overflow: 'hidden',
              border: '0px solid transparent',
              userSelect: 'none',
              width: '100%',
              height: '100%',
              position: 'absolute',
              borderRadius: '5px 5px 0px 0px',
              background: 'white',
            }}
            ref={v => (this.iframe = v)}
            onLoad={event => this.onLoadSkImage()}
          ></iframe>
          {fileInfo.SkActions && fileInfo.SkActions.length > 0 ? (
            <select
              style={{
                position: 'absolute',
                height: '20px',
                fontSize: '12px',
                width: '80%',
                bottom: '3px',
                left: '10%',
                right: '10%',
                border: '0px solid transparent',
                borderRadius: '3px',
                background: '#3333336F',
                outline: 'none',
                color: 'white',
              }}
              onChange={e => this.changePlayAction(e)}
            >
              {fileInfo.SkActions.map((x, i) => (
                <option key={i} value={x}>
                  {x}
                </option>
              ))}
            </select>
          ) : null}
        </div>
      );
    } else {
      return (
        <img
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'scale-down',
          }}
          src={url}
        ></img>
      );
    }
  }
}

@observer
class ItemPreview extends PureComponent<{
  fileInfo: UploadFileInfo;
}> {
  render() {
    var fileInfo: UploadFileInfo = this.props.fileInfo;
    var url = URL.createObjectURL(fileInfo.File);
    switch (fileInfo.ResType) {
      case CWResourceTypes.Image:
        return (
          <img
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'scale-down',
            }}
            src={url}
          ></img>
        );
      case CWResourceTypes.Audio:
        return (
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
            }}
          >
            <img
              src={require('@/assets/mp3_icon.png')}
              style={{
                position: 'absolute',
                width: '80%',
                height: '40%',
                left: '10%',
                top: '10%',
                objectFit: 'scale-down',
              }}
            ></img>

            <audio
              src={url}
              style={{
                position: 'absolute',
                border: '0px soild transparent',
                width: '100%',
                height: '100%',
                objectFit: 'scale-down',
              }}
              controls={true}
              controlsList="nodownload noremoteplayback "
              onCanPlayThrough={e => {
                fileInfo.Duration = Number(e.currentTarget.duration) * 1000;
              }}
            ></audio>
          </div>
        );
      case CWResourceTypes.Video:
        return (
          <video
            src={url}
            style={{
              border: '0px soild transparent',
              width: '100%',
              height: '100%',
              objectFit: 'scale-down',
            }}
            controls={true}
            controlsList="nodownload nofullscreen"
            onLoadStart={() => {
              if (!fileInfo.VideoCanPlayChecked) {
                fileInfo.VideoCanPlayChecked = true;
                fileInfo.UploadErrors.add(UploadError.VideoEncodeError);
              }
            }}
            onCanPlayThrough={e => {
              if (e.currentTarget.duration != NaN) {
                console.log(
                  `[视频加载成功]:${fileInfo.ResName}-时长${e.currentTarget.duration}s`,
                );
                fileInfo.Duration = Number(e.currentTarget.duration) * 1000;
                fileInfo.UploadErrors.delete(UploadError.VideoEncodeError);
              }
            }}
          ></video>
        );
      case CWResourceTypes.SkeletalAni:
        return <SkItemPreview fileInfo={fileInfo} tbUrl={url}></SkItemPreview>;
      case CWResourceTypes.Captions:
        return (
          <div style={{ position: 'absolute', width: '100%', height: '100%' }}>
            <div style={{ margin: '35px' }}>{CaptionsIcon()}</div>
            <div
              style={{
                position: 'absolute',
                left: '2px',
                bottom: '2px',
                padding: '2px',
                borderRadius: '3px',
                background: '#3333CC5F',
                color: '#FFFFFFCF',
                fontSize: '6px',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
              }}
            >
              {fileInfo.CaptionsLang}
            </div>
          </div>
        );
    }
    return null;
  }
}

@observer
class UploadStateUI extends PureComponent<{
  fileInfo: UploadFileInfo;
}> {
  render() {
    var fileInfo: UploadFileInfo = this.props.fileInfo;
    return fileInfo.State == UploadState.Complete ||
      fileInfo.State == UploadState.Uploading ||
      fileInfo.AudioCaptionsLang != null ? (
      // || fileInfo.State == UploadState.Preparing ?
      <div
        style={{
          position: 'absolute',
          right: '5px',
          top: '6px',
          borderRadius: '15px',
          background:
            fileInfo.State == UploadState.Complete ? '#3399339F' : '#3333995F',
          padding: '2px 6px',
          color: 'white',
          fontSize: '10px',
          lineHeight: '18px',
          display: '-webkit-box',
          WebkitBoxAlign: 'center',
          WebkitBoxOrient: 'horizontal',
        }}
      >
        {(() => {
          switch (fileInfo.State) {
            case UploadState.Complete:
              return '上传成功';
            case UploadState.Uploading:
              //case UploadState.Preparing:
              return (
                <div style={{ whiteSpace: 'nowrap' }}>
                  正在上传
                  <Spin
                    style={{ marginLeft: '6px' }}
                    size="small"
                    indicator={
                      <SyncOutlined style={{ fontSize: '12px' }} spin />
                    }
                  />
                </div>
              );
            default:
              if (fileInfo.AudioCaptionsLang != null) {
                return (
                  <div style={{ whiteSpace: 'nowrap' }}>
                    {fileInfo.AudioCaptionsLang}
                  </div>
                );
              } else return null;
          }
        })()}
      </div>
    ) : null;
  }
}

@observer
class ItemErrorCover extends PureComponent<{
  fileInfo: UploadFileInfo;
}> {
  render() {
    var fileInfo: UploadFileInfo = this.props.fileInfo;
    var errorCount = fileInfo.UploadErrors?.size || 0;
    var lastError =
      errorCount > 0 ? Array.from(fileInfo.UploadErrors)[errorCount - 1] : null;
    return fileInfo.State == UploadState.Error && lastError ? (
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          borderRadius: '5px 5px 0px 0px',
          background: '#3333339F',
          zIndex: 1,
          display: '-webkit-box',
          WebkitBoxOrient: 'vertical',
          WebkitBoxPack: 'center',
          WebkitBoxAlign: 'center',
          overflow: 'hidden',
          textAlign: 'center',
        }}
      >
        <ExclamationCircleTwoTone
          twoToneColor="#CC3333"
          style={{ fontSize: '18px' }}
        />
        {(() => {
          var errorText = '错误';
          var showUploadRetry = false;
          var tipTitle = null;
          var tipContent = null;
          switch (lastError) {
            case UploadError.FileNameError:
              errorText = `文件名称格式错误`;
              break;
            case UploadError.FileSizeError:
              errorText = `文件大小不能超过规定大小`;
              break;
            case UploadError.VideoFileSizeError:
              errorText = `文件大小不能超过${UploadFileInfo.VideoFileSize}M`;
              break;
            case UploadError.AudioFileSizeError:
              errorText = `文件大小不能超过${UploadFileInfo.AudioFileSize}M`;
              break;
            case UploadError.ImgSizeError:
              errorText = `图片高宽超过限定大小`;
              break;
            case UploadError.SkTextureSizeError:
              errorText = `骨骼贴图高宽超过限定大小`;
              break;
            case UploadError.DirIdNotSetError:
              errorText = `上传前必须指定资源目录`;
              break;
            case UploadError.SkNoActionError:
              errorText = `未能读取骨骼动画中的动作,请检查骨骼动画格式是否正确`;
              break;
            case UploadError.VideoEncodeError:
              errorText = `视频无法播放，请检查编码格式`;
              break;
            case UploadError.CaptionLangError:
              errorText = `错误的字幕语言信息`;
              break;
            case UploadError.UploadFailError:
              errorText = `文件上传失败，请重试`;
              showUploadRetry = true;
              break;
            case UploadError.RecordFailError:
              errorText = `文件记录失败，请重试`;
              showUploadRetry = true;
              break;
            case UploadError.FileSameError:
              errorText = `已存在相同资源`;
              tipTitle = `在哪寻找`;
              var existRes: CWResource = fileInfo.SameResObj;
              if (existRes) {
                tipContent = (
                  <div
                    style={{
                      display: '-webkit-box',
                      WebkitBoxOrient: 'vertical',
                      WebkitBoxPack: 'start',
                      maxWidth: '220px',
                      userSelect: 'none',
                    }}
                  >
                    <div
                      style={{
                        color: '#9999FF',
                        cursor: 'pointer',
                      }}
                      onClick={() => {
                        copy(existRes.resourceName);
                        message.success('复制资源名称成功');
                      }}
                    >
                      复制名称
                    </div>

                    <div
                      style={{
                        wordWrap: 'break-word',
                        overflowWrap: 'anywhere',
                      }}
                    >
                      {`在${
                        existRes.deleted ? '后台管理回收站' : '资源库'
                      }中寻找名称为：${existRes.purpose}>${
                        existRes.directorys
                      }>${existRes.resourceName}的素材进行恢复`}
                    </div>
                  </div>
                );
              }
              break;
          }

          return (
            <div
              style={{
                textAlign: 'center',
                marginTop: '1px',
                width: '81.6%',
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                WebkitBoxPack: 'center',
                WebkitBoxAlign: 'center',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  fontSize: '10px',
                  color: 'lightgray',
                  wordWrap: 'break-word',
                  overflowWrap: 'anywhere',
                }}
              >
                {errorText}
              </div>
              {showUploadRetry ? (
                <div
                  style={{
                    marginTop: '2px',
                    fontSize: '8px',
                    color: '#CCCCFF',
                    cursor: 'pointer',
                  }}
                  onClick={() => fileInfo.tryStartUpload()}
                >
                  重试
                </div>
              ) : null}
              {tipTitle ? (
                <div
                  style={{
                    marginTop: '2px',
                    fontSize: '8px',
                    color: '#CCCCFF',
                    cursor: 'pointer',
                  }}
                >
                  <Popover title={null} content={tipContent} trigger="hover">
                    {tipTitle}
                  </Popover>
                </div>
              ) : null}
            </div>
          );
        })()}
      </div>
    ) : null;
  }
}

@observer
export default class ResUploadItemView extends PureComponent<any> {
  itemMouseEnter(e) {
    e.currentTarget.style.boxShadow = mouseonborder;
  }
  itemMouseLeave(e) {
    e.currentTarget.style.boxShadow = normalborder;
  }

  getHasInfoUI() {
    var fileInfo: UploadFileInfo = this.props.fileInfo;
    return (
      <div
        style={{
          position: 'relative',
          width: '140px',
          height: '210px',
          borderRadius: '5px',
          margin: '12px 16px',
          display: 'inline-block',
          boxShadow: normalborder,
        }}
        onMouseEnter={e => this.itemMouseEnter(e)}
        onMouseLeave={e => this.itemMouseLeave(e)}
      >
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
          }}
        >
          <div
            className="previewRect"
            style={{
              position: 'relative',
              width: '100%',
              height: '140px',
              borderRadius: '5px 5px 0px 0px',
              background: '#9999991F',
            }}
          >
            <ItemErrorCover fileInfo={fileInfo} />
            <ItemPreview fileInfo={fileInfo} />
          </div>
          <div
            style={{
              textAlign: 'center',
              marginTop: '5px',
              width: '100%',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              fontSize: '12px',
              overflow: 'hidden',
            }}
          >
            {fileInfo.ResName}
          </div>
          <div style={{ marginTop: '6px', width: '100%' }}>
            <DirCascader fileInfo={fileInfo} />
          </div>
        </div>
        <SelectChecker fileInfo={fileInfo}></SelectChecker>
        <UploadStateUI fileInfo={fileInfo} />
      </div>
    );
  }

  getAddUI() {
    var type = this.props.type;
    var accept = UploadFileInfo.getTypeAcceptFileExtension(type);

    return (
      <div
        style={{
          position: 'relative',
          width: '140px',
          height: '210px',
          borderRadius: '5px',
          margin: '12px 16px',
          display: 'inline-block',
          boxShadow: normalborder,
          cursor: 'pointer',
        }}
        onMouseEnter={e => this.itemMouseEnter(e)}
        onMouseLeave={e => this.itemMouseLeave(e)}
      >
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            display: '-webkit-box',
            textAlign: 'center',
            WebkitBoxPack: 'center',
            WebkitBoxAlign: 'center',
            WebkitBoxOrient: 'vertical',
          }}
        >
          <div style={{ width: '35px', height: '35px' }}>
            {UploadIcon(['#555555', '#555555'])}
          </div>
          <div
            style={{
              color: '#555555',
              fontSize: '12px',
              marginTop: '7px',
              width: '80%',
            }}
          >
            {`点击或拖到此处上传${type}`}
          </div>
        </div>
        <input
          type="file"
          id={`${type}uploadInput`}
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            left: '0px',
            top: '0px',
            cursor: 'pointer',
            opacity: '0',
          }}
          accept={accept}
          multiple={true}
          onChange={e => this.props.fatherView.onFileSelected(e, type)}
        ></input>
      </div>
    );
  }

  render() {
    var fileInfo: UploadFileInfo = this.props.fileInfo;
    if (fileInfo) return this.getHasInfoUI();
    else return this.getAddUI();
  }
}
