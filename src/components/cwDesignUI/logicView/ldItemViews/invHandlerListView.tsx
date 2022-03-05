import React, { PureComponent } from 'react';
import { observer } from 'mobx-react';
import ILogicDesignItem from '@/modelClasses/courseDetail/InvokeDesign/logicViewModels/ILogicDesignItem';
import InvokeHandler, {
  InvokeHandlerList,
} from '@/modelClasses/courseDetail/InvokeDesign/InvokeHandler';
import { InvHandlerIcon, EventHandlerIcon } from '@/svgs/designIcons';
import { InvokerType } from '@/modelClasses/courseDetail/InvokeDesign/InvokeHandlerMeta';
import { OutputDataPointListView } from './outputDataPointListView';
import LoopWork from '@/modelClasses/courseDetail/toolbox/LoopWork';
import { observable, runInAction } from 'mobx';
import { FuncOutput } from '@/modelClasses/courseDetail/InvokeDesign/logicViewModels/Invokables/InvFunc/FuncInvokeProxy';

@observer
export class NormalHandlerTemplate extends PureComponent<any> {
  constructor(props) {
    super(props);
  }

  handlerElement: HTMLElement = null;

  updateHandlerPosition() {
    const { invHandler: _invh } = this.props;
    var invHandler = _invh as InvokeHandler;
    runInAction(() => {
      if (this.handlerElement != null)
        invHandler?.RefreshHandlerPosition(this.handlerElement);
    });
  }

  public componentDidMount() {
    LoopWork.Instance.setMission(this, this.updateHandlerPosition.bind(this));
  }

  public componentWillUnmount() {
    const { invHandler: _invh } = this.props;
    var invHandler = _invh as InvokeHandler;
    LoopWork.Instance.removeMission(this);
  }

  render() {
    const { invHandler: invH } = this.props;
    var invHandler: InvokeHandler = invH;
    return (
      <div
        style={{
          display: '-webkit-box',
          WebkitBoxOrient: 'vertical',
          WebkitBoxPack: 'end',
          position: 'relative',
        }}
      >
        <div
          style={{
            minHeight: '18px',
            background: 'transparent',
            margin: '2px,2px,2px,0px',
            position: 'relative',
            display: '-webkit-box',
            WebkitBoxPack: 'end',
            WebkitBoxAlign: 'center',
          }}
        >
          <div>
            {invHandler.ExtendTemplate ? (
              <div
                style={{
                  position: 'relative',
                  marginLeft: '2px',
                  marginRight: '2px',
                }}
              >
                {invHandler.ExtendTemplate(invHandler)}
              </div>
            ) : null}
          </div>
          <div
            style={{
              height: '18px',
              position: 'relative',
              marginRight: '3px',
              lineHeight: '18px',
              cursor: 'pointer',
              display: '-webkit-box',
              WebkitBoxPack: 'end',
              whiteSpace: 'nowrap',
              WebkitUserSelect: 'none',
            }}
            ref={v => (this.handlerElement = v)}
            draggable="true"
            onDragStart={e => invHandler.startHandlerDrag(e)}
            onDrag={e => invHandler.onHandlerDrag(e)}
            onDragEnd={e => invHandler.onHandlerDragEnd(e)}
          >
            <div
              style={{
                marginRight: '1px',
                position: 'relative',
                lineHeight: '18px',
                whiteSpace: 'nowrap',
                display: invHandler.InvokerInfo.IsList ? 'none' : 'inline',
                pointerEvents: 'none',
              }}
            >
              {invHandler.Owner instanceof FuncOutput
                ? invHandler.Owner.Note
                : invHandler.InvokerInfo.DisplayName}
            </div>
            <div
              style={{
                marginLeft: '2px',
                height: '12px',
                lineHeight: '18px',
                display: 'inline-block',
                pointerEvents: 'none',
              }}
            >
              {invHandler?.InvokerInfo.Type == InvokerType.Nono
                ? null
                : invHandler?.InvokerInfo.Type == InvokerType.Invoke
                ? InvHandlerIcon('lightgray')
                : EventHandlerIcon('transparent')}
            </div>
          </div>
        </div>
        <OutputDataPointListView Item={invHandler} />
      </div>
    );
  }
}

@observer
export class ListHandlerTemplate extends PureComponent<any> {
  public componentDidMount() {}

  public componentWillUnmount() {}

  render() {
    const { invHandler: invH } = this.props;
    var invHandler: InvokeHandlerList = invH;
    return (
      <div
        style={{
          display: '-webkit-box',
          WebkitBoxOrient: 'vertical',
          WebkitBoxAlign: 'start',
          WebkitBoxPack: 'end',
          right: '0px',
          position: 'relative',
        }}
      >
        <div
          className="invlisthead"
          style={{
            height: '18px',
            lineHeight: '18px',
            display: '-webkit-box',
            WebkitBoxOrient: 'horizontal',
            WebkitBoxPack: 'start',
            WebkitBoxAlign: 'center',
          }}
        >
          <div
            style={{
              background: 'transparent',
              width: '10px',
              height: '10px',
              marginRight: '3px',
              cursor: 'pointer',
              position: 'relative',
            }}
            onClick={() => {
              invHandler.AddSubHandler();
            }}
          >
            <svg
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              pointerEvents="none"
              preserveAspectRatio="xMinYMin meet"
            >
              <path
                d="M0,5 L10,5 M5,0 L5,10"
                stroke="lightgray"
                strokeWidth="2"
              />
            </svg>
          </div>
          <div style={{ whiteSpace: 'nowrap' }}>
            {invHandler.InvokerInfo.DisplayName}
          </div>
        </div>
        {invHandler.HeaderTemplate &&
        invHandler.SubHandlers != null &&
        invHandler.SubHandlers.length > 0
          ? invHandler.HeaderTemplate(invHandler)
          : null}
        {invHandler.SubHandlers?.map((subHandler, i) => {
          return (
            <div
              key={i}
              style={{
                display: '-webkit-box',
                WebkitBoxOrient: 'horizontal',
                WebkitBoxPack: 'end',
                WebkitBoxAlign: 'center',
                marginTop: '2px',
                marginBottom: '2px',
                position: 'relative',
              }}
            >
              <div
                style={{
                  width: '10px',
                  height: '10px',
                  marginRight: '3px',
                  background: 'transparent',
                  cursor: 'pointer',
                  display: '-webkit-box',
                  WebkitBoxAlign: 'center',
                }}
                onClick={() => invHandler.RemoveSubHandler(subHandler)}
              >
                <div
                  style={{
                    width: '10px',
                    height: '2px',
                    background: 'lightgray',
                  }}
                ></div>
              </div>
              <div
                style={{
                  width: '10px',
                  height: '18px',
                  marginRight: '3px',
                  background: 'transparent',
                  display: '-webkit-box',
                  WebkitBoxOrient: 'vertical',
                  WebkitBoxAlign: 'stretch',
                  WebkitBoxPack: 'center',
                }}
              >
                <div
                  style={{
                    width: '8px',
                    height: '4px',
                    background: 'transparent',
                    marginBottom: '1px',
                    cursor: 'pointer',
                  }}
                  onClick={() => invHandler.MoveSubHandlerUp(subHandler)}
                >
                  <svg
                    // width="8"
                    // height="4"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    pointerEvents="none"
                    preserveAspectRatio="xMinYMin meet"
                  >
                    <path
                      d="M0,3 L4,0 L8,3"
                      strokeWidth="1"
                      stroke="lightgray"
                      fill="transparent"
                      strokeLinecap="round"
                    ></path>
                  </svg>
                </div>
                <div
                  style={{
                    width: '8px',
                    height: '4px',
                    background: 'transparent',
                    marginTop: '1px',
                    cursor: 'pointer',
                  }}
                  onClick={() => invHandler.MoveSubHandlerDown(subHandler)}
                >
                  <svg
                    // width="8"
                    // height="4"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    pointerEvents="none"
                    preserveAspectRatio="xMinYMin meet"
                  >
                    <path
                      d="M0,0 L4,3 L8,0"
                      strokeWidth="1"
                      fill="transparent"
                      stroke="lightgray"
                      strokeLinecap="round"
                    ></path>
                  </svg>
                </div>
              </div>
              <NormalHandlerTemplate invHandler={subHandler} />
            </div>
          );
        })}
        {invHandler.OutputDataPoints != null &&
        invHandler.OutputDataPoints.length > 0 ? (
          <OutputDataPointListView Item={invHandler} />
        ) : null}
      </div>
    );
  }
}
@observer
export default class InvHandlerListView extends React.Component<any> {
  constructor(props) {
    super(props);
  }
  render() {
    const { Item, IsClick } = this.props;
    var item: ILogicDesignItem = Item;
    return (
      <div
        style={{
          position: 'relative',
          display: '-webkit-box',
          WebkitBoxOrient: 'vertical',
          pointerEvents: 'none',
        }}
      >
        {item?.InvokeHandlers?.map((invHandler: InvokeHandler, i) => {
          return (
            <div key={i} style={{ pointerEvents: 'visible' }}>
              {!invHandler.InvokerInfo.IsList ? (
                <NormalHandlerTemplate
                  invHandler={invHandler}
                  IsClick={IsClick}
                />
              ) : (
                <ListHandlerTemplate invHandler={invHandler} />
              )}
            </div>
          );
        })}
      </div>
    );
  }
}
