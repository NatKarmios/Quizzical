// @flow
import { createLogic } from 'redux-logic';

import { deleteQuestionByID } from '../../_modules/db/dbQueries';
import { loadQuestions } from '../questionList/questionListActions';
import { DELETE_QUESTION } from './questionDisplayActions';

const deleteQuestionLogic = createLogic({
  type: DELETE_QUESTION,
  process: async ({ action, getState }, dispatch, done) => {
    const questionID = action.payload.id;
    const state = getState();

    await deleteQuestionByID(questionID);
    dispatch(loadQuestions(state.questionList.currentPage));
    done();
  }
});

export default [
  deleteQuestionLogic
];
