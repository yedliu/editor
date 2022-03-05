import React, { PureComponent } from 'react';
import ResourceRefView from '../../control/resourceRefView';
import { ClassType } from '@/modelClasses/courseDetail/courseDetailenum';
import styles from '@/styles/property.less';
import dragSeekBarComplex from '@/modelClasses/courseDetail/editItemViewModels/complexControl/dragSeekBarControl/dragSeekBarComplex';
import dragSeekBarUnitComplex from '@/modelClasses/courseDetail/editItemViewModels/complexControl/dragSeekBarControl/dragSeekBarUnitComplex';
import { Checkbox, InputNumber, Select, Tooltip } from 'antd';
import CacheEntityServer, { ElementGroup } from '@/server/CacheEntityServer';
import { observer } from 'mobx-react';
import { RefSelectorType } from '@/modelClasses/courseDetail/resRef/resourceRef';
import KeyHelper from '@/utils/keyHelper';
import { EventListMaker } from '@/components/cwDesignUI/control/showHideItems/eventListMaker';
import CommonElementsSelector from '../../control/showHideItems/commonElementsSelector';

import {
  AppearItemIcon,
  StartFlagicon,
  EndFlagicon,
  HelpBlueIcon,
} from '@/svgs/designIcons';

const Template = props => {
  const { courseware, dataContext } = props;
  let data = dataContext as dragSeekBarComplex;
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
              let keyboardunit = unit as dragSeekBarUnitComplex;

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

                  {keyboardunit.MaskNormalRes && data.JumpInMode != 2 ? (
                    <img
                      src={keyboardunit.MaskNormalRes?.Resource?.resourceKey}
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
                  ) : null}

                  <div
                    style={{
                      userSelect: 'none',
                      position: 'absolute',
                      width: `${colWidth}px`,
                      height: `${rowHeight}px`,
                      background: keyboardunit.NormalRes
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
  let data = dataContext as dragSeekBarUnitComplex;
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
    const { selectedUnits, scene, JumpInMode } = this.props;
    let SelectedItem;
    let SelectedItems = null;
    SelectedItems = selectedUnits as dragSeekBarUnitComplex[];
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
                    单元底图
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

                {JumpInMode != 2 ? (
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
                      单元遮罩
                    </label>
                    <div
                      style={{
                        display: '-webkit-box',
                        WebkitBoxOrient: 'vertical',
                        WebkitBoxPack: 'end',
                      }}
                    >
                      <ResourceRefView
                        resRef={SelectedItem.MaskNormalRes}
                        float="right"
                        selectionChanged={value =>
                          SelectedItem.setValue(
                            'MaskNormalRes',
                            value,
                            ClassType.resource,
                          )
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

                {JumpInMode == 0 ? null : (
                  <div>
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
                )}
              </div>
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
          width: '255px',
          marginTop: '5px',
          marginLeft: '15px',
          float: 'left',
          height: '350px',
          border: '1px solid #DCDCDC',
          borderRadius: '5px',
        }}
      >
        {/* <label style={{ float: 'left', marginLeft: '5px' }}>拖动进度条</label> */}
        <div>
          <label style={{ float: 'left' }}>拖动进度条</label>
          <Tooltip
            style={{ float: 'left', whiteSpace: 'pre' }}
            placement="bottom"
            title="不知道怎么用点击这里试试"
          >
            {HelpBlueIcon(
              'https://hdkj-test.zmtalent.com/zmg_editor/zmg-pro-docs/docs/%E6%8E%A7%E4%BB%B6/%E6%8B%96%E5%8A%A8%E8%BF%9B%E5%BA%A6%E6%9D%A1.html',
            )}
          </Tooltip>
        </div>
        <div style={{ width: '245px', float: 'left', margin: '5px' }}>
          <label className={styles.proplbl} style={{ width: '52px' }}>
            关联按钮
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
            selectorName="关联按钮"
            icon={AppearItemIcon}
            elementIds={SelectedItem.ChessmanId}
            elementIdsChanged={newIds => {
              SelectedItem.setValue('ChessmanId', newIds, ClassType.string);
            }}
            isSingle={true}
            isDisableCombined={false}
            hasItemColor="#0056b3"
            noItemColor="#20272F"
          ></CommonElementsSelector>
        </div>

        <div style={{ width: '245px', float: 'left', margin: '5px' }}>
          <div>
            <label className={styles.proplbl} style={{ width: '52px' }}>
              拖动模式
            </label>
            <Select
              getPopupContainer={triggerNode => triggerNode.parentElement}
              defaultValue={0}
              style={{ float: 'left', width: 86 }}
              onChange={value => {
                if (value == 0) {
                  SelectedItem.setValue('ColNum', 1);
                }
                SelectedItem.setValue('JumpInMode', value);
              }}
              value={SelectedItem.JumpInMode}
              size={'small'}
            >
              <Select.Option value={0}>遮罩</Select.Option>
              <Select.Option value={1}>单元格</Select.Option>
              <Select.Option value={2}>复制</Select.Option>
            </Select>

            <label
              className={styles.proplbl}
              style={{ float: 'left', marginLeft: 7 }}
            >
              {SelectedItem.JumpInMode == 0 ? '均分' : '格数'}
            </label>

            {SelectedItem.JumpInMode == 0 ? (
              <InputNumber
                style={{ float: 'left', marginLeft: 5, width: 65 }}
                size="small"
                defaultValue={1}
                min={1}
                max={100}
                step={1}
                value={SelectedItem.Equipartition}
                onChange={value =>
                  SelectedItem.setValue(
                    'Equipartition',
                    value,
                    ClassType.number,
                  )
                }
              />
            ) : (
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
            )}
          </div>
        </div>

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
              终点格
            </label>
            <InputNumber
              style={{ float: 'left', width: 66 }}
              size="small"
              defaultValue={1}
              min={1}
              max={999}
              step={1}
              value={SelectedItem.EndCol}
              onChange={value =>
                SelectedItem.setValue('EndCol', value, ClassType.number)
              }
            />
          </div>

          <div style={{ width: '245px', float: 'left', margin: '5px' }}>
            <label
              className={styles.proplbl}
              style={{ width: '66px', marginTop: '10px' }}
            >
              滑动触发
            </label>
            <div style={{ float: 'left', width: 179 }}>
              <div style={{ float: 'left', width: '100%' }}>
                <label
                  className={styles.proplbl}
                  style={{ width: '50%', marginLeft: '40px' }}
                >
                  参与元素
                </label>
              </div>
              <div style={{ float: 'left', width: '100%' }}>
                {SelectedItem?.TriggerEvents?.map((event, i) => {
                  return (
                    <EventListMaker
                      showDelay={false}
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
              满足条件
            </label>
            <div style={{ float: 'left', width: 179 }}>
              <div style={{ float: 'left', width: '100%' }}>
                <label
                  className={styles.proplbl}
                  style={{ marginLeft: '10px' }}
                >
                  延迟
                </label>
                <label
                  className={styles.proplbl}
                  style={{ marginLeft: '30px' }}
                >
                  回时
                </label>
                <label
                  className={styles.proplbl}
                  style={{ marginLeft: '23px' }}
                >
                  参与元素
                </label>
              </div>
              <div style={{ float: 'left', width: '100%' }}>
                {SelectedItem?.SuccessEvents?.map((event, i) => {
                  return (
                    <EventListMaker
                      showDelay={true}
                      showRepeatDelay={true}
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
              不满足
            </label>
            <div style={{ float: 'left', width: 179 }}>
              <div style={{ float: 'left', width: '100%' }}>
                <label
                  className={styles.proplbl}
                  style={{ marginLeft: '10px' }}
                >
                  延迟
                </label>
                <label
                  className={styles.proplbl}
                  style={{ marginLeft: '30px' }}
                >
                  回时
                </label>
                <label
                  className={styles.proplbl}
                  style={{ marginLeft: '23px' }}
                >
                  参与元素
                </label>
              </div>
              <div style={{ float: 'left', width: '100%' }}>
                {SelectedItem?.FailEvents?.map((event, i) => {
                  return (
                    <EventListMaker
                      showDelay={true}
                      showRepeatDelay={true}
                      key={i}
                      actionVM={event}
                      scene={SelectedItem._elements[0].Scene}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <SelectedUnitsPropView
        selectedUnits={SelectedItem.SelectedUnits}
        scene={SelectedItem._elements[0].Scene}
        JumpInMode={SelectedItem.JumpInMode}
      ></SelectedUnitsPropView>
    </div>
  );
};
