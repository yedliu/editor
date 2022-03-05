import { Radio, Tooltip } from 'antd';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import { PureComponent } from 'react';
import FormworkListViewModel from '../models/formworklistViewModel';

@observer
export class SingleSelectionAnsView extends PureComponent<any> {
  render() {
    var data: FormworkListViewModel = this.props.data;
    var quData = data?.QuData;
    return (
      <div style={{ userSelect: 'none', margin: '5px', pointerEvents: 'none' }}>
        <Radio.Group value={Number(quData?.answerSerialNumberList[0] || 0)}>
          {quData?.optionList?.map((v, i) => (
            <Radio value={i} key={i}>
              {i + 1}
            </Radio>
          ))}
        </Radio.Group>
      </div>
    );
  }
}
