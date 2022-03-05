import { PureComponent } from 'react';
import React from 'react';
import { InputNumber } from 'antd';
import { ActionViewModel } from '@/modelClasses/courseDetail/ShowHideViewModels/ActionViewModel';
import { observer } from 'mobx-react';
import CommonElementsSelector from './commonElementsSelector';
import SkElementsSelector from './skElementsSelector';
import {
  AppearItemIcon,
  NoneHideIcon,
  SwitchBoneIcon,
} from '@/svgs/designIcons';

@observer
export class EventListMaker extends PureComponent<any> {
  render() {
    const {
      showDelay,
      showRepeatDelay,
      actionVM: _actionVM,
      scene,
    } = this.props;

    var actionVM: ActionViewModel = _actionVM;
    if (actionVM) {
      return (
        <div
          style={{
            display: '-webkit-box',
            WebkitBoxOrient: 'horizontal',
            // WebkitBoxPack: 'justify',
            WebkitBoxAlign: 'center',
          }}
        >
          {showDelay ? (
            <div
              style={{
                display: '-webkit-box',
                WebkitBoxOrient: 'horizontal',
                WebkitBoxPack: 'justify',
                WebkitBoxAlign: 'center',
                whiteSpace: 'nowrap',
              }}
            >
              <InputNumber
                style={{ width: '50px' }}
                size="small"
                min={0}
                max={Number.POSITIVE_INFINITY}
                step={0.1}
                value={Number(actionVM.Delay) || 0}
                onChange={v => (actionVM.Delay = Number(v))}
              />
            </div>
          ) : null}

          {showRepeatDelay ? (
            <div
              style={{
                marginLeft: '2px',
                display: '-webkit-box',
                WebkitBoxOrient: 'horizontal',
                WebkitBoxPack: 'justify',
                WebkitBoxAlign: 'center',
                whiteSpace: 'nowrap',
              }}
            >
              <InputNumber
                style={{ width: '50px' }}
                size="small"
                min={0}
                max={Number.POSITIVE_INFINITY}
                step={0.1}
                value={Number(actionVM.RepeatDelay) || 0}
                onChange={v => (actionVM.RepeatDelay = Number(v))}
              />
            </div>
          ) : null}

          <div
            style={{
              display: '-webkit-box',
              WebkitBoxOrient: 'horizontal',
              WebkitBoxPack: 'justify',
              WebkitBoxAlign: 'center',
              whiteSpace: 'nowrap',
              marginLeft: showRepeatDelay ? '7px' : '37px',
            }}
          >
            <CommonElementsSelector
              scene={scene}
              style={{
                width: '14px',
                height: '14px',
                marginLeft: '2px',
                //position: 'relative',
              }}
              selectorName="出现"
              icon={AppearItemIcon}
              elementIds={actionVM.ElementId}
              elementIdsChanged={newIds => (actionVM.ElementId = newIds)}
              isSingle={false}
              isDisableCombined={false}
              hasItemColor="#0056b3"
              noItemColor="#20272F"
            ></CommonElementsSelector>
          </div>

          <div
            style={{
              display: '-webkit-box',
              marginLeft: '2px',
              WebkitBoxOrient: 'horizontal',
              WebkitBoxPack: 'justify',
              WebkitBoxAlign: 'center',
              whiteSpace: 'nowrap',
            }}
          >
            <CommonElementsSelector
              scene={scene}
              style={{
                width: '14px',
                height: '14px',
                marginLeft: '2px',
                //position: 'relative',
              }}
              selectorName="消失"
              icon={NoneHideIcon}
              elementIds={actionVM.ClearElementId}
              elementIdsChanged={newIds => (actionVM.ClearElementId = newIds)}
              isSingle={false}
              isDisableCombined={false}
              hasItemColor="#0056b3"
              noItemColor="#20272F"
            ></CommonElementsSelector>
          </div>
          <div
            style={{
              display: '-webkit-box',
              marginLeft: '2px',
              WebkitBoxOrient: 'horizontal',
              WebkitBoxPack: 'justify',
              WebkitBoxAlign: 'center',
              whiteSpace: 'nowrap',
            }}
          >
            <SkElementsSelector
              scene={scene}
              style={{
                width: '14px',
                height: '14px',
                marginLeft: '2px',
                //position: 'relative',
              }}
              selectorName="切换"
              icon={SwitchBoneIcon}
              switchBoneIds={actionVM.SwitchBoneIds}
              switchBoneIdsChanged={newIds => {
                if (newIds != actionVM.SwitchBoneIds)
                  actionVM.SwitchBoneIds = newIds;
              }}
              isSingle={false}
              hasItemColor="#0056b3"
              noItemColor="#20272F"
            ></SkElementsSelector>
          </div>
        </div>
      );
    }
    return null;
  }
}
