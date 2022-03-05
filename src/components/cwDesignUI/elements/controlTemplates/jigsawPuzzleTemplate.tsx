import React, { PureComponent, MouseEventHandler } from 'react';
import { observer } from 'mobx-react';
import styles from '@/styles/property.less';
import { ClassType } from '@/modelClasses/courseDetail/courseDetailenum';
import ResourceRefView from '../../control/resourceRefView';
import jigsawPuzzleViewModel from '@/modelClasses/courseDetail/editItemViewModels/complexControl/jigsawPuzzleControl/jigsawPuzzleViewModel';
import { Select, Checkbox, InputNumber, Button, Tooltip } from 'antd';
import TextBoxInfo from '../../control/textBoxInfo';
import { RefSelectorType } from '@/modelClasses/courseDetail/resRef/resourceRef';
import jigsawPuzzleUnitBaseViewModel from '@/modelClasses/courseDetail/editItemViewModels/complexControl/jigsawPuzzleControl/jigsawPuzzleUnitBaseViewModel';
import CacheEntityServer from '@/server/CacheEntityServer';
import RUHelper from '@/redoundo/redoUndoHelper';
import IdHelper from '@/utils/idHelper';
import { TextAutomaticTag } from '@/components/controls/textAutomaticTag';
import { HelpBlueIcon } from '@/svgs/designIcons';

const Template = props => {
  const { courseware, dataContext, isMainView } = props;
  let data = dataContext as jigsawPuzzleViewModel;

  var _MaxValueCount;
  var vCellWidth = 0;
  var vCellHeight = 0;
  //if (isMainView != false) {
  var error = 0.5;
  vCellWidth = data.Width / data.Linefeed - error;
  vCellHeight = vCellWidth - error;
  var w = data.Width / vCellWidth;
  var h = data.Height / vCellHeight;
  var js = parseInt(w.toString()) * parseInt(h.toString()); //不要四舍五入
  _MaxValueCount = new Array<number>();
  for (let index = 0; index < js; index++) {
    _MaxValueCount.push(index);
    if (index >= 300) break;
  }
  //}

  return (
    <div
      className="DragCanvas"
      style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        cursor: 'pointer',
        pointerEvents: data.IsShowToolbar ? 'visible' : 'none',
      }}
    >
      <img
        src={data.Background?.Resource?.resourceKey}
        style={{
          position: 'absolute',
          height: '100%',
          width: '100%',
          objectFit: 'fill',
          userSelect: 'none',
        }}
        draggable={false}
      ></img>
      <div
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
        }}
      >
        {_MaxValueCount?.map((item, i) => {
          return (
            <div
              key={i}
              style={{
                float: 'left',
                width: vCellWidth,
                height: vCellHeight,
                border: '1px dashed #63AAFF',
                //background:'repeating-linear-gradient(135deg,transparent, transparent 3%, #00000033 3%,#00000033 5%)',
              }}
            >
              <img
                src={data.UnitResource?.Resource?.resourceKey}
                style={{
                  //position: 'absolute',
                  marginLeft:
                    (data.CellWidth - data.UnitResourceWidth) / 2 >= 0
                      ? (data.CellWidth - data.UnitResourceWidth) / 2
                      : 0,
                  marginTop:
                    (data.CellHeight - data.UnitResourceHeight) / 2 >= 0
                      ? (data.CellHeight - data.UnitResourceHeight) / 2
                      : 0,
                  height: data.UnitResourceHeight,
                  width: data.UnitResourceWidth,
                  objectFit: 'fill',
                  userSelect: 'none',
                }}
                draggable={false}
              ></img>
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
        {data.Units?.map((rowUnits, i) => {
          let imgWidth =
            rowUnits.Width - rowUnits.MarginRight - rowUnits.MarginLeft - 6;
          let imgHeight =
            rowUnits.Height - rowUnits.MarginTop - rowUnits.MarginBottom - 6;

          return (
            <div
              className="unit"
              onMouseDown={e => rowUnits.DragItemCanvas(e)}
              key={i}
              style={{
                left: rowUnits?.X,
                top: rowUnits?.Y,
                position: 'absolute',
                float: 'left',
                // width: rowUnits?.Width,
                // height: rowUnits?.Height,
                width: rowUnits.Father.CellWidth * rowUnits.RanksCount,
                height: rowUnits.Father.CellHeight * rowUnits.RanksCount,
                border: rowUnits.IsSelected
                  ? '2px solid #63AAFF'
                  : '2px solid #000',
                zIndex: rowUnits.IsSelected ? 2 : 0,
              }}
            >
              <div
                style={{
                  width: '100%',
                  height: '100%',
                }}
              >
                <img
                  src={rowUnits.NormalRes?.Resource?.resourceKey}
                  style={{
                    position: 'absolute',
                    // height: '100%',
                    // width: '100%',
                    left: rowUnits.MarginLeft,
                    top: rowUnits.MarginTop,
                    width: `${imgWidth}px`,
                    height: `${imgHeight}px`,
                    objectFit: 'fill',
                    userSelect: 'none',
                    transform: `rotate(${rowUnits.Angle}deg)`,
                  }}
                  draggable={false}
                ></img>
                <h1
                  style={{
                    position: 'absolute',
                    textAlign: 'center',
                    left: rowUnits.Width / 2 - 10,
                    top: rowUnits.Height / 2 - 20,
                  }}
                >
                  {i}
                </h1>
              </div>
            </div>
          );
        })}
      </div>

      {_MaxValueCount?.length >= 300 ? (
        <h1
          style={{
            backgroundColor: '#DDDDDD',
            opacity: '0.8',
            position: 'absolute',
            left: data.Width / 2 - 100,
            top: data.Height / 2 - 40,
            color: '#e23',
          }}
        >
          显示部分参考
        </h1>
      ) : null}
    </div>
  );
};

///初始化获取的参数
const InitUnits = () => {};

export default Template;

export const PropPanelTemplate = SelectedItem => {
  let SelectedUnits = SelectedItem.SelectedUnits;

  return (
    <div>
      <div
        style={{
          width: '255px',
          marginTop: '5px',
          marginLeft: '15px',
          float: 'left',
          height: '200px',
          border: '1px solid #DCDCDC',
          borderRadius: '5px',
        }}
      >
        {/* <label style={{ float: 'left', marginLeft: '5px' }}>布局盒子</label> */}
        <label style={{ float: 'left' }}>拼图控件</label>
        <Tooltip
          style={{ float: 'left', whiteSpace: 'pre' }}
          placement="bottom"
          title="不知道怎么用点击这里试试"
        >
          {HelpBlueIcon(
            'https://hdkj-test.zmtalent.com/zmg_editor/zmg-pro-docs/docs/%E6%8E%A7%E4%BB%B6/%E6%8B%BC%E5%9B%BE%E6%8E%A7%E4%BB%B6.html',
          )}
        </Tooltip>

        <div style={{ width: '245px', float: 'left', margin: '5px' }}>
          <label className={styles.proplbl} style={{ width: '68px' }}>
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
          <label className={styles.proplbl} style={{ width: '68px' }}>
            音频文本
          </label>
          <ResourceRefView
            resRef={SelectedItem.SelectVoice}
            refType={RefSelectorType.Audio}
            float="left"
            selectionChanged={value =>
              SelectedItem.setValue('SelectVoice', value, ClassType.resource)
            }
          />
        </div>

        {SelectedItem.JumpInMode == 2 ? null : (
          <div style={{ width: '245px', float: 'left', margin: '5px' }}>
            <label className={styles.proplbl} style={{ width: '68px' }}>
              换行数量
            </label>
            <InputNumber
              style={{ float: 'left' }}
              size="small"
              max={14}
              min={4}
              step={1}
              value={SelectedItem.Linefeed || 0}
              onChange={value =>
                SelectedItem.setValue('Linefeed', Number(value))
              }
            />
          </div>
        )}
      </div>

      {/* 单元格配置样式 */}
      <div
        style={{
          width: '255px',
          marginTop: '5px',
          marginLeft: '15px',
          float: 'left',
          height: '130px',
          border: '1px solid #DCDCDC',
          borderRadius: '5px',
        }}
      >
        <label style={{ float: 'left', marginLeft: '5px' }}>
          单元格统一配置
        </label>

        <div style={{ width: '245px', float: 'left', margin: '5px' }}>
          <label className={styles.proplbl} style={{ width: '68px' }}>
            单元资源
          </label>
          <ResourceRefView
            resRef={SelectedItem.UnitResource}
            float="left"
            selectionChanged={value =>
              SelectedItem.setValue('UnitResource', value, ClassType.resource)
            }
          />
        </div>

        <div style={{ width: '245px', float: 'left', margin: '5px' }}>
          <label className={styles.proplbl} style={{ width: '68px' }}>
            资源缩放
          </label>
          <InputNumber
            style={{ float: 'left' }}
            size="small"
            max={600}
            min={0}
            step={1}
            value={Number(SelectedItem.UnitZoom || 0)}
            formatter={v => v + '%'}
            parser={value => value.replaceAll('%', '')}
            onChange={value => {
              SelectedItem.setValue('UnitZoom', Number(value));
              //SelectedItem.setValue('UnitResourceWidth', Number(value));
            }}
          />
        </div>
      </div>
      {/* 单元格配置样式 */}

      {/* 拼图配置样式 */}
      <JigsawPuzzleList SelectedItem={SelectedItem}></JigsawPuzzleList>
      {/* 拼图配置样式 */}

      {/* 选中拼图配置 */}
      <JigsawPuzzleUnitPropPanel
        SelectedUnits={SelectedUnits}
      ></JigsawPuzzleUnitPropPanel>
      {/* 选中拼图配置 */}
    </div>
  );
};

//选中拼图配置
@observer
class JigsawPuzzleUnitPropPanel extends PureComponent<any> {
  render() {
    const { SelectedUnits } = this.props;
    //console.log({SelectedUnits});

    let SelectedItem;
    let SelectedItems = null;
    if (SelectedUnits != null && SelectedUnits.length > 0) {
      SelectedItems = SelectedUnits as jigsawPuzzleUnitBaseViewModel[];
      SelectedItem = CacheEntityServer.getPropPanel(SelectedItems);
    }

    if (SelectedItems == null) return null;

    return (
      <div>
        <div
          style={{
            width: '255px',
            marginTop: '5px',
            marginLeft: '15px',
            float: 'left',
            height: '330px',
            border: '1px solid #DCDCDC',
            borderRadius: '5px',
          }}
        >
          <label style={{ float: 'left', marginLeft: '5px' }}>
            选中拼图配置
          </label>

          <div style={{ width: '245px', float: 'left', margin: '5px' }}>
            <label className={styles.proplbl} style={{ width: '68px' }}>
              资源
            </label>
            <ResourceRefView
              resRef={SelectedItem.NormalRes}
              float="left"
              selectionChanged={value =>
                SelectedItem.setValue('NormalRes', value, ClassType.resource)
              }
            />
          </div>

          <div style={{ width: '245px', float: 'left', margin: '5px' }}>
            <label className={styles.proplbl} style={{ width: '68px' }}>
              选中资源
            </label>
            <ResourceRefView
              resRef={SelectedItem.ChoiceNormalRes}
              float="left"
              selectionChanged={value =>
                SelectedItem.setValue(
                  'ChoiceNormalRes',
                  value,
                  ClassType.resource,
                )
              }
            />
          </div>

          <div style={{ width: '245px', float: 'left', margin: '5px' }}>
            <label className={styles.proplbl} style={{ width: '68px' }}>
              行列数量
            </label>
            <Select
              getPopupContainer={triggerNode => triggerNode.parentElement}
              defaultValue={0}
              style={{ width: 120, float: 'left' }}
              onChange={value => {
                SelectedItem.setValue('RanksCount', value);
              }}
              value={SelectedItem.RanksCount}
              size={'small'}
            >
              <Select.Option value={3}>3</Select.Option>
              <Select.Option value={5}>5</Select.Option>
              <Select.Option value={7}>7</Select.Option>
              <Select.Option value={9}>9</Select.Option>
            </Select>
          </div>

          <div style={{ width: '245px', float: 'left', margin: '5px' }}>
            <label className={styles.proplbl} style={{ width: '50px' }}>
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
          {/* <div style={{ width: '245px', float: 'left', margin: '5px' }}>
            <label className={styles.proplbl} style={{ width: '50px' }}>
              宽高
            </label>
            <div style={{ float: 'left' }}>
              <TextBoxInfo
                txtnote=""
                text={SelectedItem.Width || '0'}
                onTextChange={value =>
                  SelectedItem.setValue('Width', value, ClassType.number)
                }
              />
              <TextBoxInfo
                txtnote=""
                text={SelectedItem.Height || '0'}
                onTextChange={value =>
                  SelectedItem.setValue('Height', value, ClassType.number)
                }
              />
            </div>
          </div> */}

          <div>
            <div
              style={{
                display: '-webkit-box',
                width: '245px',
                float: 'left',
                margin: '5px',
                WebkitBoxOrient: 'horizontal',
                WebkitBoxPack: 'justify',
              }}
            >
              <label className={styles.normallbl} style={{ width: '50px' }}>
                旋转角度
              </label>
              <InputNumber
                style={{
                  width: '170px',
                  marginLeft: '20px',
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
                width: '245px',
                float: 'left',
                margin: '5px',
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
        </div>
      </div>
    );
  }
}

// 拼图列表
@observer
class JigsawPuzzleList extends PureComponent<any> {
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
          height: '330px',
          border: '1px solid #DCDCDC',
          borderRadius: '5px',
        }}
      >
        <label style={{ float: 'left', marginLeft: '5px' }}>拼图配置列表</label>

        <div
          style={{
            width: '100%',
            height: '270px',
            border: '1px solid #CCCCCC',
            borderRadius: '2px',
            overflow: 'auto',
            overflowX: 'hidden',
            float: 'left',
          }}
        >
          {SelectedItem?.Units?.map((unit, i) => {
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
                <div style={{ width: '245px', float: 'left' }}>
                  <label style={{ width: '68px', float: 'left' }}>资源</label>
                  <ResourceRefView
                    resRef={unit.NormalRes}
                    float="left"
                    selectionChanged={value => {
                      unit.NormalRes = value;
                    }}
                  />
                </div>

                <div style={{ width: '245px', float: 'left' }}>
                  <button
                    onClick={e => unit.SetSolutionCommand()}
                    style={{ width: '60px', height: '25px', float: 'left' }}
                  >
                    答案
                  </button>
                  <label style={{ float: 'left', marginLeft: '8px' }}>
                    行:{unit.AnswersRow}
                  </label>
                  <label style={{ float: 'left', marginLeft: '2px' }}>
                    列:{unit.AnswersColumn}
                  </label>
                </div>

                <div style={{ width: '245px', float: 'left' }}>
                  <label style={{ float: 'left', marginLeft: '68px' }}>
                    角度:
                  </label>
                  <div
                    style={{
                      float: 'left',
                      width: '120px',
                    }}
                  >
                    <TextAutomaticTag
                      regular="^[0-9]+$" //支持正则验证
                      onChange={value => (unit.AnswersAngle = value)}
                      separator="^"
                      value={unit.AnswersAngle || ''}
                    ></TextAutomaticTag>
                  </div>
                  {/* <TextBoxInfo
                    style={{ width: '120px', float: 'left' }}
                    txtnote=""
                    text={unit.AnswersAngle || ''}
                    onTextChange={value => {
                      unit.AnswersAngle = value;
                    }}
                  /> */}
                </div>

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
  let data = SelectedItem as jigsawPuzzleViewModel;
  // data.HandShowToolbar = false;
  if (data.Units) {
    var selectedUnits = data.Units.filter(x => x.IsSelected);
    if (selectedUnits.length > 0) {
      selectedUnits.forEach(element => {
        RUHelper.RemoveItem(data.Units, element);
      });
    }
  }
};

const AddItemCommand = SelectedItem => {
  let data = SelectedItem as jigsawPuzzleViewModel;
  if (data.Units) {
    var unit = new jigsawPuzzleUnitBaseViewModel();
    unit.Id = IdHelper.NewId();
    unit.X = 0;
    unit.Y = 0;
    unit.Father = data.thisData as jigsawPuzzleViewModel;
    unit.IsSelected = false;
    unit.RanksCount = 3;

    RUHelper.AddItem(data.Units, unit);
  }
};
