import { PureComponent } from 'react';
import CWSubstance, { SaveLog } from '@/modelClasses/courseDetail/cwSubstance';
import { inject, observer } from 'mobx-react';
import React from 'react';
import TextArea from 'antd/lib/input/TextArea';
import { EditableTagGroup } from '@/components/controls/editableTagGroup';
import { node } from 'prop-types';
import { Slider, Cascader } from 'antd';
import { action, runInAction, observable } from 'mobx';
import HttpService from '@/server/httpServer';
import { removeEmptyVoList } from '@/models/designres';
import CWResource from '@/modelClasses/courseDetail/cwResource';
import { CWResourceTypes } from '@/modelClasses/courseDetail/courseDetailenum';
import IdHelper from '@/utils/idHelper';
import md5 from 'md5';
import { any } from 'linq-to-typescript';
import LayoutHeader from '@/pages/head';
// @inject('courseware')
@observer
export default class UploadVoiceView extends React.Component<any, any> {
  constructor(props) {
    super(props);
  }
  //#region 属性

  // @observable
  // ButtonText: string = '合成音频';

  @observable
  private _ButtonText: string = '合成音频';
  public get ButtonText(): string {
    return this._ButtonText;
  }
  public set ButtonText(v: string) {
    this.TimbreErrorText = '';
    this._ButtonText = v;
  }

  @observable
  TimbreErrorText: string = '';

  @observable
  MediaUrl: string = '';

  @observable
  resourceTypeList: any[];

  //存储位置
  @observable
  directoryId: any;

  //音频名称
  @observable
  ResourceName: string;

  标签;
  @observable
  NewKeywordText: string[] = [];

  // @observable
  // private _NewKeywordText: string[];
  // public get NewKeywordText(): string[] {
  //   return this._NewKeywordText;
  // }
  // public set NewKeywordText(v: string[]) {
  //   console.log(JSON.stringify(v));
  //   this._NewKeywordText = v;
  // }

  @observable
  private _SynthesisText: string = '';
  //合成文字
  public get SynthesisText(): string {
    return this._SynthesisText;
  }
  public set SynthesisText(v: string) {
    this.ButtonText = '合成音频';
    this._SynthesisText = v;
  }

  @observable
  private _Volume: number = 100;
  //音量
  public get Volume(): number {
    return this._Volume;
  }
  public set Volume(v: number) {
    this.ButtonText = '合成音频';
    this._Volume = v;
  }

  @observable
  private _Speed: number = 1.2;
  //语速
  public get Speed(): number {
    return this._Speed;
  }
  public set Speed(v: number) {
    this.ButtonText = '合成音频';
    this._Speed = v;
  }

  //#region 音色相关

  @observable
  private _SelectedVoiceName: any;
  //选中的音色名称
  public get SelectedVoiceName(): any {
    return this._SelectedVoiceName;
  }
  public set SelectedVoiceName(v: any) {
    this.ButtonText = '合成音频';
    this._SelectedVoiceName = v;
  }

  @observable
  VoicesList: Array<any>; //音色集合

  @observable
  VoiceName: Array<any> = new Array<any>(); //音色集合

  @observable
  VoiceType: Array<string> = new Array<string>(); //声音类型

  @observable
  private _SelectedTimbreValue: string;
  //选中的音色
  public get SelectedTimbreValue(): string {
    return this._SelectedTimbreValue;
  }
  public set SelectedTimbreValue(v: string) {
    this._SelectedTimbreValue = v;

    this.VoiceName = new Array<string>();
    this.VoicesList.forEach(item => {
      if (v == item.typeSex) {
        this.VoiceName.push(item);
      }
    });
    if (this.VoiceName.length >= 1) {
      this.SelectedVoiceName = this.VoiceName[0];
    }
  }

  //#endregion

  //#endregion

  //#region  方法
  @action GetVoicesAsync = async () => {
    var voices_response = await HttpService.GetVoices();
    runInAction(() => {
      if (voices_response) {
        this.VoicesList = voices_response;
        this.VoicesList.forEach(item => {
          if (this.VoiceType.filter(x => x == item.typeSex).length < 1) {
            this.VoiceType.push(item.typeSex);
          }
        });
        this.SelectedTimbreValue = '女童';
        //this.SelectedTimbreValue = this.SelectedVoiceName.typeSex;
        // var _selectedVoiceName = this.VoiceName.filter(x=>x.id == this.SelectedVoiceName.id);
        // if (_selectedVoiceName != null)
        //     this.SelectedVoiceName = _selectedVoiceName;
        // else if (this.VoiceName != null && this.VoiceName.length >= 1)
        //     this.SelectedVoiceName = this.VoiceName[0];
      }
    });
  };

  @action TimbreSynthesisCommand = async () => {
    if (this.ButtonText != '合成音频' && this.ButtonText != '请重试') return;

    if (this.SynthesisText == '') {
      this.TimbreErrorText = '转换文字不能为空';
      return;
    }
    this.ButtonText = '正在合成...';
    this.TimbreErrorText = '';
    this.MediaUrl = '';

    var data = await HttpService.TimbreSynthesis(
      this.Speed,
      this.SynthesisText,
      this.SelectedVoiceName.id,
      this.Volume,
    );
    runInAction(() => {
      if (data) {
        this.MediaUrl = data;
        this.ButtonText = '已合成';
      } else {
        this.ButtonText = '请重试';
      }
    });
  };

  @action SaveCommand = () => {
    this.TimbreErrorText = '';

    if (this.MediaUrl == null || this.MediaUrl == '') {
      this.TimbreErrorText = '音频未正常合成';
      return;
    }
    if (this.ResourceName == null || this.ResourceName.trim() == '') {
      this.TimbreErrorText = '名称未设置';
      return;
    } else {
      let reg = new RegExp('^[\u4E00-\u9FA5A-Za-z0-9_ -]+$');
      if (!reg.test(this.ResourceName)) {
        this.TimbreErrorText = '名称有不符合规范的字符';
        return;
      }
    }
    if (this.directoryId == null || this.directoryId == '') {
      this.TimbreErrorText = '请设置音频保存位置';
      return;
    }

    if (this.NewKeywordText == null || this.NewKeywordText.length <= 0) {
      this.TimbreErrorText = '标签未设置';
      return;
    } else {
      let reg = new RegExp('^[\u4E00-\u9FA5A-Za-z0-9]+$');
      // console.log("----------------值");
      // console.log(JSON.stringify(this.NewKeywordText));
      // console.log(this.NewKeywordText.length);

      if (this.NewKeywordText.length == 1) {
        if (!reg.test(this.NewKeywordText[0])) {
          this.TimbreErrorText = '标签名不符合规定';
          return;
        }
      } else {
        this.NewKeywordText.forEach(item => {
          if (!reg.test(item)) {
            this.TimbreErrorText = '标签名不符合规定';
            return;
          }
        });
      }
    }
    this.UploadSingleFileAsync();
  };

  @action UploadSingleFileAsync = async () => {
    //组建数据StrToMD5
    var tempUploadSource = new CWResource();
    (tempUploadSource.resourceName = this.ResourceName),
      (tempUploadSource.resourceType = CWResourceTypes.Audio),
      (tempUploadSource.resourceId = IdHelper.NewId());
    tempUploadSource.resourceKey = this.MediaUrl;
    tempUploadSource.resourceMd5 = md5(this.SynthesisText + this.ResourceName);
    tempUploadSource.directoryId = this.directoryId[
      this.directoryId.length - 1
    ];
    tempUploadSource.labelNames = this.NewKeywordText;
    tempUploadSource.resourceSize = 0; //HttpService.GetHttpLength(this.MediaUrl);  没有大小会自动生成

    var data = await HttpService.RecordResourceAsync(tempUploadSource);
    if (data == 'true') {
      this.SynthesisText = '';
      this.ResourceName = '';
      this.MediaUrl = '';
      this.ButtonText = '合成音频';
      this.TimbreErrorText = '保存成功,可以继续添加';
      const { update } = this.props;
      if (update) {
        update();
      }
    } else {
      this.TimbreErrorText = data;
      if (this.TimbreErrorText == '') this.TimbreErrorText = '保存失败';
    }
  };

  @action SearchResourceTypeCascade = async () => {
    var data = await HttpService.fetchResDics();
    runInAction(() => {
      if (data) {
        data.forEach(x => removeEmptyVoList(x));
        //this.VoiceType.filter(x => x == item.typeSex)
        this.resourceTypeList = data.filter(x => x.code == 'FREQUENCY');
      }
    });
  };

  //#endregion

  componentDidMount() {
    this.GetVoicesAsync();
    if (!this.resourceTypeList) this.SearchResourceTypeCascade();
  }

  render() {
    const { onClose } = this.props;
    return (
      <div style={{ WebkitBoxOrient: 'vertical', height: '420px' }}>
        <div style={{ display: 'flex' }}>
          <div style={{ width: '300px' }}>
            <div style={{ height: '20px' }}>
              <div style={{ display: 'flex' }}>
                <svg
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="6391"
                  width="20"
                  height="20"
                >
                  <path
                    d="M300.11733332-467.09759986a403.3024 401.7408 90 1 0 803.4816 0 403.3024 401.7408 90 1 0-803.4816 0Z"
                    fill="#2c2c2c"
                    p-id="6392"
                  ></path>
                  <path
                    d="M704.49493332 675.52426668l60.4928 34.71359999a23.04 23.04 0 0 1 7.3728 33.2032l-110.336 156.9024c138.0352-6.272 244.0704-22.7584 274.6368-42.0608a115.0464 115.0464 0 0 0-95.1808-103.75679999 23.04 23.04 0 1 1 7.7056-45.41440001 161.152 161.152 0 0 1 133.9648 159.4112 23.04 23.04 0 0 1-5.7088 15.1552c-33.7408 38.4-170.3424 59.2384-361.0624 64.4096-53.4528 1.3824-108.4672 1.3824-161.9712 0-191.97439999-5.4784-327.0144-25.95839999-360.96-64.2304a23.04 23.04 0 0 1-5.7856-15.1808 161.152 161.152 0 0 1 133.9904-159.5648 23.04 23.04 0 1 1 7.70559999 45.4144 115.0464 115.0464 0 0 0-95.18079999 103.8336c29.7472 18.7136 129.92 34.5856 262.7072 41.344l-109.9008-156.2624a23.04 23.04 0 0 1 7.3984-33.2032l53.0432-30.464c-40.06400001-41.088-64.6144-96.256-64.6144-156.9792l0-12.288a60.416 60.416 0 0 1-22.9376-44.032l-0.0256-1.28 0-46.1056 0.0256-1.1776a60.416 60.416 0 0 1 22.9376-44.3648l0-111.6928c-22.912-31.5648-38.9888-66.7136-45.568-103.7568a23.04 23.04 0 0 1 22.7072-27.0592l380.9536 0c68.60799999 0 124.16 55.7824 124.16 124.544l0 114.6624c17.664 9.0112 22.9632 24.8064 22.9632 48.8448l0 46.08c0 23.9616-5.3248 39.7312-22.9632 48.7936l0 8.832c0 58.64959999-22.8864 112.128-60.5696 152.72960001z m-36.608 32.12799999a247.552 247.552 0 0 1-143.9488 45.568 247.808 247.808 0 0 1-138.752-41.9584l-45.952 26.368 115.6096 164.3776 0.8192 0.0256c14.976 0.384 30.08 0.6656 45.2352 0.8448l0-80.4864a23.04 23.04 0 0 1 46.08 0l-1e-8 80.64c19.2-0.0512 38.3744-0.3072 57.34400001-0.7424l115.8144-164.6848-52.224-29.952zM328.91733332 312.77226667l0 73.728a23.04 23.04 0 0 1-14.208 21.248 14.2848 14.2848 0 0 0-8.7296 12.0576l0 44.544c0.4864 5.3248 3.84 9.9072 8.704 11.9296a23.04 23.04 0 0 1 14.2336 21.2736l0 25.2416c0 101.55519999 87.1168 184.3712 195.072 184.3712 107.904 0 195.0208-82.816 195.0208-184.3712l0-25.2416a23.04 23.04 0 0 1 18.2784-22.528c6.2464-1.3056 4.6848 1.7664 4.6848-9.856l0-46.08c0-11.69919999 1.5872-8.5504-4.5568-9.8304a23.2192 23.2192 0 0 1-1.9712-0.4864l-165.4016-1.2288c-86.912 0.6144-176.384-36.5056-241.1264-94.7712z m390.0928 49.8176l0-107.008a78.2848 78.2848 0 0 0-78.08-78.4896L289.67253332 177.09226667c35.1744 102.80960001 161.152 185.216 280.3456 184.3968l148.96640001 1.1008z m-218.0096 263.88480001a23.04 23.04 0 1 1 0-46.05440001l45.9264 0a23.04 23.04 0 1 1 0 46.08l-45.9264 0z"
                    fill="#8a8a8a"
                    p-id="6393"
                  ></path>
                </svg>
                <label style={{ marginLeft: '5px', fontWeight: 'bold' }}>
                  发音人
                </label>
                <svg
                  style={{ marginLeft: '53px' }}
                  viewBox="0 0 1039 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="8136"
                  width="20"
                  height="20"
                >
                  <path
                    d="M507.178908 944.934087H289.265537c-84.851224 0-154.274953-69.423729-154.274953-154.274953v-539.962336c0-84.851224 69.423729-154.274953 154.274953-154.274952h462.824858c84.851224 0 154.274953 69.423729 154.274953 154.274952V678.809793c0 21.212806-17.355932 38.568738-38.568738 38.568738s-38.568738-17.355932-38.568738-38.568738v-428.112995c0-42.425612-34.711864-77.137476-77.137477-77.137476h-462.824858c-42.425612 0-77.137476 34.711864-77.137477 77.137476v539.962336c0 42.425612 34.711864 77.137476 77.137477 77.137476h217.913371c21.212806 0 38.568738 17.355932 38.568738 38.568738s-17.355932 38.568738-38.568738 38.568739z"
                    fill="#8a8a8a"
                    p-id="8137"
                  ></path>
                  <path
                    d="M713.521657 347.118644h-385.687382c-21.212806 0-38.568738-17.355932-38.568738-38.568738s17.355932-38.568738 38.568738-38.568738h385.687382c21.212806 0 38.568738 17.355932 38.568738 38.568738s-17.355932 38.568738-38.568738 38.568738zM713.521657 501.393597h-385.687382c-21.212806 0-38.568738-17.355932-38.568738-38.568738s17.355932-38.568738 38.568738-38.568738h385.687382c21.212806 0 38.568738 17.355932 38.568738 38.568738s-17.355932 38.568738-38.568738 38.568738z"
                    fill="#8a8a8a"
                    p-id="8138"
                  ></path>
                  <path
                    d="M690.380414 925.649718h-15.427495c-63.638418 0-115.706215-52.067797-115.706215-115.706215v-115.706215c0-63.638418 52.067797-115.706215 115.706215-115.706215h115.706215c63.638418 0 115.706215 52.067797 115.706214 115.706215v15.427495l-215.984934 215.984935z m-15.427495-269.981168c-21.212806 0-38.568738 17.355932-38.568738 38.568738v115.706215c0 17.355932 9.642185 30.854991 25.06968 36.640301l165.845574-165.845574c-5.785311-15.427495-19.284369-25.06968-36.640301-25.06968h-115.706215z"
                    fill="#8a8a8a"
                    p-id="8139"
                  ></path>
                </svg>
                <label style={{ marginLeft: '5px', fontWeight: 'bold' }}>
                  音色选择
                </label>
              </div>
              <div style={{ display: 'flex' }}>
                <div
                  style={{
                    width: '100px',
                    height: '310px',
                    border: '1px solid #DCDCDC',
                    borderRadius: '5px',
                    marginTop: '10px',
                  }}
                >
                  {this.VoiceType.map((Voice, i) => {
                    return (
                      <div
                        onClick={e => (this.SelectedTimbreValue = Voice)}
                        key={i}
                        style={{
                          width: '100%',
                          height: '23px',
                          display: 'flex',
                          border:
                            this.SelectedTimbreValue == Voice
                              ? '1px solid #60c0ff'
                              : '',
                          borderRadius: '7px',
                          backgroundColor:
                            this.SelectedTimbreValue == Voice ? '#E0E0E0' : '',
                        }}
                      >
                        <div
                          style={{
                            width: '11px',
                            height: '11px',
                            borderRadius: '50%',
                            border:
                              this.SelectedTimbreValue == Voice
                                ? '3px solid #60c0ff'
                                : '2px solid #CCCCCC',
                            backgroundColor: '#ffffff',
                            marginLeft: '15px',
                            marginTop: '5px',
                          }}
                        ></div>
                        <label style={{ marginLeft: '7px' }}>{Voice}</label>
                      </div>
                    );
                  })}
                </div>
                <div
                  style={{
                    width: '150px',
                    height: '310px',
                    border: '1px solid #DCDCDC',
                    borderRadius: '5px',
                    marginTop: '10px',
                    marginLeft: '22px',
                    overflow: 'auto',
                    overflowX: 'hidden',
                  }}
                >
                  {this.VoiceName.map((Voice, i) => {
                    return (
                      <div
                        onClick={e => (this.SelectedVoiceName = Voice)}
                        key={i}
                        style={{
                          width: '100%',
                          height: '23px',
                          display: 'flex',
                          border:
                            this.SelectedVoiceName.id == Voice.id
                              ? '1px solid #60c0ff'
                              : '',
                          borderRadius: '7px',
                          backgroundColor:
                            this.SelectedVoiceName.id == Voice.id
                              ? '#E0E0E0'
                              : '',
                        }}
                      >
                        <div
                          style={{
                            width: '11px',
                            height: '11px',
                            borderRadius: '50%',
                            border:
                              this.SelectedVoiceName.id == Voice.id
                                ? '3px solid #60c0ff'
                                : '2px solid #CCCCCC',
                            backgroundColor: '#ffffff',
                            marginLeft: '15px',
                            marginTop: '5px',
                          }}
                        ></div>
                        <label style={{ marginLeft: '7px' }}>
                          {Voice.name}
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          <div style={{ width: '500px' }}>
            <div style={{ height: '20px', display: 'flex' }}>
              <svg
                viewBox="0 0 1265 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="36776"
                width="20"
                height="20"
              >
                <path
                  d="M229.016346 336.822697a229.080478 229.080478 0 1 0 229.080479-229.016346 229.080478 229.080478 0 0 0-229.080479 229.016346zM925.300432 1023.935868v-164.884074c-100.751801-109.922716-274.806789-174.054988-458.032692-174.054988-192.396818 0-366.515939 73.303188-467.26774 183.225903v155.713159zM1127.060562 678.32705a43.225152 43.225152 0 0 1-60.733262 0 42.134903 42.134903 0 0 1 0-60.412601 383.575124 383.575124 0 0 0 0-545.124319 42.134903 42.134903 0 0 1 0-60.412601 43.225152 43.225152 0 0 1 60.733262 0 469.25584 469.25584 0 0 1 0 665.949521z"
                  fill="#8a8a8a"
                  p-id="36777"
                ></path>
                <path
                  d="M1009.8909 587.515751a43.225152 43.225152 0 0 1-60.733262 0 42.263168 42.263168 0 0 1 0-60.412601 255.887769 255.887769 0 0 0 0-363.501722 42.263168 42.263168 0 0 1 0-60.412601 43.225152 43.225152 0 0 1 60.733262 0 340.927162 340.927162 0 0 1 0 484.326924z"
                  fill="#8a8a8a"
                  p-id="36778"
                ></path>
                <path
                  d="M899.198597 496.383792a43.289284 43.289284 0 0 1-60.797395 0 42.776226 42.776226 0 0 1-0.705455-59.707146 146.542243 146.542243 0 0 0 16.289598-19.75274 128.264546 128.264546 0 0 0 0-143.784556 126.276445 126.276445 0 0 0-16.289598-19.816872 42.712094 42.712094 0 0 1 0.384794-59.707146 43.353416 43.353416 0 0 1 60.733262 0 212.919146 212.919146 0 0 1 0.384794 302.76846z"
                  fill="#8a8a8a"
                  p-id="36779"
                ></path>
              </svg>
              <label style={{ marginLeft: '5px', fontWeight: 'bold' }}>
                {this.SelectedVoiceName?.name}
              </label>
            </div>
            <div style={{ height: '96px', marginTop: '12px' }}>
              <TextArea
                style={{ height: '100%' }}
                value={this.SynthesisText}
                onChange={event => (this.SynthesisText = event.target.value)}
                placeholder="请输入文字，最大150个字"
                maxLength={150}
                //autoSize={{ minRows: 4, maxRows: 4 }}
              />
            </div>
            <div style={{ display: 'flex', marginTop: 10 }}>
              <div style={{ width: '65px', lineHeight: '30px' }}>
                <span style={{ color: 'red' }}>*</span>音色配置
              </div>
              <svg
                style={{ marginTop: '7px', marginLeft: '20px' }}
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="37063"
                width="15"
                height="15"
              >
                <path
                  d="M636.165 957.44l-70.804-70.81c107.591-92.062 176.03-228.587 176.03-381.317 0-145.495-62.284-276.121-161.177-367.774l70.978-70.979c117.013 109.83 190.51 265.477 190.51 438.61 0 180.444-79.78 341.908-205.537 452.27z"
                  fill="#8a8a8a"
                  p-id="37064"
                ></path>
                <path
                  d="M445.087 766.356l-72.94-72.929c66.284-36.644 111.191-107.167 111.191-188.257 0-73.615-37.048-138.522-93.47-177.29l71.623-71.614c74.23 57.708 122.189 147.615 122.189 248.904 0 108.657-54.958 204.447-138.593 261.186z m-191.12-175.17c-39.577 0-71.67-32.082-71.67-71.675 0-39.598 32.088-71.675 71.67-71.675 39.609 0 71.68 32.077 71.68 71.675 0 39.593-32.071 71.675-71.68 71.675z"
                  fill="#8a8a8a"
                  p-id="37065"
                ></path>
              </svg>
              <label
                style={{
                  marginLeft: '5px',
                  fontWeight: 'bold',
                  lineHeight: '30px',
                }}
              >
                音量
              </label>
              <Slider
                style={{ marginLeft: '10px', width: '80px', height: '20px' }}
                min={10}
                max={100}
                onChange={value => (this.Volume = value)}
                value={typeof this.Volume === 'number' ? this.Volume : 0}
              />
              <svg
                style={{ marginTop: '7px', marginLeft: '20px' }}
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="44849"
                width="15"
                height="15"
                data-spm-anchor-id="a313x.7781069.0.i29"
              >
                <path
                  d="M874.876002 149.597417A496.041496 496.041496 0 0 0 511.937837 0.112138a522.662162 522.662162 0 0 0-362.938166 149.485279A519.639302 519.639302 0 0 0 0.00195 512.048024a511.935886 511.935886 0 0 0 148.997721 362.450608 496.041496 496.041496 0 0 0 362.938166 149.485279 522.662162 522.662162 0 0 0 362.938165-149.485279A519.639302 519.639302 0 0 0 1023.873723 512.048024a511.935886 511.935886 0 0 0-148.997721-362.450607z"
                  fill="#e6e6e6"
                  p-id="44850"
                  data-spm-anchor-id="a313x.7781069.0.i23"
                ></path>
                <path
                  d="M469.715315 874.206097a15.943146 15.943146 0 0 0 15.114298-8.190974l249.629689-390.582703a14.285449 14.285449 0 0 0 0.292535-6.435766 15.89439 15.89439 0 0 0-4.095488-11.506368 15.406832 15.406832 0 0 0-10.970054-5.070603L562.107553 448.61673s53.631379-172.498016 73.23121-233.442764c2.535302-7.947195-6.338254-15.699367-15.5531-16.186925l-163.039391-8.532265c-6.7283 0.048756-17.06453 8.288486-20.282412 14.285449-33.787768 116.965161-67.721804 233.784055-97.024039 363.620747a26.425643 26.425643 0 0 0-0.243779 4.680557 15.89439 15.89439 0 0 0 4.388022 11.408856c2.925348 3.071615 6.972079 4.778068 11.213833 4.778069l144.170897 7.557149s-37.541965 195.803287-44.855335 261.623615a15.89439 15.89439 0 0 0 4.436778 11.457613c2.925348 3.071615 6.972079 4.778068 11.165078 4.778068v-0.487558z"
                  fill="#8a8a8a"
                  p-id="44851"
                  data-spm-anchor-id="a313x.7781069.0.i22"
                ></path>
              </svg>
              <label
                style={{
                  marginLeft: '5px',
                  fontWeight: 'bold',
                  lineHeight: '30px',
                }}
              >
                语速
              </label>
              <Slider
                style={{ marginLeft: '10px', width: '80px', height: '20px' }}
                min={0.7}
                max={2}
                step={0.1}
                onChange={value => (this.Speed = value)}
                value={typeof this.Speed === 'number' ? this.Speed : 0}
              />
            </div>

            <div style={{ display: 'flex' }}>
              <div style={{ width: '65px', lineHeight: '30px' }}>
                <span style={{ color: 'red' }}>*</span>音频状态
              </div>
              <button
                onClick={e => this.TimbreSynthesisCommand()}
                style={{
                  width: '100px',
                  marginLeft: '20px',
                  backgroundColor: '#60c0ff',
                  color: '#ffffff',
                  border: '0px solid #DCDCDC',
                }}
              >
                {this.ButtonText}
              </button>
              {this.MediaUrl == '' ||
              this.ButtonText == '合成音频' ||
              this.ButtonText == '请重试' ? null : (
                <audio
                  controls
                  style={{
                    width: '280px',
                    height: '30px',
                    marginLeft: '10px',
                    outline: 'none',
                  }}
                >
                  <source src={this.MediaUrl} type="audio/mpeg" />
                </audio>
              )}
            </div>
            <div style={{ display: 'flex', marginTop: 15 }}>
              <div style={{ width: '65px', lineHeight: '30px' }}>
                <span style={{ color: 'red' }}>*</span>音频名称
              </div>
              <TextArea
                style={{ height: '35px', width: '397px', marginLeft: '20px' }}
                value={this.ResourceName}
                onChange={event => (this.ResourceName = event.target.value)}
                placeholder="音频名称"
                maxLength={150}
                //autoSize={{ minRows: 4, maxRows: 4 }}
              />
            </div>
            <div style={{ display: 'flex', marginTop: 15 }}>
              <div style={{ width: '65px', lineHeight: '30px' }}>
                <span style={{ color: 'red' }}>*</span>存储位置
              </div>
              <div
                style={{
                  height: '35px',
                  width: '397px',
                  marginLeft: '20px',
                  border: '1px solid #DCDCDC',
                  borderRadius: '1px',
                }}
              >
                <Cascader
                  placeholder="请选择存储位置"
                  size="small"
                  changeOnSelect={true}
                  expandTrigger="hover"
                  options={this.resourceTypeList}
                  bordered={false}
                  allowClear={false}
                  value={this.directoryId}
                  onChange={(value, selectedOptions) => {
                    this.directoryId = value;
                  }}
                  fieldNames={{
                    label: 'title',
                    value: 'id',
                    children: 'voList',
                  }}
                  style={{ width: '395px', marginTop: '5px' }}
                />
              </div>
            </div>
            <div style={{ display: 'flex', marginTop: 15 }}>
              <div style={{ width: '65px' }}>
                <span style={{ color: 'red' }}>*</span>标签
              </div>
              <div
                style={{
                  height: '50px',
                  marginLeft: '20px',
                  width: '250px',
                  overflow: 'auto',
                }}
              >
                <EditableTagGroup
                  labels={this.NewKeywordText}
                  onChange={value => (this.NewKeywordText = value)}
                />
              </div>
            </div>
          </div>
        </div>
        <div>
          <label
            style={{
              color:
                this.TimbreErrorText == '保存成功,可以继续添加'
                  ? '#28B463'
                  : '#e32',
              marginLeft: '330px',
            }}
          >
            {this.TimbreErrorText}
          </label>
        </div>
        <div style={{ display: 'flex', marginTop: 0, marginLeft: '150px' }}>
          <button
            onClick={e =>
              //LayoutHeader.IsShowUploadVoiceView = false
              onClose()
            }
            style={{
              width: '100px',
              height: '35px',
              marginLeft: '110px',
              border: '0px solid #DCDCDC',
            }}
          >
            取消
          </button>
          <button
            onClick={e => this.SaveCommand()}
            style={{
              width: '100px',
              height: '35px',
              marginLeft: '40px',
              backgroundColor: '#60c0ff',
              color: '#ffffff',
              border: '0px solid #DCDCDC',
            }}
          >
            保存
          </button>
        </div>
      </div>
    );
  }
}
