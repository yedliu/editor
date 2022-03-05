import React, { PureComponent, MouseEventHandler } from 'react';
import { observer } from 'mobx-react';
import styles from '@/styles/property.less';
import { ClassType } from '@/modelClasses/courseDetail/courseDetailenum';
import ResourceRefView from '../../control/resourceRefView';
import dragTheLayoutViewModel from '@/modelClasses/courseDetail/editItemViewModels/complexControl/dragTheLayoutContainer/dragTheLayoutViewModel';
import { Select, Checkbox, Input, InputNumber, Tooltip } from 'antd';
import TextBoxInfo from '../../control/textBoxInfo';
import { HelpBlueIcon } from '@/svgs/designIcons';

const Template = props => {
  const { courseware, dataContext, isMainView } = props;
  let data = dataContext as dragTheLayoutViewModel;

  var reskey = data.Background?.Resource?.resourceKey;

  var _MaxValueCount;
  var vCellWidth = 0;
  var vCellHeight = 0;
  var error = 0.5;
  if (data.Linefeed <= 3) {
    error = 1;
  }
  if (data.JumpInMode == 0) {
    vCellWidth = data.Width / data.Linefeed - error;
    vCellHeight = vCellWidth - error;
  } else if (data.JumpInMode == 1) {
    vCellHeight = data.Height / data.Linefeed - error;
    vCellWidth = vCellHeight;
  }
  var w = data.Width / vCellWidth;
  var h = data.Height / vCellHeight;
  var js = parseInt(w.toString()) * parseInt(h.toString()); //不要四舍五入
  _MaxValueCount = new Array<number>();
  for (let index = 0; index < js; index++) {
    _MaxValueCount.push(index);
    if (index >= 300) break;
  }

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
      <img
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
      {data.JumpInMode != 2 ? (
        <div
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
          }}
        >
          {_MaxValueCount?.map((item, i) => {
            return (
              <div
                key={i}
                style={{
                  float: 'left',
                  width: vCellWidth,
                  height: vCellHeight,
                  border: '1px solid #63AAFF',
                  background:
                    'repeating-linear-gradient(135deg,transparent, transparent 3%, #00000033 3%,#00000033 5%)',
                }}
              >
                <h1
                  style={{
                    marginLeft: vCellWidth / 2 - 10,
                    marginTop: vCellHeight / 2 - 10,
                  }}
                >
                  {i + 1}
                </h1>
              </div>
            );
          })}
        </div>
      ) : null}

      {_MaxValueCount?.length >= 300 ? (
        <h1
          style={{
            backgroundColor: '#DDDDDD',
            opacity: '0.8',
            position: 'absolute',
            left: data.Width / 2 - 100,
            top: data.Height / 2 - 40,
            color: '#e23',
          }}
        >
          显示部分参考
        </h1>
      ) : null}
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
          height: '260px',
          border: '1px solid #DCDCDC',
          borderRadius: '5px',
        }}
      >
        {/* <label style={{ float: 'left', marginLeft: '5px' }}>布局盒子</label> */}
        <div>
          <label style={{ float: 'left' }}>布局盒子</label>
          <Tooltip
            style={{ float: 'left', whiteSpace: 'pre' }}
            placement="bottom"
            title="不知道怎么用点击这里试试"
          >
            {HelpBlueIcon(
              'https://hdkj-test.zmtalent.com/zmg_editor/zmg-pro-docs/docs/%E6%8E%A7%E4%BB%B6/%E5%B8%83%E5%B1%80%E7%9B%92%E5%AD%90.html',
            )}
          </Tooltip>
        </div>

        <div style={{ width: '245px', float: 'left', margin: '5px' }}>
          <label className={styles.proplbl} style={{ width: '68px' }}>
            背景
          </label>
          <ResourceRefView
            resRef={SelectedItem.Background}
            float="left"
            selectionChanged={value =>
              SelectedItem.setValue('Background', value, ClassType.resource)
            }
          />
        </div>

        <div style={{ width: '245px', float: 'left', margin: '5px' }}>
          <label className={styles.proplbl} style={{ width: '68px' }}>
            判断模式
          </label>
          <Select
            getPopupContainer={triggerNode => triggerNode.parentElement}
            defaultValue={0}
            style={{ width: 130, float: 'left' }}
            onChange={value => {
              SelectedItem.setValue('JumpInMode', value);
              // if (value != 2)
              //   SelectedItem.UpdateCount(SelectedItem, null, value);
            }}
            value={SelectedItem.JumpInMode}
            size={'small'}
          >
            <Select.Option value={0}>横向换行</Select.Option>
            <Select.Option value={1}>竖向换行</Select.Option>
            <Select.Option value={2}>叠加</Select.Option>
          </Select>
        </div>

        {SelectedItem.JumpInMode == 2 ? null : (
          <div style={{ width: '245px', float: 'left', margin: '5px' }}>
            <label className={styles.proplbl} style={{ width: '68px' }}>
              {SelectedItem.JumpInMode == 0 ? '换行数量' : '换列数量'}
            </label>
            <InputNumber
              size="small"
              min={0}
              max={15}
              step={1}
              value={Number(SelectedItem.Linefeed) || 0}
              onChange={value => {
                SelectedItem.setValue('Linefeed', value, ClassType.number);
              }}
              style={{ float: 'left' }}
            />
          </div>
        )}

        <div style={{ width: '245px', float: 'left', margin: '5px' }}>
          <label className={styles.proplbl} style={{ width: '68px' }}>
            限制标签
          </label>
          <Input
            size="small"
            placeholder="不添不限制"
            value={SelectedItem.Tag}
            onChange={value =>
              SelectedItem.setValue('Tag', value.target.value, ClassType.string)
            }
            style={{ float: 'left', width: '90px' }}
          />
        </div>

        <div style={{ width: '245px', float: 'left', margin: '5px' }}>
          <label className={styles.proplbl} style={{ width: '68px' }}>
            输出标签
          </label>
          <Checkbox
            checked={SelectedItem.IsOutputTag}
            onChange={event =>
              SelectedItem.setValue(
                'IsOutputTag',
                event.target.checked,
                ClassType.bool,
              )
            }
            style={{ float: 'left', height: '20px', fontSize: '10px' }}
          ></Checkbox>
        </div>

        <div style={{ width: '245px', float: 'left', margin: '5px' }}>
          <label className={styles.proplbl} style={{ width: '68px' }}>
            等比例
          </label>
          <Checkbox
            checked={SelectedItem.IsEqualRatio}
            onChange={event =>
              SelectedItem.setValue(
                'IsEqualRatio',
                event.target.checked,
                ClassType.bool,
              )
            }
            style={{ float: 'left', height: '20px', fontSize: '10px' }}
          ></Checkbox>
        </div>
      </div>
    </div>
  );
};
