import React, { HtmlHTMLAttributes } from 'react';
import { observer, inject } from 'mobx-react';
import { Radio, Select, AutoComplete } from 'antd';
import ToggleButton from '@/components/cwDesignUI/control/toggleButton';
import ColorPicker from '@/components/cwDesignUI/control/sketchColor';
import {
  LeftIcon,
  CenterIcon,
  RightIcon,
  UnderLineIcon,
  BoldIcon,
  ItalicIcon,
  TopIcon,
  MiddleIcon,
  BottomIcon,
} from '@/utils/customIcon';
import TextEditItem, {
  Alignment,
  VAlignment,
} from '@/modelClasses/courseDetail/editItemViewModels/textEditItem';
import { ClassType } from '@/modelClasses/courseDetail/courseDetailenum';
import textEditItem from '@/modelClasses/courseDetail/editItemViewModels/textEditItem';
import CacheEntityServer from '@/server/CacheEntityServer';
import { TextControl } from './TextControl';
import CacheHelper from '@/utils/cacheHelper';
import PickerColor from '@/components/cwDesignUI/colorComponent';

export class TextControlToolbar extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.setValue = this.setValue.bind(this);
  }

  public setValue(
    name: any,
    value: any,
    propertyType: ClassType = ClassType.number,
  ) {
    const { onChange } = this.props;
    onChange?.(name, value, propertyType);
  }

  render() {
    const { textEditItem } = this.props;
    //var _textControl = TextControl as TextControl;

    var list = new Array<textEditItem>();
    list.push(textEditItem);
    let SelectedItem;
    SelectedItem = CacheEntityServer.getPropPanel(list);

    //console.log(SelectedItem);
    const { Option } = Select;

    let ftsizeoptions = [];
    for (let i = 0; i < 12; i++) {
      ftsizeoptions.push({ value: (8 + i * 2).toString() });
    }
    for (let i = 0; i < 4; i++) {
      ftsizeoptions.push({ value: (36 + i * 12).toString() });
    }

    return (
      <div
        style={{ marginLeft: 10, float: 'left' }}
        onWheel={e => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <div>
          <Select
            style={{ width: 100, float: 'left' }}
            size={'small'}
            value={SelectedItem.Fonts || ''}
            onChange={value => {
              SelectedItem.setValue('Fonts', value, ClassType.string);
            }}
          >
            {CacheHelper.FontList?.map(item => {
              return (
                <Option value={item.resourceName} key={item.resourceId}>
                  {item.resourceName}
                </Option>
              );
            })}
          </Select>
          <AutoComplete
            options={ftsizeoptions}
            style={{ width: 62, marginLeft: 8 }}
            size={'small'}
            placeholder="字号"
            value={
              SelectedItem.FtSize.toString() == '-1'
                ? ''
                : SelectedItem.FtSize.toString()
            }
            onChange={value => {
              if (value != '') {
                if (Number(value) < 900) {
                  SelectedItem.setValue('FtSize', value, ClassType.number);
                }
              } else {
                SelectedItem.setValue('FtSize', -1, ClassType.number);
              }
            }}
          />
        </div>
        <div style={{ marginTop: 5, display: 'flex' }}>
          <ToggleButton
            background={'#1D91FC'}
            width={31}
            height={20}
            icon={<BoldIcon />}
            selectedIcon={<BoldIcon svgColor={['#FFFFFF']} />}
            isSelected={SelectedItem.IsBold}
            selectedChanged={value =>
              SelectedItem.setValue('IsBold', value, ClassType.bool)
            }
          />
          <ToggleButton
            background={'#1D91FC'}
            marginLeft={'3'}
            width={31}
            height={20}
            icon={<ItalicIcon />}
            selectedIcon={<ItalicIcon svgColor={['#FFFFFF']} />}
            isSelected={SelectedItem.Italic}
            selectedChanged={value =>
              SelectedItem.setValue('Italic', value, ClassType.bool)
            }
          />
          <ToggleButton
            background={'#1D91FC'}
            marginLeft={'3'}
            width={31}
            height={20}
            icon={<UnderLineIcon />}
            selectedIcon={<UnderLineIcon svgColor={['#FFFFFF']} />}
            isSelected={SelectedItem.UnderLine}
            selectedChanged={value =>
              SelectedItem.setValue('UnderLine', value, ClassType.bool)
            }
          />
          <div style={{ float: 'left', marginLeft: 10 }}>
            <ColorPicker
              selectedcolor={SelectedItem.Color}
              selectedcolorchanged={value => {
                var val = value;
                if (val.length == 8) {
                  val = '#f' + val.substr(1);
                } else if (val.length == 6) {
                  val = val + '000';
                }
                SelectedItem.setValue('Color', val, ClassType.string);
              }}
            />
          </div>
          <PickerColor
            option={{ width: 20, height: 20 }}
            pickColor={color => {
              let value = color;
              if (color.length === 7) {
                value = '#ff' + value.substr(1);
              }
              SelectedItem.setValue('Color', value, ClassType.string);
            }}
          />
        </div>
        <div>
          <Radio.Group
            style={{ marginTop: 5 }}
            buttonStyle="solid"
            size={'small'}
            value={SelectedItem.Alignment}
            onChange={event => {
              //this.setValue('Alignment', event.target.value)
              SelectedItem.setValue(
                'Alignment',
                event.target.value,
                ClassType.string,
              );
              SelectedItem.focusEditor();
              //_textControl.focusEditor();
            }}
          >
            <Radio.Button
              style={{
                width: 50,
                background:
                  SelectedItem.Alignment == Alignment.Left
                    ? '#1D91FC'
                    : 'transparent',
                textAlign: 'center',
              }}
              value={Alignment.Left}
            >
              {SelectedItem.Alignment == Alignment.Left ? (
                <LeftIcon svgColor={['#FFFFFF']} />
              ) : (
                <LeftIcon />
              )}
            </Radio.Button>
            <Radio.Button
              style={{
                width: 50,
                marginLeft: 10,
                background:
                  SelectedItem.Alignment == Alignment.Center
                    ? '#1D91FC'
                    : 'transparent',
                textAlign: 'center',
              }}
              value={Alignment.Center}
            >
              {SelectedItem.Alignment == Alignment.Center ? (
                <CenterIcon svgColor={['#FFFFFF']} />
              ) : (
                <CenterIcon />
              )}
            </Radio.Button>
            <Radio.Button
              style={{
                width: 50,
                marginLeft: 10,
                background:
                  SelectedItem.Alignment == Alignment.Right
                    ? '#1D91FC'
                    : 'transparent',
                textAlign: 'center',
              }}
              value={Alignment.Right}
            >
              {SelectedItem.Alignment == Alignment.Right ? (
                <RightIcon svgColor={['#FFFFFF']} />
              ) : (
                <RightIcon />
              )}
            </Radio.Button>
          </Radio.Group>
        </div>
        <div>
          <Radio.Group
            style={{ marginTop: 5 }}
            buttonStyle="solid"
            size={'small'}
            value={SelectedItem.VAlignment}
            onChange={
              event =>
                SelectedItem.setValue(
                  'VAlignment',
                  event.target.value,
                  ClassType.enum,
                )
              //this.setValue('VAlignment', event.target.value)
            }
          >
            <Radio.Button
              style={{
                width: 50,
                background:
                  SelectedItem.VAlignment == VAlignment.Top
                    ? '#1D91FC'
                    : 'transparent',
                textAlign: 'center',
              }}
              value={VAlignment.Top}
            >
              {SelectedItem.VAlignment == VAlignment.Top ? (
                <TopIcon svgColor={['#FFFFFF']} />
              ) : (
                <TopIcon />
              )}
            </Radio.Button>
            <Radio.Button
              style={{
                width: 50,
                marginLeft: 10,
                background:
                  SelectedItem.VAlignment == VAlignment.Center
                    ? '#1D91FC'
                    : 'transparent',
                textAlign: 'center',
              }}
              value={VAlignment.Center}
            >
              {SelectedItem.VAlignment == VAlignment.Center ? (
                <MiddleIcon svgColor={['#FFFFFF']} />
              ) : (
                <MiddleIcon />
              )}
            </Radio.Button>
            <Radio.Button
              style={{
                width: 50,
                marginLeft: 10,
                background:
                  SelectedItem.VAlignment == VAlignment.Bottom
                    ? '#1D91FC'
                    : 'transparent',
                textAlign: 'center',
              }}
              value={VAlignment.Bottom}
            >
              {SelectedItem.VAlignment == VAlignment.Bottom ? (
                <BottomIcon svgColor={['#FFFFFF']} />
              ) : (
                <BottomIcon />
              )}
            </Radio.Button>
          </Radio.Group>
        </div>
      </div>
    );
  }
}
