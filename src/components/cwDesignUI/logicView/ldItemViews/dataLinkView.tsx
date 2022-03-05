import { PureComponent } from 'react';
import React from 'react';
import { observer } from 'mobx-react';
import { noCalcChildrenSize } from '@/utils/Math2D';

@observer
export default class DataLinkLineView extends PureComponent<any> {
  render() {
    const { link } = this.props;
    var gRect = link.GetGeometryRect();
    var gRectHeight = Math.max(1, gRect.height);
    var viewBox = `0,0,${gRect.width},${gRectHeight}`;
    return (
      <div
        className={`dataLinkLine ${noCalcChildrenSize}`}
        style={{
          position: 'absolute',
          // left: `${gRect.x}px`,
          // top: `${gRect.y}px`,
          transform: `translate3d(${gRect.x}px, ${gRect.y}px, 0)`,
          width: `${gRect.width}px`,
          height: `${gRectHeight}px`,
          pointerEvents: 'none',
        }}
      >
        <svg
          style={{
            position: 'absolute',
            left: '0px',
            top: '0px',
            cursor: 'pointer',
            pointerEvents: 'none',
          }}
          width={gRect.width}
          height={gRectHeight}
          viewBox={viewBox}
          preserveAspectRatio="xMinYMin meet"
        >
          <defs pointerEvents="none">
            <filter id="df1" x="-5%" y="-10%" width="110%" height="120%">
              <feOffset result="offOut" in="SourceGraphic" dx="0" dy="0" />
              <feGaussianBlur result="blurOut" in="offOut" stdDeviation="1.5" />
              <feBlend in="SourceGraphic" in2="blurOut" mode="normal" />
            </filter>
          </defs>
          <path
            stroke="transparent"
            d={link.PathData}
            strokeWidth={
              link?.VisualLogicDesign ? 12 / link.VisualLogicDesign.Scale : 12
            }
            fill="transparent"
            pointerEvents={link.IsLinking ? 'none' : 'stroke'}
            onMouseEnter={e => {
              var target = e.target as SVGPathElement;
              var realline = target.parentElement.children[2];
              if (realline) realline.setAttribute('filter', 'url(#df1)');
            }}
            onMouseLeave={e => {
              var target = e.target as SVGPathElement;
              var realline = target.parentElement.children[2];
              if (realline) realline.setAttribute('filter', '');
            }}
            onDoubleClick={e => link.DeleteLink()}
          />
          <path
            stroke={'#1D91FC'}
            d={link.PathData}
            strokeWidth="1"
            fill="transparent"
            pointerEvents="none"
          />
        </svg>
      </div>
    );
  }
}
