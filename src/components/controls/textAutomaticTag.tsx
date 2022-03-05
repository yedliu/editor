import React, { useRef, useState } from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';

@observer
export class TextAutomaticTag extends React.Component<any, any> {
  //@observable
  tags: Array<string> = new Array<string>();

  @observable
  inputVal: string = '';

  @observable
  inputWidth: number = 20;

  @observable
  inputControl: HTMLElement;

  @observable
  selectedIndex: number = -1;

  @observable
  selectedWidth: number = 20;

  constructor(props: any) {
    super(props);
  }

  componentDidMount() {
    // const { value, separator } = this.props;
    // console.log('输出分割字符串：value.split(Separator)');
    // console.log(value?.split(separator));
    // if (value == null || value == '') return;
    // this.tags = value?.split(separator);
    // this.setState({
    //   tags: value?.split(separator),
    //   inputVisible: false,
    //   inputValue: '',
    // });
  }

  inputOnKeyDown(e: React.KeyboardEvent) {
    const { separator, regular } = this.props;
    switch (e.key) {
      case 'Backspace':
        if (this.inputVal.length < 1) {
          this.tags = this.tags.slice(0, this.tags.length - 1);
        }
        this.valueChange(this.tags);
        break;
      case 'Enter':
        let reg = new RegExp(regular);
        if (!reg.test(this.inputVal)) {
          return;
        }
        this.tags.push(this.inputVal.replace(separator, ''));
        this.inputVal = '';
        this.valueChange(this.tags);
        break;
    }
  }

  inputUpdateOnKeyDown(e: React.KeyboardEvent) {
    const { separator, regular } = this.props;
    switch (e.key) {
      case 'Enter':
        this.selectedIndex = -1;
        this.valueChange(this.tags);
        break;
    }

    //this.valueChange(this.tags);
  }

  onMouseDown(e: React.MouseEvent) {
    this.selectedIndex = -1;
    //e.preventDefault();
    this.inputControl.focus();
  }

  valueChange(tags: Array<string>) {
    const { value, separator, onChange } = this.props;

    var returnValue = '';
    for (let index = 0; index < tags.length; index++) {
      const element = tags[index];
      returnValue += element;
      if (index + 1 < tags.length) returnValue += separator;
    }
    onChange(returnValue);
  }

  render() {
    const { value, separator, onChange, regular } = this.props;

    // const { value, separator } = this.props;
    // console.log('输出分割字符串：value.split(Separator)');
    // console.log(value?.split(separator));

    var splitVal;
    if (value == null || value == '') {
      //逻辑
    } else {
      this.tags = value?.split(separator);
      splitVal = value?.split(separator);
    }

    return (
      <div
        onMouseUp={e => this.onMouseDown(e)}
        style={{
          backgroundColor: '#ffffffff',
          border: '1px solid #CCCCCC',
          borderRadius: '5px',
          width: '100%',
          height: 'auto',
          float: 'left',
          cursor: 'text',
        }}
      >
        {splitVal?.map((x, i) => {
          return (
            <div
              // onDoubleClick={e=>
              //   {
              //     this.tags.splice(i,1);
              //     this.valueChange(this.tags);
              //   }}
              onMouseUp={e => {
                //e.preventDefault();
                e.stopPropagation();
                if (e.button == 2) {
                  this.selectedIndex = -1;
                  this.tags.splice(i, 1);
                  this.valueChange(this.tags);
                }
              }}
              onClick={e => {
                if (this.selectedIndex != i) {
                  this.selectedWidth = e.currentTarget.offsetWidth;
                  this.selectedIndex = i;
                }
              }}
              key={i}
              style={{
                float: 'left',
                height: '20px',
                marginLeft: '2px',
                backgroundColor: '#ade5ff',
                borderRadius: '3px',
              }}
            >
              {this.selectedIndex == i ? (
                <input
                  spellCheck={false}
                  onBlur={e => {
                    this.selectedIndex = -1;
                    this.valueChange(this.tags);
                  }}
                  onKeyDown={e => this.inputUpdateOnKeyDown(e)}
                  autoFocus={true}
                  style={{
                    border: 0,
                    outline: 0,
                    height: '18px',
                    width:
                      x.length * 8 > this.selectedWidth
                        ? x.length * 8
                        : this.selectedWidth,
                    //width:'30px',
                    marginLeft: '4px',
                    marginRight: '4px',
                    backgroundColor: 'transparent',
                  }}
                  type="text"
                  //style={{ width: '30px', height: '20px', marginLeft: '4px',marginRight:'4px' }}
                  value={x}
                  onChange={e => {
                    var val = e.target.value;

                    let reg = new RegExp(regular);
                    if (!reg.test(val)) {
                      return;
                    }
                    this.tags[i] = val.replace(separator, '');
                    this.valueChange(this.tags);
                    //x = e.target.value;
                    //x = String(e.target.value || '');
                  }}
                ></input>
              ) : (
                <label style={{ marginLeft: '4px', marginRight: '4px' }}>
                  {x}
                </label>
              )}
            </div>
          );
        })}

        <input
          spellCheck={false}
          ref={r => (this.inputControl = r)}
          onKeyDown={e => this.inputOnKeyDown(e)}
          type="text"
          //size="small"
          style={{
            border: 0,
            outline: 0,
            height: '20px',
            width: this.inputWidth <= 20 ? 20 : this.inputWidth + 'px',
            maxWidth: '145px',
            float: 'left',
            //backgroundColor:'#e3233221'
          }}
          value={this.inputVal}
          onChange={e => {
            this.inputVal = e.target.value;
            this.inputWidth = e.target.value.length * 8;
            // console.log(e.target.value);
            // x = String(e.target.value || '');
          }}
        ></input>
        {/* <label>{value}</label> */}
      </div>
    );
  }
}

// export class TextAutomaticTag extends React.Component<any, any> {
//   //public onChange?: (currentActiveLink: string) => void;

//   constructor(props: any) {
//     super(props);
//   }

//   componentDidMount() {
//     const { value, separator } = this.props;
//     console.log('输出分割字符串：value.split(Separator)');
//     console.log(value?.split(separator));

//     this.setState({
//       tags: value?.split(separator),
//       inputVisible: false,
//       inputValue: '',
//     });
//   }

//   input;

//   state = {
//     //tags: ['1', '2', '3'],
//     tags: [''],
//     inputVisible: false,
//     inputValue: '',
//     editInputIndex: -1,
//     editInputValue: '',
//   };

//   handleClose = removedTag => {
//     const tags = this.state.tags.filter(tag => tag !== removedTag);
//     this.valueChange(tags);
//     console.log(tags);
//     this.setState({ tags });
//   };

//   showInput = () => {
//     this.setState({ inputVisible: true }, () => this.input.focus());
//   };

//   handleInputChange = e => {
//     this.setState({ inputValue: e.target.value });
//   };

//   handleInputConfirm = () => {
//     const { inputValue } = this.state;
//     let { tags } = this.state;
//     if (inputValue && tags.indexOf(inputValue) === -1) {
//       tags = [...tags, inputValue];
//     }
//     console.log(tags);

//     this.valueChange(tags);

//     this.setState({
//       tags,
//       inputVisible: false,
//       inputValue: '',
//     });
//   };

//   handleEditInputChange = e => {
//     this.setState({ editInputValue: e.target.value });
//   };

//   handleEditInputConfirm = () => {
//     this.setState(({ tags, editInputIndex, editInputValue }) => {
//       const newTags = [...tags];
//       newTags[editInputIndex] = editInputValue;

//       return {
//         tags: newTags,
//         editInputIndex: -1,
//         editInputValue: '',
//       };
//     });
//   };

//   saveInputRef = input => {
//     this.input = input;
//   };

//   saveEditInputRef = input => {
//     //this.editInput = input;
//   };

//   valueChange(tags: any[]) {
//     const { value, separator, onChange } = this.props;

//     var returnValue = '';
//     for (let index = 0; index < tags.length; index++) {
//       const element = tags[index];
//       returnValue += element;
//       if (index + 1 < tags.length) returnValue += separator;
//     }
//     onChange(returnValue);
//   }

//   render() {
//     const {
//       tags,
//       inputVisible,
//       inputValue,
//       editInputIndex,
//       editInputValue,
//     } = this.state;
//     return (
//       <>
//         {tags.map((tag, index) => {
//           if (editInputIndex === index) {
//             return (
//               <Input
//                 ref={this.saveEditInputRef}
//                 key={tag}
//                 size="small"
//                 className="tag-input"
//                 value={editInputValue}
//                 onChange={this.handleEditInputChange}
//                 onBlur={this.handleEditInputConfirm}
//                 onPressEnter={this.handleEditInputConfirm}
//               />
//             );
//           }

//           const isLongTag = tag.length > 20;

//           const tagElem = (
//             <Tag
//               className="edit-tag"
//               key={tag}
//               closable={index !== 0}
//               onClose={() => this.handleClose(tag)}
//             >
//               <span
//                 onDoubleClick={e => {
//                   if (index !== 0) {
//                     this.setState(
//                       { editInputIndex: index, editInputValue: tag },
//                       () => {
//                         //this.editInput.focus();
//                       },
//                     );
//                     e.preventDefault();
//                   }
//                 }}
//               >
//                 {isLongTag ? `${tag.slice(0, 20)}...` : tag}
//               </span>
//             </Tag>
//           );
//           return isLongTag ? (
//             <Tooltip title={tag} key={tag}>
//               {tagElem}
//             </Tooltip>
//           ) : (
//             tagElem
//           );
//         })}
//         {inputVisible && (
//           <Input
//             ref={this.saveInputRef}
//             type="text"
//             size="small"
//             className="tag-input"
//             value={inputValue}
//             onChange={this.handleInputChange}
//             onBlur={this.handleInputConfirm}
//             onPressEnter={this.handleInputConfirm}
//           />
//         )}
//         {!inputVisible && (
//           <Tag className="site-tag-plus" onClick={this.showInput}>
//             <PlusOutlined />
//           </Tag>
//         )}
//       </>
//     );
//   }
// }

// export class TextAutomaticTag extends React.Component<any, any> {
//   init: boolean = true;
//   private rootEl: HTMLElement;

//   constructor(props: any) {
//     super(props);
//     const { data, isMainView } = this.props;

//     //var val = data as textEditItem;

//     var contentState;
//     // if (val.Text == null || val.Text.length == 0) {
//     //   contentState = JSON.parse(
//     //     '{"blocks":[{"key":"n0","text":"","type":"text-left","depth":0,"entityRanges":[],"data":{}}],"entityMap":{}}',
//     //   );
//     // } else {
//     //   var Text = '';
//     //   if (val.Text.indexOf('\r\n') >= 0) {
//     //     var texts = val.Text.split('\r\n');
//     //     Text = '{"blocks":[';
//     //     texts.map((val, i) => {
//     //       Text +=
//     //         '{"key":"n' +
//     //         i +
//     //         '","text":"' +
//     //         val +
//     //         '","type":"text-left","depth":0,"entityRanges":[],"data":{}}';
//     //       if (i + 2 <= texts.length) {
//     //         Text += ',';
//     //       }
//     //     });
//     //     Text += '],"entityMap":{}}';
//     //   } else {
//     //     Text =
//     //       '{"blocks":[{"key":"24rnc32","text":"' +
//     //       val.Text.trim() +
//     //       '","type":"unstyled","depth":0,"entityRanges":[],"data":{}}],"entityMap":{}}';
//     //   }

//     //   try {
//     //     contentState = JSON.parse(Text);
//     //   } catch (error) {
//     //     contentState = JSON.parse(
//     //       '{"blocks":[{"key":"n0","text":"","type":"text-left","depth":0,"entityRanges":[],"data":{}}],"entityMap":{}}',
//     //     );
//     //     console.log('这个JSON转换失败-----------------');
//     //     console.log(Text);
//     //   }
//     // }

//          contentState = JSON.parse(
//           //'{"blocks":[{"key":"n0","text":"","type":"text-left","depth":0,"entityRanges":[],"data":{}}],"entityMap":{}}',
//           '{"blocks":[{"key":"fcsqe","text":"我是测试","type":"unstyled","depth":0,"inlineStyleRanges":[{"offset":0,"length":2,"style":"bgcolor-rgb(26,188,156)"},{"offset":2,"length":2,"style":"bgcolor-rgb(44,130,201)"}],"entityRanges":[],"data":{}}],"entityMap":{}}'
//         );
//     const editorState = EditorState.createWithContent(
//       convertFromRaw(contentState),
//     );
//     this.state = {
//       editorState,
//     };

//     this.init = false;
//   }

//   handleChange(e: EditorState) {
//     this.setState({ editorState: e });
//   }

//   render() {
//     const { editorState } = this.state;
//     const { data, isMainView, Alignment } = this.props;
//     var val = data as textEditItem;

//     return (
//       <div ref={container => (this.rootEl = container)}>
//         <div
//         //   ref={divthis => {
//         //     val.EditDiv = divthis;
//         //   }}
//           style={{
//             //fontSize: '25px',
//             //fontFamily: val.Fonts,
//             //fontWeight: val.IsBold ? 'bold' : 'initial',
//             //fontStyle: val.Italic ? 'italic' : '',
//             //textDecoration: val.UnderLine ? 'underline' : 'none',
//             //textDecorationColor: '#000000',
//             //marginTop: vtop + 'px',
//             cursor: 'text',
//             //backgroundColor:'#e323',
//             width:'120px',
//             border: '1px solid #CCCCCC',
//             //borderRadius: '5px',
//             backgroundColor:'#ffffff'
//           }}
//         >
//           <Editor
//             placeholder="请输入文字"
//             // ref={xref => {
//             //   val.editor = xref;
//             // }}
//             editorState={editorState}
//             onChange={e => this.handleChange(e)}
//             //blockStyleFn={e => this.myBlockStyleFn(val)}
//           />

//         </div>

//       </div>
//     );
//   }
// }
