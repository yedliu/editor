import React from 'react';
import reactCSS from 'reactcss';
import { SketchPicker, CompactPicker } from 'react-color';
import { Dropdown } from 'antd';
import 'element-theme-default';

class SketchColor extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    const { selectedcolor } = this.props;
    this.state = {
      displayColorPicker: false,
    };
  }

  handleClick = () => {
    this.setState({ displayColorPicker: !this.state.displayColorPicker });
  };

  handleClose = () => {
    this.setState({ displayColorPicker: false });
  };

  handleChange = color => {
    const { selectedcolorchanged } = this.props;
    let alphaHex = (color.rgb.a * 255).toString(16);
    let hex =
      '#' +
      alphaHex +
      color.rgb.r.toString(16) +
      color.rgb.g.toString(16) +
      color.rgb.b.toString(16);
    selectedcolorchanged?.(hex);
  };

  render() {
    const { selectedcolor } = this.props;
    let bindColor;
    if (selectedcolor) {
      if (selectedcolor.length == 9) {
        bindColor = {
          r: parseInt(selectedcolor.substr(3, 2), 16),
          g: parseInt(selectedcolor.substr(5, 2), 16),
          b: parseInt(selectedcolor.substr(7, 2), 16),
          a: (1 / 255) * parseInt(selectedcolor.substr(1, 2), 16),
        };
      } else {
        bindColor = {
          r: parseInt(selectedcolor.substr(1, 2), 16),
          g: parseInt(selectedcolor.substr(3, 2), 16),
          b: parseInt(selectedcolor.substr(5, 2), 16),
          a: 1,
        };
      }
    } else {
      bindColor = {
        r: 0,
        g: 0,
        b: 0,
        a: 1,
      };
    }

    const styles = reactCSS({
      default: {
        color: {
          width: '27px',
          height: '13px',
          borderRadius: '2px',
          background: `rgba(${bindColor.r}, ${bindColor.g}, ${bindColor.b}, ${bindColor.a})`,
        },
        swatch: {
          padding: '3px',
          background: '#fff',
          borderRadius: '1px',
          boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
          display: 'inline-block',
          cursor: 'pointer',
        },
        popover: {
          position: 'absolute',
          zIndex: '2',
          marginleft: '-100px',
        },
        cover: {
          position: 'fixed',
          top: '0px',
          right: '0px',
          bottom: '0px',
          left: '0px',
        },
      },
    });
    return (
      <div
        style={{
          whiteSpace: 'nowrap',
          ...this.props.style,
        }}
      >
        <Dropdown
          placement="topCenter"
          overlay={
            <SketchPicker color={bindColor} onChange={this.handleChange} />
          }
          trigger={['click']}
        >
          <div style={styles.swatch}>
            <div style={styles.color} />
          </div>
        </Dropdown>
      </div>
      // <div>
      //     <div style={styles.swatch} onClick={this.handleClick}>
      //         <div style={styles.color} />
      //     </div>
      //     {this.state.displayColorPicker ? <div style={styles.popover}>
      //         <div style={styles.cover} onClick={this.handleClose} />
      //         <SketchPicker color={bindColor} onChange={this.handleChange} />
      //     </div> : null}
      // </div>
    );
  }
}

export default SketchColor;
