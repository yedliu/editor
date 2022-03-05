import React, { PureComponent, MouseEventHandler } from 'react';
import { observer } from 'mobx-react';
import styles from '@/styles/property.less';
import { ClassType } from '@/modelClasses/courseDetail/courseDetailenum';
import ResourceRefView from '../../control/resourceRefView';
import floatVideoPlayerComplex from '@/modelClasses/courseDetail/editItemViewModels/complexControl/floatVideoPlayerControl/floatVideoPlayerComplex';
import { Select, Checkbox, Button, InputNumber, Input } from 'antd';
import TextBoxInfo from '../../control/textBoxInfo';
import { RefSelectorType } from '@/modelClasses/courseDetail/resRef/resourceRef';

const Template = props => {
  const { courseware, dataContext, isMainView } = props;
  let data = dataContext as floatVideoPlayerComplex;

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
export default Template;

export const PropPanelTemplate = SelectedItem => {
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
        <label style={{ float: 'left', marginLeft: '5px' }}>浮动视频控件</label>
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
    </div>
  );
};
