import React from 'react';
import ResourceRefView from '../../control/resourceRefView';
import { ClassType } from '@/modelClasses/courseDetail/courseDetailenum';
import styles from '@/styles/property.less';
import { Checkbox, InputNumber, Tooltip } from 'antd';
import { TextToolbar } from '../../control/textToolbar';
import { AppearItemIcon, HelpBlueIcon } from '@/svgs/designIcons';

const Template = props => {
  const { courseware, dataContext } = props;

  var reskey = dataContext.Background?.Resource?.resourceKey;
  var btnKey = dataContext.ButtonResource?.Resource?.resourceKey;
  var topImg = (dataContext.Height - dataContext.ButtonHeight) / 2;
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
          <div>
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
            {btnKey ? (
              <img
                src={btnKey}
                style={{
                  position: 'absolute',
                  height: dataContext.ButtonHeight,
                  width: dataContext.ButtonWidth,
                  top: topImg,
                  objectFit: 'fill',
                  userSelect: 'none',
                }}
                draggable={false}
              ></img>
            ) : null}
          </div>
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
            滑动控件
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
      <div className={styles.propdiv}>
        {/* 控件-滑动控件 */}
        <label style={{ float: 'left' }}>控件-滑动控件</label>
        <Tooltip
          style={{ float: 'left', whiteSpace: 'pre' }}
          placement="bottom"
          title="不知道怎么用点击这里试试"
        >
          {HelpBlueIcon(
            'https://hdkj-test.zmtalent.com/zmg_editor/zmg-pro-docs/docs/%E6%8E%A7%E4%BB%B6/%E6%BB%91%E5%8A%A8%E6%8E%A7%E4%BB%B6.html',
          )}
        </Tooltip>
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
            模式
          </label>
          <div
            style={{
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              WebkitBoxPack: 'end',
            }}
          >
            <select
              style={{
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                WebkitBoxPack: 'end',
                width: 170,
              }}
              value={SelectedItem.SliderMode}
              onChange={e => {
                SelectedItem.setValue('SliderMode', e.target.value);
              }}
            >
              <option value={0}>普通模式</option>
              <option value={1}>数字模式</option>
            </select>
          </div>
        </div>

        {SelectedItem.SliderMode == 1 ? (
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
              文本样式
            </label>
            <TextToolbar
              dataContext={SelectedItem}
              style={{ width: 170 }}
              onChange={(name, value, propertyType) =>
                SelectedItem.setValue(name, value, propertyType)
              }
            />
          </div>
        ) : null}

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
            style={{ display: '-webkit-box', WebkitBoxAlign: 'center' }}
          >
            底图
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
        {SelectedItem.SliderMode == 0 ? (
          <div>
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
                style={{ display: '-webkit-box', WebkitBoxAlign: 'center' }}
              >
                遮罩
              </label>
              <div
                style={{
                  display: '-webkit-box',
                  WebkitBoxOrient: 'vertical',
                  WebkitBoxPack: 'end',
                }}
              >
                <ResourceRefView
                  resRef={SelectedItem.ShadeResource}
                  float="right"
                  selectionChanged={value =>
                    SelectedItem.setValue(
                      'ShadeResource',
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
                style={{ display: '-webkit-box', WebkitBoxAlign: 'center' }}
              >
                按钮
              </label>
              <div
                style={{
                  display: '-webkit-box',
                  WebkitBoxOrient: 'vertical',
                  WebkitBoxPack: 'end',
                }}
              >
                <ResourceRefView
                  resRef={SelectedItem.ButtonResource}
                  float="right"
                  selectionChanged={value =>
                    SelectedItem.setValue(
                      'ButtonResource',
                      value,
                      ClassType.resource,
                    )
                  }
                />
              </div>
            </div>
          </div>
        ) : null}

        <div
          style={{
            display: '-webkit-box',
            WebkitBoxOrient: 'horizontal',
            marginTop: 5,
          }}
        >
          <label
            className={styles.normallbl}
            style={{
              marginLeft: 25,
            }}
          >
            按钮宽
          </label>
          <InputNumber
            style={{
              width: '60px',
              marginLeft: 10,
            }}
            size="small"
            max={9999}
            min={0}
            step={5}
            value={SelectedItem.ButtonWidth || 0}
            onChange={value =>
              SelectedItem.setValue('ButtonWidth', Number(value))
            }
          />
          <label
            className={styles.normallbl}
            style={{
              marginLeft: 10,
            }}
          >
            按钮高
          </label>
          <InputNumber
            style={{
              width: '60px',
              marginLeft: 10,
            }}
            size="small"
            max={9999}
            min={0}
            step={5}
            value={SelectedItem.ButtonHeight || 0}
            onChange={value =>
              SelectedItem.setValue('ButtonHeight', Number(value))
            }
          />
        </div>

        <div
          style={{
            display: '-webkit-box',
            WebkitBoxOrient: 'horizontal',
            marginTop: 5,
          }}
        >
          <label
            className={styles.normallbl}
            style={{
              marginLeft: 25,
            }}
          >
            起始值
          </label>
          <InputNumber
            style={{
              width: '60px',
              marginLeft: 10,
            }}
            size="small"
            max={1000}
            min={0}
            step={5}
            value={SelectedItem.InitialValue || 0}
            onChange={value =>
              SelectedItem.setValue('InitialValue', Number(value))
            }
          />
          <label
            className={styles.normallbl}
            style={{
              marginLeft: 10,
            }}
          >
            结束值
          </label>
          <InputNumber
            style={{
              width: '60px',
              marginLeft: 10,
            }}
            size="small"
            max={1000}
            min={0}
            step={5}
            value={SelectedItem.TheEndValue || 0}
            onChange={value =>
              SelectedItem.setValue('TheEndValue', Number(value))
            }
          />
        </div>
        <div
          style={{
            display: '-webkit-box',
            WebkitBoxOrient: 'horizontal',
            marginTop: 5,
          }}
        >
          <label
            className={styles.normallbl}
            style={{
              marginLeft: 25,
            }}
          >
            移动量
          </label>
          <InputNumber
            style={{
              width: '60px',
              marginLeft: 10,
            }}
            size="small"
            max={1000}
            min={0}
            step={5}
            value={SelectedItem.LargeChange || 0}
            onChange={value =>
              SelectedItem.setValue('LargeChange', Number(value))
            }
          />
          <label
            className={styles.normallbl}
            style={{
              marginLeft: 10,
            }}
          >
            当前值
          </label>
          <InputNumber
            style={{
              width: '60px',
              marginLeft: 10,
            }}
            size="small"
            max={1000}
            min={0}
            step={5}
            value={SelectedItem.CurrentValue || 0}
            onChange={value =>
              SelectedItem.setValue('CurrentValue', Number(value))
            }
          />
        </div>
      </div>
    </div>
  );
};
