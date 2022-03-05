import HttpService from '../server/httpServer';

export interface UserInfo {
  userId: string;
}

export default {
  namespace: 'loginInfo',
  state: {
    userId: '',
  } as UserInfo,

  effects: {
    *getLoginInfo(action, { call, put }) {
      let data = yield call(HttpService.getLogInfo);
      yield put({
        type: 'LoginInfoQuerySucess',
        payload: data,
      });
    },
  },

  reducers: {
    LoginInfoQuerySucess(state, action) {
      return Object.assign({}, state, { userId: action.payload });
    },
  },
};
