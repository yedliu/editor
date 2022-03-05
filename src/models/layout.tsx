import FlexLayout, { Model } from 'flexlayout-react';
import { Model as FlexLayout_Model } from 'flexlayout-react';

export const windowNames = {
  PAGE_WINDOW: 'pageWindow',
  ELE_WINDOW: 'elementWindow',
  PROP_WINDOW: 'propWindow',
  RES_WINDOW: 'resWindow',
};

export const helpLineNames = {
  HL_RULER: 'ruler',
  HL_GRID: 'grid',
  HL_SAFEZONE: 'safezone',
};

export interface LayoutCfg {
  isShowPages: boolean;
  isShowProps: boolean;
  isShowElements: boolean;
  isShowRes: boolean;
  isShowRuler: boolean;
  isShowGrid: boolean;
  isShowSafeZone: boolean;
  flexLayoutModel: FlexLayout_Model;
}

//界面布局
let layoutjson = {
  global: {
    tabEnableClose: false,
    splitterSize: 6,
    tabEnableRename: false,
    tabSetEnableMaximize: false,
    tabSetTabStripHeight: 25,
  },
  borders: [
    {
      type: 'border',
      location: 'left',
      size: 220,
      children: [],
    },
    {
      type: 'border',
      location: 'right',
      size: 220,
      children: [],
    },
  ],
  layout: {
    type: 'row',
    weight: 90,
    children: [
      {
        type: 'tabset',
        weight: 15,
        selected: 0,
        children: [
          {
            type: 'tab',
            name: '页面',
            component: 'pageList',
          },
        ],
      },
      {
        type: 'tabset',
        weight: 15,
        selected: 0,
        children: [
          {
            type: 'tab',
            name: '元素',
            component: 'elements',
          },
        ],
      },
      {
        type: 'tabset',
        weight: 80,
        selected: 0,
        enableDrop: false,
        tabStripHeight: 25,
        children: [
          {
            type: 'tab',
            // enableDrag: false,
            name: '设计',
            component: 'stage',
          },
          {
            type: 'tab',
            // enableDrag: false,
            name: '逻辑',
            component: 'logic',
          },
        ],
      },
      {
        type: 'row',
        weight: 15,
        selected: 0,
        children: [
          {
            type: 'tabset',
            weight: 100,
            children: [
              {
                type: 'tab',
                name: '属性',
                component: 'property',
              },
            ],
          },
          {
            type: 'tabset',
            weight: 100,
            children: [
              // {
              //   type: 'tab',
              //   name: 'test',
              //   component: 'test',
              // },
              {
                type: 'tab',
                name: '资源',
                component: 'resource',
              },
            ],
          },
        ],
      },
    ],
  },
};

let _flexLayoutModel = FlexLayout.Model.fromJson(layoutjson);

export default {
  namespace: 'layout',
  state: {
    isShowPages: true,
    isShowProps: true,
    isShowElements: true,
    isShowRes: true,
    isShowRuler: true,
    isShowGrid: false,
    isShowSafeZone: true,
    flexLayoutModel: _flexLayoutModel,
  } as LayoutCfg,
  reducers: {
    hideShowLayout(state: any, action: any) {
      switch (action.payload.layoutPart) {
        case windowNames.PAGE_WINDOW:
          return Object.assign({}, state, { isShowPages: !state.isShowPages });
        case windowNames.ELE_WINDOW:
          return Object.assign({}, state, {
            isShowElements: !state.isShowElements,
          });
        case windowNames.PROP_WINDOW:
          return Object.assign({}, state, { isShowProps: !state.isShowProps });
        case windowNames.RES_WINDOW:
          return Object.assign({}, state, { isShowRes: !state.isShowRes });
        case helpLineNames.HL_GRID:
          return Object.assign({}, state, { isShowGrid: !state.isShowGrid });
        case helpLineNames.HL_RULER:
          return Object.assign({}, state, { isShowRuler: !state.isShowRuler });
        case helpLineNames.HL_SAFEZONE:
          return Object.assign({}, state, {
            isShowSafeZone: !state.isShowSafeZone,
          });
      }
    },
  },
};
