import InvokableBase from '@/modelClasses/courseDetail/InvokableBase';
import { observable } from 'mobx';
import RUHelper from '@/redoundo/redoUndoHelper';
import React from 'react';
import { Expose } from '@/class-transformer';
import CommonElementsSelector from '@/components/cwDesignUI/control/showHideItems/commonElementsSelector';
import { AppearItemIcon } from '@/svgs/designIcons';

const EditItemsGetterSettingTemplate = (inv: EditItemsGetter) => {
  if (inv != null && inv.LogicDesign != null) {
    return (
      <div
        style={{
          width: '150px',
          display: '-webkit-box',
          WebkitBoxOrient: 'horizontal',
          WebkitBoxPack: 'start',
          whiteSpace: 'nowrap',
          marginTop: '5px',
          WebkitBoxAlign: 'center',
        }}
      >
        {'目标元素'}
        <CommonElementsSelector
          scene={inv.Scene}
          style={{ width: '14px', height: '14px', marginLeft: '3px' }}
          selectorName="选择元素"
          icon={AppearItemIcon}
          elementIds={inv.ItemIds}
          elementIdsChanged={newIds => (inv.ItemIds = newIds)}
          isSingle={false}
          isDisableCombined={false}
        ></CommonElementsSelector>
      </div>
    );
  }
  return null;
};

export default class EditItemsGetter extends InvokableBase {
  constructor() {
    super();
    this.SettingTemplate = EditItemsGetterSettingTemplate;
  }

  readonly HeaderBg = '#9F9F7F';
  readonly DetailBg = '#C8C8C8';
  get CanInvoke() {
    return false;
  }
  set CanInvoke(v: boolean) {
    super.CanInvoke = false;
  }

  @observable
  private _ItemIds: string;
  @Expose()
  public get ItemIds(): string {
    return this._ItemIds;
  }
  public set ItemIds(v: string) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'ItemIds',
      () => (this._ItemIds = v),
      v,
      this._ItemIds,
    );
  }

  GetOutputParameters() {
    return ['元素'];
  }
}
