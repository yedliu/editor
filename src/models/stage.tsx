import { CoursewareDtail } from '../modelClasses/courseware';
import HttpService from '../server/httpServer';
import CWSubstance from '@/modelClasses/courseDetail/cwSubstance';
import CWPage from '@/modelClasses/courseDetail/cwpage';
import { plainToClass, deserializeArray } from '@/class-transformer';

export default {
  namespace: 'stage',
  state: {
    currentPage: null as CWPage,
  },

  effects: {},

  reducers: {
    setCurrentPage(state, action) {
      return Object.assign({}, state, { currentPage: action.payload.page });
    },
    doUpdateState(state, action) {
      return Object.assign({}, state);
    },
  },
};
