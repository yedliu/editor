import { search } from '@/utils/locationSearch';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import { PureComponent } from 'react';
import FormworkDataService from '../formworkDataService';
import FormworkListViewModel from '../models/formworklistViewModel';
import {
  Select,
  Input,
  AutoComplete,
  Cascader,
  Pagination,
  Tooltip,
  Button,
  message,
} from 'antd';
import FormworkLinkDialog from './formworkLinkDialog';
import TimerHelper from '@/utils/timerHelper';
@observer
export class FormworkItemView extends PureComponent<any> {
  render() {
    var listData: FormworkListViewModel = this.props.listData;
    return (
      <div
        style={{
          position: 'relative',
          display: 'inline-block',
          width: '160px',
          height: '215px',
          margin: '15px 12px',
          border: '1px soild black',
          background: '#eaf1f0',
          borderRadius: '6px',
          boxShadow: '0px 0px 4px 4px #cccccc',
          textAlign: 'center',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'relative',
            top: '0px',
            left: '0px',
            right: '0px',
            height: '90px',
            background: '#F9F9F9',
            userSelect: 'none',
          }}
        >
          <img
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            src={
              this.props.data?.covers?.[0] ||
              require('@/assets/mainlist/courseDefault.png')
            }
            draggable={false}
          ></img>
        </div>
        <div
          style={{
            position: 'relative',
            top: '0px',
            left: '0px',
            right: '0px',
            height: '35px',
            background: '#F5F5F5',
            display: '-webkit-box',
            WebkitBoxAlign: 'center',
          }}
        >
          <Tooltip title={this.props.data?.coursewareName}>
            <div
              style={{
                position: 'absolute',
                left: '3px',
                right: '3px',
                textAlign: 'center',
                overflowWrap: 'break-word',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: 2,
                maxHeight: '30px',
                overflow: 'hidden',
                fontSize: '10px',
                lineHeight: '14px',
              }}
            >
              {this.props.data?.coursewareName}
              {this.props.children}
            </div>
          </Tooltip>
        </div>
        <div
          style={{
            position: 'relative',
            top: '0px',
            left: '0px',
            right: '0px',
            height: '16px',
            background: '#F2F5F7',
            fontSize: '12px',
            textAlign: 'start',
            color: '#6969e6',
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: '3px',
              right: '3px',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              transformOrigin: '0 50%',
              transform: 'scale(0.8)',
            }}
          >
            {`玩法: ${this.props.data?.playTypeDirVO?.title || '无'}`}
          </div>
        </div>
        <div
          style={{
            position: 'relative',
            top: '0px',
            left: '0px',
            right: '0px',
            height: '16px',
            background: '#F5F2F7',
            fontSize: '12px',
            textAlign: 'start',
            color: '#6969e6',
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: '3px',
              right: '3px',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              transformOrigin: '0 50%',
              transform: 'scale(0.8)',
            }}
          >
            {`风格: ${this.props.data?.styleTypeDirVO?.title || '无'}`}
          </div>
        </div>
        <div
          style={{
            position: 'relative',
            top: '0px',
            left: '0px',
            right: '0px',
            height: '16px',
            background: '#F7F5F2',
            fontSize: '12px',
            textAlign: 'start',
            color: '#6969e6',
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: '3px',
              right: '3px',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              transformOrigin: '0 50%',
              transform: 'scale(0.8)',
            }}
          >
            {`色系: ${this.props.data?.colorTypeDirVO?.title || '无'}`}
          </div>
        </div>
        <div
          style={{
            position: 'relative',
            top: '0px',
            height: '16px',
            left: '3px',
            right: '3px',
            fontSize: '12px',
            textAlign: 'left',
            lineHeight: '16px',
            transformOrigin: '0 50%',
            transform: 'scale(0.8)',
          }}
        >
          {`修改时间:${TimerHelper.stringToDate(this.props.data?.updateTime)}`}
        </div>
        <div
          style={{
            position: 'relative',
            top: '0px',
            left: '0px',
            right: '0px',
            bottom: '0px',
            fontSize: '12px',
            textAlign: 'center',
            lineHeight: '12px',
          }}
        >
          <Button
            size="small"
            style={{
              display: 'inline-block',
              transformOrigin: '50% 50%',
              transform: 'scale(0.75)',
            }}
            onClick={() => {
              if (listData) {
                listData.IsShowPreviewDialog = true;
                listData.CurrentFormwork = this.props.data;
              }
            }}
          >
            合并预览
          </Button>

          <Button
            size="small"
            type="primary"
            style={{
              display: 'inline-block',
              transformOrigin: '50% 50%',
              background: this.props.data?.isUsed ? '#C8C8C8' : '#ccBB35',
              transform: 'scale(0.75)',
              pointerEvents: this.props.data?.isUsed ? 'none' : 'visible',
            }}
            onClick={() => {
              listData?.LinkTemplateQu(this.props.data?.coursewareId, () => {
                listData.IsShowPreviewDialog = false;
                message.info('题目与作业模板连接成功');
                //listData.GetFormworkList();
              });
            }}
          >
            {this.props.data?.isUsed ? '已经合并' : ' 直接合并'}
          </Button>
        </div>
      </div>
    );
  }
}

@observer
export default class FormworkLinkView extends PureComponent<any> {
  @observable
  private locationSearch: any;

  private _ListViewModel: FormworkListViewModel;
  public get ListViewModel(): FormworkListViewModel {
    if (this._ListViewModel == null)
      this._ListViewModel = new FormworkListViewModel();
    return this._ListViewModel;
  }

  get QuTypeCode() {
    var result = this.locationSearch?.quCode;

    if (!result) {
      var qtype = this.locationSearch?.quType?.toUpperCase();
      var opcount = this.locationSearch?.quOpc;
      var stcount = this.locationSearch?.quStc;
      var optype = this.locationSearch?.quOpt;
      var sttype = this.locationSearch?.quStt;
      if (qtype && opcount && stcount && optype && sttype)
        result = `${qtype}_${opcount}_${stcount}_${sttype}_${optype}`;
    }
    return result;
  }

  get QuId() {
    return this.locationSearch?.quId;
  }

  get UserId() {
    return this.locationSearch?.userid;
  }

  public getFormworks() {
    // FormworkDataService.getFormworkList(
    // )
  }

  componentDidMount() {
    this.initPage();
  }

  initPage() {
    this.locationSearch = search;
    this.ListViewModel.QTypeCode = this.QuTypeCode;
    this.ListViewModel.QuId = this.QuId;
    this.ListViewModel.UserId = this.UserId;

    this.ListViewModel.GetFormworkCascadeSys(
      (() => {
        this.ListViewModel.GetQuData(
          this.ListViewModel.GetFormworkList.bind(this.ListViewModel),
        );
      }).bind(this),
    );
  }

  render() {
    var headHeight = '60px';
    var headLineHeight = '60px';
    if (window.innerWidth < 1050) {
      headHeight = '90px';
      headLineHeight = '45px';
    }
    return (
      <div
        style={{
          position: 'absolute',
          left: '0px',
          top: '0px',
          right: '0px',
          bottom: '0px',
          userSelect: 'none',
          background: '#f8eff0',
        }}
      >
        <div
          style={{
            position: 'absolute',
            boxShadow: '0px 0px 10px 3px #3333336F inset',
            left: '0px',
            top: '0px',
            right: '0px',
            bottom: '0px',
            zIndex: 99,
            pointerEvents: 'none',
          }}
        />

        <div
          style={{
            position: 'relative',
            left: '0px',
            top: '0px',
            right: '0px',
            height: headHeight,
            lineHeight: headLineHeight,
            display: 'block',
            overflowY: 'auto',
          }}
        >
          <div
            style={{
              margin: '0 5px 0 20px',
              width: '2.1em',
              display: 'inline-block',
            }}
          >
            题型
          </div>
          <Cascader
            placeholder="题型"
            size="small"
            changeOnSelect={false}
            expandTrigger="hover"
            // displayRender={labels =>
            //   labels && labels.length > 0 ? labels[labels.length - 1] : null
            // }
            options={
              this.ListViewModel.QTypeCascadeDirs
                ? [...this.ListViewModel.QTypeCascadeDirs.voList]
                : null
            }
            bordered={false}
            allowClear={false}
            value={this.ListViewModel.QType}
            onChange={(value, selectedOptions) => {
              this.ListViewModel.QType = value?.map(x => Number(x));
            }}
            fieldNames={{ label: 'title', value: 'id', children: 'voList' }}
            style={{
              background: '#CFCFCF',
              width: '220px',
              margin: '0 5px 0 1px',
              pointerEvents: this.ListViewModel.QTypeCode ? 'none' : 'visible',
              display: 'inline-block',
            }}
          />

          <div
            style={{ margin: '0 5px', width: '2.1em', display: 'inline-block' }}
          >
            玩法
          </div>
          <Cascader
            placeholder="玩法"
            size="small"
            changeOnSelect={false}
            expandTrigger="hover"
            displayRender={labels =>
              labels && labels.length > 0 ? labels[labels.length - 1] : null
            }
            options={
              this.ListViewModel.PlayTypeCascadeDirs
                ? [...this.ListViewModel.PlayTypeCascadeDirs.voList]
                : null
            }
            bordered={false}
            allowClear={false}
            value={this.ListViewModel.PlayType}
            onChange={(value, selectedOptions) => {
              this.ListViewModel.PlayType = value?.map(x => Number(x));
              this.ListViewModel.GetFormworkList();
            }}
            fieldNames={{ label: 'title', value: 'id', children: 'voList' }}
            style={{
              background: 'transparent',
              width: '120px',
              border: '1px solid #3333CC',
              margin: '0 5px 0 1px',
              display: 'inline-block',
            }}
          />
          <div
            style={{ margin: '0 5px', width: '2.1em', display: 'inline-block' }}
          >
            风格
          </div>
          <Cascader
            placeholder="风格"
            size="small"
            changeOnSelect={false}
            expandTrigger="hover"
            displayRender={labels =>
              labels && labels.length > 0 ? labels[labels.length - 1] : null
            }
            options={
              this.ListViewModel.StyleTypeCascadeDirs
                ? [...this.ListViewModel.StyleTypeCascadeDirs.voList]
                : null
            }
            bordered={false}
            allowClear={false}
            value={this.ListViewModel.StyleType}
            onChange={(value, selectedOptions) => {
              this.ListViewModel.StyleType = value?.map(x => Number(x));
              this.ListViewModel.GetFormworkList();
            }}
            fieldNames={{ label: 'title', value: 'id', children: 'voList' }}
            style={{
              background: 'transparent',
              width: '120px',
              border: '1px solid #3333CC',
              margin: '0 5px 0 1px',
              display: 'inline-block',
            }}
          />

          <div
            style={{ margin: '0 5px', width: '2.1em', display: 'inline-block' }}
          >
            色系
          </div>
          <Cascader
            placeholder="色系"
            size="small"
            changeOnSelect={false}
            expandTrigger="hover"
            displayRender={labels =>
              labels && labels.length > 0 ? labels[labels.length - 1] : null
            }
            options={
              this.ListViewModel.ColorTypeCascadeDirs
                ? [...this.ListViewModel.ColorTypeCascadeDirs.voList]
                : null
            }
            bordered={false}
            allowClear={false}
            value={this.ListViewModel.ColorType}
            onChange={(value, selectedOptions) => {
              this.ListViewModel.ColorType = value?.map(x => Number(x));
              this.ListViewModel.GetFormworkList();
            }}
            fieldNames={{ label: 'title', value: 'id', children: 'voList' }}
            style={{
              background: 'transparent',
              width: '120px',
              border: '1px solid #3333CC',
              margin: '0 5px 0 1px',
              display: 'inline-block',
            }}
          />

          <Input.Search
            placeholder="请输入搜索关键词"
            //value={this.ListViewModel?.Keyword}
            onSearch={v => {
              this.ListViewModel.Keyword = v;
              this.ListViewModel.GetFormworkList();
            }}
            style={{
              //background: 'transparent',
              width: '250px',
              margin: '0 0px 0 15px',
            }}
            allowClear
          ></Input.Search>
        </div>
        <div
          style={{
            position: 'absolute',
            width: '100%',
            top: headHeight,
            bottom: '60px',
            background: '#F9F9FE',
          }}
        >
          <div
            style={{
              position: 'absolute',

              left: '10px',
              top: 0,
              right: '10px',
              bottom: 0,
              overflowY: 'auto',
              overflowX: 'hidden',
              // textAlign: 'center',
            }}
          >
            {this.ListViewModel.FormworkList?.length ? (
              <div
                style={{
                  display: 'inline-block',
                  maxWidth: '100%',
                  textAlign: 'start',
                }}
              >
                {this.ListViewModel.FormworkList.map((f, i) => (
                  <FormworkItemView
                    key={i}
                    data={f}
                    listData={this.ListViewModel}
                    listView={this}
                  />
                ))}
                {/* {(() => {
                  var a = [];
                  for (var i = 0; i < 40; i++) {
                    a.push(
                      <FormworkItemView key={i} listView={this}>
                        {
                          '占位置占位置占位置占位置占位置占位置占位置占位置占位置占位置占位置占位置占位置占位置占位置占位置占位置占位置占位置占位置'
                        }
                      </FormworkItemView>,
                    );
                  }
                  return a;
                })()} */}
              </div>
            ) : (
              <div
                style={{
                  position: 'relative',
                  textAlign: 'center',
                }}
              >
                <div style={{ display: 'inline-block', marginTop: '18%' }}>
                  <img
                    style={{ display: 'block', userSelect: 'none' }}
                    src={require('@/assets/mainlist/png_no_content.png')}
                  ></img>
                  <label>还没有内容</label>
                </div>
              </div>
            )}
          </div>
        </div>

        <div
          style={{
            position: 'absolute',
            width: '100%',
            bottom: '0px',
            height: '60px',
          }}
        >
          {window.frames.length != parent.frames.length ? ( //在iframe当中
            <div style={{ float: 'left', margin: '10px' }}>
              <Button
                onClick={() => {
                  this.ListViewModel.completeLink();
                }}
              >
                取消
              </Button>
            </div>
          ) : null}
          <div style={{ float: 'right', margin: '10px' }}>
            <Pagination
              total={this.ListViewModel.TotalCounts || 0}
              showSizeChanger={false}
              showQuickJumper
              showTotal={total => `总数： ${this.ListViewModel.TotalCounts}`}
              defaultPageSize={20}
              defaultCurrent={1}
              current={this.ListViewModel.PageIndex}
              onChange={(page, pageSize) => {
                this.ListViewModel.PageIndex = page;
                this.ListViewModel.GetFormworkList();
              }}
            />
          </div>
        </div>
        <FormworkLinkDialog data={this.ListViewModel} />
      </div>
    );
  }
}
