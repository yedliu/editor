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
// import { Popover } from 'antd';

// type ElementsSelectorProps = {
//   scene?: CWPage;
//   whiteList?: number[];
//   isSingle?: boolean;
//   style?: CSSProperties;
//   notice?: string;
//   elementIds?: string;
//   elementIdsChanged?: (eids: string) => void;
//   unitSize?: number;
//   rowUnitCount?: number;
//   autoWidth?: boolean;
// };

// @observer
// export default class ElementsSelector extends PureComponent<
//   ElementsSelectorProps
// > {
//   constructor(props) {
//     super(props);
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

//   addItems(itemIds: string) {
//     var oldIds = this.props.elementIds;
//     var oldIdList = IdHelper.ToIdList(oldIds);
//     var addIdList = IdHelper.ToIdList(itemIds);
//     if (this.props.isSingle) {
//       var _newIds = IdHelper.ToIdList(itemIds);
//       if (_newIds != null && _newIds.length == 1) {
//         var newIds = _newIds[0];
//         if (oldIds != newIds) this.props.elementIdsChanged?.(itemIds);
//       }
//     } else {
//       var resultSet = new Set<string>();
//       oldIdList?.forEach(x => resultSet.add(x));
//       addIdList?.forEach(x => resultSet.add(x));
//       var newIds = IdHelper.ToIdStr(Array.from(resultSet));
//       if (newIds != oldIds) this.props.elementIdsChanged?.(newIds);
//     }
//   }

//   onDragOver(e: React.DragEvent<HTMLDivElement>): void {
//     var dragitems: CWElement[] = DraggingData.getData('dragitems');
//     if (dragitems != null && dragitems.length > 0 && this.props.scene) {
//       var items = dragitems;
//       if (this.props.whiteList) {
//         var types = items.map(x => x.ElementType);
//         var isOk = true;
//         types?.forEach(x => (isOk = isOk && this.props.whiteList.includes(x)));
//         if (isOk) e.preventDefault();
//       } else e.preventDefault();
//     }
//   }

//   onDrop(e: React.DragEvent<HTMLDivElement>): void {
//     var dragitems: CWElement[] = DraggingData.getData('dragitems');
//     if (dragitems != null && dragitems.length > 0 && this.props.scene) {
//       var itemIds = IdHelper.ToIdStr(dragitems.map(x => x.Id));
//       this.addItems(itemIds);
//       e.currentTarget?.focus();
//     }
//   }

//   render() {
//     if (this.props.scene == null) return null;
//     var elementIdArray = IdHelper.ToIdList(this.props.elementIds);
//     var selectedItems = elementIdArray
//       .map(x => this.props.scene.TotalEditItemList.find(item => item.Id == x))
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
//           minHeight: `${unitSize + 2}px`,
//           position: 'relative',
//           width: `${width}px`,
//           border: '1px solid #5A7F9C',
//           background: '#CCCCCC6F',

//           ...this.props.style,
//         }}
//         tabIndex={-1}
//         onDragOver={e => this.onDragOver(e)}
//         onDrop={e => this.onDrop(e)}
//       >
//         {this.props.elementIds == null || this.props.elementIds == '' ? (
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
//                 content={<div style={{ userSelect: 'none' }}>{item.Name}</div>}
//               >
//                 <div
//                   style={{
//                     margin: '2px',
//                     position: 'relative',
//                     float: 'left',
//                     width: `${30}px`,
//                     height: `${30}px`,
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
//         {this.props.elementIds != null && this.props.elementIds != '' ? (
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
