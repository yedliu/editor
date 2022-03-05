import React, { PureComponent } from 'react';
import ResourceRefView from '../../control/resourceRefView';
import { ClassType } from '@/modelClasses/courseDetail/courseDetailenum';
import styles from '@/styles/property.less';
import tetrisComplex from '@/modelClasses/courseDetail/editItemViewModels/complexControl/tetrisControl/tetrisComplex';
import tetrisUnitComplex from '@/modelClasses/courseDetail/editItemViewModels/complexControl/tetrisControl/tetrisUnitComplex';
import CWResource from '@/modelClasses/courseDetail/cwResource';
import { Checkbox, InputNumber, Button, Tooltip } from 'antd';
import { LeftIcon } from '@/utils/customIcon';
import CacheEntityServer from '@/server/CacheEntityServer';
import { observer } from 'mobx-react';
import { RefSelectorType } from '@/modelClasses/courseDetail/resRef/resourceRef';
import KeyHelper from '@/utils/keyHelper';
import blockUnitBaseComple from '@/modelClasses/courseDetail/editItemViewModels/complexControl/tetrisControl/blockUnitBaseComple';
import RUHelper from '@/redoundo/redoUndoHelper';
import IdHelper from '@/utils/idHelper';
import listBlockComplex from '@/modelClasses/courseDetail/editItemViewModels/complexControl/tetrisControl/listBlockComplex';
import { HelpBlueIcon } from '@/svgs/designIcons';

const Template = props => {
  const { courseware, dataContext } = props;

  let data = dataContext as tetrisComplex;
  let rowHeight = data.Height / data.RowNum;
  let colWidth = data.Width / data.ColNum;

  var vCellWidth = 0;
  var vCellHeight = 0;
  //if (isMainView != false) {
  var error = 0.5;
  vCellWidth = data.Width / data.RanksCount - error;
  vCellHeight = vCellWidth;

  return (
    <div
      className="DragCanvas"
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

      <div
        onMouseDown={event => data.UnselectAllBlock()}
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
        }}
      >
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
                zIndex: 1,
              }}
            >
              {rowUnits.map((unit, i) => {
                let leftcol = i * colWidth;
                let keyboardunit = unit as tetrisUnitComplex;

                let imgWidth =
                  colWidth - unit.MarginRight - unit.MarginLeft - 6;
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
                      // border: unit.IsSelected
                      //   ? '3px dashed #000000'
                      //   : '3px solid #F0F0F0',
                    }}
                    onClick={event => DivCellOnClick(event, unit)}
                  >
                    {keyboardunit.NormalRes == null ? null : (
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
                          border: '0px dashed #000000',
                        }}
                        draggable={false}
                      ></img>
                    )}
                    <div
                      style={{
                        userSelect: 'none',
                        position: 'absolute',
                        width: `${colWidth}px`,
                        height: `${rowHeight}px`,
                        background: keyboardunit.CanStandOn
                          ? ''
                          : 'repeating-linear-gradient(135deg,transparent, transparent 3%, #DFFFDF 3%,#DFFFDF 5%)',
                        border: unit.IsSelected
                          ? '3px solid #63AAFF'
                          : '1px solid #999999',
                      }}
                    ></div>
                    {keyboardunit.CanStandOn ? (
                      <h2
                        style={{
                          position: 'absolute',
                          textAlign: 'center',
                          left: colWidth / 2 - 30,
                          top: rowHeight / 2 - 20,
                        }}
                      >
                        有效点
                      </h2>
                    ) : null}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      <div
        onMouseDown={event => data.UnselectAll()}
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
        }}
      >
        {data.UnitsBlock?.map((rowUnitsBlock, i) => {
          return (
            <div
              className="unit"
              onMouseDown={e => rowUnitsBlock.DragItemCanvas(e)}
              key={i}
              style={{
                left: rowUnitsBlock?.X,
                top: rowUnitsBlock?.Y,
                position: 'absolute',
                float: 'left',
                width:
                  vCellWidth * rowUnitsBlock.ColNum +
                  (rowUnitsBlock.ColNum + 1) * 0.5,
                height: vCellHeight * rowUnitsBlock.RowNum,
                // border: rowUnitsBlock.IsSelected
                //   ? '2px solid #63AAFF'
                //   : '2px solid #000',
                zIndex: rowUnitsBlock.IsSelected ? 2 : 1,
              }}
            >
              <div
                style={{
                  // userSelect: 'none',
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  border: rowUnitsBlock.IsSelected
                    ? '4px solid #63AAFF'
                    : '0px solid #999999',
                }}
              ></div>

              <div
                onMouseDown={event => data.UnselectAll()}
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                }}
              >
                {rowUnitsBlock.UnitsMatrix.map((rowUnits, i) => {
                  let topRow = i * vCellHeight;
                  return (
                    <div
                      key={i}
                      style={{
                        position: 'absolute',
                        width: vCellWidth * (i + 1),
                        height: `${vCellHeight}px`,
                        top: topRow,
                      }}
                    >
                      {rowUnits.map((unit, i) => {
                        let leftcol = i * vCellWidth;
                        let keyboardunit = unit as blockUnitBaseComple;

                        let imgWidth = vCellWidth;
                        let imgHeight = vCellHeight;

                        return (
                          <div
                            key={i}
                            style={{
                              position: 'absolute',
                              left: leftcol,
                              width: `${colWidth}px`,
                              height: `${rowHeight}px`,
                            }}
                            onClick={event => BlockUnitBase(event, unit)}
                          >
                            <img
                              src={
                                keyboardunit.NormalRes?.Resource?.resourceKey
                              }
                              style={{
                                width: `${imgWidth}px`,
                                height: `${imgHeight}px`,
                                objectFit: 'fill',
                                userSelect: 'none',
                                position: 'absolute',
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
                                  : 'repeating-linear-gradient(135deg,transparent, transparent 3%, #F0F0F0 3%,#F0F0F0 5%)',
                                border: unit.IsSelected
                                  ? '3px solid #63AAFF'
                                  : '1px solid #999999',
                              }}
                            ></div>
                            {keyboardunit.CanStandOn ? (
                              <h2
                                style={{
                                  position: 'absolute',
                                  textAlign: 'center',
                                  left: colWidth / 2 - 30,
                                  top: rowHeight / 2 - 20,
                                }}
                              >
                                有效点
                              </h2>
                            ) : null}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const DivCellOnClick = (event, dataContext) => {
  let data = dataContext as tetrisUnitComplex;
  if (!KeyHelper.checkCtrlOrMeta(event)) {
    data.Father.UnselectAll();
  }
  if (data.IsSelected) data.IsSelected = false;
  else data.IsSelected = true;
};

const BlockUnitBase = (event, dataContext) => {
  let data = dataContext as blockUnitBaseComple;
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
    const { selectedUnits } = this.props;
    let SelectedItem;
    let SelectedItems = null;
    SelectedItems = selectedUnits as tetrisUnitComplex[];
    if (!SelectedItems || SelectedItems.length == 0) {
      return <div></div>;
    } else {
      SelectedItem = CacheEntityServer.getPropPanel(SelectedItems);

      return (
        <div>
          <div className={styles.propdiv}>控制单元格设置</div>
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
            <div>
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
                  有效点
                </Checkbox>
              </div>
              {SelectedItem.CanStandOn ? (
                <div style={{ width: '245px', float: 'left', margin: '5px' }}>
                  <label className={styles.proplbl} style={{ width: '68px' }}>
                    单元底图
                  </label>
                  <ResourceRefView
                    resRef={SelectedItem.NormalRes}
                    float="left"
                    selectionChanged={value =>
                      SelectedItem.setValue(
                        'NormalRes',
                        value,
                        ClassType.resource,
                      )
                    }
                  />
                </div>
              ) : null}
            </div>
          </div>
        </div>
      );
    }
  }
}

@observer
class SelectedUnitsBlockPropView extends PureComponent<any> {
  render() {
    const { selectedUnits } = this.props;
    let SelectedItem;
    let SelectedItems = null;
    SelectedItems = selectedUnits as listBlockComplex[];
    if (!SelectedItems || SelectedItems.length == 0) {
      return <div></div>;
    } else {
      SelectedItem = CacheEntityServer.getPropPanel(SelectedItems);

      let selectedUnitsBlock = SelectedItem.SelectedUnits;
      let SelectedItemBlock;
      let SelectedItemsBlock = null;
      SelectedItemsBlock = selectedUnitsBlock as blockUnitBaseComple[];
      if (!SelectedItemsBlock || SelectedItemsBlock.length == 0) {
        return <div></div>;
      } else
        SelectedItemBlock = CacheEntityServer.getPropPanel(SelectedItemsBlock);

      return (
        <div>
          <div className={styles.propdiv}>方块单元格设置</div>
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
            <div>
              <div>
                <Checkbox
                  checked={SelectedItemBlock.CanStandOn}
                  onChange={event =>
                    SelectedItemBlock.setValue(
                      'CanStandOn',
                      event.target.checked,
                      ClassType.bool,
                    )
                  }
                  style={{ height: '20px', fontSize: '10px' }}
                >
                  有效点
                </Checkbox>
              </div>
              {SelectedItemBlock.CanStandOn ? (
                <div style={{ width: '245px', float: 'left', margin: '5px' }}>
                  <label className={styles.proplbl} style={{ width: '68px' }}>
                    单元底图
                  </label>
                  <ResourceRefView
                    resRef={SelectedItemBlock.NormalRes}
                    float="left"
                    selectionChanged={value =>
                      SelectedItemBlock.setValue(
                        'NormalRes',
                        value,
                        ClassType.resource,
                      )
                    }
                  />
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
      {/* <div className={styles.propdiv}>俄罗斯方块</div> */}
      <div
        style={{
          width: '255px',
          marginTop: '5px',
          marginLeft: '15px',
          float: 'left',
          height: '350px',
          border: '1px solid #DCDCDC',
          borderRadius: '5px',
        }}
      >
        {/* <label style={{ float: 'left', marginLeft: '5px' }}>俄罗斯方块</label> */}
        <label style={{ float: 'left' }}>俄罗斯方块</label>
        <Tooltip
          style={{ float: 'left', whiteSpace: 'pre' }}
          placement="bottom"
          title="不知道怎么用点击这里试试"
        >
          {HelpBlueIcon(
            'https://hdkj-test.zmtalent.com/zmg_editor/zmg-pro-docs/docs/%E6%8E%A7%E4%BB%B6/%E4%BF%84%E7%BD%97%E6%96%AF%E6%96%B9%E5%9D%97%E6%8E%A7%E4%BB%B6.html',
          )}
        </Tooltip>

        <div style={{ width: '245px', float: 'left', margin: '5px' }}>
          <label className={styles.proplbl} style={{ width: '68px' }}>
            资源
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
            选中提示
          </label>
          <ResourceRefView
            resRef={SelectedItem.SelectedVoice}
            refType={RefSelectorType.Audio}
            float="left"
            selectionChanged={value =>
              SelectedItem.setValue('SelectedVoice', value, ClassType.resource)
            }
          />
        </div>

        <div style={{ width: '245px', float: 'left', margin: '5px' }}>
          <label className={styles.proplbl} style={{ width: '68px' }}>
            放置提示
          </label>
          <ResourceRefView
            resRef={SelectedItem.PlaceVoice}
            refType={RefSelectorType.Audio}
            float="left"
            selectionChanged={value =>
              SelectedItem.setValue('PlaceVoice', value, ClassType.resource)
            }
          />
        </div>

        <div style={{ width: '245px', float: 'left', margin: '5px' }}>
          <label className={styles.proplbl} style={{ width: '68px' }}>
            返回提示
          </label>
          <ResourceRefView
            resRef={SelectedItem.ReturnVoice}
            refType={RefSelectorType.Audio}
            float="left"
            selectionChanged={value =>
              SelectedItem.setValue('ReturnVoice', value, ClassType.resource)
            }
          />
        </div>

        <div style={{ width: '245px', float: 'left', margin: '5px' }}>
          <div>
            <label className={styles.proplbl} style={{ width: '68px' }}>
              行列数量
            </label>
            <InputNumber
              style={{ float: 'left', width: 66 }}
              size="small"
              defaultValue={1}
              min={1}
              max={13}
              step={1}
              value={SelectedItem.RanksCount}
              onChange={value => {
                SelectedItem.setValue('RanksCount', value, ClassType.number);
                SelectedItem.setValue('RowNum', value, ClassType.number);
                SelectedItem.setValue('ColNum', value, ClassType.number);
              }}
            />
          </div>
        </div>
      </div>

      {/* 俄罗斯方块列表 */}
      <TetrisList SelectedItem={SelectedItem}></TetrisList>
      {/* 俄罗斯方块列表 */}

      <SelectedUnitsPropView
        selectedUnits={SelectedItem.SelectedUnits}
      ></SelectedUnitsPropView>

      <SelectedUnitsBlockPropView
        selectedUnits={SelectedItem.SelectedUnitsBlock}
      ></SelectedUnitsBlockPropView>
    </div>
  );
};

// 俄罗斯方块列表
@observer
class TetrisList extends PureComponent<any> {
  render() {
    const { SelectedItem } = this.props;

    var s = SelectedItem;
    return (
      <div
        style={{
          width: '255px',
          marginTop: '5px',
          marginLeft: '15px',
          float: 'left',
          height: '220px',
          border: '1px solid #DCDCDC',
          borderRadius: '5px',
        }}
      >
        <label style={{ float: 'left', marginLeft: '5px' }}>
          俄罗斯方块列表
        </label>

        <div
          style={{
            width: '100%',
            height: '150px',
            border: '1px solid #CCCCCC',
            borderRadius: '2px',
            overflow: 'auto',
            overflowX: 'hidden',
            float: 'left',
          }}
        >
          {SelectedItem?.UnitsBlock?.map((unit, i) => {
            return (
              <div
                key={i}
                onMouseDown={e => unit.SelectUnit(e)}
                style={{
                  width: '245px',
                  float: 'left',
                  margin: '5px',
                  backgroundColor: unit.IsSelected ? '#ef23' : null,
                }}
              >
                <label className={styles.proplbl} style={{ width: '68px' }}>
                  配置行列：
                </label>
                <label className={styles.proplbl}>行:</label>
                <InputNumber
                  style={{ float: 'left', width: '50px' }}
                  size="small"
                  max={13}
                  min={1}
                  step={1}
                  value={Number(unit.RowNum || 1)}
                  onChange={value => {
                    unit.RowNum = Number(value);
                  }}
                />
                <label className={styles.proplbl}>列:</label>
                <InputNumber
                  style={{ float: 'left', width: '50px' }}
                  size="small"
                  max={13}
                  min={1}
                  step={1}
                  value={Number(unit.ColNum || 1)}
                  onChange={value => {
                    unit.ColNum = Number(value);
                  }}
                />

                <div
                  style={{
                    width: '100%',
                    height: '1px',
                    marginTop: '2px',
                    float: 'left',
                    borderBottom: '1px solid black',
                  }}
                ></div>
              </div>
            );
          })}
        </div>

        <div style={{ width: '245px', float: 'left', margin: '5px' }}>
          <Button
            style={{
              width: '80px',
              padding: 1,
              marginLeft: '20px',
              float: 'left',
              height: '25px',
            }}
            onClick={event => AddItemCommand(SelectedItem)}
          >
            添加拼图
          </Button>
          <Button
            style={{ width: '80px', padding: 1, float: 'left', height: '25px' }}
            onClick={event => DeleteCommand(SelectedItem)}
          >
            删除选中
          </Button>
        </div>
      </div>
    );
  }
}

const DeleteCommand = SelectedItem => {
  let data = SelectedItem as tetrisComplex;
  if (data.UnitsBlock) {
    var selectedUnits = data.UnitsBlock.filter(x => x.IsSelected);
    if (selectedUnits.length > 0) {
      data.UnselectAllBlock();
      selectedUnits.forEach(element => {
        RUHelper.RemoveItem(data.UnitsBlock, element);
      });
    }
  }
};

const AddItemCommand = SelectedItem => {
  let data = SelectedItem as tetrisComplex;

  data.UnselectAllBlock();

  if (data.UnitsBlock) {
    var unit = new listBlockComplex();
    unit.Id = IdHelper.NewId();
    unit.X = 0;
    unit.Y = 0;
    unit.Father = data.thisData as tetrisComplex;
    unit.IsSelected = true;
    unit.RowNum = 1;
    unit.ColNum = 1;

    RUHelper.AddItem(data.UnitsBlock, unit);
  }
};
