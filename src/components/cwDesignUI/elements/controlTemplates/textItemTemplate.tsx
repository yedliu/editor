import React, { CSSProperties } from 'react';
import {
  Alignment,
  VAlignment,
} from '@/modelClasses/courseDetail/editItemViewModels/textEditItem';
import { TextControlPropertyToolbar } from '../../control/TextControlPropertyToolbar';
import { TextControl } from '@/components/cwDesignUI/control/TextControl';

import styles from '@/styles/property.less';
import textEditItem from '@/modelClasses/courseDetail/editItemViewModels/textEditItem';
import TextBoxInfo from '../../control/textBoxInfo';
import { ClassType } from '@/modelClasses/courseDetail/courseDetailenum';
import { Progress } from 'antd';

const Template = props => {
  const { courseware, dataContext, isMainView } = props;
  let data = dataContext as textEditItem;
  //data.initValue(courseware.Library);
  return (
    <div
      style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        cursor: 'pointer',
        pointerEvents: data.IsShowToolbar ? 'visible' : 'none',
        overflow: 'hidden',
      }}
    >
      {data.DisplayMode ? (
        <div style={{ width: '100%', height: '100%', float: 'left' }}>
          <img
            src={data.ImageUrl}
            loading="lazy"
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
              height: '45px',
              width: '45px',
              userSelect: 'none',
              float: 'left',
              marginLeft: data.Width - 100,
              marginTop: data.Height / 2 - 25,
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
      ) : null //显示隐藏
      }
      <div
        style={{
          width: '100%',
          height: '100%',
          float: 'left',
          visibility: data.DisplayMode ? 'hidden' : 'visible',
        }}
      >
        <TextControl
          data={data}
          isMainView={isMainView}
          FtSize={data.FtSize}
          Fonts={data.Fonts}
          IsBold={data.IsBold}
          Italic={data.Italic}
          UnderLine={data.UnderLine}
          Color={data.Color}
          VAlignment={data.VAlignment}
          Alignment={data.Alignment}
          Height={data.Height}
        />
      </div>
    </div>
  );
};

export default Template;

export const PropPanelTemplate = SelectedItem => {
  return (
    <div>
      <div className={styles.propdiv}>
        {SelectedItem.convertProgress == 0 ? null : (
          <Progress
            size="small"
            status={SelectedItem.ProgressStatus}
            percent={SelectedItem.convertProgress}
          />
        )}
      </div>

      {SelectedItem.thisData == null ? null : (
        <div className={styles.propdiv} style={{ height: '45px' }}>
          <label
            className={styles.proplbl}
            style={{ width: '82px', marginTop: '5px' }}
          >
            图文转换
          </label>
          {SelectedItem.DisplayMode ? (
            <button
              onClick={event => {
                SelectedItem.ImgToText(SelectedItem);
              }}
            >
              转换成文字
            </button>
          ) : (
            <button
              disabled={SelectedItem.isTransform}
              onClick={event =>
                SelectedItem.TextToImg(
                  SelectedItem,
                  <TextControl data={SelectedItem.thisData} />,
                  SelectedItem.UnderLine,
                )
              }
            >
              转换成图片
            </button>
          )}
        </div>
      )}

      {SelectedItem.DisplayMode ? null : (
        <div>
          {/* <div className={styles.propdiv}>
              <label className={styles.proplbl}>文本内容</label>
              <textarea
                style={{ width: 170, float: 'left', marginLeft: 33 }}
                onChange={event => SelectedItem.setValue('Text', event.target.value)}
                value={SelectedItem.Text || ''}
              />
            </div> */}
          <div className={styles.propdiv}>
            <label className={styles.proplbl}>文本样式</label>

            <TextControlPropertyToolbar
              dataContext={SelectedItem}
              style={{ width: 170, float: 'left', marginLeft: 33 }}
              onChange={(name, value, propertyType) => {
                SelectedItem.setValue(name, value, propertyType);
                SelectedItem.focusEditor();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// import React, { CSSProperties } from 'react';
// import {
//   Alignment,
//   VAlignment,
// } from '@/modelClasses/courseDetail/editItemViewModels/textEditItem';
// import { TextToolbar } from '../../control/textToolbar';
// import styles from '@/styles/property.less';

// const Template = props => {
//   const { courseware, dataContext } = props;
//   var reg = new RegExp('\n', 'g');
//   var divtext = dataContext.Text ? dataContext.Text.replace(reg, '<br>') : '';
//   let baseStyle: CSSProperties = {
//     position: 'absolute',
//     width: '100%',
//     fontSize: dataContext.FtSize,
//     fontFamily: dataContext.Fonts,
//     fontWeight: dataContext.IsBold == true ? 'bold' : 'normal',
//     fontStyle: dataContext.Italic == true ? 'italic' : 'normal',
//     textDecoration: dataContext.UnderLine == true ? 'underline' : 'none',
//     outline: 0,
//     overflowX: 'hidden',
//     overflowY: 'auto',
//     wordWrap: 'break-word',
//   };

//   let alpha = dataContext.Color
//     ? (1 / 255) * parseInt(dataContext.Color.substr(1, 2), 16)
//     : 1;
//   let textcolor = {
//     color: dataContext.Color
//       ? `rgba(${parseInt(dataContext.Color.substr(3, 2), 16)}, ${parseInt(
//           dataContext.Color.substr(5, 2),
//           16,
//         )}, ${parseInt(dataContext.Color.substr(7, 2), 16)}, ${alpha})`
//       : '',
//   };

//   let alignStyle: CSSProperties = {
//     textAlign: 'left',
//   };
//   switch (dataContext.Alignment) {
//     case Alignment.Left: {
//       alignStyle = {
//         textAlign: 'left',
//       };
//       break;
//     }
//     case Alignment.Center: {
//       alignStyle = {
//         textAlign: 'center',
//       };
//       break;
//     }
//     case Alignment.Right: {
//       alignStyle = {
//         textAlign: 'right',
//       };
//       break;
//     }
//     default:
//       break;
//   }

//   let valignStyle: CSSProperties = {
//     top: 0,
//   };

//   switch (dataContext.VAlignment) {
//     case VAlignment.Top: {
//       valignStyle = {
//         top: 0,
//       };
//       break;
//     }
//     case VAlignment.Center: {
//       valignStyle = {
//         top: '50%',
//         transform: 'translateY(-50%)',
//       };
//       break;
//     }
//     case VAlignment.Bottom: {
//       valignStyle = {
//         bottom: 0,
//       };
//       break;
//     }
//   }

//   return (
//     <div
//       key={dataContext.Id}
//       style={{
//         position: 'absolute',
//         width: '100%',
//         height: '100%',
//         overflow: 'hidden',
//         pointerEvents: dataContext.IsShowToolbar ? 'visible' : 'none',
//         cursor: 'text',
//       }}
//     >
//       <div
//         className={'textInput'}
//         ref="textarea"
//         style={{ ...baseStyle, ...valignStyle, ...alignStyle, ...textcolor }}
//         dangerouslySetInnerHTML={{ __html: divtext }}
//       ></div>
//       {/* <textarea key={dataContext.Id}
//         onChange={ontextArea}
//         value={dataContext.Text || ''} className={'textInput'}
//         style={{
//           position: 'absolute',
//           width: '100%',
//           height: '100%',
//           fontSize: dataContext.FtSize,
//           fontFamily: dataContext.Fonts,
//           fontWeight: dataContext.IsBold == true ? "bold" : "normal",
//           fontStyle: dataContext.Italic == true ? "italic" : "normal",
//           textDecoration: dataContext.UnderLine == true ? "underline" : "none",
//           textAlign: "center",
//         }}

//       >
//       </textarea> */}
//       {/* <input
//         type="text"
//         className={'textInput'}
//         key={dataContext.Id}
//         style={{
//           position: 'absolute',
//           width: '100%',
//           fontSize: dataContext.FtSize,
//           fontFamily: dataContext.Fonts,
//           fontWeight: dataContext.IsBold == true ? "bold" : "normal",
//           fontStyle: dataContext.Italic == true ? "italic" : "normal",
//           textDecoration: dataContext.UnderLine == true ? "underline" : "none",
//           textAlign: "center",
//           top: '50%',
//           transform: 'translateY(-50%)',
//         }}
//         onChange={event => dataContext.Text = event.target.value}
//         value={dataContext.Text || ''}
//       ></input> */}
//     </div>
//   );
// };
// export default Template;

// export const PropPanelTemplate = SelectedItem => {
//   return (
//     <div>
//       <div className={styles.propdiv}>
//         <label className={styles.proplbl}>文本内容</label>
//         <textarea
//           style={{ width: 170, float: 'left', marginLeft: 33 }}
//           onChange={event => SelectedItem.setValue('Text', event.target.value)}
//           value={SelectedItem.Text || ''}
//         />
//       </div>
//       <div className={styles.propdiv}>
//         <label className={styles.proplbl}>文本样式</label>
//         <TextToolbar
//           dataContext={SelectedItem}
//           style={{ width: 170, float: 'left', marginLeft: 33 }}
//           onChange={(name, value, propertyType) =>
//             SelectedItem.setValue(name, value, propertyType)
//           }
//         />
//       </div>
//     </div>
//   );
// };
