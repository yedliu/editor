import React from 'react';
import CWElement from '../../../cwElement';
import CWResource from '../../../cwResource';
import { from } from 'linq-to-typescript';
import richTextEditItemViewModel from './richTextEditItemViewModel';

import richTextComplexTemplate, {
  PropPanelTemplate as richTextComplexPropPanelTemplate,
} from '@/components/cwDesignUI/elements/controlTemplates/richTextComplexTemplate';

import ReactDOM from 'react-dom';
import html2canvas from 'html2canvas';
import md5 from 'md5';
import UpLoadFileHelper, { ResFile } from '@/utils/uploadFileHelper';
import CacheHelper from '@/utils/cacheHelper';
import HttpService from '@/server/httpServer';

import { CWResourceTypes } from '@/modelClasses/courseDetail/courseDetailenum';

export default class richTextComplex extends richTextEditItemViewModel {
  public get Template(): any {
    return richTextComplexTemplate;
  }

  public get PropPanelTemplate(): any {
    return richTextComplexPropPanelTemplate;
  }

  constructor() {
    super();
  }

  public oneKeyTextToImage(
    SelectedItem,
    TextControl,
    isline = false,
    Width = 0,
    Height = 0,
  ) {
    if (SelectedItem.isTransform) return;
    this.convertProgress = 10;
    this.ProgressStatus = null;
    this.isTransform = true;
    this.placeholder = null;
    if (SelectedItem.IsShowToolbar == true) {
      this.IsShowToolbar = false;
    }

    var _width = Width == 0 ? SelectedItem.Width : Width;
    var _height = Height == 0 ? SelectedItem.Height : Height;

    var div = document.createElement('div');
    div.style.background = 'transparent';
    div.style.position = 'absolute';
    div.style.width = `${_width}px`;
    div.style.height = `${_height}px`;
    div.style.zIndex = '-10';
    ReactDOM.render(TextControl, div);
    document.body.appendChild(div);

    this.convertProgress = 20;

    if (isline) {
      var lineDispose = div.querySelectorAll('span');
      lineDispose.forEach(element => {
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
            (x as HTMLElement).style.borderBottom = '2px solid black';
          });
        }
      });
    }

    this.convertProgress = 30;

    html2canvas(div, { backgroundColor: 'transparent' }).then(async canvas => {
      var byte64 = canvas.toDataURL();
      this.convertProgress = 50;
      this.ImageUrl = byte64;

      document.body.removeChild(div);
      var md = md5(byte64);

      if (SelectedItem.md5 != null && SelectedItem.md5 == md) {
        console.log('-没进上传');
        this.DisplayMode = true;
        this.convertProgress = 100;
      } else {
        console.log('进入上传');
        this.convertProgress = 60;
        //上传逻辑 ----------------------------------------------------------------------------------------------------
        let file = new ResFile();
        file.file = CacheHelper.dataURLtoBlob(byte64);
        file = await UpLoadFileHelper.UploadFile(file);
        var _CWResource = new CWResource();
        _CWResource.resourceType = CWResourceTypes.Image;
        _CWResource.resourceId = md;
        _CWResource.resourceKey = file?.resourceKey;
        this.convertProgress = 80;
        var resources = new Array<any>();
        resources.push(_CWResource);
        var _resourcesList = { resources: resources };
        let settexeImage = await HttpService.SetImageTextFlies(_resourcesList);
        if (settexeImage == null || settexeImage == 'loginFail') {
          this.ProgressStatus = 'exception';
          console.log('上传资源失败了！');
        } else {
          this.ImageResource = _CWResource;
          this.md5 = md;
          this.DisplayMode = true;
          this.convertProgress = 100;
        }
        //-------------------------------------------------------------------------------------------------------------
      }
      this.isTransform = false;
    });
  }
}
