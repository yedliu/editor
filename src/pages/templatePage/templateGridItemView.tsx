import { Courseware } from '@/modelClasses/courseware';
import { NewMoreIcon, NewUploadingIcon } from '@/utils/customIcon';
import TimerHelper from '@/utils/timerHelper';
import { Card, Dropdown, Popover, Tooltip } from 'antd';
import { observer } from 'mobx-react';
import React from 'react';
import antStyle from '@/styles/defaultAnt.less';
import { observable } from 'mobx';
import QRCode from 'qrcode.react';

@observer
class TemplateGridItemView extends React.Component<any, any> {
  constructor(props) {
    super(props);
  }

  state = {
    visible: false,
    //visibleModal: false,
  };

  @observable
  selectCoursewareId: number = null;

  render() {
    const {
      coursewareName,
      cover,
      self,
      domain,
      shared,
      compiler,
      updateTime,
      upload,
      onUpload,
      coursewareId,
    } = this.props;
    return (
      <div
        className={antStyle.antCard}
        onMouseEnter={() => (this.selectCoursewareId = coursewareId)}
        onMouseLeave={() => (this.selectCoursewareId = null)}
      >
        {/* 卡片区域 */}
        <div style={{ width: 230, height: 217 }}>
          <Card
            bordered={false}
            hoverable={true}
            style={{ width: 230, height: 217, borderRadius: '10px' }}
            cover={
              <img
                style={{
                  borderRadius: '10px 10px 0px 0px',
                  width: '230px',
                  height: '129px',
                }}
                alt="example"
                src={
                  cover
                    ? cover
                    : require('@/assets/mainlist/png_default_zhijiao.png')
                }
              />
              // <div style={{
              //     width:'230px',
              //     height:'129px',
              //     borderRadius:'10px 10px 0px 0px',
              //     backgroundImage:`url(${cover?cover:require('@/assets/mainlist/courseDefault.png')})`,
              //     backgroundSize:'100%'
              // }}>
              // </div>
            }
            // actions={[
            //   <SettingOutlined key="setting" />,
            //   <EditOutlined key="edit" />,
            //   <EllipsisOutlined key="ellipsis" />,
            // ]}
          >
            {/* <span style={{color:'black'}}>{coursewareName}</span> */}
            <div>
              <div
                style={{
                  width: '100%',
                  // display: 'flex',
                  // flexDirection: 'row-reverse',
                  // whiteSpace: 'nowrap',
                }}
              >
                <Tooltip
                  mouseEnterDelay={0.4}
                  style={{ width: '100%', marginTop: '50px' }}
                  placement="topLeft"
                  title={coursewareName}
                >
                  <div
                    style={{
                      textOverflow: 'ellipsis',
                      width: '200px',
                      height: '44px',
                      overflow: 'hidden',
                    }}
                  >
                    <span
                      style={{
                        display: '-webkit-box',
                        WebkitBoxOrient: 'vertical',
                        WebkitLineClamp: 2,
                        overflow: 'hidden',
                        whiteSpace: 'normal',
                      }}
                    >
                      {shared && domain == 0 ? (
                        <img
                          style={{
                            marginRight: '3px',
                            width: '16px',
                            height: '16px',
                            marginBottom: '3px',
                          }}
                          alt="example"
                          src={require('@/assets/mainlist/icon_share.png')}
                        />
                      ) : null}
                      {self && domain == 1 ? (
                        <img
                          style={{
                            marginRight: '3px',
                            width: '16px',
                            height: '16px',
                            marginBottom: '3px',
                          }}
                          alt="example"
                          src={require('@/assets/mainlist/icon_me.png')}
                        />
                      ) : null}
                      {coursewareName}
                    </span>
                  </div>
                </Tooltip>
              </div>
              <div
                style={{
                  width: '100%',
                  display: 'flex',
                  marginTop: '8px',
                }}
              >
                <span
                  style={{
                    color: '#666666',
                    fontSize: '12px',
                    width: '63px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    //background:'#c0f04f6c'
                  }}
                >
                  {compiler}
                </span>
                <div
                  style={{
                    width: '1px',
                    background: '#66666680',
                    marginLeft: '6px',
                    height: '10px',
                    marginTop: '5px',
                  }}
                ></div>
                <span
                  style={{
                    color: '#666666',
                    marginLeft: '4px',
                    fontSize: '12px',
                    width: '85px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    //background:'#d04ff06c'
                  }}
                >
                  {TimerHelper.stringToDateNoTime(updateTime)}
                </span>
                <div
                  style={{
                    marginLeft: '10px',
                    width: '62px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    //background:'#4ff08d6c'
                  }}
                >
                  {upload == 1 ? (
                    <div style={{ display: 'flex', marginLeft: '9px' }}>
                      <span style={{ color: '#666666', fontSize: '12px' }}>
                        已上传
                      </span>
                    </div>
                  ) : (
                    <div style={{ display: 'flex' }}>
                      <div
                        style={{
                          borderRadius: '50%',
                          background: 'red',
                          width: 5,
                          height: 5,
                          marginTop: 7,
                          marginRight: 5,
                        }}
                      />
                      <span style={{ color: '#666666', fontSize: '12px' }}>
                        未上传
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }
}

export default TemplateGridItemView;
