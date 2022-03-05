import React, { PureComponent } from 'react';
import InvokableBase from '@/modelClasses/courseDetail/InvokableBase';
import { observer } from 'mobx-react';
import InvHandlerListView from './invHandlerListView';
import { OutputDataPointListView } from './outputDataPointListView';
import { InvHandlerIcon } from '@/svgs/designIcons';
import { InputDataPointListView } from './inputDataPointListView';
import LoopWork from '@/modelClasses/courseDetail/toolbox/LoopWork';
import { flow, reaction } from 'mobx';
import TextArea from 'antd/lib/input/TextArea';

import {
  FuncDataInput,
  FuncDataOutput,
} from '@/modelClasses/courseDetail/InvokeDesign/logicViewModels/Invokables/InvFunc/FuncInvokeProxy';
import { noCalcChildrenSize } from '@/utils/Math2D';
import { LogicItemMoveThumb } from '../logicDesignCanvas';
import LogicDesignContextMenu from '../logicDesignContextMenu';
import { Dropdown } from 'antd';
import { observable } from 'mobx';
import { stores } from '@/pages';

@observer
class SettingTemplateView extends PureComponent<any> {
  render() {
    const { item } = this.props;
    if (item && item instanceof InvokableBase && item.SettingTemplate)
      return item.SettingTemplate(item);
    return null;
  }
}

@observer
export class InvBaseView extends React.Component<any> {
  private handlerElement: HTMLElement = null;
  private invBase: HTMLElement = null;

  updateHandlerPosition() {
    const { item } = this.props;
    var inv: InvokableBase = item;
    if (this.handlerElement != null)
      inv.RefreshHandlerPosition(this.handlerElement);
    if (this.invBase != null) {
      item.getClientRect(this.invBase);
    }
  }

  public componentDidMount() {
    const { item } = this.props;
    this.updateHandlerPosition();
    // LoopWork.Instance.setMission(this, this.updateHandlerPosition.bind(this));
    if (item && item instanceof InvokableBase) {
      item.RefreshInvHandlerLinks();
      item.RefreshInputDataLinks();
    }
  }

  componentDidUpdate() {
    this.updateHandlerPosition();
  }

  protected changePosition = reaction(
    () => stores.commander.IsActiveLogicDesign,
    data => {
      this.updateHandlerPosition();
    },
  );

  public componentWillUnmount() {
    const { item } = this.props;
    LoopWork.Instance.removeMission(this);
  }

  //是否显示右键操作菜单
  @observable
  private isShowDir: Boolean = false;

  @observable
  private isClick: boolean = false;

  render() {
    const { item } = this.props;
    if (item && item instanceof InvokableBase) {
      return (
        <div
          className={noCalcChildrenSize}
          ref={el => (this.invBase = el)}
          style={{
            position: 'absolute',
            // left: `${item.Position.x}px`,
            // top: `${item.Position.y}px`,
            transform: `translate3d(${item.Position.x}px, ${item.Position.y}px, 0)`,
            background: `${item.DetailBg}`,
            borderRadius: '3px',
            border: `2px solid ${
              item.IsSelectedInDesign ? '#3333EF6F' : '#7799777F'
            }`,
            boxShadow: `${
              item.IsSelectedInDesign ? `0px 0px 7px #3333EF7F` : ''
            }`,
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            WebkitBoxPack: 'justify',
            WebkitBoxAlign: 'stretch',
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
                item.IsSelectedInDesign != undefined &&
                item.IsSelectedInDesign;
            }}
          >
            <div
              className="invHeader"
              style={{
                display: '-webkit-box',
                WebkitBoxOrient: 'horizontal',
                WebkitBoxPack: 'justify',
                height: '20px',
                width: '100%',
                borderTopLeftRadius: '3px',
                borderTopRightRadius: '3px',
                background: `${item.HeaderBg}`,
                whiteSpace: 'nowrap',
              }}
              onMouseDown={e => {
                this.isClick = true;
                item.LogicDesign.PressLogicItem(e, item);
              }}
              onMouseUp={e => (this.isClick = false)}
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
                {item.DisplayName}
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
          <div className="notediv">
            <TextArea
              className="scrollableView"
              style={{
                width: '100%',
                overflowY: 'auto',
                overflowX: 'hidden',
                wordBreak: 'break-all',
                background: 'lightgray',
                color: 'forestgreen',
                height: '24px',
                border: '0px solid transparent',
                resize: 'none',
              }}
              placeholder="添加注释"
              value={item.Note}
              onChange={e => {
                item.Note = e.target.value;
                e.target.style.height = `24px`;
                var height = Math.max(24, Math.min(70, e.target.scrollHeight));
                e.target.style.height = `${height}px`;
              }}
            />
          </div>
          <div
            className="portsdiv"
            style={{
              color: '#333333',
              position: 'relative',
              display: '-webkit-box',
              WebkitBoxOrient: 'horizontal',
              WebkitBoxPack: 'justify',
              WebkitBoxAlign: 'start',
              margin: '0px',
            }}
          >
            {LogicItemMoveThumb(item)}

            <div
              className="inports"
              style={{
                minHeight: '10px',
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                position: 'relative',
                marginRight: '5px',
              }}
            >
              {item.CanInvoke ? (
                <div
                  className="beInvokeHandler"
                  style={{
                    height: '18px',
                    width: '35px',
                    marginLeft: '4px',
                    background: 'transparent',
                  }}
                  ref={v => (this.handlerElement = v)}
                  onDragOver={e => {
                    item.onHandlerDragOver(e);
                  }}
                  onDrop={e => {
                    item.onHandlerDrop(e);
                  }}
                >
                  {InvHandlerIcon('lightgray')}
                </div>
              ) : null}
              {item.InputDataPoints &&
              item.InputDataPoints.length > 0 &&
              !(item instanceof FuncDataInput) ? (
                <div>
                  <InputDataPointListView item={item} IsClick={this.isClick} />
                </div>
              ) : null}
            </div>

            <div
              className="outports"
              style={{
                minHeight: '10px',
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                WebkitBoxPack: 'end',
                // WebkitBoxAlign: 'start',
                position: 'relative',
              }}
              // onMouseDown={e => item.LogicDesign.PressLogicItem(e, item)}
            >
              <InvHandlerListView
                Item={item}
                IsClick={this.isClick}
              ></InvHandlerListView>
              {!(item instanceof FuncDataOutput) ? (
                <OutputDataPointListView Item={item}></OutputDataPointListView>
              ) : null}
            </div>
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
  }
}
