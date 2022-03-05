import React from 'react';

export class BtnRadioView extends React.Component<any, any> {
  constructor(props) {
    super(props);
  }

  onClickRadio(event: React.MouseEvent<HTMLDivElement, MouseEvent>): void {
    const { onRadioclick, deafultTag } = this.props;
    onRadioclick?.(deafultTag);
  }
  render() {
    const {
      selectedprop,
      deafultprop,
      deafultTag,
      selectedTag,
      content,
    } = this.props;
    var colorfont =
      deafultTag == selectedTag ? selectedprop.color : deafultprop.color;
    var icon: (color: string) => JSX.Element = this.props.icon;
    var bgColor =
      deafultTag == selectedTag ? selectedprop.bgColor : deafultprop.bgColor;

    return (
      <div onClick={event => this.onClickRadio(event)}>
        <div
          style={{
            borderRadius: '10px',
            width: '60px',
            height: '66px',
            background: bgColor,
            display: 'block',
            cursor: 'pointer',
          }}
        >
          <div
            style={{
              display: 'inline-block',
              marginLeft: '21px',
              marginTop: 13,
              userSelect: 'none',
            }}
          >
            {icon(colorfont)}
          </div>
          <div
            style={{
              color: colorfont,
              fontSize: '12px',
              textAlign: 'center',
              userSelect: 'none',
            }}
          >
            {content}
          </div>
        </div>
      </div>
    );
  }
}
