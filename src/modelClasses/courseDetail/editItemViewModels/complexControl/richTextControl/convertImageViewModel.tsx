import CWElement from '../../../cwElement';
import { batch } from '@/server/CacheEntityServer';
import { observable, computed } from 'mobx';
import { Expose } from '@/class-transformer';
import {
  ClassType,
  CWResourceTypes,
} from '@/modelClasses/courseDetail/courseDetailenum';
import CWResource from '@/modelClasses/courseDetail/cwResource';
import html2canvas from 'html2canvas';
import md5 from 'md5';
import ReactDOM from 'react-dom';
import { RichTextControl } from '@/components/cwDesignUI/control/richTextControl';
import React from 'react';
import { Editor } from 'draft-js';
import CacheHelper from '@/utils/cacheHelper';
import UpLoadFileHelper, { ResFile } from '@/utils/uploadFileHelper';
import { repeat } from 'linq-to-typescript';
import HttpService from '@/server/httpServer';
import { bool } from 'prop-types';

export default class convertImageViewModel extends CWElement {
  constructor() {
    super();
  }

  @batch(ClassType.object)
  public get thisData(): object {
    return this;
  }

  @observable
  private _HandShowToolbar: boolean = false;
  @batch(ClassType.bool)
  public get HandShowToolbar(): boolean {
    return this._HandShowToolbar;
  }
  public set HandShowToolbar(v: boolean) {
    this._HandShowToolbar = v;
  }

  ///下面是文字转图片
  @observable
  private _DisplayMode: boolean;
  @Expose()
  @batch(ClassType.bool)
  public get DisplayMode(): boolean {
    return this._DisplayMode;
  }
  public set DisplayMode(v: boolean) {
    this._DisplayMode = v;
  }

  public WEBMd5: string;
  @observable
  private _md5: string;
  //@Expose()
  @batch(ClassType.string)
  public get md5(): string {
    return this.WEBMd5;
  }
  public set md5(v: string) {
    this.ResourceId = v;
    this.WEBMd5 = v;
  }

  public WEBImageUrl: string;
  @observable
  private _ImageUrl: string;
  //@Expose()
  @batch(ClassType.string)
  public get ImageUrl(): string {
    return this.WEBImageUrl;
  }
  public set ImageUrl(v: string) {
    this.WEBImageUrl = v;
  }

  public WEBUrl: string;
  @observable
  private _Url: string;
  //@Expose()
  @batch(ClassType.string)
  public get Url(): string {
    return this.WEBUrl;
  }
  public set Url(v: string) {
    this.WEBUrl = v;
  }

  //@observable
  private _ImageResource: CWResource;
  //@Expose()
  //@batch(ClassType.object)
  public get ImageResource(): CWResource {
    return this._ImageResource;
  }
  public set ImageResource(v: CWResource) {
    this._ImageResource = v;
  }

  public GetDependencyResources(): CWResource[] {
    var res: CWResource[] = [];

    if (this.DisplayMode == true) {
      //图片模式
      if (this.ImageResource != null) {
        res.push(this.ImageResource);
      }
    }

    return res;
  }

  public SetResourcesFromLib(reslib: CWResource[]) {
    // var unit = reslib.filter(x => x.resourceId == this.ResourceId);
    // if (unit.length > 0) {
    //   var Resources = new CWResource();
    //   Resources.resourceId = unit[0].resourceId;
    //   Resources.resourceKey = unit[0].resourceKey;
    //   this.ImageResource = Resources;
    // }
    if (!reslib) return;
    this.initValue(reslib);
  }

  // public SafeDeepClone(
  //   useNewId: boolean = true,
  //   idReplaceMap?: Map<string, string>,
  // ): CWElement {
  //   var result = super.SafeDeepClone(useNewId, idReplaceMap) as this;
  //   // if (result != null) result.ImageResource = this.ImageResource;
  //   return result;
  // }

  @observable
  private _isUpdateData: boolean = true;
  //@Expose()
  @batch(ClassType.bool)
  public get isUpdateData(): boolean {
    return this._isUpdateData;
  }
  public set isUpdateData(v: boolean) {
    this._isUpdateData = v;
  }

  public initValue(reslib) {
    var data = this;
    if (data.DisplayMode != null && data.DisplayMode && data.WEBMd5 == null) {
      var CopyView = true;
      data.WEBMd5 = data.ResourceId;
      var md5 = data.WEBMd5;
      var _reslib = reslib;

      // if (data != null) {
      //   if (
      //     _reslib.filter(x => x.resourceId == data.ImageResource.resourceId)
      //       .length < 1
      //   ) {
      //     _reslib.push(data.ImageResource);
      //   }
      // }

      if (_reslib != null) {
        //console.log(JSON.stringify(_reslib));

        var cw = _reslib.filter(x => x.resourceId == md5);
        if (cw != null && cw.length > 0) {
          data.WEBUrl = cw[0].resourceKey;
          var url = data.WEBUrl;
          if (url != null && url.trim() != '') {
            // try {
            if (
              url.toLowerCase().indexOf('http://') != -1 ||
              url.toLowerCase().indexOf('https://') != -1
            ) {
              var _CWResource = new CWResource();
              _CWResource.resourceType = CWResourceTypes.Image;
              _CWResource.resourceId = md5;
              _CWResource.resourceKey = url;
              data.ImageResource = _CWResource;
              data.WEBImageUrl = url;
              //data.ResourceId = '';
            } else {
              data.WEBImageUrl = url;
              //data.ResourceId = '';
              //可能是byte64暂时不转换
            }
            CopyView = false; //发送页等..有可能造成这个问题 ，预留属性 后面出现问题。加载完自动生成
            // } catch (error)
            // {
            //    console.log("错误啦：：："+error);
            // }
          }
        }
      }
    }
  }

  @batch(ClassType.object)
  public ImgToText(SelectedItem) {
    SelectedItem.setValue('IsShowToolbar', false, ClassType.bool);
    SelectedItem.setValue('DisplayMode', false, ClassType.bool);
    SelectedItem.setValue('ProgressStatus', null, ClassType.string);
    SelectedItem.setValue('convertProgress', 0, ClassType.number);
    if (!SelectedItem.Text) {
      SelectedItem.setValue('placeholder', '请输入文字', ClassType.string);
    }
  }

  @observable
  @batch(ClassType.bool)
  isTransform: boolean = false;

  @observable
  @batch(ClassType.bool)
  convertProgress: number = 0;

  @observable
  @batch(ClassType.string)
  ProgressStatus: string = null;

  @batch(ClassType.object)
  public TextToImg(
    SelectedItem,
    TextControl,
    isline = false,
    Width = 0,
    Height = 0,
  ) {
    if (SelectedItem.isTransform) return;
    if (!SelectedItem.Text) {
      SelectedItem.setValue('placeholder', null, ClassType.string);
    }

    SelectedItem.setValue('convertProgress', 10, ClassType.number);
    SelectedItem.setValue('ProgressStatus', null, ClassType.string);

    SelectedItem.setValue('isTransform', true, ClassType.bool);
    //this.isTransform = true;

    if (SelectedItem.IsShowToolbar == true) {
      SelectedItem.setValue('IsShowToolbar', false, ClassType.bool);
    }

    var _width = Width == 0 ? SelectedItem.Width : Width;
    var _height = Height == 0 ? SelectedItem.Height : Height;

    var div = document.createElement('div');
    div.style.background = 'transparent';
    div.style.position = 'absolute';
    div.style.width = `${_width}px`;
    div.style.height = `${_height}px`;
    div.style.zIndex = '-10';
    // ReactDOM.render(<RichTextControl data={SelectedItem.thisData} />, div);
    ReactDOM.render(TextControl, div);
    document.body.appendChild(div);
    SelectedItem.setValue('convertProgress', 20, ClassType.number);
    if (isline) {
      var lineDispose = div.querySelectorAll('span');
      lineDispose.forEach(element => {
        //element.style.textDecoration = 'underline';
        element.style.borderBottom = '2px solid black';
      });
    } else {
      var lineDispose = div.querySelectorAll('span');
      lineDispose.forEach(element => {
        if (
          element.style.textDecoration != null &&
          element.style.textDecoration == 'underline'
        ) {
          element.childNodes.forEach(x => {
            //(x as HTMLElement).style.textDecoration = 'inherit';
            (x as HTMLElement).style.borderBottom = '2px solid black';
          });
        }
      });
    }
    SelectedItem.setValue('convertProgress', 30, ClassType.number);
    // 防止VAG字体转图片向下偏移
    let scrollY =
      SelectedItem?.Name == '富文本'
        ? -5
        : SelectedItem?.Fonts?.includes('VAG') && SelectedItem?.FtSize > 60
        ? -10
        : 0;
    html2canvas(div, {
      backgroundColor: 'transparent',
      scale: 1,
      scrollY: scrollY,
      scrollX: 0,
    }).then(async canvas => {
      var byte64 = canvas.toDataURL();

      SelectedItem.setValue('convertProgress', 50, ClassType.number);
      SelectedItem.setValue('ImageUrl', byte64, ClassType.string);

      document.body.removeChild(div);
      var md = md5(byte64);

      if (SelectedItem.md5 != null && SelectedItem.md5 == md) {
        // && SelectedItem.Url == ''
        //SelectedItem.setValue('isUpdateData', false, ClassType.bool);
        console.log('-没进上传');
        SelectedItem.setValue('DisplayMode', true, ClassType.bool);
        SelectedItem.setValue('convertProgress', 100, ClassType.number);
      } else {
        console.log('进入上传');
        SelectedItem.setValue('convertProgress', 60, ClassType.number);
        //上传逻辑 ----------------------------------------------------------------------------------------------------
        let file = new ResFile();
        file.file = CacheHelper.dataURLtoBlob(byte64);
        file = await UpLoadFileHelper.UploadFile(file);
        var _CWResource = new CWResource();
        _CWResource.resourceType = CWResourceTypes.Image;
        _CWResource.resourceId = md;
        _CWResource.resourceKey = file?.resourceKey;
        SelectedItem.setValue('convertProgress', 80, ClassType.number);
        var resources = new Array<any>();
        resources.push(_CWResource);
        var _resourcesList = { resources: resources };
        let settexeImage = await HttpService.SetImageTextFlies(_resourcesList);
        if (settexeImage == null || settexeImage == 'loginFail') {
          SelectedItem.setValue(
            'ProgressStatus',
            'exception',
            ClassType.string,
          );
          console.log('上传资源失败了！');
        } else {
          SelectedItem.setValue('ImageResource', _CWResource, ClassType.object);
          SelectedItem.setValue('md5', md, ClassType.string);
          SelectedItem.setValue('DisplayMode', true, ClassType.bool);
          SelectedItem.setValue('convertProgress', 100, ClassType.number);
        }
        //-------------------------------------------------------------------------------------------------------------
      }
      //this.isTransform = false;
      SelectedItem.setValue('isTransform', false, ClassType.bool);
    });
  }

  @batch()
  @observable
  editor: Editor;

  @batch(ClassType.object)
  public focusEditor() {
    setTimeout(() => {
      try {
        this.editor.focus();
      } catch (error) {}
    });
  }
}
