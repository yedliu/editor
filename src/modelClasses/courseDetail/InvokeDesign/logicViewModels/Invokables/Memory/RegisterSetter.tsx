import { RegisterWorkBase } from './RegisterWorkBase';
import InvokeHandler from '../../../InvokeHandler';
import { Expose } from '@/class-transformer';
import { InvHandler, InvokerType } from '../../../InvokeHandlerMeta';
import { observable } from 'mobx';
import { Checkbox, Input, message, Select } from 'antd';
import React from 'react';
import { select } from 'linq-to-typescript';
import RUHelper from '@/redoundo/redoUndoHelper';

const RegisterSetterTemplate = (inv: RegisterSetter) => {
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
            display: inv.IsAddingRegister ? 'none' : '-webkit-box',
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
            {inv.AccessableRegisters?.map((tag, i) => {
              return (
                <Select.Option value={tag} key={i}>
                  {tag}
                </Select.Option>
              );
            })}
          </Select>
          <div
            style={{
              width: '15px',
              height: '15px',
              marginLeft: '3px',
              background: 'transparent',
              cursor: 'pointer',
            }}
            onClick={e =>
              inv.ToAddRegister(
                e.currentTarget.parentElement.parentElement.children[2]
                  .firstElementChild as HTMLInputElement,
              )
            }
          >
            <svg width="15" height="15" preserveAspectRatio="xMinYMin meet">
              <path
                d="M0,7 L14,7 M7,0 L7,14"
                stroke="#E8F8EF"
                fill="transparent"
                strokeWidth="3"
              />
            </svg>
          </div>
        </div>
        <div
          style={{
            display: !inv.IsAddingRegister ? 'none' : '-webkit-box',
            WebkitBoxOrient: 'horizontal',
            WebkitBoxAlign: 'center',
            WebkitBoxPack: 'start',
          }}
        >
          <Input
            size="small"
            style={{ width: '90px', height: '20px', marginLeft: '2px' }}
            tabIndex={-1}
            autoFocus={true}
            onBlur={e =>
              inv.DoAddRegister((e.currentTarget as HTMLInputElement).value)
            }
            onKeyDown={e => {
              if (e.keyCode == 13)
                inv.DoAddRegister((e.currentTarget as HTMLInputElement).value);
              else if (e.keyCode == 27) {
                inv.CancelAddRegister();
              }
            }}
          ></Input>
          <div
            style={{
              width: '15px',
              height: '15px',
              marginLeft: '3px',
              background: 'transparent',
              cursor: 'pointer',
            }}
            onClick={e => {
              inv.DoAddRegister(
                (e.currentTarget.parentElement.children[0] as HTMLInputElement)
                  .value,
              );
            }}
          >
            <svg width="15" height="15" preserveAspectRatio="xMinYMin meet">
              <path
                d="M2,7 L5,12 L14,0"
                stroke="#E8F8EF"
                fill="transparent"
                strokeWidth="3"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export class RegisterSetter extends RegisterWorkBase {
  constructor() {
    super();
    this.SettingTemplate = RegisterSetterTemplate;
  }

  // get CanBeCombined() {
  //   return false;
  // }

  @Expose()
  @InvHandler({ DisplayName: '下一步', Type: InvokerType.Invoke })
  public get InvId(): string {
    return super.InvId;
  }
  public set InvId(v: string) {
    super.InvId = v;
  }

  @Expose()
  public get IsPageGlobal(): boolean {
    return super.IsPageGlobal;
  }
  public set IsPageGlobal(v: boolean) {
    if (
      RUHelper.TrySetPropRedoUndo(
        this,
        'IsPageGlobal',
        () => (this._IsPageGlobal = v),
        v,
        this._IsPageGlobal,
      )
    ) {
      this.NotifyRegisterListChanged();
    }
  }

  get AccessableRegisters() {
    var result = RegisterWorkBase.GetAccessableRegisters(
      this,
      this.IsPageGlobal,
    );
    if (result.length == 0) {
      result.push('A');
    }
    return result;
  }

  @observable
  private _IsAddingRegister: boolean;
  public get IsAddingRegister(): boolean {
    return this._IsAddingRegister;
  }
  public set IsAddingRegister(v: boolean) {
    this._IsAddingRegister = v;
  }

  _tempOldRegister: string = null;

  ToAddRegister(input: HTMLInputElement) {
    input.value = '';
    this.IsAddingRegister = true;
    this._tempOldRegister = this.TargetRegister;
    window.setTimeout(() => {
      input.focus();
    }, 50);
  }

  DoAddRegister(tag: string) {
    if (this.IsAddingRegister) {
      var regExp: RegExp = new RegExp(
        '^[A-Za-z\u4e00-\u9fa5]+([\u4e00-\u9fa5A-Za-z_0-9]*)*',
      );
      if (tag == 'v' || tag == 'i') {
        message.error('v和i为特殊用途的保留名称，请使用其它寄存器名');
      } else if (tag != null && tag != '' && regExp.test(tag)) {
        this.TargetRegister = tag;
      } else {
        message.error(
          '寄存器名称需为字母或中文开头的字符串,可包含数学和下划线,不可包含特殊字符',
        );
      }
      this.IsAddingRegister = false;
      this.NotifyRegisterListChanged();
      // RegisterWorkBase.RefreshRegisterList(this.LogicDesign);
      // this.ClearUnusedRegisters();
    }
  }

  CancelAddRegister() {
    this.IsAddingRegister = false;
  }

  GetInputParameters() {
    return ['值'];
  }

  GetOutputParameters() {
    return [''];
  }

  OnDeleting() {
    var logicDesign = this.LogicDesign;
    super.OnDeleting();
    window.setTimeout(
      (() => {
        this.NotifyRegisterListChanged();
      }).bind(this),
      50,
    );
  }
}
