import React, { useState } from 'react';
import ReactDOM, { render } from 'react-dom';
import {
  Table,
  Input,
  Form,
  Popconfirm,
  InputNumber,
  Button,
  Badge,
  Space,
  Dropdown,
  Modal,
  message,
  AutoComplete,
} from 'antd';
import { action, observable, runInAction } from 'mobx';
import HttpService from '@/server/httpServer';
import { observer } from 'mobx-react';
import Search from 'antd/lib/input/Search';
import { array } from 'prop-types';
import { SDK_NAME } from '@sentry/browser';
import TextArea from 'antd/lib/input/TextArea';
import copy from 'copy-to-clipboard';

@observer
class CategoryConfig extends React.Component<any, any> {
  constructor(props) {
    super(props);
  }

  state = {
    modalVisible: false,
  };

  //#region 属性
  @observable
  total: number = 0;

  @observable
  form: any;

  @observable
  categoryConfigData: any;

  @observable
  categoryConfigDataGroup: Array<Model>;
  @observable
  autoText: any;

  @observable
  editingKey: string = '';

  //表格列表高度滚动条
  @observable
  scrollY: number = 0;
  scrollHeight: number = 140;

  @observable
  category: string = '';
  @observable
  configKey: string = '';
  @observable
  configValue: string = '';
  @observable
  sort: number = 0;

  @observable
  importJSON: string = '';

  @observable
  isEdit: boolean = false;
  //#endregion

  //#region 方法

  emptyVal() {
    this.category = null;
    this.configKey = null;
    this.configValue = null;
    this.sort = 0;
  }

  edit(record) {}

  delete(record) {}

  addEdit() {
    if (
      this.category == null ||
      this.category.trim() == '' ||
      this.configKey == null ||
      this.configKey.trim() == '' ||
      this.configValue == null ||
      this.configValue.trim() == ''
    ) {
      console.log('1:' + this.category);
      console.log('2:' + this.configKey);
      console.log('3:' + this.configValue);

      message.info('不能填空值');
      return;
    }

    if (this.isEdit)
      this.categoryConfig_edit(
        this.category,
        this.configKey,
        this.configValue,
        this.sort,
      );
    else
      this.categoryConfig_add(
        this.category,
        this.configKey,
        this.configValue,
        this.sort,
      );
  }

  editData(category, configKey, configValue, sort) {
    this.category = category;
    this.configKey = configKey;
    this.configValue = configValue;
    this.sort = sort;
    this.isEdit = true;
    this.setModalVisible(true);
  }

  setModalVisible(modalVisible) {
    this.setState({ modalVisible });
  }

  updateDta(category: string = null) {
    if (category == null) {
      var d = this.categoryConfigDataGroup;
      this.categoryConfigDataGroup = null;
      this.categoryConfigDataGroup = d; //暂时没找到更好的刷新方式--
    } else {
      console.log('刷新啊---------------------------------');
      this.categoryConfig_pageQuery(category);
    }
  }

  //#endregion

  //#region 请求

  //    @action categoryConfig_pageQuery = async (
  //     category = null,//所属分类
  //     configKey = null,//配置的key
  //     configValue = null,//配置的value
  //     field = null,//排序字段
  //     pageNo = 1,//分页查询页数 若不传默认是1   必须
  //     pageSize = 13,//分页查询步长 size 若不传默认是10   必须
  //     sort = null//排序方式 倒序: DESC 升序：ASC
  //    ) => {
  //     var data = await HttpService.categoryConfig_pageQuery(
  //         category,
  //         configKey,
  //         configValue,
  //         field,
  //         pageNo,
  //         pageSize,
  //         sort
  //     );
  //         runInAction(() => {
  //         if (data) {
  //             this.categoryConfigData = data?.list;
  //             this.total = data?.total;

  //             this.categoryConfigDataGroup = new Array<Model>();
  //             this.categoryConfigData.forEach(element => {
  //                 if(this.categoryConfigDataGroup?.filter(x=>x.category == element.category).length <= 0){
  //                     var m=new Model(this);
  //                     m.id = element.id;
  //                     m.category = element.category;
  //                     m.configKey = element.configKey;
  //                     m.configValue = element.configValue;
  //                     this.categoryConfigDataGroup.push(m);
  //                 }
  //             });
  //             //console.log(this.categoryConfigData);
  //             //console.log(this.categoryConfigDataGroup);
  //         }
  //         });
  //     };

  @action categoryConfig_pageQuery = async (
    category = null, //所属分类
    configKey = null, //配置的key
    configValue = null, //配置的value
    field = null, //排序字段
    pageNo = 1, //分页查询页数 若不传默认是1   必须
    pageSize = 999, //分页查询步长 size 若不传默认是10   必须
    sort = null, //排序方式 倒序: DESC 升序：ASC
    isCopy: boolean = false,
  ) => {
    if (isCopy) message.info('获取分类数据');
    var data = await HttpService.categoryConfig_pageQuery(
      category,
      configKey,
      configValue,
      field,
      pageNo,
      pageSize,
      sort,
    );
    runInAction(() => {
      if (data) {
        if (isCopy) {
          //var valList = data?.list.sele;

          var d = new Array<importModel>();
          data?.list.map(x => {
            console.log(x);

            var newd = new importModel();
            newd.category = x.category;
            newd.configKey = x.configKey;
            newd.configValue = x.configValue;
            newd.orderBit = x.orderBit;
            d.push(newd);
          });

          var text = {
            category: category,
            configs: [...d],
          };

          copy(JSON.stringify(text));
          console.log(JSON.stringify(text));
          message.success('已复制到剪切板');
        } else {
          this.categoryConfigDataGroup?.forEach(element => {
            if (element.category == category) {
              element.childData = data?.list;
              this.updateDta();
            } else {
              //this.updateDta(category);
            }
          });
        }
      }
    });
  };

  @action categoryConfig_loadCategory = async (pageNo = 1, pageSize = 13) => {
    var data = await HttpService.categoryConfig_loadCategory(pageNo, pageSize);
    runInAction(() => {
      if (data) {
        this.total = data?.total;
        console.log('this.total---------------------总数');
        console.log(this.total);

        this.autoText = new Array<any>();

        this.categoryConfigDataGroup = new Array<Model>();
        data?.list.forEach((element, i) => {
          var model = new Model();
          model.id = i;
          model.category = element;
          this.categoryConfigDataGroup.push(model);
          this.autoText.push({ value: element });
        });
      }
    });
  };

  @action categoryConfig_add = async (
    category = null, //所属分类
    configKey = null, //配置的key
    configValue = null, //配置的value
    sort,
  ) => {
    var data = await HttpService.categoryConfig_add(
      category,
      configKey,
      configValue,
      sort,
    );
    runInAction(async () => {
      if (data) {
        this.emptyVal();
        message.success('添加成功,可以继续添加');

        if (
          this.categoryConfigDataGroup.filter(x => x.category == category)
            .length > 0
        ) {
          this.updateDta(category);
        } else {
          var v = await this.categoryConfig_loadCategory();
          this.categoryConfig_pageQuery(category);
        }

        //this.setModalVisible(false);
      } else {
        message.error('添加失败');
      }
    });
  };

  @action categoryConfig_edit = async (
    category = null, //所属分类
    configKey = null, //配置的key
    configValue = null, //配置的value
    sort,
  ) => {
    var data = await HttpService.categoryConfig_edit(
      category,
      configKey,
      configValue,
      sort,
    );
    runInAction(() => {
      if (data) {
        this.emptyVal();
        message.success('编辑成功');
        this.updateDta(category);
        this.setModalVisible(false);
      } else {
        message.error('编辑失败');
      }
    });
  };

  @action categoryConfig_delete = async (id, category) => {
    var data = await HttpService.categoryConfig_delete(id);
    runInAction(() => {
      if (data) {
        message.success('删除成功');
        this.updateDta(category);
      } else {
        message.error('删除失败');
      }
    });
  };

  @action categoryConfig_replaceAll = async json => {
    var data = await HttpService.categoryConfig_replaceAll(json);
    runInAction(() => {
      if (data) {
        message.success('导入成功');
        this.categoryConfig_loadCategory();
      } else {
        //message.error('导入失败');
      }
    });
  };

  //#endregion

  componentDidMount() {
    this.init();
    window.addEventListener('resize', this.handleScorllY);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleScorllY);
  }

  handleScorllY = () => {
    this.scrollY = window.innerHeight - this.scrollHeight;
  };

  init() {
    this.categoryConfig_loadCategory();
  }

  render() {
    const columns = [
      {
        title: '所属分类',
        dataIndex: 'category',
        width: '90%',
        editable: true,
        // ...()=>{
        //   render:()=>{
        //     return(<Button>123</Button>);
        //   }
        // }
        // ,
        render: (_, record) => {
          return (
            <div>
              <label
                style={{ float: 'left', width: '150px', marginTop: '5px' }}
              >
                {record.category}
              </label>
              <Button
                style={{ float: 'left' }}
                onClick={event => {
                  this.isEdit = false;
                  this.emptyVal();
                  this.category = record.category;
                  this.setState({ modalVisible: true });
                }}
              >
                添加
              </Button>
              <Button
                style={{ float: 'left', marginLeft: '10px' }}
                onClick={event => {
                  this.categoryConfig_pageQuery(
                    record.category,
                    null,
                    null,
                    null,
                    0,
                    9999,
                    null,
                    true,
                  );
                }}
              >
                复制数据
              </Button>

              {/* <Button
                style={{ float: 'left' , marginLeft:'10px'}}
                onClick={event => {
                 
                }}
              >
                导入
              </Button> */}
            </div>
          );
        },
      },
    ];

    const expandedRowRender = (record: Model) => {
      const _columns = [
        {
          title: '所属分类',
          dataIndex: 'category',
          width: '20%',
          editable: true,
        },
        {
          title: '配置的Key',
          dataIndex: 'configKey',
          width: '15%',
          editable: true,
        },
        {
          title: '配置的Value',
          dataIndex: 'configValue',
          width: '20%',
          editable: true,
        },
        {
          title: '操作人',
          dataIndex: 'operationUserName',
          width: '20%',
          editable: true,
        },
        {
          title: '排序位',
          dataIndex: 'orderBit',
          width: '5%',
          editable: true,
        },
        {
          title: '操作',
          dataIndex: 'operation',
          render: (_, record) => {
            return (
              <div>
                <Button
                  style={{ float: 'left' }}
                  onClick={event => {
                    this.editData(
                      record.category,
                      record.configKey,
                      record.configValue,
                      record.orderBit,
                    );
                  }}
                >
                  编辑
                </Button>
                <Button
                  style={{ float: 'left', marginLeft: '10px' }}
                  onClick={event =>
                    this.categoryConfig_delete(record.id, record.category)
                  }
                >
                  删除
                </Button>
              </div>
            );
          },
        },
      ];

      // const data = [];
      // for (let i = 0; i < 3; ++i) {
      //   data.push({
      //     key: i,
      //     date: '2014-12-24 23:12:00',
      //     configKey: 'This is production name',
      //     configValue: 'Upgraded: 56',
      //   });
      // }

      //record.getData(record.category);

      return (
        <Table
          rowKey={record => record.id}
          columns={_columns}
          dataSource={record.childData}
          //dataSource={data}
          pagination={false}
        />
      );
    };

    return (
      <div>
        <Modal
          maskClosable={false}
          width="350px"
          okText="确定"
          cancelText="取消"
          title={this.isEdit ? '编辑' : '添加'}
          centered
          visible={this.state.modalVisible}
          onOk={() => this.addEdit()}
          onCancel={() => {
            this.setModalVisible(false);
          }}
        >
          <div
            style={{
              width: '350px',
              overflow: 'auto',
              overflowX: 'hidden',
            }}
          >
            <div>
              <div style={{ display: 'flex', marginTop: 10 }}>
                <div style={{ width: '70px', lineHeight: '30px' }}>
                  <span style={{ color: 'red' }}>*</span>所属分类
                </div>

                <AutoComplete
                  size="large"
                  disabled={this.isEdit}
                  style={{ width: 200, marginLeft: '20px' }}
                  options={this.autoText}
                  placeholder="输入所属分类"
                  value={this.category}
                  onChange={value => {
                    this.category = value;
                  }}
                />
                {/* <Input
                            disabled = {this.isEdit}
                            style={{ width: 200, marginLeft: '20px' }}
                            value={this.category || ''}
                            onChange={event =>
                            (this.category = event.target.value)
                            }
                            placeholder="输入所属分类"
                        /> */}
              </div>

              <div style={{ display: 'flex', marginTop: 10 }}>
                <div style={{ width: '70px', lineHeight: '30px' }}>
                  <span style={{ color: 'red' }}>*</span>输入排序
                </div>
                <InputNumber
                  style={{ width: 200, marginLeft: '20px' }}
                  step={1}
                  value={Number(this.sort)}
                  onChange={value => (this.sort = Number(value))}
                />
              </div>

              <div style={{ display: 'flex', marginTop: 10 }}>
                <div style={{ width: '70px', lineHeight: '30px' }}>
                  <span style={{ color: 'red' }}>*</span>输入key
                </div>
                <Input
                  disabled={this.isEdit}
                  style={{ width: 200, marginLeft: '20px' }}
                  value={this.configKey || ''}
                  onChange={event => (this.configKey = event.target.value)}
                  placeholder="输入key"
                />
              </div>

              <div style={{ display: 'flex', marginTop: 10 }}>
                <div style={{ width: '70px', lineHeight: '30px' }}>
                  <span style={{ color: 'red' }}>*</span>输入Value
                </div>
                {/* <Input
                  style={{ width: 200, marginLeft: '20px' }}
                  value={this.configValue || ''}
                  onChange={event => (this.configValue = event.target.value)}
                  placeholder="输入Value"
                /> */}
                <TextArea
                  style={{ width: 200, marginLeft: '20px' }}
                  value={this.configValue || ''}
                  onChange={event => (this.configValue = event.target.value)}
                  placeholder="输入Value"
                />
              </div>
            </div>
          </div>
        </Modal>

        <TextArea
          style={{ width: 400, height: '30px' }}
          value={this.importJSON}
          onChange={event => (this.importJSON = event.target.value)}
          placeholder="输入JSON"
        />
        <Button
          style={{ marginLeft: '10px' }}
          onClick={x => {
            if (this.importJSON == null || this.importJSON.trim() == '') {
              message.info('不能输入空的JSON');
              return;
            }
            this.categoryConfig_replaceAll(this.importJSON);
          }}
        >
          导入
        </Button>

        <Table
          onExpand={(expanded, record) => {
            this.categoryConfig_pageQuery(record.category);
          }}
          expandable={{ expandedRowRender }}
          scroll={{
            y:
              this.scrollY == 0
                ? window.innerHeight - this.scrollHeight
                : this.scrollY,
          }}
          components={{
            body: {
              // cell: EditableCell,
            },
          }}
          bordered
          rowKey={record => record.id}
          dataSource={this.categoryConfigDataGroup}
          //dataSource={originData}
          columns={columns}
          rowClassName="components-table-demo-nested"
          pagination={{
            showQuickJumper: true,
            onChange: (page, pageSize) => {
              console.log(page);
              this.categoryConfig_loadCategory(page, 13);
            },
            total: this.total,
            pageSize: 13,
          }}
        />
      </div>
    );
  }
}

export default CategoryConfig;

export class importModel {
  constructor() {}
  category: string;
  configKey: string;
  configValue: string;
  orderBit: number;
}

export class Model {
  //obj:CategoryConfig;
  constructor() {
    //this.obj = _this;
  }

  id: number;
  category: string;
  configKey: string;
  configValue: string;

  @observable
  childData: Array<Model>;

  //#region

  // @action getData = (category) => {
  //     this.categoryConfig_pageQuery(category);
  // };

  //#endregion

  //#region

  // editData(){
  //     console.log('调用editData--------------------------------------');

  //     this.obj.category = this.category;
  //     this.obj.configKey = this.configKey;
  //     this.obj.configValue = this.configValue;
  //     this.obj.isEdit = true;
  //     this.obj.setModalVisible(true);
  // }

  //#endregion

  //#region 请求

  // @action categoryConfig_pageQuery = async (
  //     category = null,//所属分类
  //     configKey = null,//配置的key
  //     configValue = null,//配置的value
  //     field = null,//排序字段
  //     pageNo = 1,//分页查询页数 若不传默认是1   必须
  //     pageSize = 10,//分页查询步长 size 若不传默认是10   必须
  //     sort = null//排序方式 倒序: DESC 升序：ASC
  // ) => {
  //     var data = await HttpService.categoryConfig_pageQuery(
  //         category,
  //         configKey,
  //         configValue,
  //         field,
  //         pageNo,
  //         pageSize,
  //         sort
  //     );
  //     runInAction(() => {
  //     if (data) {
  //         this.childData =data?.list;
  //         console.log('Model---------------------------------拿到数据');
  //         console.log(JSON.stringify(this.childData));
  //         //observable.
  //         // var s = this.above.categoryConfigDataGroup;
  //         // this.above.categoryConfigDataGroup = null;
  //         //observable();

  //     }
  //     });
  // };

  //#endregion
}
