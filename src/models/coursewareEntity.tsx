import { CoursewareDtail } from '../modelClasses/courseware';
import HttpService from '../server/httpServer';
import CWSubstance from '@/modelClasses/courseDetail/cwSubstance';
import CWPage from '@/modelClasses/courseDetail/cwpage';
import { plainToClass, deserializeArray } from '@/class-transformer';
import CWElement from '@/modelClasses/courseDetail/cwElement';
import TypeMapHelper from '@/configs/typeMapHelper';

export default {
  namespace: 'coursewareEntity',
  state: {
    courseware: new CoursewareDtail(),
    cwSubstance: new CWSubstance(),
  },

  effects: {
    *getCouresWareDetail(action, { call, put }) {
      let data: CoursewareDtail = yield call(
        HttpService.getCouresWareDetail,
        action.payload.cwId,
      );
      let cwSubstance = new CWSubstance();
      if (data && data.coursewareContent) {
        cwSubstance.Pages = deserializeArray(CWPage, data.coursewareContent, {
          typeMaps: TypeMapHelper.CommonTypeMap,
        });
        cwSubstance.Library = data.gameResourceList;
        cwSubstance.Pages?.forEach(x =>
          x.InitDetailsContent(cwSubstance.Library),
        );
        if (cwSubstance.Pages == null || cwSubstance.Pages.length == 0) {
          cwSubstance.Pages = [new CWPage()];
        }
        cwSubstance.SelectedPage = cwSubstance.Pages[0];
      }

      yield put({
        type: 'CouresWareDetailQuerySucess',
        payload: {
          courseware: data,
          cwSubstance: cwSubstance,
        },
      });
    },
    *SelectPage(action, { call, put }) {
      yield put({
        type: 'doSelectPage',
        payload: action.payload,
      });
      yield put({
        type: 'stage/setCurrentPage',
        payload: action.payload,
      });
    },
  },

  reducers: {
    CouresWareDetailQuerySucess(state, action) {
      return Object.assign({}, state, {
        courseware: action.payload.courseware,
        cwSubstance: action.payload.cwSubstance,
      });
    },
    setStageScale(state, action) {
      return Object.assign({}, state, {
        cwSubstance: {
          stageScale: action.payload / 100.0,
        },
      });
    },
    doSelectPage(state, action) {
      var page = action.payload;
      var courseware = state.cwSubstance as CWSubstance;
      if (courseware != null) {
        courseware.SelectedPage = page;
      }
      return Object.assign({}, state);
    },
    doUpdateState(state, action) {
      return Object.assign({}, state);
    },
  },
};
