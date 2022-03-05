import React, { PureComponent } from 'react';
import ResourceRefView from '../../control/resourceRefView';
import { ClassType } from '@/modelClasses/courseDetail/courseDetailenum';
import styles from '@/styles/property.less';
import RectMazeComplex from '@/modelClasses/courseDetail/editItemViewModels/complexControl/RectMazeComplex';
import RectMazeUnitComplex from '@/modelClasses/courseDetail/editItemViewModels/complexControl/RectMazeUnitComplex';
import { Checkbox, InputNumber, Select } from 'antd';
import CacheEntityServer, { ElementGroup } from '@/server/CacheEntityServer';
import { observer } from 'mobx-react';
import { RefSelectorType } from '@/modelClasses/courseDetail/resRef/resourceRef';
import KeyHelper from '@/utils/keyHelper';
import { EventListMaker } from '@/components/cwDesignUI/control/showHideItems/eventListMaker';
import CommonElementsSelector from '../../control/showHideItems/commonElementsSelector';
import { AppearItemIcon, StartFlagicon, EndFlagicon } from '@/svgs/designIcons';
import { ElementTypes } from '@/modelClasses/courseDetail/courseDetailenum';

const Template = props => {
  const { courseware, dataContext } = props;
  let data = dataContext as RectMazeComplex;
  // SetUnits(data.RowNum, data.ColNum, courseware.Library, data);

  let rowHeight = data.Height / data.RowNum;
  let colWidth = data.Width / data.ColNum;
  return (
    <div
      style={{
        position: 'absolute',
        width: data.Width,
        height: data.Height,
        cursor: 'pointer',
        pointerEvents: data.IsShowToolbar ? 'visible' : 'none',
      }}
    >
      <img
        src={data.Background?.Resource?.resourceKey}
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          objectFit: 'fill',
          userSelect: 'none',
        }}
        draggable={false}
      ></img>

      {data.UnitsMatrix.map((rowUnits, j) => {
        let topRow = j * rowHeight;
        return (
          <div
            key={j}
            style={{
              position: 'absolute',
              width: data.Width,
              height: `${rowHeight}px`,
              top: topRow,
            }}
          >
            {rowUnits.map((unit, i) => {
              let leftcol = i * colWidth;
              let keyboardunit = unit as RectMazeUnitComplex;

              let imgWidth = colWidth - unit.MarginRight - unit.MarginLeft - 6;
              let imgHeight =
                rowHeight - unit.MarginTop - unit.MarginBottom - 6;

              return (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    left: leftcol,
                    width: `${colWidth}px`,
                    height: `${rowHeight}px`,
                    border: unit.IsSelected
                      ? '3px dashed #000000'
                      : '3px solid #999999',
                    zIndex: 9,
                  }}
                  onClick={event => DivCellOnClick(event, unit)}
                >
                  <img
                    src={keyboardunit.NormalRes?.Resource?.resourceKey}
                    style={{
                      left: unit.MarginLeft,
                      top: unit.MarginTop,
                      width: `${imgWidth}px`,
                      height: `${imgHeight}px`,
                      objectFit: 'fill',
                      userSelect: 'none',
                      position: 'absolute',
                      transform: `rotate(${keyboardunit.Angle}deg)`,
                    }}
                    draggable={false}
                  ></img>
                  <div
                    style={{
                      userSelect: 'none',
                      position: 'absolute',
                      width: `${colWidth}px`,
                      height: `${rowHeight}px`,
                      background: keyboardunit.CanStandOn
                        ? ''
                        : 'repeating-linear-gradient(135deg,transparent, transparent 3%, #00000033 3%,#00000033 5%)',
                    }}
                  ></div>

                  {data.StartRow - 1 == j && data.StartCol - 1 == i ? (
                    <div
                      style={{
                        left: 0,
                        top: 0,
                        width: `${30}px`,
                        height: `${30}px`,
                        position: 'absolute',
                      }}
                    >
                      <StartFlagicon></StartFlagicon>
                    </div>
                  ) : null}

                  {data.EndRow - 1 == j && data.EndCol - 1 == i ? (
                    <div
                      style={{
                        left: colWidth - 30,
                        top: rowHeight - 30,
                        width: `${30}px`,
                        height: `${30}px`,
                        position: 'absolute',
                      }}
                    >
                      <EndFlagicon></EndFlagicon>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

const DivCellOnClick = (event, dataContext) => {
  let data = dataContext as RectMazeUnitComplex;
  if (!KeyHelper.checkCtrlOrMeta(event)) {
    data.Father.UnselectAll();
  }
  if (data.IsSelected) data.IsSelected = false;
  else data.IsSelected = true;
};

export default Template;

@observer
class SelectedUnitsPropView extends PureComponent<any> {
  render() {
    const { selectedUnits, scene } = this.props;
    let SelectedItem;
    let SelectedItems = null;
    SelectedItems = selectedUnits as RectMazeUnitComplex[];
    if (!SelectedItems || SelectedItems.length == 0) {
      return <div></div>;
    } else {
      SelectedItem = CacheEntityServer.getPropPanel(SelectedItems);

      return (
        <div>
          <div className={styles.propdiv}>控制单元格设置</div>
          <div
            className={styles.propdiv}
            style={{ border: '1px solid #999999', padding: 5 }}
          >
            <div
              style={{
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                WebkitBoxPack: 'start',
              }}
            >
              <div>
                <Checkbox
                  checked={SelectedItem.CanStandOn}
                  onChange={event =>
                    SelectedItem.setValue(
                      'CanStandOn',
                      event.target.checked,
                      ClassType.bool,
                    )
                  }
                  style={{ height: '20px', fontSize: '10px' }}
                >
                  启用
                </Checkbox>
              </div>
              {SelectedItem.CanStandOn ? (
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
                      style={{
                        display: '-webkit-box',
                        WebkitBoxAlign: 'center',
                      }}
                    >
                      平常状态
                    </label>
                    <div
                      style={{
                        display: '-webkit-box',
                        WebkitBoxOrient: 'vertical',
                        WebkitBoxPack: 'end',
                      }}
                    >
                      <ResourceRefView
                        resRef={SelectedItem.NormalRes}
                        float="right"
                        selectionChanged={value =>
                          SelectedItem.setValue(
                            'NormalRes',
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
                      踩中状态
                    </label>
                    <div
                      style={{
                        display: '-webkit-box',
                        WebkitBoxOrient: 'vertical',
                        WebkitBoxPack: 'end',
                      }}
                    >
                      <ResourceRefView
                        resRef={SelectedItem.StandOnRes}
                        float="right"
                        selectionChanged={value =>
                          SelectedItem.setValue(
                            'StandOnRes',
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
                      离开状态
                    </label>
                    <div
                      style={{
                        display: '-webkit-box',
                        WebkitBoxOrient: 'vertical',
                        WebkitBoxPack: 'end',
                      }}
                    >
                      <ResourceRefView
                        resRef={SelectedItem.LeaveRes}
                        float="right"
                        selectionChanged={value =>
                          SelectedItem.setValue(
                            'LeaveRes',
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
                    <label className={styles.normallbl}>旋转角度</label>
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
                      value={SelectedItem.Angle || 0}
                      onChange={value =>
                        SelectedItem.setValue('Angle', Number(value))
                      }
                      formatter={value => `${value}°`}
                      parser={value => value.replace('°', '')}
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
                      边距
                    </label>
                    <div
                      style={{
                        display: '-webkit-box',
                        WebkitBoxOrient: 'vertical',
                        WebkitBoxPack: 'end',
                      }}
                    >
                      <div
                        style={{
                          display: '-webkit-box',
                          WebkitBoxOrient: 'horizontal',
                          WebkitBoxPack: 'justify',
                        }}
                      >
                        <label
                          className={styles.normallbl}
                          style={{ marginRight: 2 }}
                        >
                          左
                        </label>
                        <InputNumber
                          style={{ width: '70px' }}
                          size="small"
                          step={3}
                          value={SelectedItem.MarginLeft || 0}
                          onChange={value =>
                            SelectedItem.setValue('MarginLeft', Number(value))
                          }
                        />
                        <label
                          className={styles.normallbl}
                          style={{ marginRight: 2, marginLeft: 1 }}
                        >
                          右
                        </label>
                        <InputNumber
                          style={{ width: '70px' }}
                          size="small"
                          step={3}
                          value={SelectedItem.MarginRight || 0}
                          onChange={value =>
                            SelectedItem.setValue('MarginRight', Number(value))
                          }
                        />
                      </div>
                      <div
                        style={{
                          display: '-webkit-box',
                          WebkitBoxOrient: 'horizontal',
                          WebkitBoxPack: 'justify',
                        }}
                      >
                        <label
                          className={styles.normallbl}
                          style={{ marginRight: 2 }}
                        >
                          上
                        </label>
                        <InputNumber
                          style={{ width: '70px' }}
                          size="small"
                          step={3}
                          value={SelectedItem.MarginTop || 0}
                          onChange={value =>
                            SelectedItem.setValue('MarginTop', Number(value))
                          }
                        />
                        <label
                          className={styles.normallbl}
                          style={{ marginRight: 2, marginLeft: 1 }}
                        >
                          下
                        </label>
                        <InputNumber
                          style={{ width: '70px' }}
                          size="small"
                          step={3}
                          value={SelectedItem.MarginBottom || 0}
                          onChange={value =>
                            SelectedItem.setValue('MarginBottom', Number(value))
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div style={{ width: '245px', float: 'left' }}>
                    <label
                      className={styles.proplbl}
                      style={{ width: '66px', marginTop: '10px' }}
                    >
                      进入触发
                    </label>
                    <div style={{ float: 'left', width: 179 }}>
                      <div style={{ float: 'left', width: '100%' }}>
                        <label
                          className={styles.proplbl}
                          style={{ width: '50%' }}
                        >
                          延迟时间
                        </label>
                        <label
                          className={styles.proplbl}
                          style={{ width: '50%' }}
                        >
                          参与元素
                        </label>
                      </div>
                      <div style={{ float: 'left', width: '100%' }}>
                        {SelectedItem.StepInEvents?.map((event, i) => {
                          return (
                            <EventListMaker
                              showDelay={true}
                              showRepeatDelay={false}
                              key={i}
                              actionVM={event}
                              scene={scene}
                            />
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div style={{ width: '245px', float: 'left' }}>
                    <label
                      className={styles.proplbl}
                      style={{ width: '66px', marginTop: '10px' }}
                    >
                      离开触发
                    </label>
                    <div style={{ float: 'left', width: 179 }}>
                      <div style={{ float: 'left', width: '100%' }}>
                        <label
                          className={styles.proplbl}
                          style={{ width: '50%' }}
                        >
                          延迟时间
                        </label>
                        <label
                          className={styles.proplbl}
                          style={{ width: '50%' }}
                        >
                          参与元素
                        </label>
                      </div>
                      <div style={{ float: 'left', width: '100%' }}>
                        {SelectedItem.StepOutEvents?.map((event, i) => {
                          return (
                            <EventListMaker
                              showDelay={true}
                              showRepeatDelay={false}
                              key={i}
                              actionVM={event}
                              scene={scene}
                            />
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      );
    }
  }
}

export const PropPanelTemplate = SelectedItem => {
  //SelectedItem._elements[0].Scene
  return (
    <div>
      <div
        style={{
          height: '1px',
          width: '88%',
          background: '#D4D4D4',
          float: 'left',
          marginLeft: '20px',
          marginTop: '5px',
        }}
      />

      <div
        style={{
          width: '255px',
          marginTop: '5px',
          marginLeft: '15px',
          float: 'left',
          height: SelectedItem.HasEndUnit ? '665px' : '425px',
          border: '1px solid #DCDCDC',
          borderRadius: '5px',
        }}
      >
        <label style={{ float: 'left', marginLeft: '5px' }}>矩阵迷宫</label>
        <div style={{ width: '245px', float: 'left', margin: '5px' }}>
          <label className={styles.proplbl} style={{ width: '52px' }}>
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
          <div>
            <label className={styles.proplbl} style={{ width: '52px' }}>
              行数
            </label>
            <InputNumber
              style={{ float: 'left', width: 66 }}
              size="small"
              defaultValue={1}
              min={1}
              max={100}
              step={1}
              value={SelectedItem.RowNum}
              onChange={value =>
                SelectedItem.setValue('RowNum', value, ClassType.number)
              }
            />
            <label
              className={styles.proplbl}
              style={{ float: 'left', marginLeft: 27 }}
            >
              列数
            </label>
            <InputNumber
              style={{ float: 'left', marginLeft: 5, width: 65 }}
              size="small"
              defaultValue={1}
              min={1}
              max={100}
              step={1}
              value={SelectedItem.ColNum}
              onChange={value =>
                SelectedItem.setValue('ColNum', value, ClassType.number)
              }
            />
          </div>
        </div>

        <div style={{ width: '245px', float: 'left', margin: '5px' }}>
          <div>
            <label className={styles.proplbl} style={{ width: '52px' }}>
              起始行
            </label>
            <InputNumber
              style={{ float: 'left', width: 66 }}
              size="small"
              defaultValue={1}
              min={1}
              max={SelectedItem.RowNum}
              step={1}
              value={SelectedItem.StartRow}
              onChange={value =>
                SelectedItem.setValue('StartRow', value, ClassType.number)
              }
            />
            <label
              className={styles.proplbl}
              style={{ float: 'left', marginLeft: 16 }}
            >
              起始列
            </label>
            <InputNumber
              style={{ float: 'left', marginLeft: 5, width: 65 }}
              size="small"
              defaultValue={1}
              min={1}
              max={SelectedItem.ColNum}
              step={1}
              value={SelectedItem.StartCol}
              onChange={value =>
                SelectedItem.setValue('StartCol', value, ClassType.number)
              }
            />
          </div>
        </div>

        <div
          style={{
            float: 'left',
            width: '100%',
            marginTop: '5px',
            marginLeft: '5px',
          }}
        >
          <label className={styles.proplbl} style={{ width: '69px' }}>
            启用终点
          </label>
          <Checkbox
            checked={SelectedItem.HasEndUnit}
            onChange={event =>
              SelectedItem.setValue(
                'HasEndUnit',
                event.target.checked,
                ClassType.bool,
              )
            }
            style={{ float: 'left', height: '20px', fontSize: '10px' }}
          ></Checkbox>
        </div>

        {SelectedItem.HasEndUnit ? (
          <div
            style={{
              width: '255px',
              marginTop: '5px',
              //marginLeft: '15px',
              float: 'left',
              height: '220px',
              border: '1px solid #DCDCDC',
              borderRadius: '5px',
            }}
          >
            <div style={{ width: '245px', float: 'left', margin: '5px' }}>
              <label className={styles.proplbl} style={{ width: '66px' }}>
                终点行
              </label>
              <InputNumber
                style={{ float: 'left', width: 66 }}
                size="small"
                defaultValue={1}
                min={1}
                max={SelectedItem.RowNum}
                step={1}
                value={SelectedItem.EndRow}
                onChange={value =>
                  SelectedItem.setValue('EndRow', value, ClassType.number)
                }
              />
              <label
                className={styles.proplbl}
                style={{ float: 'left', marginLeft: 10 }}
              >
                终点列
              </label>
              <InputNumber
                style={{ float: 'left', marginLeft: 5, width: 54 }}
                size="small"
                defaultValue={1}
                min={1}
                max={SelectedItem.ColNum}
                step={1}
                value={SelectedItem.EndCol}
                onChange={value =>
                  SelectedItem.setValue('EndCol', value, ClassType.number)
                }
              />
            </div>

            <div style={{ width: '245px', float: 'left', margin: '5px' }}>
              <label className={styles.proplbl} style={{ width: '66px' }}>
                最大步数
              </label>
              <InputNumber
                style={{ float: 'left', width: 66 }}
                size="small"
                defaultValue={1}
                min={1}
                max={10000}
                step={1}
                value={SelectedItem.MaxStep}
                onChange={value =>
                  SelectedItem.setValue('MaxStep', value, ClassType.number)
                }
              />
            </div>

            <div style={{ width: '245px', float: 'left', margin: '5px' }}>
              <label
                className={styles.proplbl}
                style={{ width: '66px', marginTop: '10px' }}
              >
                成功到达
              </label>
              <div style={{ float: 'left', width: 179 }}>
                <div style={{ float: 'left', width: '100%' }}>
                  <label className={styles.proplbl} style={{ width: '50%' }}>
                    延迟时间
                  </label>
                  <label className={styles.proplbl} style={{ width: '50%' }}>
                    参与元素
                  </label>
                </div>
                <div style={{ float: 'left', width: '100%' }}>
                  {SelectedItem?.SuccessEvents?.map((event, i) => {
                    return (
                      <EventListMaker
                        showDelay={true}
                        showRepeatDelay={false}
                        key={i}
                        actionVM={event}
                        scene={SelectedItem._elements[0].Scene}
                      />
                    );
                  })}
                </div>
              </div>
            </div>

            <div style={{ width: '245px', float: 'left', margin: '5px' }}>
              <label
                className={styles.proplbl}
                style={{ width: '66px', marginTop: '10px' }}
              >
                超出步数
              </label>
              <div style={{ float: 'left', width: 179 }}>
                <div style={{ float: 'left', width: '100%' }}>
                  <label className={styles.proplbl} style={{ width: '50%' }}>
                    延迟时间
                  </label>
                  <label className={styles.proplbl} style={{ width: '50%' }}>
                    参与元素
                  </label>
                </div>
                <div style={{ float: 'left', width: '100%' }}>
                  {SelectedItem?.FailEvents?.map((event, i) => {
                    return (
                      <EventListMaker
                        showDelay={true}
                        showRepeatDelay={false}
                        key={i}
                        actionVM={event}
                        scene={SelectedItem._elements[0].Scene}
                      />
                    );
                  })}
                </div>
              </div>
            </div>

            <div style={{ width: '245px', float: 'left', margin: '5px' }}>
              <label className={styles.proplbl} style={{ width: '66px' }}>
                错误重置
              </label>
              <Checkbox
                checked={SelectedItem.IsErrorReset}
                onChange={event =>
                  SelectedItem.setValue(
                    'IsErrorReset',
                    event.target.checked,
                    ClassType.bool,
                  )
                }
                style={{ float: 'left', height: '20px', fontSize: '10px' }}
              >
                是否重置
              </Checkbox>

              <label className={styles.proplbl} style={{ marginLeft: 6 }}>
                延时
              </label>
              <InputNumber
                style={{ float: 'left', marginLeft: 5, width: 55 }}
                size="small"
                defaultValue={1}
                min={1}
                max={60}
                step={1}
                value={SelectedItem.ErrorResetTimer}
                onChange={value =>
                  SelectedItem.setValue(
                    'ErrorResetTimer',
                    value,
                    ClassType.number,
                  )
                }
              />
            </div>
          </div>
        ) : null}

        <div style={{ width: '245px', float: 'left', margin: '5px' }}>
          <div>
            <label className={styles.proplbl} style={{ width: '52px' }}>
              进入方式
            </label>
            <Select
              getPopupContainer={triggerNode => triggerNode.parentElement}
              defaultValue={0}
              style={{ width: 66, float: 'left' }}
              onChange={value => SelectedItem.setValue('JumpInMode', value)}
              value={SelectedItem.JumpInMode}
              size={'small'}
            >
              <Select.Option value={0}>瞬间</Select.Option>
              <Select.Option value={1}>缓动</Select.Option>
            </Select>
            {SelectedItem.JumpInMode == 1 ? (
              <div>
                <label
                  className={styles.proplbl}
                  style={{ float: 'left', marginLeft: 5 }}
                >
                  进入时间
                </label>
                <InputNumber
                  style={{ float: 'left', marginLeft: 5, width: 65 }}
                  size="small"
                  defaultValue={0}
                  min={0}
                  max={99999}
                  step={0.1}
                  value={SelectedItem.JumpInTime}
                  onChange={value =>
                    SelectedItem.setValue('JumpInTime', value, ClassType.number)
                  }
                />
              </div>
            ) : null}
          </div>
        </div>

        <div style={{ width: '245px', float: 'left', margin: '5px' }}>
          <div>
            <label className={styles.proplbl} style={{ width: '52px' }}>
              移动步长
            </label>
            <InputNumber
              style={{ width: 66, float: 'left' }}
              size="small"
              defaultValue={1}
              min={1}
              max={10}
              step={1}
              value={SelectedItem.MoveStep}
              onChange={value =>
                SelectedItem.setValue('MoveStep', value, ClassType.number)
              }
            />

            <label
              className={styles.proplbl}
              style={{ float: 'left', marginLeft: 5 }}
            >
              进入方式
            </label>
            <Select
              getPopupContainer={triggerNode => triggerNode.parentElement}
              defaultValue={0}
              style={{ float: 'left', marginLeft: 5, width: 65 }}
              onChange={value => SelectedItem.setValue('MoveMode', value)}
              value={SelectedItem.MoveMode}
              size={'small'}
            >
              <Select.Option value={0}>瞬间</Select.Option>
              <Select.Option value={1}>移动</Select.Option>
            </Select>
          </div>
        </div>

        <div style={{ width: '245px', float: 'left', margin: '5px' }}>
          <label className={styles.proplbl} style={{ width: '52px' }}>
            选中提示
          </label>
          <ResourceRefView
            resRef={SelectedItem.IllegalVoice}
            refType={RefSelectorType.Audio}
            float="left"
            selectionChanged={value =>
              SelectedItem.setValue('IllegalVoice', value, ClassType.resource)
            }
          />
        </div>

        <div style={{ width: '245px', float: 'left', margin: '5px' }}>
          <label className={styles.proplbl} style={{ width: '52px' }}>
            棋子
          </label>
          <CommonElementsSelector
            scene={SelectedItem._elements[0].Scene}
            style={{
              width: '14px',
              height: '14px',
              marginLeft: '2px',
              float: 'left',
              //position: 'relative',
            }}
            selectorName="棋子"
            icon={AppearItemIcon}
            elementIds={SelectedItem.ChessmanId}
            elementIdsChanged={newIds => {
              SelectedItem.setValue('ChessmanId', newIds, ClassType.string);
            }}
            isSingle={true}
            isDisableCombined={true}
            whiteList={[ElementTypes.Chessman]}
            hasItemColor="#0056b3"
            noItemColor="#20272F"
          ></CommonElementsSelector>
          <label
            className={styles.proplbl}
            style={{ float: 'left', marginLeft: 60 }}
          >
            控制器
          </label>
          <CommonElementsSelector
            scene={SelectedItem._elements[0].Scene}
            style={{
              width: '14px',
              height: '14px',
              marginLeft: '20px',
              float: 'left',
              //position: 'relative',
            }}
            selectorName="控制器"
            icon={AppearItemIcon}
            elementIds={SelectedItem.CtrlerId}
            elementIdsChanged={newIds => {
              SelectedItem.setValue('CtrlerId', newIds, ClassType.string);
            }}
            isSingle={true}
            isDisableCombined={true}
            whiteList={[ElementTypes.RectMazeController]}
            hasItemColor="#0056b3"
            noItemColor="#20272F"
          ></CommonElementsSelector>
        </div>
        {SelectedItem.CtrlerId == null || SelectedItem.CtrlerId == '' ? (
          <div style={{ width: '245px', float: 'left', margin: '5px' }}>
            <label className={styles.proplbl} style={{ width: '52px' }}>
              引导箭头
            </label>
            <ResourceRefView
              resRef={SelectedItem.GuideArrow}
              float="left"
              selectionChanged={value =>
                SelectedItem.setValue('GuideArrow', value, ClassType.resource)
              }
            />
          </div>
        ) : null}
      </div>

      <SelectedUnitsPropView
        selectedUnits={SelectedItem.SelectedUnits}
        scene={SelectedItem._elements[0].Scene}
      ></SelectedUnitsPropView>
    </div>
  );
};
