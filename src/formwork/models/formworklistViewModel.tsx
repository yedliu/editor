import { removeEmptyVoList } from '@/models/designres';
import { observable } from 'mobx';
import FormworkDataService from '../formworkDataService';
import { FormworkModel } from './formworkmodel';

export default class FormworkListViewModel {
  //#region 筛选数据

  @observable
  private _Keyword: string;
  public get Keyword(): string {
    return this._Keyword;
  }
  public set Keyword(v: string) {
    this._Keyword = v;
  }

  private PageSize = 40;

  @observable
  private _QTypeCode: string;
  /** 题型识别码 */
  public get QTypeCode(): string {
    return this._QTypeCode;
  }
  public set QTypeCode(v: string) {
    this._QTypeCode = v;
  }

  @observable
  private _QType: number[];
  /**
   * 类型
   */
  public get QType(): number[] {
    return this._QType || [0];
  }
  public set QType(v: number[]) {
    this._QType = v;
  }

  public get QTypeId() {
    if (this.QType.length > 0) return this.QType[this.QType.length - 1];
    return 0;
  }

  @observable
  private _ColorType: number[];
  /**
   * 色系
   */
  public get ColorType(): number[] {
    return this._ColorType || [0];
  }
  public set ColorType(v: number[]) {
    this._ColorType = v;
  }

  public get ColorTypeId() {
    if (this.ColorType.length > 0)
      return this.ColorType[this.ColorType.length - 1];
    return 0;
  }

  @observable
  private _PlayType: number[];
  /** 玩法 */
  public get PlayType(): number[] {
    return this._PlayType || [0];
  }
  public set PlayType(v: number[]) {
    this._PlayType = v;
  }

  public get PlayTypeId() {
    if (this.PlayType.length > 0)
      return this.PlayType[this.PlayType.length - 1];
    return 0;
  }

  @observable
  private _StyleType: number[];
  /**
   * 风格
   */
  public get StyleType(): number[] {
    return this._StyleType || [0];
  }
  public set StyleType(v: number[]) {
    this._StyleType = v;
  }

  public get StyleTypeId() {
    if (this.StyleType.length > 0)
      return this.StyleType[this.StyleType.length - 1];
    return 0;
  }

  @observable
  private _QuId: string;
  /**
   * 题库题目ID
   */
  public get QuId(): string {
    return this._QuId;
  }
  public set QuId(v: string) {
    this._QuId = v;
  }

  @observable
  private _UserId: string;
  /**
   * 链接题库和模板的用户Id
   */
  public get UserId(): string {
    return this._UserId;
  }
  public set UserId(v: string) {
    this._UserId = v;
  }

  @observable
  private _CascadeSys: any[];
  /** 分类体系数据 */
  public get CascadeSys(): any[] {
    return this._CascadeSys;
  }
  public set CascadeSys(v: any[]) {
    this._CascadeSys = v;
  }

  _QTypeCascadeDirs;
  public get QTypeCascadeDirs() {
    if (this.CascadeSys && !this._QTypeCascadeDirs) {
      var result = this.CascadeSys.find(x => x.code == 'ZMG_TEMPLATE_TOPIC');
      if (result != null) {
        result.voList = [{ id: 0, title: '所有题型' }, ...result.voList];
        this._QTypeCascadeDirs = result;
      }
    }
    return this._QTypeCascadeDirs;
  }

  _PlayTypeCascadeDirs;
  public get PlayTypeCascadeDirs() {
    if (this.CascadeSys && !this._PlayTypeCascadeDirs) {
      var result = this.CascadeSys.find(x => x.code == 'ZMG_TEMPLATE_PLAY');
      if (result != null) {
        result.voList = [{ id: 0, title: '所有玩法' }, ...result.voList];
        this._PlayTypeCascadeDirs = result;
      }
    }
    return this._PlayTypeCascadeDirs;
  }

  _StyleTypeCascadeDirs;
  public get StyleTypeCascadeDirs() {
    if (this.CascadeSys && !this._StyleTypeCascadeDirs) {
      var result = this.CascadeSys.find(x => x.code == 'ZMG_TEMPLATE_TYLE');
      if (result != null) {
        result.voList = [{ id: 0, title: '所有风格' }, ...result.voList];
        this._StyleTypeCascadeDirs = result;
      }
    }
    return this._StyleTypeCascadeDirs;
  }

  _ColorTypeCascadeDirs;
  public get ColorTypeCascadeDirs() {
    if (this.CascadeSys && !this._ColorTypeCascadeDirs) {
      var result = this.CascadeSys.find(x => x.code == 'ZMG_TEMPLATE_COLOR');
      if (result != null) {
        result.voList = [{ id: 0, title: '所有色系' }, ...result.voList];
        this._ColorTypeCascadeDirs = result;
      }
    }
    return this._ColorTypeCascadeDirs;
  }

  @observable
  private _PageIndex: number = 1;
  public get PageIndex(): number {
    return this._PageIndex;
  }
  public set PageIndex(v: number) {
    this._PageIndex = v;
  }

  @observable
  private _TotalCounts: number = 0;
  public get TotalCounts(): number {
    return this._TotalCounts;
  }
  public set TotalCounts(v: number) {
    this._TotalCounts = v;
  }

  //#endregion

  @observable
  private _IsShowPreviewDialog: boolean = false;
  /**
   * 是否显示链接预览界面
   */
  public get IsShowPreviewDialog(): boolean {
    return this._IsShowPreviewDialog;
  }
  public set IsShowPreviewDialog(v: boolean) {
    this._IsShowPreviewDialog = v;
  }

  //#region 模板信息

  @observable
  private _FormworkList: FormworkModel[];
  public get FormworkList(): FormworkModel[] {
    return this._FormworkList;
  }
  public set FormworkList(v: FormworkModel[]) {
    this._FormworkList = v;
  }

  @observable
  private _CurrentFormwork: any;
  public get CurrentFormwork(): any {
    return this._CurrentFormwork;
  }
  public set CurrentFormwork(v: any) {
    this._CurrentFormwork = v;
  }

  //#endregion

  //#region 题目信息

  @observable
  private _QuData: any;
  public get QuData(): any {
    return this._QuData;
  }
  public set QuData(v: any) {
    this._QuData = v;
  }

  //#endregion

  //#region 生成题型选项

  public SearchQTypeByCode() {
    var qtypedir = this.QTypeCascadeDirs;
    if (qtypedir != null) {
      var resultPath = this.FindDirItemByCode(qtypedir, this.QTypeCode, []);
      if (resultPath) this.QType = resultPath;
    }
  }

  public FindDirItemByCode(dir: any, code: string, path: number[]) {
    if (dir) {
      if (dir.code == code) return path;
      if (dir.voList && dir.voList.length > 0) {
        for (var subdir of dir.voList) {
          var _path = [...path, subdir.id];
          var resultPath = this.FindDirItemByCode(subdir, code, _path);
          if (resultPath) return resultPath;
        }
      }
    }
    return null;
  }

  //#endregion

  //#region 获取数据

  public GetFormworkCascadeSys(callback?: () => void) {
    FormworkDataService.getFormworkCascadeSys().then(v => {
      v.forEach(x => removeEmptyVoList(x));
      // console.log(v);
      this.CascadeSys = v;
      this.SearchQTypeByCode();
      callback?.();
    });
  }

  public GetFormworkList(callback?: () => void) {
    FormworkDataService.getFormworkList(
      this.Keyword || undefined,
      this.ColorTypeId || undefined,
      this.PlayTypeId || undefined,
      this.StyleTypeId || undefined,
      this.QTypeCode || undefined,
      this.PageIndex,
      this.PageSize,
      this.QuId || undefined,
    ).then(v => {
      this.TotalCounts = v?.total || 0;
      this.FormworkList = v?.list || [];
      callback?.();
    });
  }

  public GetQuData(callback?: () => void) {
    if (this.QuId)
      FormworkDataService.getQuDetail(this.QuId).then(v => {
        this.QuData = v;
        if (v && this.QTypeCode != v.quCode) {
          //从题目信息中剥离模板类型（如果和默认读入的不同）
          this.QTypeCode = v.quCode;
          this.SearchQTypeByCode();
        }
        callback?.();
      });
    else {
      this.QuData = null;
      callback?.();
    }
  }

  public LinkTemplateQu(
    formworkId: string,
    success_callback?: () => void,
    fail_callback?: () => void,
  ) {
    if (formworkId && this.QuId && this.UserId) {
      FormworkDataService.linkTemplateQu(
        this.QuId,
        formworkId,
        this.UserId,
      ).then(v => {
        if (v) {
          success_callback?.();
          this.completeLink();
        } else {
          fail_callback?.();
        }
      });
    }
  }

  public completeLink() {
    var msg = {
      action: 'CLOSE_SELF',
      data: {},
    };
    window.parent?.postMessage(msg, '*');
    console.log('postMessage', msg);
  }

  //#endregion
}
