import React, { HtmlHTMLAttributes } from 'react';
import { observer, inject } from 'mobx-react';
import { Radio, Select, AutoComplete } from 'antd';
import TextBoxInfo from '@/components/cwDesignUI/control/textBoxInfo';
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
import {
  Editor,
  EditorState,
  RichUtils,
  Modifier,
  convertToRaw,
} from 'draft-js';
import { RichTextControl } from './richTextControl';
import { string } from 'prop-types';
import CacheHelper from '@/utils/cacheHelper';
import PickerColor from '@/components/cwDesignUI/colorComponent';

export class RichTextToolbar extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    //this.setValue = this.setValue.bind(this);
  }
  //   public setValue(
  //     name: any,
  //     value: any,
  //     propertyType: ClassType = ClassType.number,
  //   ) {
  //     const { onChange } = this.props;
  //     onChange?.(name, value, propertyType);
  //   }
  onWheel = e => {
    e.preventDefault();
    e.stopPropagation();
  };

  render() {
    const { editorState, richTextControl } = this.props;
    var val = richTextControl as RichTextControl;
    const { Option } = Select;

    const currentStyle = editorState.getCurrentInlineStyle().toString();
    //console.log('看看值' + currentStyle);

    // const getBlockType = editorState.getCurrentBlockType();
    // if(getBlockType !=null)
    //     console.log('看看值Block' + getBlockType);

    var family = 'Arial';
    if (currentStyle.lastIndexOf('fontfamily-') > 0) {
      family = currentStyle.substr(
        currentStyle.lastIndexOf('fontfamily-') + 11,
      );
      family = family.substring(0, family.indexOf('"'));
    }

    var FtSize = '45';
    if (currentStyle.lastIndexOf('fontsize-') > 0) {
      FtSize = currentStyle.substr(currentStyle.lastIndexOf('fontsize-') + 9);
      FtSize = FtSize.substring(0, FtSize.indexOf('"'));
      //console.log('值FtSize：' + FtSize);
    }

    var color = '000000';
    if (currentStyle.lastIndexOf('color-') > 0) {
      color = currentStyle.substr(currentStyle.lastIndexOf('color-') + 6);
      color = color.substring(0, color.indexOf('"'));
    }

    var blockType = RichUtils.getCurrentBlockType(editorState);
    var textalign = 0;
    if (blockType == 'text-left') textalign = 0;
    else if (blockType == 'text-center') textalign = 1;
    else if (blockType == 'text-right') textalign = 2;

    // var josn =JSON.stringify(convertToRaw(editorState.getCurrentContent()));
    // console.log("输出"+josn);
    let ftsizeoptions = [];
    for (let i = 0; i < 12; i++) {
      ftsizeoptions.push({ value: (8 + i * 2).toString() });
    }
    for (let i = 0; i < 4; i++) {
      ftsizeoptions.push({ value: (36 + i * 12).toString() });
    }

    return (
      //onMouseDown={e => { e.preventDefault();e.stopPropagation();}}
      <div
        //onWheel={e=>{this.onWheel(e)}}
        onWheel={e => {
          e.preventDefault();
          e.stopPropagation();
        }}
        style={{ margin: 10, float: 'left' }}
      >
        <div>
          <Select
            getPopupContainer={triggerNode => triggerNode.parentElement}
            style={{ width: 100, float: 'left' }}
            size={'small'}
            value={family}
            // onChange={value => this.setValue('Fonts', value, ClassType.string)}
            onChange={value => {
              const newStateRichUtils = RichUtils.toggleInlineStyle(
                editorState,
                'fontfamily-' + value,
              );
              val.addExtractInlineStyle(newStateRichUtils);
              val.ValueChange('fontfamily-' + value, 'fontfamily');
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
            //value={FtSize}
            value={FtSize == '-1' ? '' : Number(FtSize).toString()}
            onChange={value => {
              if (value != '') {
                if (Number(value) != Number(FtSize) && Number(value) < 900) {
                  const newStateRichUtils = RichUtils.toggleInlineStyle(
                    editorState,
                    'fontsize-' + Number(value),
                  );
                  val.addExtractInlineStyle(newStateRichUtils);
                  val.ValueChange('fontsize-' + Number(value), 'fontsize');
                }
              } else {
                const newStateRichUtils = RichUtils.toggleInlineStyle(
                  editorState,
                  'fontsize-' + -1,
                );
                val.addExtractInlineStyle(newStateRichUtils);
                val.ValueChange('fontsize-' + -1, 'fontsize');
              }
            }}
          />
        </div>
        <div style={{ marginTop: 5, display: 'flex' }}>
          <ToggleButton
            onMouseDown={e => {
              e.preventDefault();
              e.stopPropagation();
            }}
            isSelected={currentStyle.indexOf('BOLD') > 0}
            background={'#1D91FC'}
            width={31}
            height={20}
            icon={<BoldIcon />}
            selectedIcon={<BoldIcon svgColor={['#FFFFFF']} />}
            // isSelected={textprop.IsBold}
            selectedChanged={value =>
              //this.setValue('IsBold', value, ClassType.bool)
              {
                const newStateRichUtils = RichUtils.toggleInlineStyle(
                  editorState,
                  'BOLD',
                );
                val.handleChange(newStateRichUtils);
              }
            }
          />
          <ToggleButton
            onMouseDown={e => {
              e.preventDefault();
              e.stopPropagation();
            }}
            background={'#1D91FC'}
            marginLeft={'3'}
            width={31}
            height={20}
            icon={<ItalicIcon />}
            selectedIcon={<ItalicIcon svgColor={['#FFFFFF']} />}
            isSelected={currentStyle.indexOf('ITALIC') > 0}
            // isSelected={textprop.Italic}
            selectedChanged={value =>
              //this.setValue('Italic', value, ClassType.bool)
              {
                const newStateRichUtils = RichUtils.toggleInlineStyle(
                  editorState,
                  'ITALIC',
                );
                val.handleChange(newStateRichUtils);
              }
            }
          />
          <ToggleButton
            onMouseDown={e => {
              e.preventDefault();
              e.stopPropagation();
            }}
            background={'#1D91FC'}
            marginLeft={'3'}
            width={31}
            height={20}
            icon={<UnderLineIcon />}
            selectedIcon={<UnderLineIcon svgColor={['#FFFFFF']} />}
            isSelected={currentStyle.indexOf('UNDERLINE') > 0}
            // isSelected={textprop.UnderLine}
            selectedChanged={value =>
              //this.setValue('UnderLine', value, ClassType.bool)
              {
                const newStateRichUtils = RichUtils.toggleInlineStyle(
                  editorState,
                  'UNDERLINE',
                );
                val.handleChange(newStateRichUtils);
              }
            }
          />
          <div style={{ float: 'left', marginLeft: 10 }}>
            <ColorPicker
              selectedcolor={color}
              selectedcolorchanged={value => {
                var _val = value;
                if (_val.length == 8) {
                  _val = '#f' + _val.substr(1);
                } else if (_val.length == 6) {
                  _val = _val + '000';
                }
                if (color != _val) {
                  const newStateRichUtils = RichUtils.toggleInlineStyle(
                    editorState,
                    'color-' + _val,
                  );
                  val.addExtractInlineStyle(newStateRichUtils);
                  val.ValueChange('color-' + _val, 'color');
                }
              }}
              // selectedcolor={'#ff' + color}
              // selectedcolorchanged={value => {
              //   var _val = value.substr(3);
              //   if (_val.length < 6) {
              //     while (true) {
              //       _val = 'F' + _val;
              //       if (_val.length >= 6) break;
              //     }
              //   }

              //   if (color != _val) {
              //     const newStateRichUtils = RichUtils.toggleInlineStyle(
              //       editorState,
              //       'color-' + _val,
              //     );
              //     //console.log('选择：' + _val);
              //     val.addExtractInlineStyle(newStateRichUtils);
              //     val.ValueChange('color-' + _val, 'color');
              //   }
              // }}
            />
          </div>
          <PickerColor
            option={{ width: 20, height: 20 }}
            pickColor={color => {
              let value = color;
              if (color.length === 7) {
                value = '#ff' + value.substr(1);
              }
              if (color != value) {
                const newStateRichUtils = RichUtils.toggleInlineStyle(
                  editorState,
                  'color-' + value,
                );
                val.addExtractInlineStyle(newStateRichUtils);
                val.ValueChange('color-' + value, 'color');
              }
            }}
          />
        </div>
        <div>
          <Radio.Group
            style={{ marginTop: 5 }}
            buttonStyle="solid"
            size={'small'}
            value={textalign}
            onChange={
              //this.setValue('Alignment', event.target.value)
              event => {
                //console.log(event.target.value);
                if (event.target.value == 0) {
                  const newStateRichUtils = RichUtils.toggleBlockType(
                    editorState,
                    'text-left',
                  );
                  val.handleChange(newStateRichUtils);
                } else if (event.target.value == 1) {
                  const newStateRichUtils = RichUtils.toggleBlockType(
                    editorState,
                    'text-center',
                  );
                  val.handleChange(newStateRichUtils);
                } else if (event.target.value == 2) {
                  const newStateRichUtils = RichUtils.toggleBlockType(
                    editorState,
                    'text-right',
                  );
                  val.handleChange(newStateRichUtils);
                }
              }
            }
          >
            <Radio.Button
              style={{
                width: 50,
                background:
                  blockType == 'text-left' || blockType == 'unstyled'
                    ? '#1D91FC'
                    : 'transparent',
                textAlign: 'center',
              }}
              value={Alignment.Left}
            >
              {blockType == 'text-left' ? (
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
                  blockType == 'text-center' ? '#1D91FC' : 'transparent',
                textAlign: 'center',
              }}
              value={Alignment.Center}
            >
              {blockType == 'text-center' ? (
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
                  blockType == 'text-right' ? '#1D91FC' : 'transparent',
                textAlign: 'center',
              }}
              value={Alignment.Right}
            >
              {blockType == 'text-right' ? (
                <RightIcon svgColor={['#FFFFFF']} />
              ) : (
                <RightIcon />
              )}
            </Radio.Button>
          </Radio.Group>
        </div>
      </div>
    );
  }
}
