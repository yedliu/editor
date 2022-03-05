import React from 'react';
import style from '@/styles/property.less';

class ToggleButton extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    const {
      isSelected = false,
      icon,
      selectedIcon,
      height,
      width,
      background,
      selectedChanged,
      marginLeft,
    } = this.props;

    this.state = {
      isToggleOn: isSelected ? isSelected : false,
      iconheight: height ? height : 20,
      iconwidth: width ? width : 20,
      background: background ? background : 'transparent',
      marginLeft: marginLeft ? marginLeft : 0,
    };
    this.IsSelectedChanged = this.IsSelectedChanged.bind(this);
  }

  IsSelectedChanged(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    const { isSelected, selectedChanged } = this.props;
    let localstate = !this.state.isToggleOn;
    this.setState({
      isToggleOn: localstate,
    });
    selectedChanged?.(localstate);
  }

  render() {
    const { isSelected, isSelectedChanged } = this.props;
    if (isSelected == undefined ? this.state.isToggleOn : isSelected) {
      return (
        <div
          onClick={this.IsSelectedChanged}
          style={{
            textAlign: 'center',
            cursor: 'pointer',
            marginLeft: `${this.state.marginLeft}px`,
            background: `${this.state.background}`,
            borderRadius: '2px',
            border: `1px solid ${this.state.background}`,
            height: `${this.state.iconheight}px`,
            lineHeight: `${this.state.iconheight}px`,
            width: `${this.state.iconwidth}px`,
          }}
        >
          {this.props.selectedIcon}
        </div>
      );
    } else {
      return (
        <div
          onClick={this.IsSelectedChanged}
          style={{
            textAlign: 'center',
            cursor: 'pointer',
            marginLeft: `${this.state.marginLeft}px`,
            background: 'transparent',
            border: '1px solid #CCCCCC',
            borderRadius: '2px',
            height: `${this.state.iconheight}px`,
            lineHeight: `${this.state.iconheight}px`,
            width: `${this.state.iconwidth}px`,
          }}
        >
          {this.props.icon}
        </div>
      );
    }
  }
}

export default ToggleButton;
