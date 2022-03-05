import HttpService from '../server/httpServer';
import { from } from 'linq-to-typescript';
import { CWResourceTypes } from '../modelClasses/courseDetail/courseDetailenum';
import CWResource from '@/modelClasses/courseDetail/cwResource';
import TypeMapHelper from '@/configs/typeMapHelper';
const pageSize = 20;

enum SearchType {
  exact = 0,
  similar = 1,
}

export interface DicStructNode {
  id: number;
  title: string;
  voList: Array<DicStructNode>;
}

export function removeEmptyVoList(node: DicStructNode | any) {
  if (node) {
    if (node.voList != null && node.voList.length == 0) node.voList = null;
    else if (node.voList != null) {
      node.voList.forEach(subnode => removeEmptyVoList(subnode));
    }
  }
}

export default {
  namespace: 'designres',
  state: {},
  effects: {
    *fetchResCascade(action, { call, put }) {
      let cascadeData = yield call(HttpService.fetchResDics);
      if (cascadeData) {
        yield put({
          type: 'setResCascadeDicStruct',
          payload: cascadeData,
        });
      }
    },
    *fetchDicTypeMap(action, { call, put }) {
      let dicTypeMap = yield call(HttpService.fetchResDicTypeMap);
      if (dicTypeMap) {
        yield put({
          type: 'setDicTypeMap',
          payload: dicTypeMap,
        });
      }
    },

    *initResCascadeStruct(action, { call, put }) {
      let dicTypeMap = yield call(HttpService.fetchResDicTypeMap);
      if (dicTypeMap) {
        yield put({
          type: 'setDicTypeMap',
          payload: dicTypeMap,
        });
      }
      let cascadeData = yield call(HttpService.fetchResDics);
      if (cascadeData) {
        cascadeData.forEach(x => removeEmptyVoList(x));
        yield put({
          type: 'setResCascadeDicStruct',
          payload: cascadeData,
        });
      }
      if (dicTypeMap && cascadeData) {
        yield put({ type: 'setKeywords', payload: '' });
        yield put({
          type: 'searchByResTypeChange',
          payload: CWResourceTypes.Image,
        });
      }
    },

    *searchRes(action, { call, put, select }) {
      const state = yield select(state => state.designres);
      let queryInfo = {
        pageNo: state.pageIndex + 1,
        pageSize: pageSize,
        resourceType:
          state.currentResType == CWResourceTypes.All
            ? null
            : state.currentResType,
        directoryId: state.currentDirId,
        field: 'updateTime',
        sort: 'desc',
        resourceName: state.keywords,
        searchType: SearchType.similar,
        tencentSubTitle: state.tencentSubTitle ? 1 : null,
      };
      let queryResult = null;
      if (queryInfo.resourceType == CWResourceTypes.ComplexControl) {
        let cwResouceList: Array<CWResource> = new Array<CWResource>();
        TypeMapHelper.ElementTypeDiscriminator.subTypes.map(subType => {
          if (subType.thumb) {
            let cwResource = {
              resourceId: subType.name.toString(),
              resourceKey: subType.thumb,
              resourceName: subType.title,
              resourceType: CWResourceTypes.ComplexControl,
              width: subType.width,
              height: subType.height,
            };
            cwResouceList.push(cwResource as CWResource);
          }
        });
        var start = pageSize * state.pageIndex;
        var end = cwResouceList.length - start;
        queryResult = {
          total: TypeMapHelper.ElementTypeDiscriminator.subTypes.filter(
            x => x.thumb,
          ).length,
          list: cwResouceList.slice(
            start,
            start + (end < pageSize ? end : pageSize),
          ),
        };
      } else queryResult = yield call(HttpService.queryResPage, queryInfo);
      yield put({
        type: 'setItemTotalCount',
        payload: queryResult?.total || 0,
      });
      yield put({ type: 'setResList', payload: queryResult?.list || [] });
    },
    *searchByResTypeChange(action, { call, put }) {
      yield put({
        type: 'selectResType',
        payload: action.payload,
        tencentSubTitle: action.tencentSubTitle,
      });
      yield put({ type: 'searchRes' });
    },

    *searchByKeywordsChange(action, { call, put }) {
      yield put({
        type: 'setKeywords',
        payload: action.payload,
        tencentSubTitle: action.tencentSubTitle,
      });
      yield put({ type: 'searchRes' });
    },
    *searchByDirPathChange(action, { call, put }) {
      yield put({
        type: 'setResDicPath',
        payload: action.payload,
        tencentSubTitle: action.tencentSubTitle,
      });
      yield put({ type: 'searchRes' });
    },
    *searchByPageIndexChange(action, { call, put }) {
      yield put({ type: 'setPageIndex', payload: action.payload });
      yield put({ type: 'searchRes' });
    },
  },

  reducers: {
    setDicTypeMap(state, action) {
      return Object.assign({}, state, { dicTypeMap: action.payload });
    },
    setResCascadeDicStruct(state, action) {
      return Object.assign({}, state, { cascadeDic: action.payload });
    },
    selectResType(state, action) {
      let selectedType = action.payload;
      let dicTypeMap = state.dicTypeMap;
      if (selectedType == null || dicTypeMap == null)
        return Object.assign({}, state);
      let currentCascadeDicRootId = dicTypeMap?.find(
        map => map.type == selectedType,
      )?.directoryId;
      let currentCascadeDicRoot = state?.cascadeDic?.find(
        dic => dic.id == currentCascadeDicRootId,
      );
      if (
        currentCascadeDicRoot &&
        currentCascadeDicRoot.voList &&
        currentCascadeDicRoot.voList[0].id != currentCascadeDicRoot.id
      ) {
        currentCascadeDicRoot.voList = [
          { id: currentCascadeDicRoot.id, title: '全部' },
          ...currentCascadeDicRoot.voList,
        ];
      }
      return Object.assign({}, state, {
        currentResType: selectedType,
        currentCascadeDicRoot: currentCascadeDicRoot,
        currentDirId: currentCascadeDicRoot?.id,
        currentDirPath: [currentCascadeDicRoot?.id],
        pageIndex: 0,
        tencentSubTitle: action.tencentSubTitle,
      });
    },
    setResDicPath(state, action) {
      let dirPath = action.payload;
      return Object.assign({}, state, {
        currentDirPath: dirPath,
        currentDirId: dirPath[dirPath.length - 1],
        pageIndex: 0,
        tencentSubTitle: action.tencentSubTitle,
      });
    },
    setKeywords(state, action) {
      return Object.assign({}, state, {
        keywords: action.payload,
      });
    },
    setPageIndex(state, action) {
      return Object.assign({}, state, {
        pageIndex: action.payload,
      });
    },
    setPageCount(state, action) {
      return Object.assign({}, state, {
        pageCount: action.payload,
      });
    },
    setItemTotalCount(state, action) {
      return Object.assign({}, state, {
        itemTotalCount: action.payload,
      });
    },
    setResList(state, action) {
      return Object.assign({}, state, {
        ResList: action.payload,
      });
    },
  },
};
