import { batch } from '@/server/CacheEntityServer';
import { observable } from 'mobx';
import { ClassType } from '@/modelClasses/courseDetail/courseDetailenum';
import IdHelper from '@/utils/idHelper';
import { Expose } from '@/class-transformer';

export default class cWRichTextModel {
  constructor() {}

  @observable
  private _Text: string;
  @Expose()
  @batch(ClassType.string)
  public get Text(): string {
    return this._Text;
  }
  public set Text(v: string) {
    this._Text = v;
  }

  @observable
  private _IsBold: boolean; //是否粗体
  @Expose()
  @batch(ClassType.bool)
  public get IsBold(): boolean {
    return this._IsBold;
  }
  public set IsBold(v: boolean) {
    this._IsBold = v;
  }

  @observable
  private _Italic: boolean; //是否倾斜
  @Expose()
  @batch(ClassType.bool)
  public get Italic(): boolean {
    return this._Italic;
  }
  public set Italic(v: boolean) {
    this._Italic = v;
  }

  @observable
  private _UnderLine: boolean; //是否有下划线
  @Expose()
  @batch(ClassType.bool)
  public get UnderLine(): boolean {
    return this._UnderLine;
  }
  public set UnderLine(v: boolean) {
    this._UnderLine = v;
  }

  @observable
  private _Color: string; //文字颜色
  @Expose()
  @batch(ClassType.string)
  public get Color(): string {
    return this._Color;
  }
  public set Color(v: string) {
    this._Color = v;
  }

  @observable
  private _Fonts: string; //文字字体
  @Expose()
  @batch(ClassType.string)
  public get Fonts(): string {
    return this._Fonts;
  }
  public set Fonts(v: string) {
    this._Fonts = v;
  }

  @observable
  private _FtSize: string; //文字大小
  @Expose()
  @batch(ClassType.string)
  public get FtSize(): string {
    return this._FtSize;
  }
  public set FtSize(v: string) {
    this._FtSize = v;
  }

  // @observable
  // private _Alignment: Alignment;
  // @batch()
  // public get Alignment(): Alignment {
  //   return this._Alignment;
  // }
  // public set Alignment(v: Alignment) {
  //   this._Alignment = v;
  // }
}
