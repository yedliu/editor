import React from 'react';

export default class ItemDragUI extends React.Component<any> {
  render() {
    var dragingItems = this.props.dragingItems;
    return (
      <div style={{ padding: '10px' }}>
        <div
          style={{
            boxShadow: '0px 0px 6px 2px #2F2F2F5F',
            borderRadius: '5px',
            background: 'white',
            padding: '8px',
          }}
        >
          <div>拖动{dragingItems.length}个元素</div>
        </div>
      </div>
    );
  }
}
