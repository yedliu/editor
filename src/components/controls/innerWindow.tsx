import { PureComponent, CSSProperties } from 'react';
import React from 'react';
import DnR from './DnR';
import { CustomTheme } from './DnR/themes';
import ReactDOM from 'react-dom';
import { observable } from 'mobx';
import { observer } from 'mobx-react';

const paneStyle = {
  width: '90%',
  height: '90%',
  top: '5%',
  left: '5%',
  backgroundColor: '#f2f2f2',
  pointerEvents: 'auto',
  boxShadow: '0px 0px 10px 2px #7F7F7F9F',
  borderRadius: '6px',
} as CSSProperties;

@observer
export default class InnerWindow extends PureComponent<any> {
  constructor(props) {
    super(props);
  }

  private dnr: DnR;

  render() {
    var windowTheme = CustomTheme({
      title: this.props.windowProps.title,
      windowState: this.dnr ? this.dnr.windowState : 'normal',
      onClose: this.props.windowProps.onClose,
      onMaximize: () => {
        if (this.dnr) {
          if (this.dnr.windowState == 'normal') this.dnr?.maximize();
          else this.dnr.restore();
        }
      },
      onMinimize: null,
    });

    return (
      <DnR
        ref={v => (this.dnr = v)}
        {...windowTheme}
        {...this.props.windowProps}
        style={paneStyle}
        cursorRemap={c => c}
        boundary={{ top: 3, left: 3, right: 3, bottom: 3 }}
        attachedTo={this.props.attachedTo}
      >
        {this.props.children}
      </DnR>
    );
  }
}
