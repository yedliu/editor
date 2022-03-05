import React from 'react';
import { observer, inject } from 'mobx-react';

@inject('courseware')
@observer
class TextBoxInfo extends React.Component<any> {
  constructor(props: any) {
    super(props);
  }

  render() {
    const { txtnote, text, onTextChange } = this.props;

    return (
      <div
        style={{
          position: 'relative',
          marginLeft: 18,
          width: '76px',
          float: 'left',
        }}
      >
        <div style={{ float: 'left', zIndex: 1 }}>
          <input
            type="text"
            value={text ? text : ''}
            // id="txtInfo"
            style={{
              width: '76px',
              height: '20px',
              background: 'rgba(255, 255, 255, 1)',
              borderRadius: '2px',
              border: '1px solid rgba(170, 170, 170, 1)',
            }}
            onChange={event => onTextChange(event.target.value)}
          />
        </div>
        <div
          style={{
            zIndex: 2,
            position: 'absolute',
            width: '76px',
            textAlign: 'right',
            pointerEvents: 'none',
          }}
        >
          <label style={{ fontSize: '10px', marginRight: '3px' }}>
            {txtnote}
          </label>
        </div>
      </div>
    );
  }
}

export default TextBoxInfo;
