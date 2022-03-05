import { search } from '@/utils/locationSearch';
import { Button, Drawer } from 'antd';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import { PureComponent } from 'react';
import FormworkListViewModel from '../models/formworklistViewModel';
import { GetQuDataUI } from './formworkLinkDialog';

@observer
export default class FormworkLinkedPreview extends PureComponent<any> {
  @observable
  private _ListViewModel: FormworkListViewModel;
  public get Data(): FormworkListViewModel {
    if (this._ListViewModel == null)
      this._ListViewModel = new FormworkListViewModel();
    return this._ListViewModel;
  }

  @observable
  private _isQuDataVisible = false;

  componentDidMount() {
    var locationSearch = search;
    this.Data.QuId = locationSearch.quId;
    this.Data.GetQuData();
  }
  render() {
    return (
      <div
        id="formworklink_preview_div"
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          right: 0,
          bottom: 0,
        }}
      >
        <iframe
          style={{
            position: 'absolute',
            left: '-2px',
            right: '-2px',
            top: '-2px',
            bottom: '-2px',
            width: 'calc(100% + 4px)',
            height: 'calc(100% + 4px)',
          }}
          src={`${process.env.prevUrl}?editorPreview=${
            search.editorPreview
          }&checkFlag=${search.checkFlag}&versionCode=${search.versionCode ||
            ''}&coursewareId=${search.coursewareId}&userId=${search.userId ||
            ''}`}
        ></iframe>
        <Button
          size="large"
          style={{
            position: 'absolute',
            right: '0px',
            bottom: '0px',
            transformOrigin: '100% 100%',
            transform: 'scale(0.8,0.8)',
          }}
          onClick={() => (this._isQuDataVisible = true)}
        >
          查看题目
        </Button>
        <Drawer
          title="题目数据"
          placement="right"
          closable={true}
          keyboard={true}
          getContainer={document.getElementById('formworklink_preview_div')}
          onClose={() => (this._isQuDataVisible = false)}
          visible={this._isQuDataVisible}
          width={400}
        >
          <div
            style={{
              position: 'absolute',
              left: '0px',
              top: '60px',
              bottom: '0px',
              right: '0px',
            }}
          >
            {GetQuDataUI(this.Data)}
          </div>
        </Drawer>
      </div>
    );
  }
}
