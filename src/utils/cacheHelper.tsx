import { action, runInAction, observable } from 'mobx';
import HttpService from '@/server/httpServer';

export default class CacheHelper {
  private static _UserInfo: any;
  public static get UserInfo(): any {
    return this._UserInfo;
  }
  public static set UserInfo(v: any) {
    this._UserInfo = v;
  }

  private static _FontList: any[];
  public static get FontList(): any[] {
    if (!this._FontList) CacheHelper.GetFontLibrary();
    return this._FontList;
  }
  public static set FontList(v: any[]) {
    this._FontList = v;
  }

  private static _LanguageCodeList: any[];
  public static get LanguageCodeList(): any[] {
    return this._LanguageCodeList;
  }
  public static set LanguageCodeList(v: any[]) {
    this._LanguageCodeList = v;
  }

  private static _CaptionLanguage: any[];
  public static get CaptionLanguage(): any[] {
    return this._CaptionLanguage;
  }
  public static set CaptionLanguage(v: any[]) {
    this._CaptionLanguage = v;
  }

  @observable
  private static _BuList: any[];
  public static get BuList(): any[] {
    return this._BuList;
  }
  public static set BuList(v: any[]) {
    this._BuList = v;
  }

  @action static GetFontLibrary = async () => {
    let data = await HttpService.getFontList();
    runInAction(() => {
      if (data) {
        CacheHelper.FontList = data;
      }
    });
  };

  @action static GetBuList = async (bu: number) => {
    if (!CacheHelper.BuList) {
      let data = await HttpService.getBuList();
      runInAction(() => {
        if (data) {
          let budata = (data as any[]).find(p => p.bu == bu);
          CacheHelper.BuList = [];
          budata?.pageTypes?.forEach(item => {
            CacheHelper.BuList.push(item);
          });
        }
      });
    }
  };

  @action static GetCategoryConfigList = async (dicNames: string[]) => {
    let data = await HttpService.getCategoryConfigList(dicNames);
    runInAction(() => {
      if (data) {
        CacheHelper.MessageModeList = [];
        CacheHelper.ReceiveMessageList = [];
        CacheHelper.DifficultyLevelList = [];
        CacheHelper.SymbolList = [];
        CacheHelper.LanguageCodeList = [];
        CacheHelper.CaptionLanguage = [];

        let newdata = data.sort((obj1, obj2) => {
          var val1 = obj1.orderBit;
          var val2 = obj2.orderBit;
          if (val1 < val2) {
            return -1;
          } else if (val1 > val2) {
            return 1;
          } else {
            return 0;
          }
        });
        newdata.forEach(item => {
          switch (item.category) {
            case 'SendMessage':
              CacheHelper.MessageModeList.push(item);
              break;
            case 'SendMessageAI':
              CacheHelper.MessageModeList.push(item);
              break;
            case 'ReceiveMessage':
              CacheHelper.ReceiveMessageList.push(item);
              break;
            case 'DifficultyLevel':
              CacheHelper.DifficultyLevelList.push(item);
              break;
            case 'SingleParamCalc':
              CacheHelper.SymbolList.push(item);
              break;
            case 'LanguageCode':
              CacheHelper.LanguageCodeList.push(item);
              break;
            case 'CaptionLanguage':
              CacheHelper.CaptionLanguage.push(item);
              break;
          }
        });
      }
    });
  };

  //消息发送器-消息键值队列
  private static _MessageModeList: any[];
  public static get MessageModeList(): any[] {
    return this._MessageModeList;
  }
  public static set MessageModeList(v: any[]) {
    this._MessageModeList = v;
  }

  //当消息队列为2时，IP动效配置显示该队列参数，此处为写死
  private static _DifficultyLevelList: any[];
  public static get DifficultyLevelList(): any[] {
    return this._DifficultyLevelList;
  }
  public static set DifficultyLevelList(v: any[]) {
    this._DifficultyLevelList = v;
  }

  //消息接收器
  private static _ReceiveMessageList: any[];
  public static get ReceiveMessageList(): any[] {
    return this._ReceiveMessageList;
  }
  public static set ReceiveMessageList(v: any[]) {
    this._ReceiveMessageList = v;
  }

  //单值计算器
  private static _SymbolList: any[];
  public static get SymbolList(): any[] {
    return this._SymbolList;
  }
  public static set SymbolList(v: any[]) {
    this._SymbolList = v;
  }

  public static dataURLtoBlob(dataurl) {
    var arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  }

  public static ConvertSize(resourceSize: number) {
    if (!resourceSize) {
      return 0;
    } else if (resourceSize < 1048576)
      return (resourceSize / 1024).toFixed(2) + 'K';
    else if (resourceSize < 1073741824)
      return (resourceSize / 1048576).toFixed(2) + 'M';
    else return (resourceSize / 1073741824).toFixed(2) + 'G';
  }
}
