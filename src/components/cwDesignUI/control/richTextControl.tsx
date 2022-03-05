import React from 'react';
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
import { RichTextToolbar } from './RichTextToolbar';
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
import RichTextEditItemViewModel from '@/modelClasses/courseDetail/editItemViewModels/complexControl/richTextControl/richTextEditItemViewModel';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
@observer
export class RichTextControl extends React.Component<any, any> {
  init: boolean = true;
  private rootEl: HTMLElement;
  //_richTextComplex:richTextComplex;

  constructor(props: any) {
    super(props);

    const { data, isMainView } = this.props;
    var val = data as RichTextEditItemViewModel;

    let _draftDataModel = this.getDrafDataModel();
    _draftDataModel.entityMap = new entityMap();

    // var dddd = JSON.stringify(_draftDataModel);
    // console.log("-----------"+dddd);

    var contentState;
    if (val.RichTextInfo.length == 0) {
      contentState = JSON.parse(
        '{"blocks":[{"key":"n0","text":"","type":"text-left","depth":0,"inlineStyleRanges":[{"offset":0,"length":1,"style":"fontsize-48"},{"offset":0,"length":1,"style":"color-#FF00BFFF"},{"offset":0,"length":1,"style":"fontfamily-Arial"},{"offset":0,"length":1,"style":"lineHeight"},{"offset":1,"length":1,"style":"fontsize-33"},{"offset":1,"length":1,"style":"color-#FFFF1493"},{"offset":1,"length":1,"style":"fontfamily-Arial"},{"offset":1,"length":1,"style":"lineHeight"},{"offset":2,"length":1,"style":"fontsize-33"},{"offset":2,"length":1,"style":"color-#FFFFA500"},{"offset":2,"length":1,"style":"fontfamily-Arial"},{"offset":2,"length":1,"style":"lineHeight"},{"offset":2,"length":1,"style":"BOLD"},{"offset":2,"length":1,"style":"ITALIC"},{"offset":3,"length":1,"style":"fontsize-22"},{"offset":3,"length":1,"style":"color-#FFFFA500"},{"offset":3,"length":1,"style":"fontfamily-Arial"},{"offset":3,"length":1,"style":"lineHeight"},{"offset":3,"length":1,"style":"BOLD"},{"offset":3,"length":1,"style":"ITALIC"},{"offset":3,"length":1,"style":"UNDERLINE"},{"offset":4,"length":1,"style":"fontsize-22"},{"offset":4,"length":1,"style":"color-#FF000000"},{"offset":4,"length":1,"style":"fontfamily-Arial"},{"offset":4,"length":1,"style":"lineHeight"},{"offset":4,"length":1,"style":"UNDERLINE"}],"entityRanges":[],"data":{}}],"entityMap":{}}',
      );
    } else {
      contentState = _draftDataModel;
    }
    //const contentState = convertFromRaw(_draftDataModel);

    const editorState = EditorState.createWithContent(
      convertFromRaw(contentState),
    );
    this.editorState = editorState;
    // this.state = {
    //   editorState,
    // };

    extractInlineStyle(editorState);

    this.init = false;
  }

  @observable
  private _editorState: EditorState;

  public get editorState(): EditorState {
    return this._editorState;
  }

  public set editorState(v: EditorState) {
    this._editorState = v;
  }

  getDrafDataModel = () => {
    const { data, isMainView } = this.props;

    //this._richTextComplex = data as richTextComplex;
    var val = data as RichTextEditItemViewModel;

    // var ceshisss = JSON.parse("{\"blocks\":[{\"key\":\"24rnc\",\"text\":\"我是测试文字\",\"type\":\"unstyled\",\"depth\":0,\"entityRanges\":[],\"data\":{}}],\"entityMap\":{}}");
    var _draftDataModel = new draftDataModel();
    _draftDataModel.blocks = new Array<block>();
    var serial = 0;
    var _block = new block();
    _block.key = 'n' + serial;
    _draftDataModel.blocks.push(_block);
    var FontSizeAccumulation = 0;
    for (var i = 0; i < val.RichTextInfo.length; i++) {
      if (val.RichTextInfo[i].Text == '\r\n') {
        serial++;
        var _block = new block();
        _block.key = 'n' + serial;
        _draftDataModel.blocks.push(_block);
      } else {
        var x = val.RichTextInfo[i];

        var index = _draftDataModel.blocks.length - 1;
        _draftDataModel.blocks[index].type = 'unstyled';
        _draftDataModel.blocks[index].depth = 0;
        _draftDataModel.blocks[index].entityRanges = new Array<any>();
        _draftDataModel.blocks[index].data = new draftData();

        if (val.Alignment == Alignment.Left) {
          _draftDataModel.blocks[index].type = 'text-left';
        } else if (val.Alignment == Alignment.Center) {
          _draftDataModel.blocks[index].type = 'text-center';
        } else if (val.Alignment == Alignment.Right) {
          _draftDataModel.blocks[index].type = 'text-right';
        }

        var _inlineStyleFontSize = new inlineStyleRangesModel();
        _inlineStyleFontSize.offset = _draftDataModel.blocks[index].text.length;
        _inlineStyleFontSize.length = x.Text.length;
        _inlineStyleFontSize.style = 'fontsize-' + x.FtSize;

        var _inlineStyleFontsColor = new inlineStyleRangesModel();
        _inlineStyleFontsColor.offset =
          _draftDataModel.blocks[index].text.length;
        _inlineStyleFontsColor.length = x.Text.length;
        //_inlineStyleFontsColor.style = 'color-' + x.Color.substr(3);
        _inlineStyleFontsColor.style = 'color-' + x.Color;

        var _inlineStylefontFamily = new inlineStyleRangesModel();
        _inlineStylefontFamily.offset =
          _draftDataModel.blocks[index].text.length;
        _inlineStylefontFamily.length = x.Text.length;
        _inlineStylefontFamily.style = 'fontfamily-' + x.Fonts;

        var _inlineStyleLineHeight = new inlineStyleRangesModel();
        _inlineStyleLineHeight.offset =
          _draftDataModel.blocks[index].text.length;
        _inlineStyleLineHeight.length = x.Text.length;
        _inlineStyleLineHeight.style = 'lineHeight';

        var _inlineStyleBOLD = new inlineStyleRangesModel();
        _inlineStyleBOLD.offset = _draftDataModel.blocks[index].text.length;
        _inlineStyleBOLD.length = x.Text.length;
        _inlineStyleBOLD.style = 'BOLD';

        var _inlineStyleITALIC = new inlineStyleRangesModel();
        _inlineStyleITALIC.offset = _draftDataModel.blocks[index].text.length;
        _inlineStyleITALIC.length = x.Text.length;
        _inlineStyleITALIC.style = 'ITALIC';

        var _inlineStyleUNDERLINE = new inlineStyleRangesModel();
        _inlineStyleUNDERLINE.offset =
          _draftDataModel.blocks[index].text.length;
        _inlineStyleUNDERLINE.length = x.Text.length;
        _inlineStyleUNDERLINE.style = 'UNDERLINE';

        if (_draftDataModel.blocks[index].inlineStyleRanges == null)
          _draftDataModel.blocks[index].inlineStyleRanges = new Array<
            inlineStyleRangesModel
          >();

        _draftDataModel.blocks[index].inlineStyleRanges.push(
          _inlineStyleFontSize,
        );
        _draftDataModel.blocks[index].inlineStyleRanges.push(
          _inlineStyleFontsColor,
        );
        _draftDataModel.blocks[index].inlineStyleRanges.push(
          _inlineStylefontFamily,
        );
        _draftDataModel.blocks[index].inlineStyleRanges.push(
          _inlineStyleLineHeight,
        );
        if (x.IsBold)
          _draftDataModel.blocks[index].inlineStyleRanges.push(
            _inlineStyleBOLD,
          );
        if (x.Italic)
          _draftDataModel.blocks[index].inlineStyleRanges.push(
            _inlineStyleITALIC,
          );
        if (x.UnderLine)
          _draftDataModel.blocks[index].inlineStyleRanges.push(
            _inlineStyleUNDERLINE,
          );

        _draftDataModel.blocks[index].text += x.Text;
      }
    }

    return _draftDataModel;
  };

  componentDidUpdate(prevProps) {
    const { data } = this.props;
    if (prevProps.data != this.props.data) {
      let value = data as RichTextEditItemViewModel;

      let _draftDataModel = this.getDrafDataModel();
      _draftDataModel.entityMap = new entityMap();

      var contentState;
      if (value.RichTextInfo.length == 0) {
        contentState = JSON.parse(
          '{"blocks":[{"key":"n0","text":"","type":"text-left","depth":0,"inlineStyleRanges":[{"offset":0,"length":1,"style":"fontsize-48"},{"offset":0,"length":1,"style":"color-#FF00BFFF"},{"offset":0,"length":1,"style":"fontfamily-Arial"},{"offset":0,"length":1,"style":"lineHeight"},{"offset":1,"length":1,"style":"fontsize-33"},{"offset":1,"length":1,"style":"color-#FFFF1493"},{"offset":1,"length":1,"style":"fontfamily-Arial"},{"offset":1,"length":1,"style":"lineHeight"},{"offset":2,"length":1,"style":"fontsize-33"},{"offset":2,"length":1,"style":"color-#FFFFA500"},{"offset":2,"length":1,"style":"fontfamily-Arial"},{"offset":2,"length":1,"style":"lineHeight"},{"offset":2,"length":1,"style":"BOLD"},{"offset":2,"length":1,"style":"ITALIC"},{"offset":3,"length":1,"style":"fontsize-22"},{"offset":3,"length":1,"style":"color-#FFFFA500"},{"offset":3,"length":1,"style":"fontfamily-Arial"},{"offset":3,"length":1,"style":"lineHeight"},{"offset":3,"length":1,"style":"BOLD"},{"offset":3,"length":1,"style":"ITALIC"},{"offset":3,"length":1,"style":"UNDERLINE"},{"offset":4,"length":1,"style":"fontsize-22"},{"offset":4,"length":1,"style":"color-#FF000000"},{"offset":4,"length":1,"style":"fontfamily-Arial"},{"offset":4,"length":1,"style":"lineHeight"},{"offset":4,"length":1,"style":"UNDERLINE"}],"entityRanges":[],"data":{}}],"entityMap":{}}',
        );
      } else {
        contentState = _draftDataModel;
      }

      const editorState = EditorState.createWithContent(
        convertFromRaw(contentState),
      );

      extractInlineStyle(editorState);
      this.init = false;
      this.editorState = editorState;
      this.setState({}, () => {
        if (!this.init) {
          // const { editorState } = this.state;

          var _draftDataModel = convertToRaw(
            this.editorState.getCurrentContent(),
          ) as draftDataModel;

          const { data } = this.props;
          var val = data as RichTextEditItemViewModel;
          var tm = new Array<cWRichTextModel>();

          for (let index = 0; index < _draftDataModel.blocks.length; index++) {
            const row = _draftDataModel.blocks[index];
            var texts = row.text.split('');
            texts.map((text, i) => {
              var rtm = new cWRichTextModel();
              rtm.Text = text;
              rtm.FtSize = this.searchStyle(row.inlineStyleRanges, 'FtSize', i);
              rtm.Color = this.searchStyle(row.inlineStyleRanges, 'Color', i);
              rtm.Fonts = this.searchStyle(
                row.inlineStyleRanges,
                'fontfamily',
                i,
              );
              rtm.IsBold =
                this.searchStyle(row.inlineStyleRanges, 'BOLD', i) == 'True';
              rtm.Italic =
                this.searchStyle(row.inlineStyleRanges, 'ITALIC', i) == 'True';
              rtm.UnderLine =
                this.searchStyle(row.inlineStyleRanges, 'UNDERLINE', i) ==
                'True';
              tm.push(rtm);
            });
            if (row.type == 'text-left') {
              val.Alignment = Alignment.Left;
            } else if (row.type == 'text-center') {
              val.Alignment = Alignment.Center;
            }
            if (row.type == 'text-right') {
              val.Alignment = Alignment.Right;
            }

            if (index + 1 < _draftDataModel.blocks.length) {
              var rtm = new cWRichTextModel();
              rtm.Text = '\r\n';
              rtm.FtSize = '48';
              rtm.Color = '#FF000000';
              rtm.Fonts = 'Arial';
              rtm.IsBold = false;
              rtm.Italic = false;
              rtm.UnderLine = false;
              tm.push(rtm);
            }
          }

          val.RichTextInfo = tm;
        }
      });
    } else {
      if (!this.init) {
        // const { editorState } = this.state;
        var _draftDataModel = convertToRaw(
          this.editorState.getCurrentContent(),
        ) as draftDataModel;
        const { data } = this.props;
        var val = data as RichTextEditItemViewModel;
        var tm = new Array<cWRichTextModel>();

        for (let index = 0; index < _draftDataModel.blocks.length; index++) {
          const row = _draftDataModel.blocks[index];
          var texts = row.text.split('');
          texts.map((text, i) => {
            var rtm = new cWRichTextModel();
            rtm.Text = text;
            rtm.FtSize = this.searchStyle(row.inlineStyleRanges, 'FtSize', i);
            rtm.Color = this.searchStyle(row.inlineStyleRanges, 'Color', i);
            rtm.Fonts = this.searchStyle(
              row.inlineStyleRanges,
              'fontfamily',
              i,
            );
            rtm.IsBold =
              this.searchStyle(row.inlineStyleRanges, 'BOLD', i) == 'True';
            rtm.Italic =
              this.searchStyle(row.inlineStyleRanges, 'ITALIC', i) == 'True';
            rtm.UnderLine =
              this.searchStyle(row.inlineStyleRanges, 'UNDERLINE', i) == 'True';
            tm.push(rtm);
          });
          if (row.type == 'text-left') {
            val.Alignment = Alignment.Left;
          } else if (row.type == 'text-center') {
            val.Alignment = Alignment.Center;
          }
          if (row.type == 'text-right') {
            val.Alignment = Alignment.Right;
          }

          if (index + 1 < _draftDataModel.blocks.length) {
            var rtm = new cWRichTextModel();
            rtm.Text = '\r\n';
            rtm.FtSize = '48';
            rtm.Color = '#FF000000';
            rtm.Fonts = 'Arial';
            rtm.IsBold = false;
            rtm.Italic = false;
            rtm.UnderLine = false;
            tm.push(rtm);
          }
        }

        val.RichTextInfo = tm;
      }
    }
  }

  handleChange(e: EditorState) {
    // this.setState({ editorState: e }, () => {
    //   console.log('editorState666',this.state.editorState.toJS())
    // });
    this.editorState = e;
  }

  searchStyle(source: Array<inlineStyleRangesModel>, type, index) {
    if (type == 'FtSize') {
      var _style = source.filter(
        x =>
          x.style.indexOf('fontsize') >= 0 &&
          index >= x.offset &&
          index < x.offset + x.length,
      );
      if (_style == null || _style.length < 1) return '48';
      var val = _style[_style.length - 1].style.substr(9);
      return val;
    } else if (type == 'Color') {
      var _style = source.filter(
        x =>
          x.style.indexOf('color') >= 0 &&
          index >= x.offset &&
          index < x.offset + x.length,
      );
      if (_style == null || _style.length < 1) return '#FF000000';
      var val = _style[_style.length - 1].style.substr(6);
      return val;
      //return '#FF' + val;
    } else if (type == 'fontfamily') {
      var _style = source.filter(
        x =>
          x.style.indexOf('fontfamily') >= 0 &&
          index >= x.offset &&
          index < x.offset + x.length,
      );
      if (_style == null || _style.length < 1) return 'Arial';
      var val = _style[_style.length - 1].style.substr(11);
      return val;
    } else if (type == 'BOLD') {
      var _style = source.filter(
        x =>
          x.style.indexOf('BOLD') >= 0 &&
          index >= x.offset &&
          index < x.offset + x.length,
      );
      if (_style == null || _style.length < 1) return 'False';
      else return 'True';
    } else if (type == 'ITALIC') {
      var _style = source.filter(
        x =>
          x.style.indexOf('ITALIC') >= 0 &&
          index >= x.offset &&
          index < x.offset + x.length,
      );
      if (_style == null || _style.length < 1) return 'False';
      else return 'True';
    } else if (type == 'UNDERLINE') {
      var _style = source.filter(
        x =>
          x.style.indexOf('UNDERLINE') >= 0 &&
          index >= x.offset &&
          index < x.offset + x.length,
      );
      if (_style == null || _style.length < 1) return 'False';
      else return 'True';
    }

    return '';
  }

  // color  fontfamily lineHeight BOLD ITALIC UNDERLINE

  addExtractInlineStyle(editorState) {
    extractInlineStyle(editorState);
  }

  ValueChange(newVal, ChangeKey) {
    // const { editorState } = this.state;
    const selection = this.editorState.getSelection();

    var _changeKey;
    if (ChangeKey == 'fontsize') {
      _changeKey = customInlineStylesMap.fontSize;
    } else if (ChangeKey == 'fontfamily') {
      _changeKey = customInlineStylesMap.fontFamily;
    } else if (ChangeKey == 'color') {
      _changeKey = customInlineStylesMap.color;
      // console.log("已经有的："+JSON.stringify(_changeKey));
      // console.log("ADD的："+newVal);
    }

    const nextContentState = Object.keys(_changeKey).reduce(
      (contentState, key) => {
        return Modifier.removeInlineStyle(contentState, selection, key);
      },
      this.editorState.getCurrentContent(),
    );

    let nextEditorState = EditorState.push(
      this.editorState,
      nextContentState,
      'change-inline-style',
    );

    const currentStyle = this.editorState.getCurrentInlineStyle();

    if (selection.isCollapsed()) {
      nextEditorState = currentStyle.reduce((state, newVal) => {
        return RichUtils.toggleInlineStyle(state, newVal);
      }, nextEditorState);
    }

    if (!currentStyle.has(newVal)) {
      nextEditorState = RichUtils.toggleInlineStyle(nextEditorState, newVal);
    }

    this.handleChange(nextEditorState);
  }

  editor: Editor;
  setEditorReference = ref => {
    this.editor = ref;
  };

  focusEditor = () => {
    setTimeout(() => {
      this.editor.focus();
    });
  };

  render() {
    // const { editorState } = this.state;
    const {
      data,
      isMainView,
      width,
      height,
      x,
      y,
      HandShowToolbar,
    } = this.props;
    var val = data as RichTextEditItemViewModel;
    var _HandShowToolbar = HandShowToolbar;

    return data.DisplayMode ? (
      <div>
        <img
          src={data.ImageUrl}
          style={{
            position: 'absolute',
            height: '100%',
            width: '100%',
            objectFit: 'fill',
            userSelect: 'none',
            float: 'left',
          }}
          draggable={false}
        ></img>
        <svg
          style={{
            position: 'absolute',
            height: '50px',
            width: '50px',
            userSelect: 'none',
            float: 'left',
            marginLeft: width - 100,
            marginTop: height / 2 - 50,
            opacity: '0.8',
          }}
          viewBox="0 0 1253 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1229.98915 23.199631A74.991993 74.991993 0 0 0 1174.693849 0.009336h-1096.268488a74.991993 74.991993 0 0 0-55.41577 23.190295 75.473869 75.473869 0 0 0-22.889122 55.41577v866.533982a75.835276 75.835276 0 0 0 22.828888 55.716943 76.317152 76.317152 0 0 0 55.476004 23.13006h1096.268488a78.304892 78.304892 0 0 0 78.304892-78.606065V78.615401a75.534104 75.534104 0 0 0-22.889122-55.41577m-55.716942 615.71739V945.691494H78.425361v-98.061819h-0.301173V78.615401h1096.268489z"
            fill="#38513F"
            p-id="7561"
          ></path>
          <path
            d="M526.269109 700.958589h0.301173l-7.83049-6.625799z"
            fill="#5F4E56"
            p-id="7562"
          ></path>
          <path
            d="M77.943485 847.629675h0.481876V945.691494h234.372565l213.471183-244.491967-7.529317-6.625798-154.44134-142.635373-286.354967 217.386427z"
            fill="#1A9172"
            p-id="7563"
          ></path>
          <path
            d="M77.943485 177.3398h19.877396a19.27505 19.27505 0 0 0 13.853942-6.023454 20.058099 20.058099 0 0 0-0.301173-27.105539 19.817161 19.817161 0 0 0-13.552769-6.023453h-19.877396v39.453618m523.317617 230.336852a19.395519 19.395519 0 0 0 5.421108-13.853943 20.961617 20.961617 0 0 0-5.421108-14.456287 19.335285 19.335285 0 0 0-13.853943-5.360874h-19.877395a19.455754 19.455754 0 0 0-13.853943 5.360874 20.961617 20.961617 0 0 0-5.421108 14.456287 19.395519 19.395519 0 0 0 5.421108 13.853943 20.238803 20.238803 0 0 0 13.853943 5.421108h19.877395a19.395519 19.395519 0 0 0 13.853943-5.421108m-385.982883 143.358187a18.973878 18.973878 0 0 0 14.155115-5.421108 20.178568 20.178568 0 0 0 6.023453-13.853943 18.07036 18.07036 0 0 0-5.421108-13.853942 19.395519 19.395519 0 0 0-13.853942-6.023453h-59.451484a18.672705 18.672705 0 0 0-13.853942 6.023453 18.07036 18.07036 0 0 0-5.421108 13.853942 18.552236 18.552236 0 0 0 5.72228 13.55277 18.973878 18.973878 0 0 0 13.55277 6.023453h58.427496m882.797306-319.243021a26.141787 26.141787 0 0 0-8.734007-7.529316 27.466947 27.466947 0 0 0-11.444561-2.409382 25.178035 25.178035 0 0 0-25.599676 25.599676 29.093279 29.093279 0 0 0 0 3.614072 26.021318 26.021318 0 0 0-6.926972-0.903518 36.140719 36.140719 0 0 0-26.503194 11.143389 37.405645 37.405645 0 0 0-10.541043 26.503194 37.044237 37.044237 0 0 0 37.044237 37.34541h128.299554V237.574332a54.211079 54.211079 0 0 0-7.830489-9.938698 39.995729 39.995729 0 0 0-14.155115-9.336352 46.139652 46.139652 0 0 0-17.769187-3.614072 43.549567 43.549567 0 0 0-20.178568 4.818762 42.585814 42.585814 0 0 0-15.962151 12.649252m-319.243022-22.58795a24.093813 24.093813 0 0 0-5.72228-15.962151 23.370999 23.370999 0 0 0-13.853943-8.734007 37.285176 37.285176 0 0 0-3.011726-13.251597 31.984537 31.984537 0 0 0-7.469082-10.842216 33.550635 33.550635 0 0 0-10.842216-7.228144 35.779312 35.779312 0 0 0-13.55277-2.710554 33.912042 33.912042 0 0 0-15.359806 3.614072 34.333683 34.333683 0 0 0-12.046906 9.637525 20.841148 20.841148 0 0 0-6.625799-6.023453 22.045839 22.045839 0 0 0-8.734007-1.807036 19.515988 19.515988 0 0 0-19.576223 19.576223 14.938164 14.938164 0 0 0 0 2.710554 23.370999 23.370999 0 0 0-5.119935-0.602345 27.587416 27.587416 0 0 0-20.178568 8.432834 28.129527 28.129527 0 0 0-8.131662 20.178569 27.045305 27.045305 0 0 0 8.131662 19.877395 27.587416 27.587416 0 0 0 20.961617 8.493069h95.772906a25.720145 25.720145 0 0 0 25.599676-25.599676z"
            fill="#FFFFFF"
            p-id="7564"
          ></path>
          <path
            d="M819.310109 365.27154l355.022333 273.645481v-560.181151h-1096.268488v59.27078h19.877396a19.817161 19.817161 0 0 1 13.552769 6.023453 20.058099 20.058099 0 0 1 0.301173 27.10554 19.27505 19.27505 0 0 1-13.853942 6.023453h-19.877396v591.984984L364.418921 551.757652l154.320871 142.575138 7.83049 6.625799 292.739827-335.687049m-46.079418-171.668417a24.093813 24.093813 0 0 1 5.722281 15.962151 25.720145 25.720145 0 0 1-25.900849 25.358738h-95.772906a27.587416 27.587416 0 0 1-20.178569-8.432834 27.045305 27.045305 0 0 1-8.131661-19.877396 28.129527 28.129527 0 0 1 8.131661-19.877395 27.587416 27.587416 0 0 1 20.178569-8.432835 23.370999 23.370999 0 0 1 5.119935 0.602345 14.938164 14.938164 0 0 1 0-2.710554 19.515988 19.515988 0 0 1 19.27505-19.576223 22.045839 22.045839 0 0 1 8.734008 1.807036 20.841148 20.841148 0 0 1 6.625798 6.023454 34.333683 34.333683 0 0 1 12.046907-9.637526 33.912042 33.912042 0 0 1 15.359805-3.614072 35.779312 35.779312 0 0 1 13.55277 2.710554 33.550635 33.550635 0 0 1 10.842216 7.228144 31.984537 31.984537 0 0 1 7.469082 10.842216 37.285176 37.285176 0 0 1 3.011727 13.251597 23.370999 23.370999 0 0 1 13.853942 8.734007m316.17106 31.020785a26.141787 26.141787 0 0 1 8.734007 7.529316 42.585814 42.585814 0 0 1 15.962151-12.649252 43.549567 43.549567 0 0 1 20.178569-4.818762 46.139652 46.139652 0 0 1 17.769187 3.614072 39.995729 39.995729 0 0 1 14.155115 9.336352 54.211079 54.211079 0 0 1 7.830489 9.938698V325.275811h-128.299554a37.044237 37.044237 0 0 1-37.044237-37.34541 37.405645 37.405645 0 0 1 10.541043-26.503194 36.140719 36.140719 0 0 1 26.503194-11.143389 26.021318 26.021318 0 0 1 6.926971 0.903518 29.093279 29.093279 0 0 1 0-3.614072 25.178035 25.178035 0 0 1 25.599677-25.599676 27.466947 27.466947 0 0 1 11.444561 2.409381M396.222754 231.550879a118.059683 118.059683 0 0 1 0 167.090592 112.819279 112.819279 0 0 1-82.882717 34.333684 117.2164 117.2164 0 0 1-117.638041-117.698276 114.445611 114.445611 0 0 1 34.333683-83.726 112.518106 112.518106 0 0 1 83.304358-34.936029 112.03623 112.03623 0 0 1 82.822482 34.936029M229.433334 545.914903a18.973878 18.973878 0 0 1-14.155115 5.421108h-58.547966a18.973878 18.973878 0 0 1-13.55277-6.023453 18.552236 18.552236 0 0 1-5.72228-13.55277 18.07036 18.07036 0 0 1 5.421108-13.853943 18.672705 18.672705 0 0 1 13.853942-6.023453h59.331014a19.395519 19.395519 0 0 1 13.853943 6.023453 18.07036 18.07036 0 0 1 5.421108 13.853943 20.178568 20.178568 0 0 1-6.023453 13.853942m377.248876-151.791021a18.552236 18.552236 0 0 1-19.275051 19.27505h-19.756926a20.238803 20.238803 0 0 1-13.853943-5.421108 19.395519 19.395519 0 0 1-5.421108-13.853942 20.961617 20.961617 0 0 1 5.421108-14.456288 19.455754 19.455754 0 0 1 13.853943-5.360873h19.877395a19.335285 19.335285 0 0 1 13.853943 5.360873 20.961617 20.961617 0 0 1 5.421108 14.75746z"
            fill="#C3F3F3"
            p-id="7565"
          ></path>
          <path
            d="M430.85761 314.975706a113.783032 113.783032 0 0 0-34.634856-83.424827 112.03623 112.03623 0 0 0-82.882717-34.936029 112.518106 112.518106 0 0 0-83.364593 34.936029 118.842732 118.842732 0 0 0 0 167.090592 113.36139 113.36139 0 0 0 83.364593 34.333684 112.819279 112.819279 0 0 0 82.822482-34.333684 114.02397 114.02397 0 0 0 34.695091-83.665765z"
            fill="#F15353"
            p-id="7566"
          ></path>
          <path
            d="M1174.272208 735.593445v-96.676424l-354.962099-273.645481-292.739827 335.687049h-0.301173L312.797926 945.691494h861.895923v-210.098049z"
            fill="#25AE88"
            p-id="7567"
          ></path>
        </svg>
      </div>
    ) : (
      <div style={{ width: '100%', height: '100%' }}>
        <div ref={container => (this.rootEl = container)}>
          <div
            // ref={divthis => {
            //   val.View = divthis;
            // }}
            style={{
              height: height,
              fontSize: 48,
              fontFamily: 'Arial',
              color: '#000000',
              textDecoration: 'node',
              cursor: 'text',
            }}
          >
            <Editor
              placeholder={val.placeholder}
              ref={this.setEditorReference}
              editorState={this.editorState}
              customStyleMap={getCustomStyleMap()}
              onChange={e => this.handleChange(e)}
              blockStyleFn={myBlockStyleFn}
              //handleKeyCommand={this.handleKeyCommand}
              // onEditorStateChange={this.onEditorStateChange}
            />
          </div>
          {/* <text>{JSON.stringify(convertToRaw(editorState.getCurrentContent()))}</text> */}
          {_HandShowToolbar ? (
            isMainView ? (
              val.IsShowToolbar ? (
                <RenderInBody
                  container={this.rootEl}
                  richTextComplex={val}
                  x={x}
                  y={y}
                >
                  <div
                    style={{
                      border: '1px solid #CCCCCC',
                      borderRadius: '5px',
                      background: '#F0F0F0',
                      height: '100px',
                      width: '200px',
                    }}
                  >
                    <RichTextToolbar
                      editorState={this.editorState}
                      richTextControl={this}
                    />
                  </div>
                </RenderInBody>
              ) : null
            ) : null
          ) : null}
        </div>
      </div>
    );
  }
}

function myBlockStyleFn(contentBlock) {
  const type = contentBlock.getType();
  if (type === 'text-right') {
    return 'rdw-right-aligned-block';
  } else if (type === 'text-left') {
    return 'rdw-left-aligned-block';
  } else if (type === 'text-center') {
    return 'rdw-center-aligned-block';
  } else {
    return 'default-block';
  }
}

const customInlineStylesMap = {
  color: {},
  bgcolor: {},
  fontSize: {},
  fontFamily: {},
  UNDERLINE: { borderBottom: '2px solid black' },
  //lineHeight: { 'line-height': '144px' },
  // CODE: {
  //   fontFamily: 'monospace',
  //   wordWrap: 'break-word',
  //   background: '#f1f1f1',
  //   borderRadius: 3,
  //   padding: '1px 3px',
  // },
  // SUPERSCRIPT: {
  //   fontSize: 11,
  //   position: 'relative',
  //   top: -8,
  //   display: 'inline-flex',
  // },
  // SUBSCRIPT: {
  //   fontSize: 11,
  //   position: 'relative',
  //   bottom: -8,
  //   display: 'inline-flex',
  // },
};

export const getCustomStyleMap = () => ({
  ...customInlineStylesMap.color,
  ...customInlineStylesMap.bgcolor,
  ...customInlineStylesMap.fontSize,
  ...customInlineStylesMap.fontFamily,
  UNDERLINE: customInlineStylesMap.UNDERLINE,
  //lineHeight: customInlineStylesMap.lineHeight,
  // SUPERSCRIPT: customInlineStylesMap.SUPERSCRIPT,
  // SUBSCRIPT: customInlineStylesMap.SUBSCRIPT,
});

export function extractInlineStyle(editorState) {
  if (editorState) {
    const styleList = editorState
      .getCurrentContent()
      .getBlockMap()
      .map(block => block.get('characterList'))
      .toList()
      .flatten();
    //console.log('styleList长度' + styleList.count);

    styleList.forEach(style => {
      //console.log("style："+style);
      if (style && style.indexOf('color-') === 0) {
        addToCustomStyleMapColor('color', 'color', style.substr(6));
      } else if (style && style.indexOf('fontsize-') === 0) {
        addToCustomStyleMapFontSize('fontSize', 'fontSize', +style.substr(9));
      } else if (style && style.indexOf('fontfamily-') === 0) {
        addToCustomStyleMap('fontFamily', 'fontFamily', style.substr(11));
      }
      //if (style && style.indexOf('bgcolor-') === 0) {
      //   addToCustomStyleMap('bgcolor', 'backgroundColor', style.substr(8));
    });
  }
}

const addToCustomStyleMapColor = (styleType, styleKey, style) => {
  let alpha = style ? (1 / 255) * parseInt(style.substr(1, 2), 16) : 1;
  let textcolor = style
    ? `rgba(
                  ${parseInt(style.substr(3, 2), 16)},
                  ${parseInt(style.substr(5, 2), 16)},
                  ${parseInt(style.substr(7, 2), 16)}, ${alpha})`
    : '#000000';

  customInlineStylesMap[styleType][`${styleType.toLowerCase()}-${style}`] = {
    [`${styleKey}`]: textcolor,
    //[`${styleKey}`]: '#' + style,
  };
};

const addToCustomStyleMap = (styleType, styleKey, style) => {
  // eslint-disable-line
  customInlineStylesMap[styleType][`${styleType.toLowerCase()}-${style}`] = {
    [`${styleKey}`]: style,
  };
};

const addToCustomStyleMapFontSize = (styleType, styleKey, style) => {
  // eslint-disable-line
  customInlineStylesMap[styleType][`${styleType.toLowerCase()}-${style}`] = {
    [`${styleKey}`]: style,
    [`lineHeight`]: style + 'px',
  };
};
