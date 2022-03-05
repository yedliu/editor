import { observable } from 'mobx';
import React from 'react';
import { Drawer, Button, Radio, Table } from 'antd';
import { inject, observer } from 'mobx-react';
import { classToPlain } from '@/class-transformer';
import CWResource from '@/modelClasses/courseDetail/cwResource';
import CacheHelper from '@/utils/cacheHelper';
import { CWResourceTypes } from '@/modelClasses/courseDetail/courseDetailenum';
import { reaction } from 'mobx';
import copy from 'copy-to-clipboard';
import ReactEcharts from 'echarts-for-react';
import Tabs from 'antd/lib/tabs';
import InvokableBase from '@/modelClasses/courseDetail/InvokableBase';
import antStyle from '@/styles/defaultAnt.less';
import CwError, { ErrorEntity } from '@/modelClasses/courseDetail/cwError';
import CWSubstance from '@/modelClasses/courseDetail/cwSubstance';

@observer
export class ErrorView extends React.Component<any, any> {
  constructor(props) {
    super(props);
  }

  onClose = () => {
    this.props.showChanged?.(false);
  };

  render() {
    var courseware = this.props.courseware as CWSubstance;
    var errorList = courseware.errorList;

    const columns = [
      {
        title: '序号',
        dataIndex: 'errorIndex',
        width: '5%',
        height: '5px',
        render: (text, record: ErrorEntity) => (
          <div
            style={{
              width: '50px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {record.errorIndex}
          </div>
        ),
      },
      {
        title: '页面名称',
        dataIndex: 'pageIndex',
        width: '15%',
        height: '5px',
        render: (text, record: ErrorEntity) => (
          <div
            style={{
              width: '300px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            第{record.pageIndex}页： {record.pageName}
          </div>
        ),
      },
      {
        title: '元素名称',
        dataIndex: 'elementsName',
        width: '20%',
        height: '5px',
        render: (text, record: ErrorEntity) => (
          <div
            style={{
              width: '350px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {record.elementsName}
          </div>
        ),
      },
      {
        title: '目标名称',
        dataIndex: 'logicObjName',
        width: '20%',
        height: '5px',
        render: (text, record: ErrorEntity) => (
          <div
            style={{
              width: '350px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {record.logicObjName}
          </div>
        ),
      },
      {
        title: '说明',
        dataIndex: 'errMsg',
        width: '40%',
        height: '5px',
        render: (text, record: ErrorEntity) => (
          <div
            style={{
              width: '700px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {record.errMsg}
          </div>
        ),
      },
    ];

    return (
      <Drawer
        title={'错误列表（' + errorList.length + '）'}
        placement={'bottom'}
        closable={true}
        onClose={this.onClose}
        visible={this.props.visible}
        key={'bottom'}
        height={'400px'}
      >
        <Table
          style={{ marginTop: '-20px' }}
          rowKey={record => record.errorIndex}
          columns={columns}
          dataSource={errorList}
          pagination={false}
        />
      </Drawer>
    );
  }
}
