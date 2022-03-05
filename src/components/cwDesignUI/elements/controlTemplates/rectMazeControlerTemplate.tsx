import React, { PureComponent } from 'react';
import ResourceRefView from '../../control/resourceRefView';
import { ClassType } from '@/modelClasses/courseDetail/courseDetailenum';
import styles from '@/styles/property.less';
import CWResource from '@/modelClasses/courseDetail/cwResource';
import { Checkbox, InputNumber } from 'antd';
import { LeftIcon } from '@/utils/customIcon';
import CacheEntityServer from '@/server/CacheEntityServer';
import { observer } from 'mobx-react';
import { RefSelectorType } from '@/modelClasses/courseDetail/resRef/resourceRef';
import RectMazeController from '@/modelClasses/courseDetail/editItemViewModels/complexControl/mazecontrol/rectMazeController';
import RectMazeControllerUnit from '@/modelClasses/courseDetail/editItemViewModels/complexControl/mazecontrol/rectMazeControllerUnit';
import KeyHelper from '@/utils/keyHelper';

const Template = props => {
  const { courseware, dataContext } = props;
  let data = dataContext as RectMazeController;
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

      {data.UnitsMatrix.map((rowUnits, i) => {
        let topRow = i * rowHeight;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: data.Width,
              height: `${rowHeight}px`,
              top: topRow,
            }}
          >
            {rowUnits.map((unit, i) => {
              let leftcol = i * colWidth;
              let keyboardunit = unit as RectMazeControllerUnit;

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
                      background: keyboardunit.IsOnControl
                        ? ''
                        : 'repeating-linear-gradient(135deg,transparent, transparent 3%, #00000033 3%,#00000033 5%)',
                    }}
                  ></div>
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
  let data = dataContext as RectMazeControllerUnit;
  if (!KeyHelper.checkCtrlOrMeta(event)) {
    data.Father.UnselectAll();
  }
  if (data.IsSelected) data.IsSelected = false;
  else data.IsSelected = true;
};

///初始化获取的参数

export default Template;

@observer
class SelectedUnitsPropView extends PureComponent<any> {
  render() {
    const { selectedUnits } = this.props;
    let SelectedItem;
    let SelectedItems = null;
    SelectedItems = selectedUnits as RectMazeControllerUnit[];
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
                  checked={SelectedItem.IsOnControl}
                  onChange={event =>
                    SelectedItem.setValue(
                      'IsOnControl',
                      event.target.checked,
                      ClassType.bool,
                    )
                  }
                  style={{ height: '20px', fontSize: '10px' }}
                >
                  启用
                </Checkbox>
              </div>
              {SelectedItem.IsOnControl ? (
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
                      普通状态
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
                      悬浮状态
                    </label>
                    <div
                      style={{
                        display: '-webkit-box',
                        WebkitBoxOrient: 'vertical',
                        WebkitBoxPack: 'end',
                      }}
                    >
                      <ResourceRefView
                        resRef={SelectedItem.HoverRes}
                        float="right"
                        selectionChanged={value =>
                          SelectedItem.setValue(
                            'HoverRes',
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
                      点击状态
                    </label>
                    <div
                      style={{
                        display: '-webkit-box',
                        WebkitBoxOrient: 'vertical',
                        WebkitBoxPack: 'end',
                      }}
                    >
                      <ResourceRefView
                        resRef={SelectedItem.PressedRes}
                        float="right"
                        selectionChanged={value =>
                          SelectedItem.setValue(
                            'PressedRes',
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
      <div className={styles.propdiv}>矩阵迷宫</div>
      <div className={styles.propdiv}>
        <label className={styles.proplbl}>资源</label>
        <ResourceRefView
          resRef={SelectedItem.Background}
          float="right"
          selectionChanged={value =>
            SelectedItem.setValue('Background', value, ClassType.resource)
          }
        />
      </div>
      <SelectedUnitsPropView
        selectedUnits={SelectedItem.SelectedUnits}
      ></SelectedUnitsPropView>
    </div>
  );
};
