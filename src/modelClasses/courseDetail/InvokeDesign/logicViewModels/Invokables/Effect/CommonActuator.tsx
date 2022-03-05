import InvokableBase from '@/modelClasses/courseDetail/InvokableBase';
import { InvHandler, InvokerType } from '../../../InvokeHandlerMeta';
import { observable, reaction } from 'mobx';
import RUHelper from '@/redoundo/redoUndoHelper';
import { ActionViewModel } from '@/modelClasses/courseDetail/ShowHideViewModels/ActionViewModel';
import { Expose, serialize, Type, deserializeArray } from '@/class-transformer';
import React from 'react';
import { CommonShowHideItemsView } from '@/components/cwDesignUI/control/showHideItems/commonShowHideItemsView';

const CommonActuatorSettingTemplate = (inv: CommonActuator) => {
  return (
    <div
      style={{
        display: '-webkit-box',
        WebkitBoxOrient: 'vertical',
        WebkitBoxPack: 'justify',
      }}
    >
      {inv.EventList?.map((event, i) => {
        return (
          <CommonShowHideItemsView key={i} actionVM={event} scene={inv.Scene} />
        );
      })}
    </div>
  );
};

export default class CommonActuator extends InvokableBase {
  constructor() {
    super();
    this.SettingTemplate = CommonActuatorSettingTemplate;
  }

  @observable
  private _EventList: ActionViewModel[];
  @Expose()
  @Type(() => ActionViewModel)
  public get EventList(): ActionViewModel[] {
    if (!this._EventList) this._EventList = [new ActionViewModel()];
    return this._EventList;
  }
  public set EventList(v: ActionViewModel[]) {
    if (RUHelper.Core.ActionIsExecuting) this.eventListChangedByRedoUndo = true;
    this._EventList = v;
  }

  private oldEventListStr = null;
  private eventListChangedByRedoUndo = false;
  protected eventListChanged = reaction(
    () => serialize(this.EventList, { strategy: 'excludeAll' }),
    eventListStr => {
      if (this.eventListChangedByRedoUndo) {
        this.eventListChangedByRedoUndo = false;
      } else if (this.oldEventListStr != eventListStr) {
        var newEventList = deserializeArray(ActionViewModel, eventListStr, {
          strategy: 'excludeAll',
        });
        this.EventList = newEventList;
        if (this.CanRecordRedoUndo)
          RUHelper.SetProperty(
            this,
            'EventList',
            newEventList,
            deserializeArray(ActionViewModel, this.oldEventListStr, {
              strategy: 'excludeAll',
            }),
            true,
          );
      }
      this.oldEventListStr = eventListStr;
    },
    {
      fireImmediately: true,
    },
  );

  @InvHandler({ DisplayName: '完成后执行', Type: InvokerType.Event })
  public get InvId() {
    return super.InvId;
  }
  public set InvId(v: string) {
    super.InvId = v;
  }

  ReplaceRelativeIds(map: Map<string, string>) {
    super.ReplaceRelativeIds(map);
    let eventList = this.EventList.slice(); // 防止替换ID时reaction被重置
    if (eventList) {
      for (let event of eventList) {
        event.ReplaceIds(map);
      }
    }
    this.EventList = eventList;
  }
}
