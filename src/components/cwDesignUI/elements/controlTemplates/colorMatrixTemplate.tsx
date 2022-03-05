import React, { PureComponent, MouseEventHandler } from 'react';
import { observer } from 'mobx-react';
import styles from '@/styles/property.less';
import { ClassType } from '@/modelClasses/courseDetail/courseDetailenum';
import ResourceRefView from '../../control/resourceRefView';
import { Select, Checkbox, InputNumber, Tooltip } from 'antd';
import TextBoxInfo from '../../control/textBoxInfo';
import ColorPicker from '@/components/cwDesignUI/control/sketchColor';
import colorMatrixComplex from '@/modelClasses/courseDetail/editItemViewModels/complexControl/colorMatrixControl/colorMatrixComplex';
import colorMatrixUnitComplex from '@/modelClasses/courseDetail/editItemViewModels/complexControl/colorMatrixControl/colorMatrixUnitComplex';
import KeyHelper from '@/utils/keyHelper';
import { RefSelectorType } from '@/modelClasses/courseDetail/resRef/resourceRef';
import CacheEntityServer from '@/server/CacheEntityServer';
import { HelpBlueIcon } from '@/svgs/designIcons';

const Template = props => {
  const { courseware, dataContext } = props;
  let data = dataContext as colorMatrixComplex;
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
              let keyboardunit = unit as colorMatrixUnitComplex;

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
                      border:
                        keyboardunit.Color == null
                          ? '0px dashed #000000'
                          : '5px solid ' + keyboardunit.subColor,
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
  let data = dataContext as colorMatrixUnitComplex;
  if (!KeyHelper.checkCtrlOrMeta(event)) {
    data.Father.UnselectAll();
  }
  if (data.IsSelected) data.IsSelected = false;
  else data.IsSelected = true;
};

///初始化获取的参数
const InitUnits = () => {};

export default Template;

@observer
class SelectedUnitsPropView extends PureComponent<any> {
  render() {
    const { selectedUnits } = this.props;
    let SelectedItem;
    let SelectedItems = null;
    SelectedItems = selectedUnits as colorMatrixUnitComplex[];
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
                    <label className={styles.normallbl}>颜色配置</label>
                    <ColorPicker
                      style={{
                        width: '170px',
                        display: '-webkit-box',
                        WebkitBoxOrient: 'vertical',
                        WebkitBoxPack: 'end',
                      }}
                      selectedcolor={SelectedItem.Color}
                      selectedcolorchanged={value => {
                        var _val = value;
                        if (_val.length == 8) {
                          _val = '#f' + _val.substr(1);
                        } else if (_val.length == 6) {
                          _val = _val + '000';
                        }
                        SelectedItem.setValue('Color', _val, ClassType.string);
                      }}
                    />
                    {/* <input
                      type="text"
                      value={SelectedItem.LogicTag || ''}
                      onChange={event =>
                        SelectedItem.setValue('LogicTag', event.target.value)
                      }
                      className={styles.proptxt}
                      style={{
                        width: '170px',
                        display: '-webkit-box',
                        WebkitBoxOrient: 'vertical',
                        WebkitBoxPack: 'end',
                      }}
                    /> */}
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
      <div className={styles.propdiv}>
        <label style={{ float: 'left' }}>涂色矩阵</label>
        <Tooltip
          style={{ float: 'left', whiteSpace: 'pre' }}
          placement="bottom"
          title="填满颜色:0 颜色正确:1 颜色错误:2"
        >
          {HelpBlueIcon(
            'https://hdkj-test.zmtalent.com/zmg_editor/zmg-pro-docs/docs/%E6%8E%A7%E4%BB%B6/%E6%B6%82%E8%89%B2%E7%9F%A9%E9%98%B5.html',
          )}
        </Tooltip>
      </div>
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
      <div className={styles.propdiv}>
        <div>
          <label className={styles.proplbl}>行数</label>
          <InputNumber
            style={{ float: 'left', marginLeft: 56, width: 66 }}
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
            style={{ float: 'left', marginLeft: 10 }}
          >
            列数
          </label>
          <InputNumber
            style={{ float: 'left', marginLeft: 5, width: 66 }}
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
      <SelectedUnitsPropView
        selectedUnits={SelectedItem.SelectedUnits}
      ></SelectedUnitsPropView>
    </div>
  );
};
