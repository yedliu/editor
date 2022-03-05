import { PureComponent } from 'react';
import React from 'react';
import { observer } from 'mobx-react';
import InnerWindow from '@/components/controls/innerWindow';
import InvFunction from '@/modelClasses/courseDetail/InvokeDesign/logicViewModels/Invokables/InvFunc/InvFunction';
import LogicDesignView from '../logicDesignView';

@observer
class LogicDesignViewContainer extends PureComponent<any> {
  render() {
    return (
      <div
        style={{
          position: 'absolute',
          left: '3px',
          right: '3px',
          top: '0px',
          bottom: '3px',
        }}
      >
        <LogicDesignView logicDesign={this.props.logicDesign} />
      </div>
    );
  }
}

@observer
export default class FuncWindowView extends PureComponent<any> {
  constructor(props) {
    super(props);
  }

  render() {
    var invFunc: InvFunction = this.props.invFunc;
    if (invFunc && invFunc instanceof InvFunction) {
      return (
        <div
          style={{
            position: 'absolute',
            left: '0px',
            top: '0px',
            right: '0px',
            bottom: '0px',
            pointerEvents: 'none',
            zIndex: invFunc.isWindowActived ? 1 : 0,
          }}
        >
          <InnerWindow
            windowProps={{
              title: invFunc.Note,
              onClose: () => {
                invFunc.CloseWindow();
              },
              onActive: () => {
                invFunc.ActiveWindow();
              },
            }}
            attachedTo={this.props.attachedTo}
          >
            {/* 这里必须用component，因为Dnr会向子项抛属性 */}
            <LogicDesignViewContainer logicDesign={invFunc.InnerLogicDesign} />
          </InnerWindow>
        </div>
      );
    }

    return null;
  }
}
