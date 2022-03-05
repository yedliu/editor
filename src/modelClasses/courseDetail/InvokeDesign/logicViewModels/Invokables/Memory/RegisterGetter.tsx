import { RegisterWorkBase } from './RegisterWorkBase';
import React from 'react';
import { Checkbox, Select } from 'antd';
import { bool } from 'prop-types';

const RegisterGetterTemplate = (inv: RegisterGetter) => {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
      }}
    >
      {inv.FatherItem ? (
        <div
          style={{
            position: 'relative',
            width: '100%',
          }}
        >
          {'全局变量'}
          <Checkbox
            style={{ marginLeft: '6px' }}
            checked={inv.IsPageGlobal || false}
            onChange={e => {
              inv.IsPageGlobal = e.target.checked;
            }}
          />
        </div>
      ) : null}

      <div
        style={{
          display: '-webkit-box',
          WebkitBoxOrient: 'horizontal',
          WebkitBoxAlign: 'center',
          WebkitBoxPack: 'start',
          height: '26px',
        }}
      >
        <label style={{ marginLeft: '3px', whiteSpace: 'nowrap' }}>
          寄存器名
        </label>

        <div
          style={{
            display: '-webkit-box',
            WebkitBoxOrient: 'horizontal',
            WebkitBoxAlign: 'center',
            WebkitBoxPack: 'start',
            marginLeft: '3px',
          }}
          onWheel={e => e.stopPropagation()}
        >
          <Select
            size={'small'}
            style={{ width: '90px' }}
            value={inv.TargetRegister}
            onChange={value => (inv.TargetRegister = value)}
            // onMouseDown={() => inv.ClearUnusedRegisters()}
          >
            {inv.TargetRegister &&
            inv.TargetRegister != null &&
            !inv.AccessableRegisters.includes(inv.TargetRegister) ? (
              <Select.Option value={inv.TargetRegister}>
                {inv.TargetRegister}
              </Select.Option>
            ) : null}
            {inv.AccessableRegisters.map((tag, i) => {
              return (
                <Select.Option value={tag} key={i}>
                  {tag}
                </Select.Option>
              );
            })}
          </Select>
        </div>
      </div>
    </div>
  );
};

export default class RegisterGetter extends RegisterWorkBase {
  constructor() {
    super();
    this.SettingTemplate = RegisterGetterTemplate;
  }

  get CanInvoke() {
    return false;
  }
  set CanInvoke(v: boolean) {
    super.CanInvoke = false;
  }

  // get CanBeCombined() {
  //   return false;
  // }

  GetOutputParameters() {
    return [''];
  }
}
