// @flow

import { createLogic } from 'redux-logic';

import { LOAD_HISTORY, historyLoaded } from './questionHistoryActions';
import { getUsedQuestionCount, getUsedQuestionList } from '../../_modules/db/dbQueries';
import { numPages } from '../../utils/helperFuncs';


const loadQuestionsLogic = createLogic({
  type: LOAD_HISTORY,
  process: async ({ action, getState }, dispatch, done) => {
    const targetPage = action.payload.page;
    const recordCount = await getUsedQuestionCount();
    const maxPage = numPages(recordCount);
    const page = Math.min(targetPage, maxPage);

    const { sortBy, sortOrder, includeCancelled, questionSearch } = action.payload;

    const loadedHistory = await getUsedQuestionList(
      sortBy, sortOrder, includeCancelled, questionSearch, page
    );

    dispatch(historyLoaded(recordCount, page, loadedHistory));
    done();
  }
});

export default [
  loadQuestionsLogic
]
