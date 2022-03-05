import React from 'react';
import ResourceRefView from '../../control/resourceRefView';
import { ClassType } from '@/modelClasses/courseDetail/courseDetailenum';
import styles from '@/styles/property.less';

const Template = props => {
  const { courseware, dataContext } = props;

  var reskey = dataContext.StandRes?.resourceKey;
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
            棋子
          </label>
        )}
      </div>
    </div>
  );
};

export default Template;

export const PropPanelTemplate = SelectedItem => {
  return (
    <div>
      <div className={styles.propdiv}>迷宫棋子</div>
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
            站立状态
          </label>
          <div
            style={{
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              WebkitBoxPack: 'end',
            }}
          >
            <ResourceRefView
              resRef={SelectedItem.StandRes}
              float="right"
              selectionChanged={value =>
                SelectedItem.setValue('StandRes', value, ClassType.resource)
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
            向上状态
          </label>
          <div
            style={{
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              WebkitBoxPack: 'end',
            }}
          >
            <ResourceRefView
              resRef={SelectedItem.UpRes}
              float="right"
              selectionChanged={value =>
                SelectedItem.setValue('UpRes', value, ClassType.resource)
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
            向下状态
          </label>
          <div
            style={{
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              WebkitBoxPack: 'end',
            }}
          >
            <ResourceRefView
              resRef={SelectedItem.DownRes}
              float="right"
              selectionChanged={value =>
                SelectedItem.setValue('DownRes', value, ClassType.resource)
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
            向左状态
          </label>
          <div
            style={{
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              WebkitBoxPack: 'end',
            }}
          >
            <ResourceRefView
              resRef={SelectedItem.LeftRes}
              float="right"
              selectionChanged={value =>
                SelectedItem.setValue('LeftRes', value, ClassType.resource)
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
            向右状态
          </label>
          <div
            style={{
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              WebkitBoxPack: 'end',
            }}
          >
            <ResourceRefView
              resRef={SelectedItem.RightRes}
              float="right"
              selectionChanged={value =>
                SelectedItem.setValue('RightRes', value, ClassType.resource)
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
            左上状态
          </label>
          <div
            style={{
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              WebkitBoxPack: 'end',
            }}
          >
            <ResourceRefView
              resRef={SelectedItem.UpLeftRes}
              float="right"
              selectionChanged={value =>
                SelectedItem.setValue('UpLeftRes', value, ClassType.resource)
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
            右上状态
          </label>
          <div
            style={{
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              WebkitBoxPack: 'end',
            }}
          >
            <ResourceRefView
              resRef={SelectedItem.UpRightRes}
              float="right"
              selectionChanged={value =>
                SelectedItem.setValue('UpRightRes', value, ClassType.resource)
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
            左下状态
          </label>
          <div
            style={{
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              WebkitBoxPack: 'end',
            }}
          >
            <ResourceRefView
              resRef={SelectedItem.DownLeftRes}
              float="right"
              selectionChanged={value =>
                SelectedItem.setValue('DownLeftRes', value, ClassType.resource)
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
            右下状态
          </label>
          <div
            style={{
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              WebkitBoxPack: 'end',
            }}
          >
            <ResourceRefView
              resRef={SelectedItem.DownRightRes}
              float="right"
              selectionChanged={value =>
                SelectedItem.setValue('DownRightRes', value, ClassType.resource)
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};
