import React from 'react';
import ResourceRefView from '../../control/resourceRefView';
import { ClassType } from '@/modelClasses/courseDetail/courseDetailenum';
import styles from '@/styles/property.less';
import { Checkbox } from 'antd';

const Template = props => {
  const { courseware, dataContext } = props;

  var reskey = dataContext.Res?.resourceKey;
  return (
    <div style={{ position: 'absolute', width: '100%', height: '100%' }}>
      <img
        src={reskey ? reskey : null}
        loading="lazy"
        style={{
          position: 'absolute',
          height: '100%',
          width: '100%',
          objectFit: 'fill',
          userSelect: 'none',
        }}
        draggable={false}
      ></img>
    </div>
  );
};

export default Template;

export const PropPanelTemplate = SelectedItem => {
  return (
    <div>
      <div className={styles.propdiv}>
        <label className={styles.proplbl}>资源</label>
        <ResourceRefView
          resRef={SelectedItem.ResRef}
          float="right"
          selectionChanged={value =>
            SelectedItem.setValue('ResRef', value, ClassType.resource)
          }
        />
      </div>

      <div className={styles.propdiv}>
        <label className={styles.proplbl}>选中设置</label>
        <Checkbox
          checked={SelectedItem.RunIsSelected}
          onChange={event =>
            SelectedItem.setValue(
              'RunIsSelected',
              event.target.checked,
              ClassType.bool,
            )
          }
          style={{
            marginLeft: '34px',
            height: '20px',
            fontSize: '10px',
          }}
        >
          是否支持选中
        </Checkbox>
      </div>

      {SelectedItem.RunIsSelected ? (
        <div className={styles.propdiv}>
          <label className={styles.proplbl}>资源</label>
          <ResourceRefView
            resRef={SelectedItem.RunSelectedRes}
            float="right"
            selectionChanged={value =>
              SelectedItem.setValue('RunSelectedRes', value, ClassType.resource)
            }
          />
        </div>
      ) : null}
    </div>
  );
};
