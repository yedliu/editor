import CWSubstance from '@/modelClasses/courseDetail/cwSubstance';
import CWElement from '@/modelClasses/courseDetail/cwElement';
import { Menu } from 'antd';
import React from 'react';
import MenuItem from 'antd/lib/menu/MenuItem';

const ElementContextMenu = ({
  courseware: _courseware,
  targetElement: _item,
}) => {
  if (!_courseware || !_item) return <Menu></Menu>;
  var courseware = _courseware as CWSubstance;
  var commander = courseware.Commander;
  var scene = courseware.SelectedPage;
  var item = _item as CWElement;
  if (scene) {
    return (
      <Menu
        onClick={({ key }) => {
          commander.FocusRootUI();
        }}
      >
        <Menu.Item
          style={
            !commander.SelectedItems
              ? {
                  pointerEvents: 'none',
                  color: '#CCCCCC',
                }
              : {}
          }
          onClick={() => commander.CutItems()}
        >
          剪切
        </Menu.Item>
        <Menu.Item
          style={
            !commander.SelectedItems
              ? {
                  pointerEvents: 'none',
                  color: '#CCCCCC',
                }
              : {}
          }
          onClick={() => commander.ExportToElementsBox()}
        >
          复制
        </Menu.Item>
        <Menu.Item
          // style={
          //   !commander.ItemsCopyboard
          //     ? {
          //         pointerEvents: 'none',
          //         color: '#CCCCCC',
          //       }
          //     : {}
          // }
          onClick={() => commander.PasteItems()}
        >
          粘贴
        </Menu.Item>
        <Menu.Item
          // style={
          //   !commander.ItemsCopyboard
          //     ? {
          //         pointerEvents: 'none',
          //         color: '#CCCCCC',
          //       }
          //     : {}
          // }
          onClick={() => {
            commander.ImportElementsBox(
              commander.SelectedPage,
              // commander.ItemsCopyboard,
            );
          }}
        >
          带逻辑粘贴
        </Menu.Item>
        <Menu.Item
          style={
            !commander.SelectedItems
              ? {
                  pointerEvents: 'none',
                  color: '#CCCCCC',
                }
              : {}
          }
          onClick={() => commander.DeleteSelectedItem()}
        >
          删除
        </Menu.Item>
        <Menu.Item
          style={
            !commander.SelectedItems
              ? {
                  pointerEvents: 'none',
                  color: '#CCCCCC',
                }
              : {}
          }
          onClick={() => commander.DeleteSelectedItemsAndLogic()}
        >
          删除元素逻辑
        </Menu.Item>
        <Menu.Divider />
        {scene.HasSelectedItemLocked ? (
          <Menu.Item onClick={() => commander.LockItems(false)}>解锁</Menu.Item>
        ) : null}
        {scene.HasSelectedItemUnlocked ? (
          <Menu.Item onClick={() => commander.LockItems(true)}>锁定</Menu.Item>
        ) : null}
        {scene.HasSelectedItemUnhided ? (
          <Menu.Item onClick={() => commander.HideItems(true)}>隐藏</Menu.Item>
        ) : null}
        {scene.HasSelectedItemHided ? (
          <Menu.Item onClick={() => commander.HideItems(false)}>显示</Menu.Item>
        ) : null}
        {scene.HasSelectedItemNotSolidified ? (
          <Menu.Item onClick={() => commander.SolidifyItems(true)}>
            固化
          </Menu.Item>
        ) : null}
        {scene.HasSelectedItemSolidified ? (
          <Menu.Item onClick={() => commander.SolidifyItems(false)}>
            解除固化
          </Menu.Item>
        ) : null}
        {item ? <Menu.Item>重命名</Menu.Item> : null}
        <Menu.Divider />
        <Menu.Item onClick={() => commander.MoveItemsLayer('top')}>
          置顶
        </Menu.Item>
        <Menu.Item onClick={() => commander.MoveItemsLayer('bottom')}>
          置底
        </Menu.Item>
        <Menu.Item onClick={() => commander.MoveItemsLayer('up')}>
          上移一层
        </Menu.Item>
        <Menu.Item onClick={() => commander.MoveItemsLayer('down')}>
          下移一层
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item onClick={() => commander.ExpandAllItems(true)}>
          展开全部
        </Menu.Item>
        <Menu.Item onClick={() => commander.ExpandAllItems(false)}>
          收起全部
        </Menu.Item>
      </Menu>
    );
  }
  return <Menu></Menu>;
};
export default ElementContextMenu;
