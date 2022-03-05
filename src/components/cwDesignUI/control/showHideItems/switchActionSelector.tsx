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
// import SwitchSketelonAction from '@/modelClasses/courseDetail/ShowHideViewModels/SwitchSketelonAction';
// import { ElementTypes } from '@/modelClasses/courseDetail/courseDetailenum';
// import ImgSkItem from '@/modelClasses/courseDetail/editItemViewModels/imgSkItem';
// import { Popover } from 'antd';

// type ElementsSelectorProps = {
//   scene?: CWPage;
//   isSingle?: boolean;
//   style?: CSSProperties;
//   notice?: string;
//   switchBoneIds?: SwitchSketelonAction[];
//   switchBoneIdsChanged?: (switchids: SwitchSketelonAction[]) => void;
//   unitSize?: number;
//   rowUnitCount?: number;
//   autoWidth?: boolean;
// };

// @observer
// export class ActionTimeView extends PureComponent<{
//   skItem: ImgSkItem;
//   switchInfo: SwitchSketelonAction;
//   selectorControl?: any;
//   style?: CSSProperties;
// }> {
//   constructor(props) {
//     super(props);
//   }

//   render() {
//     const { skItem, switchInfo } = this.props;
//     return (
//       <div
//         style={{
//           display: '-webkit-box',
//           WebkitBoxOrient: 'vertical',
//           WebkitBoxPack: 'center',
//           position: 'relative',
//           textAlign: 'center',
//           ...this.props.style,
//         }}
//       >
//         {skItem.Name}
//         <br />
//         <select
//           style={{ width: '100px', margin: '2px' }}
//           value={switchInfo.Action}
//           onChange={e => {
//             switchInfo.Action = String(e.target.value);
//             this.props.selectorControl?.raiseSwitchBoneIdsChanged();
//           }}
//         >
//           {skItem.Res.boneList.map((bone, i) => {
//             return (
//               <option key={i} value={bone.value}>
//                 {bone.name}
//               </option>
//             );
//           })}
//         </select>
//         <br />
//         <select
//           style={{ width: '100px', margin: '2px' }}
//           value={switchInfo.ChangedSkPlayTimes}
//           onChange={e => {
//             switchInfo.ChangedSkPlayTimes = Number(e.target.value);
//             this.props.selectorControl?.raiseSwitchBoneIdsChanged();
//           }}
//         >
//           {(() => {
//             var result = [];
//             result.push(
//               <option key={0} value={0}>
//                 {'Forever'}
//               </option>,
//             );
//             for (var i = 1; i < 30; i++) {
//               result.push(
//                 <option key={i} value={i}>
//                   {i}
//                 </option>,
//               );
//             }
//             return result;
//           })()}
//         </select>
//       </div>
//     );
//   }
// }

// @observer
// export default class SwitchActionSelector extends PureComponent<
//   ElementsSelectorProps
// > {
//   constructor(props) {
//     super(props);
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

//   addItems(items: CWElement[]) {
//     var oldIds = this.props.switchBoneIds;
//     let elementsIds = this.props.scene.TotalEditItemList;
//     items = items?.filter(x => x.ElementType == ElementTypes.Skeleton);
//     oldIds =
//       oldIds?.filter(x => elementsIds?.map(item => item.Id).includes(x.Id)) ||
//       [];

//     // oldIds =
//     //   oldIds?.filter(x => items?.map(item => item.Id).includes(x.Id)) || [];
//     var actionVMsToAdd = items
//       ?.map(x => {
//         if (x instanceof ImgSkItem) {
//           var result = new SwitchSketelonAction();
//           result.Id = x.Id;
//           result.ChangedSkPlayTimes = 0;
//           result.Action = x.Res.boneList[0].value;
//           return result;
//         }
//         return null;
//       })
//       .filter(x => x != null && !oldIds?.map(y => y.Id).includes(x.Id));

//     if (actionVMsToAdd != null && actionVMsToAdd.length > 0) {
//       oldIds.push(...actionVMsToAdd);
//       this.props.switchBoneIdsChanged?.([...(oldIds || [])]);
//     }
//   }

//   raiseSwitchBoneIdsChanged() {
//     this.props.switchBoneIdsChanged?.([...(this.props.switchBoneIds || [])]);
//   }

//   onDragOver(e: React.DragEvent<HTMLDivElement>): void {
//     var dragitems: CWElement[] = DraggingData.getData('dragitems');
//     if (dragitems != null && dragitems.length > 0 && this.props.scene) {
//       var idList = dragitems.map(x => x.Id);
//       var items = this.props.scene.TotalEditItemList.filter(x =>
//         idList.includes(x.Id),
//       );
//       var types = items.map(x => x.ElementType);
//       var isOk = false;
//       types?.forEach(x => (isOk = isOk || x == ElementTypes.Skeleton));
//       if (isOk) e.preventDefault();
//     }
//   }

//   onDrop(e: React.DragEvent<HTMLDivElement>): void {
//     var dragitems: CWElement[] = DraggingData.getData('dragitems');
//     if (dragitems != null && dragitems.length > 0 && this.props.scene) {
//       this.addItems(dragitems);
//     }
//   }

//   render() {
//     if (this.props.scene == null) return null;
//     var elementIdArray = this.props.switchBoneIds?.map(x => x.Id);
//     var selectedItems: ImgSkItem[] = elementIdArray
//       ?.map(
//         x =>
//           this.props.scene.TotalEditItemList.find(
//             item => item.Id == x && item.ElementType == ElementTypes.Skeleton,
//           ) as ImgSkItem,
//       )
//       .filter(x => x != null);
//     var unitSize = this.props.unitSize || 36;
//     var rowUnitCount = this.props.rowUnitCount || 6;
//     var width =
//       Math.max(
//         1,
//         !this.props.autoWidth
//           ? rowUnitCount
//           : Math.min(rowUnitCount, selectedItems?.length || 1),
//       ) *
//         (unitSize + 4) +
//       2;

//     return (
//       <div
//         style={{
//           minHeight: `${unitSize + 6}px`,
//           position: 'relative',
//           width: `${width}px`,
//           border: '1px solid #5A7F9C',
//           background: '#CCCCCC6F',
//           ...this.props.style,
//         }}
//         onDragOver={e => this.onDragOver(e)}
//         onDrop={e => this.onDrop(e)}
//       >
//         {this.props.switchBoneIds == null ||
//         this.props.switchBoneIds.length == 0 ? (
//           <div
//             style={{
//               textAlign: 'center',
//               color: '#DDDDDD',
//               position: 'absolute',
//               width: '100%',
//               top: '50%',
//               transform: 'translate(0,-50%)',
//             }}
//           >
//             {this.props.notice}
//           </div>
//         ) : null}
//         <div>
//           {selectedItems?.map((item, i) => {
//             return (
//               <Popover
//                 key={i}
//                 content={
//                   <ActionTimeView
//                     selectorControl={this}
//                     skItem={item}
//                     switchInfo={this.props.switchBoneIds[i]}
//                   />
//                 }
//               >
//                 <div
//                   style={{
//                     margin: '2px',
//                     position: 'relative',
//                     float: 'left',
//                     width: `${unitSize}px`,
//                     height: `${unitSize}px`,
//                     border: '1px solid #8888884F',
//                   }}
//                   onMouseDown={() => (this.props.scene.SelectedItem = item)}
//                   onMouseMove={() => (this.props.scene.SelectedItem = item)}
//                   onDoubleClick={() => this.deleteItem(item)}
//                 >
//                   <Viewbox stretch="uniform" key={i}>
//                     <EditItemView
//                       isMainView={false}
//                       dataContext={item}
//                       key={i}
//                     />
//                   </Viewbox>
//                 </div>
//               </Popover>
//             );
//           })}
//         </div>
//         {this.props.switchBoneIds != null &&
//         this.props.switchBoneIds.length != 0 ? (
//           <div
//             style={{
//               position: 'absolute',
//               right: '-6px',
//               top: '-8px',
//               width: '12px',
//               height: '12px',
//               background: 'transparent',
//               cursor: 'pointer',
//             }}
//             onClick={() => this.clearItems()}
//           >
//             <svg width="12" height="12">
//               <circle cx="6" cy="5" r="5" stroke="#CCCCCC9F" fill="#CCCCCC9F" />
//               <path d="M3,2 L9,8 M9,2 L3,8" stroke="#3333337F" />
//             </svg>
//           </div>
//         ) : null}
//       </div>
//     );
//   }
// }
