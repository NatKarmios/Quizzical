// @flow
import { createLogic } from 'redux-logic';

import { getQuestionCount, getQuestionList } from '../../_modules/db/dbQueries';

import { LOAD_QUESTIONS, questionsLoaded } from './questionListActions';

const loadQuestionsLogic = createLogic({
  type: LOAD_QUESTIONS,
  process: async ({ action }, dispatch, done) => {
    const targetPage = action.payload['page'];
    const questionCount = await getQuestionCount();
    const maxPage = Math.floor(Math.max(questionCount, 1)/10);
    const page = Math.min(targetPage, maxPage);
    const loadedQuestions = await getQuestionList(page);

    dispatch(questionsLoaded(questionCount, page, loadedQuestions));
    done();
  }
});

export default [
  loadQuestionsLogic
];
