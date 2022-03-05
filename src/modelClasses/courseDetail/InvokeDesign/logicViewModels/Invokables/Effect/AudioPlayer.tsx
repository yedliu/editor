import InvokableBase from '@/modelClasses/courseDetail/InvokableBase';
import { observable } from 'mobx';
import {
  ResourceRef,
  RefSelectorType,
} from '@/modelClasses/courseDetail/resRef/resourceRef';
import RUHelper from '@/redoundo/redoUndoHelper';
import { Expose, Type } from '@/class-transformer';
import { InvHandler, InvokerType } from '../../../InvokeHandlerMeta';
import CWResource from '@/modelClasses/courseDetail/cwResource';
import { CWResourceTypes } from '@/modelClasses/courseDetail/courseDetailenum';
import IdHelper from '@/utils/idHelper';
import React from 'react';
import ResourceRefView from '@/components/cwDesignUI/control/resourceRefView';
import { Checkbox, InputNumber, Select } from 'antd';

const AudioPlayerSettingTemplate = inv => {
  var audioPlayer: AudioPlayer = inv;
  return (
    <div
      style={{
        display: '-webkit-box',
        WebkitBoxOrient: 'vertical',
        WebkitBoxPack: 'start',
        width: '210px',
      }}
    >
      <div
        style={{
          marginTop: '2px',
          display: '-webkit-box',
          WebkitBoxOrient: 'horizontal',
          WebkitBoxPack: 'start',
          WebkitBoxAlign: 'center',
          whiteSpace: 'nowrap',
        }}
      >
        <div>播放音频</div>
        <div style={{ background: '#FFFFFF1F', marginLeft: '7px' }}>
          <ResourceRefView
            refType={RefSelectorType.Audio}
            height={50}
            width={150}
            resRef={audioPlayer.Audio}
            selectionChanged={resref => (audioPlayer.Audio = resref)}
          />
        </div>
      </div>
      <div
        style={{
          marginTop: '2px',
          display: '-webkit-box',
          WebkitBoxOrient: 'horizontal',
          WebkitBoxPack: 'start',
          WebkitBoxAlign: 'center',
          whiteSpace: 'nowrap',
        }}
      >
        <div>音量控制</div>
        <div style={{ background: '#FFFFFF1F', marginLeft: '7px' }}>
          <InputNumber
            size="small"
            defaultValue={100}
            style={{ width: '80px' }}
            min={0}
            max={100}
            step={1}
            formatter={value => `${value}%`}
            parser={value => value.replace('%', '')}
            value={audioPlayer.AudioVolume}
            onChange={value => (audioPlayer.AudioVolume = Number(value))}
          />
        </div>
      </div>
      <div
        style={{
          marginTop: '2px',
          display: '-webkit-box',
          WebkitBoxOrient: 'horizontal',
          WebkitBoxPack: 'start',
          WebkitBoxAlign: 'center',
          whiteSpace: 'nowrap',
        }}
      >
        <div>背景音量</div>
        <div style={{ background: '#FFFFFF1F', marginLeft: '7px' }}>
          <InputNumber
            size="small"
            style={{ width: '80px' }}
            defaultValue={100}
            min={0}
            max={100}
            step={1}
            formatter={value => `${value}%`}
            parser={value => value.replace('%', '')}
            value={audioPlayer.BgAudioVolume}
            onChange={value => (audioPlayer.BgAudioVolume = Number(value))}
          />
          <Checkbox
            style={{ marginLeft: '10px' }}
            checked={audioPlayer.IsRestoreBgVolume || false}
            onChange={e => (audioPlayer.IsRestoreBgVolume = e.target.checked)}
          >
            还原
          </Checkbox>
        </div>
      </div>

      <div
        style={{
          marginTop: '8px',
          display: '-webkit-box',
          WebkitBoxOrient: 'horizontal',
          WebkitBoxPack: 'start',
        }}
      >
        重置配置音
        <Checkbox
          style={{ marginLeft: '10px' }}
          checked={audioPlayer.IsReset || false}
          onChange={e => (audioPlayer.IsReset = e.target.checked)}
        />
      </div>
      <div
        style={{
          marginTop: '8px',
          display: '-webkit-box',
          WebkitBoxOrient: 'horizontal',
          WebkitBoxPack: 'start',
        }}
      >
        延迟时间
        <InputNumber
          style={{ marginLeft: '10px', width: '120px' }}
          size="small"
          min={0}
          max={Number.POSITIVE_INFINITY}
          step={0.1}
          precision={2}
          value={Number(audioPlayer.Delay) || 0}
          onChange={v => (audioPlayer.Delay = Number(v))}
        />
      </div>
      <div
        style={{
          marginTop: '8px',
          display: '-webkit-box',
          WebkitBoxOrient: 'horizontal',
          WebkitBoxPack: 'start',
        }}
      >
        终止其他音
        <Checkbox
          style={{ marginLeft: '10px' }}
          checked={audioPlayer.IsAllReset || false}
          onChange={e => (audioPlayer.IsAllReset = e.target.checked)}
        />
      </div>
      <div
        style={{
          marginTop: '8px',
          display: '-webkit-box',
          WebkitBoxOrient: 'horizontal',
          WebkitBoxPack: 'start',
          marginBottom: '5px',
        }}
        onWheel={e => e.stopPropagation()}
      >
        播放次数
        <Select
          style={{ width: '120px', marginLeft: '7px' }}
          size="small"
          value={Number(audioPlayer.PlayTimes)}
          onChange={v => (audioPlayer.PlayTimes = Number(v))}
        >
          {(() => {
            var result = [];
            for (var i = 0; i < 30; i++) {
              if (i == 0) {
                result.push(
                  <Select.Option key={i} value={i}>
                    Forever
                  </Select.Option>,
                );
              } else {
                result.push(
                  <Select.Option key={i} value={i}>
                    {i}
                  </Select.Option>,
                );
              }
            }
            return result;
          })()}
        </Select>
      </div>
    </div>
  );
};

export class AudioPlayer extends InvokableBase {
  constructor(res?: CWResource) {
    super();
    this.SettingTemplate = AudioPlayerSettingTemplate;
    if (res != null && res.resourceType == CWResourceTypes.Audio) {
      this.Audio = new ResourceRef(res);
    }
  }

  public get SelfInvokable(): boolean {
    return true;
  }

  /// <summary>
  /// 音频资源
  /// </summary>
  @observable
  private _Audio: ResourceRef;
  @Expose()
  @Type(() => ResourceRef)
  public get Audio(): ResourceRef {
    return this._Audio;
  }
  public set Audio(v: ResourceRef) {
    v = this.CheckTemplatedAudioVideoResRefReplace(this._Audio, v);
    RUHelper.TrySetPropRedoUndo(
      this,
      'Audio',
      () => (this._Audio = v),
      v,
      this._Audio,
    );
  }

  @observable
  private _AudioVolume: number = 100;
  @Expose()
  public get AudioVolume(): number {
    return this._AudioVolume;
  }
  public set AudioVolume(v: number) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'AudioVolume',
      () => (this._AudioVolume = v),
      v,
      this._AudioVolume,
    );
  }

  @observable
  private _BgAudioVolume: number = 100;
  @Expose()
  public get BgAudioVolume(): number {
    return this._BgAudioVolume;
  }
  public set BgAudioVolume(v: number) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'BgAudioVolume',
      () => (this._BgAudioVolume = v),
      v,
      this._BgAudioVolume,
    );
  }

  @observable
  private _IsRestoreBgVolume: boolean;
  @Expose()
  public get IsRestoreBgVolume(): boolean {
    return this._IsRestoreBgVolume;
  }
  public set IsRestoreBgVolume(v: boolean) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'IsRestoreBgVolume',
      () => (this._IsRestoreBgVolume = v),
      v,
      this._IsRestoreBgVolume,
    );
  }

  /// <summary>
  /// 播放次數默認為1次
  /// </summary>
  @observable
  private _PlayTimes: number = 1;
  @Expose()
  public get PlayTimes(): number {
    return this._PlayTimes;
  }
  public set PlayTimes(v: number) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'PlayTimes',
      () => (this._PlayTimes = v),
      v,
      this._PlayTimes,
    );
  }

  @observable
  private _Delay: number;
  @Expose()
  public get Delay(): number {
    return this._Delay;
  }
  public set Delay(v: number) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'Delay',
      () => (this._Delay = v),
      v,
      this._Delay,
    );
  }

  /// <summary>
  /// 是否重置
  /// </summary>
  @observable
  private _IsReset: boolean = false;
  @Expose()
  public get IsReset(): boolean {
    return this._IsReset;
  }
  public set IsReset(v: boolean) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'IsReset',
      () => (this._IsReset = v),
      v,
      this._IsReset,
    );
  }

  @observable
  private _IsAllReset: boolean;

  /// <summary>
  /// 是否停止其它声音
  /// </summary>
  @Expose()
  public get IsAllReset(): boolean {
    return this._IsAllReset;
  }
  public set IsAllReset(v: boolean) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'IsAllReset',
      () => (this._IsAllReset = v),
      v,
      this._IsAllReset,
    );
  }

  @InvHandler({ DisplayName: '完成后执行', Type: InvokerType.Event })
  public get InvId(): string {
    return super.InvId;
  }
  public set InvId(v: string) {
    super.InvId = v;
  }

  GetDependencyResources(): CWResource[] {
    if (this.Audio != null && this.Audio.Resource != null)
      return [this.Audio.Resource];
    return [];
  }

  SearchRes(reslib: CWResource[]) {
    this.Audio?.SearchResource(reslib);
  }

  ReplaceRelativeIds(map: Map<string, string>) {
    super.ReplaceRelativeIds(map);
    map?.forEach((v, k) => {
      this.InvId = IdHelper.ReplaceId(this.InvId, k, v);
    });
  }
}
