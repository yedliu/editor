import React from 'react';
import CWResource from '@/modelClasses/courseDetail/cwResource';
import { CWResourceTypes } from '@/modelClasses/courseDetail/courseDetailenum';
import { serialize } from '@/class-transformer';
import DraggingData from '@/modelClasses/courseDetail/toolbox/DraggingData';
import { Popover } from 'antd';
import { PreviewResource, ResConfig } from '../controls/previewResource';
import { observer } from 'mobx-react';
import { CaptionsIcon } from '@/svgs/designIcons';
import { action, observable, runInAction } from 'mobx';
import HttpService from '@/server/httpServer';

///资源项的UI
@observer
class ResItemUI extends React.Component<any> {
  constructor(props: any) {
    super(props);
  }

  //#region 收藏添加逻辑

  //请求类型 reqType 1-添加收藏 2-取消收藏
  @action addOrCancelCollect = async (reqType, resourceId) => {
    var response = await HttpService.addOrCancelCollect(reqType, resourceId);
    runInAction(() => {
      if (response) {
        const { onChange } = this.props;
        if (onChange) onChange();
      }
    });
  };

  //#endregion

  public OnDragStartItem(event: any, item: CWResource) {
    var plain = serialize(item);
    event.dataTransfer.setData('res', plain);
    DraggingData.setData('res', item);
  }

  OnDragItemEnd(event: any) {
    DraggingData.delData('res');
  }

  getImgResItemUI(item: CWResource) {
    return (
      <div
        draggable="true"
        style={{ alignSelf: 'center', width: '100%', height: '100%' }}
      >
        <img
          src={item.resourceKey?.concat('?x-oss-process=image/resize,l_60')}
          style={{ height: '100%', width: '100%', objectFit: 'contain' }}
        ></img>
      </div>
    );
  }

  // getAudioResItemUI(item: CWResource) {
  //   return (
  //     <div
  //       draggable="true"
  //       style={{ alignSelf: 'center', width: '100%', height: '100%' }}
  //     >
  //       <img
  //         src={require('@/assets/mp3_icon.png')}
  //         style={{ height: '100%', width: '100%', objectFit: 'contain' }}
  //       ></img>
  //     </div>
  //   );
  // }

  getAudioResItemUI(item: CWResource) {
    return (
      <div
        style={{
          alignSelf: 'center',
          width: '100%',
          height: '100%',
          position: 'relative',
        }}
      >
        <div style={{ margin: '2px' }}>
          {' '}
          <img
            src={require('@/assets/mp3_icon.png')}
            style={{ height: '100%', width: '100%', objectFit: 'contain' }}
          ></img>
        </div>
        {item.resourceType == CWResourceTypes.Audio && item.statusVO ? (
          <div
            style={{
              position: 'absolute',
              left: '2px',
              bottom: '2px',
              padding: '2px',
              borderRadius: '3px',
              background: '#3333CC5F',
              color: '#FFFFFFCF',
              fontSize: '12px',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              userSelect: 'none',
              transform: 'scale(0.7,0.7)',
              transformOrigin: '0% 100%',
            }}
          >
            字幕
          </div>
        ) : null}
      </div>
    );
  }

  getVideoResItemUI(item: CWResource) {
    return (
      <div
        draggable="true"
        style={{ alignSelf: 'center', width: '100%', height: '100%' }}
      >
        <img
          src={item.resourceKey?.concat(
            '?x-oss-process=video/snapshot,t_100,m_fast',
          )}
          style={{ height: '100%', width: '100%', objectFit: 'contain' }}
        ></img>
      </div>
    );
  }

  getSkeletonResItemUI(item: CWResource) {
    return (
      <div style={{ alignSelf: 'center', width: '100%', height: '100%' }}>
        <img
          src={item.resourceKey?.concat('?x-oss-process=image/resize,l_60')}
          style={{ height: '100%', width: '100%', objectFit: 'contain' }}
        ></img>
      </div>
    );
  }

  getCaptionsResItemUI(item: CWResource) {
    return (
      <div
        style={{
          alignSelf: 'center',
          width: '100%',
          height: '100%',
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
            color: '#FFFFFFCF',
            fontSize: '12px',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            userSelect: 'none',
            transform: 'scale(0.7,0.7)',
            transformOrigin: '0% 100%',
          }}
        >
          {item.language}
        </div>
      </div>
    );
  }

  getComplexControlResItemUI(item: CWResource) {
    return (
      <div style={{ alignSelf: 'center', width: '100%', height: '100%' }}>
        <img
          src={item?.resourceKey}
          style={{ height: '100%', width: '100%', objectFit: 'contain' }}
        ></img>
      </div>
    );
  }

  @observable
  isOpenPreview = false;
  @observable
  selectId = null;

  render() {
    let item = this.props.data as CWResource;
    var fatherlist: CWResource[] = this.props.fatherList;

    let innerUI = () => {
      switch (item.resourceType) {
        case CWResourceTypes.Image:
          return this.getImgResItemUI(item);
        case CWResourceTypes.Audio:
          return this.getAudioResItemUI(item);
        case CWResourceTypes.Video:
          return this.getVideoResItemUI(item);
        case CWResourceTypes.SkeletalAni:
          return this.getSkeletonResItemUI(item);
        case CWResourceTypes.Captions:
          return this.getCaptionsResItemUI(item);
        case CWResourceTypes.ComplexControl:
          return this.getComplexControlResItemUI(item);
        default:
          return this.getImgResItemUI(item);
      }
    };

    var resIndex = fatherlist?.indexOf(item);
    return (
      <div
        onDragStart={event => this.OnDragStartItem(event, item)}
        onDragEnd={event => this.OnDragItemEnd(event)}
        onDoubleClick={() => {
          this.isOpenPreview = false;
          this.isOpenPreview = true;
        }}
        style={{
          float: 'left',
          width: '60px',
          height: '90px',
          margin: '5px 5px',
        }}
        draggable={true}
      >
        {fatherlist && resIndex != null ? (
          <PreviewResource
            resconfig={Object.assign(new ResConfig(), {
              visible: this.isOpenPreview,
              resourceList: fatherlist,
              selectedresouceIndex: resIndex,
            })}
            onClose={() => (this.isOpenPreview = false)}
          />
        ) : null}
        <Popover
          content={
            <div
              style={{
                maxWidth: '150px',
                textOverflow: 'ellipsis',
                wordWrap: 'break-word',
              }}
            >
              {item.resourceName}
            </div>
          }
          trigger={'hover'}
        >
          <div
            onMouseEnter={() => (this.selectId = item.resourceId)}
            onMouseLeave={() => (this.selectId = null)}
            style={{
              background:
                this.selectId == item.resourceId ? '#5aa2ff1a' : 'transparent',
              width: '100%',
              display: 'flex',
              height: '60px',
              textAlign: 'center',
              overflow: 'hidden',
              borderRadius: '4px',
            }}
          >
            {innerUI()}
            <div
              onClick={() => {
                this.addOrCancelCollect(!item.isMyCollect, item.resourceId);
              }}
              style={{
                cursor: 'pointer',
                position: 'absolute',
                marginLeft: '42px',
                borderRadius: '0px 4px 0px 4px',
                height: '16px',
                width: '16px',
                background:
                  item.resourceType == CWResourceTypes.ComplexControl
                    ? 'transparent'
                    : this.selectId == item.resourceId || item.isMyCollect
                    ? '#00000080'
                    : 'transparent',
              }}
            >
              {item.resourceType ==
              CWResourceTypes.ComplexControl ? null : item.isMyCollect ? (
                <img
                  style={{ width: '14px', height: '14px', marginTop: '-10px' }}
                  src={require('@/assets/layout/icon_collected.png')}
                ></img>
              ) : this.selectId == item.resourceId ? (
                <img
                  style={{ width: '14px', height: '14px', marginTop: '-10px' }}
                  src={require('@/assets/layout/icon_collection_1.png')}
                ></img>
              ) : null}
              {/* {item.isMyCollect?'t':'ffff'} */}
            </div>
          </div>
        </Popover>
        <div
          style={{
            textAlign: 'center',
            overflowWrap: 'break-word',
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 2,
            maxHeight: '30px',
            overflow: 'hidden',
            fontSize: '10px',
            lineHeight: '14px',
          }}
        >
          {item.resourceName}
        </div>
      </div>
    );
  }
}

export default ResItemUI;
