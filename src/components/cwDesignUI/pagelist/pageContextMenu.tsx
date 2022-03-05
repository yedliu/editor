import CWSubstance from '@/modelClasses/courseDetail/cwSubstance';
import CWPage from '@/modelClasses/courseDetail/cwpage';
import React from 'react';
import { Menu, Dropdown } from 'antd';
const PageContextMenu = ({ courseware: _courseware, targetPage: _page }) => {
  if (!_courseware || !_page) return null;
  var courseware = _courseware as CWSubstance;
  var commander = courseware.Commander;
  var page = _page as CWPage;

  return (
    <Menu
      onClick={({ key }) => {
        commander.FocusRootUI();
      }}
    >
      <Menu.Item
        key="1"
        onClick={() => {
          commander.uploadCover();
        }}
      >
        设为封面
      </Menu.Item>
      <Menu.Item
        key="2"
        onClick={() => {
          commander.addNewPage();
        }}
      >
        新增页
      </Menu.Item>
      {/* <Menu.Item key="3">导入页模板</Menu.Item> */}
      <Menu.Item
        key="4"
        onClick={() => {
          commander.copyPages();
        }}
      >
        复制页
      </Menu.Item>
      <Menu.Item
        key="5"
        onClick={() => {
          commander.exportPages();
        }}
      >
        导出页到剪贴板
      </Menu.Item>
      <Menu.Item
        key="5.5"
        onClick={() => {
          commander.importPages();
        }}
      >
        从剪贴板导入页
      </Menu.Item>
      <Menu.Item
        key="6"
        onClick={() => {
          commander.ClearPagesBg();
        }}
      >
        删除背景
      </Menu.Item>
      <Menu.Item
        key="7"
        onClick={() => {
          commander.delPageBGM();
        }}
      >
        删除页面音乐
      </Menu.Item>
      <Menu.Item
        key="8"
        onClick={() => {
          commander.delPageVideo();
        }}
      >
        删除页面视频
      </Menu.Item>
      <Menu.Item
        key="9"
        onClick={() => {
          commander.deletePage();
        }}
      >
        删除页面
      </Menu.Item>
    </Menu>
  );
};
export default PageContextMenu;
