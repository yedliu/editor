import React, { PureComponent, MouseEventHandler } from 'react';
import ResourceRefView from '../../control/resourceRefView';
import { ClassType } from '@/modelClasses/courseDetail/courseDetailenum';
import styles from '@/styles/property.less';
import speechRecognitionControllerViewModel, {
  AnswerBranchModel,
} from '@/modelClasses/courseDetail/editItemViewModels/complexControl/speechRecognitionControl/speechRecognitionControllerViewModel';
import speechRecognitionUnitBaseViewModel from '@/modelClasses/courseDetail/editItemViewModels/complexControl/speechRecognitionControl/speechRecognitionUnitBaseViewModel';
import { float } from 'html2canvas/dist/types/css/property-descriptors/float';
import {
  Select,
  Checkbox,
  Button,
  InputNumber,
  Progress,
  Tooltip,
  Modal,
  Input,
} from 'antd';
import TextBoxInfo from '../../control/textBoxInfo';
import CacheEntityServer from '@/server/CacheEntityServer';
import { observer } from 'mobx-react';
import CWResource from '@/modelClasses/courseDetail/cwResource';
import RUHelper from '@/redoundo/redoUndoHelper';
import { RichTextControl } from '../../control/richTextControl';
import speechRecognitionBaseViewModel from '@/modelClasses/courseDetail/editItemViewModels/complexControl/speechRecognitionControl/speechRecognitionBaseViewModel';
import IdHelper from '@/utils/idHelper';
import { RefSelectorType } from '@/modelClasses/courseDetail/resRef/resourceRef';
import StyledRect from '@/components/cwDesignUI/elements/resizable/Rect/StyledRect';
import TextArea from 'antd/lib/input/TextArea';
import { HelpBlueIcon } from '@/svgs/designIcons';
import ToggleButton from '@/components/cwDesignUI/control/toggleButton';
import { FlipXIcon, FlipYIcon } from '@/utils/customIcon';

const Template = props => {
  const { courseware, dataContext, isMainView } = props;
  let data = dataContext as speechRecognitionControllerViewModel;
  //InitUnits(data, courseware.Library, isMainView);
  //data.initValue(courseware.Library);
  //data.UpdateItem(data.LanguageMode);

  var reskey = data.BackgroundNormalRes?.Resource?.resourceKey;
  return (
    <div
      className="speechRecognitionCanvas"
      style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        cursor: 'pointer',
        pointerEvents: data.IsShowToolbar ? 'visible' : 'none',
      }}
    >
      <img
        onMouseDown={event => {
          data.HandShowToolbar = false;
          UnselectAll(data);
        }}
        src={reskey}
        style={{
          position: 'absolute',
          height: '100%',
          width: '100%',
          objectFit: 'fill',
          userSelect: 'none',
        }}
        draggable={false}
      ></img>

      {data.AllUnits?.map((rowUnits, i) => {
        return (data.IsSendVoiceEvent && rowUnits.ModelType == 'Authorize') ||
          (!data.ShowAuthorize && rowUnits.ModelType == 'Authorize') ||
          (!data.ShowPaly && rowUnits.ModelType == 'PalyTemplate') ||
          (data.ModeSelection == 0 && rowUnits.ModelType == 'TopicTemplate') ||
          (data.ModeSelection == 1 &&
            rowUnits.ModelType == 'TextTemplate') ? null : (
          <div
            className="unit"
            onMouseDown={e =>
              rowUnits.IsEditText ? null : rowUnits.PressLogicItem(e)
            }
            onMouseUp={e =>
              rowUnits.IsEditText ? null : rowUnits.UnitOnMouseUp(e)
            }
            onDoubleClick={e => rowUnits.DoubleClick(e)}
            key={i}
            style={{
              left: rowUnits?.X,
              top: rowUnits?.Y,
              position: 'absolute',
              float: 'left',
              width: rowUnits?.Width,
              height: rowUnits?.Height,
              border: rowUnits.IsSelected
                ? '2px solid #63AAFF'
                : '2px solid #000',
              zIndex: rowUnits.IsSelected
                ? 2
                : rowUnits?.ModelType == 'PalyTemplate' ||
                  rowUnits.ModelType == 'Authorize'
                ? 1
                : 0,
              transform: `rotate(${rowUnits.Angle}deg)`,
            }}
          >
            <div
              style={{
                //background: rowUnits.Father?.subColor,
                width: '100%',
                height: '100%',
                transform: `scaleX(${rowUnits.FlipX ? -1 : 1}) scaleY(${
                  rowUnits.FlipY ? -1 : 1
                })`,
                //borderRadius: '50%',
                //opacity: '0.5',
              }}
            >
              <img
                src={rowUnits.NormalRes?.Resource?.resourceKey}
                style={{
                  position: 'absolute',
                  height: '100%',
                  width: '100%',
                  objectFit: 'fill',
                  userSelect: 'none',
                }}
                draggable={false}
              ></img>

              {rowUnits.ModelType == 'TextTemplate' ? (
                <div style={{ width: '100%', height: '100%' }}>
                  <RichTextControl
                    data={data}
                    isMainView={isMainView}
                    width={rowUnits.Width}
                    height={rowUnits.Height}
                    x={rowUnits.X}
                    displayMode={data.DisplayMode}
                    y={rowUnits.Y}
                    HandShowToolbar={
                      rowUnits.Father?.HandShowToolbar && rowUnits.IsEditText
                    }
                  />
                </div>
              ) : (
                <h1
                  style={{
                    position: 'absolute',
                    textAlign: 'center',
                    // left: rowUnits.Width / 2 - 50,
                    // top: rowUnits.Height / 2 - 10,
                    margin: '2px',
                    fontSize: '20px',
                  }}
                >
                  {rowUnits.ModelType == 'Authorize'
                    ? '授权按钮'
                    : rowUnits.ModelType == 'PalyTemplate'
                    ? '播放按钮'
                    : rowUnits.ModelType == 'TopicTemplate'
                    ? '题目资源'
                    : // rowUnits.ModelType == "TextTemplate"?  :
                      null}
                </h1>
              )}

              {rowUnits.IsSelected ? (
                <div>
                  <div
                    onMouseDown={e => rowUnits.DragSize(e, 'left')}
                    style={{
                      position: 'absolute',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #eb5648',
                      width: '10px',
                      height: '10px',
                      left: '-5px',
                      top: rowUnits.Height / 2 - 5,
                      cursor: 'e-resize',
                    }}
                  />
                  <div
                    onMouseDown={e => rowUnits.DragSize(e, 'right')}
                    style={{
                      position: 'absolute',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #eb5648',
                      width: '10px',
                      height: '10px',
                      left: rowUnits.Width - 5,
                      top: rowUnits.Height / 2 - 5,
                      cursor: 'e-resize',
                    }}
                  />
                  <div
                    onMouseDown={e => rowUnits.DragSize(e, 'top')}
                    style={{
                      position: 'absolute',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #eb5648',
                      width: '10px',
                      height: '10px',
                      left: rowUnits.Width / 2 - 5,
                      top: '-5px',
                      cursor: 's-resize',
                    }}
                  />
                  <div
                    onMouseDown={e => rowUnits.DragSize(e, 'botton')}
                    style={{
                      position: 'absolute',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #eb5648',
                      width: '10px',
                      height: '10px',
                      left: rowUnits.Width / 2 - 5,
                      top: rowUnits.Height - 5,
                      cursor: 's-resize',
                    }}
                  />
                </div>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
};

///初始化获取的参数
// const InitUnits = (
//   data: speechRecognitionControllerViewModel,
//   reslib: Array<CWResource>,
//   isMainView,
// ) => {
//   if (isMainView != false && data._Units == null) {
//     data._Units = new Array<speechRecognitionUnitBaseViewModel>();
//     var unit = new speechRecognitionUnitBaseViewModel();
//     unit.Id = IdHelper.NewId();
//     unit.X = 0;
//     unit.Y = 0;
//     unit.Width = 200;
//     unit.Height = 150;
//     unit.ModelType = 'TextTemplate';
//     unit.Father = data;
//     unit.IsSelected = false;
//     data._Units.push(unit);
//   }
// };

const UnselectAll = dataContext => {
  dataContext.UnselectAll();
};

export default Template;

export const PropPanelTemplate = SelectedItem => {
  let SelectedUnits = SelectedItem.SelectedUnits;
  let hintLimit = null;
  let textRef;

  function info(text) {
    Modal.info({
      title: '提示',
      content: (
        <div>
          <p>请按提示要求正确填写！</p>
          <p style={{ color: 'red' }}>测评内容：{text}</p>
        </div>
      ),
      onOk() {},
    });
  }

  // 第三方识别限制
  // 识别方：第三方
  if (SelectedItem.IdentifyTheParties === 2) {
    //语言：中文
    if (SelectedItem.LanguageMode === 0) {
      // 语言模式：普通
      if (SelectedItem.TextType === 0) {
        // /测评类型
        if (SelectedItem.TextIndex === 0) {
          //字词
          hintLimit = {
            text: '仅限1个汉字',
            minNum: 1, // 字数
            maxNum: 1,
            max: 20, // 时长
            min: 2,
            mode: 'CH1',
          };
        }

        if (SelectedItem.TextIndex === 1) {
          //句子
          hintLimit = {
            text: '仅限2-20个字',
            minNum: 2,
            maxNum: 20,
            max: 40,
            min: 2,
            mode: 'CH2-20',
          };
        }

        if (SelectedItem.TextIndex === 2) {
          //段落
          hintLimit = {
            text: '仅限21-120个字',
            minNum: 21,
            maxNum: 120,
            max: 120,
            min: 2,
            mode: 'CH21-120',
          };
        }

        if (SelectedItem.TextIndex === 3) {
          //关键词
          hintLimit = {
            text: '关键词大于1个字',
            minNum: 1,
            maxNum: 1,
            max: 40,
            min: 2,
            mode: 'CH-C1',
          };
        }

        if (SelectedItem.TextIndex === 4) {
          //自由模式
          hintLimit = {
            text: '关键词大于1个字',
            minNum: 1,
            max: 120,
            min: 2,
            disable: true,
            mode: 'ZY',
          };
        }

        if (SelectedItem.TextIndex === 6) {
          //多答案模式
          hintLimit = {
            text: '字少输入一个字',
            minNum: 1,
            max: 60,
            min: 2,
            disable: true,
            mode: 'multiAnswer',
          };
        }
      }

      // 语言模式：拼音
      if (SelectedItem.TextType === 1) {
        // /测评类型
        if (SelectedItem.TextIndex === 0) {
          hintLimit = {
            text:
              '1个拼音或者单个声韵母（sh或an1或shan1)，规则：声母+韵母+声调, 0/1/2/3/4分别对应轻声和四个声调',
            minNum: 1,
            max: 20,
            min: 2,
            mode: 'PY1',
          };
        }

        if (SelectedItem.TextIndex === 1) {
          hintLimit = {
            text:
              '30个以内的拼音（拼音之间用空格区分，例如：sh an1 shan1 算作3个拼音），规则：声母+韵母+声调, 0/1/2/3/4分别对应轻声和四个声调',
            minNum: 1,
            maxNum: 30,
            max: 40,
            min: 2,
            mode: 'PY',
          };
        }
      }
    }

    //英文
    if (SelectedItem.LanguageMode === 1) {
      if (SelectedItem.TextType === 0) {
        if (SelectedItem.TextIndex === 0) {
          //单词
          hintLimit = {
            text: '仅限1个单词',
            minNum: 1,
            maxNum: 1,
            max: 20,
            min: 2,
            mode: 'US1',
          };
        }
        if (SelectedItem.TextIndex === 1) {
          //句子
          hintLimit = {
            text: '仅限2-20个单词',
            minNum: 2,
            maxNum: 20,
            max: 40,
            min: 2,
            mode: 'US2-20',
          };
        }
        if (SelectedItem.TextIndex === 2) {
          //段落
          hintLimit = {
            text: '仅限21-120个单词',
            minNum: 2,
            maxNum: 120,
            max: 120,
            min: 2,
            mode: 'US21-120',
          };
        }

        if (SelectedItem.TextIndex === 6) {
          //多答案模式
          hintLimit = {
            text: '字少输入一个字',
            minNum: 1,
            max: 60,
            min: 2,
            disable: true,
            mode: 'multiAnswer',
          };
        }
      }
    }
  }

  function handleBlur(e) {
    if (!e.target.value && hintLimit) {
      info(hintLimit.text);
    } else if (e.target.value && hintLimit) {
      let len = e.target.value.length;
      let val = e.target.value;
      let content = val.trim().split(' ');
      // 中文/数字
      let reg1 = /^[0-9\u4e00-\u9fa5]+$/;
      // 汉字中文
      let reg = /^[\u4e00-\u9fa5]+$/;

      //字母数字
      let reg2 = /^[0-9a-zA-Z]*$/g;
      // 字母
      let reg3 = /^[A-Za-z]+$/;
      switch (hintLimit.mode) {
        case 'CH1':
          if (len > 1) {
            info('只能输入一个汉字，请按提示输入');
          }
          if (!reg.test(val)) {
            info('您输入的不是中文，请按提示输入');
          }
          break;
        case 'CH2-20':
          if (len > 20 || len < 2) {
            info('句子需输入2-20个字，请按提示输入');
          }
          break;
        case 'CH21-120':
          if (len > 120 || len < 21) {
            info('段落需输入21-120个字，请按提示输入');
          }
          break;
        case 'CH-C1':
          if (len < 2) {
            info('测评内容字数需大于1个字');
          }
          break;
        case 'ZY':
          break;
        case 'PY1':
          if (content.length > 1) {
            info('测评内容只能输入1个拼音或者单个声韵母，请按提示输入');
          }
          break;
        case 'PY':
          if (content.length > 30) {
            info('测评内容最多只能输入30个拼音，请按提示输入');
          }
          break;
        case 'US1':
          if (content.length > 1) {
            info('仅限一个单词，请按提示输入');
          }
          if (!reg3.test(val)) {
            info('单词只能是英文');
          }
          break;
        case 'US2-20':
          if (content.length > 20 || content.length < 2) {
            info('单词数量为2-20个，请按提示输入');
          }
          break;
        case 'US21-120':
          if (content.length > 120 || content.length < 21) {
            info('单词数量为21-120个，请按提示输入');
          }
          break;
      }
    }

    let v1 = e.target.value.replace(/^\s+|\s+$/g, '');
    // 去掉字符串开头和结尾的空格
    SelectedItem.setValue('TextContent', v1);
  }
  return (
    <div>
      <div
        style={{
          width: '255px',
          marginTop: '5px',
          marginLeft: '15px',
          float: 'left',
          height: '353px',
          border: '1px solid #DCDCDC',
          borderRadius: '5px',
        }}
      >
        <label style={{ float: 'left' }}>语音识别</label>
        <Tooltip
          style={{ float: 'left', whiteSpace: 'pre' }}
          placement="bottom"
          title="不知道怎么用点击这里试试"
        >
          {HelpBlueIcon(
            'https://hdkj-test.zmtalent.com/zmg_editor/zmg-pro-docs/docs/%E6%8E%A7%E4%BB%B6/%E8%AF%AD%E9%9F%B3%E8%AF%86%E5%88%AB%E6%8E%A7%E4%BB%B6%E7%94%A8%E6%B3%95.html',
          )}
        </Tooltip>

        <div style={{ width: '245px', float: 'left', margin: '5px' }}>
          <label className={styles.proplbl}>背景</label>
          <ResourceRefView
            resRef={SelectedItem.BackgroundNormalRes}
            float="right"
            // style={{ width: 76, float: 'left', marginLeft: 20 }}
            selectionChanged={value =>
              SelectedItem.setValue(
                'BackgroundNormalRes',
                value,
                ClassType.resource,
              )
            }
          />
        </div>

        <div style={{ width: '245px', float: 'left', margin: '5px' }}>
          <label className={styles.proplbl}>音频文本</label>
          <ResourceRefView
            resRef={SelectedItem.VoiceText}
            refType={RefSelectorType.Audio}
            float="right"
            // style={{ width: 76, float: 'left', marginLeft: 20 }}
            selectionChanged={value =>
              SelectedItem.setValue('VoiceText', value, ClassType.resource)
            }
          />
        </div>

        <div style={{ width: '245px', float: 'left', margin: '5px' }}>
          <label className={styles.proplbl} style={{ width: '63px' }}>
            模式
          </label>
          <Select
            getPopupContainer={triggerNode => triggerNode.parentElement}
            defaultValue={0}
            style={{ width: 76, float: 'left', marginLeft: 10 }}
            onChange={value => {
              SelectedItem.setValue('ModeSelection', value);
            }}
            value={SelectedItem.ModeSelection}
            size={'small'}
          >
            <Select.Option value={0}>文字</Select.Option>
            <Select.Option value={1}>图片</Select.Option>
            <Select.Option value={2}>混合</Select.Option>
          </Select>
        </div>

        <div style={{ width: '245px', float: 'left', margin: '5px' }}>
          <label className={styles.proplbl} style={{ width: '83px' }}>
            播放学生录音
          </label>
          <Checkbox
            checked={SelectedItem.IsPlayStudentVideo}
            onChange={event =>
              SelectedItem.setValue(
                'IsPlayStudentVideo',
                event.target.checked,
                ClassType.bool,
              )
            }
            style={{ float: 'left', height: '20px', fontSize: '10px' }}
          ></Checkbox>
        </div>

        <div style={{ width: '245px', float: 'left', margin: '5px' }}>
          <label className={styles.proplbl} style={{ width: '83px' }}>
            自动触发收音
          </label>
          <Checkbox
            checked={SelectedItem.IsSendVoiceEvent}
            onChange={event =>
              SelectedItem.setValue(
                'IsSendVoiceEvent',
                event.target.checked,
                ClassType.bool,
              )
            }
            style={{ float: 'left', height: '20px', fontSize: '10px' }}
          ></Checkbox>
          <label
            className={styles.proplbl}
            style={{ width: '100%', color: '#ef3232' }}
          >
            勾选后，无需点击授权按钮，等到音频播放完成自动收音
          </label>
        </div>

        <div
          style={{
            width: '245px',
            float: 'left',
            margin: '5px',
            marginTop: '15px',
          }}
        >
          <label className={styles.proplbl} style={{ width: '83px' }}>
            {SelectedItem.ShowAuthorize ? '删除授权按钮' : '添加授权按钮'}
          </label>
          {SelectedItem.ShowAuthorize ? (
            <svg
              onClick={e => {
                SelectedItem.setValue('ShowAuthorize', false, ClassType.bool);
              }}
              viewBox="0 0 1028 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="2200"
              width="20px"
              height="20px"
            >
              <path
                d="M512.59750523 68.78900509C394.24904326 69.07750465 282.8974029 115.40643385 199.01473966 199.28909709S68.77415584 394.55239207 68.47999942 512.90509668 114.05020304 742.52671016 197.59628345 826.07279057s194.78316948 129.41114756 313.17264364 129.12264799 229.70505208-46.62379272 313.5954935-130.51423413 130.26816098-195.22016147 130.50079911-313.58064426-45.599195-229.64919065-129.1445683-313.19456395-194.70680195-129.43236076-313.12456038-129.11557692z m178.58406023 308.57291402L556.57176885 511.97171573l134.61686768 134.61686768c12.39133923 12.39133923 12.39204634 32.48236421 0.0007071 44.87370344s-32.48307131 12.39133923-44.87370344 0.00070711L511.6973583 556.84471206 377.07978351 691.46228685c-12.39133923 12.39133923-32.4816571 12.39133923-44.87299634 0s-12.39204634-32.48236421-0.0007071-44.87370344l134.61686768-134.61686768L332.21244403 377.36121201c-12.39133923-12.39133923-12.39133923-32.4816571 0-44.87299634 12.39275345-12.39275345 32.48236421-12.39204634 44.87370344-0.0007071l134.61686768 134.61686768 134.60979662-134.60979662c12.39133923-12.39133923 32.48236421-12.39063213 44.87299633 0s12.39275345 32.48307131 0.00141421 44.87441055l-0.00636396-0.00636396z"
                p-id="2201"
                fill="#d81e06"
              ></path>
            </svg>
          ) : (
            <svg
              onClick={e => {
                SelectedItem.setValue('ShowAuthorize', true, ClassType.bool);
              }}
              viewBox="0 0 1028 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="2074"
              width="20px"
              height="20px"
            >
              <path
                d="M846.74133333 178.16C757.25973333 89.1136 638.3296 40.0704 511.79306667 40.0704S266.28266667 89.1136 176.7936 178.15893333 37.97333333 385.7216 37.97333333 511.7504s49.30666667 244.52266667 138.8192 333.6 208.42026667 138.08853333 334.96853334 138.08853333 245.49866667-48.98986667 334.9472-138.08746666 138.8192-207.60533333 138.8192-333.63306667-49.23306667-244.48106667-138.78826667-333.5584z m-98.04373333 367.4368H545.63946667v203.0688c0 18.69226667-15.15306667 33.8464-33.84533334 33.8464s-33.8464-15.15413333-33.8464-33.84533333V545.59573333H274.87786667c-18.69226667 0-33.84533333-15.15306667-33.84533334-33.84533333s15.15306667-33.8464 33.84533334-33.8464h203.0688V274.8448c0-18.69226667 15.15306667-33.84533333 33.84533333-33.84533333 18.6944 0 33.8464 15.15306667 33.8464 33.84533333v203.0688h203.05813333c18.69226667 0 33.84533333 15.15413333 33.84533334 33.84533333s-15.15306667 33.84746667-33.84533334 33.84746667v-0.0096z"
                fill="#1B9B3F"
                p-id="2075"
              ></path>
            </svg>
          )}
        </div>

        <div
          style={{
            width: '245px',
            float: 'left',
            margin: '5px',
            marginTop: '0px',
          }}
        >
          <label className={styles.proplbl} style={{ width: '83px' }}>
            {SelectedItem.ShowPaly ? '删除播放按钮' : '添加播放按钮'}
          </label>
          {SelectedItem.ShowPaly ? (
            <svg
              onClick={e => {
                SelectedItem.setValue('ShowPaly', false, ClassType.bool);
              }}
              viewBox="0 0 1028 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="2200"
              width="20px"
              height="20px"
            >
              <path
                d="M512.59750523 68.78900509C394.24904326 69.07750465 282.8974029 115.40643385 199.01473966 199.28909709S68.77415584 394.55239207 68.47999942 512.90509668 114.05020304 742.52671016 197.59628345 826.07279057s194.78316948 129.41114756 313.17264364 129.12264799 229.70505208-46.62379272 313.5954935-130.51423413 130.26816098-195.22016147 130.50079911-313.58064426-45.599195-229.64919065-129.1445683-313.19456395-194.70680195-129.43236076-313.12456038-129.11557692z m178.58406023 308.57291402L556.57176885 511.97171573l134.61686768 134.61686768c12.39133923 12.39133923 12.39204634 32.48236421 0.0007071 44.87370344s-32.48307131 12.39133923-44.87370344 0.00070711L511.6973583 556.84471206 377.07978351 691.46228685c-12.39133923 12.39133923-32.4816571 12.39133923-44.87299634 0s-12.39204634-32.48236421-0.0007071-44.87370344l134.61686768-134.61686768L332.21244403 377.36121201c-12.39133923-12.39133923-12.39133923-32.4816571 0-44.87299634 12.39275345-12.39275345 32.48236421-12.39204634 44.87370344-0.0007071l134.61686768 134.61686768 134.60979662-134.60979662c12.39133923-12.39133923 32.48236421-12.39063213 44.87299633 0s12.39275345 32.48307131 0.00141421 44.87441055l-0.00636396-0.00636396z"
                p-id="2201"
                fill="#d81e06"
              ></path>
            </svg>
          ) : (
            <svg
              onClick={e => {
                SelectedItem.setValue('ShowPaly', true, ClassType.bool);
              }}
              viewBox="0 0 1028 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="2074"
              width="20px"
              height="20px"
            >
              <path
                d="M846.74133333 178.16C757.25973333 89.1136 638.3296 40.0704 511.79306667 40.0704S266.28266667 89.1136 176.7936 178.15893333 37.97333333 385.7216 37.97333333 511.7504s49.30666667 244.52266667 138.8192 333.6 208.42026667 138.08853333 334.96853334 138.08853333 245.49866667-48.98986667 334.9472-138.08746666 138.8192-207.60533333 138.8192-333.63306667-49.23306667-244.48106667-138.78826667-333.5584z m-98.04373333 367.4368H545.63946667v203.0688c0 18.69226667-15.15306667 33.8464-33.84533334 33.8464s-33.8464-15.15413333-33.8464-33.84533333V545.59573333H274.87786667c-18.69226667 0-33.84533333-15.15306667-33.84533334-33.84533333s15.15306667-33.8464 33.84533334-33.8464h203.0688V274.8448c0-18.69226667 15.15306667-33.84533333 33.84533333-33.84533333 18.6944 0 33.8464 15.15306667 33.8464 33.84533333v203.0688h203.05813333c18.69226667 0 33.84533333 15.15413333 33.84533334 33.84533333s-15.15306667 33.84746667-33.84533334 33.84746667v-0.0096z"
                fill="#1B9B3F"
                p-id="2075"
              ></path>
            </svg>
          )}
        </div>
      </div>

      <div className={styles.propdiv}>
        {SelectedItem.convertProgress == 0 ? null : (
          <Progress
            size="small"
            status={SelectedItem.ProgressStatus}
            percent={SelectedItem.convertProgress}
          />
        )}
      </div>

      {SelectedItem.HandShowToolbar ? (
        <div
          style={{
            width: '245px',
            float: 'left',
            marginLeft: '20px',
            marginTop: '10px',
          }}
        >
          <label
            className={styles.proplbl}
            style={{ width: '83px', marginTop: '5px' }}
          >
            图文转换
          </label>

          {SelectedItem.DisplayMode ? (
            <Button onClick={event => SelectedItem.ImgToText(SelectedItem)}>
              转换成文字
            </Button>
          ) : (
            <Button
              disabled={SelectedItem.isTransform}
              onClick={event => {
                var TextUnit = SelectedItem.AllUnits.filter(
                  x => x.ModelType == 'TextTemplate',
                );
                if (TextUnit != null && TextUnit.length > 0) {
                  SelectedItem.TextToImg(
                    SelectedItem,
                    <RichTextControl data={SelectedItem.thisData} />,
                    false,
                    TextUnit[0].Width,
                    TextUnit[0].Height,
                  );
                }
              }}
            >
              转换成图片
            </Button>
          )}
        </div>
      ) : null}

      {SelectedItem.ModeSelection == 1 || SelectedItem.ModeSelection == 2 ? (
        <SpeechRecognitionList SelectedItem={SelectedItem} />
      ) : null}

      <SpeechRecognitionUnitPropPanel SelectedUnits={SelectedUnits} />

      <div
        style={{
          width: '255px',
          marginTop: '5px',
          marginLeft: '15px',
          float: 'left',
          // height: '400px',
          border: '1px solid #DCDCDC',
          borderRadius: '5px',
        }}
      >
        <label style={{ float: 'left', marginLeft: '5px' }}>输出参数</label>

        <div style={{ width: '245px', float: 'left', margin: '5px' }}>
          <label className={styles.proplbl} style={{ width: '63px' }}>
            识别方
          </label>
          <Select
            getPopupContainer={triggerNode => triggerNode.parentElement}
            defaultValue={0}
            style={{ width: 120, float: 'left', marginLeft: 10 }}
            onChange={value => {
              SelectedItem.setValue('IdentifyTheParties', value);

              //修改语言
              SelectedItem.setValue('LanguageMode', 0);
              SelectedItem.UpdateLanguageSource(0, SelectedItem, value);

              if (value == 2) {
                SelectedItem.setValue('TextType', 0);
                SelectedItem.UpdateTextType(0, SelectedItem, null, value);
              }
              SelectedItem.setValue('TextIndex', 0);
              //LanguageMode语言》可能更新TextType二级语言》TextIndex文本类型
            }}
            value={SelectedItem.IdentifyTheParties}
            size={'small'}
          >
            {/* <Select.Option value={0}>掌门识别</Select.Option> */}
            {/* <Select.Option value={1}>驰声识别</Select.Option> */}
            <Select.Option value={2}>第三方识别</Select.Option>
          </Select>
        </div>

        <div style={{ width: '245px', float: 'left', margin: '5px' }}>
          <label className={styles.proplbl} style={{ width: '63px' }}>
            语言
          </label>
          <Select
            getPopupContainer={triggerNode => triggerNode.parentElement}
            defaultValue={0}
            style={{ width: 120, float: 'left', marginLeft: 10 }}
            onChange={value => {
              //修改语言
              SelectedItem.setValue('LanguageMode', value);
              SelectedItem.UpdateLanguageSource(value, SelectedItem, null);

              if (SelectedItem.IdentifyTheParties == 2) {
                SelectedItem.setValue('TextType', 0);
                SelectedItem.UpdateTextType(0, SelectedItem, value, null);
              }
              SelectedItem.setValue('TextIndex', 0);
              SelectedItem.setValue('TextContent', '');
            }}
            value={SelectedItem.LanguageMode}
            size={'small'}
          >
            <Select.Option value={0}>中文</Select.Option>
            <Select.Option value={1}>英文</Select.Option>
          </Select>
        </div>
        {SelectedItem.IdentifyTheParties == 2 ? (
          <div style={{ width: '245px', float: 'left', margin: '5px' }}>
            <label className={styles.proplbl} style={{ width: '63px' }}>
              语言模式
            </label>
            <Select
              getPopupContainer={triggerNode => triggerNode.parentElement}
              options={SelectedItem.languageModelSource}
              defaultValue={0}
              style={{ width: 120, float: 'left', marginLeft: 10 }}
              onChange={value => {
                SelectedItem.setValue('TextType', value);
                SelectedItem.UpdateTextType(value, SelectedItem, null, null);
                SelectedItem.setValue('TextIndex', 0);
              }}
              value={SelectedItem.TextType}
              size={'small'}
            ></Select>
          </div>
        ) : null}
        <div style={{ width: '245px', float: 'left', margin: '5px' }}>
          <label className={styles.proplbl} style={{ width: '63px' }}>
            测评类型
          </label>
          <Select
            getPopupContainer={triggerNode => triggerNode.parentElement}
            options={SelectedItem.TextTypeSource}
            defaultValue={0}
            style={{ width: 170, float: 'left', marginLeft: 10 }}
            onChange={value => {
              if (value === 4) {
                SelectedItem.setValue('TextContent', '');
                SelectedItem.setValue('TextIndex', value);
              } else if (value != 6) {
                SelectedItem.setValue('TextContent', '');
                SelectedItem.setValue('TextIndex', value);
              } else {
                SelectedItem.setValue('TextIndex', value);
              }
            }}
            value={SelectedItem.WebTextIndex}
            size={'small'}
          ></Select>
        </div>

        {SelectedItem.TextIndex != 6 && (
          <div style={{ width: '245px', float: 'left', margin: '5px' }}>
            <label className={styles.proplbl} style={{ width: '63px' }}>
              测评内容
            </label>
            <TextArea
              style={{
                width: 170,
                float: 'left',
                marginLeft: 10,
                height: '80px',
              }}
              onChange={event => {
                SelectedItem.setValue('TextContent', event.target.value);
              }}
              ref={el => (textRef = el)}
              onBlur={e => handleBlur(e)}
              placeholder={
                SelectedItem.TextContent || SelectedItem.WebTextIndex == 5
                  ? '识别分支文本,允许分支数1-10个,多个分支之间用"|"隔开,每个分支字数在5-20个字之间。需包含关键词'
                  : '请输入'
              }
              value={SelectedItem.TextContent}
              disabled={hintLimit ? hintLimit.disable : false}
            />
            {hintLimit && !hintLimit.disable && (
              <div style={{ color: 'red', paddingLeft: 75 }}>
                提示:{hintLimit.text}
              </div>
            )}
          </div>
        )}
        {SelectedItem.TextIndex === 6 && ( // 多答案分支
          <TextAreaList SelectedItem={SelectedItem} />
        )}
        {SelectedItem.ShowKeywords ? (
          <div style={{ width: '245px', float: 'left', margin: '5px' }}>
            <label className={styles.proplbl} style={{ width: '63px' }}>
              关键词
            </label>
            <TextArea
              style={{
                width: 170,
                float: 'left',
                marginLeft: 10,
                height: '80px',
              }}
              placeholder='识别关键词,允许1个或多个以"#"分隔表示或的关系,以"|"分隔表示且的关系'
              onChange={event =>
                SelectedItem.setValue('Keywords', event.target.value)
              }
              value={SelectedItem.Keywords}
            />
          </div>
        ) : null}
        <div style={{ width: '245px', float: 'left', margin: '5px' }}>
          <label className={styles.proplbl} style={{ width: '73px' }}>
            答题时长
          </label>
          <InputNumber
            style={{ width: 76, float: 'left', marginLeft: 10 }}
            min={hintLimit ? hintLimit.min : 2}
            max={hintLimit ? hintLimit.max : 999}
            value={Number(SelectedItem.AnswerTime) || 0}
            onChange={value => {
              //if(value>=2){
              SelectedItem.setValue('AnswerTime', value, ClassType.number);
              //}
            }}
          />
        </div>

        <div style={{ width: '245px', float: 'left', margin: '5px' }}>
          <label className={styles.proplbl} style={{ width: '73px' }}>
            答题动画时长
          </label>
          <InputNumber
            style={{ width: 76, float: 'left', marginLeft: 10 }}
            min={0}
            max={9999}
            value={Number(SelectedItem.AnswerAnimationTime) || 0}
            onChange={value =>
              SelectedItem.setValue(
                'AnswerAnimationTime',
                value,
                ClassType.number,
              )
            }
          />
        </div>
      </div>
    </div>
  );
};

@observer
class SpeechRecognitionUnitPropPanel extends PureComponent<any> {
  render() {
    const { SelectedUnits } = this.props;

    let SelectedItem;
    let SelectedItems = null;
    if (SelectedUnits != null && SelectedUnits.length > 0) {
      SelectedItems = SelectedUnits as speechRecognitionUnitBaseViewModel[];
      SelectedItem = CacheEntityServer.getPropPanel(SelectedItems);
    }

    if (SelectedItems == null) return null;

    return (
      <div>
        <div
          style={{
            width: '255px',
            marginTop: '5px',
            marginLeft: '15px',
            float: 'left',
            height: '230px',
            border: '1px solid #DCDCDC',
            borderRadius: '5px',
          }}
        >
          <label style={{ float: 'left', marginLeft: '5px' }}>
            选中格子配置
          </label>

          <div style={{ width: '245px', float: 'left', margin: '5px' }}>
            <label className={styles.proplbl} style={{ width: '68px' }}>
              资源
            </label>
            <ResourceRefView
              resRef={SelectedItem.NormalRes}
              float="left"
              selectionChanged={value =>
                SelectedItem.setValue('NormalRes', value, ClassType.resource)
              }
            />
          </div>

          <div style={{ width: '245px', float: 'left', margin: '5px' }}>
            <label className={styles.proplbl} style={{ width: '50px' }}>
              位置
            </label>
            <div style={{ float: 'left' }}>
              <TextBoxInfo
                txtnote=""
                text={SelectedItem.X || '0'}
                onTextChange={value =>
                  SelectedItem.setValue('X', value, ClassType.number)
                }
              />
              <TextBoxInfo
                txtnote=""
                text={SelectedItem.Y || '0'}
                onTextChange={value =>
                  SelectedItem.setValue('Y', value, ClassType.number)
                }
              />
            </div>
          </div>
          <div style={{ width: '245px', float: 'left', margin: '5px' }}>
            <label className={styles.proplbl} style={{ width: '50px' }}>
              宽高
            </label>
            <div style={{ float: 'left' }}>
              <TextBoxInfo
                txtnote=""
                text={SelectedItem.Width || '0'}
                onTextChange={value =>
                  SelectedItem.setValue('Width', value, ClassType.number)
                }
              />
              <TextBoxInfo
                txtnote=""
                text={SelectedItem.Height || '0'}
                onTextChange={value =>
                  SelectedItem.setValue('Height', value, ClassType.number)
                }
              />
            </div>
          </div>
          <div style={{ width: '245px', float: 'left', margin: '5px' }}>
            <label className={styles.proplbl} style={{ width: '67px' }}>
              百分比
            </label>
            <div style={{ float: 'left' }}>
              <InputNumber
                size="small"
                min={0}
                step={1}
                value={Number(SelectedItem.unitPercentSize) || null}
                onChange={value =>
                  SelectedItem.setValue(
                    'unitPercentSize',
                    value == null || value == '' ? null : Number(value),
                  )
                }
                formatter={value =>
                  value != null && value != '' ? `${value}%` : '--'
                }
                parser={value => value.replace('%', '').replace('-', '')}
              />
            </div>
          </div>
          {/* <div style={{ width: '245px', margin: '5px', display: 'flex' }}>
            <label className={styles.proplbl} style={{ width: '67px' }}>
              旋转角度
            </label>
            <Input
              size="small"
              className={styles.proptxt}
              value={SelectedItem.Angle || 0}
              onChange={event =>
                SelectedItem.setValue(
                  'Angle',
                  event.target.value,
                  ClassType.number,
                )
              }
            />
            <ToggleButton
              background={'#1D91FC'}
              marginLeft={'10'}
              width={'35'}
              isSelected={SelectedItem.FlipX}
              selectedChanged={event => SelectedItem.setValue('FlipX', event)}
              icon={<FlipXIcon />}
              selectedIcon={<FlipXIcon svgColor={['#FFFFFF', '#D5EBFF']} />}
            />
            <ToggleButton
              background={'#1D91FC'}
              marginLeft={'10'}
              width={'35'}
              isSelected={SelectedItem.FlipY}
              selectedChanged={event => SelectedItem.setValue('FlipY', event)}
              icon={<FlipYIcon />}
              selectedIcon={<FlipYIcon svgColor={['#FFFFFF', '#D5EBFF']} />}
            />
          </div> */}
        </div>
      </div>
    );
  }
}

@observer
class SpeechRecognitionList extends PureComponent<any> {
  render() {
    const { SelectedItem } = this.props;

    var s = SelectedItem;
    return (
      <div
        style={{
          width: '255px',
          marginTop: '5px',
          marginLeft: '15px',
          float: 'left',
          height: '200px',
          border: '1px solid #DCDCDC',
          borderRadius: '5px',
        }}
      >
        <label style={{ float: 'left', marginLeft: '5px' }}>题目资源列表</label>

        <div
          style={{
            width: '100%',
            height: '140px',
            border: '1px solid #CCCCCC',
            borderRadius: '2px',
            overflow: 'scroll',
            overflowX: 'hidden',
            float: 'left',
          }}
        >
          {SelectedItem?.AllUnits?.map((unit, i) => {
            return unit.ModelType == 'TopicTemplate' ? (
              <div
                key={i}
                onMouseDown={e => unit.SelectUnit(e)}
                style={{
                  width: '245px',
                  float: 'left',
                  margin: '5px',
                  backgroundColor: unit.IsSelected ? '#ef23' : null,
                }}
              >
                <label className={styles.proplbl} style={{ width: '68px' }}>
                  题目资源
                </label>
                <ResourceRefView
                  resRef={unit.NormalRes}
                  float="left"
                  selectionChanged={value => {
                    unit.NormalRes = value;
                  }}
                />
              </div>
            ) : null;
          })}
        </div>

        <div style={{ width: '245px', float: 'left', margin: '5px' }}>
          <Button
            style={{
              width: '80px',
              padding: 1,
              marginLeft: '20px',
              float: 'left',
              height: '25px',
            }}
            onClick={event => AddItemCommand(SelectedItem)}
          >
            添加题目
          </Button>
          <Button
            style={{ width: '80px', padding: 1, float: 'left', height: '25px' }}
            onClick={event => DeleteCommand(SelectedItem)}
          >
            删除选中
          </Button>
        </div>
      </div>
    );
  }
}

@observer
class TextAreaList extends PureComponent<any> {
  render() {
    const { SelectedItem } = this.props;
    return (
      <div
        style={{
          width: '245px',
          display: 'flex',
          flexDirection: 'column',
          margin: '5px',
        }}
      >
        <div>
          <label className={styles.proplbl} style={{ width: '63px' }}>
            测评内容
          </label>
          <div
            onClick={() => AddAnswerBranch(SelectedItem)}
            style={{
              display: 'flex',
              width: 60,
              fontSize: 13,
              color: '#1890ff',
              cursor: 'pointer',
            }}
          >
            增加分支
          </div>
        </div>
        <div>
          {SelectedItem?.AnswerBranchList?.map((item, index) => (
            <div
              key={index}
              style={{ position: 'relative', display: 'flex', marginTop: 5 }}
            >
              <TextArea
                key={item.Id}
                style={{
                  width: 170,
                  float: 'left',
                  marginLeft: 10,
                  height: '80px',
                }}
                onChange={event => {
                  // SelectedItem.setValue('AnswerText', event.target.value);
                  item.Text = event.target.value;
                }}
                // onBlur={e => handleBlur(e)}
                placeholder="请输入文本类容"
                value={item.Text}
              />
              {index > 0 && (
                <div style={{ position: 'absolute', right: 58, top: -5 }}>
                  <svg
                    onClick={e => {
                      DeleteAnswerBranch(SelectedItem, item);
                    }}
                    viewBox="0 0 1028 1024"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    p-id="2200"
                    width="20px"
                    height="20px"
                  >
                    <path
                      d="M512.59750523 68.78900509C394.24904326 69.07750465 282.8974029 115.40643385 199.01473966 199.28909709S68.77415584 394.55239207 68.47999942 512.90509668 114.05020304 742.52671016 197.59628345 826.07279057s194.78316948 129.41114756 313.17264364 129.12264799 229.70505208-46.62379272 313.5954935-130.51423413 130.26816098-195.22016147 130.50079911-313.58064426-45.599195-229.64919065-129.1445683-313.19456395-194.70680195-129.43236076-313.12456038-129.11557692z m178.58406023 308.57291402L556.57176885 511.97171573l134.61686768 134.61686768c12.39133923 12.39133923 12.39204634 32.48236421 0.0007071 44.87370344s-32.48307131 12.39133923-44.87370344 0.00070711L511.6973583 556.84471206 377.07978351 691.46228685c-12.39133923 12.39133923-32.4816571 12.39133923-44.87299634 0s-12.39204634-32.48236421-0.0007071-44.87370344l134.61686768-134.61686768L332.21244403 377.36121201c-12.39133923-12.39133923-12.39133923-32.4816571 0-44.87299634 12.39275345-12.39275345 32.48236421-12.39204634 44.87370344-0.0007071l134.61686768 134.61686768 134.60979662-134.60979662c12.39133923-12.39133923 32.48236421-12.39063213 44.87299633 0s12.39275345 32.48307131 0.00141421 44.87441055l-0.00636396-0.00636396z"
                      p-id="2201"
                      fill="#d81e06"
                    ></path>
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
        <div style={{ color: 'red' }}>提示: 每个分支至少一个字</div>
      </div>
    );
  }
}

const DeleteCommand = SelectedItem => {
  let data = SelectedItem as speechRecognitionControllerViewModel;
  // data.HandShowToolbar = false;
  if (data.AllUnits) {
    var selectedUnits = data.AllUnits.filter(
      x => x.IsSelected && x.ModelType == 'TopicTemplate',
    );
    if (selectedUnits.length > 0) {
      selectedUnits.forEach(element => {
        RUHelper.RemoveItem(data.AllUnits, element);
      });
    }
  }
};

const AddItemCommand = SelectedItem => {
  let data = SelectedItem as speechRecognitionControllerViewModel;
  if (data.AllUnits) {
    var unit = new speechRecognitionUnitBaseViewModel();
    unit.Id = IdHelper.NewId();
    unit.X = data.Width / 2 - data.Height / 2.5 / 2;
    unit.Y = data.Height / 2 - data.Height / 2.5 / 2;
    (unit.Width = data.Height / 2.5),
      (unit.Height = data.Height / 2.5),
      (unit.ModelType = 'TopicTemplate');
    unit.Father = data.thisData as speechRecognitionBaseViewModel;
    unit.IsSelected = false;
    RUHelper.AddItem(data.AllUnits, unit);
  }
};

const AddAnswerBranch = SelectedItem => {
  let data = SelectedItem as speechRecognitionControllerViewModel;
  let answer = new AnswerBranchModel();
  answer.Id = IdHelper.NewId();
  answer.Text = '';
  RUHelper.AddItem(data.AnswerBranchList, answer);
};

const DeleteAnswerBranch = (SelectedItem, item) => {
  let data = SelectedItem as speechRecognitionControllerViewModel;
  if (data.AnswerBranchList) {
    let selectList = data.AnswerBranchList.filter(x => {
      if (item.id) {
        return x.Id === item.Id;
      } else {
        return x.Text === item.Text;
      }
    })[0];
    RUHelper.RemoveItem(data.AnswerBranchList, selectList);
  }
};

// const guid = () => {
//   return `xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx`
//     .replace(/[xy]/g, function(c) {
//       let r = (Math.random() * 16) | 0,
//         v = c == 'x' ? r : (r & 0x3) | 0x8;
//       return v.toString(16);
//     })
//     .toUpperCase();
// };
