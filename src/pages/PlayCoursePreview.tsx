import { observable } from 'mobx';
import React from 'react';
import { Modal } from 'antd';
import { observer } from 'mobx-react';
import { classToPlain } from '@/class-transformer';
@observer
export class PlayCoursePreiew extends React.Component<any, any> {
  constructor(props) {
    super(props);
  }
  @observable
  static isplayCourse = false;
  @observable
  static playConfig: any[];

  @observable
  static playWidth: number = 1280;

  @observable
  static playHeight: number = 720;

  // iframeHelper = {
  //   jsGetJson: function () {
  //     if (
  //       PlayCoursePreiew.playConfig &&
  //       PlayCoursePreiew.playConfig.length >= 3
  //     )
  //       return PlayCoursePreiew.playConfig?.[2];
  //     return '';
  //   },
  // };

  iframe: HTMLIFrameElement;

  oniframemessage: (e: MessageEvent) => void = null;

  onIFrameLoad(iframe: HTMLIFrameElement) {
    if (iframe) {
      this.iframe = iframe;

      if (!this.oniframemessage) {
        this.oniframemessage = ((e: MessageEvent) => {
          if (e.data?.action == 'Get_OnlineEdit_CourseData') {
            this.iframe.contentWindow.postMessage(
              classToPlain({
                message: 'webeditorPreview',
                data: PlayCoursePreiew.playConfig?.[2],
              }),
              '*',
            );
          }
          if (e.data?.action == 'Get_HomeworkPreview_CourseData') {
            console.log('发送逻辑。。。。。。。');
            //console.log(iframe?.contentWindow);

            this.iframe?.contentWindow?.postMessage(
              classToPlain({
                message: 'homeworkPreview',
                data: PlayCoursePreiew.playConfig?.[2],
              }),
              '*',
            );
          }
        }).bind(this);
      }

      window.removeEventListener('message', this.oniframemessage);
      window.addEventListener('message', this.oniframemessage);

      //iframe.src = PlayCoursePreiew.playConfig?.[0];
      //iframe.contentWindow['scriptingHelper'] = this.iframeHelper;
    }
  }

  render() {
    return (
      <div className="previewWindow" style={{ position: 'absolute' }}>
        <Modal
          style={{ padding: '0px' }}
          width={PlayCoursePreiew.playWidth}
          title={PlayCoursePreiew.playConfig?.[1]}
          centered
          visible={PlayCoursePreiew.isplayCourse}
          footer={null}
          maskClosable={false}
          onCancel={() => {
            PlayCoursePreiew.isplayCourse = false;
          }}
        >
          <div
            style={{
              height: PlayCoursePreiew.playHeight,
              width: PlayCoursePreiew.playWidth,
              marginLeft: -24,
              marginTop: -24,
              marginBottom: -24,
            }}
          >
            {PlayCoursePreiew.isplayCourse ? (
              <iframe
                style={{
                  height: PlayCoursePreiew.playHeight,
                  width: PlayCoursePreiew.playWidth,
                  margin: '0px',
                  padding: '0px',
                  overflow: 'hidden',
                  border: 'none',
                  userSelect: 'none',
                }}
                //onLoad={this.onIFrameLoad.bind(this)}
                ref={this.onIFrameLoad.bind(this)}
                src={PlayCoursePreiew.playConfig[0]}
              ></iframe>
            ) : null}
          </div>
        </Modal>
      </div>
    );
  }
}
