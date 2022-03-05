import React from 'react';

import { inject, observer } from 'mobx-react';
import CWSubstance from '@/modelClasses/courseDetail/cwSubstance';
import CourseCommander from '@/modelClasses/courseDetail/courseCommander';
import { observable } from 'mobx';
import '../styles/footdesgin.less';
import CWElement from '@/modelClasses/courseDetail/cwElement';
import CWResource from '@/modelClasses/courseDetail/cwResource';
import { CWResourceTypes } from '@/modelClasses/courseDetail/courseDetailenum';
import { from } from 'linq-to-typescript';
import convertImageViewModel from '@/modelClasses/courseDetail/editItemViewModels/complexControl/richTextControl/convertImageViewModel';
import { AudioPlayer } from '@/modelClasses/courseDetail/InvokeDesign/logicViewModels/Invokables/Effect/AudioPlayer';
import {
  StatisticEntity,
  StatisticPanel,
} from '@/components/cwDesignUI/logicView/StatisticPanel';
import { ErrorView } from '@/components/cwDesignUI/error/errorView';
import CWPage from '@/modelClasses/courseDetail/cwpage';
import CacheHelper from '@/utils/cacheHelper';
import { CloseCircleOutlined } from '@ant-design/icons';

@inject('courseware', 'commander')
@observer
export class LayoutFootDesgin extends React.Component<any, any> {
  @observable
  statisticEntity: StatisticEntity;

  //是否显示错误页面
  @observable
  isShowErrorView: boolean = false;

  render() {
    let courseware = this.props.courseware as CWSubstance;
    let lcfg = courseware.LayoutCfg;
    let totalSource = new Array<CWResource>();
    let imgsource = new Array<CWResource>();
    let sksource = new Array<CWResource>();
    let videosource = new Array<CWResource>();
    let audiosource = new Array<CWResource>();
    let textsource = [];
    let textcontrols = new Array<convertImageViewModel>();
    let textformatpicLength = 0;

    if (courseware.SelectedPage) {
      courseware.SelectedPage.TotalEditItemList.forEach(element => {
        totalSource = [...totalSource, ...element.GetDependencyResources()];
        textsource = [...textsource, ...element.GetDependencyFonts()];
        let textcontrol = element as convertImageViewModel;
        if (textcontrol instanceof convertImageViewModel) {
          textcontrols.push(textcontrol);
        }
      });
      textsource = from(textsource)
        .distinct()
        .toArray();
      totalSource = from(totalSource)
        .distinct((x, y) => x.resourceId == y.resourceId)
        .toArray();
      totalSource.forEach(element => {
        switch (element.resourceType) {
          case CWResourceTypes.Image:
            imgsource.push(element);
            break;
          case CWResourceTypes.SkeletalAni:
            sksource.push(element);
            break;
          case CWResourceTypes.Audio:
            audiosource.push(element);
            break;
          case CWResourceTypes.Video:
            videosource.push(element);
            break;
        }
      });
      let invokables = courseware.SelectedPage.Invokables.filter(
        p => p.Type == 'AudioPlayer',
      );
      if (invokables && invokables.length > 0) {
        invokables.forEach(invoke => {
          let audioplayer = invoke as AudioPlayer;
          if (audioplayer.Audio) audiosource.push(audioplayer.Audio.Resource);
        });
      }
      if (courseware.SelectedPage.FullScreenVideo) {
        videosource.push(courseware.SelectedPage.BgAudio);
      }
      if (textcontrols) {
        textformatpicLength = textcontrols.filter(p => p.DisplayMode == false)
          .length;
      }
    }

    return (
      <div style={{ fontSize: '10px', lineHeight: '30px' }}>
        {courseware.SelectedPage ? (
          <div style={{ display: 'flex' }}>
            <div
              className="divhoverStyle"
              onClick={() => {
                lcfg.isShowPages = !lcfg.isShowPages;
              }}
              style={{ textAlign: 'center', width: '100px' }}
            >
              第{courseware.SelectedPage.PageIndex}页 共
              {courseware.Pages.length}页
            </div>
            <div
              style={{ background: 'lightgray', width: '2px', margin: '3px' }}
            />
            <div
              className="divhoverStyle"
              onClick={() => {
                this.statisticEntity = new StatisticEntity();
                var pages = courseware.GetPageList();
                let selectedPage = courseware.SelectedPage as CWPage;
                let page = pages.find(
                  p => p.page.PageIndex == selectedPage.PageIndex,
                );
                if (page) {
                  this.statisticEntity.statisticresources = page?.resLib;
                  const setType = new Set(page.fontLib);
                  const arrayType = Array.from(setType);
                  arrayType.forEach(item => {
                    var fontResource = CacheHelper.FontList.find(
                      p =>
                        p.resourceName == item &&
                        p.resourceType == CWResourceTypes.Font,
                    );
                    fontResource.referenceCount = page.fontLib.filter(
                      p => p == item,
                    ).length;
                    this.statisticEntity.statisticresources.push(fontResource);
                  });

                  this.statisticEntity.invokeablesCount =
                    page?.page?.TotalInvItems.length;
                  this.statisticEntity.visible = true;
                }
              }}
              style={{ textAlign: 'center', width: '100px' }}
            >
              元素总数：{courseware.SelectedPage.TotalEditItemList.length}
            </div>
            <div
              style={{ background: 'lightgray', width: '2px', margin: '3px' }}
            />
            <div
              className="divhoverStyle"
              style={{ textAlign: 'center', width: '100px' }}
            >
              文本：{textcontrols.length}/
              <span style={{ color: 'red' }}>{textformatpicLength}</span>
            </div>
            <div
              style={{ background: 'lightgray', width: '2px', margin: '3px' }}
            />
            <div
              className="divhoverStyle"
              style={{ textAlign: 'center', width: '80px' }}
            >
              图片：{imgsource.length}
            </div>
            <div
              style={{ background: 'lightgray', width: '2px', margin: '3px' }}
            />
            <div
              className="divhoverStyle"
              style={{ textAlign: 'center', width: '80px' }}
            >
              动画：{sksource.length}
            </div>
            <div
              style={{ background: 'lightgray', width: '2px', margin: '3px' }}
            />
            <div
              className="divhoverStyle"
              style={{ textAlign: 'center', width: '80px' }}
            >
              音频：{audiosource.length}
            </div>
            <div
              style={{ background: 'lightgray', width: '2px', margin: '3px' }}
            />
            <div
              className="divhoverStyle"
              style={{ textAlign: 'center', width: '80px' }}
            >
              视频：{videosource.length}
            </div>
            <div
              style={{ background: 'lightgray', width: '2px', margin: '3px' }}
            />
            <div
              className="divhoverStyle"
              style={{ textAlign: 'center', width: '80px' }}
            >
              执行器：{courseware.SelectedPage.TotalInvItems.length}
            </div>
            <div
              style={{ background: 'lightgray', width: '2px', margin: '3px' }}
            />
            <div
              style={{
                width: '100px',
                height: '30px',
                // position: 'absolute',
                bottom: 0,
                right: 0,
                textAlign: 'center',
              }}
            >
              {courseware.StageSize.x}*{courseware.StageSize.y}
            </div>

            {courseware.errorList.length > 0 ? (
              <div
                style={{
                  width: '100px',
                  height: '30px',
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  textAlign: 'center',
                }}
                onClick={() => {
                  this.isShowErrorView = true;
                  console.log('this.isShowErrorView', this.isShowErrorView);
                }}
              >
                <CloseCircleOutlined
                  style={{ fontSize: '12px', color: 'red' }}
                />{' '}
                错误:{courseware.errorList.length}
              </div>
            ) : null}
          </div>
        ) : null}
        <ErrorView
          courseware={courseware}
          visible={this.isShowErrorView}
          showChanged={x => (this.isShowErrorView = x)}
        />
        <StatisticPanel statisticprops={this.statisticEntity} />
      </div>
    );
  }
}
