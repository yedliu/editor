import React, { PureComponent, MouseEventHandler } from 'react';
import ResourceRefView from '../../control/resourceRefView';
import { ClassType } from '@/modelClasses/courseDetail/courseDetailenum';
import styles from '@/styles/property.less';
import WritingComplex from '@/modelClasses/courseDetail/editItemViewModels/complexControl/WritingControl/WritingComplex';
import WritingUnitBase from '@/modelClasses/courseDetail/editItemViewModels/complexControl/WritingControl/WritingUnitBase';
import WritingUnit from '@/modelClasses/courseDetail/editItemViewModels/complexControl/WritingControl/WritingUnit';
import WritingPointGroup from '@/modelClasses/courseDetail/editItemViewModels/complexControl/WritingControl/WritingPointGroup';
import CWResource from '@/modelClasses/courseDetail/cwResource';
import ColorPicker from '@/components/cwDesignUI/control/sketchColor';
import { PresetColorTypes } from 'antd/lib/_util/colors';
import { Alignment } from '@/modelClasses/courseDetail/editItemViewModels/textEditItem';
import TextBoxInfo from '../../control/textBoxInfo';
import { Select, Checkbox, List, InputNumber, Tooltip, Button } from 'antd';
import RUHelper from '@/redoundo/redoUndoHelper';
import CacheEntityServer from '@/server/CacheEntityServer';
import { observer } from 'mobx-react';
import UIHelper from '@/utils/uiHelper';
import { GeometryHelper, Point2D } from '@/utils/Math2D';
import stage from '@/models/stage';
import { array } from 'prop-types';
import { stores } from '@/pages';
import FreeScrollbar from '@/components/controls/scrollviewer';
import MetaHelper from '@/utils/metaHelper';
import { RefSelectorType } from '@/modelClasses/courseDetail/resRef/resourceRef';
import { HelpBlueIcon } from '@/svgs/designIcons';

const Template = props => {
  const { courseware, dataContext } = props;
  let data = dataContext as WritingComplex;

  //InitUnits(data, courseware.Library);
  var reskey = data.Background?.Resource?.resourceKey;

  return (
    <div
      className="WritingCanvas"
      style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        cursor: 'pointer',
        pointerEvents: data.IsShowToolbar ? 'visible' : 'none',
      }}
    >
      <img
        // onClick={event => AddPoint(event,data)}
        onMouseDown={event => AddPoint(event, data)}
        onMouseUp={event => AddPointonMouseUp(event, data)}
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
      <h2
        style={{
          position: 'absolute',
          left: data.Width - 200,
          top: data.Height - 40,
          color: '#e23',
        }}
      >
        {data.ShowRemind}
      </h2>

      {data.ShowAllPoint
        ? data.Units?.map((rowUnits, i) => {
            return (
              <div
                key={i}
                style={{
                  left: rowUnits?.X,
                  top: rowUnits?.Y,
                  position: 'absolute',
                  float: 'left',
                  width: rowUnits.Father?.Diameter,
                  height: rowUnits.Father?.Diameter,
                  border: rowUnits.IsSelected
                    ? '2px solid #63AAFF'
                    : '0px solid #000',
                }}
              >
                <div
                  style={{
                    background: rowUnits.Father?.subColor,
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    opacity: '0.5',
                  }}
                >
                  <h1
                    style={{
                      textAlign: 'center',
                      lineHeight: rowUnits.Father?.Diameter / 30,
                    }}
                  >
                    {rowUnits.SerialNumber}
                  </h1>
                </div>
              </div>
            );
          })
        : data.SelectedPointGroupValue?.PointList?.map((rowUnits, i) => {
            return (
              <div
                onMouseDown={e => rowUnits.PressLogicItem(e)}
                key={i}
                style={{
                  left: rowUnits?.X,
                  top: rowUnits?.Y,
                  // left: `${rowUnits?.Position.x}px`,
                  // top: `${rowUnits?.Position.y}px`,
                  position: 'absolute',
                  float: 'left',
                  width: rowUnits.Father?.Diameter,
                  height: rowUnits.Father?.Diameter,
                  border: rowUnits.IsSelected
                    ? '2px solid #63AAFF'
                    : '0px solid #000',
                }}
              >
                <div
                  style={{
                    background: rowUnits.Father?.subColor,
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    opacity: '0.5',
                  }}
                  // onClick={event => DivCellOnClick(event, rowUnits)}
                >
                  <h1
                    style={{
                      textAlign: 'center',
                      lineHeight: rowUnits.Father?.Diameter / 30,
                    }}
                  >
                    {rowUnits.SerialNumber}
                    {/* {i} */}
                    {/* {rowUnits.IsSelected?"true":"false"} */}
                  </h1>
                </div>
              </div>
            );
          })}
    </div>
  );
};

const DivCellOnClick = (event, dataContext) => {
  let data = dataContext as WritingUnit;
  if (data.IsSelected) data.IsSelected = false;
  else data.IsSelected = true;
};

export default Template;

@observer
class WritingPointList extends PureComponent<any> {
  render() {
    //const { WritingPointGroup } = this.props; SelectedItem
    const { SelectedItem } = this.props;

    var WritingPointGroup = SelectedItem.PointGroup;

    // <label className={styles.proplbl} style={{ width: '60px' }}>笔画</label>
    // <label className={styles.proplbl} style={{ width: '190px' }}>点</label>
    return (
      <div style={{ width: '250px', height: '230px' }}>
        <label className={styles.proplbl} style={{ width: '40px' }}>
          笔画
        </label>
        <label className={styles.proplbl} style={{ width: '30px' }}>
          闭合
        </label>
        <label className={styles.proplbl} style={{ width: '11px' }}>
          点
        </label>
        {SelectedItem.ShowAllPoint ? (
          <svg
            onClick={event => ShowAll(SelectedItem, false)}
            style={{ width: '30px', height: '20px' }}
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="2879"
          >
            <path
              d="M512 192c206.507 0 419.84 254.293 446.293 320C931.84 577.707 718.507 832 512 832 304.64 832 91.307 577.707 65.707 512 92.16 446.293 304.64 192 512 192m0-64C256 128 0 448 0 512s255.147 384 512 384c256 0 512-320 512-384S767.147 128 512 128z m0 0"
              fill="#363636"
              p-id="2880"
            ></path>
            <path
              d="M512 351.573c-88.747 0-160.427 71.68-160.427 160.427 0 88.747 71.68 160.427 160.427 160.427 88.747 0 160.427-71.68 160.427-160.427 0-88.747-71.68-160.427-160.427-160.427z m0 256.854c-52.907 0-96.427-42.667-96.427-96.427 0-52.907 42.667-96.427 96.427-96.427 52.907 0 95.573 42.667 95.573 96.427 0.854 52.907-42.666 96.427-95.573 96.427z m0 0"
              fill="#363636"
              p-id="2881"
            ></path>
          </svg>
        ) : (
          <svg
            onClick={event => ShowAll(SelectedItem, true)}
            style={{ width: '30px', height: '20px' }}
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="2641"
          >
            <path
              d="M510.3616 603.136c-6.144 0-12.288-0.2048-18.432-0.4096-205.4144-10.8544-340.1728-201.5232-345.7024-209.7152a30.8224 30.8224 0 0 1 50.5856-35.2256c1.2288 1.6384 123.6992 174.2848 299.008 183.296 110.1824 5.5296 219.7504-53.6576 326.2464-176.7424 11.0592-12.9024 30.5152-14.336 43.4176-3.072 12.9024 11.0592 14.336 30.5152 3.072 43.4176-114.2784 131.8912-234.496 198.4512-358.1952 198.4512z"
              fill="#C6C7CF"
              p-id="2642"
            ></path>
            <path
              d="M189.8496 622.3872c-7.168 0-14.336-2.4576-20.2752-7.5776-12.6976-11.0592-14.1312-30.5152-3.072-43.4176l91.3408-104.8576c11.0592-12.6976 30.5152-14.1312 43.4176-3.072 12.6976 11.0592 14.1312 30.5152 3.072 43.4176l-91.3408 104.8576c-6.144 7.168-14.5408 10.6496-23.1424 10.6496zM394.4448 723.5584a30.72 30.72 0 0 1-29.696-38.5024l34.6112-131.072a30.72 30.72 0 0 1 59.392 15.5648l-34.6112 131.072c-3.6864 13.9264-15.9744 22.9376-29.696 22.9376zM631.1936 735.0272c-13.5168 0-25.8048-8.8064-29.4912-22.528l-39.7312-142.5408a30.72 30.72 0 0 1 21.2992-37.888c16.1792-4.5056 33.3824 4.9152 37.888 21.2992l39.7312 142.5408a30.72 30.72 0 0 1-21.2992 37.888c-2.8672 1.024-5.5296 1.2288-8.3968 1.2288zM835.9936 622.3872c-7.7824 0-15.5648-2.8672-21.504-8.8064l-102.4-101.1712a30.5152 30.5152 0 0 1-0.2048-43.4176c11.8784-12.0832 31.3344-12.288 43.4176-0.2048l102.4 101.1712c12.0832 11.8784 12.288 31.3344 0.2048 43.4176-6.144 5.9392-14.1312 9.0112-21.9136 9.0112z"
              fill="#333333"
              p-id="2643"
            ></path>
          </svg>
        )}

        <Button
          style={{ width: '50px', padding: 1, marginLeft: '15px' }}
          onClick={event => AddItemCommand(SelectedItem)}
        >
          添加组
        </Button>
        <Button
          style={{ width: '50px', padding: 1 }}
          onClick={event => DeletePointCommand(SelectedItem)}
        >
          删除组
        </Button>

        <div
          style={{
            width: '100%',
            height: '100%',
            border: '1px solid #CCCCCC',
            borderRadius: '2px',
            overflow: 'scroll',
          }}
        >
          <div>
            {WritingPointGroup?.map((rowUnits, i) => {
              return (
                <div
                  key={i}
                  onClick={event =>
                    SelectPointItem(event, rowUnits, SelectedItem)
                  }
                  style={{
                    width: '100%',
                    //height: '30px',
                    height:
                      rowUnits.PointList.length / 8 < 1
                        ? 26
                        : Math.ceil(rowUnits.PointList.length / 7) * 23,
                    background:
                      rowUnits === SelectedItem.SelectedPointGroupValue
                        ? '#1DE0FF'
                        : null,
                  }}
                >
                  <div>
                    {/* <label className={styles.proplbl} style={{ width: '40px' }}> {rowUnits.Group} </label> */}
                    <h3
                      className={styles.proplbl}
                      style={{
                        textAlign: 'center',
                        lineHeight: 2.1,
                        width: '40px',
                        height:
                          rowUnits.PointList.length / 7 < 1
                            ? 20
                            : Math.ceil(rowUnits.PointList.length / 7) * 20,
                        //backgroundColor:'#e232  '
                      }}
                    >
                      {rowUnits.Group}
                    </h3>

                    <Checkbox
                      className={styles.proplbl}
                      checked={rowUnits.IsClose}
                      onChange={
                        event => {
                          rowUnits.IsClose = event.target.checked;
                        }
                        // SelectedItem.setValue(
                        //   'StrokePrompt',
                        //   event.target.checked,
                        //   ClassType.number,
                        // )
                      }
                    ></Checkbox>

                    <div
                      className={styles.proplbl}
                      style={{ marginLeft: '5px', width: '180px' }}
                    >
                      {rowUnits.PointList?.map((Unit, i) => {
                        return (
                          <div key={i} className={styles.proplbl}>
                            <div
                              onClick={event =>
                                SelectPointItem(event, rowUnits, SelectedItem)
                              }
                              style={{
                                width: '25px',
                                height: '25px',
                                borderRadius: '50%',
                                background: Unit.Father?.subColor,
                              }}
                            >
                              <h3
                                style={{
                                  textAlign: 'center',
                                  lineHeight: 1.5,
                                }}
                              >
                                {Unit.SerialNumber}
                                {/* {SelectedItem.Radius} */}
                              </h3>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

//#region 组的操作

const ShowAll = (SelectedItem, isShowAll) => {
  let data = SelectedItem as WritingComplex;
  //data.ShowAllPoint = isShowAll
  SelectedItem.setValue('SelectedPointGroupValue', null, ClassType.object);
  SelectedItem.setValue('ShowAllPoint', isShowAll, ClassType.object);
};

const AddItemCommand = SelectedItem => {
  let data = SelectedItem as WritingComplex;

  for (var i = 0; i <= data.PointGroup.length - 1; i++) {
    if (data.PointGroup[i].PointList.length == 0) return;
  }

  for (var i = 1; i <= data.PointGroup.length + 1; i++) {
    if (data.PointGroup.filter(x => x.Group == i).length == 0) {
      var unit = new WritingPointGroup();
      unit.Group = i;

      //data.PointGroup.push(unit);
      RUHelper.AddItem(data.PointGroup, unit, i - 1);

      SelectedItem.setValue('SelectedPointGroupValue', unit, ClassType.object);

      //data.PointGroup = data.PointGroup.sort((x,e)=>{return x.Group > e.Group ?-1:1});
      break;
    }
  }
};

const DeletePointCommand = SelectedItem => {
  let data = SelectedItem as WritingComplex;

  if (data.SelectedPointGroupValue) {
    var index = data.PointGroup.indexOf(data.SelectedPointGroupValue);
    if (index > -1) {
      //data.PointGroup.splice(index, 1);
      RUHelper.RemoveItem(data.PointGroup, data.SelectedPointGroupValue);

      if (data.PointGroup.length > 0) {
        //data.SelectedPointGroupValue = data.PointGroup[0];
        SelectedItem.setValue(
          'SelectedPointGroupValue',
          data.PointGroup[0],
          ClassType.object,
        );
      } else {
        SelectedItem.setValue(
          'SelectedPointGroupValue',
          null,
          ClassType.object,
        );
      }
    }
  }

  // if (SelectedPointGroupValue !=null)
  // {
  //     ActionManager.Instance.RemoveItem(this.PointGroup, this.SelectedPointGroupValue);
  //     if (PointGroup.Count >= 1)
  //         SelectedPointGroupValue = PointGroup[0];

  //     RaisePropertyChanged(nameof(IsAdd));
  // }
};

//#endregion

//#region  点的增删选
const AddPointonMouseUp = (e: React.MouseEvent<HTMLElement>, dataContext) => {
  e.preventDefault();
  e.stopPropagation();
};

const AddPoint = (e: React.MouseEvent<HTMLElement>, dataContext) => {
  let data = dataContext as WritingComplex;

  //e.preventDefault();
  //e.stopPropagation();
  data.ShowRemind = '';
  data.UnselectAll();

  // if (e.button != 2)
  //     return;

  if (e.button == 0 && e.altKey) {
    var uiElement = e.target as HTMLElement;
    var unity = new WritingUnit();
    unity.Father = data;
    unity.Father.Color = data.Color;
    var canvas = UIHelper.FindAncestorByClassName(uiElement, 'WritingCanvas');
    var StageScale = data.Scene.Courseware.StageScale;
    var mouseStartPosition = GeometryHelper.GetPosition(
      canvas,
      new Point2D(e.clientX, e.clientY),
    );
    unity.X = mouseStartPosition.x * (1 / StageScale) - data.Diameter / 2;
    unity.Y = mouseStartPosition.y * (1 / StageScale) - data.Diameter / 2;
    if (data.SelectedPointGroupValue) {
      unity.Group = data.SelectedPointGroupValue.Group;
      unity.SerialNumber = data.SelectedPointGroupValue.PointList.length + 1;
      RUHelper.AddItem(data.SelectedPointGroupValue.PointList, unity);
    } else {
      data.ShowRemind = '请先添加笔画组配置';
    }
  } else {
    data.ShowRemind = 'Alt+鼠标左键添加点';
  }
};

const SelectPointItem = (
  e: React.MouseEvent<HTMLElement>,
  dataContext,
  SelectedItem,
) => {
  let data = dataContext as WritingPointGroup;
  let si = SelectedItem as WritingComplex;

  SelectedItem.setValue('SelectedPointGroupValue', data, ClassType.object);
};

const DeleteSelectPointItem = SelectedItem => {
  let si = SelectedItem as WritingComplex;
  //SelectedItem.SelectedPointGroupValue.PointList.splice(SelectedItem.SelectedPointGroupValue.PointList.length-1,1);
  if (SelectedItem.SelectedPointGroupValue.PointList.length > 0)
    RUHelper.RemoveItem(
      SelectedItem.SelectedPointGroupValue.PointList,
      SelectedItem.SelectedPointGroupValue.PointList[
        SelectedItem.SelectedPointGroupValue.PointList.length - 1
      ],
    );
};

//#endregion

@observer
class WritingUnitPropPanel extends PureComponent<any> {
  render() {
    const { SelectedUnits } = this.props;
    //console.log({SelectedUnits});

    let SelectedItem;
    let SelectedItems = null;
    if (SelectedUnits != null && SelectedUnits.length > 0) {
      SelectedItems = SelectedUnits as WritingUnit[];
      SelectedItem = CacheEntityServer.getPropPanel(SelectedItems);
      // console.log('我是console.log(SelectedItem);');
      // console.log(SelectedItem);
    }

    if (SelectedItems == null) return null;

    return (
      <div
        style={{
          width: '250px',
          border: '1px solid #CCCCCC',
          borderRadius: '2px',
          height: '160px',
        }}
      >
        <label className={styles.proplbl}>点配置</label>
        <div>
          <div className={styles.propdiv}>
            <label className={styles.proplbl} style={{ width: '60px' }}>
              序号
            </label>

            <label className={styles.proplbl}>
              {SelectedItem.SerialNumber || '0'}
            </label>
            {/* <TextBoxInfo
              txtnote=""
              text={SelectedItem.SerialNumber || '0'}
              onTextChange={value =>
                SelectedItem.setValue('SerialNumber', value, ClassType.number)
              }
            /> */}
          </div>
          <div className={styles.propdiv}>
            <label className={styles.proplbl} style={{ width: '40px' }}>
              位置
            </label>
            <div style={{ float: 'left' }}>
              <TextBoxInfo
                txtnote=""
                text={SelectedItem.X || '0'}
                onTextChange={value =>
                  SelectedItem.setValue('X', value, ClassType.number)
                }
              />
              <TextBoxInfo
                txtnote=""
                text={SelectedItem.Y || '0'}
                onTextChange={value =>
                  SelectedItem.setValue('Y', value, ClassType.number)
                }
              />
            </div>
          </div>

          <div className={styles.propdiv}>
            <label className={styles.proplbl} style={{ width: '58px' }}>
              音频
            </label>
            <ResourceRefView
              refType={RefSelectorType.Audio}
              resRef={SelectedItem.PromptVoice}
              float="left"
              // style={{ width: 76, float: 'left', marginLeft: 20 }}
              selectionChanged={value =>
                SelectedItem.setValue('PromptVoice', value, ClassType.resource)
              }
            />
          </div>
        </div>
      </div>
    );
  }
}

export const PropPanelTemplate = SelectedItem => {
  let SelectedUnits = SelectedItem.SelectedUnits;

  return (
    <div style={{ width: '250px' }}>
      <div className={styles.propdiv}>
        <label style={{ float: 'left' }}>文字书写</label>
        <Tooltip
          style={{ float: 'left', whiteSpace: 'pre' }}
          placement="bottom"
          title="不知道怎么用点击这里试试"
        >
          {HelpBlueIcon(
            'https://hdkj-test.zmtalent.com/zmg_editor/zmg-pro-docs/docs/%E6%8E%A7%E4%BB%B6/%E6%96%87%E5%AD%97%E4%B9%A6%E5%86%99%E6%8E%A7%E4%BB%B6.html',
          )}
        </Tooltip>
      </div>
      <div className={styles.propdiv}>
        <label className={styles.proplbl}>背景</label>
        <ResourceRefView
          resRef={SelectedItem.Background}
          float="right"
          // style={{ width: 76, float: 'left', marginLeft: 20 }}
          selectionChanged={value =>
            SelectedItem.setValue('Background', value, ClassType.resource)
          }
        />
      </div>
      <div className={styles.propdiv}>
        <label className={styles.proplbl} style={{ width: '63px' }}>
          半径
        </label>

        <InputNumber
          style={{ width: 76, float: 'left', marginLeft: 18 }}
          size="small"
          max={9999}
          min={0}
          step={1}
          value={Number(SelectedItem.Radius || 0)}
          onChange={value =>
            SelectedItem.setValue('Radius', value, ClassType.number)
          }
        />
      </div>
      <div className={styles.propdiv}>
        <label className={styles.proplbl} style={{ width: '63px' }}>
          笔画宽度
        </label>

        <InputNumber
          style={{ width: 76, float: 'left', marginLeft: 18 }}
          size="small"
          max={9999}
          min={0}
          step={1}
          value={SelectedItem.StrokeWidth || '0'}
          onChange={value =>
            SelectedItem.setValue('StrokeWidth', value, ClassType.number)
          }
        />
      </div>
      <div className={styles.propdiv}>
        <label className={styles.proplbl} style={{ width: '63px' }}>
          判断模式
        </label>
        <Select
          disabled={SelectedItem.JudgeMode == 0}
          getPopupContainer={triggerNode => triggerNode.parentElement}
          defaultValue={0}
          style={{ width: 76, float: 'left', marginLeft: 18 }}
          onChange={value => SelectedItem.setValue('JudgeMode', value)}
          value={SelectedItem.JudgeMode}
          size={'small'}
        >
          <Select.Option value={0}>普通</Select.Option>
          <Select.Option value={1}>闭合</Select.Option>
        </Select>
      </div>
      <div className={styles.propdiv}>
        <label className={styles.proplbl} style={{ width: '63px' }}>
          书写模式
        </label>
        <Select
          getPopupContainer={triggerNode => triggerNode.parentElement}
          defaultValue={0}
          style={{ width: 76, float: 'left', marginLeft: 18 }}
          onChange={value => SelectedItem.setValue('WritingMode', value)}
          value={SelectedItem.WritingMode}
          size={'small'}
        >
          <Select.Option value={0}>颜色</Select.Option>
          <Select.Option value={1}>纹理</Select.Option>
        </Select>
      </div>

      {SelectedItem.WritingMode == 1 ? (
        <div className={styles.propdiv}>
          <label className={styles.proplbl}>纹理</label>
          <ResourceRefView
            resRef={SelectedItem.Texture}
            float="right"
            selectionChanged={value =>
              SelectedItem.setValue('Texture', value, ClassType.resource)
            }
          />
        </div>
      ) : null}

      <div className={styles.propdiv}>
        <label className={styles.proplbl} style={{ width: '83px' }}>
          保留笔迹
        </label>
        <Checkbox
          checked={SelectedItem.KeepHandwriting}
          onChange={event =>
            SelectedItem.setValue(
              'KeepHandwriting',
              event.target.checked,
              ClassType.bool,
            )
          }
          style={{ float: 'left', height: '20px', fontSize: '10px' }}
        ></Checkbox>
      </div>
      <div className={styles.propdiv}>
        <label className={styles.proplbl} style={{ width: '83px' }}>
          笔画提示
        </label>
        <Checkbox
          checked={SelectedItem.StrokePrompt}
          onChange={event =>
            SelectedItem.setValue(
              'StrokePrompt',
              event.target.checked,
              ClassType.bool,
            )
          }
          style={{ float: 'left', height: '20px', fontSize: '10px' }}
        ></Checkbox>
      </div>
      <div className={styles.propdiv}>
        <label className={styles.proplbl} style={{ width: '83px' }}>
          填充颜色
        </label>
        <ColorPicker
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
      </div>

      <div className={styles.propdiv}>
        <WritingPointList SelectedItem={SelectedItem}></WritingPointList>
      </div>

      <div className={styles.propdiv}>
        <Button
          style={{ marginLeft: '50px', marginTop: '15px' }}
          onClick={event => DeleteSelectPointItem(SelectedItem)}
        >
          删除最后一个点
        </Button>
      </div>
      <div className={styles.propdiv}>
        <WritingUnitPropPanel
          SelectedUnits={SelectedUnits}
        ></WritingUnitPropPanel>
      </div>
    </div>
  );
};
