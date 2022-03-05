import React from 'react';
import ResourceRefView from '../../control/resourceRefView';
import { ClassType } from '@/modelClasses/courseDetail/courseDetailenum';
import styles from '@/styles/property.less';
import { Input, InputNumber } from 'antd';
import {
  RefSelectorType,
  ResourceRef,
} from '@/modelClasses/courseDetail/resRef/resourceRef';

const { TextArea } = Input;

const Template = props => {
  const { courseware, dataContext } = props;
  return (
    <div style={{ position: 'absolute', width: '100%', height: '100%' }}>
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          display: '-webkit-box',
          WebkitBoxOrient: 'horizontal',
          WebkitBoxPack: 'justify',
        }}
      >
        <label
          style={{
            width: '100%',
            height: '100%',
            fontSize: 36,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          题目属性
          <div>{dataContext?.questionIndex}</div>
        </label>
      </div>
    </div>
  );
};

export default Template;

export const PropPanelTemplate = SelectedItem => {
  return (
    <div>
      <div className={styles.propdiv}>题目属性控件</div>
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
            题目顺序
          </label>
          <div
            style={{
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              WebkitBoxPack: 'end',
            }}
          >
            <InputNumber
              min={1}
              type="number"
              placeholder="根据题目出现的先后顺序填写"
              onChange={value =>
                SelectedItem.setValue(
                  'QuestionSequence',
                  value,
                  ClassType.number,
                )
              }
              size={'small'}
              value={
                SelectedItem.QuestionSequence || SelectedItem.questionIndex
              }
              style={{ width: 170, float: 'right', marginLeft: '2px' }}
            />
          </div>
        </div>
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
            示范图片
          </label>
          <div
            style={{
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              WebkitBoxPack: 'end',
            }}
          >
            <ResourceRefView
              resRef={SelectedItem.QuestionExampleBg}
              refType={RefSelectorType.Image}
              float="right"
              selectionChanged={value =>
                SelectedItem.setValue(
                  'QuestionExampleBg',
                  value,
                  ClassType.resource,
                )
              }
            />
          </div>
        </div>
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
            示范音频
          </label>
          <div
            style={{
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              WebkitBoxPack: 'end',
            }}
          >
            <ResourceRefView
              resRef={SelectedItem.QuestionExampleAudio}
              refType={RefSelectorType.Audio}
              float="right"
              selectionChanged={value =>
                SelectedItem.setValue(
                  'QuestionExampleAudio',
                  value,
                  ClassType.resource,
                )
              }
            />
          </div>
        </div>
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
            示范视频
          </label>
          <div
            style={{
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              WebkitBoxPack: 'end',
            }}
          >
            <ResourceRefView
              resRef={SelectedItem.QuestionExampleVideo}
              refType={RefSelectorType.Video}
              float="right"
              selectionChanged={value =>
                SelectedItem.setValue(
                  'QuestionExampleVideo',
                  value,
                  ClassType.resource,
                )
              }
            />
          </div>
        </div>

        <div
          style={{
            display: '-webkit-box',
            WebkitBoxOrient: 'horizontal',
            WebkitBoxPack: 'justify',
            marginTop: 25,
          }}
        >
          <label
            className={styles.normallbl}
            style={{
              display: '-webkit-box',
              WebkitBoxAlign: 'center',
            }}
          >
            解析音频
          </label>
          <div
            style={{
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              WebkitBoxPack: 'end',
            }}
          >
            <ResourceRefView
              resRef={SelectedItem.QuestionParseAudio}
              refType={RefSelectorType.Audio}
              float="right"
              selectionChanged={value =>
                SelectedItem.setValue(
                  'QuestionParseAudio',
                  value,
                  ClassType.resource,
                )
              }
            />
          </div>
        </div>

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
            解析视频
          </label>
          <div
            style={{
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              WebkitBoxPack: 'end',
            }}
          >
            <ResourceRefView
              resRef={SelectedItem.QuestionParseVideo}
              refType={RefSelectorType.Video}
              float="right"
              selectionChanged={value =>
                SelectedItem.setValue(
                  'QuestionParseVideo',
                  value,
                  ClassType.resource,
                )
              }
            />
          </div>
        </div>

        <div
          style={{
            display: '-webkit-box',
            WebkitBoxOrient: 'horizontal',
            WebkitBoxPack: 'justify',
            marginTop: 5,
            marginBottom: 5,
          }}
        >
          <label
            className={styles.normallbl}
            style={{
              display: '-webkit-box',
              WebkitBoxAlign: 'center',
            }}
          >
            解析文案
          </label>
          <div
            style={{
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              WebkitBoxPack: 'end',
            }}
          >
            <TextArea
              style={{
                width: 170,
                float: 'left',
                marginLeft: 10,
                height: '80px',
              }}
              onChange={event =>
                SelectedItem.setValue('QuestionParseText', event.target.value)
              }
              placeholder="不超过100个字"
              value={SelectedItem.QuestionParseText}
              maxLength={100}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
