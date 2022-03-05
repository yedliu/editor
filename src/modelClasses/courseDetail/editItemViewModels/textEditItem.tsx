import React from 'react';
import CWElement from '../cwElement';
import CWResource from '../cwResource';
import TextItemTemplate, {
  PropPanelTemplate as TextPropPanelTemplate,
} from '@/components/cwDesignUI/elements/controlTemplates/textItemTemplate';
import { from } from 'linq-to-typescript';
import { batch } from '@/server/CacheEntityServer';
import {
  AnimationType,
  IncludedType,
  ZoomType,
  AppearTypes,
  ClassType,
  ElementTypes,
  CWResourceTypes,
} from '../courseDetailenum';
import { observable, computed } from 'mobx';
import { Expose } from '@/class-transformer';
import convertImageViewModel from '@/modelClasses/courseDetail/editItemViewModels/complexControl/richTextControl/convertImageViewModel';
import RUHelper from '@/redoundo/redoUndoHelper';
import ReactDOM from 'react-dom';
import html2canvas from 'html2canvas';
import md5 from 'md5';
import UpLoadFileHelper, { ResFile } from '@/utils/uploadFileHelper';
import CacheHelper from '@/utils/cacheHelper';
import HttpService from '@/server/httpServer';

export enum Alignment {
  Left,
  Center,
  Right,
  Default,
}

export enum VAlignment {
  Top,
  Center,
  Bottom,
  Default,
}
export default class TextEditItem extends convertImageViewModel {
  constructor() {
    super();
  }

  public get Template(): any {
    return TextItemTemplate;
  }

  public get PropPanelTemplate(): any {
    return TextPropPanelTemplate;
  }

  @observable
  private _Text: string = '';
  @batch(ClassType.string)
  @Expose()
  public get Text(): string {
    return this._Text;
  }
  public set Text(v: string) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'Text',
      () => (this._Text = v),
      v,
      this._Text,
    );
  }

  @observable
  private _placeholder = '请输入文字';

  public get placeholder(): string {
    return this._placeholder;
  }

  public set placeholder(v: string) {
    this._placeholder = v;
  }

  @observable
  private _FtSize: number = 36;
  @batch(ClassType.number)
  @Expose()
  public get FtSize(): number {
    return this._FtSize;
  }
  public set FtSize(v: number) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'FtSize',
      () => (this._FtSize = v),
      v,
      this._FtSize,
    );
  }

  @observable
  private _Fonts: string = 'Arial';
  @batch(ClassType.string)
  @Expose()
  public get Fonts(): string {
    return this._Fonts;
  }
  public set Fonts(v: string) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'Fonts',
      () => (this._Fonts = v),
      v,
      this._Fonts,
    );
  }

  @observable
  private _IsBold: boolean;
  @batch(ClassType.bool)
  @Expose()
  public get IsBold(): boolean {
    return this._IsBold;
  }
  public set IsBold(v: boolean) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'IsBold',
      () => (this._IsBold = v),
      v,
      this._IsBold,
    );
  }

  @observable
  private _Italic: boolean;
  @batch(ClassType.bool)
  @Expose()
  public get Italic(): boolean {
    return this._Italic;
  }
  public set Italic(v: boolean) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'Italic',
      () => (this._Italic = v),
      v,
      this._Italic,
    );
  }

  @observable
  private _UnderLine: boolean;
  @batch(ClassType.bool)
  @Expose()
  public get UnderLine(): boolean {
    return this._UnderLine;
  }
  public set UnderLine(v: boolean) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'UnderLine',
      () => (this._UnderLine = v),
      v,
      this._UnderLine,
    );
  }

  @observable
  private _Color: string = '#FF000000';
  @Expose()
  @batch(ClassType.string)
  public get Color(): string {
    return this._Color;
  }
  public set Color(v: string) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'Color',
      () => (this._Color = v),
      v,
      this._Color,
    );
  }

  @observable
  private _Alignment: Alignment;
  @batch(ClassType.enum)
  @Expose()
  public get Alignment(): Alignment {
    return this._Alignment;
  }
  public set Alignment(v: Alignment) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'Alignment',
      () => (this._Alignment = v),
      v,
      this._Alignment,
    );
  }

  @observable
  private _VAlignment: VAlignment;
  @batch(ClassType.enum)
  @Expose()
  public get VAlignment(): VAlignment {
    return this._VAlignment;
  }
  public set VAlignment(v: VAlignment) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'VAlignment',
      () => (this._VAlignment = v),
      v,
      this._VAlignment,
    );
  }

  @computed
  public get Vtop() {
    if (
      this.VAlignment == VAlignment.Top ||
      this.VAlignment == VAlignment.Default
    ) {
      return 0;
    } else if (this.VAlignment == VAlignment.Center) {
      return (
        this.Height / 2 -
        (this.EditDiv == null ? 0 : this.EditDiv.offsetHeight / 2)
      );
    } else if (this.VAlignment == VAlignment.Bottom) {
      return (
        this.Height - (this.EditDiv == null ? 0 : this.EditDiv.offsetHeight)
      );
    }
  }

  @batch()
  @observable
  EditDiv: HTMLElement;

  @batch()
  public get thisData(): object {
    return this;
  }

  public ShowUniqueToolbar(itemView: HTMLElement) {
    super.ShowUniqueToolbar(itemView);
    // let control = (itemView.getElementsByClassName(
    //   'textInput',
    // )[0] as HTMLDivElement);
    // control.focus();
    // var range = window.getSelection();//创建range
    // range.selectAllChildren(control);//range 选择obj下所有子内容
    // range.collapseToEnd();//光标移至最后
  }

  //#region 导入导出

  public GetDependencyResources(): CWResource[] {
    var res = super.GetDependencyResources();
    return res;
  }

  public GetDependencyFonts(): string[] {
    return [this.Fonts];
  }
  //#endregion

  @batch(ClassType.object)
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
    if (SelectedItem.IsShowToolbar == true) {
      this.IsShowToolbar = false;
    }

    if (!this.Text) {
      this.placeholder = null;
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
    let scrollY =
      SelectedItem?.Name == '富文本'
        ? -10
        : SelectedItem?.Fonts?.includes('VAG')
        ? -10
        : 0;
    html2canvas(div, {
      backgroundColor: 'transparent',
      scale: 1,
      scrollY: scrollY,
      scrollX: 0,
    }).then(async canvas => {
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
