import React, { PureComponent } from 'react';
import ElementResizerUI from '../elements/elementResizerView';
import EditItemView from '../elements/elementItemUI';
import { observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import CWSubstance from '@/modelClasses/courseDetail/cwSubstance';
import CWResource from '@/modelClasses/courseDetail/cwResource';
import { deserialize } from '@/class-transformer';
import {
  AppearTypes,
  CWResourceTypes,
  ElementTypes,
} from '@/modelClasses/courseDetail/courseDetailenum';
import { Point2D, noCalcSize } from '@/utils/Math2D';
import { from } from 'linq-to-typescript';
import CWElement from '@/modelClasses/courseDetail/cwElement';
import CWPage from '@/modelClasses/courseDetail/cwpage';
import RUHelper from '@/redoundo/redoUndoHelper';
import { Dropdown } from 'antd';
import ElementContextMenu from '../itemstree/itemContextMenu';
import TypeMapHelper from '@/configs/typeMapHelper';

@observer
class ResizeLayer extends PureComponent<any> {
  render() {
    var PageData = this.props.pageData as CWPage;

    return (
      <div
        className={`resizeLayer ${noCalcSize}`}
        style={{
          position: 'absolute',
          zIndex: 2,
          // display: `${isMainView ? 'inline' : 'none'}`,
        }}
      >
        {PageData?.SelectedItems?.map((element, i) => {
          return (
            <ElementResizerUI
              key={element.Id || i}
              dataContext={element}
              dragable={false}
              courseware={PageData.Courseware}
            />
          );
        })}
      </div>
    );
  }
}

@observer
class ItemsLayer extends PureComponent<any> {
  render() {
    var PageData = this.props.pageData as CWPage;
    var courseware = PageData?.Courseware;
    var isMainView = this.props.isMainView;
    return (
      <div style={{ position: 'absolute' }}>
        {PageData?.Elements.map((element, i) => {
          return (
            <Dropdown
              key={element.Id || i}
              transitionName="fade"
              disabled={element.IsShowToolbar}
              overlay={ElementContextMenu({
                courseware: courseware,
                targetElement: element,
              })}
              trigger={['contextMenu']}
            >
              <div
                className="elementContainer"
                key={element.Id || i}
                style={{
                  position: 'absolute',
                  left: `${element.X}px`,
                  top: `${element.Y}px`,
                  display:
                    (isMainView && element.IsDesignHide) ||
                    (!isMainView && element.AppearType == AppearTypes.CEvent)
                      ? 'none'
                      : 'block',
                  pointerEvents: 'none',
                }}
              >
                <EditItemView
                  dataContext={element}
                  courseware={this.props.courseware}
                  isMainView={isMainView}
                />
              </div>
            </Dropdown>
          );
        })}
      </div>
    );
  }
}

@observer
class StageScaler extends PureComponent<any> {
  private div: HTMLDivElement;
  private stageTransfrom: string;

  componentDidUpdate() {
    if (this.div && this.div.parentElement) {
      this.div.parentElement.style.transform = this.stageTransfrom;
    }
  }

  render() {
    const { isMainView } = this.props;
    if (isMainView) {
      this.stageTransfrom = `scale(${this.props.courseware.StageScale},${this.props.courseware.StageScale})`;
    }
    return (
      <div ref={v => (this.div = v)} style={{ position: 'absolute' }}></div>
    );
  }
}

@inject('courseware')
@observer
class StageCanvas extends React.Component<any> {
  constructor(props: any) {
    super(props);
  }

  OnDragOver(e: React.DragEvent<HTMLDivElement>) {
    if (!e.dataTransfer.types.includes('res')) return;
    e.preventDefault();
  }

  OnDropElement = (event: React.DragEvent<HTMLDivElement>) => {
    if (event.dataTransfer.getData('res') == '') return;
    let source: CWResource = deserialize(
      CWResource,
      event.dataTransfer.getData('res'),
    );
    event.preventDefault();
    event.stopPropagation();
    if (
      source.resourceType == CWResourceTypes.Image ||
      source.resourceType == CWResourceTypes.SkeletalAni ||
      source.resourceType == CWResourceTypes.ComplexControl
    ) {
      const { clientX, clientY } = event;
      let course: CWSubstance = this.props.courseware as CWSubstance;
      var target = event.currentTarget;
      var rect = target.getBoundingClientRect();
      var offsetx = (clientX - rect.x) / course.StageScale;
      var offsety = (clientY - rect.y) / course.StageScale;
      this.AddElementToSource(source, new Point2D(offsetx, offsety));
    }
  };

  AddElementToSource(source: CWResource, position: Point2D) {
    let course: CWSubstance = this.props.courseware as CWSubstance;
    let elementType = ElementTypes.Image;
    if (source.resourceType == CWResourceTypes.ComplexControl) {
      elementType = Number(source.resourceId);
    } else if (source.resourceType == CWResourceTypes.SkeletalAni) {
      elementType = ElementTypes.Skeleton;
    }
    let elementTypeDis = TypeMapHelper.ElementTypeDiscriminator.subTypes?.filter(
      p => p.name == elementType,
    )?.[0];
    let element: CWElement = Reflect.construct(elementTypeDis.value, []);
    element.Width = source.width == 0 ? elementTypeDis.width : source.width;
    element.Height = source.height == 0 ? elementTypeDis.height : source.height;
    element.X = position.x - element.Width / 2;
    element.Y = position.y - element.Height / 2;
    element.Name = source.resourceName;
    element.Scene = course.SelectedPage;
    element.ElementType = elementType;
    element.ResourceId = source.resourceId;
    element.AttachResource(source);
    element.ReBuildTriggerList();
    RUHelper.Core.CreateTransaction();
    RUHelper.AddItem(course.SelectedPage.Elements, element);
    RUHelper.SetProperty(course.SelectedPage, 'SelectedItem', element, null);
    RUHelper.Core.CommitTransaction();
  }

  render() {
    const { courseware: _cw, isMainView, PageData } = this.props;
    var courseware = _cw as CWSubstance;

    var page = PageData as CWPage;
    var bgurl = page?.BgImgRes?.resourceKey;
    return (
      <div
        onDrop={isMainView ? this.OnDropElement : undefined}
        onDragOver={isMainView ? this.OnDragOver.bind(this) : undefined}
        className="StageCanvas"
        style={{
          position: 'absolute',
          background: 'white',
          boxShadow: `0px 0px ${isMainView ? '15px 3px' : '0px 0px'}  #999999`,
          transformOrigin: '0px 0px',
          //transform: stageTransfrom,
          //zoom: `${isMainView ? this.props.courseware.StageScale : 1.0}`,
          width: `${this.props.courseware.StageSize.x}px`,
          height: `${this.props.courseware.StageSize.y}px`,
        }}
      >
        <StageScaler isMainView={isMainView} courseware={courseware} />
        <div
          className="stageBg"
          style={{
            position: 'absolute',
            background: 'transparent',
            width: '100%',
            height: '100%',
          }}
        ></div>
        {bgurl ? (
          <img
            draggable={false}
            style={{
              pointerEvents: 'none',
              position: 'absolute',
              width: '100%',
              height: '100%',
            }}
            src={bgurl}
          ></img>
        ) : null}

        <ItemsLayer pageData={PageData} isMainView={isMainView} />
        {isMainView && courseware?.LayoutCfg.isShowSafeZone ? (
          <div
            className="safeCoverLayer"
            style={{
              position: 'absolute',
              pointerEvents: 'none',
              width: '100%',
              height: '100%',
              zIndex: 1,
            }}
          >
            <img
              style={{ objectFit: 'fill', width: '100%', height: '100%' }}
              src={(() => {
                var result = null;
                switch (courseware?.Ratio) {
                  case '4:3':
                    result = require('@/assets/safezonecover/mengceng4b3_img.png');
                    break;
                  case 'ZMAI_ZUOYE':
                  case 'ZMKID_YX':
                    result = require('@/assets/safezonecover/mengceng4b3zy_img.png');
                    break;
                  default:
                    result = require('@/assets/safezonecover/mengceng_img.png');
                    break;
                }
                return result;
              })()}
            ></img>
          </div>
        ) : null}
        <div
          className={`helpLineLayer ${noCalcSize}`}
          style={{
            position: 'absolute',
            zIndex: 2,
            pointerEvents: 'none',
          }}
        ></div>

        {isMainView ? <ResizeLayer pageData={PageData} /> : null}
        <div
          className={`adornerLayer ${noCalcSize}`}
          style={{
            position: 'absolute',
            zIndex: 3,
          }}
        ></div>
      </div>
    );
  }
}

// function mapStateToProps(state: any) {
//   return {
//     courseware: state.coursewareEntity,
//   };
// }

export default StageCanvas; //connect(mapStateToProps)();
