import CWPage from './cwpage';
import CWResource from './cwResource';
import { Courseware } from '../courseware';
import { observable, computed, action, runInAction, reaction } from 'mobx';
import HttpService from '@/server/httpServer';
import { deserializeArray, classToPlain, serialize } from '@/class-transformer';
import CourseCommander from './courseCommander';
import TypeMapHelper from '@/configs/typeMapHelper';
import { message } from 'antd';
import FlexLayout, { Model } from 'flexlayout-react';
import CWCacheHelper from '@/utils/cwCacheHelper';
import WebSqlHelper from '@/utils/webSqlHelper';
import RUHelper from '@/redoundo/redoUndoHelper';
import LoopWork from './toolbox/LoopWork';
import StrCompressHelper from '@/utils/strCompressHelper';
import ActionManager from '@/redoundo/actionManager';
import CacheHelper from '@/utils/cacheHelper';
import ArrayHelper from '@/utils/arrayHelper';
import ObjHelper from '@/utils/objHelper';
import JSSDK from '@zm-fe/zm-jssdk';
import { CWResourceTypes } from './courseDetailenum';
import CwError, { ErrorEntity } from '@/modelClasses/courseDetail/cwError';

//视图是否显示默认配置
export class LayoutCfg {
  @observable
  isShowPages: boolean = true; //是否显示场景面板（页面）
  @observable
  isShowProps: boolean = true; //是否显示属性
  @observable
  isShowElements: boolean = true; //是否显示元素
  @observable
  isShowRes: boolean = true; //是否显示素材
  @observable
  isShowRuler: boolean = false; //是否显示标尺
  @observable
  isShowGrid: boolean = false; //是否显示网络
  @observable
  isShowSafeZone: boolean = true; //是否显示播放器遮盖
}

//课件详情区域排版
const getLayoutJson = (layoutCfg: LayoutCfg) => {
  return {
    global: {
      tabEnableClose: false,
      splitterSize: 6,
      tabEnableRename: false,
      tabSetEnableMaximize: true,
      tabSetTabStripHeight: 28,
      tabSetMinWidth: 120,
    },
    borders: [
      {
        type: 'border',
        location: 'left',
        size: 220,
        children: [],
      },
      {
        type: 'border',
        location: 'right',
        size: 220,
        children: [],
      },
    ],
    layout: {
      type: 'row',
      weight: 90,
      children: [
        layoutCfg.isShowPages
          ? {
              type: 'tabset',
              weight: 15,
              selected: 0,
              children: [
                {
                  type: 'tab',
                  name: '页面',
                  component: 'pageList',
                },
              ],
            }
          : {},
        layoutCfg.isShowElements
          ? {
              type: 'tabset',
              weight: 15,
              selected: 0,
              children: [
                {
                  type: 'tab',
                  name: '元素',
                  component: 'elements',
                },
              ],
            }
          : {},
        {
          type: 'tabset',
          weight: 80,
          selected: 0,
          enableDrop: false,
          children: [
            {
              type: 'tab',
              // enableDrag: false,
              name: '设计',
              component: 'stage',
            },
            {
              type: 'tab',
              // enableDrag: false,
              name: '逻辑',
              component: 'logic',
            },
          ],
        },
        {
          type: 'row',
          weight: 22,
          selected: 0,
          children: [
            layoutCfg.isShowProps
              ? {
                  type: 'tabset',
                  weight: 100,
                  children: [
                    {
                      type: 'tab',
                      name: '属性',
                      component: 'property',
                    },
                    {
                      type: 'tab',
                      name: '组件搜索',
                      component: 'search',
                    },
                  ],
                }
              : {},
            layoutCfg.isShowRes
              ? {
                  type: 'tabset',
                  weight: 100,
                  children: [
                    {
                      type: 'tab',
                      name: '资源',
                      component: 'resource',
                    },
                  ],
                }
              : {},
          ],
        },
      ],
    },
  };
};

export class SaveLog {
  key: number;
  save_time: Date;
  cwId: string;
  @observable
  desc: string;
  type: number;
  content: string;
}

//课件json压缩签名串
const zippedSign = 'zipped:';
//课件json是否压缩
const zipSaveContent = false;

export default class CWSubstance {
  constructor() {}

  //课件详情信息
  @observable
  Profile: Courseware;
  //视图默认配置
  @observable
  LayoutCfg: LayoutCfg = new LayoutCfg();
  //界面排版数据
  @observable
  LayoutModel: Model;
  layoutChanged = reaction(
    () => serialize(this.LayoutCfg),
    str => {
      this.LayoutModel = FlexLayout.Model.fromJson(
        getLayoutJson(this.LayoutCfg),
      );
    },
    {
      fireImmediately: true,
    },
  );
  //课件页面对象
  @observable
  Pages: Array<CWPage> = [];
  private pagesChanged = reaction(
    () => this.Pages?.map(p => p),
    pages => {
      var i = 1;
      this.Pages?.forEach(p => {
        p.Courseware = this;
        p.PageIndex = i++;
      });
    },
    { fireImmediately: true },
  );
  //课件元素对象
  @observable
  Library: Array<CWResource>;
  //课件分辨率
  @observable
  StageSize: { x: number; y: number } = { x: 1920, y: 1080 };
  //左上角控制设计、逻辑缩放的百分比值
  @observable
  StageScale: number = 0.5;
  //课件是否显示加载标识
  @observable
  public isLoading = false;
  //课件是否保存标识
  @observable
  public isSaving = false;

  //当前登录用户信息
  UserInfo: any;
  //课件操作命令对象
  Commander: CourseCommander;
  UpdateTime: Date;
  Fonts: Array<string>;
  CWType: Number;
  //课件存储json字符串信息（用来判断课件是否有做变更）
  public savedContent = null;

  //错误列表
  @observable
  errorList: Array<ErrorEntity> = new Array<ErrorEntity>();

  //#region 课件加载
  //课件初始化数据加载
  @action LoadData = async (cwId: string) => {
    CWCacheHelper.tryOpenCreateDb();
    if (cwId) {
      this.isLoading = true;

      var userInfo = await HttpService.getUserInfo();
      CacheHelper.UserInfo = userInfo;
      JSSDK.setDefaults({
        appId: '12519',
        appVersion: '0.0.0.1',
        userId: CacheHelper.UserInfo?.me.userId,
      });
      JSSDK.sendEvent({
        eventId: 'design_page_loaded',
        eventParam: { channelId: '', userId: CacheHelper.UserInfo?.me.userId },
      });
      var data = await HttpService.getCouresWareDetail(cwId);

      //#region 通过bu那动态键值对
      var list = [
        'SendMessage',
        'ReceiveMessage',
        'DifficultyLevel',
        'SingleParamCalc',
        'LanguageCode',
      ];
      if (data?.bu == 4) {
        list = [
          'SendMessageAI',
          'ReceiveMessage',
          'DifficultyLevel',
          'SingleParamCalc',
          'LanguageCode',
        ];
      }
      await CacheHelper.GetCategoryConfigList(list);
      //#endregion
      await CacheHelper.GetBuList(data?.bu ? data.bu : 2);
      runInAction(() => {
        if (userInfo && data && userInfo != 'loginFail') {
          this.UserInfo = userInfo;
          console.log('userInfo', userInfo);
          this.ReadContent(data, data?.gameResourceList);
        }

        this.isLoading = false;
      });
    }
  };

  //课件内容加载
  ReadContent(data: any, reslib: any[]) {
    this.stopAutoSave();
    this.Pages = [];
    this.Library = [];
    this.SelectedPage = null;
    this.Profile = data;
    //课件宽高赋值
    if (
      this.Profile.extendInfo?.stageWidth &&
      this.Profile.extendInfo?.stageHeight
    ) {
      this.StageSize = {
        x: this.Profile.extendInfo.stageWidth,
        y: this.Profile.extendInfo.stageHeight,
      };
    }
    //this.Profile.coursewareId = data.coursewareId;
    var originContent: string = data.coursewareContent;
    var realContent = originContent;
    if (originContent?.startsWith(zippedSign)) {
      realContent = StrCompressHelper.unzip(
        originContent.substr(zippedSign.length),
      );
    }
    var pages = deserializeArray(CWPage, realContent || '[{}]', {
      typeMaps: TypeMapHelper.CommonTypeMap,
    });
    reslib = reslib?.map(x => ObjHelper.ConvertObj(CWResource, x));
    pages?.forEach(x => {
      //x.Courseware = this;
      //初始化课件元素信息
      x.InitDetailsContent(reslib);
    });
    if (pages == null || pages.length == 0) {
      pages = [new CWPage()];
    }
    this.Pages = pages;
    this.Library = reslib;
    //默认选中第一个课件
    this.SelectedPage = this.Pages[0];
    ActionManager.Instance.Clear();
    this.isModifiedAfterLastAutoSave = false;

    this.savedContent = originContent;

    this.startAutoSave();
  }

  @action ReadContentFromData = async (cwInfo: string) => {
    if (cwInfo) {
      var data = JSON.parse(cwInfo);
      var resIds = data.resourceIds;
      var reslib = await HttpService.queryResByIds(resIds);
      runInAction(() => {
        this.ReadContent(data, reslib);
        //LayoutHeader.isShowCacheManagementView = false;
      });
    }
  };
  //#endregion

  //控制左上角控制设计、逻辑缩放
  @action
  SetStageScale(scale: number) {
    this.StageScale = scale;
  }

  //获取课件安全区域
  get Ratio() {
    var exInfo = this.Profile?.extendInfo;
    if (exInfo) {
      var exInfoObj: any = null;
      if (typeof exInfo == 'object') {
        exInfoObj = exInfo;
      }
      return String(exInfoObj?.ratio || '16:9');
    }
    return '16:9';
  }

  public get IsTemplateCW(): boolean {
    var cwprofile = this.Profile;
    var cwCode = cwprofile?.purposeVo['code'];
    return cwCode && cwCode == 'TEMPLATE';
  }

  //页面获取当前选中页
  public get SelectedPage(): CWPage {
    if (null == this.Pages || this.Pages.length == 0) return null;
    var result = this.SelectedPages.find(x => x.IsSelected);
    if (result == null) return this.Pages[0];
    return result;
  }

  //页面设置指定选中页
  public set SelectedPage(v: CWPage) {
    if (null != this.Pages && this.Pages.length > 0) {
      this.Pages.forEach(x => {
        if (x != v) x.IsSelected = false;
        else x.IsSelected = true;
      });
    }
  }

  _selectedPages: CWPage[] = [];
  public get SelectedPages(): CWPage[] {
    if (this.Pages == null || this.Pages.length == 0) return [];
    var allSelectedPages = this.Pages.filter(x => x.IsSelected) || [];
    var exsitSelectedPages = ArrayHelper.intersect(
      this._selectedPages,
      allSelectedPages,
    );
    var addSelectedPages = ArrayHelper.except(
      allSelectedPages,
      exsitSelectedPages,
    );
    if (
      !(
        addSelectedPages.length == 0 &&
        exsitSelectedPages.length == this._selectedPages.length
      )
    )
      this._selectedPages = [...exsitSelectedPages, ...addSelectedPages];

    return this._selectedPages;
  }

  GetCWTypeStr() {
    if (this.GetCWTypeStr) {
      if (this.Profile?.purposeVo && this.Profile.purposeVo.code) {
        if (this.Profile.purposeVo.code == 'ZMG_TEMPLATE') return 'template';
      }
      return 'courseware';
    }
  }

  //#region 导出

  //页面类对象转换为json对象
  @action GetPagesPlain(
    resLib: CWResource[],
    fontLib: string[],
    pages?: CWPage[],
  ) {
    if (!pages) pages = this.Pages;
    var pagesPlain = classToPlain(pages, {
      strategy: 'excludeAll',
      //enableCircularCheck: true
      typeMaps: TypeMapHelper.CommonTypeMap,
    });
    var p_index = 0;
    pages.forEach(x => {
      if (resLib) {
        var depReses = x.GetDependencyResources();
        if (depReses) resLib.push(...depReses);
      }
      if (fontLib) {
        var depFonts = x.GetDependencyFonts();
        if (depFonts) fontLib.push(...depFonts);
      }
      var map = new Map<string, number>();
      var i = 0;
      x.TotalEditItemList.forEach(eitem => map.set(eitem.Id, i++));
      x.TotalInvItems.forEach(invitem => map.set(invitem.Id, i++));
      pagesPlain[p_index++].IdMap = classToPlain(map);
    });
    return pagesPlain;
  }

  @action GetPageList() {
    var pages = [];
    if (this.Pages) {
      this.Pages.forEach(x => {
        let resLib = [],
          fontLib = [];
        if (resLib) {
          var depReses = x.GetDependencyResources();
          if (depReses) resLib.push(...depReses);
        }
        if (fontLib) {
          var depFonts = x.GetDependencyFonts();
          if (depFonts) fontLib.push(...depFonts);
        }
        pages.push({
          resLib: resLib,
          fontLib: fontLib,
          page: x,
        });
      });
    }
    return pages;
  }

  //课件获取保存信息
  getSaveInfo(getResObj: boolean = false, getExtendInfoAsObj: boolean = false) {
    var resLib: CWResource[] = [],
      fontLib: string[] = [];
    var pages = this.GetPagesPlain(resLib, fontLib);

    resLib = ArrayHelper.distinct(
      resLib,
      (x, y) => x.resourceId == y.resourceId,
    );
    fontLib = ArrayHelper.distinct(fontLib);
    var getResAsId = !getResObj;

    var fontResLib = fontLib
      .map(fname =>
        CacheHelper.FontList?.find(fres => fres.resourceName == fname),
      )
      .filter(x => x != null);
    resLib.push(...fontResLib);
    var resIds = resLib.map(x => x.resourceId);
    var updateObj = {
      coursewareId: this.Profile.coursewareId,
      coursewareName: this.Profile.coursewareName,
      coursewareContent: zipSaveContent
        ? zippedSign + StrCompressHelper.zip(serialize(pages))
        : serialize(pages),
      coursewareNum: this.Pages.length,
      resourceIds: getResAsId ? resIds : undefined,
      gameResourceList: getResAsId
        ? undefined
        : classToPlain(Array.from(resLib)),
      purposeVo: this.Profile.purposeVo,
      labelNames: this.Profile.labelNames,
      subTitlesStr: this.Profile.subTitlesStr,
      extendInfo: getExtendInfoAsObj
        ? this.Profile.extendInfo
        : this.Profile.extendInfo
        ? serialize(this.Profile.extendInfo)
        : null,
      coursewareVersion: 2,
      pageInfoList: (pages as CWPage[]).map(p => {
        return { pageUuid: p.Id, pageIndex: p.PageIndex };
      }),
    };
    return updateObj;
  }

  //课件保存
  @action SaveCourse = async () => {
    if (this.isLoading) return;
    if (this.isSaving) return;
    if (!window.navigator.onLine) {
      message.error('网络异常，请检查网络');
      return;
    }

    this.isSaving = true;
    try {
      var updateObj = this.getSaveInfo();
      if (updateObj.coursewareContent != this.savedContent) {
        //校验数据合法性
        this.errorList = [];
        var errorList = new CwError().Validate(updateObj);
        if (errorList.length > 0) {
          this.errorList = errorList;
          message.error('保存失败，点击右下角查看错误信息');
        } else {
          var saveTime = new Date();
          var contentStr = JSON.stringify({ ...this.Profile, ...updateObj });
          var compressed = StrCompressHelper.zip(contentStr);
          //var aaa = LZString.decompress(compressed);
          CWCacheHelper.addSaveLog(
            this.Profile.coursewareId,
            0,
            compressed,
            '',
            saveTime,
          );
          var saveResult = await HttpService.updateCourseWareDetail(updateObj);

          runInAction(() => {
            if (saveResult) {
              message.success('保存成功');
              this.savedContent = updateObj.coursewareContent;
              this.isModifiedAfterSave = false;
            } else message.error('保存失败');
          });
        }
      } else {
        message.info('课件未做更改');
      }
    } catch (err) {
      console.log(err);
    } finally {
      setTimeout((() => (this.isSaving = false)).bind(this), 600);
    }
  };

  //#endregion

  //#region 自动保存

  isModifiedAfterLastAutoSave = false;
  lastAutoSaveOrChangeTime = Date.now();
  autoSaveKey = {};

  private addModifiedListener() {
    RUHelper.Core.AddUndoBufferChangedListener(this.setModified, this);
  }

  private removeModifiedListener() {
    RUHelper.Core.RemoveUndoBufferChangedListener(this);
  }

  private preHisLength = 0;
  private setModified() {
    if (this.preHisLength != ActionManager.Instance.History.Length) {
      //清理历史不触发修改开关
      this.isModifiedAfterLastAutoSave = true;
      this.lastAutoSaveOrChangeTime = Date.now() + 1000;

      this.isModifiedAfterSave = true;
    }
    this.preHisLength = ActionManager.Instance.History.Length;
  }

  //开始自动保存
  startAutoSave() {
    this.addModifiedListener();
    LoopWork.Instance.setMission(
      this.autoSaveKey,
      this.tryToAutoSave.bind(this),
    );
  }

  //停止自动保存
  stopAutoSave() {
    this.removeModifiedListener();
    LoopWork.Instance.removeMission(this.autoSaveKey);
  }

  //课件自动保存
  private async tryToAutoSave() {
    var now = Date.now();
    if (
      this.isModifiedAfterLastAutoSave &&
      now - this.lastAutoSaveOrChangeTime > 60 * 10 * 1000
    ) {
      //有修改并和上一次自动保存相差一定时间才会自动保存
      this.isModifiedAfterLastAutoSave = false;
      this.lastAutoSaveOrChangeTime = Date.now() + 1000;

      var saveInfo = await this.getSaveInfo();
      if (saveInfo) {
        var contentStr = JSON.stringify({ ...this.Profile, ...saveInfo });
        var compressed = StrCompressHelper.zip(contentStr);
        CWCacheHelper.addSaveLog(
          saveInfo.coursewareId,
          1,
          compressed,
          '',
          new Date(now),
        );

        // message.info(`本地自动保存成功: ${new Date(now).toLocaleString()}`);
      }
    }
  }

  //#endregion

  //#region 关闭时查询是否保存

  isModifiedAfterSave = false;

  onTabClosing(e: BeforeUnloadEvent) {
    if (this.isModifiedAfterSave) return true;
  }

  //#endregion
}
