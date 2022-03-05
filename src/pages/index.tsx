import 'reflect-metadata';
import React from 'react';
import { HotKeys } from 'react-hotkeys';
import FlexLayout, {
  Action,
  TabNode,
  Node,
  TabSetNode,
  BorderNode,
  Model,
} from 'flexlayout-react';
import LayoutHeader from './head';
import LayoutResourcePanel from '@/components/designres/respanelUI';
import Stage from '@/components/cwDesignUI/stage/stageUI';
import PageList from '@/components/cwDesignUI/pagelist/pagelistUI';
import { search } from '@/utils/locationSearch';
import { Provider, observer } from 'mobx-react';
import BaseProperty from '@/components/cwDesignUI/property/BaseProperty';
import '../styles/basiclayout.less';
import CWSubstance, {
  LayoutCfg,
} from '@/modelClasses/courseDetail/cwSubstance';
import ItemsTreeView from '@/components/cwDesignUI/itemstree/itemstreeUI';
import {
  winhotkeyMap,
  machotkeyMap,
  getGlobalHotkeyHandlers,
  initHotkeyConfig,
  getItemDesignHotkeyHandlers,
  getLogicDesignHotkeyHandlers,
  getStageHotkeyHandlers,
} from '@/configs/hotkeyConfigs';
import CourseCommander from '@/modelClasses/courseDetail/courseCommander';
import TypeMapHelper from '@/configs/typeMapHelper';
import TypeMapConfig from '@/configs/typeMapConfig';
import LogicDesignView from '@/components/cwDesignUI/logicView/logicDesignView';
import UIHelper from '@/utils/uiHelper';
import LoopWork from '@/modelClasses/courseDetail/toolbox/LoopWork';
import MouseHelper from '@/utils/mouseHelper';
import { Point2D } from '@/utils/Math2D';
import KeyHelper from '@/utils/keyHelper';
import EnvHelper from '@/utils/envHelper';
import { observable } from 'mobx';
import { PlayCoursePreiew } from './PlayCoursePreview';
import CacheHelper from '@/utils/cacheHelper';
import { LayoutFootDesgin } from './footdesgin';
import * as Sentry from '@sentry/browser';
import CWPage from '@/modelClasses/courseDetail/cwpage';
import '../styles/body.less';
import '@/styles/antoverride.less';
import ClipboardHelper from '@/utils/clipboardHelper';
import JSSDK from '@zm-fe/zm-jssdk';
import SearchComponent from '@/components/cwDesignUI/searchLocation/index';

JSSDK.setConfig({
  environment: process.env.NODE_ENV === 'production' ? 'prod' : 'fat',
  logLevel: process.env.NODE_ENV === 'production' ? 'error' : 'debug',
  // 如果你使用了router并且是history模式
  // 如果你使用了vue-router的hash模式，也是设置history
  history: true,
});

export const stores = {
  courseware: new CWSubstance(),
  commander: new CourseCommander(),
};

function onwheelfn(event) {
  if (event.ctrlKey || event.metaKey) {
    event.preventDefault();
  }
}
@observer
class BasicLayout extends React.Component<any, any> {
  private locationSearch: any;

  constructor(props) {
    super(props);
    stores.courseware.Commander = stores.commander;
    stores.commander.Courseware = stores.courseware;
  }
  //初始化
  init() {
    if (process.env.webServerName != 'local') {
      Sentry.init({
        dsn: 'https://91599ebcd7584e218c1f267982468486@in-log.zmlearn.com/20',
        environment: process.env.webServerName,
      });
    }

    this.locationSearch = search;
    //初始化调用 一次字体
    CacheHelper.GetFontLibrary();

    TypeMapConfig.BuildTypeMap();
    if (stores.courseware.Profile == null)
      stores.courseware.LoadData(this.locationSearch.cwId);
    //快捷键
    initHotkeyConfig();
    //将全局数据放入页面
    CWPage.stores = stores;

    //#region 事件消息收集和过滤

    document.onkeydown = e => {
      if (!KeyHelper.isKeyPressed(e.key)) {
        KeyHelper.onPressKey(e.key);
      }

      var usehotKey = false;
      if (KeyHelper.checkCtrlOrMeta(e)) {
        if (
          e.altKey ||
          e.shiftKey ||
          e.key == 's' ||
          e.key == 'f' ||
          e.key == 'r' ||
          e.key == '=' || //禁止放大
          e.key == '-' || //禁止缩小
          // e.key == 'c' ||
          // e.key == 'v' ||
          e.key == 'z' ||
          e.key == 'y' //||
          // e.key == 'x'
        )
          usehotKey = true;
      }
      if (usehotKey) e.preventDefault();
    };
    document.onkeyup = e => {
      KeyHelper.onReleaseKey(e.key);
    };
    document.oncontextmenu = e => {
      e.preventDefault();
    };
    document.onmousemove = e => {
      MouseHelper.MousePositionInWindow = new Point2D(e.clientX, e.clientY);
      KeyHelper.checkCtrlOrMetaKeyWhenMousemove(e);
    };
    document.onmousedown = e => {
      MouseHelper.onPressBtn(e.button);
    };
    document.onmouseup = e => {
      MouseHelper.onReleaseBtn(e.button);
    };

    //滚动鼠标滚轮时执行
    document.addEventListener('wheel', onwheelfn, { passive: false });
    document.addEventListener('mousewheel', onwheelfn, { passive: false });
    document.addEventListener('DOMMouseScroll', onwheelfn, { passive: false });

    //#region 标签页关闭事件监听

    window.onbeforeunload = stores.courseware.onTabClosing.bind(
      stores.courseware,
    );

    //#endregion

    //#endregion

    // LoopWork.Instance.setMission(this, this.focusUIRoot);
    this.focusUIRoot();

    //#region 剪贴板权限查询
    navigator.permissions
      .query({
        name: 'clipboard-read',
      } as any)
      .then(permissionStatus => {
        // permissionStatus.state 的值是 'granted'、'denied'、'prompt':
        console.log(`剪贴板权限：${permissionStatus.state}`);
        if (permissionStatus.state == 'denied')
          ClipboardHelper.clipboardPermission = false;
      });
    //#endregion
  }

  focusUIRoot() {
    if (
      document.activeElement == null ||
      document.activeElement == document.body
    )
      stores.commander?.CWUIRoot?.focus();
  }

  componentDidMount() {
    this.init();
    document.addEventListener('touchmove', ev => ev.preventDefault(), {
      passive: false,
    });
  }

  componentWillUnmount() {
    LoopWork.Instance.removeMission(this);
    LoopWork.Instance.stop();
  }

  factory(node: any) {
    var component = node.getComponent();
    if (component === 'elements') {
      return (
        <HotKeys
          style={{ width: '100%', height: '100%', background: 'transparent' }}
          handlers={{
            ...getGlobalHotkeyHandlers(stores.commander),
            ...getItemDesignHotkeyHandlers(stores.commander),
          }}
        >
          <div className="baselayout__panel">
            <ItemsTreeView />
          </div>
        </HotKeys>
      );
    } else if (component === 'property') {
      return (
        <HotKeys
          style={{ width: '100%', height: '100%', background: 'transparent' }}
          handlers={{ ...getGlobalHotkeyHandlers(stores.commander) }}
        >
          <div className="baselayout__panel">
            <BaseProperty />
          </div>
        </HotKeys>
      );
    } else if (component === 'logiclink') {
      return (
        <div className="baselayout__panel">
          <div style={{ background: 'red' }}></div>
        </div>
      );
    } else if (component === 'resource') {
      return (
        <HotKeys
          style={{ width: '100%', height: '100%', background: 'transparent' }}
          handlers={{ ...getGlobalHotkeyHandlers(stores.commander) }}
        >
          <div className="baselayout__panel">
            <LayoutResourcePanel />
          </div>
        </HotKeys>
      );
    } else if (component === 'stage') {
      return (
        <HotKeys
          style={{ width: '100%', height: '100%', background: 'transparent' }}
          handlers={{
            ...getGlobalHotkeyHandlers(stores.commander),
            ...getItemDesignHotkeyHandlers(stores.commander),
            ...getStageHotkeyHandlers(stores.commander),
          }}
        >
          <div className="baselayout__panel stagelayout__panel">
            <Stage />
          </div>
        </HotKeys>
      );
    } else if (component === 'logic') {
      return (
        <div
          className="baselayout__panel logiclayout__panel"
          tabIndex={-1}
          style={{
            position: 'absolute',
            left: '0px',
            top: '0px',
            right: '0px',
            bottom: '0px',
            overflow: 'hidden',
          }}
        >
          <LogicDesignView
            logicDesign={stores.courseware.SelectedPage?.LogicDesign}
          />
        </div>
      );
    } else if (component === 'pageList') {
      return (
        <HotKeys
          style={{ width: '100%', height: '100%', background: 'transparent' }}
          handlers={{ ...getGlobalHotkeyHandlers(stores.commander) }}
        >
          <div className="baselayout__panel">
            <PageList />
          </div>
        </HotKeys>
      );
    } else if (component === 'search') {
      return (
        <div className="baselayout__panel" style={{ overflow: 'hidden' }}>
          <SearchComponent />
        </div>
      );
    }
  }

  layoutModelChange(model: Model) {
    this.focusUIRoot();
    model.visitNodes((node: Node) => {
      if (node.getType() == 'tab' && node instanceof TabNode) {
        var p = node.getParent();
        if (
          p &&
          p instanceof TabSetNode &&
          p.isActive() &&
          node == p.getSelectedNode()
        ) {
          stores.commander.IsActiveLogicDesign = node.getName() == '逻辑';
          stores.commander.IsActiveStage = node.getName() == '设计';
        }
      }
    });
  }

  render() {
    var logicDesign = stores.commander.Courseware?.SelectedPage?.LogicDesign; //这里读一下防止切页面时不刷新逻辑视图

    return (
      <Provider {...stores}>
        <HotKeys
          keyMap={
            EnvHelper.getOsInfo().name == 'Mac' ? machotkeyMap : winhotkeyMap
          }
          handlers={{
            ...getGlobalHotkeyHandlers(stores.commander),
          }}
        >
          <div
            style={{ userSelect: 'none' }}
            ref={v => (stores.commander.CWUIRoot = v)}
            tabIndex={-1}
          >
            <HotKeys handlers={getGlobalHotkeyHandlers(stores.commander)}>
              <div className="baselayout__header">
                <LayoutHeader />
              </div>
            </HotKeys>
            <FlexLayout.Layout
              model={stores.commander.Courseware.LayoutModel}
              factory={this.factory.bind(this)}
              onModelChange={this.layoutModelChange.bind(this)}
            />
            <div className="baselayout__foot">
              <LayoutFootDesgin />
            </div>
          </div>
        </HotKeys>
      </Provider>
    );
  }
}

export default BasicLayout;
