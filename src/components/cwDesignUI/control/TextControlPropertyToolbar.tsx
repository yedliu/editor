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
import CacheHelper from '@/utils/cacheHelper';
import PickerColor from '@/components/cwDesignUI/colorComponent';
export class TextControlPropertyToolbar extends React.Component<any, any> {
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
    const { dataContext } = this.props;
    let textprop: TextEditItem = dataContext as TextEditItem;
    const { Option } = Select;
    let ftsizeoptions = [];
    for (let i = 0; i < 12; i++) {
      ftsizeoptions.push({ value: (8 + i * 2).toString() });
    }
    for (let i = 0; i < 4; i++) {
      ftsizeoptions.push({ value: (36 + i * 12).toString() });
    }

    return (
      <div style={{ marginLeft: 33, float: 'left' }}>
        <div>
          <Select
            getPopupContainer={triggerNode => triggerNode.parentElement}
            style={{ width: 100, float: 'left' }}
            size={'small'}
            value={textprop.Fonts || ''}
            onChange={value => this.setValue('Fonts', value, ClassType.string)}
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
            getPopupContainer={triggerNode => triggerNode.parentElement}
            style={{ width: 62, marginLeft: 8 }}
            size={'small'}
            options={ftsizeoptions}
            placeholder="字号"
            value={textprop.FtSize.toString() || ''}
            onChange={value => this.setValue('FtSize', value)}
          />
        </div>
        <div style={{ marginTop: 5, display: 'flex' }}>
          <ToggleButton
            background={'#1D91FC'}
            width={31}
            height={20}
            icon={<BoldIcon />}
            selectedIcon={<BoldIcon svgColor={['#FFFFFF']} />}
            isSelected={textprop.IsBold}
            selectedChanged={value =>
              this.setValue('IsBold', value, ClassType.bool)
            }
          />
          <ToggleButton
            background={'#1D91FC'}
            marginLeft={'3'}
            width={31}
            height={20}
            icon={<ItalicIcon />}
            selectedIcon={<ItalicIcon svgColor={['#FFFFFF']} />}
            isSelected={textprop.Italic}
            selectedChanged={value =>
              this.setValue('Italic', value, ClassType.bool)
            }
          />
          <ToggleButton
            background={'#1D91FC'}
            marginLeft={'3'}
            width={31}
            height={20}
            icon={<UnderLineIcon />}
            selectedIcon={<UnderLineIcon svgColor={['#FFFFFF']} />}
            isSelected={textprop.UnderLine}
            selectedChanged={value =>
              this.setValue('UnderLine', value, ClassType.bool)
            }
          />
          <div style={{ float: 'left', marginLeft: 10 }}>
            <ColorPicker
              selectedcolor={textprop.Color}
              // selectedcolorchanged={value =>
              //   this.setValue('Color', value, ClassType.string)
              // }
              selectedcolorchanged={value => {
                var val = value;
                if (val.length == 8) {
                  val = '#f' + val.substr(1);
                } else if (val.length == 6) {
                  val = val + '000';
                }
                this.setValue('Color', val, ClassType.string);
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
              this.setValue('Color', value, ClassType.string);
            }}
          />
        </div>
        <div>
          <Radio.Group
            style={{ marginTop: 5 }}
            buttonStyle="solid"
            size={'small'}
            value={textprop.Alignment}
            onChange={event => this.setValue('Alignment', event.target.value)}
          >
            <Radio.Button
              style={{
                width: 50,
                background:
                  textprop.Alignment == Alignment.Left
                    ? '#1D91FC'
                    : 'transparent',
                textAlign: 'center',
              }}
              value={Alignment.Left}
            >
              {textprop.Alignment == Alignment.Left ? (
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
                  textprop.Alignment == Alignment.Center
                    ? '#1D91FC'
                    : 'transparent',
                textAlign: 'center',
              }}
              value={Alignment.Center}
            >
              {textprop.Alignment == Alignment.Center ? (
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
                  textprop.Alignment == Alignment.Right
                    ? '#1D91FC'
                    : 'transparent',
                textAlign: 'center',
              }}
              value={Alignment.Right}
            >
              {textprop.Alignment == Alignment.Right ? (
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
            value={textprop.VAlignment}
            onChange={event => this.setValue('VAlignment', event.target.value)}
          >
            <Radio.Button
              style={{
                width: 50,
                background:
                  textprop.VAlignment == VAlignment.Top
                    ? '#1D91FC'
                    : 'transparent',
                textAlign: 'center',
              }}
              value={VAlignment.Top}
            >
              {textprop.VAlignment == VAlignment.Top ? (
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
                  textprop.VAlignment == VAlignment.Center
                    ? '#1D91FC'
                    : 'transparent',
                textAlign: 'center',
              }}
              value={VAlignment.Center}
            >
              {textprop.VAlignment == VAlignment.Center ? (
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
                  textprop.VAlignment == VAlignment.Bottom
                    ? '#1D91FC'
                    : 'transparent',
                textAlign: 'center',
              }}
              value={VAlignment.Bottom}
            >
              {textprop.VAlignment == VAlignment.Bottom ? (
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
