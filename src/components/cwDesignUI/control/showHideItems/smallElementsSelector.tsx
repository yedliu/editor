// import { PureComponent, CSSProperties } from 'react';
// import CWPage from '@/modelClasses/courseDetail/cwpage';
// import CWElement from '@/modelClasses/courseDetail/cwElement';
// import React from 'react';
// import IdHelper from '@/utils/idHelper';
// import { from } from 'linq-to-typescript';
// import EditItemView from '../../elements/elementItemUI';
// import { Viewbox } from '@/components/controls/viewbox';
// import DraggingData from '@/modelClasses/courseDetail/toolbox/DraggingData';
// import { observer } from 'mobx-react';
// import { Popover, Dropdown } from 'antd';
// import { observable } from 'mobx';
// import { TooltipPlacement } from 'antd/lib/tooltip';
// import { ClassType } from '@/class-transformer/ClassTransformer';
// import TypeMapHelper from '@/configs/typeMapHelper';

// type SmallElementsSelectorProps = {
//   scene?: CWPage;
//   itemsPool?: CWElement[];
//   whiteList?: number[];
//   isSingle?: boolean;
//   style?: CSSProperties;
//   selectorName?: string;
//   defaultText?: string;
//   elementIds?: string;
//   elementIdsChanged?: (eids: string) => void;
//   icon?: (...colors: string[]) => any;
//   placement?: TooltipPlacement;
//   hasItemColor?: string;
//   noItemColor?: string;
//   // unitSize?: number;
//   // rowUnitCount?: number;
//   // autoWidth?: boolean;
// };

// const SearchTypes = ['关键词', '类型'];

// @observer
// export default class SmallElementsSelector extends PureComponent<
//   SmallElementsSelectorProps
// > {
//   constructor(props) {
//     super(props);
//   }

//   @observable
//   isDropDownOpend = false;
//   @observable
//   isShowToolTip = false;

//   @observable
//   searchType = 0;
//   @observable
//   private _Keywords: string = '';
//   public get Keywords(): string {
//     return this._Keywords;
//   }
//   public set Keywords(v: string) {
//     this._Keywords = v;
//   }

//   @observable
//   private _ItemType: number = -1;
//   public get ItemType(): number {
//     return this._ItemType;
//   }
//   public set ItemType(v: number) {
//     this._ItemType = v;
//   }

//   public get ItemsPool(): CWElement[] {
//     var itemsPool = this.props.itemsPool || this.props.scene?.TotalEditItemList;
//     if (this.props.whiteList) {
//       var result = [];
//       itemsPool?.forEach(item => {
//         if (this.props.whiteList.includes(item.ElementType)) result.push(item);
//       });
//       return result;
//     }
//     return itemsPool;
//   }

//   public get VisibleItems(): CWElement[] {
//     var result = [];
//     if (this.searchType == 0) {
//       var keywords = this.Keywords?.split(' ').filter(x => x && x != ' ');
//       if (keywords != null && keywords.length > 0)
//         keywords.forEach(w => {
//           var _items = this.ItemsPool?.filter(item => item.Name.includes(w));
//           if (_items) result.push(..._items);
//         });
//       else result.push(...this.ItemsPool);
//     } else if (this.searchType == 1) {
//       if (this.ItemType == -1) result.push(...this.ItemsPool);
//       else {
//         var _items = this.ItemsPool?.filter(
//           item => item.ElementType == this.ItemType,
//         );
//         if (_items) result.push(..._items);
//       }
//     }
//     return result;
//   }

//   getSelectedItems(): CWElement[] {
//     var itemsPool = this.ItemsPool;
//     var elementIds = this.props.elementIds;
//     var idList = IdHelper.ToIdList(elementIds);
//     var result = [];
//     idList.forEach(x => {
//       var item = itemsPool?.find(y => y.Id == x);
//       if (item) result.push(item);
//     });
//     return result;
//   }

//   getToolTipStr() {
//     var selectedItems = this.getSelectedItems();
//     var names = selectedItems.map(x => x.Name).join(',') || '(空)';
//     return this.props.selectorName.concat(':', names);
//   }

//   deleteItem(item: CWElement) {
//     var oldIds = this.props.elementIds;
//     var newIds = IdHelper.RemoveId(oldIds, item.Id);
//     if (newIds != oldIds) this.props.elementIdsChanged?.(newIds);
//   }
//   clearItems() {
//     var oldIds = this.props.elementIds;
//     if (oldIds != '' && oldIds != null) {
//       this.props.elementIdsChanged?.('');
//     }
//   }

//   selectOrDeleteItem(item: CWElement) {
//     var oldIds = this.props.elementIds;
//     var idList = IdHelper.ToIdList(oldIds);
//     if (idList.includes(item.Id)) {
//       this.deleteItem(item);
//     } else {
//       if (this.props.isSingle) {
//         var newIds = item.Id;
//         if (newIds != oldIds) this.props.elementIdsChanged?.(newIds);
//       } else {
//         idList.push(item.Id);
//         var newIds = IdHelper.ToIdStr(idList);
//         if (newIds != oldIds) this.props.elementIdsChanged?.(newIds);
//       }
//     }
//   }

//   getSelectedItemOverlay(item: CWElement) {
//     return (
//       <div
//         style={{
//           padding: '2px 4px 2px 4px',
//           userSelect: 'none',
//           pointerEvents: 'none',
//           background: 'white',
//           WebkitBoxShadow: '0px 0px 6px #3333336F',
//         }}
//       >
//         {item.Name}
//       </div>
//     );
//   }

//   renderSelectArea() {
//     var selectedItems = this.getSelectedItems();
//     return (
//       <div
//         style={{
//           display: '-webkitbox',
//           WebkitBoxOrient: 'vertical',
//           WebkitBoxAlign: 'start',
//           width: '280px',
//         }}
//         onWheel={e => e.stopPropagation()}
//       >
//         <div>
//           已选中
//           <div
//             style={{
//               position: 'relative',
//               width: this.props.isSingle ? '42px' : '100%',
//               height: this.props.isSingle ? '42px' : '80px',
//             }}
//           >
//             <div
//               style={{
//                 border: '1px solid #8989899F',
//                 height: '100%',
//                 overflowY: 'auto',
//               }}
//             >
//               {selectedItems.map((item, i) => {
//                 return (
//                   <Dropdown
//                     key={i}
//                     trigger={['hover']}
//                     placement="topCenter"
//                     overlay={this.getSelectedItemOverlay(item)}
//                   >
//                     <div
//                       style={{
//                         margin: '2px',
//                         position: 'relative',
//                         float: 'left',
//                         width: `${34}px`,
//                         height: `${34}px`,
//                         border: '1px solid #8888884F',
//                       }}
//                       onDoubleClick={() => this.deleteItem(item)}
//                     >
//                       <Viewbox stretch="uniform">
//                         <EditItemView isMainView={false} dataContext={item} />
//                       </Viewbox>
//                     </div>
//                   </Dropdown>
//                 );
//               })}
//             </div>
//             {this.props.elementIds != null && this.props.elementIds != '' ? (
//               <div
//                 style={{
//                   position: 'absolute',
//                   right: '-6px',
//                   top: '-8px',
//                   width: '12px',
//                   height: '12px',
//                   background: 'transparent',
//                   cursor: 'pointer',
//                 }}
//                 onClick={() => this.clearItems()}
//               >
//                 <svg width="12" height="12">
//                   <circle
//                     cx="6"
//                     cy="5"
//                     r="5"
//                     stroke="#CCCCCC9F"
//                     fill="#CCCCCC9F"
//                   />
//                   <path d="M3,2 L9,8 M9,2 L3,8" stroke="#3333337F" />
//                 </svg>
//               </div>
//             ) : null}
//           </div>
//         </div>
//         <div
//           style={{
//             height: '1px',
//             width: '100%',
//             background: '#8989899F',
//             marginTop: '3px',
//           }}
//         />
//         <div
//           style={{
//             width: '100%',
//             border: '1px solid #8989899F',
//             marginTop: '3px',
//             display: '-webkit-box',
//             WebkitBoxOrient: 'vertical',
//             WebkitBoxAlign: 'stretch',
//           }}
//         >
//           <div
//             style={{
//               width: '100%',
//               height: '25px',
//             }}
//           >
//             <select
//               value={Number(this.searchType || 0)}
//               onChange={e => (this.searchType = Number(e.target.value || 0))}
//             >
//               {SearchTypes?.map((v, i) => {
//                 return (
//                   <option value={i} key={i}>
//                     {v}
//                   </option>
//                 );
//               })}
//             </select>
//             {(() => {
//               switch (this.searchType) {
//                 case 0:
//                   return (
//                     <input
//                       style={{ width: '180px', height: '23px' }}
//                       value={String(this.Keywords || '')}
//                       onChange={e =>
//                         (this.Keywords = String(e.target.value || ''))
//                       }
//                     ></input>
//                   );
//                 case 1:
//                   return (
//                     <select
//                       value={this.ItemType || 0}
//                       onChange={e =>
//                         (this.ItemType = Number(e.target.value || 0))
//                       }
//                     >
//                       <option value={-1}>全部</option>
//                       {TypeMapHelper.ElementTypeDiscriminator.subTypes?.map(
//                         (x, i) => {
//                           return !this.props.whiteList ||
//                             this.props.whiteList.includes(x.name) ? (
//                             <option value={x.name} key={i}>
//                               {x.title == '基本元素' ? '图片' : x.title}
//                             </option>
//                           ) : null;
//                         },
//                       )}
//                     </select>
//                   );
//               }
//               return null;
//             })()}
//           </div>
//           <div
//             style={{
//               width: '100%',
//               height: '200px',
//               overflowY: 'auto',
//             }}
//           >
//             {this.VisibleItems?.map((item, i) => {
//               return (
//                 <Dropdown
//                   key={i}
//                   trigger={['hover']}
//                   placement="topCenter"
//                   overlay={this.getSelectedItemOverlay(item)}
//                 >
//                   <div
//                     style={{
//                       margin: '2px',
//                       position: 'relative',
//                       float: 'left',
//                       width: `${34}px`,
//                       height: `${34}px`,
//                       border: selectedItems.includes(item)
//                         ? '1.5px solid #66668F9F'
//                         : '1px solid #8888884F',
//                     }}
//                     onMouseDown={() => this.selectOrDeleteItem(item)}
//                   >
//                     <Viewbox stretch="uniform">
//                       <EditItemView isMainView={false} dataContext={item} />
//                     </Viewbox>
//                   </div>
//                 </Dropdown>
//               );
//             })}
//           </div>
//         </div>
//       </div>
//     );
//   }

//   render() {
//     if (this.props.scene == null) return null;
//     var hasItemColor = this.props.hasItemColor || '#44449F9F';
//     var noItemColor = this.props.noItemColor || '#FFFFFFCF';
//     var icon = this.props.icon?.(
//       this.props.elementIds ? hasItemColor : noItemColor,
//     );

//     return (
//       <Popover
//         content={
//           <div
//             style={{
//               maxWidth: '500px',
//               WebkitLineClamp: 3,
//               wordBreak: 'break-all',
//               textOverflow: 'ellipsis',
//               overflow: 'hidden',
//             }}
//           >
//             {this.getToolTipStr()}
//           </div>
//         }
//         visible={this.isShowToolTip}
//         onVisibleChange={e => {
//           this.isShowToolTip = !this.isDropDownOpend && e;
//         }}
//       >
//         <Popover
//           trigger={['click']}
//           content={this.renderSelectArea()}
//           placement={this.props.placement || 'top'}
//           arrowPointAtCenter
//           onVisibleChange={e => {
//             this.isDropDownOpend = e;
//             this.isShowToolTip = false;
//           }}
//         >
//           <div style={{ ...this.props.style }}>
//             {icon ? icon : this.props.children}
//           </div>
//         </Popover>
//       </Popover>
//     );
//   }
// }
