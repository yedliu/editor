import React from 'react';
import { observer } from 'mobx-react';
import ILogicDesignItem from '@/modelClasses/courseDetail/InvokeDesign/logicViewModels/ILogicDesignItem';
import { OutputDataPoint } from '@/modelClasses/courseDetail/DataPoint';
import { DataPointIcon } from '@/svgs/designIcons';
import LoopWork from '@/modelClasses/courseDetail/toolbox/LoopWork';
import { FuncDataOutput } from '@/modelClasses/courseDetail/InvokeDesign/logicViewModels/Invokables/InvFunc/FuncInvokeProxy';
import { runInAction } from 'mobx';

@observer
export class OutputDataPointView extends React.PureComponent<any> {
  private dataPointElement: HTMLElement;

  public componentDidMount() {
    LoopWork.Instance.setMission(this, this.updateDpPosition.bind(this));
  }

  public componentWillUnmount() {
    LoopWork.Instance.removeMission(this);
  }

  updateDpPosition() {
    const { dataPoint: dp } = this.props;
    runInAction(() => {
      if (this.dataPointElement != null)
        dp.RefreshDpPosition(this.dataPointElement);
    });
  }

  render() {
    const { dataPoint: dp } = this.props;
    var dataPoint: OutputDataPoint = dp;
    return (
      <div
        style={{
          position: 'relative',
          marginTop: '1px',
          marginBottom: '1px',
          marginRight: '3px',
          display: '-webkit-box',
          WebkitBoxOrient: 'horizontal',
          WebkitBoxPack: 'end',
          WebkitBoxAlign: 'center',
          cursor: 'pointer',
          whiteSpace: 'nowrap',
        }}
        ref={v => (this.dataPointElement = v)}
        draggable="true"
        onDragStart={e => dataPoint.startPointDrag(e)}
        onDrag={e => dataPoint.onPointDrag(e)}
        onDragEnd={e => dataPoint.onPointDragEnd(e)}
        onDragOver={e => dataPoint.onPointDragOver(e)}
        onDrop={e => dataPoint.onPointDrop(e)}
      >
        <div
          style={{
            marginRight: '5px',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
          }}
        >
          {dataPoint.Owner instanceof FuncDataOutput
            ? dataPoint.Owner.Note
            : dataPoint.DisplayName}
        </div>
        {DataPointIcon('transparent')}
      </div>
    );
  }
}

@observer
export class OutputDataPointListView extends React.Component<any> {
  render() {
    const { Item } = this.props;
    var item = Item;

    return (
      <div
        style={{
          position: 'relative',
          display: '-webkit-box',
          WebkitBoxOrient: 'vertical',
          WebkitBoxPack: 'end',
        }}
      >
        {item?.OutputDataPoints?.map((outDataPoint: OutputDataPoint, i) => {
          return <OutputDataPointView key={i} dataPoint={outDataPoint} />;
        })}
      </div>
    );
  }
}
