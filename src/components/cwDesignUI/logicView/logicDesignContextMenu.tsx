import { PureComponent } from 'react';
import LogicDesign from '@/modelClasses/courseDetail/logicDesign';
import { Menu, Button, Popover } from 'antd';
import React from 'react';
import InvokeTriggerBase from '@/modelClasses/courseDetail/triggers/invokeTriggerBase';

const LogicDesignContextMenu = ({ item: _item, isShowDir: _isShowDir }) => {
  var item = _item;
  var logicDesign =
    item?.LogicDesign.Scene?.Courseware.SelectedPage?.LogicDesign;
  var isShowDir = _isShowDir;

  if (
    logicDesign.SelectedLogicDItems.length > 0 &&
    item.IsSelectedInDesign &&
    isShowDir
  ) {
    return (
      <Menu>
        {item && !(item instanceof InvokeTriggerBase) ? (
          <Menu.Item onClick={() => logicDesign.CombineInvs()}>
            合成函数
          </Menu.Item>
        ) : null}

        {item && !(item instanceof InvokeTriggerBase) ? (
          <Menu.Item onClick={() => logicDesign.CopySelectedLDItems()}>
            复制
          </Menu.Item>
        ) : null}

        <Menu.Item onClick={() => logicDesign.DeleteLogicDItem()}>
          删除
        </Menu.Item>
      </Menu>
    );
  } else {
    return <Menu></Menu>;
  }
};
export default LogicDesignContextMenu;
