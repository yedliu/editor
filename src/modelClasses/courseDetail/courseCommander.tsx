import CWSubstance from './cwSubstance';
import { computed, action, observable, runInAction } from 'mobx';
import RUHelper from '@/redoundo/redoUndoHelper';
import CWPage from './cwpage';
import CWElement from './cwElement';
import { from } from 'linq-to-typescript';
import { message } from 'antd';
import CombinedEditItem from './editItemViewModels/combinedEditItem';
import ElementsCopyBox from './toolbox/elementsCopyBox';
import CWResource from './cwResource';
import { Vector2D, Rect2D } from '@/utils/Math2D';
import ObjHelper from '@/utils/objHelper';
import TypeMapHelper from '@/configs/typeMapHelper';
import { observer, Provider } from 'mobx-react';
import InvokableBase from './InvokableBase';
import ActionManager from '@/redoundo/actionManager';
import { PlayCoursePreiew } from '@/pages/PlayCoursePreview';
import ArrayHelper from '@/utils/arrayHelper';
import copy from 'copy-to-clipboard';
import pako from 'pako';
import StrCompressHelper from '@/utils/strCompressHelper';
import { plainToClass, serialize, deserialize } from '@/class-transformer';
import HttpService from '@/server/httpServer';
import CacheHelper from '@/utils/cacheHelper';
import ClipboardHelper from '@/utils/clipboardHelper';
import ReactDOM from 'react-dom';
import React from 'react';
import StageCanvas from '@/components/cwDesignUI/stage/stageCanvasUI';
import html2canvas from 'html2canvas';
import md5 from 'md5';
import UpLoadFileHelper, { ResFile } from '@/utils/uploadFileHelper';
import { CWResourceTypes } from './courseDetailenum';
import IdHelper from '@/utils/idHelper';
import FreeScrollViewer from '@/components/controls/freeScrollViewer';

export default class CourseCommander {
  constructor() {}

  Courseware: CWSubstance;

  //#region UI结点与状态

  public CWUIRoot: HTMLElement;

  public StageUIRoot: HTMLElement;
  public LogicViewUIRoot: HTMLElement;

  public ScrollviewRoot: FreeScrollViewer;

  @observable
  public IsActiveStage: boolean = true;
  @observable
  public IsActiveLogicDesign: boolean = false;
  //#endregion

  //#region 属性映射

  public get SelectedPage() {
    return this.Courseware?.SelectedPage;
  }

  @computed
  public get SelectedPages() {
    return this.Courseware?.SelectedPages;
  }

  public get SelectedItem() {
    return this.SelectedPage?.SelectedItem;
  }

  public get SelectedItems() {
    return this.SelectedPage?.SelectedItems;
  }

  // 逻辑组件折叠开关
  @observable
  public LogicTemplteShow: boolean = false;

  //#endregion

  //#region 操作UI

  FocusRootUI = () => {
    this.CWUIRoot?.focus();
  };

  openUrl = url => {
    if (url) {
      const w = window.open('about:blank');
      w.location.href = url;
    }
  };

  //#endregion

  //#region  对课件的操作

  Undo() {
    RUHelper.Core.Undo();
  }

  Redo() {
    RUHelper.Core.Redo();
  }

  //#endregion

  //#region 预览
  PreviewCourse() {
    PlayCoursePreiew.playHeight = 720;
    var profile = this.Courseware.Profile;
    var mainUrl = process.env.prevUrl;
    var userId = this.Courseware.UserInfo?.me?.userId;
    var currentPageIndex = this.Courseware.SelectedPage?.PageIndex;
    if (!currentPageIndex) currentPageIndex = 0;
    else currentPageIndex -= 1;
    var url = `${mainUrl}?pagenum=${currentPageIndex}&editorPreview=7&coursewareId=${
      profile.coursewareId
    }&checkFlag=true&userId=${userId}&buType=${
      profile.bu
    }&rand=${Math.random()}`;
    PlayCoursePreiew.playConfig = [];
    //练习作业(多页)
    if (
      this.Courseware.Profile.purposeVo.code &&
      this.Courseware.Profile.purposeVo.code == 'PRACTICE_MULTI_PAGE'
    ) {
      var homeworkjson = {
        tkyun: CacheHelper.UserInfo.userToken,
        homeworkurl: url + '&isEidtExercises=true',
        coursewareId: profile.coursewareId,
        userId: userId,
        bu: profile.bu,
        content: this.Courseware.getSaveInfo(true, true),
      };
      var homeworkurl = `${process.env.kidsHomeWorkUrl}?mode=1`;
      PlayCoursePreiew.playConfig.push(
        homeworkurl,
        this.Courseware.Profile.coursewareName,
        homeworkjson,
      );
      PlayCoursePreiew.playWidth = 1540;
      PlayCoursePreiew.playHeight = 720;
    }
    //视频AI课件
    else if (
      this.Courseware.Profile.purposeVo.code &&
      this.Courseware.Profile.purposeVo.code == 'VIDEO_AI'
    ) {
      var prevVideoAIUrl = `${
        process.env.prevVideoAIUrl
      }&pagenum=${currentPageIndex}&editorPreview=1&coursewareId=${
        profile.coursewareId
      }&checkFlag=true&userId=${userId}&buType=${profile.bu}&tkyun=${
        CacheHelper.UserInfo.userToken
      }&rand=${Math.random()}`;

      PlayCoursePreiew.isplayCourse = true;
      PlayCoursePreiew.playConfig = [];
      PlayCoursePreiew.playConfig.push(
        prevVideoAIUrl,
        this.Courseware.Profile.coursewareName,
        this.Courseware.getSaveInfo(true, true),
      );
      PlayCoursePreiew.playHeight = 720;
      PlayCoursePreiew.playWidth = 1600;
    }
    //多分支课件
    else if (
      this.Courseware.Profile.purposeVo.code &&
      this.Courseware.Profile.purposeVo.code == 'MULTI_BRANCH'
    ) {
      var prevVoiceClassUrl = `${
        process.env.prevVoiceClassUrl
      }&pagenum=${currentPageIndex}&editorPreview=1&coursewareId=${
        profile.coursewareId
      }&checkFlag=true&userId=${userId}&buType=${profile.bu}&tkyun=${
        CacheHelper.UserInfo.userToken
      }&rand=${Math.random()}`;
      PlayCoursePreiew.isplayCourse = true;
      PlayCoursePreiew.playConfig = [];
      PlayCoursePreiew.playConfig.push(
        prevVoiceClassUrl,
        this.Courseware.Profile.coursewareName,
        this.Courseware.getSaveInfo(true, true),
      );
      PlayCoursePreiew.playHeight = 720;
      PlayCoursePreiew.playWidth = 1600;
    }
    //其他
    else {
      //互动绘本
      if (
        this.Courseware.Profile.purposeVo.code &&
        this.Courseware.Profile.purposeVo.code == 'PICTRUE_BOOK'
      ) {
        PlayCoursePreiew.playHeight = 1280 / 2;
      } else {
        PlayCoursePreiew.playHeight = 720;
      }
      PlayCoursePreiew.playConfig.push(
        url,
        this.Courseware.Profile.coursewareName,
        this.Courseware.getSaveInfo(true, true),
      );
      PlayCoursePreiew.playWidth = 1280;
    }

    PlayCoursePreiew.isplayCourse = true;
  }
  //#endregion

  //#region  页面操作

  @action
  addNewPage = () => {
    var insertIndex = 0;
    if (this.Courseware?.Pages != null) {
      if (this.SelectedPage != null) {
        insertIndex = this.Courseware.Pages.indexOf(this.SelectedPage) + 1;
      } else {
        insertIndex = this.Courseware.Pages.length;
      }

      var newPage = new CWPage();
      RUHelper.Core.CreateTransaction();
      RUHelper.AddItem(this.Courseware.Pages, newPage, insertIndex);
      RUHelper.SetProperty(
        this.Courseware,
        'SelectedPage',
        newPage,
        this.SelectedPage,
      );
      newPage.InitDetailsContent([]);
      RUHelper.Core.CommitTransaction();
    }
  };

  @action
  uploadCover = () => {
    if (this.SelectedPage) {
      var courseware = this.Courseware;
      var div = document.createElement('div');
      div.style.background = 'transparent';
      div.style.position = 'absolute';
      div.style.width = `${this.Courseware.StageSize.x}px`;
      div.style.height = `${this.Courseware.StageSize.y}px`;
      div.style.zIndex = '-10';
      //ReactDOM.render(<RichTextControl data={SelectedItem.thisData} />, div);
      ReactDOM.render(
        <Provider courseware={courseware}>
          <StageCanvas PageData={this.SelectedPage} isMainView={false} />
        </Provider>,
        div,
      );
      document.body.appendChild(div);

      html2canvas(div, {
        useCORS: true,
        backgroundColor: 'transparent',
      }).then(async canvas => {
        var extra_canvas = document.createElement('canvas');
        var cwidth = courseware.StageSize.x / 5;
        var cheight = courseware.StageSize.y / 5;
        extra_canvas.setAttribute('width', `${cwidth}px`);
        extra_canvas.setAttribute('height', `${cheight}px`);

        var ctx = extra_canvas.getContext('2d');
        ctx.drawImage(canvas, 0, 0, cwidth, cheight);
        var byte64 = extra_canvas.toDataURL();
        extra_canvas.remove();
        if (div) ReactDOM.unmountComponentAtNode(div);
        div?.remove();
        // console.log(byte64);
        //  return;
        //var md = md5(byte64);

        //上传逻辑 ----------------------------------------------------------------------------------------------------
        let file = new ResFile();
        file.file = CacheHelper.dataURLtoBlob(byte64);
        var uploadRes = await UpLoadFileHelper.UploadFile(
          file,
          UpLoadFileHelper.coverDir,
        );
        if (uploadRes && uploadRes.resourceKey) {
          var response = await HttpService.HttpRequest(
            `${this.Courseware.GetCWTypeStr()}/update`,
            {
              coursewareId: this.Courseware.Profile.coursewareId,
              covers: [uploadRes.resourceKey],
            },
            'POST',
          );
          if (response && response.code == '0') message.success('上传封面成功');
          else message.error('服务端记录封面失败');
        } else message.error('上传封面到oss失败');
      });
    }
  };

  @action
  deletePage = () => {
    if (this.SelectedPages == null) return;
    if (this.Courseware.Pages.length == this.SelectedPages.length) {
      message.error(
        '对不起，你不能删除所有页面，如需删除此页面，请新增空白页面',
      );
      return;
    }

    RUHelper.Core.CreateTransaction();
    var pagesToRemove = ArrayHelper.intersect(
      this.Courseware.Pages,
      this.SelectedPages,
    );
    var selectedIndex = this.Courseware.Pages.indexOf(
      pagesToRemove?.[0] || null,
    );

    this.Courseware.Pages.forEach(p =>
      RUHelper.SetProperty(p, 'IsSelected', false, p.IsSelected),
    );

    pagesToRemove?.forEach(p => {
      RUHelper.RemoveItem(this.Courseware.Pages, p);
    });
    if (selectedIndex >= 0 && selectedIndex < this.Courseware.Pages.length)
      RUHelper.SetProperty(
        this.Courseware,
        'SelectedPage',
        this.Courseware.Pages[selectedIndex],
        this.SelectedPage,
      );
    else
      RUHelper.SetProperty(
        this.Courseware,
        'SelectedPage',
        this.Courseware.Pages[this.Courseware.Pages.length - 1],
        this.SelectedPage,
      );

    RUHelper.Core.CommitTransaction();
  };

  @action
  copyPages = () => {
    if (this.SelectedPages != null && this.SelectedPages.length > 0) {
      var selectedPages = ArrayHelper.intersect(
        this.Courseware.Pages,
        this.SelectedPages,
      );
      var clonedPages = selectedPages.map(x => x.SafeClone());
      var insertIndex =
        selectedPages?.[selectedPages.length - 1]?.PageIndex || 0;
      RUHelper.Core.CreateTransaction();
      for (var i = 0; i < clonedPages.length; i++) {
        var p = clonedPages[i];
        RUHelper.SetProperty(p, 'Name', p.Name + '-副本', p.Name);
        RUHelper.AddItem(this.Courseware.Pages, p, insertIndex + i);
        p.LogicDesign?.ImportDataFromScene(); //同步逻辑视图
        if (i == 0) {
          RUHelper.SetProperty(
            this.Courseware,
            'SelectedPage',
            p,
            this.SelectedPage,
          );
        } else {
          RUHelper.SetProperty(p, 'IsSelected', true, false);
        }
      }
      RUHelper.Core.CommitTransaction();
    }
  };

  private pageExportSign = 'pexport:';
  @action exportPages = () => {
    if (this.SelectedPages != null && this.SelectedPages.length > 0) {
      var selectedPages = ArrayHelper.intersect(
        this.Courseware.Pages,
        this.SelectedPages,
      );
      var reslib: CWResource[] = [];
      var fontlib = [];
      var pagesPlain = this.Courseware.GetPagesPlain(
        reslib,
        fontlib,
        selectedPages,
      );
      var clipboardData = {
        resIds: reslib.map(x => x.resourceId),
        fontlib: fontlib,
        pages: pagesPlain,
      };
      var zipedData = StrCompressHelper.zip(JSON.stringify(clipboardData));
      ClipboardHelper.copyToClipboard(this.pageExportSign + zipedData);
    }
  };

  @action importPages = () => {
    if (this.SelectedPages != null && this.SelectedPages.length > 0) {
      var selectedPages = ArrayHelper.intersect(
        this.Courseware.Pages,
        this.SelectedPages,
      );
      var lastPage = selectedPages[selectedPages.length - 1];
      var insertIndex = this.Courseware.Pages.indexOf(lastPage) + 1;
      ClipboardHelper.getClipboardText(
        (v => {
          if (v.startsWith(this.pageExportSign)) {
            var zipedData = v.substr(this.pageExportSign.length);
            try {
              var clipboardDataStr = StrCompressHelper.unzip(zipedData);
              var clipboardData = JSON.parse(clipboardDataStr);
              const { resIds, fontlib, pages: pagesPlain } = clipboardData;
              var pages = plainToClass(CWPage, pagesPlain || [], {
                typeMaps: TypeMapHelper.CommonTypeMap,
              });
              if (pages && pages.length > 0) {
                HttpService.queryResByIds(resIds).then(reslib => {
                  pages.forEach(x => x.InitDetailsContent(reslib));
                  RUHelper.Core.CreateTransaction();
                  for (var i = 0; i < pages.length; i++) {
                    pages[i].Id = IdHelper.NewId();
                    RUHelper.AddItem(
                      this.Courseware.Pages,
                      pages[i],
                      insertIndex + i,
                    );
                  }
                  RUHelper.Core.CommitTransaction();
                });
              }
            } catch (error) {
              console.log(error);
            }
          }
        }).bind(this),
      );
    }
  };

  @action
  ClearPagesBg = () => {
    if (this.SelectedPages.find(x => x.IsTemplateLockEnable) != null) {
      message.error('模板页面不可删除背景');
      return;
    }
    RUHelper.Core.CreateTransaction();
    this.SelectedPages?.forEach(p => (p.BgImgRes = new CWResource()));
    RUHelper.Core.CommitTransaction();
  };

  @action
  delPageBGM = () => {
    if (this.SelectedPages != null && this.SelectedPages.length > 0) {
      if (this.SelectedPages.find(x => x.IsTemplateLockEnable) != null) {
        message.error('模板页面不可删除背景音乐');
        return;
      }
      RUHelper.Core.CreateTransaction();
      for (var item of this.SelectedPages) {
        RUHelper.SetProperty(item, 'BgAudio', new CWResource(), item.BgAudio);
      }
      RUHelper.Core.CommitTransaction();
    }
  };

  @action
  delPageVideo = () => {
    if (this.SelectedPages != null && this.SelectedPages.length > 0) {
      if (this.SelectedPages.find(x => x.IsTemplateLockEnable) != null) {
        message.error('模板页面不可删除页面视频');
        return;
      }
      RUHelper.Core.CreateTransaction();
      for (var item of this.SelectedPages) {
        RUHelper.SetProperty(
          item,
          'FullScreenVideo',
          new CWResource(),
          item.FullScreenVideo,
        );
      }
      RUHelper.Core.CommitTransaction();
    }
  };

  //#endregion

  //#region  元素操作

  //#region 组合拆分
  /// <summary>
  /// 组合选中的元素（只支持两个或两个以上的元素）
  /// </summary>
  /// <returns>组合好的元素</returns>
  public CombineItems(): CWElement {
    var selectedItems = this.SelectedPage?.SelectedItems;
    if (selectedItems.find(x => x.IsPageTemplateLockEnabled) != null) {
      message.error('模板元素不可组合');
      return null;
    }
    var itemsToCombine = CWElement.ClearDescendants(
      ArrayHelper.intersect(this.SelectedPage.TotalEditItemList, selectedItems),
    );

    var oldfathers = ArrayHelper.distinct(itemsToCombine.map(x => x.Father));

    if (oldfathers.length == 1 && oldfathers[0] != null) {
      //判断是否所有被选中的元素都在一个组合当中了
      var sons = itemsToCombine.filter(x => x.Father == oldfathers[0]);
      if (sons.length == oldfathers[0].Children.length) {
        return null;
      }
    }
    oldfathers = oldfathers.filter(x => x != null);

    if (itemsToCombine != null && itemsToCombine.length > 1) {
      var oldAbsolutePos = itemsToCombine.map(x => x.AbsolutePosition);
      var oldAbsoluteAngle = itemsToCombine.map(x => x.AbsoluteAngle);
      var oldAbsoluteFlipX = itemsToCombine.map(x => x.AbsoluteFlipX);
      var oldAbsoluteFlipY = itemsToCombine.map(x => x.AbsoluteFlipY);
      //if (itemsToCombine.FirstOrDefault(item => !(item.LogicNode is EmptyLogicNode)) == null
      //    || WindowDialog.Show("要组合的元素中包含逻辑，组合后会丧失其功能，请确认是否继续？", "组合") == 2)
      //{
      RUHelper.Core.CreateTransaction();

      for (var selectedItem of selectedItems)
        RUHelper.SetProperty(selectedItem, 'IsSelected', false, true);

      var insertList = itemsToCombine[0].FatherList;
      var insertIndex = insertList.indexOf(itemsToCombine[0]);
      for (var itemToCombine of itemsToCombine) {
        RUHelper.RemoveItem(itemToCombine.FatherList, itemToCombine);
      }
      var combinedItem = CombinedEditItem.CombineItems(itemsToCombine);

      combinedItem.Name = CWElement.NewItemStringName(
        '组合元素',
        this.SelectedPage,
        itemsToCombine,
      );
      RUHelper.AddItem(insertList, combinedItem, insertIndex);
      for (let i = 0; i < combinedItem.Children.length; i++) {
        combinedItem.Children[i].AbsolutePosition = oldAbsolutePos[i];
        combinedItem.Children[i].AbsoluteAngle = oldAbsoluteAngle[i];
        combinedItem.Children[i].AbsoluteFlipX = oldAbsoluteFlipX[i];
        combinedItem.Children[i].AbsoluteFlipY = oldAbsoluteFlipY[i];
      }
      RUHelper.SetProperty(
        this.SelectedPage,
        'SelectedItem',
        combinedItem,
        this.SelectedPage.SelectedItem,
      );

      oldfathers.forEach(x => {
        if (x.Children != null && x.Children.length > 0) x.ResetBoundary();
      });

      this.ClearEmptyCombinedEditItems();

      RUHelper.Core.CommitTransaction(() =>
        this.SelectedPage?.LogicDesign?.ImportDataFromScene(),
      );
      return combinedItem;
      //}
    }

    return null;
  }

  public SplitCombinedItem(): void {
    if (this.SelectedPage == null) return;
    var itemsToSplit = ArrayHelper.intersect(
      this.SelectedPage.TotalEditItemList,
      this.SelectedPage.SelectedItems.filter(
        x => x instanceof CombinedEditItem,
      ),
    ).map(x => x as CombinedEditItem);
    if (itemsToSplit?.find(x => x.IsPageTemplateLockEnabled) != null) {
      message.error('模板元素不可拆分');
      return;
    }
    itemsToSplit = itemsToSplit?.reverse();

    if (itemsToSplit == null || itemsToSplit.length == 0) return;

    RUHelper.Core.CreateTransaction();

    for (var itemToSplit of itemsToSplit) {
      var fatherlist = itemToSplit.FatherList;
      var insertIndex = fatherlist.indexOf(itemToSplit);
      RUHelper.SetProperty(itemToSplit, 'IsSelected', false, true);
      RUHelper.RemoveItem(fatherlist, itemToSplit);
      var split_result: CWElement[] = itemToSplit.SplitItem();
      for (var splited of split_result) {
        RUHelper.AddItem(fatherlist, splited, insertIndex);
        RUHelper.SetProperty(splited, 'IsSelected', true, false);
        insertIndex++;
      }
    }

    RUHelper.Core.CommitTransaction(() =>
      this.SelectedPage?.LogicDesign?.ImportDataFromScene(),
    );
  }

  /// <summary>
  /// 清除所有空的组合
  /// </summary>
  public ClearEmptyCombinedEditItems() {
    var selectedPage = this.SelectedPage;
    if (selectedPage != null) {
      var totalEditItemList = [...selectedPage.TotalEditItemList];
      var emptycombinedEditItems = totalEditItemList
        .filter(x => x instanceof CombinedEditItem)
        .map(x => x as CombinedEditItem)
        .filter(
          x =>
            x.AutoClearWhenEmpty &&
            (x.Children == null || x.Children.length == 0),
        );
      RUHelper.Core.CreateTransaction();

      while (emptycombinedEditItems.length > 0) {
        for (var emptyitem of emptycombinedEditItems) {
          var i = emptycombinedEditItems.indexOf(emptyitem);
          if (emptyitem.FatherList != null)
            RUHelper.RemoveItem(emptyitem.FatherList, emptyitem);
          totalEditItemList.splice(i, 1);
        }
        emptycombinedEditItems = totalEditItemList
          .filter(x => x instanceof CombinedEditItem)
          .map(x => x as CombinedEditItem)
          .filter(
            x =>
              x.AutoClearWhenEmpty &&
              (x.Children == null || x.Children.length == 0),
          );
      }
      RUHelper.Core.CommitTransaction();
    }
  }

  //#endregion

  //#region 删除元素

  public DeleteSelectedItem(): boolean {
    if (
      this.SelectedPage != null &&
      this.SelectedPage.SelectedItems.length > 0
    ) {
      var selectItems = ArrayHelper.intersect(
        this.SelectedPage?.TotalEditItemList,
        this.SelectedPage?.SelectedItems,
      );
      if (selectItems.find(x => x.IsPageTemplateLockEnabled) != null) {
        message.error('模板元素不可删除');
        return false;
      }
      var itemsToRemove = CWElement.ClearDescendants(selectItems);
      var totalItemsToRemove = CWElement.GetAllItemsWithSub(itemsToRemove);
      var idsToRemove = totalItemsToRemove?.map(x => x.Id);
      if (itemsToRemove != null && itemsToRemove.length > 0) {
        RUHelper.Core.CreateTransaction();
        var fathersNeedToResetBound = ArrayHelper.distinct(
          itemsToRemove.filter(x => x.Father != null).map(x => x.Father),
        );
        for (var item of selectItems) {
          RUHelper.SetProperty(item, 'IsSelected', false, true);
        }
        totalItemsToRemove?.forEach(x =>
          x.TotalTriggers?.forEach(t => (t.IsEnabled = false)),
        );
        for (
          let i = itemsToRemove.length - 1;
          i >= 0;
          i-- //从后向前删除
        ) {
          var s_item = itemsToRemove[i];
          RUHelper.RemoveItem(s_item.FatherList, s_item);
          RUHelper.SetProperty(s_item, 'Scene', null, this.SelectedPage);
        }
        fathersNeedToResetBound.forEach(x => {
          if (x.Children != null && x.Children.length > 0) x.ResetBoundary();
        });

        this.ClearEmptyCombinedEditItems();
        //var idReplaceDic = new Dictionary<string, string>();
        //idsToRemove?.ForEach(x => idReplaceDic.Add(x, string.Empty));
        //SelectedPage?.ReplaceRelativeIds(idReplaceDic);

        RUHelper.Core.CommitTransaction();
        this.SelectedPage.SelectedItem = null;
      }
    }
    return false;
  }

  DeleteSelectedItemsAndLogic() {
    if (
      this.SelectedPage != null &&
      this.SelectedPage.SelectedItems.length > 0
    ) {
      if (this.SelectedPage.IsTemplateLockEnable) {
        message.error('模板页面不可删除逻辑');
        return;
      }

      var selectItems = ArrayHelper.intersect(
        this.SelectedPage?.TotalEditItemList,
        this.SelectedPage?.SelectedItems,
      );
      RUHelper.Core.CreateTransaction();
      var invsToRemove = this.FindOnlyRelativeInvs(selectItems);
      this.SelectedPage.LogicDesign.DoDeleteLDItems(invsToRemove);
      this.DeleteSelectedItem();
      RUHelper.Core.CommitTransaction();
    }
  }

  //#endregion

  //#region 复制和黏贴
  // @observable
  // public ItemsCopyboard: ElementsCopyBox = null;

  private elementsExportSign = 'eexport:';

  public ExportToElementsBox(): ElementsCopyBox {
    if (this.SelectedPage != null) {
      var selectedItems = CWElement.ClearDescendants(
        ArrayHelper.intersect(
          this.SelectedPage.TotalEditItemList,
          this.SelectedPage.SelectedItems,
        ),
      );
      if (selectedItems != null && selectedItems.length > 0) {
        var copyedItems = selectedItems.map(t => t.SafeDeepClone(false));
        for (let i = 0; i < selectedItems.length; i++) {
          copyedItems[i].X = selectedItems[i].AbsoluteLeft;
          copyedItems[i].Y = selectedItems[i].AbsoluteTop;
          copyedItems[i].Angle = selectedItems[i].AbsoluteAngle;
        }

        var relativeInvs = this.FindRelativeInvs(selectedItems);
        var itemsToClone = InvokableBase.GetAllInvsWithSub(
          InvokableBase.ClearDescendants(relativeInvs),
        );

        var reslib: CWResource[] = [];
        var fontlib: string[] = [];

        var reslibs = copyedItems.map(x => x.GetDependencyResources());
        reslibs.forEach(res => reslib.push(...res));

        itemsToClone
          ?.map(x => x.GetDependencyResources())
          .forEach(res => reslib.push(...res));

        var fontlibs = copyedItems.map(x => x.GetDependencyFonts());
        fontlibs.forEach(font => fontlib.push(...font));

        reslib = ArrayHelper.distinct(reslib);
        var _fontlib = ArrayHelper.distinct(fontlib)
          .map(x => CacheHelper.FontList.find(f => f.resourceName == x))
          .filter(x => x != null);
        reslib.push(..._fontlib);
        reslib = reslib?.map(x => ObjHelper.ConvertObj(CWResource, x));
        var templateModel = new ElementsCopyBox();
        templateModel.Elements = copyedItems;
        templateModel.Invokables = itemsToClone;
        templateModel.ResLib = reslib;
        var serializedData = serialize(templateModel, {
          strategy: 'excludeAll',
          typeMaps: TypeMapHelper.CommonTypeMap,
        });
        var zipedData = StrCompressHelper.zip(serializedData);
        ClipboardHelper.copyToClipboard(this.elementsExportSign + zipedData);
        return templateModel;
      }
    }
  }

  public CutItems() {
    this.ExportToElementsBox();
    this.DeleteSelectedItem();
  }

  /// <summary>
  /// 黏贴元素（不带逻辑）
  /// </summary>
  /// <param name="items"></param>
  /// <param name="renameAddition"></param>
  /// <returns></returns>
  public PasteItems(renameAddition: string = '', deltaMove: Vector2D = null) {
    var templateModel: ElementsCopyBox = null;
    ClipboardHelper.getClipboardText(
      (v => {
        if (v.startsWith(this.elementsExportSign)) {
          if (templateModel == null) {
            var zipedData = v.substr(this.elementsExportSign.length);
            var clipboardDataStr = StrCompressHelper.unzip(zipedData);
            templateModel = deserialize(
              ElementsCopyBox,
              clipboardDataStr || '{}',
              {
                typeMaps: TypeMapHelper.CommonTypeMap,
              },
            );
          }
        }
        if (this.SelectedPage == null || templateModel == null) return;
        var tempModel = templateModel;
        //   ObjHelper.DeepClone(
        //   templateModel,
        //   TypeMapHelper.CommonTypeMap,
        // );
        var editItems = tempModel.Elements;
        editItems?.forEach(x => x.SetResourcesFromLib(tempModel.ResLib));
        this.SelectedPage.PasteItems(editItems, renameAddition, deltaMove);
      }).bind(this),
    );
  }

  //带逻辑黏贴
  ImportElementsBox(
    targetScene: CWPage,
    templateModel: ElementsCopyBox = null,
  ): void {
    ClipboardHelper.getClipboardText(
      (v => {
        if (v.startsWith(this.elementsExportSign)) {
          if (templateModel == null) {
            var zipedData = v.substr(this.elementsExportSign.length);
            var clipboardDataStr = StrCompressHelper.unzip(zipedData);
            templateModel = deserialize(
              ElementsCopyBox,
              clipboardDataStr || '{}',
              {
                typeMaps: TypeMapHelper.CommonTypeMap,
              },
            );
          }
        }
        if (templateModel != null)
          targetScene?.ImportElementsBox(templateModel);
      }).bind(this),
    );
  }

  //#region 关系追溯

  /**
   * 寻找元素相关可执行组件
   */
  FindRelativeInvs(editItemViewModels: CWElement[]): InvokableBase[] {
    var allItems: CWElement[] = [];
    var relativeInvs: Set<InvokableBase> = new Set<InvokableBase>();
    if (editItemViewModels != null) {
      for (var editItem of editItemViewModels) {
        allItems.push(editItem);
        if (editItem instanceof CombinedEditItem)
          allItems.push(...editItem.TotalSubItemList);
      }
      for (var editItem of allItems) {
        var invs = editItem.GetAllTargetsInInvokeTree();
        invs?.forEach(x => {
          if (!relativeInvs.has(x)) relativeInvs.add(x);
        });
      }
    }
    return Array.from(relativeInvs);
  }

  /**
   * 寻找只与这些元素相关的可执行组件
   */
  FindOnlyRelativeInvs(editItemViewModels: CWElement[]) {
    var allItems = CWElement.GetAllItemsWithSub(editItemViewModels);
    var relativeInvs = this.FindRelativeInvs(allItems) || [];
    if (editItemViewModels != null && relativeInvs.length > 0) {
      var ld = relativeInvs[0].LogicDesign;
      if (ld != null) {
        var notRelativeLDItems = ArrayHelper.except(
          ld.LogicDItems,
          relativeInvs,
        );
        allItems.forEach(
          x =>
            (notRelativeLDItems = ArrayHelper.except(
              notRelativeLDItems,
              x.TotalTriggers,
            )),
        );
        var hasOutLinkInvs: InvokableBase[] = [];
        for (var relativeInv of relativeInvs) {
          if (
            notRelativeLDItems.find(x =>
              x.GetDirectlyInvs().includes(relativeInv),
            ) != null
          ) {
            hasOutLinkInvs.push(relativeInv);
          }
        }
        relativeInvs = ArrayHelper.except(relativeInvs, hasOutLinkInvs);
        while (hasOutLinkInvs.length > 0 && relativeInvs.length > 0) {
          var first = hasOutLinkInvs[0];
          var relatives = first.GetAllTargetsInInvokeTree(null);
          relativeInvs = ArrayHelper.except(relativeInvs, relatives);
          hasOutLinkInvs = ArrayHelper.except(hasOutLinkInvs, relatives);
          hasOutLinkInvs.splice(hasOutLinkInvs.indexOf(first), 1);
        }
      }
    }

    return relativeInvs;
  }
  //#endregion

  //#endregion

  //#region 锁定和隐藏
  public LockItems(isLock: boolean = true): void {
    var selectItems = this.Courseware.SelectedPage?.SelectedItems;
    if (selectItems != null) {
      RUHelper.Core.CreateTransaction();
      for (var item of selectItems) {
        item.IsLocked = isLock;
      }
      RUHelper.Core.CommitTransaction();
    }
  }

  public HideItems(isHide: boolean = true): void {
    var selectItems = this.Courseware.SelectedPage?.SelectedItems;
    if (selectItems != null) {
      RUHelper.Core.CreateTransaction();
      for (var item of selectItems) {
        item.IsDesignHide = isHide;
      }
      RUHelper.Core.CommitTransaction();
    }
  }

  public SolidifyItems(isSolidify: boolean = true): void {
    var selectItems = this.Courseware.SelectedPage?.SelectedItems.filter(
      x => x instanceof CombinedEditItem,
    ).map(x => x as CombinedEditItem);
    if (selectItems != null) {
      RUHelper.Core.CreateTransaction();
      for (var item of selectItems) {
        item.IsSolidified = isSolidify;
      }
      RUHelper.Core.CommitTransaction();
    }
  }

  public ExpandAllItems(isExpand: boolean): void {
    if (this.SelectedPage != null) {
      var items = this.SelectedPage.TotalEditItemList.filter(
        x => x instanceof CombinedEditItem,
      ).map(x => x as CombinedEditItem);
      items.forEach(x => (x.IsExpanded = isExpand));
    }
  }
  //#endregion

  //#region 层级移动

  public MoveItemsLayer(movecmd: string): void {
    var _selectPage = this.SelectedPage;
    var selectItems = ArrayHelper.intersect(
      _selectPage.TotalEditItemList,
      _selectPage.SelectedItems,
    );
    if (selectItems.find(x => x.IsPageTemplateLockEnabled) != null) {
      message.error('模板元素不可变更层级');
      return;
    }
    if (selectItems != null && selectItems.length > 0) {
      RUHelper.Core.CreateTransaction();
      selectItems.forEach(x =>
        RUHelper.SetProperty(x, 'IsSelected', false, true),
      );
      switch (movecmd) {
        case 'top': {
          for (var item of selectItems) {
            var fatherList = item.FatherList;
            if (fatherList) {
              RUHelper.RemoveItem(fatherList, item);
              RUHelper.AddItem(fatherList, item);
            }
          }

          break;
        }
        case 'bottom': {
          for (var i = selectItems.length - 1; i >= 0; i--) {
            var item = selectItems[i];
            var fatherList = item.FatherList;
            if (fatherList) {
              RUHelper.RemoveItem(fatherList, item);
              RUHelper.AddItem(fatherList, item, 0);
            }
          }
          break;
        }
        case 'up': {
          for (var i = selectItems.length - 1; i >= 0; i--) {
            var item = selectItems[i];
            var fatherList = item.FatherList;
            if (fatherList) {
              var index = fatherList.indexOf(item);
              if (index < fatherList.length - 1) {
                index += 1;

                if (!selectItems.includes(fatherList[index])) {
                  RUHelper.RemoveItem(fatherList, item);
                  RUHelper.AddItem(fatherList, item, index);
                }
              }
            }
          }
          break;
        }
        case 'down': {
          for (var i = 0; i < selectItems.length; i++) {
            var item = selectItems[i];
            var fatherList = item.FatherList;
            if (fatherList) {
              var index = fatherList.indexOf(item);
              if (index > 0) {
                index -= 1;
                if (!selectItems.includes(fatherList[index])) {
                  RUHelper.RemoveItem(fatherList, item);
                  RUHelper.AddItem(fatherList, item, index);
                }
              }
            }
          }
          break;
        }
      }
      selectItems.forEach(x =>
        RUHelper.SetProperty(x, 'IsSelected', true, false),
      );

      RUHelper.Core.CommitTransaction();
      // () => selectItems.forEach(x => { x.IsSelected = true; x.HasSelectionChangedBeforeRecord = true; },
      // () => _selectPage?.RefreshSelectedItems(),));
    }
  }

  //#endregion

  //#region 对齐元素

  ElementAlign(align: string) {
    ActionManager.Instance.CreateTransaction();
    var bounds = this.SelectedPage.SelectedItems.map(x =>
      x.AbsoluteMatrix.TransformRect(new Rect2D(0, 0, x.Width, x.Height)),
    );

    var uniondBound = Rect2D.union(...bounds);
    switch (align) {
      case 'LeftAlign': {
        var minLeft = uniondBound.left;
        for (var i = 0; i < bounds.length; i++) {
          var item = this.SelectedPage.SelectedItems[i];
          item.X = Math.round(item.X) + minLeft - bounds[i].left;
        }
        break;
      }
      case 'HorizontalAlign': {
        var centerX = uniondBound.left + uniondBound.width / 2.0;
        for (var i = 0; i < bounds.length; i++) {
          var item = this.SelectedPage.SelectedItems[i];
          item.X =
            Math.round(item.X) +
            centerX -
            bounds[i].width / 2.0 -
            bounds[i].left;
        }
        break;
      }
      case 'RightAlign': {
        var maxRight = uniondBound.right;
        for (var i = 0; i < bounds.length; i++) {
          var item = this.SelectedPage.SelectedItems[i];
          item.X = Math.round(item.X) + maxRight - bounds[i].right;
        }
        break;
      }
      case 'CenterAlign': {
        for (var i = 0; i < this.SelectedPage.SelectedItems.length; i++) {
          var item = this.SelectedPage.SelectedItems[i];
          item.X = Math.round(this.Courseware.StageSize.x / 2 - item.Width / 2);
          item.Y = Math.round(
            this.Courseware.StageSize.y / 2 - item.Height / 2,
          );
        }
        break;
      }
      case 'HorizontalEquidistanceAlign': {
        for (var i = 0; i < this.SelectedPage.SelectedItems.length; i++) {
          var item = this.SelectedPage.SelectedItems[i];
          item.X = Math.round(this.Courseware.StageSize.x / 2 - item.Width / 2);
        }
        break;
      }
      case 'VerticalEquidistanceAlign': {
        for (var i = 0; i < this.SelectedPage.SelectedItems.length; i++) {
          var item = this.SelectedPage.SelectedItems[i];
          item.Y = Math.round(
            this.Courseware.StageSize.y / 2 - item.Height / 2,
          );
        }
        break;
      }
      case 'TopAlign': {
        var minTop = uniondBound.top;
        for (var i = 0; i < bounds.length; i++) {
          var item = this.SelectedPage.SelectedItems[i];
          item.Y = Math.round(item.Y) + minTop - bounds[i].top;
        }
        break;
      }
      case 'VerticalAlign': {
        var centerY = uniondBound.top + uniondBound.height / 2.0;
        for (var i = 0; i < bounds.length; i++) {
          var item = this.SelectedPage.SelectedItems[i];
          item.Y =
            Math.round(item.Y) +
            centerY -
            bounds[i].height / 2.0 -
            bounds[i].top;
        }
        break;
      }
      case 'BottomAlign': {
        var maxBottom = uniondBound.bottom;
        for (var i = 0; i < bounds.length; i++) {
          var item = this.SelectedPage.SelectedItems[i];
          item.Y = Math.round(item.Y) + maxBottom - bounds[i].bottom;
        }
        break;
      }
      case 'Traverse': {
        if (this.SelectedPage.SelectedItems.length > 2) {
          var itemList = this.SelectedPage.SelectedItems.slice().sort(
            x =>
              x.AbsoluteMatrix.TransformRect(
                new Rect2D(0, 0, x.Width, x.Height),
              ).left,
          );
          bounds = bounds.sort(a => a.left);

          var boundwidth = uniondBound.width;
          var itemsWidth = 0;
          bounds.forEach(x => (itemsWidth += x.width));
          var interval = (boundwidth - itemsWidth) / (itemList.length - 1);

          for (var i = 1; i < itemList.length - 1; i++) {
            var moveX = bounds[i - 1].right + interval - bounds[i].left;
            itemList[i].X = Math.round(itemList[i].X) + moveX;
            bounds[i] = new Rect2D(
              bounds[i].left + moveX,
              bounds[i].top,
              bounds[i].width,
              bounds[i].height,
            );
          }
        }
        break;
      }

      case 'Endwise': {
        if (this.SelectedPage.SelectedItems.length > 2) {
          var itemList = this.SelectedPage.SelectedItems.slice().sort(
            x =>
              x.AbsoluteMatrix.TransformRect(
                new Rect2D(0, 0, x.Width, x.Height),
              ).top,
          );
          bounds = bounds.sort(x => x.top);

          var boundheight = uniondBound.height;
          var itemsHeight = 0;
          bounds.forEach(x => (itemsHeight += x.height));
          var interval = (boundheight - itemsHeight) / (itemList.length - 1);

          for (var i = 1; i < itemList.length - 1; i++) {
            var moveY = bounds[i - 1].bottom + interval - bounds[i].top;
            itemList[i].Y = Math.round(itemList[i].Y) + moveY;
            bounds[i] = new Rect2D(
              bounds[i].left,
              bounds[i].top + moveY,
              bounds[i].width,
              bounds[i].height,
            );
          }
        }
        break;
      }
    }
    ActionManager.Instance.CommitTransaction();
  }

  //#endregion

  //#endregion
}
