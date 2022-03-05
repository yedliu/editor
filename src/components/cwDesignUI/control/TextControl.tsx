import React, { CSSProperties } from 'react';
import ReactDOM from 'react-dom';
import {
  Editor,
  EditorState,
  convertFromRaw,
  RichUtils,
  Modifier,
  convertToRaw,
} from 'draft-js';
import 'draft-js/dist/Draft.css';
import '@/components/cwDesignUI/control/css/Alignment.css';
import styles from '@/components/cwDesignUI/control/css/Alignment.css';
import textEditItem from '@/modelClasses/courseDetail/editItemViewModels/textEditItem';
import { TextControlToolbar } from './TextControlToolbar';
import {
  Alignment,
  VAlignment,
} from '@/modelClasses/courseDetail/courseDetailenum';
import UIHelper from '@/utils/uiHelper';
import {
  draftDataModel,
  draftData,
  block,
  entityMap,
  inlineStyleRangesModel,
} from '@/modelClasses/courseDetail/editItemViewModels/complexControl/richTextControl/draftDataModel';
import { array, string, object, number, bool } from 'prop-types';
import { any, from } from 'linq-to-typescript';
import cWRichTextModel from '@/modelClasses/courseDetail/editItemViewModels/complexControl/richTextControl/cWRichTextModel';
import ItemDragUI from '../itemstree/itemDragUI';
import RenderInBody from './RenderInBody';
import { textDecorationLine } from 'html2canvas/dist/types/css/property-descriptors/text-decoration-line';
import { observer } from 'mobx-react';
import { reaction } from 'mobx';

export class TextControl extends React.Component<any, any> {
  init: boolean = true;
  private rootEl: HTMLElement;

  constructor(props: any) {
    super(props);
    const { data, isMainView } = this.props;

    var editorState = this.parseFromText(data.Text);
    this.state = {
      editorState,
    };

    //extractInlineStyle(editorState);

    this.init = false;
  }

  componentDidMount() {
    this.setState({});
  }

  protected dataTextChanged = reaction(
    () => this.props.data.Text,
    text => {
      if (text != this.getTextFromState())
        this.setState({ editorState: this.parseFromText(text) });
    },
  );

  parseFromText(text) {
    //console.log("-----------"+val.Text.toString());

    var contentState;
    if (text == null || text.length == 0) {
      contentState = JSON.parse(
        '{"blocks":[{"key":"n0","text":"","type":"text-left","depth":0,"entityRanges":[],"data":{}}],"entityMap":{}}',
      );
    } else {
      var Text = '';
      text = text.replaceAll('\r\n', '\n');
      if (text.indexOf('\n') >= 0) {
        var texts = text.split('\n');
        Text = '{"blocks":[';
        texts.map((val, i) => {
          Text +=
            '{"key":"n' +
            i +
            '","text":"' +
            val +
            '","type":"text-left","depth":0,"entityRanges":[],"data":{}}';
          if (i + 2 <= texts.length) {
            Text += ',';
          }
        });
        Text += '],"entityMap":{}}';
      } else {
        Text =
          '{"blocks":[{"key":"24rnc32","text":"' +
          text.trim() +
          '","type":"unstyled","depth":0,"entityRanges":[],"data":{}}],"entityMap":{}}';
      }
      // console.log('Text-----------------');
      // console.log(Text);

      try {
        contentState = JSON.parse(Text);
      } catch (error) {
        contentState = JSON.parse(
          '{"blocks":[{"key":"n0","text":"","type":"text-left","depth":0,"entityRanges":[],"data":{}}],"entityMap":{}}',
        );
        console.log('这个JSON转换失败-----------------');
        console.log(Text);
      }
    }

    var editorState = EditorState.createWithContent(
      convertFromRaw(contentState),
    );

    return editorState;
  }

  getTextFromState() {
    var editorState = this.state.editorState;
    var _draftDataModel = convertToRaw(
      editorState.getCurrentContent(),
    ) as draftDataModel;

    var valstr = '';
    for (let index = 0; index < _draftDataModel.blocks.length; index++) {
      const row = _draftDataModel.blocks[index];
      valstr += row.text;

      // if (row.type == 'text-left') {
      //   val.Alignment = Alignment.Left;
      // } else if (row.type == 'text-center') {
      //   val.Alignment = Alignment.Center;
      // }
      // if (row.type == 'text-right') {
      //   val.Alignment = Alignment.Right;
      // }

      if (index + 1 < _draftDataModel.blocks.length) {
        valstr += '\r\n';
      }
    }
    return valstr;
  }

  componentDidUpdate(prevProps) {
    const { data } = this.props;
    if (prevProps.data != this.props.data) {
      let editorState = this.parseFromText(data.Text);
      this.setState({ editorState });
    }
  }

  handleChange(e: EditorState) {
    this.setState({ editorState: e });

    if (!this.init) {
      //const { editorState } = this.state;
      var editorState = e;
      const { data } = this.props;
      var val = data as textEditItem;

      val.Text = this.getTextFromState();
    }
  }

  // editor: Editor;
  // setEditorReference = ref => {
  //   this.editor = ref;
  // };

  // focusEditor = () => {
  //   setTimeout(() => {
  //     this.editor.focus();
  //   });

  // };

  myBlockStyleFn(val) {
    if (val.Alignment == 0) {
      return styles['public-DraftStyleDefault-block-left'];
    } else if (val.Alignment == 1) {
      return styles['public-DraftStyleDefault-block-center'];
    } else if (val.Alignment == 2) {
      return styles['public-DraftStyleDefault-block-right'];
    }
    //return styles['public-DraftStyleDefault-block-right'];
  }

  render() {
    const { editorState } = this.state;
    const { data, isMainView, Alignment } = this.props;
    var val = data as textEditItem;
    let alpha = val.Color
      ? (1 / 255) * parseInt(val.Color.substr(1, 2), 16)
      : 1;
    let textcolor;
    if (val.Color == '#000000') {
      textcolor = {
        color: '#000000',
      };
    } else {
      textcolor = {
        color: val.Color
          ? `rgba(
                        ${parseInt(val.Color.substr(3, 2), 16)},
                        ${parseInt(val.Color.substr(5, 2), 16)},
                        ${parseInt(val.Color.substr(7, 2), 16)}, ${alpha})`
          : '',
      };
    }

    return (
      <div ref={container => (this.rootEl = container)}>
        {/* <h1>{val.EditDiv?.offsetHeight}</h1> */}
        <div
          ref={divthis => {
            val.EditDiv = divthis;
          }}
          style={{
            fontSize: val.FtSize,
            fontFamily: val.Fonts,
            ...textcolor,
            fontWeight: val.IsBold ? 'bold' : 'initial',
            fontStyle: val.Italic ? 'italic' : '',
            textDecoration: val.UnderLine ? 'underline' : 'none',
            //textDecorationColor: '#000000',
            marginTop: val.Vtop + 'px',
            cursor: 'text',
            lineHeight: val.FtSize + 10 + 'px',
          }}
        >
          <Editor
            placeholder={val.placeholder}
            ref={xref => {
              val.editor = xref;
            }}
            editorState={editorState}
            //customStyleMap={getCustomStyleMap()}
            onChange={e => this.handleChange(e)}
            blockStyleFn={e => this.myBlockStyleFn(val)}
          />

          {/* {Alignment>=0?this.focusEditor():null} */}
        </div>
        {val.DisplayMode ? null : isMainView ? (
          val.IsShowToolbar ? (
            <RenderInBody container={this.rootEl} richTextComplex={val}>
              <div
                style={{
                  border: '1px solid #CCCCCC',
                  borderRadius: '5px',
                  background: '#F0F0F0',
                  height: '130px',
                  width: '195px',
                  paddingTop: '7px',
                }}
              >
                <TextControlToolbar textEditItem={val} />
              </div>
            </RenderInBody>
          ) : null
        ) : null}
      </div>
    );
  }
}

// handleChange(e: EditorState) {
//   this.setState({ editorState: e });
// }

// function myBlockStyleFn() {
//   this.pro
//   var _val = val as textEditItem;

//   if(_val.Alignment == Alignment.Left){
//       return styles['public-DraftStyleDefault-block-left'];
//   }else if(_val.Alignment == Alignment.Center){
//     return styles['public-DraftStyleDefault-block-Center'];
//   }else if(_val.Alignment == Alignment.Right){
//     return styles['public-DraftStyleDefault-block-Right'];
//   }

// }
