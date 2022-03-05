import MissionGroup from './MissionGroup';
import IPropUndoable from '@/redoundo/IPropUndoable';
import { stores } from '@/pages';
import ActionManager from '@/redoundo/actionManager';
import { observable } from 'mobx';
import { Expose, Type } from '@/class-transformer';
import RUHelper from '@/redoundo/redoUndoHelper';
import IdHelper from '@/utils/idHelper';
import { InvHandler, InvokerType } from '../../../InvokeHandlerMeta';
import MetaHelper from '@/utils/metaHelper';
import MissionBase from '../Mission/MissionBase';
import ILogicDesignItem from '../../ILogicDesignItem';
import React from 'react';
import { InputNumber, Checkbox, Select, Input } from 'antd';
import InvokableBase from '@/modelClasses/courseDetail/InvokableBase';
import { InvokeHandlerListItem } from '../../../InvokeHandler';
import { AppearItemIcon } from '@/svgs/designIcons';
import { TextAutomaticTag } from '@/components/controls/textAutomaticTag';

const MissionActionGroupTagSettingTemplate = (inv: MissionActionGroup) => {
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
            width: '98%',
          }}
          onWheel={e => e.stopPropagation()}
        >
          {'行为模式'}
          <Select
            style={{ marginLeft: '4px', marginRight: '6px', width: 140 }}
            size={'small'}
            defaultValue={0}
            value={inv.ActionMode}
            onChange={value => (inv.ActionMode = value)}
          >
            <Select.Option value={0}>输入自动跳转</Select.Option>
          </Select>
        </div>
        <div
          style={{
            border: '1px solid #CCCCCC',
            borderRadius: '3px',
            width: '200px',
            minHeight: '35px',
            marginTop: '3px',
          }}
        >
          元素顺序清单
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
            <div style={{ width: '80%', textAlign: 'center' }}>组件注释</div>
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
                    width: '80%',
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
  }
  return null;
};

export default class MissionActionGroup extends MissionGroup {
  constructor() {
    super();
    this.SettingTemplate = MissionActionGroupTagSettingTemplate;
  }

  @observable
  private _ActionMode: number = 0;
  @Expose()
  public get ActionMode(): number {
    return this._ActionMode;
  }
  public set ActionMode(v: number) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'ActionMode',
      () => (this._ActionMode = v),
      v,
      this._ActionMode,
    );
  }

  @InvHandler({
    DisplayName: '',
    Type: InvokerType.Invoke,
    DisplayInOwner: false,
  })
  get SuccessId() {
    return super.SuccessId;
  }
  set SuccessId(v) {
    super.SuccessId = v;
  }

  @InvHandler({
    DisplayName: '',
    Type: InvokerType.Invoke,
    DisplayInOwner: false,
  })
  get ErrorId() {
    return super.ErrorId;
  }
  set ErrorId(v) {
    super.ErrorId = v;
  }

  @InvHandler({
    DisplayName: '',
    Type: InvokerType.Invoke,
    DisplayInOwner: false,
  })
  get InvId() {
    return super.InvId;
  }
  set InvId(v) {
    super.InvId = v;
  }
}
