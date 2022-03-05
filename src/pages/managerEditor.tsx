import React from 'react';
import { observer } from 'mobx-react';
import { Menu, Button, Tooltip } from 'antd';
import {
  AppstoreOutlined,
  MailOutlined,
  FolderViewOutlined,
  ControlOutlined,
} from '@ant-design/icons';
import { backgroundClip } from 'html2canvas/dist/types/css/property-descriptors/background-clip';
import CoursePage from './coursePage/coursePage';
import { observable, action, runInAction } from 'mobx';
import ResourceList from './resourcelist';
import {
  CourseIcon,
  LoginOutIcon,
  ManagerIcon,
  ResourceIcon,
} from '@/utils/customIcon';
import HttpService from '@/server/httpServer';
import { display } from 'html2canvas/dist/types/css/property-descriptors/display';
import logo from '../assets/editlogo.png';
import headlogo from '../assets/touxiang.png';
import styles from '../styles/layouthead.less';
import CacheHelper from '@/utils/cacheHelper';
const { SubMenu } = Menu;
import * as Sentry from '@sentry/browser';
import '../styles/body.less';
import JSSDK from '@zm-fe/zm-jssdk';
import CategoryConfig from './categoryConfig';
import { BtnRadioView } from '@/components/controls/btnRadioView';
import { color } from 'html2canvas/dist/types/css/types/color';
import styled from 'styled-components';
import TemplatePage from './templatePage/templatePage';

@observer
class ManagerEditor extends React.Component<any, any> {
  componentDidMount() {
    this.page = <CategoryConfig />;
  }

  @observable
  page: any;
  changePage(event) {
    switch (event.key) {
      case 'categoryConfig':
        this.page = <CategoryConfig />;
        break;
      default:
        this.page = null;
    }
  }
  render() {
    return (
      <div style={{ width: '100%', height: '100%', position: 'absolute' }}>
        <div
          style={{
            top: '0px',
            bottom: '0px',
            left: '0px',
            width: '100px',
            position: 'absolute',
            boxShadow: '-2px 0px 12px 0px rgba(191, 192, 196, 0.26)',
          }}
        >
          {
            <Menu
              defaultSelectedKeys={['courselist']}
              defaultOpenKeys={['course']}
              onClick={event => this.changePage(event)}
              mode="inline"
            >
              {/* <SubMenu key="course" title="课件制作" icon={<ControlOutlined />}>
                            <Menu.Item key="courselist" icon={<AppstoreOutlined />}>
                                课件列表
                            </Menu.Item>
                            <Menu.Item key="filelist" icon={<FolderViewOutlined />}>
                                素材列表
                            </Menu.Item>
                        </SubMenu> */}
              {/* <Menu.Item key="manager" icon={<MailOutlined />}>
                            后台管理
                        </Menu.Item> */}
              <Menu.Item key="categoryConfig" icon={<MailOutlined />}>
                数据配置
              </Menu.Item>
            </Menu>
          }
        </div>
        <div
          style={{
            left: '100px',
            top: '0px',
            right: '0px',
            bottom: '0px',
            position: 'absolute',
            background: '#F6F9FB',
          }}
        >
          {this.page}
        </div>
      </div>
    );
  }
}

export default ManagerEditor;
