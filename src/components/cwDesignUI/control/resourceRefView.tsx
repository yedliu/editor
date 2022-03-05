import React, { CSSProperties } from 'react';
import { Select } from 'antd';
import CWResource from '@/modelClasses/courseDetail/cwResource';
import { CWResourceTypes } from '@/modelClasses/courseDetail/courseDetailenum';
import styles from '@/styles/property.less';
import {
  ResourceRef,
  SkResRef,
  RefSelectorType,
} from '@/modelClasses/courseDetail/resRef/resourceRef';
import { observer } from 'mobx-react';
import {
  classToClass,
  classToPlain,
  plainToClass,
  deserialize,
} from '@/class-transformer';
import {
  PreviewResource,
  ResConfig,
} from '@/components/controls/previewResource';
import { observable } from 'mobx';
import DraggingData from '@/modelClasses/courseDetail/toolbox/DraggingData';
import { CaptionsIcon } from '@/svgs/designIcons';

@observer
export default class ResourceRefView extends React.Component<any, any> {
  @observable
  resconfig: ResConfig;

  constructor(props: any) {
    super(props);
    const { width, height, marginLeft, resRef, float } = this.props;
    this.state = {
      height: height ? height : 60,
      width: width ? width : 170,
      marginLeft: marginLeft ? marginLeft : 0,
      float: float ? float : 'left',
    };
    this.IsSelectionChanged = this.IsSelectionChanged.bind(this);
  }

  IsSelectionChanged(value: any, propertyName: string) {
    const { resRef, selectionChanged } = this.props;
    let ref: ResourceRef = resRef;
    ref = plainToClass(
      ref.ResourceType == CWResourceTypes.SkeletalAni ? SkResRef : ResourceRef,
      classToPlain(ref),
    );
    Reflect.set(ref, propertyName, value);
    selectionChanged?.(ref);
  }

  checkCanDrop(source: CWResource) {
    const { refType, langType } = this.props;
    let isSetSource = false;
    let type = refType ? refType : RefSelectorType.ImageAndSkeleton;
    switch (source.resourceType) {
      case CWResourceTypes.Image: {
        if (
          type == RefSelectorType.Image ||
          type == RefSelectorType.ImageAndSkeleton
        )
          isSetSource = true;
        break;
      }
      case CWResourceTypes.SkeletalAni: {
        if (
          type == RefSelectorType.Skeleton ||
          type == RefSelectorType.ImageAndSkeleton
        )
          isSetSource = true;
        break;
      }
      case CWResourceTypes.Video: {
        if (
          type == RefSelectorType.Video ||
          type == RefSelectorType.AudioAndVideo
        )
          isSetSource = true;
        break;
      }
      case CWResourceTypes.Audio: {
        if (
          type == RefSelectorType.Audio ||
          type == RefSelectorType.AudioAndVideo
        )
          isSetSource = true;
        break;
      }
      case CWResourceTypes.Captions: {
        if (
          type == RefSelectorType.Captions &&
          langType.configKey == source.language
        ) {
          isSetSource = true;
        }
        break;
      }
    }

    return isSetSource;
  }

  onResDragOver(event: React.DragEvent<HTMLDivElement>) {
    const { resRef, selectionChanged, refType, langType } = this.props;
    let source: CWResource = DraggingData.getData('res');
    var isSetSource = source ? this.checkCanDrop(source) : false;
    if (isSetSource) {
      event.preventDefault();
    }
  }

  OnDropResource(event: React.DragEvent<HTMLDivElement>) {
    const { resRef, selectionChanged, refType, langType } = this.props;
    event.preventDefault();
    event.stopPropagation();

    let source: CWResource = DraggingData.getData('res');
    DraggingData.delData('res');
    var isSetSource = source ? this.checkCanDrop(source) : false;

    let ref = null;
    if (source != null && isSetSource) {
      if (
        source.resourceType == CWResourceTypes.SkeletalAni &&
        source.boneList != null &&
        source.boneList.length > 0
      ) {
        ref = new SkResRef(source, source.boneList[0].value, 0);
      } else {
        ref = new ResourceRef(source);
      }
      selectionChanged?.(ref);
    }
  }

  onDoubleClearResource(event: React.MouseEvent<HTMLDivElement>) {
    const { selectionChanged } = this.props;
    selectionChanged?.(null);
  }

  onPreviewResource(
    event: React.MouseEvent<HTMLDivElement>,
    item: ResourceRef,
  ) {
    this.resconfig = new ResConfig();
    this.resconfig.resourceList = [item.Resource];
    this.resconfig.selectedresouceIndex = 0;
    this.resconfig.visible = true;
  }

  getImgResUI(item: ResourceRef) {
    return (
      <div style={{ display: 'flex' }}>
        <div
          style={{ background: 'rgba(232, 232, 232, 1)', width: '30%' }}
          onClick={event => this.onPreviewResource(event, item)}
        >
          <img
            src={item.Resource.resourceKey.concat(
              '?x-oss-process=image/resize,l_60',
            )}
            style={{
              height: `${this.state.height - 2}px`,
              width: '50px',
              objectFit: 'contain',
              cursor: 'pointer',
            }}
          ></img>
        </div>
        <div
          onDoubleClick={event => this.onDoubleClearResource(event)}
          style={{
            width: '70%',
            height: '100%',
            lineHeight: `${this.state.height}px`,
            textAlign: 'center',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            marginLeft: '3px',
            cursor: 'pointer',
          }}
        >
          {item.Resource.resourceName}
        </div>
      </div>
    );
  }

  getAudioResUI(item: ResourceRef) {
    return (
      <div style={{ display: 'flex' }}>
        <div
          style={{ background: 'rgba(232, 232, 232, 1)', width: '35%' }}
          onClick={event => this.onPreviewResource(event, item)}
        >
          <img
            src={require('@/assets/mp3_icon.png')}
            style={{
              height: `${this.state.height - 2}px`,
              width: '50px',
              objectFit: 'contain',
              cursor: 'pointer',
            }}
          ></img>
        </div>
        <div
          onDoubleClick={event => this.onDoubleClearResource(event)}
          style={{
            width: '65%',
            height: '100%',
            lineHeight: `${this.state.height}px`,
            textAlign: 'center',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            marginLeft: '3px',
            cursor: 'pointer',
          }}
        >
          {item.Resource.resourceName}
        </div>
      </div>
    );
  }

  getVideoResUI(item: ResourceRef) {
    return (
      <div style={{ display: 'flex' }}>
        <div
          style={{ background: 'rgba(232, 232, 232, 1)', width: '30%' }}
          onClick={event => this.onPreviewResource(event, item)}
        >
          <img
            src={item.Resource.resourceKey.concat(
              '?x-oss-process=video/snapshot,t_100,m_fast',
            )}
            style={{
              height: `${this.state.height - 2}px`,
              width: '50px',
              objectFit: 'contain',
              cursor: 'pointer',
            }}
          ></img>
        </div>
        <div
          onDoubleClick={event => this.onDoubleClearResource(event)}
          style={{
            width: '70%',
            height: '100%',
            lineHeight: `${this.state.height}px`,
            textAlign: 'center',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            marginLeft: '3px',
            cursor: 'pointer',
          }}
        >
          {item.Resource.resourceName}
        </div>
      </div>
    );
  }

  getDefaultResUI(item: ResourceRef, name: string) {
    return (
      <div>
        <div style={{ float: 'left', background: 'rgba(232, 232, 232, 1)' }}>
          <div
            style={{
              height: `${this.state.height - 2}px`,
              width: '50px',
            }}
          ></div>
        </div>
        <label
          style={{
            float: 'left',
            width: '65%',
            height: '100%',
            lineHeight: `${this.state.height}px`,
            textAlign: 'center',
            fontSize: '10px',
            color: '#CFCFCF',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {name}
        </label>
      </div>
    );
  }

  getSKResUI(item: SkResRef) {
    const { Option } = Select;
    var actionList = [];
    for (let i = 0; i < item.Resource.boneList.length; i++) {
      actionList.push(
        <option
          key={item.Resource.boneList[i].value}
          value={item.Resource.boneList[i].value}
        >
          {item.Resource.boneList[i].name}
        </option>,
      );
    }

    var indexList = [];
    for (let i = 0; i < 30; i++) {
      if (i == 0)
        indexList.push(
          <option key={i} value={i}>
            {'Forever'}
          </option>,
        );
      else
        indexList.push(
          <option key={i} value={i}>
            {i}
          </option>,
        );
    }

    return (
      <div style={{ display: 'flex' }}>
        <div
          style={{ background: 'rgba(232, 232, 232, 1)', width: '30%' }}
          onClick={event => this.onPreviewResource(event, item)}
        >
          <img
            src={item.Resource.resourceKey.concat(
              '?x-oss-process=image/resize,l_60',
            )}
            style={{
              height: `${this.state.height - 2}px`,
              width: '50px',
              objectFit: 'contain',
              cursor: 'pointer',
            }}
          ></img>
        </div>
        <div
          onDoubleClick={event => this.onDoubleClearResource(event)}
          style={{
            width: '70%',
            height: '100%',
            marginLeft: '3px',
            cursor: 'pointer',
          }}
        >
          <div
            style={{
              fontSize: 8,
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              textAlign: 'center',
            }}
          >
            {item.Resource.resourceName}
          </div>
          <div>
            <label style={{ height: '17px' }}>动作：</label>
            <select
              value={item.Action}
              style={{ width: '65px', height: '17px', fontSize: '8px' }}
              onChange={e => this.IsSelectionChanged(e.target.value, 'Action')}
            >
              {actionList}
            </select>
          </div>
          <div>
            <label style={{ height: '17px' }}>次数：</label>
            <select
              value={item.PlayTimes}
              style={{ width: '65px', height: '17px', fontSize: '8px' }}
              onChange={e =>
                this.IsSelectionChanged(Number(e.target.value), 'PlayTimes')
              }
            >
              {indexList}
            </select>
          </div>
        </div>
      </div>
    );
  }

  getLangResUI(item: ResourceRef) {
    return (
      <div style={{ display: 'flex' }}>
        <div
          style={{
            background: 'rgba(232, 232, 232, 1)',
            width: '35%',
            padding: '5px',
          }}
          onClick={event => this.onPreviewResource(event, item)}
        >
          {/* <img
            src={require('@/assets/mp3_icon.png')}
            style={{
              height: `${this.state.height - 2}px`,
              width: '50px',
              objectFit: 'contain',
              cursor: 'pointer',
            }}
          ></img> */}
          {CaptionsIcon()}
        </div>
        <div
          onDoubleClick={event => this.onDoubleClearResource(event)}
          style={{
            width: '65%',
            height: '100%',
            lineHeight: `${this.state.height}px`,
            textAlign: 'center',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            marginLeft: '3px',
            cursor: 'pointer',
          }}
        >
          {item.Resource.resourceName}
        </div>
      </div>
    );
  }

  render() {
    const { resRef, refType, langType } = this.props;
    let type = refType ? refType : RefSelectorType.ImageAndSkeleton;
    let defaultName;
    switch (type) {
      case RefSelectorType.ImageAndSkeleton:
        defaultName = '请拖入图片和动画';
        break;
      case RefSelectorType.Image:
        defaultName = '请拖入图片';
        break;
      case RefSelectorType.Skeleton:
        defaultName = '请拖入动画';
        break;
      case RefSelectorType.AudioAndVideo:
        defaultName = '请拖入音频和视频';
        break;
      case RefSelectorType.Audio:
        defaultName = '请拖入音频';
        break;
      case RefSelectorType.Video:
        defaultName = '请拖入视频';
        break;
      case RefSelectorType.Captions:
        defaultName = '请拖入' + langType.configValue;
      default:
        break;
    }

    let resRefview = resRef as ResourceRef;
    if (resRefview == null) {
      resRefview = new ResourceRef(new CWResource());
    }

    let style: CSSProperties = null;
    style = {
      borderRadius: '2px',
      border: '1px solid rgba(170, 170, 170, 1)',
      height: `${this.state.height}px`,
      width: `${this.state.width}px`,
      marginLeft: `${this.state.marginLeft}px`,
      float: this.state.float,
      position: 'relative',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    };

    let innerUI = () => {
      if (resRefview?.Resource)
        switch (resRefview.Resource.resourceType) {
          case CWResourceTypes.Image:
            return this.getImgResUI(resRefview);
          case CWResourceTypes.SkeletalAni:
            return this.getSKResUI(resRefview as SkResRef);
          case CWResourceTypes.Audio:
            return this.getAudioResUI(resRefview);
          case CWResourceTypes.Video:
            return this.getVideoResUI(resRefview);
          case CWResourceTypes.Captions:
            return this.getLangResUI(resRefview);
          default: {
            return this.getDefaultResUI(resRefview, defaultName);
          }
        }
      return null;
    };

    return (
      <div
        style={{ ...style, ...this.props.style }}
        onDrop={event => this.OnDropResource(event)}
        onDragOver={this.onResDragOver.bind(this)}
      >
        {innerUI()}
        {langType ? (
          <div
            style={{
              position: 'absolute',
              background: '#3333CC5F',
              bottom: 0,
              right: 0,
              fontSize: 8,
              userSelect: 'none',
              pointerEvents: 'none',
              borderRadius: 2,
            }}
          >
            {langType.configKey}
          </div>
        ) : null}
        <PreviewResource resconfig={this.resconfig} />
      </div>
    );
  }
}
