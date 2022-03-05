import React, { PureComponent } from 'react';
import { observer } from 'mobx-react';
import LogicDesign from '@/modelClasses/courseDetail/logicDesign';
import { TriggerBaseView } from './ldItemViews/triggerBaseView';
import { InvBaseView } from './ldItemViews/invBaseView';
import UIHelper from '@/utils/uiHelper';
import { LogicLinkLineView } from '@/modelClasses/courseDetail/InvokeDesign/LogicLinkLine';
import DataLinkLineView from './ldItemViews/dataLinkView';
import { FuncBaseView } from './ldItemViews/funcBaseView';
import { Dropdown, Menu } from 'antd';
import SubMenu from 'antd/lib/menu/SubMenu';
import AddInvItemMenu from './addInvItemMenu';
import { reaction } from 'mobx';
import StopWatch from '@/utils/stopWatch';
import ILogicDesignItem from '@/modelClasses/courseDetail/InvokeDesign/logicViewModels/ILogicDesignItem';

export const LogicItemMoveThumb = (item: ILogicDesignItem) => (
  <div
    style={{
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      background: 'transparent',
      zIndex: 0,
    }}
    onMouseDown={e => {
      if (e.target == e.currentTarget) item.LogicDesign.PressLogicItem(e, item);
    }}
  />
);

@observer
class DItemView extends PureComponent<any> {
  render() {
    var item = this.props.item;

    return (
      <div
        style={{
          position: 'absolute',
          zIndex: item.IsSelectedInDesign ? 3 : 0,
        }}
      >
        {(() => {
          switch (item.Role) {
            case 'Trigger':
              return <TriggerBaseView item={item} />;
            case 'Invokable':
              return <InvBaseView item={item}></InvBaseView>;
            case 'Func':
              return <FuncBaseView item={item}></FuncBaseView>;
            default:
              return null;
          }
        })()}
      </div>
    );
  }
}

@observer
class ItemsCavnas extends PureComponent<any> {
  render() {
    var logicDesign = this.props.logicDesign;
    var fatherView = this.props.fatherView;
    return (
      <div
        className="itemsCanvas"
        style={{
          position: 'absolute',
        }}
        ref={v => (fatherView.itemsCanvas = v)}
      >
        {logicDesign?.LogicDItems?.map((item, i) => {
          return <DItemView item={item} key={i} />;
        })}
      </div>
    );
  }
}

@observer
class DataLinkLayer extends PureComponent<any> {
  render() {
    var logicDesign = this.props.logicDesign;

    return (
      <div
        className="datalinkLayer"
        style={{
          position: 'absolute',
          zIndex: 5,
        }}
      >
        {logicDesign?.DataLinks?.map((link, i) => {
          return <DataLinkLineView link={link} key={i} />;
        })}
      </div>
    );
  }
}

@observer
class LinkLayer extends PureComponent<any> {
  render() {
    var logicDesign = this.props.logicDesign;

    return (
      <div
        className="linkLayer"
        style={{
          position: 'absolute',
          zIndex: 5,
        }}
      >
        {logicDesign?.Links?.map((link, i) => {
          return <LogicLinkLineView link={link} key={i} />;
        })}
      </div>
    );
  }
}

@observer
class ContextMenuLayer extends PureComponent<any> {
  private timer: any = null;

  handleChangeVisible = e => {
    const { logicDesign } = this.props;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }

    this.timer = setTimeout(() => {
      if (!e) logicDesign.IsShowInvAddMenu = false;
    }, 100);
  };

  componentWillUnmount() {
    clearTimeout(this.timer);
    this.timer = null;
  }

  render() {
    var logicDesign = this.props.logicDesign;
    var fatherView = this.props.fatherView;
    return (
      <div
        className="contextMenuLayer"
        style={{
          position: 'absolute',
          pointerEvents: 'none',
        }}
        ref={v => (fatherView.contextMenuLayer = v)}
      >
        {logicDesign?.IsShowTriggerAddMenu ? (
          <Dropdown
            overlay={
              <Menu>
                {logicDesign.TriggerAddNameList?.map((triggerName, i) => {
                  return (
                    <Menu.Item
                      key={i}
                      onClick={() => logicDesign.AddTrigger(triggerName)}
                    >
                      {triggerName}
                    </Menu.Item>
                  );
                })}
              </Menu>
            }
            disabled={!logicDesign.IsShowTriggerAddMenu}
            visible={logicDesign.IsShowTriggerAddMenu}
            trigger={['click']}
            onVisibleChange={e => {
              if (!e) logicDesign.IsShowTriggerAddMenu = false;
            }}
          >
            <div
              style={{
                position: 'absolute',

                left: `${logicDesign.AddPosition.x}px`,
                top: `${logicDesign.AddPosition.y}px`,
                width: '1px',
                height: '1px',
              }}
            ></div>
          </Dropdown>
        ) : null}

        {logicDesign?.IsShowInvAddMenu ? (
          <Dropdown
            overlay={AddInvItemMenu({ logicDesign })}
            disabled={!logicDesign.IsShowInvAddMenu}
            visible={logicDesign.IsShowInvAddMenu}
            trigger={['click']}
            onVisibleChange={this.handleChangeVisible}
          >
            <div
              style={{
                position: 'absolute',

                left: `${logicDesign.AddPosition.x}px`,
                top: `${logicDesign.AddPosition.y}px`,
                width: '1px',
                height: '1px',
              }}
            ></div>
          </Dropdown>
        ) : null}
      </div>
    );
  }
}

@observer
export default class LogicDesignCanvas extends React.Component<any> {
  lgCanvasRoot: HTMLElement;
  itemsCanvas: HTMLElement;
  linesLayer: HTMLElement;
  contextMenuLayer: HTMLElement;

  public get LogicItemViews(): HTMLElement[] {
    if (this.itemsCanvas) {
      var result = [];
      for (var i = 0; i < this.itemsCanvas.children.length; i++) {
        result.push(this.itemsCanvas.children[i].firstElementChild);
      }
      return result;
    }
    return [];
  }

  public get InvLineViews(): HTMLElement[] {
    if (this.linesLayer) {
      var result = [];
      var inv_lines = this.linesLayer.getElementsByClassName('logicLinkLine');
      if (inv_lines) result.push(...inv_lines);
      return result;
    }
    return [];
  }

  public get DataLineViews(): HTMLElement[] {
    if (this.linesLayer) {
      var result = [];
      var inv_lines = this.linesLayer.getElementsByClassName('dataLinkLine');
      if (inv_lines) result.push(...inv_lines);
      return result;
    }
    return [];
  }

  protected scaleChanged = reaction(
    () => {
      const { logicDesign: _logicDesign } = this.props;
      var logicDesign = _logicDesign as LogicDesign;
      if (logicDesign) return logicDesign.Scale;
      return null;
    },
    scale => {
      var lgCanvasTransfrom = `scale(${scale},${scale})`;
      if (this.lgCanvasRoot)
        this.lgCanvasRoot.style.transform = lgCanvasTransfrom;
    },
  );

  render() {
    const { logicDesign: _logicDesign } = this.props;
    var logicDesign = _logicDesign as LogicDesign;

    if (!logicDesign) return null;

    //var lgCanvasTransfrom = `scale(${logicDesign.Scale},${logicDesign.Scale})`;

    return (
      <div
        className="lgCanvas"
        style={{
          position: 'absolute',
          transformOrigin: '0px 0px',
          // transform: lgCanvasTransfrom,
        }}
        ref={v => (this.lgCanvasRoot = v)}
        tabIndex={-1}
      >
        <ItemsCavnas logicDesign={logicDesign} fatherView={this} />
        <div
          className="linesLayer"
          style={{
            position: 'absolute',
            pointerEvents: 'none',
          }}
          ref={v => (this.linesLayer = v)}
        >
          <DataLinkLayer logicDesign={logicDesign} />
          <LinkLayer logicDesign={logicDesign} />
        </div>
        <ContextMenuLayer logicDesign={logicDesign} fatherView={this} />
      </div>
    );
  }
}
