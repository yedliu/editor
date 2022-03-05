import { PureComponent, CSSProperties } from 'react';
import CWPage from '@/modelClasses/courseDetail/cwpage';
import CWElement from '@/modelClasses/courseDetail/cwElement';
import React from 'react';
import IdHelper from '@/utils/idHelper';
import { from } from 'linq-to-typescript';
import EditItemView from '../../elements/elementItemUI';
import { Viewbox } from '@/components/controls/viewbox';
import DraggingData from '@/modelClasses/courseDetail/toolbox/DraggingData';
import { observer } from 'mobx-react';
import { Popover, Dropdown } from 'antd';
import { observable } from 'mobx';
import { TooltipPlacement } from 'antd/lib/tooltip';
import { ClassType } from '@/class-transformer/ClassTransformer';
import TypeMapHelper from '@/configs/typeMapHelper';
import { stores } from '@/pages';

type SmallPageSelectorProps = {
  scene?: CWPage;
  itemsPool?: CWPage[];
  isSingle?: boolean;
  style?: CSSProperties;
  selectorName?: string;
  defaultText?: string;
  pageIds?: string;
  pageIdsChanged?: (eids: string) => void;
  icon?: (...colors: string[]) => any;
  placement?: TooltipPlacement;
  hasItemColor?: string;
  noItemColor?: string;
};

@observer
export default class SmallPagesSelector extends PureComponent<
  SmallPageSelectorProps
> {
  @observable
  isDropDownOpend = false;
  @observable
  isShowToolTip = false;

  @observable
  searchType = 0;

  constructor(props) {
    super(props);
  }

  @observable
  private _Keywords: string = '';
  public get Keywords(): string {
    return this._Keywords;
  }
  public set Keywords(v: string) {
    this._Keywords = v;
  }

  public get ItemsPool(): CWPage[] {
    return this.props.scene?.Courseware.Pages;
  }

  getSelectedItems(): CWPage[] {
    var itemsPool = this.ItemsPool;
    var pageIds = this.props.pageIds;
    var idList = IdHelper.ToIdList(pageIds);
    var result = [];
    idList.forEach(x => {
      var item = itemsPool?.find(y => y.Id == x);
      if (item) result.push(item);
    });
    return result;
  }

  getToolTipStr() {
    var selectedItems = this.getSelectedItems();
    var names = selectedItems.map(x => x.Name).join(',') || '(空)';
    return this.props.selectorName.concat(':', names);
  }

  deleteItem(item: CWPage) {
    var oldIds = this.props.pageIds;
    var newIds = IdHelper.RemoveId(oldIds, item.Id);
    if (newIds != oldIds) this.props.pageIdsChanged?.(newIds);
  }

  clearItems() {
    var oldIds = this.props.pageIds;
    if (oldIds != '' && oldIds != null) {
      this.props.pageIdsChanged?.('');
    }
  }

  selectOrDeleteItem(item: CWPage) {
    var oldIds = this.props.pageIds;
    var idList = IdHelper.ToIdList(oldIds);
    if (idList.includes(item.Id)) {
      this.deleteItem(item);
    } else {
      if (this.props.isSingle) {
        var newIds = item.Id;
        if (newIds != oldIds) this.props.pageIdsChanged?.(newIds);
      } else {
        idList.push(item.Id);
        var newIds = IdHelper.ToIdStr(idList);
        if (newIds != oldIds) this.props.pageIdsChanged?.(newIds);
      }
    }
  }

  getSelectedItemOverlay(item: CWPage) {
    return (
      <div
        style={{
          padding: '2px 4px 2px 4px',
          userSelect: 'none',
          pointerEvents: 'none',
          background: 'white',
          WebkitBoxShadow: '0px 0px 6px #3333336F',
        }}
      >
        {item.PageIndex}
      </div>
    );
  }

  renderSelectArea() {
    var selectedItems = this.getSelectedItems();
    return (
      <div
        style={{
          display: '-webkitbox',
          WebkitBoxOrient: 'vertical',
          WebkitBoxAlign: 'start',
          width: '280px',
        }}
        onWheel={e => e.stopPropagation()}
      >
        <div>
          已选中
          <div
            style={{
              position: 'relative',
              width: this.props.isSingle ? '42px' : '100%',
              height: this.props.isSingle ? '42px' : '80px',
            }}
          >
            <div
              style={{
                border: '1px solid #8989899F',
                height: '100%',
                overflowY: 'auto',
              }}
            >
              {selectedItems.map((item, i) => {
                return (
                  <Dropdown
                    key={i}
                    trigger={['hover']}
                    placement="topCenter"
                    overlay={this.getSelectedItemOverlay(item)}
                  >
                    <div
                      style={{
                        margin: '2px',
                        position: 'relative',
                        float: 'left',
                        width: `${34}px`,
                        height: `${34}px`,
                        border: '1px solid #8888884F',
                      }}
                      onDoubleClick={() => this.deleteItem(item)}
                    >
                      {item.BgImgRes ? (
                        <img
                          src={item.BgImgRes.resourceKey}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain',
                          }}
                        ></img>
                      ) : null}
                    </div>
                  </Dropdown>
                );
              })}
            </div>
            {this.props.pageIds != null && this.props.pageIds != '' ? (
              <div
                style={{
                  position: 'absolute',
                  right: '-6px',
                  top: '-8px',
                  width: '12px',
                  height: '12px',
                  background: 'transparent',
                  cursor: 'pointer',
                }}
                onClick={() => this.clearItems()}
              >
                <svg width="12" height="12">
                  <circle
                    cx="6"
                    cy="5"
                    r="5"
                    stroke="#CCCCCC9F"
                    fill="#CCCCCC9F"
                  />
                  <path d="M3,2 L9,8 M9,2 L3,8" stroke="#3333337F" />
                </svg>
              </div>
            ) : null}
          </div>
        </div>
        <div
          style={{
            height: '1px',
            width: '100%',
            background: '#8989899F',
            marginTop: '3px',
          }}
        />
        <div
          style={{
            width: '100%',
            border: '1px solid #8989899F',
            marginTop: '3px',
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            WebkitBoxAlign: 'stretch',
          }}
        >
          <div
            style={{
              width: '100%',
              height: '200px',
              overflowY: 'auto',
            }}
          >
            {this.ItemsPool?.map((item, i) => {
              return (
                <Dropdown
                  key={i}
                  trigger={['hover']}
                  placement="topCenter"
                  overlay={this.getSelectedItemOverlay(item)}
                >
                  <div
                    style={{
                      margin: '2px',
                      position: 'relative',
                      float: 'left',
                      width: `${34}px`,
                      height: `${34}px`,
                      border: selectedItems.includes(item)
                        ? '1.5px solid #66668F9F'
                        : '1px solid #8888884F',
                    }}
                    onMouseDown={() => this.selectOrDeleteItem(item)}
                  >
                    {item.BgImgRes ? (
                      <img
                        src={item.BgImgRes.resourceKey}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain',
                        }}
                      ></img>
                    ) : null}
                  </div>
                </Dropdown>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  render() {
    if (this.props.scene == null) return null;
    var hasItemColor = this.props.hasItemColor || '#44449F9F';
    var noItemColor = this.props.noItemColor || '#FFFFFFCF';
    var icon = this.props.icon?.(
      this.props.pageIds ? hasItemColor : noItemColor,
    );

    return (
      <Popover
        content={
          <div
            style={{
              maxWidth: '500px',
              WebkitLineClamp: 3,
              wordBreak: 'break-all',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
            }}
          >
            {this.getToolTipStr()}
          </div>
        }
        visible={this.isShowToolTip}
        onVisibleChange={e => {
          this.isShowToolTip = !this.isDropDownOpend && e;
        }}
      >
        <Popover
          trigger={['click']}
          content={this.renderSelectArea()}
          placement={this.props.placement || 'top'}
          arrowPointAtCenter
          onVisibleChange={e => {
            this.isDropDownOpend = e;
            this.isShowToolTip = false;
          }}
        >
          <div style={{ ...this.props.style }}>
            {icon ? icon : this.props.children}
          </div>
        </Popover>
      </Popover>
    );
  }
}
