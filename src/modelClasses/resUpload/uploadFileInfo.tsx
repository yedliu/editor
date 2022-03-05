import { observable, reaction } from 'mobx';
import { CWResourceTypes } from '../courseDetail/courseDetailenum';
import md5 from 'md5';
import HttpService from '@/server/httpServer';
import { DicStructNode, removeEmptyVoList } from '@/models/designres';
import ResUploadView, {
  UploadListArea,
} from '@/components/controls/ResUpload/resUploadView';
import UpLoadFileHelper, { ResFile } from '@/utils/uploadFileHelper';
import IdHelper from '@/utils/idHelper';
import { plainToClass } from '@/class-transformer';
import CWResource, { BoneDic } from '../courseDetail/cwResource';
import CacheHelper from '@/utils/cacheHelper';
import chardet from 'chardet';
import { message } from 'antd';

message.config({
  maxCount: 1,
});

export const smallFileSize = 1;
const videoSizeTag = 'VIDEOSIZE:';
const audioSizeTag = 'AUDIOSIZE:';
const skSizeTag = 'BONESIZE:';
const imgSizeTag = 'PICSIZE:';
const imgDipTag = 'PICDIP:';
const skDipTag = 'BONEDIP:';

export const imgTypeName = '图片';
export const audioTypeName = '音频';
export const videoTypeName = '视频';
export const skTypeName = '动画';
export const captionsTypeName = '字幕';

export enum UploadError {
  FileNameError,
  FileSizeError,
  VideoFileSizeError,
  AudioFileSizeError,
  ImgSizeError,
  VideoEncodeError,
  SkItemsError,
  SkTextureSizeError,
  DirIdNotSetError,
  CaptionLangError,

  SkNoActionError,

  FileSameError,
  UploadFailError,
  RecordFailError,
}

export enum UploadState {
  Preparing,
  Uploading,
  Complete,
  Error,
}

export class UploadFileInfo {
  //#region 静态信息

  @observable
  static ResDics: DicStructNode[];

  static get VideoFileSize() {
    return Math.max(
      30,
      ...(CacheHelper.UserInfo?.permission
        ?.filter((x: string) => x.startsWith(videoSizeTag))
        .map((x: string) => Number(x.substring(videoSizeTag.length))) || []),
    );
  }

  static get AudioFileSize() {
    return Math.max(
      1,
      ...(CacheHelper.UserInfo?.permission
        ?.filter((x: string) => x.startsWith(audioSizeTag))
        .map((x: string) => Number(x.substring(audioSizeTag.length))) || []),
    );
  }

  static get SkFileSize() {
    return Math.max(
      1,
      ...(CacheHelper.UserInfo?.permission
        ?.filter((x: string) => x.startsWith(skSizeTag))
        .map((x: string) => Number(x.substring(skSizeTag.length))) || []),
    );
  }

  static get ImgFileSize() {
    return Math.max(
      1,
      ...(CacheHelper.UserInfo?.permission
        ?.filter((x: string) => x.startsWith(imgSizeTag))
        .map((x: string) => Number(x.substring(imgSizeTag.length))) || []),
    );
  }

  @observable
  static ResTypeMap;

  //#endregion

  @observable
  private _ResType: CWResourceTypes;
  public get ResType(): CWResourceTypes {
    return this._ResType;
  }
  public set ResType(v: CWResourceTypes) {
    this._ResType = v;
  }

  @observable
  private _File: File;
  public get File(): File {
    return this._File;
  }
  public set File(v: File) {
    this._File = v;
  }

  private _FileData: ArrayBuffer;
  public get FileData(): ArrayBuffer {
    return this._FileData;
  }
  public set FileData(v: ArrayBuffer) {
    this._FileData = v;
  }

  @observable
  private _ImgBase64: string;
  public get ImgBase64(): string {
    return this._ImgBase64;
  }
  public set ImgBase64(v: string) {
    this._ImgBase64 = v;
  }

  @observable
  static _Files: FileList;
  static get Files(): FileList {
    return UploadFileInfo._Files;
  }
  static set Files(v: FileList) {
    UploadFileInfo._Files = v;
  }

  @observable
  static _Type: string;
  static get Type(): string {
    return UploadFileInfo._Type;
  }
  static set Type(v: string) {
    UploadFileInfo._Type = v;
  }

  @observable
  private _CanUpload: boolean = true;
  public get CanUpload(): boolean {
    return this._CanUpload;
  }
  public set CanUpload(v: boolean) {
    this._CanUpload = v;
  }

  arrayBufferToBase64(buffer) {
    var binary = '';
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  private _FileSize: number;
  public get FileSize(): number {
    return this._FileSize;
  }
  public set FileSize(v: number) {
    this._FileSize = v;
  }

  private _Duration: number;
  public get Duration(): number {
    return this._Duration;
  }
  public set Duration(v: number) {
    this._Duration = v;
  }

  @observable
  private _ImgWidth: number;
  public get ImgWidth(): number {
    return this._ImgWidth;
  }
  public set ImgWidth(v: number) {
    this._ImgWidth = v;
  }

  @observable
  private _ImgHeight: number;
  public get ImgHeight(): number {
    return this._ImgHeight;
  }
  public set ImgHeight(v: number) {
    this._ImgHeight = v;
  }

  @observable
  private _SkFile: File;
  public get SkFile(): File {
    return this._SkFile;
  }
  public set SkFile(v: File) {
    this._SkFile = v;
  }

  private _SkFileData: ArrayBuffer;
  public get SkFileData(): ArrayBuffer {
    return this._SkFileData;
  }
  public set SkFileData(v: ArrayBuffer) {
    this._SkFileData = v;
  }

  @observable
  private _TxFile: File;
  public get TxFile(): File {
    return this._TxFile;
  }
  public set TxFile(v: File) {
    this._TxFile = v;
  }

  private _TxFileData: ArrayBuffer;
  public get TxFileData(): ArrayBuffer {
    return this._TxFileData;
  }
  public set TxFileData(v: ArrayBuffer) {
    this._TxFileData = v;
  }

  @observable
  private _SkActions: string[];
  public get SkActions(): string[] {
    return this._SkActions;
  }
  public set SkActions(v: string[]) {
    this._SkActions = v;
  }

  @observable
  private _BoneMD5: string;
  public get BoneMD5(): string {
    return this._BoneMD5;
  }
  public set BoneMD5(v: string) {
    this._BoneMD5 = v;
  }

  @observable
  private _MD5: string;
  public get MD5(): string {
    return this._MD5;
  }
  public set MD5(v: string) {
    this._MD5 = v;
  }

  public get DirId(): number {
    return this.DirPath && this.DirPath.length > 0
      ? this.DirPath[this.DirPath.length - 1]
      : null;
  }

  @observable
  private _DirPath: number[];
  public get DirPath(): number[] {
    return this._DirPath;
  }
  public set DirPath(v: number[]) {
    this._DirPath = v;
    if (v && v.length > 0) {
      this.UploadErrors.delete(UploadError.DirIdNotSetError);
    }
  }

  @observable
  private _ResName: string;
  /** 资源名称 */
  public get ResName(): string {
    return this._ResName;
  }
  public set ResName(v: string) {
    this._ResName = v;
  }

  @observable
  private _Tags: string[];
  /**
   * 标签
   */
  public get Tags(): string[] {
    return this._Tags;
  }
  public set Tags(v: string[]) {
    this._Tags = v;
  }

  @observable
  private _CaptionsLang: string = undefined;
  /**
   * 字幕语言
   */
  public get CaptionsLang(): string {
    return this._CaptionsLang;
  }
  public set CaptionsLang(v: string) {
    this._CaptionsLang = v;
  }

  @observable
  private _AudioCaptionsLang: string = null;
  /**
   * 字幕音频
   */
  public get AudioCaptionsLang(): string {
    return this._AudioCaptionsLang;
  }
  public set AudioCaptionsLang(v: string) {
    this._AudioCaptionsLang = v;
  }

  @observable
  private _UploadProcess: number = 0;
  public get UploadProcess(): number {
    return this._UploadProcess;
  }
  public set UploadProcess(v: number) {
    this._UploadProcess = v;
  }

  @observable
  private _IsSelected: boolean = false;
  public get IsSelected(): boolean {
    return this._IsSelected;
  }
  public set IsSelected(v: boolean) {
    this._IsSelected = v;
  }

  @observable
  private _UploadErrors: Set<number> = new Set<number>();
  public get UploadErrors(): Set<number> {
    return this._UploadErrors;
  }
  public set UploadErrors(v: Set<number>) {
    this._UploadErrors = v;
  }

  protected uploadErrorChanged = reaction(
    () => Array.from(this.UploadErrors).map(x => x),
    errors => {
      if (errors && errors.length > 0) this.State = UploadState.Error;
      else this.State = UploadState.Preparing;
    },
  );
  @observable
  private _SameResObj: any;
  public get SameResObj(): any {
    return this._SameResObj;
  }
  public set SameResObj(v: any) {
    this._SameResObj = v;
  }

  @observable
  private _State: UploadState = UploadState.Preparing;
  public get State(): UploadState {
    return this._State;
  }
  public set State(v: UploadState) {
    this._State = v;
  }

  @observable
  VideoCanPlayChecked = false;

  //#region 分析与找错

  AnalysisInfos() {
    this.AnalysisFileName();
    if (this.ResType == CWResourceTypes.Captions) {
      this.checkCaptionsLang(true);
    } else if (this.ResType == CWResourceTypes.Audio) {
      this.checkCaptionsLang(true);
    }
    // 资源大小检测
    this.checkFileSize();
    //图片分辨率大小测试
    let imgDip =
      CacheHelper.UserInfo?.permission
        ?.filter((x: string) => x.startsWith(imgDipTag))
        .map((x: string) => x.substring(imgDipTag.length))
        .toString()
        .split('#') || [];
    console.log('imgDip', imgDip);

    //动画分辨率大小检测
    let skDip =
      CacheHelper.UserInfo?.permission
        ?.filter((x: string) => x.startsWith(skDipTag))
        .map((x: string) => x.substring(skDipTag.length))
        .toString()
        .split('#') || [];

    if (this.ResType == CWResourceTypes.Image)
      this.checkImageSize(
        this.File,
        imgDip[0] ? imgDip[0] : 1920,
        imgDip[1] ? imgDip[1] : 1080,
        UploadError.ImgSizeError,
        this.setImgSize.bind(this),
      );
    else if (this.ResType == CWResourceTypes.SkeletalAni) {
      this.checkImageSize(
        this.File,
        skDip[0] ? skDip[0] : 1920,
        skDip[1] ? skDip[1] : 1080,
        UploadError.ImgSizeError,
        this.setImgSize.bind(this),
      );
      this.checkImageSize(
        this.TxFile,
        skDip[0] ? skDip[0] : 2048,
        skDip[1] ? skDip[1] : 2048,
        UploadError.SkTextureSizeError,
      );
    }
    this.checkSameFileInServer();
  }

  AnalysisFileName() {
    if (this.File) {
      var originFileName =
        this.ResType == CWResourceTypes.SkeletalAni
          ? this.TxFile?.name
          : this.File?.name;
      if (originFileName) {
        var extensionStartIndex = originFileName.lastIndexOf('.');
        var pureFileName = originFileName.substr(0, extensionStartIndex);
        var splitedFileName = pureFileName.split(' ');
        if (splitedFileName.length > 0 && splitedFileName[0]) {
          this.ResName = splitedFileName[0].trim();
          if (splitedFileName.length > 1) {
            this.Tags = [];
            for (var i = 1; i < splitedFileName.length; i++) {
              var tagstr = splitedFileName[i].trim();
              if (tagstr) {
                this.Tags.push(tagstr);
              }
            }
          }
        } else {
          //push filenameError into ErrorQueue
          this.UploadErrors.add(UploadError.FileNameError);
        }
      }
    }
  }

  public checkCaptionsLang(isAudio: boolean = false) {
    if (isAudio) {
      var lang = '';
      if (this.Tags != null && this.Tags.length > 0) {
        lang = this.Tags[0];
        this.AudioCaptionsLang = lang;
      }
    } else {
      var lang = '';
      var isLangIllegal = false;
      if (this.Tags != null && this.Tags.length > 0) {
        lang = this.Tags[0];
        this.CaptionsLang = lang;
        var langCodeList = CacheHelper.LanguageCodeList;
        isLangIllegal =
          langCodeList?.map(x => x.configKey)?.find(x => x == lang) == null;
      }
      if (isLangIllegal || !lang) {
        this.UploadErrors.add(UploadError.CaptionLangError);
      }
    }
  }

  checkFileSize() {
    var fileSize = this.File?.size || 0;
    this.FileSize = fileSize;
    if (this.ResType == CWResourceTypes.Video) {
      if (fileSize / 1024 / 1024 > UploadFileInfo.VideoFileSize) {
        this.UploadErrors.add(UploadError.VideoFileSizeError);
      }
    } else if (this.ResType == CWResourceTypes.Audio) {
      if (fileSize / 1024 / 1024 > UploadFileInfo.AudioFileSize) {
        this.UploadErrors.add(UploadError.AudioFileSizeError);
      }
    } else if (this.ResType == CWResourceTypes.SkeletalAni) {
      var skFileSize = this.SkFile?.size || 0;
      var txFileSize = this.TxFile?.size || 0;
      this.FileSize += skFileSize + txFileSize;
      if (
        fileSize / 1024 / 1024 > UploadFileInfo.SkFileSize ||
        skFileSize / 1024 / 1024 > UploadFileInfo.SkFileSize ||
        txFileSize / 1024 / 1024 > UploadFileInfo.SkFileSize
      ) {
        this.UploadErrors.add(UploadError.FileSizeError);
      }
    } else if (this.ResType == CWResourceTypes.Image) {
      if (fileSize / 1024 / 1024 > UploadFileInfo.ImgFileSize) {
        this.UploadErrors.add(UploadError.FileSizeError);
      }
    } else {
      if (fileSize / 1024 / 1024 > smallFileSize) {
        this.UploadErrors.add(UploadError.FileSizeError);
      }
    }
  }

  checkImageSize(
    file: File,
    maxWidth: number = 1920,
    maxHeight: number = 1080,
    error: UploadError = UploadError.ImgSizeError,
    callback?: (width: number, height: number) => void,
  ) {
    var img = new Image();
    // 改变图片的src
    img.src = URL.createObjectURL(file);

    // 判断是否有缓存
    if (img.complete) {
      // 打印
      if (img.width > maxWidth || img.height > maxHeight)
        this.UploadErrors.add(error);
      callback?.(img.width, img.height);
    } else {
      // 加载完成执行
      var imgOnload = () => {
        img.onload = null;
        if (img.width > maxWidth || img.height > maxHeight)
          this.UploadErrors.add(error);
        callback?.(img.width, img.height);
      };
      img.onload = imgOnload.bind(this);
    }
  }

  setImgSize(w: number, h: number) {
    this.ImgWidth = w;
    this.ImgHeight = h;
  }

  checkSameFileInServer() {
    HttpService.MD5ServerValid([this.MD5]).then(response => {
      if (response && response.code == '0') {
        if (response.data != null && response.data.length > 0) {
          var existres = response.data[0];
          if (existres != null) {
            this.UploadErrors.add(UploadError.FileSameError);
            this.SameResObj = plainToClass(CWResource, existres);
            return;
          }
        }
      } else {
        this.UploadErrors.add(UploadError.RecordFailError);
      }
    });
  }

  checkHasDirId() {
    this.UploadErrors.delete(UploadError.DirIdNotSetError);
    if (this.DirId == null) {
      this.UploadErrors.add(UploadError.DirIdNotSetError);
    }
  }
  checkSkActionRead() {
    this.UploadErrors.delete(UploadError.SkNoActionError);
    if (
      this.ResType == CWResourceTypes.SkeletalAni &&
      (this.SkActions == null || this.SkActions.length == 0)
    ) {
      this.UploadErrors.add(UploadError.SkNoActionError);
    }
  }

  iniPreview() {
    switch (this.ResType) {
      case CWResourceTypes.Image:
      case CWResourceTypes.SkeletalAni:
        //this.ImgBase64 = this.arrayBufferToBase64(this.FileData);
        break;
      case CWResourceTypes.Audio:
        break;
      case CWResourceTypes.Video:
        break;
    }
  }

  //#endregion

  //#region 上传
  private uploadtimeout = null;

  private uploadResInfo = null;

  tryStartUpload(): void {
    this.checkHasDirId();
    this.checkSkActionRead();
    this.checkCaptionsFile();
    setTimeout(() => {
      if (!this.CanUpload) return;
      this.UploadProcess = 0.0;

      var onlyRecord = false;
      if (
        this.UploadErrors.has(UploadError.RecordFailError) &&
        !this.UploadErrors.has(UploadError.UploadFailError)
      ) {
        onlyRecord = true;
      }

      this.UploadErrors.delete(UploadError.RecordFailError);
      this.UploadErrors.delete(UploadError.UploadFailError);

      if (this.UploadErrors != null && this.UploadErrors.size > 0) {
        this.State = UploadState.Error;
      } else if (
        this.State != UploadState.Uploading &&
        this.State != UploadState.Complete
      ) {
        this.State = UploadState.Uploading;
        this.uploadtimeout = setTimeout(
          (() => {
            if (this.State == UploadState.Uploading) {
              this.State = UploadState.Error;
              this.UploadErrors.add(UploadError.UploadFailError);
            }
          }).bind(this),
          5 * 60 * 1000,
        ); //开始上传，若是超时自动放入上传失败错误
        if (this.ResType != CWResourceTypes.SkeletalAni) {
          this.uploadSingleFile(onlyRecord && this.uploadResInfo != null).then(
            this.clearUploadTimeout.bind(this),
          );
        } else {
          this.uploadSkFiles(onlyRecord && this.uploadResInfo != null).then(
            this.clearUploadTimeout.bind(this),
          );
        }
      }
    }, 500);
  }

  checkCaptionsFile() {
    let files = UploadFileInfo.Files;
    let type = UploadFileInfo.Type;
    let _files = Array.from(files);
    if (type == '字幕') {
      _files.map((fileItem, key) => {
        let reader = new FileReader();
        reader.readAsText(fileItem);

        const askm = ['ISO-8859-1', 'UTF-8'];
        reader.onload = e => {
          // 检查字幕编码格式是否为utf-8
          if (!askm.includes(chardet.detect(Buffer.from(e.target.result)))) {
            console.log(
              '编码格式',
              chardet.detect(Buffer.from(e.target.result)),
            );
            message.warning(
              `${fileItem.name}字幕编码格式不对，请设置为UTF-8编码格式`,
            );
            this.CanUpload = false;
            return;
          }

          let arr = e.target.result.toString().split('\n');
          let arr1 = arr.shift();

          if (arr1.toString().trim() != 'WEBVTT') {
            message.warning(`${fileItem.name}不是WEBVTT字幕, 请重新设置`);
            this.CanUpload = false;
            return;
          }

          // 存储字幕的对象
          let newArr = [];
          for (let i = 0; i < arr.length; i++) {
            const line = arr[i];
            const lineArr = line.split(' ');
            if (
              lineArr[0].includes(':') &&
              lineArr[lineArr.length - 1].includes(':')
            ) {
              newArr.push({
                id: arr[i - 1],
                startTime: lineArr[0].trim(),
                endTime: lineArr[lineArr.length - 1].trim(),
                timestr: line,
                us: arr[i + 1],
                ch: arr[i + 2],
              });
            }
          }
          let reg = /^([01]\d|2[0-3]):[0-5]\d:[0-5]\d\.\d\d\d$/;
          newArr.map((item, index) => {
            if (
              !item.id ||
              item.id == '\r' ||
              item.id == '\n' ||
              item.id == '\r\n'
            ) {
              message.warning(
                `${fileItem.name}第${index + 1}条字幕没有序号，请重新设置`,
              );
              this.CanUpload = false;
              return;
            }

            if (!reg.test(item.startTime)) {
              message.warning(
                `${fileItem.name}第${index +
                  1}条字幕开始时间格式不对，请参照00:00:06.760设置`,
              );
              this.CanUpload = false;
              return;
            }

            if (!reg.test(item.endTime)) {
              message.warning(
                `${fileItem.name}第${index +
                  1}条字幕结束时间格式不对，请参照00:00:06.760设置`,
              );
              this.CanUpload = false;
              return;
            }

            if (!item.timestr.includes('-->')) {
              message.warning(
                `${fileItem.name}第${index +
                  1}条字幕时间格式不对， 缺少-->，请参照00:00:17.900 --> 00:00:20.780设置`,
              );
              this.CanUpload = false;
              return;
            }
          });
        };
      });
    }
  }

  clearUploadTimeout() {
    if (this.uploadtimeout) clearTimeout(this.uploadtimeout);
  }

  async uploadSingleFile(onlyRecord: boolean = false) {
    if (this.File != null) {
      var oss_result = null;
      if (!onlyRecord) {
        var resFile = new ResFile();
        resFile.file = this.File;
        resFile.filetype = UploadFileInfo.getFileExtension(this.File.name);
        oss_result = await UpLoadFileHelper.UploadFile(
          resFile,
          //  p => {
          //   console.log(p);
          //   this.UploadProcess = p;
          // }
        );
      }
      this.UploadProcess = 0.7;
      if ((oss_result && oss_result.resourceKey) || onlyRecord) {
        //字幕音频 拿到语言类型
        var captionsLanguage = null;
        var language: string;
        if (this.AudioCaptionsLang != null) {
          switch (this.AudioCaptionsLang) {
            case 'zh-CN':
              captionsLanguage = {
                tencentSubtitleReq: {
                  language: 1,
                },
              };
              language = 'zh-CN';
              break;
            case 'en-US':
              captionsLanguage = {
                tencentSubtitleReq: {
                  language: 2,
                },
              };
              language = 'en-US';
            case 'zh-CN_en-US':
              captionsLanguage = {
                tencentSubtitleReq: {
                  language: 3,
                },
              };
              language = 'zh-CN_en-US';
              break;
          }
        }

        //上传成功，有Url,开始记录url
        var recordResObj = onlyRecord
          ? this.uploadResInfo
          : {
              resourceName: this.ResName,
              resourceType: this.ResType,
              resourceSize: this.FileSize,
              resourceId: IdHelper.NewId(),
              resourceKey: oss_result.resourceKey,
              resourceMd5: this.MD5,
              width: this.ImgWidth,
              height: this.ImgHeight,
              directoryId: this.DirId,
              duration: this.Duration,
              labelNames: this.Tags,
              language,
              ...captionsLanguage,
            };
        this.uploadResInfo = recordResObj;
        var recordResponse = await HttpService.AddResource(recordResObj);
        if (recordResponse && recordResponse.code == '0') {
          this.UploadProcess = 1.0;
          this.State = UploadState.Complete;
          console.log(`上传成功：${recordResObj.resourceKey}`);
        } else {
          this.State = UploadState.Error;
          this.UploadErrors.add(UploadError.RecordFailError); //记录
        }
      } else {
        this.State = UploadState.Error;
        this.UploadErrors.add(UploadError.UploadFailError); //上传失败
      }
    }
  }

  async uploadSkFiles(onlyRecord: boolean = false) {
    if (this.File != null && this.SkFile != null && this.TxFile != null) {
      var tb_oss_result = null;
      var sk_oss_result = null;
      var tx_oss_result = null;
      if (!onlyRecord) {
        var tbFile = new ResFile();
        tbFile.file = this.File;
        tbFile.filetype = UploadFileInfo.getFileExtension(this.File.name);
        tb_oss_result = await UpLoadFileHelper.UploadFile(tbFile);
        this.UploadProcess = 0.2;

        var skFile = new ResFile();
        skFile.file = this.SkFile;
        skFile.filetype = UploadFileInfo.getFileExtension(this.SkFile.name);
        sk_oss_result = await UpLoadFileHelper.UploadFile(skFile);
        this.UploadProcess = 0.45;

        var txFile = new ResFile();
        txFile.file = this.TxFile;
        txFile.filetype = UploadFileInfo.getFileExtension(this.TxFile.name);
        tx_oss_result = await UpLoadFileHelper.UploadFile(txFile);
      }
      this.UploadProcess = 0.7;
      if (
        (tb_oss_result &&
          tb_oss_result.resourceKey &&
          sk_oss_result &&
          sk_oss_result.resourceKey &&
          tx_oss_result &&
          tx_oss_result.resourceKey) ||
        onlyRecord
      ) {
        //上传成功，有Url,开始记录url
        var recordResObj = onlyRecord
          ? this.uploadResInfo
          : ({
              resourceName: this.ResName,
              resourceType: this.ResType,
              resourceSize: this.FileSize,
              resourceId: IdHelper.NewId(),
              resourceKey: tb_oss_result.resourceKey,
              boneSource: tx_oss_result.resourceKey,
              boneJs: sk_oss_result.resourceKey,
              boneMd5: this.BoneMD5,
              resourceMd5: this.MD5,
              width: this.ImgWidth,
              height: this.ImgHeight,
              directoryId: this.DirId,
              labelNames: this.Tags,
              boneList: this.SkActions?.map(x =>
                Object.assign(new BoneDic(), { name: x, value: x }),
              ),
            } as CWResource);
        this.uploadResInfo = recordResObj;
        var recordResponse = await HttpService.AddResource(recordResObj);
        if (recordResponse && recordResponse.code == '0') {
          this.State = UploadState.Complete;
          this.UploadProcess = 1.0;
          console.log(`上传成功：${recordResObj.resourceKey}`);
        } else {
          this.State = UploadState.Error;
          this.UploadErrors.add(UploadError.RecordFailError); //记录
        }
      } else {
        this.State = UploadState.Error;
        this.UploadErrors.add(UploadError.UploadFailError); //上传失败
      }
    }
  }

  //#endregion
  //#region 删除

  //#endregion

  //#region 静态函数
  static fetchResDics() {
    HttpService.fetchResDics().then((data: any[]) => {
      data?.forEach(d => removeEmptyVoList(d));
      UploadFileInfo.ResDics = data;
    });
    HttpService.fetchResDicTypeMap().then(data => {
      UploadFileInfo.ResTypeMap = data;
    });
  }

  static getTypeAcceptFileExtension(typename: string) {
    var accept = '';
    switch (typename) {
      case imgTypeName:
        accept = '.jpg,.jpeg,.png';
        break;
      case audioTypeName:
        accept = '.mp3';
        break;
      case videoTypeName:
        accept = '.mp4';
        break;
      case skTypeName:
        accept = '.png,.1.png,.sk';
        break;
      case captionsTypeName:
        accept = '.vtt';
        break;
      default:
        break;
    }
    return accept;
  }

  static getFileExtension(filename: string) {
    var extensionStartIndex = filename.lastIndexOf('.');
    var pureFileName = filename.substr(0, extensionStartIndex);
    var extension = filename
      .substr(extensionStartIndex, filename.length - extensionStartIndex)
      .toLowerCase();
    return extension;
  }

  static getResType(typename: string): CWResourceTypes {
    var result = CWResourceTypes.Image;
    switch (typename) {
      case imgTypeName:
        result = CWResourceTypes.Image;
        break;
      case audioTypeName:
        result = CWResourceTypes.Audio;
        break;
      case videoTypeName:
        result = CWResourceTypes.Video;
        break;
      case skTypeName:
        result = CWResourceTypes.SkeletalAni;
        break;
      case captionsTypeName:
        result = CWResourceTypes.Captions;

        break;
    }
    return result;
  }

  static ReadFileData(
    file: File,
    callback: (data: ArrayBuffer, file: File, ...params: any[]) => void,
    ...params: any[]
  ) {
    var reader = new FileReader();
    var fileLoaded = (ev: ProgressEvent<FileReader>) => {
      reader.removeEventListener('load', fileLoaded);
      callback(reader.result as ArrayBuffer, file, ...(params || []));
    };
    reader.addEventListener('load', fileLoaded);
    reader.readAsArrayBuffer(file);
  }

  static AddUploadFileInfos(
    files: FileList,
    type: string,
    fileInfoArray: UploadFileInfo[],
    fatherView?: UploadListArea,
  ) {
    UploadFileInfo.Type = type;
    UploadFileInfo.Files = files;

    fileInfoArray?.forEach(x => (x.IsSelected = false));
    if (files) {
      var _files = Array.from(files);
      var typeCheckedFiles = _files.filter(x => {
        var result = true;
        var name = x.name.toLowerCase();
        switch (type) {
          case imgTypeName:
            result =
              name.endsWith('.jpg') ||
              name.endsWith('.jpeg') ||
              name.endsWith('.png');
            break;
          case audioTypeName:
            result = name.endsWith('.mp3');
            break;
          case videoTypeName:
            result = name.endsWith('.mp4');
            break;
          case skTypeName:
            result = name.endsWith('.png') || name.endsWith('.sk');
            break;
          case captionsTypeName:
            result = name.endsWith('.vtt');
            break;
        }
        return result;
      });
      if (type != skTypeName) {
        for (var file of typeCheckedFiles) {
          UploadFileInfo.ReadFileData(file, (data, _file) => {
            var tempdata = new Uint8Array(data);
            var _md5 = md5(tempdata);
            if (fileInfoArray) {
              var exsitFile = fileInfoArray.find(
                existInfo => existInfo.MD5 == _md5,
              );
              if (exsitFile == null) {
                var result = new UploadFileInfo();
                result.File = _file;
                result.ResType = UploadFileInfo.getResType(type);
                result.MD5 = _md5;
                // if (type == imgTypeName)//Video Audio不靠这个播
                //   result.FileData = data;
                fileInfoArray.push(result);
                result.AnalysisInfos();
                result.iniPreview();
                result.IsSelected = true;
                if (fatherView) fatherView.isShowDirSelector = true;
              }
            }
          });
        }
        // return typeCheckedFiles.filter(x => (fileInfoArray || []).find(existInfo => existInfo.File == x) == null).map(x => Object.assign(new UploadFileInfo(), { File: x, ResType: UploadFileInfo.getResType(type) }));
      } else {
        //读入归纳分析骨骼文件
        var fileMaps = new Map<string, { type: string; file: File }[]>();
        for (var file of typeCheckedFiles) {
          var originFileName = file.name;
          var extensionStartIndex = originFileName.lastIndexOf('.');
          var pureFileName = originFileName.substr(0, extensionStartIndex);
          var extension = UploadFileInfo.getFileExtension(originFileName);
          if (pureFileName.endsWith('.1')) {
            pureFileName = pureFileName.substr(0, pureFileName.length - 2);
            extension = '.1'.concat(extension);
          }
          if (!fileMaps.has(pureFileName)) fileMaps.set(pureFileName, []);
          var group = fileMaps.get(pureFileName);
          group.push({ type: extension, file: file });
        }
        fileMaps.forEach((v, k) => {
          if (v && v.length == 3) {
            var sk = v.find(x => x.type == '.sk');
            var tx = v.find(x => x.type == '.png');
            var img = v.find(x => x.type == '.1.png');
            if (sk && tx && img) {
              var result = new UploadFileInfo();
              result.ResType = UploadFileInfo.getResType(type);
              result.SkFile = sk.file;
              result.TxFile = tx.file;
              result.File = img.file;
              var checkAllFileRead = (fileInfo: UploadFileInfo) => {
                if (
                  fileInfo.FileData &&
                  fileInfo.TxFileData &&
                  fileInfo.SkFileData
                ) {
                  var tbMD5 = md5(new Uint8Array(fileInfo.FileData));
                  var skMD5 = md5(new Uint8Array(fileInfo.SkFileData));
                  var txMD5 = md5(new Uint8Array(fileInfo.TxFileData));

                  var longMD5 = `${tbMD5}${skMD5}${txMD5}`;
                  var wholeMD5 = md5(longMD5);

                  fileInfo.BoneMD5 = longMD5;
                  fileInfo.MD5 = wholeMD5;

                  if (fileInfoArray) {
                    var exsitFile = fileInfoArray.find(
                      existInfo => existInfo.MD5 == fileInfo.MD5,
                    );
                    if (exsitFile == null) {
                      fileInfo.ResType = UploadFileInfo.getResType(type);

                      fileInfoArray.push(fileInfo);
                      fileInfo.AnalysisInfos();
                      fileInfo.iniPreview();
                      fileInfo.IsSelected = true;
                      if (fatherView) fatherView.isShowDirSelector = true;
                    }
                  }
                }
              };

              UploadFileInfo.ReadFileData(
                result.File,
                (data, _file, fileInfo: UploadFileInfo) => {
                  fileInfo.FileData = data;
                  checkAllFileRead(fileInfo);
                },
                result,
              );
              UploadFileInfo.ReadFileData(
                result.TxFile,
                (data, _file, fileInfo: UploadFileInfo) => {
                  fileInfo.TxFileData = data;
                  checkAllFileRead(fileInfo);
                },
                result,
              );
              UploadFileInfo.ReadFileData(
                result.SkFile,
                (data, _file, fileInfo: UploadFileInfo) => {
                  fileInfo.SkFileData = data;
                  checkAllFileRead(fileInfo);
                },
                result,
              );
            }
          }
        });
      }
    }
    // return null;
  }

  static DelUploadFileInfos(
    fileInfoArray: UploadFileInfo[],
    fileInfo: UploadFileInfo,
  ) {
    if (fileInfoArray.includes(fileInfo)) {
      fileInfoArray.splice(fileInfoArray.indexOf(fileInfo), 1);
    }
  }

  //#endregion
}
