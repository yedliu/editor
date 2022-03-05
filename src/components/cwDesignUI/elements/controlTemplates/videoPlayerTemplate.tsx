import React, { PureComponent, MouseEventHandler } from 'react';
import { observer } from 'mobx-react';
import styles from '@/styles/property.less';
import { ClassType } from '@/modelClasses/courseDetail/courseDetailenum';
import ResourceRefView from '../../control/resourceRefView';
import videoPlayerComplex from '@/modelClasses/courseDetail/editItemViewModels/complexControl/videoPlayerControl/videoPlayerComplex';
import { Select, Checkbox, Button, InputNumber, Input } from 'antd';
import TextBoxInfo from '../../control/textBoxInfo';
import { RefSelectorType } from '@/modelClasses/courseDetail/resRef/resourceRef';

const Template = props => {
  const { courseware, dataContext, isMainView } = props;
  let data = dataContext as videoPlayerComplex;

  var url = data.VideoRes?.Resource?.resourceKey;
  return (
    <div
      style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        cursor: 'pointer',
        pointerEvents: data.IsShowToolbar ? 'visible' : 'none',
      }}
    >
      <video ref={x => (data.media = x)} width="100%" height="100%" controls>
        <source src={url} type="video/mp4" />
      </video>
    </div>
  );
};

///初始化获取的参数
const InitUnits = () => {};

export default Template;

export const PropPanelTemplate = SelectedItem => {
  let SelectedUnits = SelectedItem.SelectedUnits;

  return (
    <div>
      <div
        style={{
          width: '255px',
          marginTop: '5px',
          marginLeft: '15px',
          float: 'left',
          height: '100px',
          border: '1px solid #DCDCDC',
          borderRadius: '5px',
        }}
      >
        <label style={{ float: 'left', marginLeft: '5px' }}>视频控件</label>

        <div style={{ width: '245px', float: 'left', margin: '5px' }}>
          <label className={styles.proplbl} style={{ width: '68px' }}>
            配置视频
          </label>
          <ResourceRefView
            refType={RefSelectorType.Video}
            resRef={SelectedItem.VideoRes}
            float="left"
            selectionChanged={value =>
              SelectedItem.setValue('VideoRes', value, ClassType.resource)
            }
          />
        </div>
      </div>

      <TimeList SelectedItem={SelectedItem}></TimeList>
    </div>
  );
};

@observer
class TimeList extends PureComponent<any> {
  render() {
    const { SelectedItem } = this.props;

    //console.log(JSON.stringify(SelectedItem?.TimerList));

    return (
      <div
        style={{
          width: '255px',
          marginTop: '5px',
          marginLeft: '15px',
          float: 'left',
          height: '340px',
          border: '1px solid #DCDCDC',
          borderRadius: '5px',
        }}
      >
        <label style={{ float: 'left', marginLeft: '5px' }}>时间线标签</label>

        <div
          style={{
            width: '100%',
            float: 'left',
          }}
        >
          <label style={{ float: 'left', marginLeft: '23px' }}>时间</label>
          <label style={{ float: 'left', marginLeft: '30px' }}>标签</label>
          <label style={{ float: 'left', marginLeft: '20px' }}>时长</label>
          <label style={{ float: 'left', marginLeft: '30px' }}>模式</label>
        </div>

        <div
          style={{
            width: '100%',
            height: '240px',
            border: '1px solid #CCCCCC',
            borderRadius: '2px',
            overflow: 'scroll',
            overflowX: 'hidden',
            float: 'left',
          }}
        >
          {SelectedItem?.TimerList?.map((unit, i) => {
            return (
              <div
                key={i}
                //onMouseDown={e => unit.SelectUnit(e)}
                style={{
                  width: '245px',
                  float: 'left',
                  margin: '5px',
                  //backgroundColor: unit.IsSelected ? '#ef23' : null,
                }}
              >
                <svg
                  onClick={event => SelectedItem.DeleteItemCommand(unit)}
                  style={{
                    width: '15px',
                    height: '25px',
                    float: 'left',
                    marginLeft: '3px',
                  }}
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="3671"
                  width="200"
                  height="200"
                >
                  <path
                    d="M608 768c-17.696 0-32-14.304-32-32L576 384c0-17.696 14.304-32 32-32s32 14.304 32 32l0 352C640 753.696 625.696 768 608 768zM416 768c-17.696 0-32-14.304-32-32L384 384c0-17.696 14.304-32 32-32s32 14.304 32 32l0 352C448 753.696 433.696 768 416 768zM928 224l-160 0L768 160c0-52.928-42.72-96-95.264-96L352 64C299.072 64 256 107.072 256 160l0 64L96 224C78.304 224 64 238.304 64 256s14.304 32 32 32l832 0c17.696 0 32-14.304 32-32S945.696 224 928 224zM320 160c0-17.632 14.368-32 32-32l320.736 0C690.272 128 704 142.048 704 160l0 64L320 224 320 160zM736.128 960 288.064 960c-52.928 0-96-43.072-96-96L192.064 383.52c0-17.664 14.336-32 32-32s32 14.336 32 32L256.064 864c0 17.664 14.368 32 32 32l448.064 0c17.664 0 32-14.336 32-32L768.128 384.832c0-17.664 14.304-32 32-32s32 14.336 32 32L832.128 864C832.128 916.928 789.056 960 736.128 960z"
                    p-id="3672"
                  ></path>
                </svg>

                <InputNumber
                  style={{ float: 'left', width: '52px' }}
                  size="small"
                  max={120}
                  min={0}
                  step={1}
                  value={unit.Delay || 0}
                  onChange={value => (unit.Delay = value)}
                />

                <Input
                  size="small"
                  style={{ float: 'left', width: 36, marginLeft: '2px' }}
                  value={unit.VideoTag || ''}
                  onChange={value => {
                    unit.VideoTag = value.target.value;
                  }}
                  // onTextChange={value => {
                  //   unit.VideoTag = value;
                  // }}
                />

                <InputNumber
                  style={{ float: 'left', width: '52px', marginLeft: '2px' }}
                  size="small"
                  max={1200}
                  min={0}
                  step={1}
                  value={unit.AnswerTimer || 0}
                  onChange={value => (unit.AnswerTimer = value)}
                />

                <Select
                  getPopupContainer={triggerNode => triggerNode.parentElement}
                  defaultValue={0}
                  style={{ width: 70, float: 'left', marginLeft: '2px' }}
                  onChange={value => (unit.TaskType = value)}
                  value={unit.TaskType || 0}
                  size={'small'}
                >
                  <Select.Option value={0}>默认</Select.Option>
                  <Select.Option value={1}>语音题</Select.Option>
                </Select>
              </div>
            );
          })}
        </div>

        <div style={{ width: '245px', float: 'left', margin: '5px' }}>
          <Button
            style={{
              width: '80px',
              padding: 1,
              marginLeft: '50px',
              float: 'left',
              height: '25px',
            }}
            onClick={event => SelectedItem.AddItemCommand()}
          >
            添加
          </Button>
          <Button
            style={{
              width: '80px',
              padding: 1,
              marginLeft: '5px',
              float: 'left',
              height: '25px',
            }}
            onClick={event => SelectedItem.Sort(SelectedItem)}
          >
            排序
          </Button>
        </div>
      </div>
    );
  }
}
