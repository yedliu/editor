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
// import SwitchSketelonAction from '@/modelClasses/courseDetail/ShowHideViewModels/SwitchSketelonAction';
// import { ElementTypes } from '@/modelClasses/courseDetail/courseDetailenum';
// import ImgSkItem from '@/modelClasses/courseDetail/editItemViewModels/imgSkItem';
// import { ActionTimeView } from './switchActionSelector';

// type SmallSwitchActionSelectorProps = {
//   scene?: CWPage;
//   itemsPool?: CWElement[];
//   isSingle?: boolean;
//   style?: CSSProperties;
//   selectorName?: string;
//   defaultText?: string;
//   switchBoneIds?: SwitchSketelonAction[];
//   switchBoneIdsChanged?: (switchids: SwitchSketelonAction[]) => void;
//   icon?: (...colors: string[]) => any;
//   placement?: TooltipPlacement;
//   hasItemColor?: string;
//   noItemColor?: string;
// };

// const SearchTypes = ['关键词'];

// @observer
// export default class SmallSwitchActionSelector extends PureComponent<
//   SmallSwitchActionSelectorProps
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
//     return itemsPool.filter(x => x.ElementType == ElementTypes.Skeleton);
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
//     }
//     return result;
//   }

//   getSelectedItems(): CWElement[] {
//     var itemsPool = this.ItemsPool;
//     var switchBoneIds = this.props.switchBoneIds || [];
//     var result = [];
//     switchBoneIds.forEach(x => {
//       var item = itemsPool?.find(
//         y => y.Id == x.Id && y.ElementType == ElementTypes.Skeleton,
//       );
//       if (item) result.push(item);
//     });
//     return result;
//   }

//   getToolTipStr() {
//     var selectedItems = this.getSelectedItems();
//     var switchBoneIds = this.props.switchBoneIds;
//     var names =
//       switchBoneIds
//         ?.map(x => {
//           var item = selectedItems.find(_item => _item.Id == x.Id);
//           if (item) return `${item.Name}→${x.Action}`;
//           return null;
//         })
//         .filter(x => x)
//         .join(',') || '(空)';
//     return this.props.selectorName.concat(':', names);
//   }

//   deleteItem(item: CWElement) {
//     var oldIds = this.props.switchBoneIds;
//     var to_removeIndex = oldIds.findIndex(x => x.Id == item.Id);
//     if (to_removeIndex >= 0 && to_removeIndex < oldIds.length) {
//       oldIds.splice(to_removeIndex, 1);
//       this.props.switchBoneIdsChanged?.([...(oldIds || [])]);
//     }
//   }
//   clearItems() {
//     var oldIds = this.props.switchBoneIds;
//     if (oldIds != null && oldIds != []) {
//       this.props.switchBoneIdsChanged?.([]);
//     }
//   }

//   raiseSwitchBoneIdsChanged() {
//     this.props.switchBoneIdsChanged?.([...(this.props.switchBoneIds || [])]);
//   }

//   selectOrDeleteItem(item: CWElement) {
//     var oldIds = this.props.switchBoneIds;
//     var selectedItems = this.getSelectedItems();
//     let elements = this.props.scene.Elements;
//     oldIds =
//       oldIds?.filter(x => elements?.map(item => item.Id).includes(x.Id)) || [];
//     if (selectedItems.includes(item)) {
//       this.deleteItem(item);
//     } else {
//       if (item instanceof ImgSkItem) {
//         var result = new SwitchSketelonAction();
//         result.Id = item.Id;
//         result.ChangedSkPlayTimes = 0;
//         result.Action = item.Res.boneList[0].value;
//         oldIds.push(result);
//         this.props.switchBoneIdsChanged?.([...(oldIds || [])]);
//       }
//     }
//   }

//   getSelectedItemOverlay(item: CWElement) {
//     var switchBone = this.props.switchBoneIds?.find(x => x.Id == item.Id);
//     if (switchBone) {
//       return (
//         <ActionTimeView
//           skItem={item as ImgSkItem}
//           switchInfo={switchBone}
//           style={{
//             padding: '3px',
//             background: 'white',
//             WebkitBoxShadow: '0px 0px 6px #9999999F',
//           }}
//           selectorControl={this}
//         />
//       );
//     } else
//       return (
//         <div
//           style={{
//             padding: '2px 4px 2px 4px',
//             userSelect: 'none',
//             pointerEvents: 'none',
//             background: 'white',
//             WebkitBoxShadow: '0px 0px 6px #3333336F',
//           }}
//         >
//           {item.Name}
//         </div>
//       );
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
//       >
//         <div>
//           已选中
//           <div
//             style={{
//               position: 'relative',
//               height: '80px',
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
//             {this.props.switchBoneIds != null &&
//             this.props.switchBoneIds.length > 0 ? (
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
//       this.props.switchBoneIds && this.props.switchBoneIds.length > 0
//         ? hasItemColor
//         : noItemColor,
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
