// @flow
import { createLogic } from 'redux-logic';

import { getQuestionCount, getQuestionList, insertQuestion } from '../../_modules/db/dbQueries';

import { ADD_QUESTION, LOAD_QUESTIONS, IMPORT_QUESTIONS, questionsLoaded, loadQuestions } from './questionListActions';
import {addExternalQuestions} from "../../_modules/externalQuestions";

const loadQuestionsLogic = createLogic({
  type: LOAD_QUESTIONS,
  process: async ({ action }, dispatch, done) => {
    const targetPage = action.payload['page'];
    const questionCount = await getQuestionCount();
    const maxPage = Math.floor(Math.max(questionCount-1, 0)/10);
    const page = Math.min(targetPage, maxPage);
    const loadedQuestions = await getQuestionList(page);

    dispatch(questionsLoaded(questionCount, page, loadedQuestions));
    done();
  }
});

const addQuestionLogic = createLogic({
  type: ADD_QUESTION,
  process: async ({ action, getState }, dispatch, done) => {
    const { payload } = action;
    const { question, answer, incorrectAnswers } = payload;
    try {
      await insertQuestion(question, answer, incorrectAnswers, false);
    } catch (e) {
      console.error("Failed to insert to SQLite DB!", e);
    }
    dispatch(loadQuestions(getState().questionList.currentPage));
    done();
  }
});

const importQuestionsLogic = createLogic({
  type: IMPORT_QUESTIONS,
  process: async ({ action, getState }, dispatch, done) => {
    const { payload } = action;
    const { amount, difficulty } = payload;
    await addExternalQuestions(amount, difficulty);
    dispatch(loadQuestions(getState().questionList.currentPage));
    done();
  }
});

export default [
  loadQuestionsLogic,
  addQuestionLogic,
  importQuestionsLogic
];
