import MissionGroup from './MissionGroup';
import { observable } from 'mobx';
import { Expose } from '@/class-transformer';
import RUHelper from '@/redoundo/redoUndoHelper';
import ILogicDesignItem from '../../ILogicDesignItem';
import React from 'react';
import { check } from 'prettier';
import { Checkbox, InputNumber } from 'antd';
import InvokableBase from '@/modelClasses/courseDetail/InvokableBase';

const MissionJudgerSettingTemplate = (inv: MissionJudger) => {
  if (inv) {
    return (
      <div
        style={{
          display: '-webkit-box',
          WebkitBoxOrient: 'vertical',
          WebkitBoxPack: 'justify',
        }}
      >
        <div
          style={{
            display: '-webkit-box',
            WebkitBoxOrient: 'horizontal',
            WebkitBoxPack: 'justify',
            WebkitBoxAlign: 'center',
            whiteSpace: 'nowrap',
            marginTop: '5px',
          }}
        >
          成功后重算
          <Checkbox
            style={{ marginLeft: '4px', marginRight: '6px' }}
            checked={inv.ResetWhenSuccess || false}
            onChange={e => (inv.ResetWhenSuccess = e.target.checked || false)}
          ></Checkbox>
          验证后置
          <Checkbox
            style={{ marginLeft: '4px' }}
            checked={inv.IsTaskRevoke || false}
            onChange={e => (inv.IsTaskRevoke = e.target.checked || false)}
          ></Checkbox>
        </div>

        <div
          style={{
            display: '-webkit-box',
            WebkitBoxOrient: 'horizontal',
            WebkitBoxPack: 'justify',
            WebkitBoxAlign: 'center',
            whiteSpace: 'nowrap',
            marginTop: '5px',
          }}
        >
          失败后重算
          <Checkbox
            style={{ marginLeft: '4px', marginRight: '6px' }}
            checked={inv.ResetWhenError || false}
            onChange={e => (inv.ResetWhenError = e.target.checked || false)}
          ></Checkbox>
          自动撤回
          <Checkbox
            style={{ marginLeft: '4px' }}
            checked={inv.AutoRevoke || false}
            onChange={e => (inv.AutoRevoke = e.target.checked || false)}
          ></Checkbox>
        </div>
        {inv.Scene.IsOldInit ? (
          <div
            style={{
              display: '-webkit-box',
              WebkitBoxOrient: 'horizontal',
              WebkitBoxPack: 'justify',
              WebkitBoxAlign: 'center',
              whiteSpace: 'nowrap',
              marginTop: '5px',
            }}
          >
            兼容1.0模式
            <Checkbox
              style={{ marginLeft: '4px' }}
              checked={inv.OldMode || false}
              onChange={e => (inv.OldMode = e.target.checked || false)}
            ></Checkbox>
          </div>
        ) : null}
        <div
          style={{
            border: '1px solid #CCCCCC',
            borderRadius: '3px',
            width: '220px',
            minHeight: '35px',
            marginTop: '3px',
          }}
        >
          任务清单
          <div
            style={{
              width: '98%',
              background: '#EEEEEE',
              height: '20px',
              display: '-webkit-box',
              WebkitBoxOrient: 'horizontal',
              WebkitBoxPack: 'justify',
              WebkitBoxAlign: 'center',
              whiteSpace: 'nowrap',
              marginLeft: '2px',
              marginRight: '2px',
            }}
          >
            <div style={{ width: '20%' }}>序号</div>
            <div style={{ width: '40%' }}>组件注释</div>
            <div style={{ width: '20%' }}>最小</div>
            <div style={{ width: '20%' }}>最大</div>
          </div>
          {inv.Missions?.map((mission, i) => {
            return (
              <div
                key={i}
                style={{
                  width: '98%',
                  background: '#EEEEEE',
                  height: '25px',
                  display: '-webkit-box',
                  WebkitBoxOrient: 'horizontal',
                  WebkitBoxPack: 'justify',
                  WebkitBoxAlign: 'center',
                  whiteSpace: 'nowrap',
                  marginLeft: '2px',
                  marginRight: '2px',
                  marginTop: '2px',
                }}
              >
                <div style={{ width: '20%', position: 'relative' }}>
                  <InputNumber
                    style={{ width: '95%' }}
                    size="small"
                    min={0}
                    value={mission.OrderIndex}
                    onChange={e => (mission.OrderIndex = Number(e || 0))}
                  ></InputNumber>
                </div>
                <div
                  style={{
                    width: '40%',
                    position: 'relative',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                  }}
                >
                  {mission.Submitter
                    ? mission.Submitter instanceof InvokableBase
                      ? mission.Submitter.Note
                      : mission.Submitter.DisplayNameWithOwnerName
                    : null}
                </div>
                <div style={{ width: '20%', position: 'relative' }}>
                  <InputNumber
                    style={{ width: '95%' }}
                    size="small"
                    min={1}
                    value={mission.Count}
                    onChange={e => (mission.Count = Number(e || 0))}
                  ></InputNumber>
                </div>
                <div style={{ width: '20%', position: 'relative' }}>
                  {' '}
                  <InputNumber
                    style={{ width: '95%' }}
                    size="small"
                    min={0}
                    value={mission.MaxCount}
                    onChange={e => (mission.MaxCount = Number(e || 0))}
                  ></InputNumber>
                </div>
              </div>
            );
          })}
          <div
            style={{
              color: '#66669F',
              cursor: 'pointer',
              marginLeft: '5px',
              marginTop: '2px',
            }}
            onClick={() => inv.SortMissions()}
          >
            排序
          </div>
        </div>
      </div>
    );
    return null;
  }
};

export default class MissionJudger extends MissionGroup {
  constructor() {
    super();
    this.SettingTemplate = MissionJudgerSettingTemplate;
  }

  @observable
  private _IsTaskRevoke: boolean = false;
  /// <summary>
  /// 任務是否支持撤回
  /// </summary>
  @Expose()
  public get IsTaskRevoke(): boolean {
    return this._IsTaskRevoke;
  }
  public set IsTaskRevoke(v: boolean) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'IsTaskRevoke',
      () => (this._IsTaskRevoke = v),
      v,
      this._IsTaskRevoke,
    );
  }

  @observable
  private _ResetWhenError: boolean = true;
  /// <summary>
  /// 任务失败后是否会重置任务记录
  /// </summary>
  @Expose()
  public get ResetWhenError(): boolean {
    return this._ResetWhenError;
  }
  public set ResetWhenError(v: boolean) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'ResetWhenError',
      () => (this._ResetWhenError = v),
      v,
      this._ResetWhenError,
    );
  }

  @observable
  private _OldMode: boolean = false;
  @Expose()
  public get OldMode(): boolean {
    return this._OldMode;
  }
  public set OldMode(v: boolean) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'OldMode',
      () => (this._OldMode = v),
      v,
      this._OldMode,
    );
  }

  //自动撤回
  @observable
  private _AutoRevoke: boolean = false;
  @Expose()
  public get AutoRevoke(): boolean {
    return this._AutoRevoke;
  }
  public set AutoRevoke(v: boolean) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'AutoRevoke',
      () => (this._AutoRevoke = v),
      v,
      this._AutoRevoke,
    );
  }

  CheckCanBeInvoked(invoker: ILogicDesignItem) {
    var temp = super.CheckCanBeInvoked(invoker);
    if ((invoker.constructor as any).IsMissionHandler) return temp;
    return false;
  }
}
