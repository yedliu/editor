import React, { PureComponent } from 'react';
import TextItemTemplate from './textItemTemplate';
import styles from '@/styles/property.less';
import { TextControlPropertyToolbar } from '../../control/TextControlPropertyToolbar';
import ColorPicker from '@/components/cwDesignUI/control/sketchColor';
import {
  ClassType,
  CWResourceTypes,
} from '@/modelClasses/courseDetail/courseDetailenum';
import ResourceRefView from '../../control/resourceRefView';
import {
  RefSelectorType,
  ResourceRef,
} from '@/modelClasses/courseDetail/resRef/resourceRef';
import {
  Button,
  Checkbox,
  InputNumber,
  message,
  Modal,
  Select,
  Tooltip,
} from 'antd';
import { observer } from 'mobx-react';
import {
  CaptionsData,
  CaptionsLine,
} from '@/modelClasses/courseDetail/editItemViewModels/complexControl/captionscontrol/captionsViewModel';
import { classToPlain, plainToClass } from '@/class-transformer';
import { AppearItemIcon, delIcon, HelpBlueIcon } from '@/svgs/designIcons';
import ActionManager from '@/redoundo/actionManager';
import RUHelper from '@/redoundo/redoUndoHelper';
import HttpService from '@/server/httpServer';

export const CaptionsContentTemplate = props => {
  const { courseware, dataContext, isMainView } = props;
  var text = dataContext.Text;
  var contentWidth =
    dataContext.Width - dataContext.MarginLeft - dataContext.MarginRight;
  var contentHeight =
    dataContext.Height - dataContext.MarginTop - dataContext.MarginBottom;
  var viewbox = `0 0 ${contentWidth} ${contentHeight}`;
  var d1 = `M0,0 L${contentWidth},${contentHeight}`;
  var d2 = `M0,${contentHeight} L${contentWidth},0`;
  return (
    <div
      style={{
        background: '#33333333',
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
      }}
    >
      {/* <img
        src={dataContext.Background?.Resource?.resourceKey}
        style={{
          position: 'absolute',
          right: '0px',
          bottom: '0px',
          width: '100%',
          height: '100%',
          opacity: '1.0',
        }}
      /> */}
      <div
        style={{
          position: 'absolute',
          left: `${dataContext.MarginLeft}px`,
          top: `${dataContext.MarginTop}px`,
          right: `${dataContext.MarginRight}px`,
          bottom: `${dataContext.MarginBottom}px`,
          opacity: '1.0',
          background: '#22333333',
          border: '1px solid #88333333',
          textAlign: 'center',
        }}
      >
        <svg
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            opacity: '0.6',
          }}
          viewBox={viewbox}
          preserveAspectRatio="none"
        >
          <path stroke="black" d={d1} />
          <path stroke="black" d={d2} />
        </svg>
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            textAlign: 'center',
            lineHeight: `${contentHeight}px`,
            fontSize: 22,
          }}
        >
          {'此处为文字区域，具体显示效果需预览显示'}
        </div>
      </div>

      <img
        src={require('@/assets/controlthumb/captions.png')}
        style={{
          position: 'absolute',
          right: '3px',
          bottom: '3px',
          width: '30px',
          height: '30px',
          opacity: '0.7',
        }}
      ></img>
    </div>
  );
};

export const CaptionsPropPanelTemplate = SelectedItem => {
  var editingCaptions: CaptionsData = SelectedItem.Captions;
  var resId: string = SelectedItem.AudioRef?.ResourceId;
  var mediaUrl = SelectedItem.AudioRef?.Resource?.resourceKey;
  var resRef: ResourceRef = SelectedItem.AudioRef;
  var singleLineIndex: number = 0;
  var captionsSetAction = null;
  switch (SelectedItem.Mode) {
    case 0:
      var index = SelectedItem.CurrentCaptionsIndex || 0;
      editingCaptions = new CaptionsData();
      editingCaptions.lines.push(SelectedItem.Captions?.lines[index]);
      resRef = SelectedItem.AudioRefs?.[index];
      resId = resRef?.ResourceId;
      mediaUrl = resRef?.Resource?.resourceKey;
      singleLineIndex = index + 1;
      captionsSetAction = lines => {
        if (index != null && lines != null) {
          //替换原有的行
          var captions = SelectedItem.Captions;
          var newLine: CaptionsLine = null;
          if (lines.length > 0) newLine = plainToClass(CaptionsLine, lines[0]);
          var replaceIndex = index;
          ActionManager.Instance.CreateTransaction();
          if (captions.lines.length > replaceIndex)
            RUHelper.RemoveItemAt(captions.lines, replaceIndex);
          RUHelper.AddItem(captions.lines, newLine, replaceIndex);
          ActionManager.Instance.CommitTransaction();
        }
      };
      break;
    case 1:
      editingCaptions = SelectedItem.Captions;
      resRef = SelectedItem.AudioRef;
      resId = resRef?.ResourceId;
      mediaUrl = resRef?.Resource.resourceKey;
      captionsSetAction = lines => {
        SelectedItem.setValue(
          'Captions',
          Object.assign(new CaptionsData(), {
            lines: plainToClass(CaptionsLine, lines),
          }),
          ClassType.object,
        );
      };
      break;
  }

  return (
    <div>
      <div>
        <div className={styles.propdiv}>
          <label style={{ float: 'left' }}>自定义字幕</label>
          <Tooltip
            style={{ float: 'left', whiteSpace: 'pre' }}
            placement="bottom"
            title="不知道怎么用点击这里试试"
          >
            {HelpBlueIcon(
              'https://hdkj-test.zmtalent.com/zmg_editor/zmg-pro-docs/docs/%E6%8E%A7%E4%BB%B6/%E8%87%AA%E5%AE%9A%E4%B9%89%E5%AD%97%E5%B9%95.html',
            )}
          </Tooltip>
        </div>

        <div className={styles.propdiv}>
          <label className={styles.proplbl}>头像</label>
          <ResourceRefView
            resRef={SelectedItem.HeadIcon}
            refType={RefSelectorType.ImageAndSkeleton}
            float="right"
            selectionChanged={value =>
              SelectedItem.setValue('HeadIcon', value, ClassType.resource)
            }
          />
        </div>
        {/* <div className={styles.propdiv}>
          <label className={styles.proplbl}>背景</label>
          <ResourceRefView
            resRef={SelectedItem.Background}
            refType={RefSelectorType.ImageAndSkeleton}
            float="right"
            selectionChanged={value =>
              SelectedItem.setValue('Background', value, ClassType.resource)
            }
          />
        </div> */}
        <div className={styles.propdiv}>
          <label className={styles.proplbl}>文本样式</label>
          <TextControlPropertyToolbar
            dataContext={SelectedItem}
            style={{ width: 170, float: 'left', marginLeft: 33 }}
            onChange={(name, value, propertyType) => {
              SelectedItem.setValue(name, value, propertyType);
              SelectedItem.focusEditor();
            }}
          />
        </div>
        <div className={styles.propdiv}>
          <label className={styles.proplbl}>已读颜色</label>
          <ColorPicker
            style={{ float: 'left', marginLeft: '33px' }}
            selectedcolor={SelectedItem.ReadColor}
            selectedcolorchanged={value =>
              SelectedItem.setValue('ReadColor', value, ClassType.string)
            }
          />
        </div>

        <div className={styles.propdiv}>
          <label className={styles.proplbl}>行间距</label>
          <InputNumber
            style={{ width: '70px', marginLeft: '50px' }}
            size="small"
            step={3}
            formatter={v => `${Number(v) || 0}px`}
            parser={value => value.replaceAll('p', '').replaceAll('x', '')}
            value={Number(SelectedItem.RowSpace) || 0}
            onChange={value => SelectedItem.setValue('RowSpace', Number(value))}
          />
        </div>
        <div className={styles.propdiv}>
          <div
            style={{
              display: '-webkit-box',
              WebkitBoxOrient: 'horizontal',
              WebkitBoxPack: 'justify',
              marginTop: 5,
            }}
          >
            <label
              className={styles.normallbl}
              style={{
                display: '-webkit-box',
                WebkitBoxAlign: 'center',
              }}
            >
              边距
            </label>
            <div
              style={{
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                WebkitBoxPack: 'end',
              }}
            >
              <div
                style={{
                  display: '-webkit-box',
                  WebkitBoxOrient: 'horizontal',
                  WebkitBoxPack: 'justify',
                }}
              >
                <label className={styles.normallbl} style={{ marginRight: 5 }}>
                  左
                </label>
                <InputNumber
                  style={{ width: '70px' }}
                  size="small"
                  step={3}
                  value={SelectedItem.MarginLeft || 0}
                  onChange={value =>
                    SelectedItem.setValue('MarginLeft', Number(value))
                  }
                />
                <label
                  className={styles.normallbl}
                  style={{ marginRight: 5, marginLeft: 3 }}
                >
                  右
                </label>
                <InputNumber
                  style={{ width: '70px' }}
                  size="small"
                  step={3}
                  value={SelectedItem.MarginRight || 0}
                  onChange={value =>
                    SelectedItem.setValue('MarginRight', Number(value))
                  }
                />
              </div>
              <div
                style={{
                  display: '-webkit-box',
                  WebkitBoxOrient: 'horizontal',
                  WebkitBoxPack: 'justify',
                }}
              >
                <label className={styles.normallbl} style={{ marginRight: 5 }}>
                  上
                </label>
                <InputNumber
                  style={{ width: '70px' }}
                  size="small"
                  step={3}
                  value={SelectedItem.MarginTop || 0}
                  onChange={value =>
                    SelectedItem.setValue('MarginTop', Number(value))
                  }
                />
                <label
                  className={styles.normallbl}
                  style={{ marginRight: 5, marginLeft: 3 }}
                >
                  下
                </label>
                <InputNumber
                  style={{ width: '70px' }}
                  size="small"
                  step={3}
                  value={SelectedItem.MarginBottom || 0}
                  onChange={value =>
                    SelectedItem.setValue('MarginBottom', Number(value))
                  }
                />
              </div>
            </div>
          </div>
        </div>

        <div className={styles.propdiv}>
          <label className={styles.proplbl}>背景音量</label>
          <InputNumber
            size="small"
            style={{ marginLeft: 33 }}
            min={0}
            max={100}
            formatter={x => `${x}%`}
            value={SelectedItem.BgAudioVolume}
            onChange={v =>
              SelectedItem.setValue(
                'BgAudioVolume',
                Number(v) || 0,
                ClassType.number,
              )
            }
          ></InputNumber>
          <Checkbox
            style={{ marginLeft: '3px' }}
            value={SelectedItem.IsRestoreBgVolume}
            onChange={v =>
              SelectedItem.setValue('IsRestoreBgVolume', v, ClassType.bool)
            }
          >
            还原
          </Checkbox>
        </div>

        {/* {SelectedItem._elements.length == 1 ? (
          <div>
            <div className={styles.propdiv}>
              <label className={styles.proplbl}>音频模式</label>
              <Select
                value={SelectedItem.Mode}
                style={{ float: 'left', marginLeft: '33px', width: '150px' }}
                onChange={v => {
                  SelectedItem.setValue('Mode', v, ClassType.number);
                }}
              >
                <Select.Option value={0}>多音频</Select.Option>
                <Select.Option value={1}>单音频</Select.Option>
              </Select>
            </div>

            {SelectedItem.Mode == 1
              ? SingleAudioModeTemplate(SelectedItem)
              : MultiAudioModeTemplate(SelectedItem)}
          </div>
        ) : null} */}
        {MultiAudioModeTemplate(SelectedItem)}
        <WaveCaptionsFrame
          mediaUrl={mediaUrl}
          resId={resId}
          isSingleLine={SelectedItem.Mode == 0}
          singleLineIndex={singleLineIndex}
          inputData={editingCaptions}
          visible={SelectedItem.isShowCaptionsModal}
          closeCallback={lines => {
            captionsSetAction?.(lines);
            SelectedItem.setValue('isShowCaptionsModal', false, ClassType.bool);
            message.success('修改字幕成功');
          }}
        />
        <div className={styles.propdiv} style={{ marginBottom: '10px' }}></div>
      </div>
    </div>
  );
};

const SingleAudioModeTemplate = SelectedItem => {
  return (
    <div>
      <div className={styles.propdiv}>
        <label className={styles.proplbl}>相关音频</label>
        <ResourceRefView
          resRef={SelectedItem.AudioRef}
          refType={RefSelectorType.Audio}
          float="right"
          selectionChanged={value =>
            SelectedItem.setValue('AudioRef', value, ClassType.resource)
          }
        />
      </div>

      {SelectedItem.AudioRef &&
      SelectedItem.AudioRef.Resource &&
      SelectedItem.AudioRef.ResourceType == CWResourceTypes.Audio ? (
        <div>
          <div className={styles.propdiv}>
            <label className={styles.proplbl}>编辑字幕</label>
            <Button
              size="small"
              type="primary"
              style={{ float: 'left', marginLeft: '33px' }}
              onClick={() => {
                SelectedItem.setValue(
                  'isShowCaptionsModal',
                  true,
                  ClassType.bool,
                );
              }}
            >
              打开编辑窗口
            </Button>
          </div>

          <div className={styles.propdiv}>
            <label className={styles.proplbl}>预览段落</label>
            <Select
              value={SelectedItem.CurrentCaptionsIndex}
              style={{ float: 'left', marginLeft: '33px', maxWidth: '150px' }}
              onChange={v => {
                SelectedItem.setValue(
                  'CurrentCaptionsIndex',
                  v,
                  ClassType.number,
                );
              }}
            >
              {SelectedItem.Captions?.lines?.map((line, i) => {
                return (
                  <Select.Option key={i} value={i}>
                    <div style={{ maxWidth: '180px' }}>
                      {`#${line.lineIndex}${line.content}`}
                    </div>
                  </Select.Option>
                );
              })}
            </Select>
          </div>
        </div>
      ) : null}
    </div>
  );
};

const MultiAudioModeTemplate = SelectedItem => {
  return (
    <div className={styles.propdiv}>
      <Button
        size="small"
        type="primary"
        style={{ borderRadius: '3px' }}
        onClick={() => SelectedItem.addNewAudio?.()}
      >
        新增音频
      </Button>
      <br />
      <div
        style={{
          border: '1px solid #3333332F',
          marginTop: '3px',
          minHeight: '50px',
          borderRadius: '3px',
          display: '-webkit-box',
          WebkitBoxOrient: 'vertical',
          WebkitBoxAlign: 'start',
          WebkitBoxPack: 'start',
        }}
      >
        {SelectedItem?.AudioRefs?.map((audioRef, i) => {
          return (
            <div
              key={i}
              style={{
                margin: '3px',
                border: '1px soild #3333332F',
                borderRadius: '2px',
              }}
            >
              <div
                style={{
                  display: '-webkit-box',
                  WebkitBoxPack: 'start',
                  WebkitBoxAlign: 'center',
                  WebkitBoxOrient: 'horizontal',
                }}
              >
                <ResourceRefView
                  width={180}
                  resRef={audioRef}
                  refType={RefSelectorType.Audio}
                  selectionChanged={value =>
                    SelectedItem.replaceAudio(value, i)
                  }
                />

                <div
                  style={{
                    position: 'relative',
                    width: '8px',
                    height: '30px',
                    margin: '3px',
                    background: 'transparent',
                    display: '-webkit-box',
                    WebkitBoxOrient: 'vertical',
                    WebkitBoxAlign: 'stretch',
                    WebkitBoxPack: 'center',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      width: '8px',
                      height: '4px',
                      background: 'transparent',
                      cursor: 'pointer',
                      top: '5px',
                    }}
                    onClick={() => SelectedItem.moveAudioCaptions(i, 'up')}
                  >
                    <svg
                      // width="8"
                      // height="4"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      pointerEvents="none"
                      preserveAspectRatio="xMinYMin meet"
                    >
                      <path
                        d="M0,3 L4,0 L8,3"
                        strokeWidth="1"
                        stroke="#333333"
                        fill="transparent"
                        strokeLinecap="round"
                      ></path>
                    </svg>
                  </div>
                  <div
                    style={{
                      position: 'absolute',
                      width: '8px',
                      height: '4px',
                      background: 'transparent',
                      bottom: '5px',
                      cursor: 'pointer',
                    }}
                    onClick={() => SelectedItem.moveAudioCaptions(i, 'down')}
                  >
                    <svg
                      // width="8"
                      // height="4"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      pointerEvents="none"
                      preserveAspectRatio="xMinYMin meet"
                    >
                      <path
                        d="M0,0 L4,3 L8,0"
                        strokeWidth="1"
                        fill="transparent"
                        stroke="#333333"
                        strokeLinecap="round"
                      ></path>
                    </svg>
                  </div>
                </div>

                <div
                  style={{
                    width: '16px',
                    height: '16px',
                    marginLeft: '3px',
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    SelectedItem.removeAudioCaptions?.(i);
                  }}
                >
                  {delIcon()}
                </div>
              </div>
              <div
                style={{
                  marginTop: '3px',
                  display: '-webkit-box',
                  WebkitBoxOrient: 'horizontal',
                  WebkitBoxAlign: 'center',
                  WebkitBoxPack: 'start',
                }}
              >
                <div
                  style={{
                    height: '25px',
                    width: '160px',
                    background: '#CCCCCC5F',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {SelectedItem.Captions?.lines?.[i]?.content}
                </div>
                <div
                  style={{
                    width: '30px',
                    height: '18px',
                    fontSize: '8px',
                    cursor: 'pointer',
                    borderRadius: '2px',
                    background: 'rgb(24,144,255)',
                    color: 'white',
                    textAlign: 'center',
                    marginLeft: '3px',
                  }}
                  onClick={() => {
                    SelectedItem.setValue(
                      'CurrentCaptionsIndex',
                      i,
                      ClassType.number,
                    );
                    SelectedItem.setValue(
                      'isShowCaptionsModal',
                      true,
                      ClassType.bool,
                    );
                  }}
                >
                  配置
                </div>
                <div
                  style={{
                    width: '16px',
                    height: '16px',
                    marginLeft: '3px',
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    SelectedItem.viewAudioCaptions?.(i);
                  }}
                >
                  {AppearItemIcon('rgb(24,144,255)')}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

@observer
export class WaveCaptionsFrame extends PureComponent<{
  mediaUrl: string;
  resId?: string;
  isSingleLine: boolean;
  singleLineIndex: number;
  visible: boolean;
  inputData: CaptionsData;
  closeCallback: (data: any) => any;
}> {
  constructor(props) {
    super(props);
  }

  iframe: HTMLIFrameElement;

  oniframemessage = ((e: MessageEvent) => {
    const {
      mediaUrl,
      resId,
      inputData,
      isSingleLine,
      singleLineIndex,
      closeCallback,
    } = this.props;
    if (e.data?.message == 'wave_captions_ready') {
      var resCaptions: string = null;

      var postData = () => {
        this.iframe?.contentWindow.postMessage(
          {
            message: 'wave_load_data',
            data: {
              url: mediaUrl,
              resCaptions: resCaptions,
              isSingleLine: isSingleLine,
              singleLineIndex: singleLineIndex,
              lines: inputData?.lines ? classToPlain(inputData?.lines) : null,
            },
          },
          '*',
        );
      };

      if (resId) {
        try {
          HttpService.GetAudioResourceCaptions(resId).then(response => {
            if (
              response.code == '0' &&
              response.data != null &&
              response.data.resultDetail != null
            ) {
              resCaptions = response.data.resultDetail;
            }
            postData();
          });
        } catch (error) {
          console.error(error);
          postData();
        }
      } else {
        postData();
      }
    } else if (e.data?.message == 'wave_captions_save') {
      var lines = e.data?.lines;
      closeCallback?.(lines);
    }
  }).bind(this);

  onIFrameRef(iframe: HTMLIFrameElement) {
    this.iframe = iframe;
    if (iframe) {
      window.addEventListener('message', this.oniframemessage);
      iframe.src = process.env.waveCaptionsToolUrl;
    }
  }

  onIframeClosing(callback: (data: any) => void) {
    if (this.iframe) {
      this.iframe.contentWindow?.postMessage(
        {
          message: 'wave_export_lines',
        },
        '*',
      );
    }
  }

  componentDidMount() {}

  componentWillUnmount() {
    window.removeEventListener('message', this.oniframemessage);
  }

  render() {
    const { mediaUrl, inputData, visible, closeCallback } = this.props;
    return (
      <Modal
        destroyOnClose={true}
        style={{ padding: '0px' }}
        width="1200px"
        title={'字幕制作'}
        centered
        visible={visible}
        footer={null}
        maskClosable={false}
        onCancel={e => {
          this.onIframeClosing(closeCallback);
        }}
      >
        <div
          style={{
            height: 720,
            width: 1200,
            marginLeft: -22,
            marginTop: -24,
            marginBottom: -24,
          }}
        >
          <iframe
            style={{
              height: 720,
              width: 1196,
              margin: '0px',
              padding: '0px',
              overflow: 'hidden',
              border: 'none',
              userSelect: 'none',
            }}
            ref={this.onIFrameRef.bind(this)}
          ></iframe>
        </div>
      </Modal>
    );
  }
}
