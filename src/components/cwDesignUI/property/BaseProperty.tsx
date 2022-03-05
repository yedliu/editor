import React, { HtmlHTMLAttributes } from 'react';
import { observer, inject } from 'mobx-react';
import styles from '@/styles/property.less';
import TextBoxInfo from '@/components/cwDesignUI/control/textBoxInfo';
import ToggleButton from '@/components/cwDesignUI/control/toggleButton';
import { Button, Select, Checkbox, Input } from 'antd';
import { RefreshIcon, FlipXIcon, FlipYIcon } from '@/utils/customIcon';
import CWSubstance from '@/modelClasses/courseDetail/cwSubstance';
import CWElement from '@/modelClasses/courseDetail/cwElement';
import CacheEntityServer from '@/server/CacheEntityServer';
import { from } from 'linq-to-typescript';
import {
  AnimationType,
  IncludedType,
  ZoomType,
  AppearTypes,
  ClassType,
  CWResourceTypes,
  ElementTypes,
} from '@/modelClasses/courseDetail/courseDetailenum';
import { Type } from '@/class-transformer';
import PageProperty from './PageProperty';
import { InputNumber } from 'antd';
import { number } from 'prop-types';
@inject('courseware')
@observer
class BaseProperty extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
  }

  render() {
    const { courseware } = this.props;
    const { Option } = Select;
    const { SelectedPage } = courseware as CWSubstance;
    let SelectedItem;
    let SelectedItems = null;
    if (
      SelectedPage != null &&
      SelectedPage.SelectedItems != null &&
      SelectedPage.SelectedItems.length > 0
    ) {
      SelectedItems = SelectedPage.SelectedItems as CWElement[];
      SelectedItem = CacheEntityServer.getPropPanel(SelectedItems);
    }

    if (SelectedItems == null) return <PageProperty />;
    else {
      var indexList = [];
      for (let i = 0; i < 30; i++) {
        indexList.push(
          <Option key={i} value={i}>
            {i}
          </Option>,
        );
      }
      var timerList = [];
      for (let i = 0; i < 10; i++) {
        timerList.push(
          <Option key={i * 0.25} value={i * 0.25}>
            {i * 0.25}
          </Option>,
        );
      }
      return (
        <div
          //className="scrollableView modified-ant-elements"
          style={{
            width: '100%',
            height: '100%',
            overflow: 'auto',
          }}
        >
          <div
            style={{
              width: '250px',
            }}
          >
            {SelectedItem.Id ? (
              <div className={styles.propdiv}>
                <label className={styles.proplbl}>编号</label>
                <div style={{ float: 'right' }}>
                  <div style={{ width: '170px', wordBreak: 'break-all' }}>
                    {SelectedItem.Id}
                  </div>
                </div>
              </div>
            ) : null}
            <div className={styles.propdiv}>
              <label className={styles.proplbl}>名称</label>
              <div style={{ float: 'right' }}>
                <Input
                  size="small"
                  value={SelectedItem.Name || ''}
                  onChange={event =>
                    SelectedItem.setValue('Name', event.target.value)
                  }
                  className={styles.proptxt}
                  style={{ width: '170px' }}
                />
              </div>
            </div>
            <div className={styles.propdiv}>
              <label className={styles.proplbl}>相对位置</label>
              <div style={{ float: 'right' }}>
                <Input
                  size="small"
                  type="number"
                  suffix="X"
                  style={{ width: '90px' }}
                  value={SelectedItem.X || '0'}
                  onChange={value =>
                    SelectedItem.setValue(
                      'X',
                      value.target.value,
                      ClassType.number,
                    )
                  }
                />
                <Input
                  size="small"
                  type="number"
                  suffix="Y"
                  style={{ width: '90px', marginLeft: '12px' }}
                  value={SelectedItem.Y || '0'}
                  onChange={value =>
                    SelectedItem.setValue(
                      'Y',
                      value.target.value,
                      ClassType.number,
                    )
                  }
                />
              </div>
            </div>
            <div className={styles.propdiv}>
              <label className={styles.proplbl}>绝对位置</label>
              <div style={{ float: 'right' }}>
                <Input
                  size="small"
                  type="number"
                  suffix="X"
                  style={{ width: '90px' }}
                  value={SelectedItem.AbsoluteLeft || '0'}
                  onChange={value => {
                    SelectedItem.setValue(
                      'AbsoluteLeft',
                      value.target.value,
                      ClassType.number,
                    );
                  }}
                />
                <Input
                  size="small"
                  type="number"
                  suffix="Y"
                  style={{ width: '90px', marginLeft: '12px' }}
                  value={SelectedItem.AbsoluteTop || '0'}
                  onChange={value =>
                    SelectedItem.setValue(
                      'AbsoluteTop',
                      value.target.value,
                      ClassType.number,
                    )
                  }
                />
              </div>
            </div>
            <div className={styles.propdiv}>
              <label className={styles.proplbl}>尺寸</label>
              <div style={{ float: 'right' }}>
                <Input
                  size="small"
                  suffix="W"
                  style={{ width: '80px' }}
                  value={SelectedItem.Width || '0'}
                  onChange={value =>
                    SelectedItem.setValue(
                      'Width',
                      value.target.value,
                      ClassType.number,
                    )
                  }
                />
                <Input
                  size="small"
                  suffix="H"
                  style={{ width: '80px', marginLeft: '12px' }}
                  value={SelectedItem.Height || '0'}
                  onChange={value =>
                    SelectedItem.setValue(
                      'Height',
                      value.target.value,
                      ClassType.number,
                    )
                  }
                />
              </div>
            </div>
            <div className={styles.propdiv}>
              <label className={styles.proplbl}>比例%</label>
              <div style={{ marginLeft: '81px' }}>
                <InputNumber
                  size="small"
                  max={Number.POSITIVE_INFINITY}
                  min={0}
                  step={10}
                  value={Number(SelectedItem.PercentSize) || null}
                  onChange={value =>
                    SelectedItem.setValue(
                      'PercentSize',
                      value == null || value == '' ? null : Number(value),
                    )
                  }
                  formatter={value =>
                    SelectedItem.HasSizableRes && value != null && value != ''
                      ? `${value}`
                      : '--'
                  }
                  // parser={value => value.replace('%', '').replace('-', '')}
                />
                <span>%</span>
                <Button
                  type="dashed"
                  size={'small'}
                  icon={<RefreshIcon />}
                  style={{ background: 'transparent', border: '0px' }}
                  onClick={() => {
                    SelectedItem.setValue('PercentSize', 100);
                  }}
                />
              </div>
            </div>
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
            <div className={styles.propdiv} style={{ display: 'flex' }}>
              <label className={styles.proplbl}>旋转角度</label>
              <Input
                size="small"
                style={{ marginLeft: '33px' }}
                className={styles.proptxt}
                value={SelectedItem.AbsoluteAngle || 0}
                onChange={event =>
                  SelectedItem.setValue(
                    'Angle',
                    event.target.value,
                    ClassType.number,
                  )
                }
              />
              <ToggleButton
                background={'#1D91FC'}
                marginLeft={'10'}
                width={'35'}
                isSelected={SelectedItem.FlipX}
                selectedChanged={event => SelectedItem.setValue('FlipX', event)}
                icon={<FlipXIcon />}
                selectedIcon={<FlipXIcon svgColor={['#FFFFFF', '#D5EBFF']} />}
              />
              <ToggleButton
                background={'#1D91FC'}
                marginLeft={'10'}
                width={'35'}
                isSelected={SelectedItem.FlipY}
                selectedChanged={event => SelectedItem.setValue('FlipY', event)}
                icon={<FlipYIcon />}
                selectedIcon={<FlipYIcon svgColor={['#FFFFFF', '#D5EBFF']} />}
              />
            </div>
            <div className={styles.propdiv}>
              <label className={styles.proplbl}>不透明度</label>
              <div style={{ float: 'left', marginLeft: '31px' }}>
                <InputNumber
                  size="small"
                  max={100}
                  min={0}
                  step={5}
                  value={
                    SelectedItem.Transparent
                      ? SelectedItem.Transparent
                      : SelectedItem.Transparent === 0
                      ? 0
                      : 100
                  }
                  onChange={value =>
                    SelectedItem.setValue('Transparent', Number(value))
                  }
                  formatter={value => `${value}%`}
                  parser={value => value.replace('%', '')}
                />
              </div>
            </div>
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
              <label className={styles.proplbl}>出场方式</label>
              <Select
                getPopupContainer={triggerNode => triggerNode.parentElement}
                defaultValue={AppearTypes.Auto}
                style={{ width: 76, float: 'left', marginLeft: 33 }}
                onChange={value => SelectedItem.setValue('AppearType', value)}
                value={SelectedItem.AppearType}
                size={'small'}
              >
                <Option value={AppearTypes.Auto}>默认</Option>
                <Option value={AppearTypes.CEvent}>隐藏</Option>
              </Select>
              <Select
                getPopupContainer={triggerNode => triggerNode.parentElement}
                defaultValue={0}
                onChange={value => SelectedItem.setValue('AppearIndex', value)}
                value={SelectedItem.AppearIndex}
                style={{
                  width: 76,
                  float: 'left',
                  marginLeft: '18px',
                  display:
                    SelectedItem.AppearType == AppearTypes.Auto
                      ? 'block'
                      : 'none',
                }}
                size={'small'}
              >
                {indexList}
              </Select>
            </div>
            <div className={styles.propdiv}>
              <label className={styles.proplbl}>旋转角度</label>
              <Input
                size="small"
                className={styles.proptxt}
                value={SelectedItem.RotateAngle || 0}
                onChange={event =>
                  SelectedItem.setValue(
                    'RotateAngle',
                    event.target.value,
                    ClassType.number,
                  )
                }
                style={{ float: 'right', marginLeft: '13px' }}
              />
              <Checkbox
                checked={SelectedItem.IsRotate}
                onChange={event =>
                  SelectedItem.setValue(
                    'IsRotate',
                    event.target.checked,
                    ClassType.bool,
                  )
                }
                style={{ float: 'right', height: '20px', fontSize: '10px' }}
              >
                是否旋转
              </Checkbox>
            </div>
            <div className={styles.propdiv}>
              <label className={styles.proplbl}>穿透效果</label>
              <Checkbox
                checked={SelectedItem.IsPenetrate}
                onChange={event =>
                  SelectedItem.setValue(
                    'IsPenetrate',
                    event.target.checked,
                    ClassType.bool,
                  )
                }
                style={{
                  marginLeft: '34px',
                  height: '20px',
                  fontSize: '10px',
                }}
              >
                是否穿透
              </Checkbox>
            </div>
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
              <label className={styles.proplbl}>出场动效</label>
              <Select
                getPopupContainer={triggerNode => triggerNode.parentElement}
                defaultValue={AnimationType.Gradual}
                autoFocus={false}
                onChange={value =>
                  SelectedItem.setValue('AntType', value, ClassType.number)
                }
                value={SelectedItem.AntType}
                style={{ width: 76, float: 'left', marginLeft: 33 }}
                size={'small'}
              >
                <Option value={AnimationType.Gradual}>自动</Option>
                <Option value={AnimationType.Zoom}>缩放</Option>
                <Option value={AnimationType.Bounce}>弹跳</Option>
                <Option value={AnimationType.Included}>滑入</Option>
                <Option value={AnimationType.FloatIn}>浮入</Option>
                <Option value={AnimationType.Abrase}>擦除</Option>
              </Select>
              <Select
                getPopupContainer={triggerNode => triggerNode.parentElement}
                defaultValue={ZoomType.Self}
                style={{
                  width: 76,
                  float: 'left',
                  marginLeft: '18px',
                  display:
                    SelectedItem.AntType == AnimationType.Zoom
                      ? 'block'
                      : 'none',
                  fontSize: '10px',
                }}
                onChange={value =>
                  SelectedItem.setValue('ZoomType', value, ClassType.number)
                }
                value={SelectedItem.ZoomType}
                size={'small'}
              >
                <Option value={ZoomType.Self}>从对象中心</Option>
                <Option value={ZoomType.Center}>从课件中心</Option>
              </Select>
              <Select
                getPopupContainer={triggerNode => triggerNode.parentElement}
                defaultValue={IncludedType.Left}
                style={{
                  width: 76,
                  float: 'left',
                  marginLeft: '18px',
                  display:
                    SelectedItem.AntType == AnimationType.Included
                      ? 'block'
                      : SelectedItem.AntType == AnimationType.FloatIn
                      ? 'block'
                      : SelectedItem.AntType == AnimationType.Abrase
                      ? 'block'
                      : 'none',
                  fontSize: '10px',
                }}
                onChange={value =>
                  SelectedItem.setValue('IcdType', value, ClassType.number)
                }
                value={SelectedItem.IcdType}
                size={'small'}
              >
                <Option value={IncludedType.Left}>左</Option>
                <Option value={IncludedType.Right}>右</Option>
                <Option value={IncludedType.Top}>上</Option>
                <Option value={IncludedType.Bottom}>下</Option>
              </Select>
            </div>
            <div className={styles.propdiv}>
              <label className={styles.proplbl}>动效时长</label>
              <Select
                getPopupContainer={triggerNode => triggerNode.parentElement}
                defaultValue={0.25}
                style={{ width: 76, float: 'left', marginLeft: 33 }}
                onChange={value =>
                  SelectedItem.setValue('Timer', value, ClassType.number)
                }
                value={SelectedItem.Timer}
                size={'small'}
              >
                {timerList}
              </Select>
            </div>

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

            {SelectedItem.PropPanelTemplate
              ? SelectedItem.PropPanelTemplate(SelectedItem)
              : null}
          </div>
        </div>
      );
    }
  }
}

export default BaseProperty;
