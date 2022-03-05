import React from 'react';
import { Input, message } from 'antd';
import { observer, inject } from 'mobx-react';
import { observable, computed } from 'mobx';
import InvokableBase from '@/modelClasses/courseDetail/InvokableBase';

const { Search } = Input;
@inject('courseware', 'commander')
@observer
class SearchComponent extends React.Component<any, any> {
  //搜索值
  @observable
  private _searchVal: string = '';

  public get searchVal(): string {
    return this._searchVal;
  }

  public set searchVal(v: string) {
    this._searchVal = v;
  }

  // 根据搜索关键字查询的组件执行器
  @computed
  public get currentInv(): InvokableBase[] {
    const { courseware } = this.props;
    const { SelectedPage } = courseware;
    const { Invokables } = SelectedPage;
    let setArray: InvokableBase[] = [];
    if (this.searchVal) {
      setArray = Invokables.filter(item => {
        return (
          item.DisplayName.includes(this.searchVal) ||
          item?.Note?.includes(this.searchVal)
        );
      });
    }
    return setArray;
  }

  // 搜索
  handleSearch = val => {
    if (this.searchVal === val) return;
    this.searchVal = val;
  };

  // 定位
  handleGPSClick = val => {
    const { commander } = this.props;
    // 逻辑视图区dom信息
    const { ScrollviewRoot } = commander;
    if (!ScrollviewRoot) {
      message.warning('请将视图切换至逻辑区');
      return;
    }
    this.currentInv.map(item => {
      if (item === val) {
        item.IsSelected = true;

        // 视图区的中心点
        let viewportCenter = [
          ScrollviewRoot.ViewportWidth / 2,
          ScrollviewRoot.ViewportHeight / 2,
        ];

        // 当前元素在视图区的中心坐标点
        let currentEl = [
          val.baseRect.left -
            ScrollviewRoot.scrollRect.left +
            val.baseRect.width / 2,
          val.baseRect.top -
            ScrollviewRoot.scrollRect.top +
            val.baseRect.height / 2,
        ];

        if (viewportCenter === currentEl) {
          return;
        } else {
          // 坐标点的相差值
          let difVal = [
            viewportCenter[0] - currentEl[0],
            viewportCenter[1] - currentEl[1],
          ];
          // 视图层做相对运动
          ScrollviewRoot.ZeroPointX = ScrollviewRoot.ZeroPointX + difVal[0];
          ScrollviewRoot.ZeroPointY = ScrollviewRoot.ZeroPointY + difVal[1];
        }
      }
      if (item != val) {
        item.IsSelected = false;
      }
    });
  };

  render() {
    return (
      <div style={{ height: '40px', width: '100%' }}>
        <Search
          placeholder="输入关键字"
          height={40}
          onSearch={this.handleSearch}
          allowClear
        />
        <div style={{ fontSize: '14px', padding: '0 5px' }}>
          数量：{this.currentInv.length} 个
        </div>
        <div
          style={{
            width: '100%',
            padding: '0 5px',
            height: '200px',
            overflowX: 'auto',
          }}
        >
          {this.currentInv.map(item => (
            <div key={item.Id}>
              <div
                style={{
                  backgroundColor: item.HeaderBg,
                  borderTopLeftRadius: '3px',
                  borderTopRightRadius: '3px',
                  margin: '5px 0 0 0',
                  color: item.HeaderFg,
                  fontSize: '12px',
                }}
              >
                {item.DisplayName}
                <span
                  style={{
                    color: '#E7AAF3',
                    paddingLeft: '8px',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                  }}
                  onClick={() => this.handleGPSClick(item)}
                >
                  定位
                </span>
              </div>
              {item.Note && (
                <div style={{ fontSize: 12, backgroundColor: '#ccc' }}>
                  {item.Note}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default SearchComponent;
