import InvokableBase from '@/modelClasses/courseDetail/InvokableBase';
import { observable, action, runInAction } from 'mobx';
import RUHelper from '@/redoundo/redoUndoHelper';
import { Expose } from '@/class-transformer';
import { InvHandler, InvokerType } from '../../../InvokeHandlerMeta';
import React from 'react';
import { InputNumber, Select } from 'antd';
import HttpService from '@/server/httpServer';
import CacheHelper from '@/utils/cacheHelper';
import SmallPagesSelector from '@/components/cwDesignUI/control/showHideItems/smallPageSelector';
import { AppearItemIcon } from '@/svgs/designIcons';

const PageControlerSettingTemplate = (inv: PageControler) => {
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
            marginTop: '8px',
            display: '-webkit-box',
            WebkitBoxOrient: 'horizontal',
            WebkitBoxPack: 'start',
            whiteSpace: 'nowrap',
          }}
        >
          消息类型
          <SmallPagesSelector
            scene={inv.Scene}
            style={{
              width: '14px',
              height: '14px',
              marginLeft: '7px',
              marginTop: '3px',
              position: 'relative',
            }}
            selectorName="指定页选择"
            icon={AppearItemIcon}
            pageIds={inv.PageId}
            pageIdsChanged={v => (inv.PageId = v)}
            isSingle={true}
            noItemColor="#333333"
          ></SmallPagesSelector>
        </div>
      </div>
    );
  }
  return null;
};

export default class PageControler extends InvokableBase {
  constructor() {
    super();
    this.SettingTemplate = PageControlerSettingTemplate;
  }

  @observable
  private _PageId: string;
  @Expose()
  public get PageId(): string {
    return this._PageId;
  }
  public set PageId(v: string) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'PageId',
      () => (this._PageId = v),
      v,
      this._PageId,
    );
  }
}
