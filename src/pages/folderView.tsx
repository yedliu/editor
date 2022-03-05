import { CloseIcon } from '@/utils/customIcon';
import { Breadcrumb, Button, Modal } from 'antd';
import { except } from 'linq-to-typescript';
import { observer } from 'mobx-react';
import React from 'react';
import antStyle from '@/styles/defaultAnt.less';
import { observable } from 'mobx';

@observer
class FolderView extends React.Component<any, any> {
  constructor(props) {
    super(props);
  }
  @observable
  selectMoveItem: number = null;
  @observable
  selectItem: number = null;

  @observable
  static isWindowShow: boolean = false;

  @observable
  folderNameList: Array<string> = [
    '项目名称最多显示宽度适配',
    '项目名称最多显示宽度适配，多的的的1234567890字用点点点23对的',
    '项目名111111度适配，多的字用',
    '项目名2222配，多的字用',
    '项目名3333宽度适配，多的字用',
    '项目名称4444度适配，多的字用',
    '项目名称555度适配，多的字用',
    '项目名称5566666配，多的字用',
    '项目名称5566666配，多的字用',
    '项目名称5566666配，多的字用',
    '项目名称5566666配，多的字用',
    '项目名称5566666配，多的字用',
    '项目名称5566666配，多的字用',
    '项目名称5566666配，多的字用',
    '项目名称5566666配，多的字用',
    '项目名称5566666配，多的字用',
    '项目名称5566666配，多的字用',
  ];

  render() {
    return (
      <Modal
        className={antStyle.antCreateView}
        style={{ padding: '0px' }}
        //width={`${this.windowWidth}px`}
        width={470}
        closable={false}
        title={null}
        centered
        visible={FolderView.isWindowShow}
        maskClosable={false}
        footer={false}
      >
        <div style={{ padding: '-24px', height: '550px' }}>
          <div>
            <div
              style={{
                fontSize: 16,
                background: '#F6F9FBFF',
                height: '40px',
                display: '-webkit-box',
                WebkitBoxAlign: 'center',
                WebkitBoxPack: 'center',
                borderRadius: '5px 5px 0px 0px',
              }}
            >
              <div style={{ textAlign: 'center' }}>
                <label
                  style={{
                    textAlign: 'center',
                    marginTop: '14px',
                    color: '#333333FF',
                    fontSize: '14px',
                  }}
                >
                  {'文件夹'}
                </label>
              </div>
              <div
                style={{
                  position: 'absolute',
                  width: 20,
                  height: 20,
                  right: 5,
                  top: 10,
                  cursor: 'pointer',
                }}
                onClick={event => (FolderView.isWindowShow = false)}
              >
                <CloseIcon />
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                textAlign: 'center',
                margin: '0px 25px',
              }}
            >
              <Breadcrumb style={{ marginTop: '15px' }}>
                <Breadcrumb.Item>Home</Breadcrumb.Item>
                <Breadcrumb.Item>
                  <a href="">全部文件</a>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                  <a href="">文件夹名字啊</a>
                </Breadcrumb.Item>
              </Breadcrumb>
            </div>

            <div
              style={{
                height: '400px',
                margin: '0px 25px',
                overflow: 'auto',
              }}
            >
              {this.folderNameList?.map((item, i) => {
                return (
                  <div
                    onMouseEnter={() => (this.selectMoveItem = i)}
                    onMouseLeave={() => (this.selectMoveItem = null)}
                    onClick={() => (this.selectItem = i)}
                    key={i}
                    style={{
                      height: '76px',
                      width: '100%',
                      display: '-webkit-box',
                      WebkitBoxAlign: 'center',
                      //WebkitBoxPack:'center'
                      borderBottom: '1px solid #EEF0F2',
                      background:
                        this.selectItem == i
                          ? '#e6f3fc'
                          : this.selectMoveItem == i
                          ? '#F6F9FB'
                          : null,
                      cursor: 'pointer',
                    }}
                  >
                    <img
                      style={{
                        width: '60px',
                        height: '60px',
                      }}
                      src={require('@/assets/mainlist/icon_folder.png')}
                    ></img>
                    <div
                      style={{
                        width: '338px',
                        marginLeft: '12px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      <span style={{ cursor: 'pointer' }}>{item}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div
              style={{
                display: 'flex',
                textAlign: 'center',
                marginTop: '20px',
                height: '70px',
              }}
            >
              <Button
                //type="primary"
                style={{
                  marginLeft: '21px',
                  borderRadius: '3px',
                  width: '118px',
                }}
                icon={
                  <img
                    style={{
                      marginBottom: '4px',
                      height: '14px',
                      width: '14px',
                      marginRight: '6px',
                    }}
                    src={require('@/assets/mainlist/icon_create_template.png')}
                  ></img>
                }
                // onClick={event => this.addUpdateDialog()}
              >
                创建文件夹
              </Button>

              <Button
                style={{
                  width: '90px',
                  height: '32',
                  marginLeft: '105px',
                  borderRadius: '3px',
                }}
                onClick={event => (FolderView.isWindowShow = false)}
              >
                取消
              </Button>

              <Button
                type="primary"
                style={{
                  width: '90px',
                  height: '32',
                  marginLeft: '16px',
                  borderRadius: '3px',
                }}
                //onClick={event => this.addUpdateSumbit()}
              >
                确定
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}

export default FolderView;
