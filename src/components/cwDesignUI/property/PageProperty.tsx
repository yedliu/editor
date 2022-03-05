import React from 'react';
import ReactDOM from 'react-dom';
import { observer, inject } from 'mobx-react';
import CWSubstance from '@/modelClasses/courseDetail/cwSubstance';
import styles from '@/styles/property.less';
import { Select, Checkbox, InputNumber, Input, Button, message } from 'antd';
import { string } from 'prop-types';
import ResourceRefView from '../control/resourceRefView';
import { RefSelectorType } from '@/modelClasses/courseDetail/resRef/resourceRef';
import CacheHelper from '@/utils/cacheHelper';
import { TextControl } from '@/components/cwDesignUI/control/TextControl';
import { RichTextControl } from '@/components/cwDesignUI/control/richTextControl';
import { SnippetsOutlined } from '@ant-design/icons';
import copy from 'copy-to-clipboard';

@inject('courseware')
@observer
export default class PageProperty extends React.Component<any> {
  constructor(props) {
    super(props);
  }

  handleTextToImage = () => {
    const { TotalEditItemList } = this.props.courseware.SelectedPage;
    let textArray = TotalEditItemList.filter(
      item => item.ElementType === 1 || item.ElementType === 4,
    );
    this.props.courseware.SelectedPage.selectedItems = textArray;
    const { selectedItems } = this.props.courseware.SelectedPage;
    selectedItems.map(item => {
      if (item.convertProgress === 0) {
        if (item.ElementType === 1) {
          item.oneKeyTextToImage(
            item,
            <TextControl data={item.thisData} />,
            item.UnderLine,
          );
        }
        if (item.ElementType === 4) {
          item.oneKeyTextToImage(
            item,
            <RichTextControl data={item.thisData} />,
            item.UnderLine,
          );
        }
      }
    });
  };

  render() {
    const { courseware: _courseware } = this.props;
    var courseware = _courseware as CWSubstance;
    var seletedPage = courseware.SelectedPage;
    if (seletedPage != null && seletedPage.SelectedItem == null) {
      return (
        <div
          className="scrollableView modified-ant-elements"
          style={{
            width: '100%',
            height: '100%',
            overflow: 'auto',
          }}
        >
          <div style={{ width: 250 }}>
            <div className={styles.propdiv}>
              <label className={styles.proplbl}>编辑版本</label>
              <div style={{ float: 'right' }}>
                <Select
                  getPopupContainer={triggerNode => triggerNode.parentElement}
                  defaultValue={0}
                  onChange={value => (seletedPage.Version = value)}
                  value={
                    seletedPage.Version
                    // seletedPage.Version == null ? Number(seletedPage.Courseware.Profile.extendInfo.version || 0)
                    // :
                    // Number(seletedPage.Version)
                  }
                  style={{
                    width: 170,
                    float: 'left',
                    marginLeft: '18px',
                  }}
                  size={'small'}
                >
                  <Select.Option key={0} value={0}>
                    Ver.0
                  </Select.Option>
                  <Select.Option key={1} value={1}>
                    Ver.1
                  </Select.Option>
                  {/* {CacheHelper.BuList?.map(buitem => (
                      <Select.Option key={buitem.value} value={buitem.value}>{buitem.name}</Select.Option>
                    ))} */}
                </Select>
              </div>
            </div>
            {seletedPage.Id ? (
              <div className={styles.propdiv}>
                <label className={styles.proplbl}>编号</label>
                <div style={{ float: 'right' }}>
                  <div style={{ width: '170px', wordBreak: 'break-all' }}>
                    {seletedPage.Id}
                  </div>
                </div>
              </div>
            ) : null}
            <div className={styles.propdiv}>
              <label className={styles.proplbl}>名称</label>
              <div style={{ float: 'right' }}>
                <Input
                  size="small"
                  value={seletedPage.Name || ''}
                  onChange={event => (seletedPage.Name = event.target.value)}
                  className={styles.proptxt}
                  style={{ width: '170px' }}
                />
              </div>
            </div>

            <div className={styles.propdiv}>
              <label className={styles.proplbl}>背景</label>
              <div style={{ marginLeft: '81px' }}>
                {seletedPage.BgImgRes?.resourceName}
              </div>
            </div>
            {seletedPage.BgImgId != null && seletedPage.BgImgId != '' ? (
              <div className={styles.propdiv}>
                <label className={styles.proplbl}>背景运动</label>
                <div style={{ marginLeft: '61px' }}>
                  <Select
                    getPopupContainer={triggerNode => triggerNode.parentElement}
                    defaultValue={'0'}
                    onChange={value =>
                      (seletedPage.CirculationMode = Number(value || 0))
                    }
                    value={String(seletedPage.CirculationMode || 0)}
                    style={{
                      width: 76,
                      float: 'left',
                      marginLeft: '18px',
                    }}
                    size={'small'}
                  >
                    <Select.Option value={'0'}>静止</Select.Option>
                    <Select.Option value={'1'}>右到左</Select.Option>
                    <Select.Option value={'2'}>左到右</Select.Option>
                    <Select.Option value={'3'}>上到下</Select.Option>
                    <Select.Option value={'4'}>下到上</Select.Option>
                  </Select>
                  <InputNumber
                    style={{ marginLeft: '12px', width: '75px' }}
                    size="small"
                    defaultValue={0}
                    min={0}
                    max={30}
                    step={1}
                    formatter={value => `${value}秒`}
                    parser={value => value.replace('秒', '')}
                    value={seletedPage.CirculationSpeed}
                    onChange={value =>
                      (seletedPage.CirculationSpeed = Number(value))
                    }
                  />
                </div>
              </div>
            ) : null}
            {seletedPage.BgAudioId != null && seletedPage.BgAudioId != '' ? (
              <div>
                <div className={styles.propdiv}>
                  <label className={styles.proplbl}>背景音乐</label>
                  <div style={{ marginLeft: '81px' }}>
                    <div
                      style={{
                        float: 'left',
                        width: '68px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        wordBreak: 'break-all',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {seletedPage.BgAudio?.resourceName}
                    </div>

                    <Checkbox
                      checked={seletedPage.IsBgAudioRecycle}
                      onChange={event =>
                        (seletedPage.IsBgAudioRecycle = event.target.checked)
                      }
                      style={{
                        float: 'right',
                        height: '20px',
                        fontSize: '10px',
                      }}
                    >
                      循环播放
                    </Checkbox>
                  </div>
                </div>
                <div className={styles.propdiv}>
                  <label className={styles.proplbl}>音量控制</label>
                  <div style={{ marginLeft: '81px' }}>
                    <div
                      style={{
                        float: 'left',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        wordBreak: 'break-all',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      <InputNumber
                        size="small"
                        defaultValue={100}
                        min={0}
                        max={100}
                        step={1}
                        formatter={value => `${value}%`}
                        parser={value => value.replace('%', '')}
                        value={seletedPage.BgAudioVolume}
                        onChange={value =>
                          (seletedPage.BgAudioVolume = Number(value))
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
            {seletedPage.FSVideoId != null && seletedPage.FSVideoId != '' ? (
              <div className={styles.propdiv}>
                <label className={styles.proplbl}>页面视频</label>
                <div style={{ marginLeft: '81px' }}>
                  <div
                    style={{
                      float: 'left',
                      width: '68px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      wordBreak: 'break-all',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {seletedPage.FullScreenVideo?.resourceName}
                  </div>
                  <Checkbox
                    checked={seletedPage.IsClosedVideo}
                    onChange={event =>
                      (seletedPage.IsClosedVideo = event.target.checked)
                    }
                    style={{ float: 'right', height: '20px', fontSize: '10px' }}
                  >
                    自动关闭
                  </Checkbox>
                </div>
              </div>
            ) : null}

            <div className={styles.propdiv}>
              <label className={styles.proplbl}>过场动画</label>
              <div style={{ marginLeft: '61px' }}>
                <Select
                  getPopupContainer={triggerNode => triggerNode.parentElement}
                  defaultValue={'0'}
                  onChange={value =>
                    (seletedPage.OpAnimationType = Number(value || 0))
                  }
                  value={String(seletedPage.OpAnimationType || 0)}
                  style={{
                    width: 76,
                    float: 'left',
                    marginLeft: '18px',
                  }}
                  size={'small'}
                >
                  <Select.Option value={'0'}>默认</Select.Option>
                  <Select.Option value={'1'}>公路</Select.Option>
                  <Select.Option value={'2'}>飞行</Select.Option>
                  <Select.Option value={'3'}>散步</Select.Option>
                  <Select.Option value={'4'}>擦除</Select.Option>
                </Select>

                <Checkbox
                  checked={seletedPage.HasOpAnimationAudio}
                  onChange={event =>
                    (seletedPage.HasOpAnimationAudio = event.target.checked)
                  }
                  style={{ float: 'right', height: '20px', fontSize: '10px' }}
                >
                  播放旋律
                </Checkbox>
              </div>
            </div>
            <div className={styles.propdiv}>
              <label className={styles.proplbl}>装饰下标</label>
              <div style={{ marginLeft: '61px' }}>
                <Select
                  getPopupContainer={triggerNode => triggerNode.parentElement}
                  defaultValue={'0'}
                  onChange={value =>
                    (seletedPage.AdornerMode = Number(value || 0))
                  }
                  value={String(seletedPage.AdornerMode || 0)}
                  style={{
                    width: 85,
                    float: 'left',
                    marginLeft: '18px',
                  }}
                  size={'small'}
                >
                  <Select.Option value={'0'}>生成顺序</Select.Option>
                  <Select.Option value={'1'}>父元素顺序</Select.Option>
                </Select>

                <InputNumber
                  style={{ marginLeft: '12px', width: '75px' }}
                  size="small"
                  defaultValue={0}
                  min={0}
                  max={9999}
                  step={1}
                  formatter={value => `第${value}层`}
                  parser={value => value.replace('层', '').replace('第', '')}
                  value={seletedPage.AdornerIndex}
                  onChange={value => (seletedPage.AdornerIndex = Number(value))}
                />
              </div>
            </div>
            <div
              className={styles.propdiv}
              style={{ height: '1px', width: '95%', background: '#3333332F' }}
            ></div>
            <div className={styles.propdiv}>
              <label className={styles.proplbl}>作答用时</label>
              <div style={{ marginLeft: '81px' }}>
                <div style={{ float: 'left' }}>
                  <InputNumber
                    size="small"
                    defaultValue={0}
                    min={0}
                    max={9999}
                    step={1}
                    formatter={value => `${value}秒`}
                    parser={value => value.replace('秒', '')}
                    value={seletedPage.QuizTime}
                    onChange={value => (seletedPage.QuizTime = Number(value))}
                  />
                </div>
              </div>
            </div>
            <div className={styles.propdiv}>
              <label className={styles.proplbl}>页面类型</label>
              <div style={{ marginLeft: '61px' }}>
                <Select
                  getPopupContainer={triggerNode => triggerNode.parentElement}
                  defaultValue={0}
                  onChange={value => (seletedPage.PageType = value)}
                  value={Number(seletedPage.PageType || 0)}
                  style={{
                    width: 120,
                    float: 'left',
                    marginLeft: '18px',
                  }}
                  size={'small'}
                >
                  {CacheHelper.BuList?.map(buitem => (
                    <Select.Option key={buitem.value} value={buitem.value}>
                      {buitem.name}
                    </Select.Option>
                  ))}
                </Select>
              </div>
            </div>

            <div className={styles.propdiv}>
              <label className={styles.proplbl}></label>
              <div style={{ marginLeft: '61px' }}>
                <Checkbox
                  checked={seletedPage.IsOldInit}
                  onChange={event =>
                    (seletedPage.IsOldInit = event.target.checked)
                  }
                  style={{
                    float: 'left',
                    marginLeft: '18px',
                    height: '20px',
                    fontSize: '10px',
                  }}
                >
                  1.0初始化
                </Checkbox>
              </div>
            </div>

            <div className={styles.propdiv}>
              <label className={styles.proplbl}>文本转图</label>
              <div style={{ marginLeft: '80px' }}>
                <Button
                  size="small"
                  type="primary"
                  onClick={this.handleTextToImage}
                >
                  一键转换
                </Button>
              </div>
            </div>

            {(seletedPage.FullScreenVideo &&
              seletedPage.FullScreenVideo.resourceId &&
              seletedPage.CaptionsDetail &&
              seletedPage.CaptionsDetail.length > 0) ||
            (seletedPage.HasNewVideoPlayerComplex &&
              seletedPage.CaptionsDetail &&
              seletedPage.CaptionsDetail.length > 0)
              ? [
                  <div
                    key={0}
                    className={styles.propdiv}
                    style={{
                      height: '1px',
                      width: '95%',
                      background: '#3333332F',
                      marginBottom: '3px',
                    }}
                  ></div>,
                  <div
                    key={1}
                    style={{
                      display: '-webkit-box',
                      WebkitBoxOrient: 'vertical',
                      WebkitBoxAlign: 'start',
                      WebkitBoxPack: 'start',
                      float: 'left',
                      marginLeft: '15px',
                      width: '100%',
                      position: 'relative',
                    }}
                  >
                    页面视频字幕
                    {seletedPage.CaptionsDetail.map((pcvm, i) => {
                      return (
                        <ResourceRefView
                          style={{
                            marginTop: '2px',
                            marginBottom: '2px',
                          }}
                          key={i}
                          refType={RefSelectorType.Captions}
                          resRef={pcvm.Captions}
                          langType={pcvm.Lang}
                          float="left"
                          selectionChanged={value => (pcvm.Captions = value)}
                        />
                      );
                    })}
                  </div>,
                ]
              : null}
          </div>
        </div>
      );
    }

    return <div></div>;
  }
}
