import React from 'react';
import { observer } from 'mobx-react';
import ILogicDesignItem from '@/modelClasses/courseDetail/InvokeDesign/logicViewModels/ILogicDesignItem';
import {
  OutputDataPoint,
  InputDataPoint,
} from '@/modelClasses/courseDetail/DataPoint';
import { DataPointIcon } from '@/svgs/designIcons';
import LoopWork from '@/modelClasses/courseDetail/toolbox/LoopWork';
import { FuncDataInput } from '@/modelClasses/courseDetail/InvokeDesign/logicViewModels/Invokables/InvFunc/FuncInvokeProxy';
import { observable, runInAction } from 'mobx';
import { Input } from 'antd';

@observer
export class InputDataPointView extends React.Component<any> {
  private dataPointElement: HTMLElement;

  public componentDidMount() {
    LoopWork.Instance.setMission(this, this.updateDpPosition.bind(this));
  }

  componentDidUpdate(nextProps) {
    if (nextProps.IsClick != this.props.IsClick) {
      this.updateDpPosition();
    }
  }

  public componentWillUnmount() {
    LoopWork.Instance.removeMission(this);
  }

  updateDpPosition() {
    const { dataPoint: dp } = this.props;
    var dataPoint = dp as OutputDataPoint;
    runInAction(() => {
      if (this.dataPointElement != null)
        dp.RefreshDpPosition(this.dataPointElement);
    });
  }

  render() {
    const { dataPoint: dp } = this.props;
    var dataPoint: InputDataPoint = dp;
    return (
      <div
        style={{
          position: 'relative',
          marginTop: '1px',
          marginBottom: '1px',
          marginRight: '3px',
          display: '-webkit-box',
          WebkitBoxOrient: 'horizontal',
          WebkitBoxPack: 'start',
          WebkitBoxAlign: 'center',
        }}
      >
        <div
          className="draggableDataPoint"
          style={{
            position: 'relative',

            display: '-webkit-box',
            WebkitBoxOrient: 'horizontal',
            WebkitBoxPack: 'start',
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
          {DataPointIcon('transparent')}
          <div
            style={{
              marginRight: '4px',
              marginLeft: '3px',
              maxWidth: '120px',
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
            }}
          >
            {dataPoint.Owner instanceof FuncDataInput
              ? dataPoint.Owner.Note
              : dataPoint.DisplayName}
          </div>
        </div>
        {!dataPoint.HasLinked &&
        !dataPoint.IsLinking &&
        !dataPoint.DisableCustom ? (
          <Input
            size="small"
            style={{ height: '16px', width: '60px', maxWidth: '80px' }}
            value={dataPoint.CustomValue || ''}
            onChange={e => (dataPoint.CustomValue = e.target.value)}
          ></Input>
        ) : null}
      </div>
    );
  }
}

@observer
export class MultiInputDataPointView extends React.Component<any> {
  render() {
    return <div></div>;
  }
}

@observer
export class InputDataPointListView extends React.Component<any> {
  render() {
    const { item: _item, IsClick } = this.props;
    var item = _item;
    return (
      <div
        style={{
          minWidth: '40px',
          position: 'relative',
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitBoxOrient: 'vertical',
          WebkitBoxPack: 'start',
        }}
      >
        {item?.InputDataPoints?.map(
          (inDataPoint: InputDataPoint, i: number) => {
            if (!inDataPoint.IsMulti)
              return (
                <InputDataPointView
                  IsClick={IsClick}
                  key={i}
                  item={item}
                  dataPoint={inDataPoint}
                />
              );
            else
              return (
                <MultiInputDataPointView key={i} dataPoint={inDataPoint} />
              );
          },
        )}
      </div>
    );
  }
}
