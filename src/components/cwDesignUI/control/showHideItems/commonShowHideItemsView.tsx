import { PureComponent } from 'react';
import React from 'react';
import { InputNumber } from 'antd';
import { ActionViewModel } from '@/modelClasses/courseDetail/ShowHideViewModels/ActionViewModel';
import { observer } from 'mobx-react';
import SkElementsSelector from './skElementsSelector';
import CommonElementsSelector from './commonElementsSelector';
import { AppearItemIcon, SwitchBoneIcon } from '@/svgs/designIcons';

@observer
export class CommonShowHideItemsView extends PureComponent<any> {
  render() {
    const { actionVM: _actionVM, scene } = this.props;
    var actionVM: ActionViewModel = _actionVM;
    if (actionVM) {
      return (
        <div
          style={{
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            WebkitBoxPack: 'start',
            whiteSpace: 'nowrap',
          }}
        >
          <div
            style={{
              display: '-webkit-box',
              WebkitBoxOrient: 'horizontal',
              WebkitBoxAlign: 'center',
              WebkitBoxPack: 'start',
              margin: '2px',
              whiteSpace: 'nowrap',
            }}
          >
            <div style={{ display: '-webkit-box', WebkitBoxAlign: 'center' }}>
              <label>出现</label>
              <CommonElementsSelector
                scene={scene}
                style={{ width: '14px', height: '14px', marginLeft: '3px' }}
                selectorName="选择元素"
                icon={AppearItemIcon}
                elementIds={actionVM.ElementId}
                elementIdsChanged={newIds => (actionVM.ElementId = newIds)}
                isSingle={false}
                isDisableCombined={false}
              ></CommonElementsSelector>
            </div>
            <div
              style={{
                display: '-webkit-box',
                WebkitBoxAlign: 'center',
                margin: '5px',
              }}
            >
              <label>消失</label>
              <CommonElementsSelector
                scene={scene}
                style={{ width: '14px', height: '14px', marginLeft: '3px' }}
                selectorName="选择元素"
                icon={AppearItemIcon}
                elementIds={actionVM.ClearElementId}
                elementIdsChanged={newIds => (actionVM.ClearElementId = newIds)}
                isSingle={false}
                isDisableCombined={false}
              ></CommonElementsSelector>
            </div>
            <div style={{ display: '-webkit-box', WebkitBoxAlign: 'center' }}>
              <label>切换</label>
              <SkElementsSelector
                scene={scene}
                style={{ width: '14px', height: '14px', marginLeft: '3px' }}
                selectorName="选择元素"
                icon={SwitchBoneIcon}
                switchBoneIds={actionVM.SwitchBoneIds}
                switchBoneIdsChanged={newIds => {
                  if (newIds != actionVM.SwitchBoneIds)
                    actionVM.SwitchBoneIds = newIds;
                }}
                isSingle={false}
              ></SkElementsSelector>
            </div>
          </div>
          <div
            style={{
              display: '-webkit-box',
              WebkitBoxOrient: 'horizontal',
              WebkitBoxPack: 'justify',
              WebkitBoxAlign: 'center',
            }}
          >
            <div
              style={{
                display: '-webkit-box',
                WebkitBoxOrient: 'horizontal',
                WebkitBoxPack: 'justify',
                WebkitBoxAlign: 'center',
                whiteSpace: 'nowrap',
              }}
            >
              {'延时 '}
              <InputNumber
                size="small"
                min={0}
                max={Number.POSITIVE_INFINITY}
                step={0.1}
                precision={2}
                value={Number(actionVM.Delay) || 0}
                onChange={v => (actionVM.Delay = Number(v))}
                style={{ width: '70px' }}
              />
            </div>
            <div
              style={{
                display: '-webkit-box',
                WebkitBoxOrient: 'horizontal',
                WebkitBoxPack: 'justify',
                WebkitBoxAlign: 'center',
                whiteSpace: 'nowrap',
                marginLeft: '8px',
              }}
            >
              {'回时 '}
              <InputNumber
                size="small"
                min={0}
                max={Number.POSITIVE_INFINITY}
                step={0.1}
                precision={2}
                value={Number(actionVM.RepeatDelay) || 0}
                onChange={v => (actionVM.RepeatDelay = Number(v))}
                style={{ width: '70px' }}
              />
            </div>
          </div>
        </div>
      );
    }
    return null;
  }
}
