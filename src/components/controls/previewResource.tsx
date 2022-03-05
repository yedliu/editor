import { observable } from 'mobx';
import React from 'react';
import { Modal, Select, Pagination } from 'antd';
import { observer } from 'mobx-react';
import CWResource from '@/modelClasses/courseDetail/cwResource';
import { display } from 'html2canvas/dist/types/css/property-descriptors/display';
import { CWResourceTypes } from '@/modelClasses/courseDetail/courseDetailenum';
import TimerHelper from '@/utils/timerHelper';
import { position } from 'html2canvas/dist/types/css/property-descriptors/position';
import StyledRect from '../cwDesignUI/elements/resizable/Rect/StyledRect';
import styled from 'styled-components';
import CacheHelper from '@/utils/cacheHelper';
import { CaptionsIcon } from '@/svgs/designIcons';

const { Option } = Select;

export class ResConfig {
  @observable
  visible: Boolean;
  resourceList: CWResource[];
  @observable
  selectedresouceIndex: number;
}

const PaginationDiv = styled.div`
  .ant-pagination-simple-pager input {
    background: #5f5f5f;
    border: none;
  }
  svg {
    color: white;
  }
`;

@observer
export class PreviewResource extends React.Component<any, any> {
  iframe: HTMLIFrameElement;

  constructor(props) {
    super(props);
  }

  getImgResUI(item: CWResource) {
    return (
      <div>
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
            src={item.resourceKey}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
            }}
          ></img>
        </div>
      </div>
    );
  }

  onLoadSkImage(
    event: React.SyntheticEvent<HTMLIFrameElement, Event>,
    source: CWResource,
  ) {
    if (!source || source.resourceType != CWResourceTypes.SkeletalAni) return;
    let element = this.iframe; //event.currentTarget;
    let skcontrol = element?.contentWindow as any;

    skcontrol?.LoadSkResPlayName?.(
      element.clientWidth,
      element.clientHeight,
      source.boneSource,
      source.boneJs?.replace('http://', 'https://'),
      element.clientHeight /
        (source.width > source.height ? source.width : source.height),
    );
  }
  selectChangedSK(e: any) {
    var select = e.currentTarget;
    var iframe = select.parentElement?.firstElementChild as HTMLIFrameElement;
    var actionname = e.currentTarget.value;

    if (actionname && iframe && iframe instanceof HTMLIFrameElement) {
      let skcontrol = iframe.contentWindow as any;
      skcontrol.changePlayname(actionname);
    }
  }

  getSKResUI(item: CWResource) {
    return (
      <div
        style={{
          position: 'absolute',
          left: '10px',
          top: '10px',
          right: '10px',
          bottom: '10px',
        }}
      >
        <iframe
          src="./layaboxIndex.html"
          onLoad={event => this.onLoadSkImage(event, item)}
          ref={v => (this.iframe = v)}
          style={{
            margin: '0px',
            padding: '0px',
            overflow: 'hidden',
            border: 'none',
            userSelect: 'none',
            width: '100%',
            height: '100%',
          }}
        ></iframe>
        <select
          style={{
            position: 'absolute',
            height: '30px',
            fontSize: '14px',
            width: '40%',
            bottom: '20px',
            left: '30%',
            right: '30%',
            border: '0px solid transparent',
            borderRadius: '3px',
            background: '#3333336F',
            outline: 'none',
            color: 'white',
          }}
          onChange={e => this.selectChangedSK(e)}
        >
          {item.boneList?.map(bone => (
            <option key={bone.value} value={bone.value}>
              {bone.name}
            </option>
          ))}
        </select>
      </div>
    );
  }

  getAudioResUI(item: CWResource) {
    return (
      <div>
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
            src={item.resourceKey}
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
    );
  }

  getVideoResUI(item: CWResource) {
    return (
      <div
        style={{
          position: 'absolute',
          left: '10px',
          top: '10px',
          right: '10px',
          bottom: '10px',
        }}
      >
        <video
          autoPlay={true}
          controls={true}
          controlsList="nodownload"
          src={item.resourceKey}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
          }}
        ></video>
      </div>
    );
  }

  getCaptionsResUI(item: CWResource) {
    return (
      <div
        style={{
          position: 'absolute',
          left: '10px',
          top: '10px',
          right: '10px',
          bottom: '10px',
        }}
      >
        <div
          style={{
            position: 'absolute',
            width: '40%',
            height: '40%',
            left: '30%',
            top: '30%',
          }}
        >
          {CaptionsIcon()}
        </div>
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
          {item.language}
        </div>
      </div>
    );
  }

  onResourceChanged(pageNo: number) {
    const { resconfig } = this.props;
    resconfig.selectedresouceIndex = pageNo - 1;
    this.onLoadSkImage(
      null,
      resconfig.resourceList[resconfig.selectedresouceIndex],
    );
  }

  render() {
    const { resconfig } = this.props;
    if (resconfig) {
      let resource = resconfig.resourceList[
        resconfig.selectedresouceIndex
      ] as CWResource;
      let innerUI = () => {
        switch (resource.resourceType) {
          case CWResourceTypes.Image:
            return this.getImgResUI(resource);
          case CWResourceTypes.SkeletalAni:
            return this.getSKResUI(resource);
          case CWResourceTypes.Audio:
            return this.getAudioResUI(resource);
          case CWResourceTypes.Video:
            return this.getVideoResUI(resource);
          case CWResourceTypes.Captions:
            return this.getCaptionsResUI(resource);
        }
        return null;
      };
      let sizeConvert = CacheHelper.ConvertSize(resource.resourceSize);
      return (
        <div style={{ position: 'absolute' }}>
          <Modal
            destroyOnClose={true}
            style={{ padding: '0px' }}
            width="1000px"
            title={resource.resourceName}
            centered
            visible={resconfig ? resconfig.visible : false}
            footer={null}
            maskClosable={false}
            onCancel={() => {
              resconfig.visible = false;
              this.props?.onClose?.();
            }}
          >
            <div
              style={{
                background: '#333333',
                height: '600px',
                WebkitBoxPack: 'justify',
                display: '-webkit-box',
                WebkitBoxOrient: 'horizontal',
              }}
            >
              <div
                style={{
                  width: '70%',
                  height: '100%',
                  display: '-webkit-box',
                  WebkitBoxAlign: 'center',
                  position: 'relative',
                }}
              >
                {innerUI()}
              </div>
              <div
                style={{
                  width: '30%',
                  height: '100%',
                  background: '#4F4F4F',
                  display: '-webkit-box',
                  WebkitBoxOrient: 'vertical',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    display: '-webkit-box',
                    WebkitBoxOrient: 'horizontal',
                    color: 'white',
                  }}
                >
                  <div style={{ marginLeft: '15px', marginTop: '15px' }}>
                    编号:
                  </div>
                  <div
                    style={{
                      marginLeft: '15px',
                      marginTop: '15px',
                      width: '220px',
                      textOverflow: 'ellipsis',
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {resource.resourceId}
                  </div>
                </div>
                <div
                  style={{
                    display: '-webkit-box',
                    WebkitBoxOrient: 'horizontal',
                    color: 'white',
                  }}
                >
                  <div style={{ marginLeft: '15px', marginTop: '15px' }}>
                    像素:
                  </div>
                  <div style={{ marginLeft: '15px', marginTop: '15px' }}>
                    {resource.width}*{resource.height}
                  </div>
                </div>
                <div
                  style={{
                    display: '-webkit-box',
                    WebkitBoxOrient: 'horizontal',
                    color: 'white',
                  }}
                >
                  <div style={{ marginLeft: '15px', marginTop: '15px' }}>
                    上传者:
                  </div>
                  <div style={{ marginLeft: '15px', marginTop: '15px' }}>
                    {resource.userName}
                  </div>
                </div>
                <div
                  style={{
                    display: '-webkit-box',
                    WebkitBoxOrient: 'horizontal',
                    color: 'white',
                  }}
                >
                  <div style={{ marginLeft: '15px', marginTop: '15px' }}>
                    上传时间:
                  </div>
                  <div style={{ marginLeft: '15px', marginTop: '15px' }}>
                    {TimerHelper.stringToDate(resource.createTime)}
                  </div>
                </div>
                <div
                  style={{
                    display: '-webkit-box',
                    WebkitBoxOrient: 'horizontal',
                    color: 'white',
                  }}
                >
                  <div style={{ marginLeft: '15px', marginTop: '15px' }}>
                    上次修改:
                  </div>
                  <div style={{ marginLeft: '15px', marginTop: '15px' }}>
                    {TimerHelper.stringToDate(resource.updateTime)}
                  </div>
                </div>
                <div
                  style={{
                    display: '-webkit-box',
                    WebkitBoxOrient: 'horizontal',
                    color: 'white',
                  }}
                >
                  <div style={{ marginLeft: '15px', marginTop: '15px' }}>
                    文件大小:
                  </div>
                  <div style={{ marginLeft: '15px', marginTop: '15px' }}>
                    {sizeConvert}
                  </div>
                </div>

                <div
                  style={{
                    display: '-webkit-box',
                    WebkitBoxOrient: 'horizontal',
                    color: 'white',
                  }}
                >
                  <div style={{ marginLeft: '15px', marginTop: '15px' }}>
                    文件类型:
                  </div>
                  <div style={{ marginLeft: '15px', marginTop: '15px' }}>
                    {resource.resourceType == CWResourceTypes.SkeletalAni
                      ? resource.boneJs?.substr(
                          resource.boneJs.lastIndexOf('.') + 1,
                        )
                      : resource.resourceKey?.substr(
                          resource.resourceKey.lastIndexOf('.') + 1,
                        )}
                  </div>
                </div>

                <div
                  style={{
                    width: '205px',
                    display: '-webkit-box',
                    WebkitBoxOrient: 'horizontal',
                    color: 'white',
                  }}
                >
                  <div style={{ marginLeft: '15px', marginTop: '15px' }}>
                    文件目录:
                  </div>
                  <div style={{ marginLeft: '15px', marginTop: '15px' }}>
                    {resource.directorys}
                  </div>
                </div>

                <div
                  style={{
                    display: '-webkit-box',
                    WebkitBoxOrient: 'horizontal',
                    color: 'white',
                  }}
                >
                  <div style={{ marginLeft: '15px', marginTop: '15px' }}>
                    引用项目数量:
                  </div>
                  <div style={{ marginLeft: '15px', marginTop: '15px' }}>
                    {resource.useNum}
                  </div>
                </div>
                <div
                  style={{
                    display: '-webkit-box',
                    WebkitBoxOrient: 'horizontal',
                    color: 'white',
                  }}
                >
                  <div style={{ marginLeft: '15px', marginTop: '15px' }}>
                    标签:
                  </div>
                  <div style={{ marginLeft: '15px', marginTop: '15px' }}>
                    {resource.strList ? resource.strList.join(',') : '暂无标签'}
                  </div>
                </div>
                <PaginationDiv
                  style={{
                    position: 'absolute',
                    bottom: 30,
                    left: '10%',
                    right: '10%',
                  }}
                >
                  <Pagination
                    simple
                    defaultCurrent={resconfig.selectedresouceIndex + 1}
                    onChange={(page, pageSize) => this.onResourceChanged(page)}
                    pageSize={1}
                    total={resconfig.resourceList.length}
                    style={{ color: 'white', textAlign: 'center' }}
                  />
                </PaginationDiv>
              </div>
            </div>
          </Modal>
        </div>
      );
    } else {
      return <div></div>;
    }
  }
}
