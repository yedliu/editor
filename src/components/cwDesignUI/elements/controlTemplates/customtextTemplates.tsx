import React from 'react';
import ResourceRefView from '../../control/resourceRefView';
import { ClassType } from '@/modelClasses/courseDetail/courseDetailenum';
import styles from '@/styles/property.less';
import { Checkbox, InputNumber } from 'antd';
import { TextToolbar } from '../../control/textToolbar';
import CommonElementsSelector from '../../control/showHideItems/commonElementsSelector';
import { AppearItemIcon } from '@/svgs/designIcons';
import { ElementTypes } from '@/modelClasses/courseDetail/courseDetailenum';

const Template = props => {
  const { courseware, dataContext } = props;

  var reskey = dataContext.Background?.Resource?.resourceKey;
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
            输入容器
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
      <div className={styles.propdiv}>控件-输入容器</div>
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
            键盘模式
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
              value={SelectedItem.TypeMode}
              onChange={e => {
                SelectedItem.setValue('TypeMode', e.target.value);
              }}
            >
              <option value={0}>数字键盘</option>
              <option value={1}>符号键盘</option>
              <option value={2}>自定义键盘</option>
            </select>
          </div>
        </div>
        <div
          style={{
            display: '-webkit-box',
            WebkitBoxOrient: 'horizontal',
            WebkitBoxPack: 'start',
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
            选中设置
          </label>
          <Checkbox
            checked={SelectedItem.IsDefaultChecked}
            onChange={event =>
              SelectedItem.setValue(
                'IsDefaultChecked',
                event.target.checked,
                ClassType.bool,
              )
            }
            style={{ height: '20px', fontSize: '10px', marginLeft: 34 }}
          >
            是否默认选中
          </Checkbox>
        </div>

        {SelectedItem.TypeMode == 2 ? (
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
              输入模式
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
                value={SelectedItem.InputMode}
                onChange={e => {
                  SelectedItem.setValue('InputMode', e.target.value);
                }}
              >
                <option value={0}>资源</option>
                <option value={1}>文字</option>
              </select>
            </div>
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
            宽高模式
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
              value={SelectedItem.SizeMode}
              onChange={e => {
                SelectedItem.setValue('SizeMode', e.target.value);
              }}
            >
              <option value={0}>自适应</option>
              <option value={1}>自定义</option>
            </select>
          </div>
        </div>

        {SelectedItem.SizeMode == 1 ? (
          <div>
            <div
              style={{
                display: '-webkit-box',
                WebkitBoxOrient: 'horizontal',
                WebkitBoxPack: 'justify',
                marginTop: 5,
              }}
            >
              <label className={styles.normallbl}>单元宽度</label>
              <InputNumber
                style={{
                  width: '170px',
                  display: '-webkit-box',
                  WebkitBoxOrient: 'vertical',
                  WebkitBoxPack: 'end',
                }}
                size="small"
                max={360}
                min={0}
                step={5}
                value={SelectedItem.UnitWidth || 0}
                onChange={value =>
                  SelectedItem.setValue('UnitWidth', Number(value))
                }
              />
            </div>
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
          <label className={styles.normallbl}>光标宽度</label>
          <InputNumber
            style={{
              width: '170px',
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              WebkitBoxPack: 'end',
            }}
            size="small"
            max={360}
            min={0}
            step={5}
            value={SelectedItem.CursorWidth || 0}
            onChange={value =>
              SelectedItem.setValue('CursorWidth', Number(value))
            }
          />
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
            光标效果
          </label>
          <div
            style={{
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              WebkitBoxPack: 'end',
            }}
          >
            <ResourceRefView
              resRef={SelectedItem.CursorRes}
              float="right"
              selectionChanged={value =>
                SelectedItem.setValue('CursorRes', value, ClassType.resource)
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
            选中效果
          </label>
          <div
            style={{
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              WebkitBoxPack: 'end',
            }}
          >
            <ResourceRefView
              resRef={SelectedItem.SelectedRes}
              float="right"
              selectionChanged={value =>
                SelectedItem.setValue('SelectedRes', value, ClassType.resource)
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

        {SelectedItem.TypeMode == 2 ? (
          <div
            style={{
              display: '-webkit-box',
              WebkitBoxOrient: 'horizontal',
              WebkitBoxPack: 'justify',
              WebkitBoxAlign: 'center',
              marginTop: 5,
            }}
          >
            <label className={styles.normallbl}>显示模式</label>
            <select
              style={{
                display: '-webkit-box',
                WebkitBoxOrient: 'horizontal',
                WebkitBoxAlign: 'center',
                width: 60,
              }}
              value={SelectedItem.KeyBoardMode}
              onChange={e => {
                SelectedItem.setValue('KeyBoardMode', e.target.value);
              }}
            >
              <option value={0}>显示</option>
              <option value={1}>吸附</option>
            </select>
            <div
              style={{
                display: '-webkit-box',
                WebkitBoxOrient: 'horizontal',
                WebkitBoxAlign: 'center',
                marginRight: '6px',
              }}
            >
              键盘选择
              <CommonElementsSelector
                scene={SelectedItem._elements?.[0]?.Scene}
                style={{
                  width: '14px',
                  height: '14px',
                  marginLeft: '7px',
                  position: 'relative',
                }}
                selectorName="键盘选择"
                icon={AppearItemIcon}
                elementIds={SelectedItem.KeyBoardId}
                elementIdsChanged={v => SelectedItem.setValue('KeyBoardId', v)}
                isSingle={true}
                isDisableCombined={true}
                whiteList={[ElementTypes.Keyboard]}
                noItemColor="#333333"
              ></CommonElementsSelector>
            </div>
          </div>
        ) : null}

        {SelectedItem.TypeMode == 1 ? null : (
          <div>
            <div
              style={{
                display: '-webkit-box',
                WebkitBoxOrient: 'horizontal',
                WebkitBoxPack: 'justify',
                marginTop: 5,
              }}
            >
              <label className={styles.normallbl}>最大长度</label>
              <InputNumber
                style={{
                  width: '170px',
                  display: '-webkit-box',
                  WebkitBoxOrient: 'vertical',
                  WebkitBoxPack: 'end',
                }}
                size="small"
                max={360}
                min={0}
                step={5}
                value={SelectedItem.MaxLength || 0}
                onChange={value =>
                  SelectedItem.setValue('MaxLength', Number(value))
                }
              />
            </div>
            <div
              style={{
                display: '-webkit-box',
                WebkitBoxOrient: 'horizontal',
                WebkitBoxPack: 'start',
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
                是否值变化
              </label>
              <Checkbox
                checked={SelectedItem.IsSizeChanged}
                onChange={event =>
                  SelectedItem.setValue(
                    'IsSizeChanged',
                    event.target.checked,
                    ClassType.bool,
                  )
                }
                style={{ height: '20px', fontSize: '10px', marginLeft: 24 }}
              ></Checkbox>
            </div>
          </div>
        )}

        {SelectedItem.TypeMode == 1 ? (
          <div
            style={{
              display: '-webkit-box',
              WebkitBoxOrient: 'horizontal',
              WebkitBoxPack: 'justify',
              marginTop: 5,
            }}
          >
            <label className={styles.normallbl}>符号配置</label>
            <input
              type="text"
              value={SelectedItem.MarkString || ''}
              onChange={event =>
                SelectedItem.setValue('MarkString', event.target.value)
              }
              className={styles.proptxt}
              style={{
                width: '170px',
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                WebkitBoxPack: 'end',
              }}
            />
          </div>
        ) : null}

        {SelectedItem.KeyBoardMode == 0 ? null : (
          <div>
            <div
              style={{
                display: '-webkit-box',
                WebkitBoxOrient: 'horizontal',
                WebkitBoxPack: 'justify',
                marginTop: 5,
              }}
            >
              <label className={styles.normallbl}>停靠位置</label>
              <select
                style={{
                  display: '-webkit-box',
                  WebkitBoxOrient: 'vertical',
                  WebkitBoxPack: 'end',
                  width: 170,
                }}
                value={SelectedItem.Placement}
                onChange={e => {
                  SelectedItem.setValue('Placement', e.target.value);
                }}
              >
                <option value={0}>左</option>
                <option value={1}>上</option>
                <option value={2}>右</option>
                <option value={3}>下</option>
              </select>
            </div>
            <div
              style={{
                display: '-webkit-box',
                WebkitBoxOrient: 'horizontal',
                WebkitBoxPack: 'justify',
                marginTop: 5,
              }}
            >
              <label className={styles.normallbl}>垂直偏移</label>
              <input
                type="text"
                value={SelectedItem.VerticalOffset || ''}
                onChange={event =>
                  SelectedItem.setValue('VerticalOffset', event.target.value)
                }
                className={styles.proptxt}
                style={{
                  width: '170px',
                  display: '-webkit-box',
                  WebkitBoxOrient: 'vertical',
                  WebkitBoxPack: 'end',
                }}
              />
            </div>
            <div
              style={{
                display: '-webkit-box',
                WebkitBoxOrient: 'horizontal',
                WebkitBoxPack: 'justify',
                marginTop: 5,
              }}
            >
              <label className={styles.normallbl}>水平偏移</label>
              <input
                type="text"
                value={SelectedItem.HorizontalOffset || ''}
                onChange={event =>
                  SelectedItem.setValue('HorizontalOffset', event.target.value)
                }
                className={styles.proptxt}
                style={{
                  width: '170px',
                  display: '-webkit-box',
                  WebkitBoxOrient: 'vertical',
                  WebkitBoxPack: 'end',
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
