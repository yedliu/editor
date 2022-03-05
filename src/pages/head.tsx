import React, { CSSProperties } from 'react';
import { Menu, Dropdown, InputNumber, Popover, Button, Modal } from 'antd';

import logo from '../assets/editlogo.png';
import styles from '../styles/layouthead.less';

import { windowNames, helpLineNames, LayoutCfg } from '../models/layout';
import { inject, observer } from 'mobx-react';
import CWSubstance from '@/modelClasses/courseDetail/cwSubstance';
import ActionManager from '@/redoundo/actionManager';
import CourseCommander from '@/modelClasses/courseDetail/courseCommander';
import { CaretRightOutlined } from '@ant-design/icons';
import { observable } from 'mobx';
import LocalCacheView from '@/components/cwDesignUI/cachelog/localCacheView';
import UploadVoiceView from '@/components/cwDesignUI/uploadVoice/uploadVoiceView';
import { PlayCoursePreiew } from './PlayCoursePreview';
import ResUploadView from '@/components/controls/ResUpload/resUploadView';

const { SubMenu } = Menu;

@inject('courseware', 'commander')
@observer
class LayoutHeader extends React.Component<any, any> {
  @observable
  static isShowCacheManagementView = false;

  static get IsShowCacheManagementView() {
    return LayoutHeader.isShowCacheManagementView;
  }

  static set IsShowCacheManagementView(v) {
    LayoutHeader.isShowCacheManagementView = v;
  }

  @observable
  static isShowUploadVoiceView = false;

  static get IsShowUploadVoiceView() {
    return LayoutHeader.isShowUploadVoiceView;
  }

  static set IsShowUploadVoiceView(v) {
    LayoutHeader.isShowUploadVoiceView = v;
  }

  render() {
    let courseware = this.props.courseware as CWSubstance;
    let commander = this.props.commander as CourseCommander;
    let lcfg = courseware.LayoutCfg;

    const { StageScale } = courseware;

    let hiddenStyle = { visibility: 'hidden' } as CSSProperties;
    let showStyle = { display: 'inline' } as CSSProperties;
    //设置菜单项
    let menu1 = (
      <Menu>
        <Menu.Item
          className={styles.menuitem}
          onClick={() => courseware.SaveCourse()}
        >
          保存<div className={styles.hotkeyinfo}>Ctrl+S</div>
        </Menu.Item>

        <Menu.Item
          className={styles.menuitem}
          onClick={() => (LayoutHeader.isShowCacheManagementView = true)}
        >
          本地缓存管理
        </Menu.Item>
        <Modal
          title="本地缓存管理"
          style={{ userSelect: 'none' }}
          visible={LayoutHeader.isShowCacheManagementView}
          width="800px"
          footer={null}
          destroyOnClose={true}
          onCancel={() => {
            LayoutHeader.isShowCacheManagementView = false;
          }}
        >
          <LocalCacheView />
        </Modal>
        <Menu.Item className={styles.menuitem}>返回</Menu.Item>
      </Menu>
    );

    let menu2 = (
      <Menu>
        <SubMenu
          className={styles.menuitem}
          title="对齐"
          disabled={courseware.SelectedPage?.SelectedItems?.length < 2}
        >
          <Menu.Item
            className={styles.menuitem}
            onClick={() => commander.ElementAlign('LeftAlign')}
          >
            左对齐<div className={styles.hotkeyinfo}>Ctrl+Alt+L</div>
          </Menu.Item>
          <Menu.Item
            className={styles.menuitem}
            onClick={() => commander.ElementAlign('HorizontalAlign')}
          >
            左右居中<div className={styles.hotkeyinfo}>Ctrl+Alt+C</div>
          </Menu.Item>
          <Menu.Item
            className={styles.menuitem}
            onClick={() => commander.ElementAlign('RightAlign')}
          >
            右对齐<div className={styles.hotkeyinfo}>Ctrl+Alt+R</div>
          </Menu.Item>
          <Menu.Item
            className={styles.menuitem}
            onClick={() => commander.ElementAlign('TopAlign')}
          >
            顶端对齐<div className={styles.hotkeyinfo}>Ctrl+Alt+T</div>
          </Menu.Item>
          <Menu.Item
            className={styles.menuitem}
            onClick={() => commander.ElementAlign('VerticalAlign')}
          >
            上下居中<div className={styles.hotkeyinfo}>Ctrl+Alt+M</div>
          </Menu.Item>
          <Menu.Item
            className={styles.menuitem}
            onClick={() => commander.ElementAlign('BottomAlign')}
          >
            底端对齐<div className={styles.hotkeyinfo}>Ctrl+Alt+B</div>
          </Menu.Item>
          <Menu.Divider />
          <Menu.Item
            className={styles.menuitem}
            disabled={courseware.SelectedPage?.SelectedItems?.length < 3}
            onClick={() => commander.ElementAlign('Traverse')}
          >
            横向分布<div className={styles.hotkeyinfo}>Ctrl+Alt+H</div>
          </Menu.Item>
          <Menu.Item
            className={styles.menuitem}
            disabled={courseware.SelectedPage?.SelectedItems?.length < 3}
            onClick={() => commander.ElementAlign('Endwise')}
          >
            纵向分布<div className={styles.hotkeyinfo}>Ctrl+Alt+U</div>
          </Menu.Item>
        </SubMenu>
        <Menu.Divider />
        <Menu.Item
          className={styles.menuitem}
          onClick={() => ActionManager.Instance.Undo()}
        >
          撤销<div className={styles.hotkeyinfo}>Ctrl+Z</div>
        </Menu.Item>
        <Menu.Item
          className={styles.menuitem}
          onClick={() => ActionManager.Instance.Redo()}
        >
          重做<div className={styles.hotkeyinfo}>Ctrl+Y</div>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item
          className={styles.menuitem}
          style={
            !commander.SelectedItems
              ? {
                  pointerEvents: 'none',
                  color: '#CCCCCC',
                }
              : {}
          }
          onClick={() => commander.ExportToElementsBox()}
        >
          复制<div className={styles.hotkeyinfo}>Ctrl+C</div>
        </Menu.Item>
        <Menu.Item
          className={styles.menuitem}
          style={
            !commander.SelectedItems
              ? {
                  pointerEvents: 'none',
                  color: '#CCCCCC',
                }
              : {}
          }
          onClick={() => commander.CutItems()}
        >
          剪切<div className={styles.hotkeyinfo}>Ctrl+X</div>
        </Menu.Item>
        <Menu.Item
          className={styles.menuitem}
          // style={
          //   !commander.ItemsCopyboard
          //     ? {
          //         pointerEvents: 'none',
          //         color: '#CCCCCC',
          //       }
          //     : {}
          // }
          onClick={() => commander.PasteItems()}
        >
          {' '}
          粘贴<div className={styles.hotkeyinfo}>Ctrl+V</div>
        </Menu.Item>
        <Menu.Item
          className={styles.menuitem}
          // style={
          //   !commander.ItemsCopyboard
          //     ? {
          //         pointerEvents: 'none',
          //         color: '#CCCCCC',
          //       }
          //     : {}
          // }
          onClick={() => {
            commander.ImportElementsBox(
              commander.SelectedPage,
              //  commander.ItemsCopyboard,
            );
          }}
        >
          带逻辑粘贴<div className={styles.hotkeyinfo}>Ctrl+Shift+V</div>
        </Menu.Item>
        <Menu.Item
          className={styles.menuitem}
          style={
            !commander.SelectedItems
              ? {
                  pointerEvents: 'none',
                  color: '#CCCCCC',
                }
              : {}
          }
          onClick={() => commander.DeleteSelectedItem()}
        >
          删除<div className={styles.hotkeyinfo}>Delete</div>
        </Menu.Item>
        <Menu.Item
          className={styles.menuitem}
          style={
            !commander.SelectedItems
              ? {
                  pointerEvents: 'none',
                  color: '#CCCCCC',
                }
              : {}
          }
          onClick={() => commander.DeleteSelectedItemsAndLogic()}
        >
          删除元素逻辑<div className={styles.hotkeyinfo}>Shift+Delete</div>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item
          className={styles.menuitem}
          onClick={() => commander.CombineItems()}
        >
          组合<div className={styles.hotkeyinfo}>Ctrl+F</div>
        </Menu.Item>
        <Menu.Item
          className={styles.menuitem}
          onClick={() => commander.SplitCombinedItem()}
        >
          取消组合<div className={styles.hotkeyinfo}>Ctrl+R</div>
        </Menu.Item>
        {/* <Menu.Divider />
        <Menu.Item className={styles.menuitem}>
          导入元素模板<div className={styles.hotkeyinfo}>Ctrl+I</div>
        </Menu.Item> */}
      </Menu>
    );

    let menu3 = (
      <Menu>
        <Menu.Item
          className={styles.menuitem}
          onClick={() => {
            lcfg.isShowRuler = !lcfg.isShowRuler;
          }}
        >
          <span style={lcfg.isShowRuler ? showStyle : hiddenStyle}>√</span>
          显示标尺
        </Menu.Item>
        <Menu.Item
          className={styles.menuitem}
          onClick={() => {
            lcfg.isShowGrid = !lcfg.isShowGrid;
          }}
        >
          <span style={lcfg.isShowGrid ? showStyle : hiddenStyle}>√</span>
          显示网格
        </Menu.Item>
        <Menu.Item
          className={styles.menuitem}
          onClick={() => {
            lcfg.isShowPages = !lcfg.isShowPages;
          }}
        >
          <span style={lcfg.isShowPages ? showStyle : hiddenStyle}>√</span>
          显示场景面板
        </Menu.Item>
        <Menu.Item
          className={styles.menuitem}
          onClick={() => {
            lcfg.isShowRes = !lcfg.isShowRes;
          }}
        >
          <span style={lcfg.isShowRes ? showStyle : hiddenStyle}>√</span>
          显示素材面板
        </Menu.Item>
        <Menu.Item
          className={styles.menuitem}
          onClick={() => {
            lcfg.isShowProps = !lcfg.isShowProps;
          }}
        >
          <span style={lcfg.isShowProps ? showStyle : hiddenStyle}>√</span>{' '}
          显示属性面板
        </Menu.Item>
        <Menu.Item
          className={styles.menuitem}
          onClick={() => {
            lcfg.isShowElements = !lcfg.isShowElements;
          }}
        >
          <span style={lcfg.isShowElements ? showStyle : hiddenStyle}>√</span>{' '}
          显示元素栏
        </Menu.Item>
        <Menu.Item
          className={styles.menuitem}
          onClick={() => {
            lcfg.isShowSafeZone = !lcfg.isShowSafeZone;
          }}
        >
          <span style={lcfg.isShowSafeZone ? showStyle : hiddenStyle}>√</span>
          显示播放器遮盖
        </Menu.Item>
        <Menu.Item
          className={styles.menuitem}
          onClick={() => {
            commander.LogicTemplteShow = !commander.LogicTemplteShow;
          }}
        >
          <span style={commander.LogicTemplteShow ? showStyle : hiddenStyle}>
            √
          </span>
          逻辑组件折叠开关
        </Menu.Item>
      </Menu>
    );

    let menu4 = (
      <Menu>
        <Menu.Item
          className={styles.menuitem}
          onClick={() => (ResUploadView.isShowUploadView = true)}
        >
          上传资源
        </Menu.Item>
        <ResUploadView />
        <Menu.Item className={styles.menuitem}>缩小元素比例</Menu.Item>
        <Menu.Item
          className={styles.menuitem}
          onClick={() => (LayoutHeader.isShowUploadVoiceView = true)}
        >
          第三方语音
        </Menu.Item>
        <Modal
          title="第三方语音"
          style={{ userSelect: 'none' }}
          visible={LayoutHeader.isShowUploadVoiceView}
          width="820px"
          footer={null}
          destroyOnClose={true}
          onCancel={() => {
            LayoutHeader.isShowUploadVoiceView = false;
          }}
        >
          <UploadVoiceView
            onClose={() => {
              LayoutHeader.isShowUploadVoiceView = false;
            }}
          />
        </Modal>
      </Menu>
    );

    let menu5 = (
      <Menu>
        <Menu.Item
          className={styles.menuitem}
          onClick={() => {
            window.open(
              'http://hdkj-test.zmtalent.com/zmg_editor/zmg-pro-docs/',
            );
          }}
        >
          在线帮助
        </Menu.Item>
        {/* <Menu.Item className={styles.menuitem}>字体安装</Menu.Item> */}
      </Menu>
    );

    return (
      <div>
        <img className={styles.logo} src={logo} alt="" />
        <div className={styles.menusarea}>
          <Dropdown overlay={menu1} trigger={['click']}>
            <div className={styles.menutitle}>
              <a
                className="ant-dropdown-link"
                onClick={e => e.preventDefault()}
              >
                文件
              </a>
            </div>
          </Dropdown>
          <Dropdown overlay={menu2} trigger={['click']}>
            <div className={styles.menutitle}>
              <a
                className="ant-dropdown-link"
                onClick={e => e.preventDefault()}
              >
                编辑
              </a>
            </div>
          </Dropdown>
          <Dropdown overlay={menu3} trigger={['click']}>
            <div className={styles.menutitle}>
              <a
                className="ant-dropdown-link"
                onClick={e => e.preventDefault()}
              >
                视图
              </a>
            </div>
          </Dropdown>
          <Dropdown overlay={menu4} trigger={['click']}>
            <div className={styles.menutitle}>
              <a
                className="ant-dropdown-link"
                onClick={e => e.preventDefault()}
              >
                素材
              </a>
            </div>
          </Dropdown>
          <Dropdown overlay={menu5} trigger={['click']}>
            <div className={styles.menutitle}>
              <a
                className="ant-dropdown-link"
                onClick={e => e.preventDefault()}
              >
                帮助
              </a>
            </div>
          </Dropdown>
        </div>
        <div
          style={{
            position: 'absolute',
            top: '10px',
            width: '100%',
            height: '25px',
            background: 'transparent',
            pointerEvents: 'none',
            display: '-webkit-box',
            WebkitBoxAlign: 'center',
            WebkitBoxPack: 'center',
          }}
        >
          <Popover content={courseware?.Profile?.coursewareName}>
            <div
              style={{
                width: '300px',
                height: '20px',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                userSelect: 'none',
                textAlign: 'center',
                pointerEvents: 'auto',
              }}
            >
              {courseware?.Profile?.purpose}-
              {courseware?.Profile?.coursewareName}
            </div>
          </Popover>
        </div>
        <div style={{ position: 'absolute', bottom: '10px', left: '20px' }}>
          {commander.IsActiveStage ? (
            <InputNumber
              size="small"
              defaultValue={50}
              min={12.5}
              max={500}
              step={10}
              value={Number.parseInt((StageScale * 100).toFixed(0))}
              formatter={value => `${value}%`}
              parser={value => value.replace('%', '')}
              onChange={value =>
                courseware.SetStageScale(
                  Math.max(12.5, Math.min(500, Number(value))) / 100.0,
                )
              }
            />
          ) : commander.IsActiveLogicDesign ? (
            <InputNumber
              size="small"
              defaultValue={100}
              min={12.5}
              max={150}
              step={10}
              value={Number.parseInt(
                (
                  Number(courseware.Commander.SelectedPage?.LogicDesign.Scale) *
                  100
                ).toFixed(0),
              )}
              formatter={value => `${value}%`}
              parser={value => value.replace('%', '')}
              onChange={value => {
                if (commander?.SelectedPage?.LogicDesign)
                  commander.SelectedPage.LogicDesign.Scale =
                    Math.max(12.5, Math.min(150, Number(value))) / 100.0;
              }}
            />
          ) : null}
        </div>
        <div style={{ position: 'absolute', bottom: '10px', left: '220px' }}>
          <Button
            size="small"
            icon={<CaretRightOutlined />}
            style={{ color: 'rgb(29,145,252)' }}
            onClick={() => commander.PreviewCourse()}
          >
            预览
          </Button>
          <PlayCoursePreiew />
        </div>
        <div style={{ position: 'absolute', bottom: '10px', left: '360px' }}>
          <Button.Group size="small">
            <Button onClick={() => commander.CombineItems()}>
              <svg width="18" height="10" viewBox="0,0,1024,1024">
                <path
                  fill="#666666"
                  d="M682.666667 682.666667v204.8a136.533333 136.533333 0 0 1-136.533334 136.533333H136.533333a136.533333 136.533333 0 0 1-136.533333-136.533333V477.866667a136.533333 136.533333 0 0 1 136.533333-136.533334h204.8V136.533333a136.533333 136.533333 0 0 1 136.533334-136.533333h409.6a136.533333 136.533333 0 0 1 136.533333 136.533333v409.6a136.533333 136.533333 0 0 1-136.533333 136.533334h-204.8z"
                />
                <path
                  fill="#D8D8D8"
                  d="M614.4 887.466667V614.4h273.066667a68.266667 68.266667 0 0 0 68.266666-68.266667V136.533333a68.266667 68.266667 0 0 0-68.266666-68.266666H477.866667a68.266667 68.266667 0 0 0-68.266667 68.266666v273.066667H136.533333a68.266667 68.266667 0 0 0-68.266666 68.266667v409.6a68.266667 68.266667 0 0 0 68.266666 68.266666h409.6a68.266667 68.266667 0 0 0 68.266667-68.266666z"
                />
              </svg>
              组合
            </Button>
            <Button onClick={() => commander.SplitCombinedItem()}>
              <svg width="18" height="10" viewBox="0,0,1024,1024">
                <path
                  fill="#666666"
                  d="M799.670857 0h292.571429a146.285714 146.285714 0 0 1 146.285714 146.285714v292.571429a146.285714 146.285714 0 0 1-146.285714 146.285714h-292.571429a146.285714 146.285714 0 0 1-146.285714-146.285714V146.285714a146.285714 146.285714 0 0 1 146.285714-146.285714z m-585.142857 438.857143h292.571429a146.285714 146.285714 0 0 1 146.285714 146.285714v292.571429a146.285714 146.285714 0 0 1-146.285714 146.285714h-292.571429a146.285714 146.285714 0 0 1-146.285714-146.285714V585.142857a146.285714 146.285714 0 0 1 146.285714-146.285714z"
                />
                <path
                  fill="#D8D8D8"
                  d="M799.670857 73.142857a73.142857 73.142857 0 0 0-73.142857 73.142857v292.571429a73.142857 73.142857 0 0 0 73.142857 73.142857h292.571429a73.142857 73.142857 0 0 0 73.142857-73.142857V146.285714a73.142857 73.142857 0 0 0-73.142857-73.142857h-292.571429zM214.528 512a73.142857 73.142857 0 0 0-73.142857 73.142857v292.571429a73.142857 73.142857 0 0 0 73.142857 73.142857h292.571429a73.142857 73.142857 0 0 0 73.142857-73.142857V585.142857a73.142857 73.142857 0 0 0-73.142857-73.142857h-292.571429z"
                />
              </svg>
              拆分
            </Button>
          </Button.Group>
        </div>

        <div
          style={{
            pointerEvents:
              courseware.SelectedPage?.SelectedItems?.length < 2
                ? 'none'
                : 'visible',
            width: '172px',
            height: '24px',
            position: 'absolute',
            bottom: '10px',
            left: '550px',
            border: '1px solid #D8D8D8',
            borderRadius: '5px',
          }}
        >
          <Popover content="左对齐(Ctrl+Alt+L)" mouseEnterDelay={1}>
            <div
              className="divhoverStyle"
              style={{
                marginLeft: '6px',
                width: '22px',
                height: '22px',
                float: 'left',
              }}
            >
              <svg
                onClick={x =>
                  courseware.SelectedPage?.SelectedItems?.length < 2
                    ? null
                    : commander.ElementAlign('LeftAlign')
                }
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="2921"
                width="22"
                height="22"
              >
                <path
                  d="M186.181818 186.181818v651.636364h46.545455V186.181818z"
                  fill={
                    courseware.SelectedPage?.SelectedItems?.length < 2
                      ? '#cccccc'
                      : '#666666'
                  }
                  p-id="2922"
                ></path>
                <path
                  d="M357.469091 257.396364h372.363636a69.818182 69.818182 0 0 1 69.818182 69.818181v93.09091a69.818182 69.818182 0 0 1-69.818182 69.818181h-372.363636a69.818182 69.818182 0 0 1-69.818182-69.818181v-93.09091a69.818182 69.818182 0 0 1 69.818182-69.818181zM357.469091 536.669091h232.727273a69.818182 69.818182 0 0 1 69.818181 69.818182v93.090909a69.818182 69.818182 0 0 1-69.818181 69.818182h-232.727273a69.818182 69.818182 0 0 1-69.818182-69.818182v-93.090909a69.818182 69.818182 0 0 1 69.818182-69.818182z"
                  fill="#D8D8D8"
                  p-id="2923"
                ></path>
                <path
                  d="M357.469091 257.396364h372.363636a69.818182 69.818182 0 0 1 69.818182 69.818181v93.09091a69.818182 69.818182 0 0 1-69.818182 69.818181h-372.363636a69.818182 69.818182 0 0 1-69.818182-69.818181v-93.09091a69.818182 69.818182 0 0 1 69.818182-69.818181z m0 46.545454a23.272727 23.272727 0 0 0-23.272727 23.272727v93.09091a23.272727 23.272727 0 0 0 23.272727 23.272727h372.363636a23.272727 23.272727 0 0 0 23.272728-23.272727v-93.09091a23.272727 23.272727 0 0 0-23.272728-23.272727h-372.363636zM357.469091 536.669091h232.727273a69.818182 69.818182 0 0 1 69.818181 69.818182v93.090909a69.818182 69.818182 0 0 1-69.818181 69.818182h-232.727273a69.818182 69.818182 0 0 1-69.818182-69.818182v-93.090909a69.818182 69.818182 0 0 1 69.818182-69.818182z m0 46.545454a23.272727 23.272727 0 0 0-23.272727 23.272728v93.090909a23.272727 23.272727 0 0 0 23.272727 23.272727h232.727273a23.272727 23.272727 0 0 0 23.272727-23.272727v-93.090909a23.272727 23.272727 0 0 0-23.272727-23.272728h-232.727273z"
                  fill={
                    courseware.SelectedPage?.SelectedItems?.length < 2
                      ? '#cccccc'
                      : '#666666'
                  }
                  p-id="2924"
                ></path>
              </svg>
            </div>
          </Popover>

          <Popover content="左右居中(Ctrl+Alt+C)" mouseEnterDelay={1}>
            <div
              className="divhoverStyle"
              style={{
                marginLeft: '5px',
                width: '22px',
                height: '22px',
                float: 'left',
              }}
            >
              <svg
                onClick={x =>
                  courseware.SelectedPage?.SelectedItems?.length < 2
                    ? null
                    : commander.ElementAlign('HorizontalAlign')
                }
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="3063"
                width="22"
                height="22"
              >
                <path
                  d="M488.727273 186.181818v628.363637h46.545454V186.181818z"
                  fill={
                    courseware.SelectedPage?.SelectedItems?.length < 2
                      ? '#cccccc'
                      : '#787878'
                  }
                  p-id="3064"
                ></path>
                <path
                  d="M395.636364 565.573818a23.272727 23.272727 0 0 0-23.272728 23.272727v93.09091a23.272727 23.272727 0 0 0 23.272728 23.272727h232.727272a23.272727 23.272727 0 0 0 23.272728-23.272727v-93.09091a23.272727 23.272727 0 0 0-23.272728-23.272727h-232.727272zM325.818182 257.396364h342.528c35.048727 0 80.523636 44.869818 80.523636 68.049454v55.854546c0 23.133091-45.474909 62.324364-80.523636 62.324363H325.818182c-35.048727 0-59.485091-39.191273-59.485091-62.370909v-55.854545c0-23.133091 24.436364-67.956364 59.485091-67.956364z"
                  fill="#D8D8D8"
                  p-id="3065"
                ></path>
                <path
                  d="M326.842182 237.009455h372.363636a69.818182 69.818182 0 0 1 69.818182 69.818181v93.090909a69.818182 69.818182 0 0 1-69.818182 69.818182h-372.363636a69.818182 69.818182 0 0 1-69.818182-69.818182v-93.090909a69.818182 69.818182 0 0 1 69.818182-69.818181z m0 46.545454a23.272727 23.272727 0 0 0-23.272727 23.272727v93.090909a23.272727 23.272727 0 0 0 23.272727 23.272728h372.363636a23.272727 23.272727 0 0 0 23.272727-23.272728v-93.090909a23.272727 23.272727 0 0 0-23.272727-23.272727h-372.363636zM395.636364 519.028364h232.727272a69.818182 69.818182 0 0 1 69.818182 69.818181v93.09091a69.818182 69.818182 0 0 1-69.818182 69.818181h-232.727272a69.818182 69.818182 0 0 1-69.818182-69.818181v-93.09091a69.818182 69.818182 0 0 1 69.818182-69.818181z m0 46.545454a23.272727 23.272727 0 0 0-23.272728 23.272727v93.09091a23.272727 23.272727 0 0 0 23.272728 23.272727h232.727272a23.272727 23.272727 0 0 0 23.272728-23.272727v-93.09091a23.272727 23.272727 0 0 0-23.272728-23.272727h-232.727272z"
                  fill={
                    courseware.SelectedPage?.SelectedItems?.length < 2
                      ? '#cccccc'
                      : '#787878'
                  }
                  p-id="3066"
                ></path>
              </svg>
            </div>
          </Popover>

          <Popover content="右对齐(Ctrl+Alt+R)" mouseEnterDelay={1}>
            <div
              className="divhoverStyle"
              style={{
                marginLeft: '5px',
                width: '22px',
                height: '22px',
                float: 'left',
              }}
            >
              <svg
                onClick={x =>
                  courseware.SelectedPage?.SelectedItems?.length < 2
                    ? null
                    : commander.ElementAlign('RightAlign')
                }
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="3205"
                width="22"
                height="22"
              >
                <path
                  d="M837.818182 186.181818v651.636364h-46.545455V186.181818z"
                  fill={
                    courseware.SelectedPage?.SelectedItems?.length < 2
                      ? '#cccccc'
                      : '#787878'
                  }
                  p-id="3206"
                ></path>
                <path
                  d="M666.530909 303.941818a23.272727 23.272727 0 0 1 23.272727 23.272727v93.09091a23.272727 23.272727 0 0 1-23.272727 23.272727h-372.363636a23.272727 23.272727 0 0 1-23.272728-23.272727v-93.09091a23.272727 23.272727 0 0 1 23.272728-23.272727h372.363636zM666.530909 583.214545a23.272727 23.272727 0 0 1 23.272727 23.272728v93.090909a23.272727 23.272727 0 0 1-23.272727 23.272727h-232.727273a23.272727 23.272727 0 0 1-23.272727-23.272727v-93.090909a23.272727 23.272727 0 0 1 23.272727-23.272728h232.727273z"
                  fill="#D8D8D8"
                  p-id="3207"
                ></path>
                <path
                  d="M666.530909 257.396364h-372.363636a69.818182 69.818182 0 0 0-69.818182 69.818181v93.09091a69.818182 69.818182 0 0 0 69.818182 69.818181h372.363636a69.818182 69.818182 0 0 0 69.818182-69.818181v-93.09091a69.818182 69.818182 0 0 0-69.818182-69.818181z m0 46.545454a23.272727 23.272727 0 0 1 23.272727 23.272727v93.09091a23.272727 23.272727 0 0 1-23.272727 23.272727h-372.363636a23.272727 23.272727 0 0 1-23.272728-23.272727v-93.09091a23.272727 23.272727 0 0 1 23.272728-23.272727h372.363636zM666.530909 536.669091h-232.727273a69.818182 69.818182 0 0 0-69.818181 69.818182v93.090909a69.818182 69.818182 0 0 0 69.818181 69.818182h232.727273a69.818182 69.818182 0 0 0 69.818182-69.818182v-93.090909a69.818182 69.818182 0 0 0-69.818182-69.818182z m0 46.545454a23.272727 23.272727 0 0 1 23.272727 23.272728v93.090909a23.272727 23.272727 0 0 1-23.272727 23.272727h-232.727273a23.272727 23.272727 0 0 1-23.272727-23.272727v-93.090909a23.272727 23.272727 0 0 1 23.272727-23.272728h232.727273z"
                  fill={
                    courseware.SelectedPage?.SelectedItems?.length < 2
                      ? '#cccccc'
                      : '#787878'
                  }
                  p-id="3208"
                ></path>
              </svg>
            </div>
          </Popover>

          <Popover content="上下居中(Ctrl+Alt+M)" mouseEnterDelay={1}>
            <div
              className="divhoverStyle"
              style={{
                marginLeft: '5px',
                width: '22px',
                height: '22px',
                float: 'left',
              }}
            >
              <svg
                onClick={x =>
                  courseware.SelectedPage?.SelectedItems?.length < 2
                    ? null
                    : commander.ElementAlign('VerticalAlign')
                }
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="3347"
                width="22"
                height="22"
              >
                <path
                  d="M186.181818 535.272727h651.636364v-46.545454H186.181818z"
                  fill={
                    courseware.SelectedPage?.SelectedItems?.length < 2
                      ? '#cccccc'
                      : '#787878'
                  }
                  p-id="3348"
                ></path>
                <path
                  d="M743.424 372.270545a23.272727 23.272727 0 0 0-23.272727-23.272727h-130.653091a23.272727 23.272727 0 0 0-23.272727 23.272727v232.727273a23.272727 23.272727 0 0 0 23.272727 23.272727h130.653091a23.272727 23.272727 0 0 0 23.272727-23.272727v-232.727273zM466.897455 302.498909a23.272727 23.272727 0 0 0-23.272728-23.272727H313.111273a23.272727 23.272727 0 0 0-23.272728 23.272727v418.909091a23.272727 23.272727 0 0 0 23.272728 23.272727h130.513454a23.272727 23.272727 0 0 0 23.272728-23.272727v-418.909091z"
                  fill="#D8D8D8"
                  p-id="3349"
                ></path>
                <path
                  d="M495.243636 302.545455v418.90909a69.818182 69.818182 0 0 1-69.818181 69.818182h-93.09091a69.818182 69.818182 0 0 1-69.818181-69.818182v-418.90909A69.818182 69.818182 0 0 1 332.334545 232.727273h93.09091a69.818182 69.818182 0 0 1 69.818181 69.818182z m-46.545454 0a23.272727 23.272727 0 0 0-23.272727-23.272728h-93.09091a23.272727 23.272727 0 0 0-23.272727 23.272728v418.90909a23.272727 23.272727 0 0 0 23.272727 23.272728h93.09091a23.272727 23.272727 0 0 0 23.272727-23.272728v-418.90909zM726.481455 372.363636a23.272727 23.272727 0 0 0-23.272728-23.272727h-93.090909a23.272727 23.272727 0 0 0-23.272727 23.272727v232.727273a23.272727 23.272727 0 0 0 23.272727 23.272727h93.090909a23.272727 23.272727 0 0 0 23.272728-23.272727V372.363636z m46.545454 0v232.727273a69.818182 69.818182 0 0 1-69.818182 69.818182h-93.090909a69.818182 69.818182 0 0 1-69.818182-69.818182V372.363636a69.818182 69.818182 0 0 1 69.818182-69.818181h93.090909a69.818182 69.818182 0 0 1 69.818182 69.818181z"
                  fill={
                    courseware.SelectedPage?.SelectedItems?.length < 2
                      ? '#cccccc'
                      : '#787878'
                  }
                  p-id="3350"
                ></path>
              </svg>
            </div>
          </Popover>

          <Popover content="顶端对齐(Ctrl+Alt+T)" mouseEnterDelay={1}>
            <div
              className="divhoverStyle"
              style={{
                marginLeft: '5px',
                width: '22px',
                height: '22px',
                float: 'left',
              }}
            >
              <svg
                onClick={x =>
                  courseware.SelectedPage?.SelectedItems?.length < 2
                    ? null
                    : commander.ElementAlign('TopAlign')
                }
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="3489"
                width="22"
                height="22"
              >
                <path
                  d="M186.181818 186.181818h651.636364v46.545455H186.181818z"
                  fill={
                    courseware.SelectedPage?.SelectedItems?.length < 2
                      ? '#cccccc'
                      : '#787878'
                  }
                  p-id="3490"
                ></path>
                <path
                  d="M303.941818 357.469091a23.272727 23.272727 0 0 1 23.272727-23.272727h93.09091a23.272727 23.272727 0 0 1 23.272727 23.272727v372.363636a23.272727 23.272727 0 0 1-23.272727 23.272728h-93.09091a23.272727 23.272727 0 0 1-23.272727-23.272728v-372.363636zM583.214545 357.469091a23.272727 23.272727 0 0 1 23.272728-23.272727h93.090909a23.272727 23.272727 0 0 1 23.272727 23.272727v232.727273a23.272727 23.272727 0 0 1-23.272727 23.272727h-93.090909a23.272727 23.272727 0 0 1-23.272728-23.272727v-232.727273z"
                  fill="#D8D8D8"
                  p-id="3491"
                ></path>
                <path
                  d="M257.396364 357.469091v372.363636a69.818182 69.818182 0 0 0 69.818181 69.818182h93.09091a69.818182 69.818182 0 0 0 69.818181-69.818182v-372.363636a69.818182 69.818182 0 0 0-69.818181-69.818182h-93.09091a69.818182 69.818182 0 0 0-69.818181 69.818182z m46.545454 0a23.272727 23.272727 0 0 1 23.272727-23.272727h93.09091a23.272727 23.272727 0 0 1 23.272727 23.272727v372.363636a23.272727 23.272727 0 0 1-23.272727 23.272728h-93.09091a23.272727 23.272727 0 0 1-23.272727-23.272728v-372.363636zM536.669091 357.469091v232.727273a69.818182 69.818182 0 0 0 69.818182 69.818181h93.090909a69.818182 69.818182 0 0 0 69.818182-69.818181v-232.727273a69.818182 69.818182 0 0 0-69.818182-69.818182h-93.090909a69.818182 69.818182 0 0 0-69.818182 69.818182z m46.545454 0a23.272727 23.272727 0 0 1 23.272728-23.272727h93.090909a23.272727 23.272727 0 0 1 23.272727 23.272727v232.727273a23.272727 23.272727 0 0 1-23.272727 23.272727h-93.090909a23.272727 23.272727 0 0 1-23.272728-23.272727v-232.727273z"
                  fill={
                    courseware.SelectedPage?.SelectedItems?.length < 2
                      ? '#cccccc'
                      : '#787878'
                  }
                  p-id="3492"
                ></path>
              </svg>
            </div>
          </Popover>

          <Popover content="底端对齐(Ctrl+Alt+B)" mouseEnterDelay={1}>
            <div
              className="divhoverStyle"
              style={{
                marginLeft: '5px',
                width: '22px',
                height: '22px',
                float: 'left',
              }}
            >
              <svg
                onClick={x =>
                  courseware.SelectedPage?.SelectedItems?.length < 2
                    ? null
                    : commander.ElementAlign('BottomAlign')
                }
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="3631"
                width="22"
                height="22"
              >
                <path
                  d="M186.181818 837.818182h651.636364v-46.545455H186.181818z"
                  fill={
                    courseware.SelectedPage?.SelectedItems?.length < 2
                      ? '#cccccc'
                      : '#787878'
                  }
                  p-id="3632"
                ></path>
                <path
                  d="M303.941818 666.530909a23.272727 23.272727 0 0 0 23.272727 23.272727h93.09091a23.272727 23.272727 0 0 0 23.272727-23.272727v-372.363636a23.272727 23.272727 0 0 0-23.272727-23.272728h-93.09091a23.272727 23.272727 0 0 0-23.272727 23.272728v372.363636zM583.214545 666.530909a23.272727 23.272727 0 0 0 23.272728 23.272727h93.090909a23.272727 23.272727 0 0 0 23.272727-23.272727v-232.727273a23.272727 23.272727 0 0 0-23.272727-23.272727h-93.090909a23.272727 23.272727 0 0 0-23.272728 23.272727v232.727273z"
                  fill="#D8D8D8"
                  p-id="3633"
                ></path>
                <path
                  d="M257.396364 666.530909v-372.363636a69.818182 69.818182 0 0 1 69.818181-69.818182h93.09091a69.818182 69.818182 0 0 1 69.818181 69.818182v372.363636a69.818182 69.818182 0 0 1-69.818181 69.818182h-93.09091a69.818182 69.818182 0 0 1-69.818181-69.818182z m46.545454 0a23.272727 23.272727 0 0 0 23.272727 23.272727h93.09091a23.272727 23.272727 0 0 0 23.272727-23.272727v-372.363636a23.272727 23.272727 0 0 0-23.272727-23.272728h-93.09091a23.272727 23.272727 0 0 0-23.272727 23.272728v372.363636zM536.669091 666.530909v-232.727273a69.818182 69.818182 0 0 1 69.818182-69.818181h93.090909a69.818182 69.818182 0 0 1 69.818182 69.818181v232.727273a69.818182 69.818182 0 0 1-69.818182 69.818182h-93.090909a69.818182 69.818182 0 0 1-69.818182-69.818182z m46.545454 0a23.272727 23.272727 0 0 0 23.272728 23.272727h93.090909a23.272727 23.272727 0 0 0 23.272727-23.272727v-232.727273a23.272727 23.272727 0 0 0-23.272727-23.272727h-93.090909a23.272727 23.272727 0 0 0-23.272728 23.272727v232.727273z"
                  fill={
                    courseware.SelectedPage?.SelectedItems?.length < 2
                      ? '#cccccc'
                      : '#787878'
                  }
                  p-id="3634"
                ></path>
              </svg>
            </div>
          </Popover>
        </div>

        <div
          style={{
            pointerEvents:
              courseware.SelectedPage?.SelectedItems?.length < 3
                ? 'none'
                : 'visible',
            width: '70px',
            height: '24px',
            position: 'absolute',
            bottom: '10px',
            left: '750px',
            border: '1px solid #D8D8D8',
            borderRadius: '5px',
          }}
        >
          <Popover content="横向分布(Ctrl+Shift+H)" mouseEnterDelay={1}>
            <div
              className="divhoverStyle"
              style={{
                marginLeft: '10px',
                marginTop: '0px',
                width: '22px',
                height: '22px',
                float: 'left',
              }}
            >
              <svg
                onClick={x =>
                  courseware.SelectedPage?.SelectedItems?.length < 3
                    ? null
                    : commander.ElementAlign('Traverse')
                }
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="3773"
                width="22"
                height="22"
              >
                <path
                  d="M861.090909 837.818182V186.181818h-46.545454v651.636364zM209.454545 837.818182V186.181818h-46.545454v651.636364z"
                  fill={
                    courseware.SelectedPage?.SelectedItems?.length < 3
                      ? '#cccccc'
                      : '#5c5c5c'
                  }
                  p-id="3774"
                ></path>
                <path
                  d="M605.090909 349.090909a23.272727 23.272727 0 0 0-23.272727-23.272727H437.713455a23.272727 23.272727 0 0 0-23.272728 23.272727v328.610909a23.272727 23.272727 0 0 0 23.272728 23.272727H581.818182a23.272727 23.272727 0 0 0 23.272727-23.272727V349.090909z"
                  fill="#D8D8D8"
                  p-id="3775"
                ></path>
                <path
                  d="M397.870545 677.701818v-325.818182a69.818182 69.818182 0 0 1 69.818182-69.818181h93.090909a69.818182 69.818182 0 0 1 69.818182 69.818181v325.818182a69.818182 69.818182 0 0 1-69.818182 69.818182h-93.090909a69.818182 69.818182 0 0 1-69.818182-69.818182z m46.545455 0a23.272727 23.272727 0 0 0 23.272727 23.272727h93.090909a23.272727 23.272727 0 0 0 23.272728-23.272727v-325.818182a23.272727 23.272727 0 0 0-23.272728-23.272727h-93.090909a23.272727 23.272727 0 0 0-23.272727 23.272727v325.818182z"
                  fill={
                    courseware.SelectedPage?.SelectedItems?.length < 3
                      ? '#cccccc'
                      : '#5c5c5c'
                  }
                  p-id="3776"
                ></path>
              </svg>
            </div>
          </Popover>

          <Popover content="纵向分布(Ctrl+Shift+U)" mouseEnterDelay={1}>
            <div
              className="divhoverStyle"
              style={{
                marginLeft: '5px',
                marginTop: '0px',
                width: '22px',
                height: '22px',
                float: 'left',
              }}
            >
              <svg
                onClick={x =>
                  courseware.SelectedPage?.SelectedItems?.length < 3
                    ? null
                    : commander.ElementAlign('Endwise')
                }
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="3915"
                width="22"
                height="22"
              >
                <path
                  d="M186.181818 861.090909h651.636364v-46.545454H186.181818zM186.181818 209.454545h651.636364v-46.545454H186.181818z"
                  fill={
                    courseware.SelectedPage?.SelectedItems?.length < 3
                      ? '#cccccc'
                      : '#4a4a4a'
                  }
                  p-id="3916"
                ></path>
                <path
                  d="M323.025455 418.909091a23.272727 23.272727 0 0 0-23.272728 23.272727v141.963637a23.272727 23.272727 0 0 0 23.272728 23.272727h351.883636a23.272727 23.272727 0 0 0 23.272727-23.272727V442.181818a23.272727 23.272727 0 0 0-23.272727-23.272727H323.025455z"
                  fill="#D8D8D8"
                  p-id="3917"
                ></path>
                <path
                  d="M346.298182 397.870545h325.818182a69.818182 69.818182 0 0 1 69.818181 69.818182v93.090909a69.818182 69.818182 0 0 1-69.818181 69.818182h-325.818182a69.818182 69.818182 0 0 1-69.818182-69.818182v-93.090909a69.818182 69.818182 0 0 1 69.818182-69.818182z m0 46.545455a23.272727 23.272727 0 0 0-23.272727 23.272727v93.090909a23.272727 23.272727 0 0 0 23.272727 23.272728h325.818182a23.272727 23.272727 0 0 0 23.272727-23.272728v-93.090909a23.272727 23.272727 0 0 0-23.272727-23.272727h-325.818182z"
                  fill={
                    courseware.SelectedPage?.SelectedItems?.length < 3
                      ? '#cccccc'
                      : '#4a4a4a'
                  }
                  p-id="3918"
                ></path>
              </svg>
            </div>
          </Popover>
        </div>

        <div
          style={{
            width: '90px',
            height: '24px',
            position: 'absolute',
            bottom: '10px',
            left: '850px',
            border: '1px solid #D8D8D8',
            borderRadius: '5px',
            pointerEvents:
              courseware.SelectedPage?.SelectedItems?.length >= 1
                ? 'visible'
                : 'none',
          }}
        >
          <Popover content="水平对齐(Ctrl+Alt+E)" mouseEnterDelay={1}>
            <div
              className="divhoverStyle"
              style={{
                marginLeft: '5px',
                width: '22px',
                height: '22px',
                float: 'left',
              }}
            >
              <svg
                onClick={x =>
                  courseware.SelectedPage?.SelectedItems?.length >= 1
                    ? commander.ElementAlign('HorizontalEquidistanceAlign')
                    : null
                }
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                style={{}}
                width="22"
                height="22"
              >
                <path
                  d="M384 192m60 0l136 0q60 0 60 60l0 520q0 60-60 60l-136 0q-60 0-60-60l0-520q0-60 60-60Z"
                  fill={
                    courseware.SelectedPage?.SelectedItems?.length >= 1
                      ? '#787878'
                      : '#cccccc'
                  }
                  p-id="46442"
                  data-spm-anchor-id="a313x.7781069.0.i36"
                ></path>
                <path
                  d="M64 512c0-21.333 12.19-32 36.571-32H283.43c24.38 0 36.571 10.667 36.571 32s-12.19 32-36.571 32H100.57C76.191 544 64 533.333 64 512zM704 512c0-21.333 12.19-32 36.571-32H923.43c24.38 0 36.571 10.667 36.571 32s-12.19 32-36.571 32H740.57C716.191 544 704 533.333 704 512z"
                  fill={
                    courseware.SelectedPage?.SelectedItems?.length >= 1
                      ? '#787878'
                      : '#cccccc'
                  }
                  p-id="46443"
                ></path>
              </svg>
            </div>
          </Popover>

          <Popover content="垂直对齐(Ctrl+Alt+G)" mouseEnterDelay={1}>
            <div
              className="divhoverStyle"
              style={{
                marginLeft: '5px',
                transform: 'rotate(90deg)',
                width: '22px',
                height: '22px',
                float: 'left',
              }}
            >
              <svg
                onClick={x =>
                  courseware.SelectedPage?.SelectedItems?.length >= 1
                    ? commander.ElementAlign('VerticalEquidistanceAlign')
                    : null
                }
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                style={{}}
                width="22"
                height="22"
              >
                <path
                  d="M384 192m60 0l136 0q60 0 60 60l0 520q0 60-60 60l-136 0q-60 0-60-60l0-520q0-60 60-60Z"
                  fill={
                    courseware.SelectedPage?.SelectedItems?.length >= 1
                      ? '#787878'
                      : '#cccccc'
                  }
                  p-id="46442"
                  data-spm-anchor-id="a313x.7781069.0.i36"
                ></path>
                <path
                  d="M64 512c0-21.333 12.19-32 36.571-32H283.43c24.38 0 36.571 10.667 36.571 32s-12.19 32-36.571 32H100.57C76.191 544 64 533.333 64 512zM704 512c0-21.333 12.19-32 36.571-32H923.43c24.38 0 36.571 10.667 36.571 32s-12.19 32-36.571 32H740.57C716.191 544 704 533.333 704 512z"
                  fill={
                    courseware.SelectedPage?.SelectedItems?.length >= 1
                      ? '#787878'
                      : '#cccccc'
                  }
                  p-id="46443"
                ></path>
              </svg>
            </div>
          </Popover>

          <Popover content="居中对齐(Ctrl+Alt+O)" mouseEnterDelay={1}>
            <div
              className="divhoverStyle"
              style={{
                float: 'left',
                marginLeft: '5px',
                marginTop: '2px',
                width: '22px',
                height: '18px',
              }}
            >
              <svg
                style={{}}
                onClick={x =>
                  courseware.SelectedPage?.SelectedItems?.length >= 1
                    ? commander.ElementAlign('CenterAlign')
                    : null
                }
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="19331"
                width="22"
                height="18"
              >
                <path
                  d="M51.28588 0.035815a48.606674 48.606674 0 0 0-36.455005 14.709915A47.967113 47.967113 0 0 0 0.12096 51.200735a50.525359 50.525359 0 0 0 14.709915 37.094568 47.327551 47.327551 0 0 0 35.815444 15.349476H972.254441a47.327551 47.327551 0 0 0 35.815444-15.349476A49.885797 49.885797 0 0 0 1023.419361 51.200735a48.606674 48.606674 0 0 0-14.709914-36.455005 47.967113 47.967113 0 0 0-36.455006-14.709915zM204.78064 307.025336a48.606674 48.606674 0 0 0-36.455005 12.79123 47.967113 47.967113 0 0 0-14.709915 36.455005 50.525359 50.525359 0 0 0 14.709915 37.094567 47.327551 47.327551 0 0 0 35.815444 15.349476h613.97904a47.327551 47.327551 0 0 0 35.815444-15.349476 49.885797 49.885797 0 0 0 14.709915-37.094567 50.525359 50.525359 0 0 0-51.16492-51.16492zM51.28588 612.735733a47.327551 47.327551 0 0 0-35.815444 15.349476 49.885797 49.885797 0 0 0-15.349476 37.094567 48.606674 48.606674 0 0 0 14.709915 38.37369 47.967113 47.967113 0 0 0 36.455005 14.709915h920.968561a48.606674 48.606674 0 0 0 36.455006-14.709915 47.967113 47.967113 0 0 0 14.709914-38.37369 50.525359 50.525359 0 0 0-14.709914-37.094567 47.327551 47.327551 0 0 0-35.815445-15.349476zM204.78064 920.364815a47.327551 47.327551 0 0 0-35.815444 15.349476 49.885797 49.885797 0 0 0-14.709914 37.094567 50.525359 50.525359 0 0 0 51.16492 51.16492h613.97904a48.606674 48.606674 0 0 0 36.455006-14.709915 47.967113 47.967113 0 0 0 14.709914-36.455005 50.525359 50.525359 0 0 0-14.709914-37.094567 47.327551 47.327551 0 0 0-35.815444-15.349476z"
                  fill={
                    courseware.SelectedPage?.SelectedItems?.length >= 1
                      ? '#787878'
                      : '#cccccc'
                  }
                  p-id="19332"
                ></path>
              </svg>
            </div>
          </Popover>
        </div>
      </div>
    );
  }
}

export default LayoutHeader;
