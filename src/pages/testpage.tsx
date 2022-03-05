import React from 'react';
import { connect } from 'dva';
import { search } from '../utils/locationSearch';
import CWSubstance from '@/modelClasses/courseDetail/cwSubstance';
import { from } from 'linq-to-typescript';
import { Table, Upload, Button } from 'antd';
import CWElement from '@/modelClasses/courseDetail/cwElement';
import UpLoadFileHelper, { ResFile } from '@/utils/uploadFileHelper';

const columns = [
  {
    title: '页码',
    dataIndex: 'PageIndex',
    key: 'PageIndex',
  },
  {
    title: '页的名称',
    dataIndex: 'Name',
    key: 'Name',
  },
  {
    title: '编号',
    dataIndex: 'key',
    key: 'key',
  },
  {
    title: '元素数量',
    dataIndex: 'elementCount',
    key: 'elementCount',
  },
];

class LayoutTestPanel extends React.Component<any, any> {
  state = {
    fileList: [],
    uploading: false,
  };

  handleUpload = async () => {
    const { fileList } = this.state;

    let text = new Array<ResFile>();
    fileList.forEach(fileitem => {
      let fileText = new ResFile();
      fileText.file = fileitem;
      text.push(fileText);
    });
    //var c = await UpLoadFileHelper.UploadFile(text);
    let ee = 1;
    //console.log(c);
  };

  private locationSearch: any;

  constructor(props: React.Props<any>) {
    super(props);
  }

  componentDidMount() {
    this.locationSearch = search;
  }

  ConvertElementType(type: number): string {
    switch (type) {
      case 0:
        return '图片';
      case 1:
        return '文本';
      case 2:
        return '骨骼动画';
      case 3:
        return '组合元素';
      case 4:
        return '富文本';
      case 1001:
        return '矩形迷宫';
      case 1002:
        return '矩形迷宫-控制器';
      case 1003:
        return '迷宫棋子';
      case 1004:
        return '输出键盘';
      case 1005:
        return '输入容器';
      case 1006:
        return '三角形';
      case 1007:
        return '四边形';
      case 1008:
        return '计时器';
      case 1009:
        return '涂色容器';
      case 1010:
        return '涂色器';
      case 1011:
        return '拖动进度条';
      case 1012:
        return '';
        return '语音识别';
      case 1013:
        return '文字书写';
      case 1014:
        return '拖入容器';
      default:
        return '基本元素';
    }
  }

  GetElementChildren(childelements: Array<CWElement>) {
    let elements = [];
    if (childelements && childelements.length > 0) {
      let combinedElement = from<any>(childelements)
        .where(p => p.ElementType == 3)
        .toArray();
      combinedElement.forEach(combined => {
        elements = [...elements, ...this.GetElementChildren(combined.Children)];
      });
      elements = [...elements, ...childelements];
    }
    return elements;
  }

  ReportTable() {
    if (
      this.props.coursewareEntity &&
      this.props.coursewareEntity.cwSubstance.Pages
    ) {
      let cwSubstance: CWSubstance = this.props.coursewareEntity
        .cwSubstance as CWSubstance;
      let courseControlReport = [];
      cwSubstance.Pages.forEach(item => {
        let cWCombinedElements = from<any>(item.Elements)
          .where(p => p.ElementType == 3)
          .toArray();
        let newElement = [];
        if (cWCombinedElements) {
          cWCombinedElements.forEach(combined => {
            newElement = [
              ...newElement,
              ...this.GetElementChildren(combined.Children),
            ];
          });
          newElement = [...newElement, ...item.Elements];
        }
        let details = [];
        if (newElement) {
          let elementsGroup = from<any>(newElement)
            .groupBy(p => p.ElementType)
            .toArray();
          elementsGroup.forEach(itemgroup => {
            switch (itemgroup.key) {
              case 1:
              case 4: {
                let displayMode = from<any>(itemgroup.toArray()).count(
                  p => p.DisplayMode == true,
                );
                details.push(
                  `类型：${this.ConvertElementType(itemgroup.key)};  数量：${
                  itemgroup.toArray().length
                  }; 已转图片数量:${displayMode};`,
                );

                break;
              }
              default:
                {
                  details.push(
                    `类型：${this.ConvertElementType(itemgroup.key)};  数量：${
                    itemgroup.toArray().length
                    }`,
                  );
                }
                break;
            }
          });
          courseControlReport.push({
            Name: item.Name,
            key: item.Id,
            PageIndex: item.PageIndex,
            Detail: details,
            elementCount: newElement.length,
          });
        }
      });
      return courseControlReport;
    }
    return null;
  }

  onchageFile(info: any) {
    var c = 1;
  }


  testBoneJs() {

    let element = document.getElementsByClassName("layaboxIndex")[0] as HTMLIFrameElement;
    let skcontrol = element.contentWindow as any;
    skcontrol.LoadSkRes(100, 100, "https://rs.hdkj.zmlearn.com/coursewarezmgx-fat/course/ea95c8da-8755-4495-9100-551e0e0bd70d.png",
      "https://rs.hdkj.zmlearn.com/coursewarezmgx-fat/course/a8c5c952-5c27-4452-82ad-6dfe0b5608b1.sk", 100 / 421,
      function (ationArray) {
        console.log(ationArray);
      }.bind(this));




  }

  render() {
    const { uploading, fileList } = this.state;
    const props = {
      onRemove: file => {
        this.setState(state => {
          const index = state.fileList.indexOf(file);
          const newFileList = state.fileList.slice();
          newFileList.splice(index, 1);
          return {
            fileList: newFileList,
          };
        });
      },
      beforeUpload: file => {
        this.setState(state => ({
          fileList: [...state.fileList, file],
        }));
        return false;
      },
      fileList,
    };
    let resouceTextInfo = '';
    let resouceSizeInfo = '';
    if (
      this.props.coursewareEntity.courseware.coursewareId &&
      this.props.coursewareEntity &&
      this.props.coursewareEntity.cwSubstance.Pages
    ) {
      let cwSubstance: CWSubstance = this.props.coursewareEntity
        .cwSubstance as CWSubstance;
      resouceTextInfo = from<any>(cwSubstance.Library)
        .where(p => p.resourceType == 4)
        .select(p => p.resourceName)
        .toArray()
        .join(',');
      resouceSizeInfo = (
        from<any>(cwSubstance.Library).sum(p => p.resourceSize) /
        1024 /
        1024
      ).toFixed(2);
    }
    return (
      <div>
        <div>
          <iframe src='./layaboxIndex.html' className='layaboxIndex' style={{
            margin: '0px',
            padding: '0px',
            overflow: 'hidden',
            border: 'none',
            userSelect: 'none',
            width: '200px',
            height: '200px'

          }}></iframe>
        </div>
        <Upload {...props}>
          <Button>Select File</Button>
        </Upload>
        <Button
          type="primary"
          onClick={this.handleUpload}
          style={{ marginTop: 16 }}
        >
          Start Upload
        </Button>
        <button
          onClick={() => this.testBoneJs()}
        >
          登录测试
        </button>
        <ul>
          <label>{this.props.loginInfo.userId}</label>
        </ul>
        <button
          onClick={() => {
            this.props.dispatch({
              type: 'coursewareEntity/getCouresWareDetail',
              payload: { cwId: this.locationSearch.cwId },
            });
          }}
        >
          课件数据信息
        </button>
        <ul>
          <li>{resouceTextInfo}</li>
          <li>{resouceSizeInfo}MB</li>
        </ul>
        <ul>
          <Table
            columns={columns}
            expandable={{
              expandedRowRender: record => (
                <div style={{ margin: 0 }}>
                  {record.Detail.map((item, key) => {
                    return (
                      <div key={key}>
                        <a>{item}</a>
                        <hr />
                      </div>
                    );
                  })}
                </div>
              ),
              rowExpandable: record => record.name !== 'Not Expandable',
            }}
            dataSource={this.ReportTable()}
          />
        </ul>
      </div>
    );
  }
}

function mapStateToProps(state: any) {
  return {
    loginInfo: state.loginInfo,
    coursewareEntity: state.coursewareEntity,
  };
}

export default connect(mapStateToProps)(LayoutTestPanel);
