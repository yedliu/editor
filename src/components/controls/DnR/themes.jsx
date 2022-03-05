import React from 'react';
import { defaultTheme } from './DnR';

export class Button extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hover: false,
      down: false,
    };
  }
  render() {
    const {
      style,
      hoverStyle,
      downStyle,
      children,
      cursor,
      ...other
    } = this.props;

    const dragging = /resize$/.test(cursor);

    const buttonStyle = {
      ...style,
      ...(this.state.hover && !dragging ? hoverStyle : {}),
      ...(this.state.down && !dragging ? downStyle : {}),
      cursor,
    };

    return (
      <div
        onMouseEnter={() => this.setState({ hover: true })}
        onMouseLeave={() => this.setState({ hover: false, down: false })}
        onMouseDown={() => this.setState({ down: true })}
        onMouseUp={() => this.setState({ down: false })}
        style={buttonStyle}
        {...other}
      >
        {children}
      </div>
    );
  }
}

export const TitleBar = ({
  style,
  children,
  buttons,
  button1,
  button2,
  button3,
  button1Children,
  button2Children,
  button3Children,
  dnrState,
}) => (
  <div style={style}>
    <div {...buttons}>
      {button1Children ? (
        <Button {...button1} cursor="pointer">
          {button1Children}
        </Button>
      ) : null}
      {button2Children ? (
        <Button {...button2} cursor="pointer">
          {button2Children}
        </Button>
      ) : null}
      {button3Children ? (
        <Button {...button3} cursor="pointer">
          {button3Children}
        </Button>
      ) : null}
    </div>
    {children}
  </div>
);

export let OSXTheme = ({ title, onClose, onMinimize, onMaximize }) => {
  const titleHeight = 25;
  const buttonRadius = 6;
  const fontSize = 14;
  const fontFamily = 'Helvetica, sans-serif';

  const style = {
    height: titleHeight,
  };

  const buttonStyle = {
    padding: 0,
    margin: 0,
    marginRight: '4px',
    width: buttonRadius * 2,
    height: buttonRadius * 2,
    borderRadius: buttonRadius,
    content: '',
    border: '1px solid rgba(0, 0, 0, 0.2)',
    outline: 'none',
  };
  const buttons = {
    style: {
      height: titleHeight,
      position: 'absolute',
      float: 'left',
      margin: '0 8px',
      display: 'flex',
      alignItems: 'center',
    },
  };

  const closeButton = {
    style: {
      ...buttonStyle,
      backgroundColor: 'rgb(255, 97, 89)',
    },
    hoverStyle: {
      backgroundColor: 'rgb(230, 72, 64)',
    },
    downStyle: {
      backgroundColor: 'rgb(204, 46, 38)',
    },
    onClick: onClose,
  };
  const minimizeButton = {
    style: {
      ...buttonStyle,
      backgroundColor: 'rgb(255, 191, 47)',
    },
    hoverStyle: {
      backgroundColor: 'rgb(230, 166, 22)',
    },
    downStyle: {
      backgroundColor: 'rgb(204, 140, 0)',
    },
    onClick: onMinimize,
  };
  const maximizeButton = {
    style: {
      ...buttonStyle,
      backgroundColor: 'rgb(37, 204, 62)',
    },
    hoverStyle: {
      backgroundColor: 'rgb(12, 179, 37)',
    },
    downStyle: {
      backgroundColor: 'rgb(0, 153, 11)',
    },
    onClick: onMaximize,
  };
  return {
    theme: {
      title: {
        ...defaultTheme.title,
        fontFamily: fontFamily,
        borderTopLeftRadius: '5px',
        borderTopRightRadius: '5px',
        background: 'linear-gradient(0deg, #d8d8d8, #ececec)',
        color: 'rgba(0, 0, 0, 0.7)',
        fontSize: fontSize,
        height: titleHeight,
      },
      frame: {
        ...defaultTheme.frame,
        borderRadius: '5px',
      },
      transition: 'all 0.25s ease-in-out',
    },
    titleBar: (
      <TitleBar
        style={style}
        buttons={buttons}
        button1={closeButton}
        button2={minimizeButton}
        button3={maximizeButton}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {title}
        </div>
      </TitleBar>
    ),
  };
};

export let WindowsTheme = ({
  title,
  onClose,
  onMinimize,
  onMaximize,
  titleBarColor = '#0095ff',
}) => {
  const titleHeight = 25;
  const buttonRadius = 6;
  const fontSize = 14;
  const fontFamily = 'Helvetica, sans-serif';

  const style = {
    height: titleHeight,
  };

  const buttonStyle = {
    padding: 0,
    margin: 0,
    width: 25,
    height: 25,
    outline: 'none',
    border: 'none',
    textAlign: 'center',
  };

  const buttons = {
    style: {
      height: titleHeight,
      position: 'absolute',
      right: 0,
      margin: 0,
      display: 'flex',
      alignItems: 'center',
      verticalAlign: 'baseline',
    },
  };

  const closeButton = {
    style: {
      ...buttonStyle,
      fontSize: '20px',
      fontWeight: 500,
      lineHeight: '36px',
      backgroundColor: titleBarColor,
    },
    hoverStyle: {
      backgroundColor: '#ec6060',
    },
    downStyle: {
      backgroundColor: '#bc4040',
    },
    onClick: onClose,
  };

  const minimizeButton = {
    style: {
      ...buttonStyle,
      lineHeight: '22px',
      backgroundColor: titleBarColor,
    },
    hoverStyle: {
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
    },
    downStyle: {
      backgroundColor: 'rgba(0, 0, 0, 0.2)',
    },
    onClick: onMinimize,
  };

  const maximizeButton = {
    style: {
      ...buttonStyle,
      lineHeight: '12px',
      backgroundColor: titleBarColor,
    },
    hoverStyle: {
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
    },
    downStyle: {
      backgroundColor: 'rgba(0, 0, 0, 0.2)',
    },
    onClick: onMaximize,
  };
  return {
    theme: {
      title: {
        ...defaultTheme.title,
        fontFamily: fontFamily,
        background: titleBarColor,
        color: 'rgba(0, 0, 0, 0.7)',
        fontSize: fontSize,
        height: titleHeight,
      },
      frame: {
        ...defaultTheme.frame,
      },
      transition: 'all 0.25s ease-in-out',
    },
    titleBar: (
      <TitleBar
        style={style}
        buttons={buttons}
        button1={minimizeButton}
        button2={maximizeButton}
        button3={closeButton}
        button1Children="‒"
        button2Children="□"
        button3Children="˟"
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {title}
        </div>
      </TitleBar>
    ),
  };
};

export let CustomTheme = ({
  title,
  windowState,
  onClose,
  onMinimize,
  onMaximize,
  titleBarColor = '#C1C1C19F',
}) => {
  const titleHeight = 30;
  const buttonRadius = 6;
  const fontSize = 14;
  const fontFamily = 'Helvetica, sans-serif';

  const style = {
    height: titleHeight,
    position: 'relative',
    borderTopLeftRadius: buttonRadius,
    borderTopRightRadius: buttonRadius,
    display: '-webkit-box',
    WebkitBoxPack: 'center',
    WebkitBoxAlign: 'center',
  };

  const buttonStyle = {
    width: 25,
    height: 25,
    display: '-webkit-box',
    WebkitBoxAlign: 'center',
    WebkitBoxPack: 'center',
  };

  const buttons = {
    style: {
      height: titleHeight,
      position: 'absolute',
      right: 0,
      margin: 0,
      display: '-webkit-box',
      WebkitBoxAlign: 'center',
    },
  };

  const closeButton = {
    style: {
      ...buttonStyle,
      fontSize: '20px',
      backgroundColor: 'transparent',
    },
    hoverStyle: {
      color: '#999999',
    },
    downStyle: {
      color: '#333333',
    },
    onClick: onClose,
  };

  const minimizeButton = {
    style: {
      ...buttonStyle,
      lineHeight: '22px',
      backgroundColor: titleBarColor,
    },
    hoverStyle: {
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
    },
    downStyle: {
      backgroundColor: 'rgba(0, 0, 0, 0.2)',
    },
    onClick: onMinimize,
  };

  const maximizeButton = {
    style: {
      ...buttonStyle,
      fontSize: '20px',
      backgroundColor: 'transparent',
    },
    hoverStyle: {
      color: '#999999',
    },
    downStyle: {
      color: '#333333',
    },
    onClick: onMaximize,
  };

  var closeBtn = (
    <svg width="20" height="20">
      <path stroke="#666666" d="M4,4 L16,16 M16,4 L4,16" strokeWidth="1" />
    </svg>
  );

  var maximizeBtn = (
    <svg width="20" height="20">
      <path
        stroke="#666666"
        d="M5,7 L15,7 L15,13 L5,13z"
        strokeWidth="1"
        fill="transparent"
      />
    </svg>
  );

  var restoreBtn = (
    <svg width="20" height="20">
      <path
        stroke="#666666"
        d="M6,6 L18,6 L18,13 L6,13 L6,6 M2,9 L14,9 L14,16 L2,16 L2,9"
        strokeWidth="1"
        fill="transparent"
      />
    </svg>
  );

  return {
    theme: {
      title: {
        ...defaultTheme.title,
        fontFamily: fontFamily,
        background: titleBarColor,
        color: 'rgba(0, 0, 0, 0.7)',
        fontSize: fontSize,
        height: titleHeight,
      },
      frame: {
        ...defaultTheme.frame,
      },
      transition: 'all 0.25s ease-in-out',
    },
    titleBar: (
      <TitleBar
        style={style}
        buttons={buttons}
        // button1={minimizeButton}
        button2={maximizeButton}
        button3={closeButton}
        // button1Children='‒'
        button2Children={maximizeBtn}
        button3Children={closeBtn}
      >
        <div
          style={{
            width: '75%',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            textAlign: 'center',
          }}
          onDoubleClick={() => onMaximize()}
        >
          {title}
        </div>
      </TitleBar>
    ),
  };
};
