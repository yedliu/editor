import MissionBase from './MissionBase';
import React from 'react';
import { InputNumber } from 'antd';

const MissionSubmitterSettingTemplate = (inv: MissionSubmitter) => {
  if (inv) {
    return (
      <div
        style={{
          display: '-webkit-box',
          WebkitBoxOrient: 'horizontal',
          WebkitBoxPack: 'start',
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
    );
  }
  return null;
};

export default class MissionSubmitter extends MissionBase {
  get SelfInvokable() {
    return false;
  }

  constructor() {
    super();
    this.SettingTemplate = MissionSubmitterSettingTemplate;
  }

  GetOutputParameters() {
    return ['标签'];
  }
}
