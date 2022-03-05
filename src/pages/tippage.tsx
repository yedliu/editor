import 'reflect-metadata';
import React from 'react';
import  '../styles/body.less'

class TipsPage extends React.Component<any, any> {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        document.addEventListener('touchmove', ev => ev.preventDefault(), { passive: false });
    }

    render() {
        return (<div style={{ overflow: "hidden" }}>
            <div style={{ position: 'absolute', left: '40%', right: '40%', top: '40%', bottom: '40%' }}>
                <div style={{ textAlign: 'center', fontSize: '16px' }}>没有权限哟!</div>
                <img
                    src={require('@/assets/timg.jpeg')}
                    style={{
                        position: 'absolute',
                        height: '100%',
                        width: '100%',
                        objectFit: 'fill',
                        userSelect: 'none',
                    }}
                    draggable={false}
                ></img>
            </div>
        </div >)

    }

}

export default TipsPage;