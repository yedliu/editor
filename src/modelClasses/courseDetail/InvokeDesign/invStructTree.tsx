import InvokableBase from '../InvokableBase';
import { ClassType } from '@/class-transformer/ClassTransformer';
import InvokeHandler from './InvokeHandler';
import TypeMapHelper from '@/configs/typeMapHelper';
import LogicDesign from '../logicDesign';
import {
  FuncInvIcon,
  ElementCtrlIcon,
  MediaCtrlIcon,
  ActCtrlIcon,
  StoryCtrlIcon,
  BrachCtrlIcon,
  MissionCtrlIcon,
  StorageIcon,
  CalcInvIcon,
} from '@/svgs/designIcons';
import React from 'react';

export class InvStructNode {
  Name: string;
  NodeType: 'cat' | 'type' | 'item';
  Children: InvStructNode[];
  Constructor: ClassType<InvokableBase>;

  static GetNodeIcon(nodeName: string) {
    var iconColor = '#333333';
    var icon = null;
    switch (nodeName) {
      case '函数':
        icon = FuncInvIcon(iconColor);
        break;
      case '元素控制':
        icon = ElementCtrlIcon(iconColor);
        break;
      case '媒体控制':
        icon = MediaCtrlIcon(iconColor);
        break;
      case '行为控制':
        icon = ActCtrlIcon(iconColor);
        break;
      case '剧情控制':
        icon = StoryCtrlIcon(iconColor);
        break;
      case '任务控制':
        icon = MissionCtrlIcon(iconColor);
        break;
      case '存储':
        icon = StorageIcon(iconColor);
        break;
      case '判断':
        icon = BrachCtrlIcon(iconColor);
        break;
      case '计算':
        icon = CalcInvIcon(iconColor);
        break;
    }

    return icon;
  }

  static GetInvTypeStruct(
    logicDesign: LogicDesign,
    invokeHandler?: InvokeHandler,
  ) {
    var result: InvStructNode[] = [];
    var maps = TypeMapHelper.InvokableTypeDiscriminator.subTypes;
    for (var map of maps) {
      // if (map.grouptype == 'PreSetted')//暂不支持预设包和组件包
      //   continue;
      if (map.grouptype == 'InnerFunc' && logicDesign.InvFunc == null)
        //在最外部不能添加函数接口
        continue;

      var _contructor = map.value;
      if (invokeHandler != null) {
        //连线时判断当前类型执行器是否可被连
        if (!invokeHandler.CheckIfCanLink(_contructor)) continue;
        var tempobj = new _contructor();
        if (
          tempobj != null &&
          (!tempobj.CanInvoke ||
            !tempobj.CheckCanBeInvoked(invokeHandler.Owner) ||
            !invokeHandler.Owner.CheckCanInvoke(tempobj))
        )
          continue;
      }

      if (map.cat != null && map.cat != '') {
        var catPath = map.cat.split('[/|\\]+');
        var currentList = result;
        var currentNode: InvStructNode = null;
        for (var cat of catPath) {
          var _cnode = currentList?.find(x => x.Name == cat);
          if (_cnode == null) {
            _cnode = new InvStructNode();
            _cnode.Name = cat;
            _cnode.NodeType = 'cat';
            currentList.push(_cnode);
          }
          if (_cnode.Children == null) _cnode.Children = [];
          currentList = _cnode.Children;
          currentNode = _cnode;
        }

        var catList = currentList;
        var type = map.type;
        if (type != null && type != '') {
          var _cnode = currentList?.find(x => x.Name == type);
          if (_cnode == null) {
            _cnode = new InvStructNode();
            _cnode.Name = type;
            _cnode.NodeType = 'type';
            currentList.push(_cnode);
          }
          if (_cnode.Children == null) _cnode.Children = [];
          currentList = _cnode.Children;
          currentNode = _cnode;
        }
        if (catList == currentList && currentNode != null) {
          //没有添加在类型列表中
          currentNode.Children = currentList.sort((a, b) => {
            if (a.NodeType == b.NodeType) return 0;
            else if (a.NodeType == 'cat') return 1;
            else if (a.NodeType == 'type' && b.NodeType == 'item') return 1;
            else return -1;
          });
        }

        var itemNode = new InvStructNode();
        itemNode.Name = map.desc;
        itemNode.Constructor = map.value;
        itemNode.NodeType = 'item';
        currentList.push(itemNode);
      }
    }

    return result;
  }
}
