import React, { PureComponent } from 'react';
import { observer } from 'mobx-react';
import ILogicDesignItem from '@/modelClasses/courseDetail/InvokeDesign/logicViewModels/ILogicDesignItem';
import InvFunction from '@/modelClasses/courseDetail/InvokeDesign/logicViewModels/Invokables/InvFunc/InvFunction';
import { FuncInput } from '@/modelClasses/courseDetail/InvokeDesign/logicViewModels/Invokables/InvFunc/FuncInvokeProxy';
import { InvHandlerIcon } from '@/svgs/designIcons';
import { InputDataPointListView } from './inputDataPointListView';
import InvHandlerListView from './invHandlerListView';
import { OutputDataPointListView } from './outputDataPointListView';
import LoopWork from '@/modelClasses/courseDetail/toolbox/LoopWork';
import UIHelper from '@/utils/uiHelper';
import { Input } from 'antd';
import { LogicItemMoveThumb } from '../logicDesignCanvas';
import TextArea from 'antd/lib/input/TextArea';
import InvokableBase from '@/modelClasses/courseDetail/InvokableBase';
import LogicDesignContextMenu from '../logicDesignContextMenu';
import { Dropdown } from 'antd';
import { observable, runInAction } from 'mobx';

@observer
export class FuncInputInvPort extends PureComponent<{
  funcInput: FuncInput;
  IsClick: boolean;
}> {
  private handlerElement: HTMLElement = null;

  updateHandlerPosition() {
    const { funcInput } = this.props;
    runInAction(() => {
      if (this.handlerElement != null)
        funcInput.RefreshHandlerPosition(this.handlerElement);
    });
  }

  public componentDidMount() {
    const { funcInput } = this.props;
    this.updateHandlerPosition();
    // LoopWork.Instance.setMission(this, this.updateHandlerPosition.bind(this));
  }

  componentDidUpdate(nextprops) {
    if (nextprops.IsClick != this.props.IsClick) {
      this.updateHandlerPosition();
    }
  }

  public componentWillUnmount() {
    const { funcInput } = this.props;
    LoopWork.Instance.removeMission(this);
  }

  render() {
    var funcInput = this.props.funcInput;
    return (
      <div
        style={{
          display: '-webkit-box',
          WebkitBoxOrient: 'horizontal',
          position: 'relative',
          WebkitBoxPack: 'start',
          whiteSpace: 'nowrap',
        }}
        ref={v => (this.handlerElement = v)}
        onDragOver={e => funcInput.onHandlerDragOver(e)}
        onDrop={e => funcInput.onHandlerDrop(e)}
      >
        {InvHandlerIcon('lightgray')}
        <label style={{ marginLeft: '3px' }}>{funcInput.Note}</label>
      </div>
    );
  }
}

@observer
export class FuncBaseView extends React.Component<{ item: ILogicDesignItem }> {
  private rootDiv: HTMLElement;

  componentDidMount() {
    LoopWork.Instance.setMission(this, this.updateRect.bind(this));
  }

  // 获取函数组件的rect
  updateRect() {
    if (this.props.item instanceof InvFunction) {
      var item = this.props.item;
      item.getClientRect(this.rootDiv);
    }
  }

  public componentWillUnmount() {
    if (this.props.item instanceof InvFunction) {
      var item = this.props.item;
      item.CheckIsCurrentPage();
    }

    LoopWork.Instance.removeMission(this);
  }

  //是否显示右键操作菜单
  @observable
  private isShowDir: Boolean = false;

  @observable
  public isClick: boolean = false;

  render() {
    if (this.props.item instanceof InvFunction) {
      var item = this.props.item;
      return (
        <div
          style={{
            position: 'absolute',
            left: `${item.Position.x}px`,
            top: `${item.Position.y}px`,
            background: `${item.DetailBg}`,
            borderRadius: '3px',
            border: `2px solid ${
              item.IsSelectedInDesign ? '#3333EF6F' : '#9999993F'
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
          ref={v => (this.rootDiv = v)}
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
              }}
              onMouseDown={e => {
                this.isClick = true;
                item.LogicDesign.PressLogicItem(e, item);
              }}
              onMouseUp={e => (this.isClick = false)}
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
              <a
                style={{ color: '#66669F' }}
                onClick={() => {
                  item.OpenWindow();
                }}
              >
                打开
              </a>
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
                color: 'floralwhite',
                height: '24px',
                border: '0px solid transparent',
                resize: 'none',
                minWidth: '160px',
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
              <div>
                {item.InputInvokeProxys?.map(
                  (funcInput: FuncInput, i: number) => {
                    return (
                      <FuncInputInvPort
                        IsClick={this.isClick}
                        key={i}
                        funcInput={funcInput}
                      />
                    );
                  },
                )}
              </div>
              <div>
                <InputDataPointListView item={item} />
              </div>
            </div>

            <div
              className="outports"
              style={{
                minHeight: '10px',
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                WebkitBoxPack: 'end',
                position: 'relative',
              }}
            >
              <InvHandlerListView Item={item}></InvHandlerListView>
              <OutputDataPointListView Item={item}></OutputDataPointListView>
            </div>
          </div>
        </div>
      );
    }
    return null;
  }
}
