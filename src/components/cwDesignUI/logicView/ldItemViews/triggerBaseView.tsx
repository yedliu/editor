import React, { PureComponent } from 'react';
import InvokeTriggerBase from '@/modelClasses/courseDetail/triggers/invokeTriggerBase';
import { observer } from 'mobx-react';
import { InvokeHandlerList } from '@/modelClasses/courseDetail/InvokeDesign/InvokeHandler';
import InvHandlerListView from './invHandlerListView';
import { OutputDataPointListView } from './outputDataPointListView';
import { noCalcChildrenSize } from '@/utils/Math2D';
import { LogicItemMoveThumb } from '../logicDesignCanvas';
import LogicDesignContextMenu from '../logicDesignContextMenu';
import { Dropdown } from 'antd';
import { observable } from 'mobx';

@observer
class SettingTemplateView extends PureComponent<any> {
  render() {
    const { item } = this.props;
    if (item && item instanceof InvokeTriggerBase && item.SettingTemplate)
      return item.SettingTemplate(item);
    return null;
  }
}

@observer
export class TriggerBaseView extends PureComponent<any> {
  public componentDidMount() {
    const { item } = this.props;
    if (item && item instanceof InvokeTriggerBase) {
      item.RefreshInvHandlerLinks();
    }
  }

  //是否显示右键操作菜单
  @observable
  private isShowDir: Boolean = false;

  render() {
    const { item } = this.props;

    if (item && item instanceof InvokeTriggerBase) {
      return (
        <div
          className={noCalcChildrenSize}
          style={{
            position: 'absolute',
            // left: `${item.Position.x}px`,
            // top: `${item.Position.y}px`,
            transform: `translate3d(${item.Position.x}px, ${item.Position.y}px, 0)`,
            background: `${item.DetailBg}`,
            borderRadius: '3px',
            border: `2px solid ${
              item.IsSelectedInDesign ? '#3333EF6F' : '#9999993F'
            }`,
            boxShadow: `${
              item.IsSelectedInDesign ? `0px 0px 7px #3333EF7F` : ''
            }`,
            minWidth: '120px',
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            color: `${item.HeaderFg}`,
            fontSize: '12px',
          }}
        >
          <Dropdown
            overlay={LogicDesignContextMenu({
              item: item,
              isShowDir: this.isShowDir,
            })}
            trigger={['contextMenu']}
            onVisibleChange={e => {
              this.isShowDir =
                e &&
                item.IsSelectedInDesign != undefined && item.IsSelectedInDesign;
            }}
          >
            <div
              className="triggerHeader"
              style={{
                height: '20px',
                width: '100%',
                borderTopLeftRadius: '3px',
                borderTopRightRadius: '3px',
                background: `${item.HeaderBg}`,
                whiteSpace: 'nowrap',
                display: '-webkit-box',
                WebkitBoxOrient: 'horizontal',
                WebkitBoxPack: 'justify',
              }}
              onMouseDown={e => item.LogicDesign.PressLogicItem(e, item)}
              onDoubleClick={() => (item.IsShowDetail = !item.IsShowDetail)}
            >
              <div
                style={{
                  position: 'relative',
                  color: `${item.HeaderFg}`,
                  float: 'left',
                  whiteSpace: 'nowrap',
                  top: '50%',
                  transform: 'translate(0,-50%)',
                  pointerEvents: 'none',
                }}
              >
                {item.DisplayNameWithOwnerName}
              </div>

              {item.SettingTemplate ? (
                <div
                  style={{
                    position: 'relative',
                    top: '50%',
                    transform: 'translate(0,-50%)',
                    float: 'right',
                    marginLeft: '10px',
                    marginRight: '3px',
                    height: '16px',
                    width: '16px',
                    background: 'transparent',
                    cursor: 'pointer',
                  }}
                  onClick={() => (item.IsShowDetail = !item.IsShowDetail)}
                >
                  <svg width="16" height="16" viewBox="0,0,16,16">
                    <circle
                      cx="8"
                      cy="8"
                      r="7"
                      stroke={item.HeaderFg}
                      fill="transparent"
                    />
                    {item.IsShowDetail ? (
                      <path
                        d="M4,6 L8,10 L12,6"
                        stroke={item.HeaderFg}
                        fill="transparent"
                      />
                    ) : (
                      <path
                        d="M10,4 L6,8 L10,12"
                        stroke={item.HeaderFg}
                        fill="transparent"
                      />
                    )}
                  </svg>
                </div>
              ) : null}
            </div>
          </Dropdown>

          <div
            className="outportsRow"
            style={{
              width: '100%',
              minHeight: '10px',
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              position: 'relative',
              float: 'right',
              color: '#333333',
            }}
            // onMouseDown={e => item.LogicDesign.PressLogicItem(e, item)}
          >
            <div
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                background: 'transparent',
              }}
              onMouseDown={e => item.LogicDesign.PressLogicItem(e, item)}
            />
            <InvHandlerListView Item={item}></InvHandlerListView>
            <OutputDataPointListView Item={item}></OutputDataPointListView>
          </div>
          {item.IsShowDetail && item.SettingTemplate != null ? (
            <div
              className="detailContent"
              style={{
                pointerEvents: item.IsSettingReadOnly ? 'none' : 'visible',
                opacity: item.IsSettingReadOnly ? 0.7 : 1,
              }}
            >
              <div
                style={{ width: '99%', height: '1px', background: 'gray' }}
              />
              <div
                style={{
                  width: '99%',
                  color: '#333333',
                  padding: '4px',
                  position: 'relative',
                }}
              >
                {LogicItemMoveThumb(item)}
                <div style={{ position: 'relative' }}>
                  <SettingTemplateView item={item} />
                </div>
              </div>
            </div>
          ) : null}
        </div>
      );
    }
    return <div></div>;
  }
}
