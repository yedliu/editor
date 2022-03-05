import { Button, message, Modal } from 'antd';
import { observer } from 'mobx-react';
import React from 'react';
import { PureComponent } from 'react';
import FormworkListViewModel from '../models/formworklistViewModel';
import { SingleSelectionAnsView } from './quesAnsViews';

@observer
export class QuUnitView extends PureComponent<any> {
  render() {
    var type = this.props.type;
    var content = this.props.content;
    var title = this.props.title;
    switch (type) {
      case 0:
        return (
          <div
            style={{
              position: 'relative',
              width: '93%',
              margin: '6px 2%',
              display: 'block',
            }}
          >
            {title ? (
              <div
                style={{
                  display: 'inline-block',
                  width: '60px',
                  verticalAlign: 'top',
                }}
              >
                {title}
              </div>
            ) : null}
            <div
              style={{
                display: 'inline-block',
                marginLeft: '3px',
                width: title ? 'calc(100% - 64px)' : 'calc(100% - 4px)',
                verticalAlign: 'top',
              }}
            >
              {content}
            </div>
          </div>
        );
      case 1:
        return (
          <div
            style={{
              display: 'inline-block',
              width: '45%',
              height: '100px',
              margin: '6px 2%',
            }}
          >
            <div
              style={{
                display: 'inline-block',
                width: '60px',
                verticalAlign: 'top',
              }}
            >
              {title}
            </div>
            <div
              style={{
                position: 'relative',
                display: 'inline-block',
                marginLeft: '3px',
                width: 'calc(100% - 64px)',
                height: '100%',
                overflow: 'hidden',
                borderRadius: '6px',
              }}
            >
              <img
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  objectFit: 'scale-down',
                }}
                src={content}
                draggable={false}
              ></img>
              <div
                style={{
                  pointerEvents: 'none',
                  zIndex: 99,
                  position: 'absolute',
                  boxShadow: '0px 0px 12px 3px #3333333F inset',
                  width: '100%',
                  height: '100%',
                }}
              ></div>
            </div>
          </div>
        );
    }
    return null;
  }
}

export const GetAnsUI = (data: FormworkListViewModel) => {
  var qTypeCode = data?.QTypeCode;
  if (qTypeCode) {
    var qRootType = qTypeCode.split('_')?.[0];
    switch (qRootType) {
      case 'S':
        return <SingleSelectionAnsView data={data} />;
    }
  }
  return null;
};

export const GetQuDataUI = (data: FormworkListViewModel) => {
  return (
    <div
      style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        overflowY: 'auto',
        overflowX: 'hidden',
      }}
    >
      <div
        style={{
          position: 'relative',
          margin: '15px',
        }}
      >
        <div
          style={{
            position: 'relative',
            fontSize: '16px',
            userSelect: 'none',
            margin: '5px 2px',
          }}
        >
          <strong>题干：</strong>
        </div>
        <div style={{ minHeight: '60px' }}>
          <QuUnitView
            type={data.QuData?.quStt}
            title={''}
            content={data.QuData?.title}
          />
        </div>
        <div
          style={{
            height: '1px',
            background: '#666666',
            boxShadow: '0 0 1px 1px #3333332F',
            margin: '15px 2px',
          }}
        ></div>
        <div
          style={{
            fontSize: '16px',
            userSelect: 'none',
            margin: '5px 2px',
          }}
        >
          <strong>选项：</strong>
        </div>
        <div style={{ minHeight: '60px' }}>
          {data.QuData?.optionList?.map((option, i) => (
            <QuUnitView
              type={data.QuData?.quOpt}
              key={i}
              title={`选项${i + 1}`}
              content={option}
            ></QuUnitView>
          ))}
        </div>
        <div
          style={{
            height: '1px',
            background: '#666666',
            boxShadow: '0 0 1px 1px #3333332F',
            margin: '15px 2px',
          }}
        ></div>
        <div style={{ fontSize: '16px', userSelect: 'none' }}>
          <strong>正确答案：</strong>
        </div>
        <div style={{ width: '100%' }}>{GetAnsUI(data)}</div>
      </div>
    </div>
  );
};

@observer
export default class FormworkLinkDialog extends PureComponent<any> {
  GetPreviewUI() {
    var data: FormworkListViewModel = this.props.data;
    var currentFormwork = data?.CurrentFormwork;

    return (
      <iframe
        style={{
          position: 'absolute',
          left: '-2px',
          right: '-2px',
          top: '-2px',
          bottom: '-2px',
          width: 'calc(100% + 4px)',
          height: 'calc(100% + 4px)',
        }}
        src={`${
          process.env.prevUrl
        }?coursewareId=${currentFormwork.coursewareId ||
          currentFormwork.courseWareId}&questionId=${data.QuId}&userId=${
          data.UserId
        }&rand=${Math.random()}`}
      ></iframe>
    );
  }

  render() {
    var data: FormworkListViewModel = this.props.data;
    var currentFormwork = data?.CurrentFormwork;
    if (data && currentFormwork) {
      return (
        <Modal
          visible={data.IsShowPreviewDialog}
          maskClosable={false}
          style={{ padding: '0px' }}
          width={window.innerWidth * 0.91}
          title={`预览合并:${currentFormwork.coursewareName}`}
          centered
          footer={null}
          onCancel={() => {
            data.IsShowPreviewDialog = false;
          }}
        >
          <div
            style={{
              position: 'relative',
              height: `${window.innerHeight * 0.78}px`,
              background: '#FCFCFC',
            }}
          >
            <div
              style={{
                pointerEvents: 'none',
                zIndex: 99,
                position: 'absolute',
                boxShadow: '0px 0px 10px 3px #3333332F inset',
                width: '100%',
                height: '100%',
              }}
            ></div>
            <div
              style={{
                position: 'absolute',
                top: '0px',
                left: '0px',
                right: '410px',
                bottom: '0px',
                background: '#F4F4F4',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  paddingTop: 'calc(100% * 9 / 16)',
                  position: 'relative',
                  width: '100%',
                  height: 0,
                  overflow: 'hidden',
                  top: '50%',
                  transform: 'translate(0,-50%)',
                }}
              >
                {this.GetPreviewUI()}
              </div>
            </div>
            <div
              style={{
                position: 'absolute',
                width: '410px',
                top: '0px',
                right: '0px',
                bottom: '45px',
                background: '#F9F9F9',
              }}
            >
              {GetQuDataUI(data)}
            </div>
            <div
              style={{
                position: 'absolute',
                width: '410px',
                right: '0px',
                bottom: '0px',
                height: '45px',
                textAlign: 'center',
                lineHeight: '45px',
              }}
            >
              <Button
                type="primary"
                style={{
                  background: data?.CurrentFormwork.isUsed
                    ? '#C8C8C8'
                    : '#ccBB35',
                  display: 'inline-block',
                  pointerEvents: data?.CurrentFormwork.isUsed
                    ? 'none'
                    : 'visible',
                }}
                onClick={() => {
                  data.LinkTemplateQu(
                    data.CurrentFormwork.courseWareId ||
                      data.CurrentFormwork.coursewareId,
                    () => {
                      data.IsShowPreviewDialog = false;
                      message.info('题目与作业模板连接成功');
                      //data.GetFormworkList();
                    },
                  );
                }}
              >
                {data?.CurrentFormwork.isUsed
                  ? '已存在合成课件'
                  : '确认生成互动课件'}
              </Button>
            </div>
          </div>
        </Modal>
      );
    }
    return null;
  }
}
