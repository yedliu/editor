import { PureComponent } from 'react';
import LogicDesign from '@/modelClasses/courseDetail/logicDesign';
import { Menu, Button, Popover } from 'antd';
import React from 'react';
import { LeftAlignIcon, TopAlignIcon } from '@/svgs/designIcons';
import MenuItem from 'antd/lib/menu/MenuItem';
import { InvStructNode } from '@/modelClasses/courseDetail/InvokeDesign/invStructTree';
import styled from 'styled-components';

export const renderInvStructNode = (
  logicDesign: LogicDesign,
  node: InvStructNode,
  fatherList: InvStructNode[],
  counter: number[],
  dragtoAdd: boolean = false,
  dragEndCallback: () => void = null,
) => {
  var result: JSX.Element | JSX.Element[] = null;
  switch (node.NodeType) {
    case 'cat':
      result = (
        <Menu.SubMenu
          key={counter[0]++}
          icon={
            <div
              style={{
                height: '22px', // position: 'relative',
                width: '16px',
                display: '-webkit-box',
                WebkitBoxAlign: 'center',
                marginRight: '3px',
                float: 'left',
                WebkitBoxPack: 'start',
              }}
            >
              <div style={{ width: '16px', height: '16px' }}>
                {InvStructNode.GetNodeIcon(node.Name)}
              </div>
            </div>
          }
          title={<label>{node.Name}</label>}
          popupOffset={[-3, -3]}
        >
          {node.Children?.map((subNode, i) => {
            return renderInvStructNode(
              logicDesign,
              subNode,
              node.Children,
              counter,
              dragtoAdd,
              dragEndCallback,
            );
          })}
        </Menu.SubMenu>
      );
      break;
    case 'type':
      result = [
        <Menu.ItemGroup
          key={counter[0]++}
          title={
            <div
              style={{
                display: '-webkit-box',
                WebkitBoxOrient: 'horizontal',
                WebkitBoxPack: 'start',
                WebkitBoxAlign: 'center',
                color: '#889888',
                fontSize: '12px',
              }}
            >
              <svg width="10" height="10" style={{ marginRight: '5px' }}>
                <circle fill="#77977F9F" cx="5" cy="5" r="4"></circle>
              </svg>
              <label>{node.Name}</label>
            </div>
          }
        >
          {node.Children?.map((subNode, j) => {
            return renderInvStructNode(
              logicDesign,
              subNode,
              node.Children,
              counter,
              dragtoAdd,
              dragEndCallback,
            );
          })}
        </Menu.ItemGroup>,
        fatherList != null &&
        fatherList.indexOf(node) < fatherList.length - 1 ? (
          <Menu.Divider key={counter[0]++} />
        ) : null,
      ];
      break;
    case 'item':
      result = (
        <Menu.Item
          key={counter[0]++}
          //icon={InvStructNode.GetNodeIcon(node.Name)}
          onClick={
            dragtoAdd
              ? null
              : () => {
                  logicDesign.AddNewInv(node.Constructor);
                }
          }
          draggable={dragtoAdd}
          onMouseDown={
            dragtoAdd
              ? e => {
                  logicDesign.StartDragInv(
                    e,
                    node.Constructor,
                    dragEndCallback,
                  );
                }
              : null
          }
        >
          <label>{node.Name}</label>
        </Menu.Item>
      );
      break;
    default:
      break;
  }
  return result;
};

const AddInvItemMenu = (props: { logicDesign: LogicDesign }) => {
  var logicDesign = props.logicDesign;
  var hasMultiSelectedLogicDItems =
    (logicDesign.SelectedLogicDItems?.length || 0) > 1;
  var counter = [0];
  return (
    <Menu
      style={{
        WebkitUserSelect: 'none',
      }}
      onClick={() => (logicDesign.IsShowInvAddMenu = false)}
    >
      <Menu.Item
        style={{
          color: '#CCCCCC',
          width: '140px',
          pointerEvents: 'none',
        }}
      >
        添加可执行组件
      </Menu.Item>

      {logicDesign.InvCreateTreeMap?.map((node, i) => {
        return renderInvStructNode(
          logicDesign,
          node,
          logicDesign.InvCreateTreeMap,
          counter,
        );
      })}

      {!logicDesign.LinkingInvHandler
        ? [
            <Menu.Divider key={1001} />,
            <Menu.Item
              key={1002}
              // style={
              //   !logicDesign.CopyedInvs
              //     ? {
              //         color: '#CCCCCC',
              //         pointerEvents: 'none',
              //       }
              //     : {}
              // }
              onClick={() => {
                logicDesign.PasteLDItems();
              }}
            >
              {'粘贴'}
            </Menu.Item>,
            <Menu.Divider key={1003} />,
            <Menu.Item
              key={1004}
              style={{
                color: '#CCCCCC',
                width: '120px',
                pointerEvents: 'none',
              }}
            >
              组件对齐方式
            </Menu.Item>,
            <Menu.Item
              key={1006}
              style={{
                width: '120px',
                pointerEvents: 'none',
                cursor: 'auto',
              }}
            >
              <div
                style={{
                  ...(hasMultiSelectedLogicDItems
                    ? {
                        pointerEvents: 'auto',
                      }
                    : {}),
                  ...{
                    display: '-webkit-box',
                    WebkitBoxOrient: 'horizontal',
                  },
                }}
              >
                <div
                  style={{
                    width: '18px',
                    height: '18px',
                    margin: '0px 10px 0px 5px',
                    cursor: 'pointer',
                  }}
                  onClick={() => logicDesign.LogicItemAlign('LeftAlign')}
                >
                  {LeftAlignIcon(
                    hasMultiSelectedLogicDItems ? '#888888' : '#BBBBBB',
                  )}
                </div>

                <div
                  style={{
                    width: '18px',
                    height: '18px',
                    margin: '0px 10px 0px 10px',
                    cursor: 'pointer',
                  }}
                  onClick={() => logicDesign.LogicItemAlign('TopAlign')}
                >
                  {TopAlignIcon(
                    hasMultiSelectedLogicDItems ? '#888888' : '#BBBBBB',
                  )}
                </div>
              </div>
            </Menu.Item>,
          ]
        : null}
    </Menu>
  );
};

export default AddInvItemMenu;
