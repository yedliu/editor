import CWElement from '../../../cwElement';
import { batch } from '@/server/CacheEntityServer';
import { observable, computed } from 'mobx';
import {
  AnimationType,
  IncludedType,
  ZoomType,
  AppearTypes,
  ClassType,
  ElementTypes,
  CWResourceTypes,
} from '../../../courseDetailenum';
import cWRichTextModel from './cWRichTextModel';
import { Expose } from '@/class-transformer';
import {
  Alignment,
  VAlignment,
} from '@/modelClasses/courseDetail/courseDetailenum';
import convertImageViewModel from './convertImageViewModel';
import CWResource from '@/modelClasses/courseDetail/cwResource';
import { from } from 'linq-to-typescript';

export default class RichTextEditItemViewModel extends convertImageViewModel {
  //   protected UnitVMType: new (...args: any[]) => any = WritingUnit;

  constructor() {
    super();
  }

  // @observable
  // private _View: object;
  // @batch()
  // public get View(): object {
  //   return this._View;
  // }
  // public set View(v: object) {
  //   this._View = v;
  // }

  @observable
  private _placeholder = '请输入文字';

  public get placeholder(): string {
    return this._placeholder;
  }

  public set placeholder(v: string) {
    this._placeholder = v;
  }

  @observable
  private _RichTextInfo: Array<cWRichTextModel>;

  @batch(ClassType.object)
  @Expose()
  public get RichTextInfo(): Array<cWRichTextModel> {
    if (!this._RichTextInfo) this._RichTextInfo = new Array<cWRichTextModel>();

    // var s= this._RichTextInfo as Array<cWRichTextModel>;
    // return s;

    var result = new Array<cWRichTextModel>();
    this._RichTextInfo.forEach(row => {
      var s = new cWRichTextModel();
      s.Text = row.Text;
      s.Color = row.Color;
      s.Fonts = row.Fonts;
      s.IsBold = row.IsBold;
      s.Italic = row.Italic;
      s.UnderLine = row.UnderLine;
      s.FtSize = row.FtSize;
      result.push(s);
    });
    //console.log(":最终返回"+ JSON.stringify(result));
    return result;
  }

  public set RichTextInfo(v: Array<cWRichTextModel>) {
    this._RichTextInfo = v;
  }

  @observable
  private _Alignment: Alignment;
  @Expose()
  @batch()
  public get Alignment(): Alignment {
    return this._Alignment;
  }
  public set Alignment(v: Alignment) {
    this._Alignment = v;
  }

  @observable
  private _LineHeight: number = 50;
  @Expose()
  @batch()
  public get LineHeight(): number {
    return this._LineHeight;
  }
  public set LineHeight(v: number) {
    this._LineHeight = v;
  }

  //#region 导入导出

  public GetDependencyResources(): CWResource[] {
    var res = super.GetDependencyResources();
    return res;
  }

  public GetDependencyFonts(): string[] {
    var fonts = [];
    this.RichTextInfo.forEach(x => {
      fonts.push(x.Fonts);
    });
    return fonts;
  }
  //#endregion
}
