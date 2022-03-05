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

JSSDK.setConfig({
  environment: process.env.environment,
  logLevel: process.env.logLevel,
  // 如果你使用了router并且是history模式
  // 如果你使用了vue-router的hash模式，也是设置history
  history: true,
});

function setCookie(option) {
  option = option || {};
  //option 可设置属性：name value domain expires path secure SameSite
  console.log('option', option);
  option.expires = 'Session';
  var cookie = [];
  for (var key in option) {
    cookie.push(key + '=' + option[key]);
  }
  document.cookie = cookie.join('; ');
}

enum MainType {
  course = 0,
  formwork = 1,
  resource = 2,
  manager = 3,
}

const Exitbtn = styled.div`
  div {
    background: #f6f8fb;
  }
  :hover div {
    background: #e4eaf2;
  }
`;

@observer
class MainView extends React.Component<any, any> {
  // mainType: MainType = MainType.course;

  @observable
  private _mainType: MainType;

  public get mainType(): MainType {
    return this._mainType;
  }
  public set mainType(v: MainType) {
    this._mainType = v;
    this.changePage();
  }

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    if (window['loginToken'] && window['loginToken'].token) {
      var token = window['loginToken'].token;
      if (process.env.environment == 'fat') {
        console.log(token);
        setCookie({
          FATSSO_TOKEN_KEY: token,
          domain: '.zmlearn.com',
          path: '/',
          SameSite: 'None',
        });
      } else if (process.env.environment == 'uat')
        setCookie({
          UATSSO_TOKEN_KEY: token,
          domain: '.zmops.cc',
          path: '/',
          SameSite: 'None',
        });
      else if (process.env.environment == 'prod')
        setCookie({
          SSO_TOKEN_KEY: token,
          domain: '.zmlearn.com',
          path: '/',
          SameSite: 'None',
        });
    }

    document.addEventListener('touchmove', ev => ev.preventDefault(), {
      passive: false,
    });
    if (process.env.webServerName != 'local') {
      Sentry.init({
        dsn: 'https://91599ebcd7584e218c1f267982468486@in-log.zmlearn.com/20',
        environment: process.env.webServerName,
      });
    }
    this.LoadUserInfo();
    console.log(process.env.environment);
  }

  @action LoadUserInfo = async () => {
    var data = await HttpService.getUserInfo();
    runInAction(() => {
      if (data) {
        CacheHelper.UserInfo = data;
        this.mainType = MainType.course;
        CacheHelper.GetCategoryConfigList(['LanguageCode', 'CaptionLanguage']);
        JSSDK.setDefaults({
          appId: '12519',
          appVersion: '0.0.0.1',
          userId: CacheHelper.UserInfo?.me.userId,
        });
        JSSDK.sendEvent({
          eventId: 'page_inited',
          eventParam: {
            channelId: '',
            userId: CacheHelper.UserInfo?.me.userId,
          },
        });
      }
    });
  };

  @observable
  page: any;
  changePage() {
    switch (this.mainType) {
      case MainType.course:
        this.page = <CoursePage />;
        break;
      case MainType.formwork:
        this.page = <TemplatePage />;
        break;
      case MainType.resource:
        this.page = <ResourceList />;
        break;
      case MainType.manager:
        this.page = null;
        if (window['loginToken'] && window['loginToken'].token) {
          var ws = new WebSocket('ws://localhost:' + process.env.port);
          ws.onopen = function(evt) {
            ws.send(
              JSON.stringify({
                webReqType: 3,
              }),
            );
          };
          ws.onmessage = function(event) {
            ws.close();
          };
        } else {
          window.open(process.env.managerUrl);
        }
        break;
      // case 'categoryConfig':
      //   this.page = <CategoryConfig />;
      //   break;
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
          <div style={{ left: '17px', top: '30px', position: 'absolute' }}>
            <img
              style={{ objectFit: 'scale-down', height: '19px' }}
              src={logo}
              alt=""
            />
            <div
              style={{
                transform: 'scale(0.8)',
                color: '#B7B7B7',
                textAlign: 'center',
                marginTop: '2px',
              }}
            >
              {window['loginToken'] ? window['loginToken'].version : ''}
            </div>
          </div>

          <div style={{ left: '25px', top: '128px', position: 'absolute' }}>
            <img
              style={{ objectFit: 'scale-down', height: '50px' }}
              src={headlogo}
              alt=""
            />
            <div
              style={{
                color: '#5A6C8D',
                fontSize: '12px',
                textAlign: 'center',
                marginTop: '10px',
              }}
            >
              {CacheHelper.UserInfo?.me.personName}
            </div>
          </div>

          <div style={{ left: '20px', top: '245px', position: 'relative' }}>
            <BtnRadioView
              content="项目"
              deafultTag={MainType.course}
              selectedTag={this.mainType}
              icon={color => <CourseIcon svgColor={[color]} />}
              onRadioclick={value => {
                this.mainType = MainType.course;
              }}
              deafultprop={{
                bgColor: 'transparent',
                color: '#B7C4DE',
              }}
              selectedprop={{
                bgColor: '#F6F9FB',
                color: '#1D91FC',
              }}
            />
            <div style={{ marginTop: 22 }}>
              <BtnRadioView
                content="模板"
                deafultTag={MainType.formwork}
                selectedTag={this.mainType}
                icon={color => <ResourceIcon svgColor={[color]} />}
                onRadioclick={value => {
                  this.mainType = MainType.formwork;
                }}
                deafultprop={{
                  bgColor: 'transparent',
                  color: '#B7C4DE',
                }}
                selectedprop={{
                  bgColor: '#F6F9FB',
                  color: '#1D91FC',
                }}
              />
            </div>
            <div style={{ marginTop: 22 }}>
              <BtnRadioView
                content="素材"
                deafultTag={MainType.resource}
                selectedTag={this.mainType}
                icon={color => <ResourceIcon svgColor={[color]} />}
                onRadioclick={value => {
                  this.mainType = MainType.resource;
                }}
                deafultprop={{
                  bgColor: 'transparent',
                  color: '#B7C4DE',
                }}
                selectedprop={{
                  bgColor: '#F6F9FB',
                  color: '#1D91FC',
                }}
              />
            </div>
            <div style={{ marginTop: 22 }}>
              <BtnRadioView
                content="后台"
                deafultTag={MainType.manager}
                selectedTag={this.mainType}
                icon={color => <ManagerIcon svgColor={[color]} />}
                onRadioclick={value => {
                  this.mainType = MainType.manager;
                }}
                deafultprop={{
                  bgColor: 'transparent',
                  color: '#B7C4DE',
                }}
                selectedprop={{
                  bgColor: '#F6F9FB',
                  color: '#1D91FC',
                }}
              />
            </div>
          </div>

          <Exitbtn
            style={{
              bottom: '20px',
              width: '70px',
              height: '32px',
              left: '15px',
              position: 'absolute',
              textAlign: 'center',
              fontSize: '12px',
              userSelect: 'none',
              color: '#B7B7B7',
            }}
          >
            <div
              style={{
                borderRadius: '6px',
                lineHeight: '32px',
                cursor: 'pointer',
              }}
              onClick={event => {
                if (window['loginToken'] && window['loginToken'].token) {
                  var ws = new WebSocket('ws://localhost:' + process.env.port);
                  ws.onopen = function(evt) {
                    ws.send(
                      JSON.stringify({
                        webReqType: 1,
                        Data: '',
                      }),
                    );
                  };
                  ws.onmessage = function(event) {
                    ws.close();
                  };
                } else {
                  HttpService.HttpRequest('/logout', null, 'GET', '');
                  window.location.href = process.env.loginUrl;
                }
              }}
            >
              退出
            </div>
          </Exitbtn>
          {/* <Menu
            defaultSelectedKeys={['courselist']}
            defaultOpenKeys={['course']}
            onClick={event => this.changePage(event)}
            mode="inline"
          >
            <SubMenu key="course" title="课件制作" icon={<ControlOutlined />}>
              <Menu.Item key="courselist" icon={<AppstoreOutlined />}>
                课件列表
              </Menu.Item>
              <Menu.Item key="filelist" icon={<FolderViewOutlined />}>
                素材列表
              </Menu.Item>
            </SubMenu>
            <Menu.Item key="manager" icon={<MailOutlined />}>
              后台管理
            </Menu.Item>
            <Menu.Item key="categoryConfig" icon={<MailOutlined />}>
              数据配置
            </Menu.Item>
          </Menu> */}
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

export default MainView;
