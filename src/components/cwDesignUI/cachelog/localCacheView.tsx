import { PureComponent } from 'react';
import CWSubstance, { SaveLog } from '@/modelClasses/courseDetail/cwSubstance';
import { inject, observer } from 'mobx-react';
import React from 'react';
import { observable, runInAction } from 'mobx';
import { Tabs, Table, Button, Input } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import CWCacheHelper from '@/utils/cwCacheHelper';
import StrCompressHelper from '@/utils/strCompressHelper';
import LayoutHeader from '@/pages/head';

@observer
class DescEditInput extends PureComponent<any> {
  render() {
    var savelog = this.props.savelog;
    return (
      <Input
        value={savelog.desc}
        contentEditable={true}
        onChange={e => {
          savelog.desc = String(e.target.value || '');
          CWCacheHelper.setDesc(
            savelog.cwId,
            savelog.save_time,
            e.target.value,
          );
        }}
      ></Input>
    );
  }
}

function getSavelogRowRenderModel(
  courseware: CWSubstance,
  view: LocalCacheView,
): ColumnsType<SaveLog> {
  return [
    {
      title: '序号',
      key: 'key',
      dataIndex: 'key',
      width: '7%',
      render: key => <div style={{ textAlign: 'center' }}>{key + 1}</div>,
    },
    {
      title: '保存时间',
      key: 'save_time',
      dataIndex: 'save_time',
      width: '24%',
      render: time => <div>{new Date(time).toLocaleString()}</div>,
    },
    {
      title: '描述',
      key: 'desc',
      dataIndex: 'desc',
      width: '50%',
      render: (desc, savelog) => {
        return <DescEditInput savelog={savelog}></DescEditInput>;
      },
    },
    {
      title: '操作',
      dataIndex: 'cwId',
      key: 'cwId',
      width: '18%',
      render: (cwId, savelog) => (
        <div>
          <Button
            size="small"
            onClick={() => {
              CWCacheHelper.getSaveLogDetail(
                savelog.cwId,
                savelog.type,
                new Date(savelog.save_time),
                rs => {
                  if (rs && rs.length > 0) {
                    var r = rs[0];
                    var data = StrCompressHelper.unzip(r.content);
                    courseware?.ReadContentFromData(data);
                    LayoutHeader.IsShowCacheManagementView = false;
                  }
                },
              );
            }}
          >
            导入
          </Button>
          <Button
            style={{ marginLeft: '5px' }}
            size="small"
            onClick={() => {
              CWCacheHelper.delSaveLog(
                savelog.cwId,
                savelog.type,
                new Date(savelog.save_time),
                rs => {
                  view.refreshSaveLogs(savelog.type);
                },
              );
            }}
          >
            删除
          </Button>
        </div>
      ),
    },
  ];
}

@inject('courseware')
@observer
export default class LocalCacheView extends PureComponent<{
  courseware?: CWSubstance;
}> {
  constructor(props) {
    super(props);
  }

  @observable
  activedTabKey = '1';

  @observable
  ManualSaveLogs: SaveLog[];
  @observable
  AutoSaveLogs: SaveLog[];

  componentDidMount() {
    this.refreshSaveLogs(0);
    this.refreshSaveLogs(1);
  }

  refreshSaveLogs(type: number = 0) {
    var courseware = this.props.courseware;
    var view = this;
    // if (type == 0)
    //   view.ManualSaveLogs = [];
    // else if (type == 1)
    //   view.AutoSaveLogs = [];

    CWCacheHelper.getSaveLogs(courseware.Profile.coursewareId, type, rs => {
      var key = 0;
      if (type == 0) {
        view.ManualSaveLogs = rs
          ?.sort(r => -r.save_time)
          .map(r => Object.assign(new SaveLog(), { key: key++ }, r));
      } else if (type == 1)
        view.AutoSaveLogs = rs
          ?.sort(r => -r.save_time)
          .map(r => Object.assign(new SaveLog(), { key: key++ }, r));
    });
  }

  getSaveLogsTable(logs: SaveLog[]) {
    if (logs) {
      return (
        <Table
          bordered={true}
          size={'small'}
          pagination={false}
          scroll={{ y: '380px' }}
          dataSource={logs}
          columns={getSavelogRowRenderModel(this.props.courseware, this)}
        ></Table>
      );
    } else {
      return (
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            display: '-webkit-box',
            WebkitBoxPack: 'center',
            WebkitBoxAlign: 'center',
          }}
        >
          {'没有相应记录'}
        </div>
      );
    }
  }

  render() {
    var courseware = this.props.courseware;
    return (
      <div style={{ display: '-webkit-box', WebkitBoxOrient: 'vertical' }}>
        <div style={{ fontSize: '8px', color: 'red' }}>
          手动保存记录缓存最多20条，自动保存记录缓存最多10条，多余的会自动删除，保存时请注意
        </div>
        <Tabs
          tabBarExtraContent={
            <div>
              {(this.activedTabKey == '1' &&
                this.ManualSaveLogs &&
                this.ManualSaveLogs.length > 0) ||
              (this.activedTabKey == '2' &&
                this.AutoSaveLogs &&
                this.AutoSaveLogs.length > 0) ? (
                <Button
                  style={{ marginRight: '6px' }}
                  size="small"
                  onClick={() => {
                    if (courseware && courseware.Profile) {
                      var cwId = courseware.Profile.coursewareId;
                      var type = Number(this.activedTabKey) - 1;
                      CWCacheHelper.clearSaveLogs(cwId, type, rs => {
                        this.refreshSaveLogs(type);
                      });
                    }
                  }}
                >
                  清除所有记录
                </Button>
              ) : null}
              {/* <Button
                size="small"
                onClick={async () => {
                  if (courseware && courseware.Profile) {
                    await courseware.LoadData(courseware.Profile.coursewareId);
                    LayoutHeader.IsShowCacheManagementView = false;
                  }
                }}
              >
                从草稿库导入
              </Button> */}
            </div>
          }
          onChange={key => (this.activedTabKey = key)}
        >
          <Tabs.TabPane tab={'手动保存'} key="1">
            <div
              style={{
                position: 'relative',
                minHeight: '300px',
              }}
            >
              {this.getSaveLogsTable(this.ManualSaveLogs)}
            </div>
          </Tabs.TabPane>
          <Tabs.TabPane tab={'自动保存'} key="2">
            <div
              style={{
                position: 'relative',
                minHeight: '300px',
              }}
            >
              {this.getSaveLogsTable(this.AutoSaveLogs)}
            </div>
          </Tabs.TabPane>
        </Tabs>
      </div>
    );
  }
}
