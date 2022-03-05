import React, { PureComponent, MouseEventHandler } from 'react';
import richTextComplex from '@/modelClasses/courseDetail/editItemViewModels/complexControl/richTextControl/richTextComplex';
import styles from '@/styles/property.less';
import ReactDOM from 'react-dom';
import 'draft-js/dist/Draft.css';
import { RichTextControl } from '@/components/cwDesignUI/control/richTextControl';
import {
  ClassType,
  CWResourceTypes,
} from '@/modelClasses/courseDetail/courseDetailenum';
import html2canvas from 'html2canvas';
import CWResource from '@/modelClasses/courseDetail/cwResource';
import md5 from 'md5';
import { Button, Progress } from 'antd';

const Template = props => {
  const { courseware, dataContext, isMainView } = props;
  let data = dataContext as richTextComplex;
  //data.initValue(courseware.Library);
  //InitValue(data);
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
      <RichTextControl
        data={data}
        isMainView={isMainView}
        width={data.Width}
        height={data.Height}
        HandShowToolbar={true}
        displayMode={data.DisplayMode}
      />
    </div>
  );
};

// const InitValue = (data: richTextComplex) => {
//   if (data.DisplayMode != null && data.DisplayMode && data.WEBMd5 == null) {
//     var CopyView = true;
//     data.WEBMd5 = data.ResourceId;
//     var md5 = data.WEBMd5;
//     if (data.reslib != null) {
//       var cw = data.reslib.filter(x => x.resourceId == md5);
//       if (cw != null && cw.length > 0) {
//         data.WEBUrl = cw[0].resourceKey;
//         var url = data.WEBUrl;
//         if (url != null && url.trim() != '') {
//           // try {
//           if (
//             url.toLowerCase().indexOf('http://') != -1 ||
//             url.toLowerCase().indexOf('https://') != -1
//           ) {
//             data.WEBImageUrl = url;
//             //data.ResourceId = '';
//           } else {
//             data.WEBImageUrl = url;
//             //data.ResourceId = '';
//             //可能是byte64暂时不转换
//           }
//           CopyView = false; //发送页等..有可能造成这个问题 ，预留属性 后面出现问题。加载完自动生成
//           // } catch (error)
//           // {
//           //    console.log("错误啦：：："+error);
//           // }
//         }
//       }
//     }
//   }
// };

export default Template;

export const PropPanelTemplate = SelectedItem => {
  let SelectedUnits = SelectedItem.SelectedUnits;
  if (SelectedItem.thisData == null) return;

  // if(SelectedItem.DisplayMode == true && SelectedItem.ImageUrl == '')
  // {
  //   SelectedItem.TextToImg(
  //     SelectedItem,
  //     <RichTextControl data={SelectedItem.thisData} />,
  //   )
  // }

  return (
    <div style={{ width: '250px' }}>
      <div className={styles.propdiv}>
        {SelectedItem.convertProgress == 0 ? null : (
          <Progress
            size="small"
            status={SelectedItem.ProgressStatus}
            percent={SelectedItem.convertProgress}
          />
        )}
      </div>

      <div className={styles.propdiv} style={{ height: '45px' }}>
        <label
          className={styles.proplbl}
          style={{ width: '82px', marginTop: '5px' }}
        >
          图文转换
        </label>
        {SelectedItem.DisplayMode ? (
          <Button onClick={event => SelectedItem.ImgToText(SelectedItem)}>
            转换成文字
          </Button>
        ) : (
          <Button
            disabled={SelectedItem.isTransform}
            onClick={event => {
              SelectedItem.TextToImg(
                SelectedItem,
                <RichTextControl data={SelectedItem.thisData} />,
              );
            }}
          >
            转换成图片
          </Button>
        )}
      </div>
    </div>
  );
};

// const ImgToText = SelectedItem => {
//   SelectedItem.setValue('IsShowToolbar', false, ClassType.bool);
//   SelectedItem.setValue('DisplayMode', false, ClassType.bool);
// };
// const TextToImg = SelectedItem => {
//   SelectedItem.setValue('IsShowToolbar', false, ClassType.bool);

//   var div = document.createElement('div');
//   div.style.background = 'transparent';
//   div.style.position = 'absolute';
//   div.style.width = `${SelectedItem.Width}px`;
//   div.style.height = `${SelectedItem.Height}px`;
//   div.style.zIndex = '-10';
//   ReactDOM.render(<RichTextControl data={SelectedItem.thisData} />, div);
//   document.body.appendChild(div);
//   var lineDispose = div.querySelectorAll('span');
//   // console.log("lineDispose:::");
//   // console.log(lineDispose);
//   lineDispose.forEach(element => {
//     if (
//       element.style.textDecoration != null &&
//       element.style.textDecoration == 'underline'
//     ) {
//       element.childNodes.forEach(x => {
//         (x as HTMLElement).style.textDecoration = 'inherit';
//       });
//     }
//   });
//   html2canvas(div, { backgroundColor: 'transparent' }).then(canvas => {
//     var byte64 = canvas.toDataURL();
//     SelectedItem.setValue('ImageUrl', byte64, ClassType.string);
//     document.body.removeChild(div);
//     var md = md5(byte64);
//     if (
//       SelectedItem.md5 != null &&
//       SelectedItem.md5 == md &&
//       SelectedItem.Url != ''
//     ) {
//       SelectedItem.setValue('isUpdateData', false, ClassType.bool);
//     } else {
//       SelectedItem.setValue('md5', md, ClassType.string);
//     }
//     var _CWResource = new CWResource();
//     _CWResource.resourceType = CWResourceTypes.TextImage;
//     _CWResource.resourceId = md;
//     _CWResource.ImageData = SelectedItem.isUpdateData ? byte64 : null;
//     SelectedItem.setValue('ImageResource', _CWResource, ClassType.object);

//     SelectedItem.setValue('DisplayMode', true, ClassType.bool);
//   });
// };
