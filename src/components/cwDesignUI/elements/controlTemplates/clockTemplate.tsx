import React from 'react';
import ResourceRefView from '../../control/resourceRefView';
import { ClassType } from '@/modelClasses/courseDetail/courseDetailenum';
import styles from '@/styles/property.less';
import { Input, Select } from 'antd';

const Template = props => {
  const { courseware, dataContext } = props;

  var reskey = dataContext.Background?.Resource?.resourceKey;
  var hourKey = dataContext.HourRes?.Resource?.resourceKey;
  var minuteKey = dataContext.MinuteRes?.Resource?.resourceKey;

  var hourX = dataContext.Width / 2 - dataContext.PHourW / 2;
  var hourY = dataContext.Height / 2 - dataContext.PHourH;

  var minuteX = dataContext.Width / 2 - dataContext.PMinuteW / 2;
  var minuteY = dataContext.Height / 2 - dataContext.PMinuteH;

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
        {reskey ? (
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
        ) : (
          <label
            style={{
              width: '100%',
              height: '100%',
              fontSize: 48,
              display: '-webkit-box',
              WebkitBoxAlign: 'center',
              WebkitBoxPack: 'center',
            }}
          >
            时钟
          </label>
        )}
        {minuteKey ? (
          <img
            src={minuteKey}
            style={{
              position: 'absolute',
              left: `${minuteX}px`,
              top: `${minuteY}px`,
              height: `${dataContext.PMinuteH}px`,
              width: `${dataContext.PMinuteW}px`,
              objectFit: 'fill',
              userSelect: 'none',
              transform: `rotate(${dataContext.MinuteAngle}deg)`,
              transformOrigin: '50% 100%',
            }}
            draggable={false}
          ></img>
        ) : null}
        {hourKey ? (
          <img
            src={hourKey}
            style={{
              position: 'absolute',
              left: `${hourX}px`,
              top: `${hourY}px`,
              height: `${dataContext.PHourH}px`,
              width: `${dataContext.PHourW}px`,
              objectFit: 'fill',
              userSelect: 'none',
              transform: `rotate(${dataContext.HourAngle}deg)`,
              transformOrigin: '50% 100%',
            }}
            draggable={false}
          ></img>
        ) : null}
      </div>
    </div>
  );
};

export default Template;

export const PropPanelTemplate = SelectedItem => {
  return (
    <div>
      <div className={styles.propdiv}>时钟控件</div>
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
            时钟模式
          </label>
          <div
            style={{
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              WebkitBoxPack: 'end',
            }}
          >
            <Select
              defaultValue={0}
              style={{ width: 170, float: 'right', marginLeft: '2px' }}
              onChange={value =>
                SelectedItem.setValue('ClockMode', value, ClassType.number)
              }
              value={SelectedItem.ClockMode || 0}
              size={'small'}
            >
              <Select.Option value={0}>联动模式</Select.Option>
              <Select.Option value={1}>不联动模式</Select.Option>
            </Select>
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
            背景图片
          </label>
          <div
            style={{
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              WebkitBoxPack: 'end',
            }}
          >
            <ResourceRefView
              resRef={SelectedItem.Background}
              float="right"
              selectionChanged={value =>
                SelectedItem.setValue('Background', value, ClassType.resource)
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
            时针图片
          </label>
          <div
            style={{
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              WebkitBoxPack: 'end',
            }}
          >
            <ResourceRefView
              resRef={SelectedItem.HourRes}
              float="right"
              selectionChanged={value =>
                SelectedItem.setValue('HourRes', value, ClassType.resource)
              }
            />
          </div>
        </div>
        <div style={{ marginTop: 5 }}>
          <label style={{ lineHeight: '28px' }}>时针尺寸</label>
          <div style={{ float: 'right' }}>
            <Input
              size="small"
              suffix="W"
              style={{ width: '80px' }}
              value={SelectedItem.PHourW || '0'}
              onChange={value =>
                SelectedItem.setValue(
                  'PHourW',
                  value.target.value,
                  ClassType.number,
                )
              }
            />
            <Input
              size="small"
              suffix="H"
              style={{ width: '80px', marginLeft: '12px' }}
              value={SelectedItem.PHourH || '0'}
              onChange={value =>
                SelectedItem.setValue(
                  'PHourH',
                  value.target.value,
                  ClassType.number,
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
            分针图片
          </label>
          <div
            style={{
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              WebkitBoxPack: 'end',
            }}
          >
            <ResourceRefView
              resRef={SelectedItem.MinuteRes}
              float="right"
              selectionChanged={value =>
                SelectedItem.setValue('MinuteRes', value, ClassType.resource)
              }
            />
          </div>
        </div>
        <div style={{ marginTop: 5 }}>
          <label style={{ lineHeight: '28px' }}>分针尺寸</label>
          <div style={{ float: 'right' }}>
            <Input
              size="small"
              suffix="W"
              style={{ width: '80px' }}
              value={SelectedItem.PMinuteW || '0'}
              onChange={value =>
                SelectedItem.setValue(
                  'PMinuteW',
                  value.target.value,
                  ClassType.number,
                )
              }
            />
            <Input
              size="small"
              suffix="H"
              style={{ width: '80px', marginLeft: '12px' }}
              value={SelectedItem.PMinuteH || '0'}
              onChange={value =>
                SelectedItem.setValue(
                  'PMinuteH',
                  value.target.value,
                  ClassType.number,
                )
              }
            />
          </div>
        </div>
        <div style={{ marginTop: 5 }}>
          <label style={{ lineHeight: '28px' }}>默认时间</label>
          <div style={{ float: 'right' }}>
            <Input
              size="small"
              suffix="H"
              style={{ width: '80px' }}
              value={SelectedItem.Hour || '0'}
              onChange={value =>
                SelectedItem.setValue(
                  'Hour',
                  value.target.value,
                  ClassType.number,
                )
              }
            />
            <Input
              size="small"
              suffix="M"
              style={{ width: '80px', marginLeft: '12px' }}
              value={SelectedItem.Minute || '0'}
              onChange={value =>
                SelectedItem.setValue(
                  'Minute',
                  value.target.value,
                  ClassType.number,
                )
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};
