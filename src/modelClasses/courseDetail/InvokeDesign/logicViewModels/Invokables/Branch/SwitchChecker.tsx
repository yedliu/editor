import InvokableBase from '@/modelClasses/courseDetail/InvokableBase';
import { observable } from 'mobx';
import RUHelper from '@/redoundo/redoUndoHelper';
import { Expose, Type } from '@/class-transformer';
import { InvHandler, InvokerType } from '../../../InvokeHandlerMeta';
import { InvokeHandlerListItem } from '../../../InvokeHandler';
import React from 'react';
import IPropUndoable from '@/redoundo/IPropUndoable';
import { stores } from '@/pages';
import ActionManager from '@/redoundo/actionManager';
import { Input } from 'antd';

const SwitchLineTemplate = (invHandler: InvokeHandlerListItem) => {
  return (
    <div>
      <Input
        size="small"
        style={{
          width: '60px',
          height: '16px',
        }}
        value={String(invHandler.DataObj.Content || '')}
        onChange={e =>
          (invHandler.DataObj.Content = String(e.target.value || ''))
        }
      ></Input>
    </div>
  );
};

export class SwitchLine implements IPropUndoable {
  get CanRecordRedoUndo(): boolean {
    if (
      stores.courseware &&
      !stores.courseware.isLoading &&
      !ActionManager.Instance.ActionIsExecuting
    )
      return true;
    return false;
  }
  @observable
  private _Content: string = null;
  @Expose()
  public get Content(): string {
    return this._Content;
  }
  public set Content(v: string) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'Content',
      () => (this._Content = v),
      v,
      this._Content,
    );
  }

  @observable
  private _InvId: string = null;
  @Expose()
  public get InvId(): string {
    return this._InvId;
  }
  public set InvId(v: string) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'InvId',
      () => (this._InvId = v),
      v,
      this._InvId,
    );
  }
}

export default class SwitchChecker extends InvokableBase {
  constructor() {
    super();
    this.SettingTemplate = null;
  }
  readonly HeaderBg = '#9F6F7F';

  @observable
  private _SwitchList: SwitchLine[];
  @Expose()
  @Type(() => SwitchLine)
  @InvHandler({
    Type: InvokerType.Invoke,
    DisplayName: '情况列表',
    IsList: true,
    Addable: true,
    ValuePropertyName: 'InvId',
    ListItemType: SwitchLine,
    ListUpdated: list => {},
    Template: SwitchLineTemplate,
  })
  public get SwitchList(): SwitchLine[] {
    return this._SwitchList;
  }
  public set SwitchList(v: SwitchLine[]) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'SwitchList',
      () => (this._SwitchList = v),
      v,
      this._SwitchList,
    );
  }

  GetInputParameters() {
    return ['参考值;disableCustom'];
  }
}
