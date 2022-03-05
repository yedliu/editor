import MissionBase from './MissionBase';
import { Expose, serialize, deserializeArray } from '@/class-transformer';
import { observable } from 'mobx';
import SwitchSketelonAction from '@/modelClasses/courseDetail/ShowHideViewModels/SwitchSketelonAction';
import RUHelper from '@/redoundo/redoUndoHelper';
import IdHelper from '@/utils/idHelper';
import React from 'react';
import { InputNumber } from 'antd';
import { SwitchBoneIcon } from '@/svgs/designIcons';
import SkElementsSelector from '@/components/cwDesignUI/control/showHideItems/skElementsSelector';
import { AppearItemIcon } from '@/svgs/designIcons';

const SkeletalFreqMissionSettingTemplate = (inv: SkeletalFreqMission) => {
  if (inv) {
    return (
      <div
        style={{
          display: '-webkit-box',
          WebkitBoxOrient: 'vertical',
          WebkitBoxPack: 'start',
        }}
      >
        <div
          style={{
            display: '-webkit-box',
            WebkitBoxOrient: 'horizontal',
            WebkitBoxPack: 'start',
            WebkitBoxAlign: 'center',
            whiteSpace: 'nowrap',
            marginTop: '5px',
          }}
        >
          {'保护时间'}
          <InputNumber
            style={{
              marginLeft: '5px',
            }}
            value={Number(inv.LockedTimer || 0)}
            min={0}
            max={Number.POSITIVE_INFINITY}
            step={0.1}
            precision={2}
            onChange={v => (inv.LockedTimer = Number(v || 0))}
            size="small"
            height="15px"
            width="60px"
          ></InputNumber>
        </div>

        <div
          style={{
            display: '-webkit-box',
            WebkitBoxOrient: 'horizontal',
            WebkitBoxPack: 'start',
            WebkitBoxAlign: 'center',
            whiteSpace: 'nowrap',
            marginTop: '5px',
          }}
        >
          {'动画判定'}
          <SkElementsSelector
            scene={inv.Scene}
            style={{ width: '14px', height: '14px', marginLeft: '3px' }}
            selectorName="选择元素"
            icon={SwitchBoneIcon}
            switchBoneIds={inv.SwitchBoneIds || []}
            switchBoneIdsChanged={newIds => {
              if (newIds != inv.SwitchBoneIds) inv.SwitchBoneIds = newIds || [];
            }}
            isSingle={false}
          ></SkElementsSelector>
        </div>
      </div>
    );
  }
  return null;
};

export default class SkeletalFreqMission extends MissionBase {
  constructor() {
    super();
    this.SettingTemplate = SkeletalFreqMissionSettingTemplate;
  }

  private _SkeletalFreqId: string;

  @Expose()
  public get SkeletalFreqId(): string {
    return this._SkeletalFreqId;
  }
  public set SkeletalFreqId(v: string) {
    this._SkeletalFreqId = v;
    this._SwitchBoneIds =
      deserializeArray(SwitchSketelonAction, v, { strategy: 'excludeAll' }) ||
      [];
  }

  @observable
  private _SwitchBoneIds: SwitchSketelonAction[] = [];
  public get SwitchBoneIds(): SwitchSketelonAction[] {
    return this._SwitchBoneIds;
  }
  public set SwitchBoneIds(v: SwitchSketelonAction[]) {
    var str = serialize(v); //防止在原数据上修改后返回的值无法触发redoundo
    RUHelper.TrySetPropRedoUndo(
      this,
      'SkeletalFreqId',
      () => (this.SkeletalFreqId = str),
      str,
      this._SkeletalFreqId,
    );
  }

  @observable
  private _SkeletalId: string;
  @Expose()
  public get SkeletalId(): string {
    return this._SkeletalId;
  }
  public set SkeletalId(v: string) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'SkeletalId',
      () => (this._SkeletalId = v),
      v,
      this._SkeletalId,
    );
  }

  ReplaceRelativeIds(map: Map<string, string>) {
    super.ReplaceRelativeIds(map);
    this.SwitchBoneIds?.forEach(
      x => (x.Id = IdHelper.ReplaceIdByMap(x.Id, map)),
    );
    this.SkeletalId = IdHelper.ReplaceIdByMap(this.SkeletalId, map);
  }
}
