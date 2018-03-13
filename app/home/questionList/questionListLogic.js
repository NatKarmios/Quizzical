// @flow
import { createLogic } from 'redux-logic';

import { notify, numPages } from '../../utils/helperFuncs';

import { getQuestionCount, getQuestionList, insertQuestion } from '../../_modules/db/dbQueries';
import { addExternalQuestions } from '../../_modules/externalQuestions';

import { ADD_QUESTION, LOAD_QUESTIONS, IMPORT_QUESTIONS, questionsLoaded, loadQuestions } from './questionListActions';


const IMPORT_QUESTIONS_MAX_RETRIES = 5;


const loadQuestionsLogic = createLogic({
  type: LOAD_QUESTIONS,
  process: async ({ action }, dispatch, done) => {
    const targetPage = action.payload.page;
    const questionCount = await getQuestionCount();
    const maxPage = numPages(questionCount);
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
      notify('Question saved successfully.', 'success');
    } catch (e) {
      notify('Failed to add question - it may already exist!', 'error');
      console.error('Failed to insert to SQLite DB!', e);
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

    let triesLeft = IMPORT_QUESTIONS_MAX_RETRIES;
    let leftToAdd = amount;
    while (triesLeft > 0 && leftToAdd > 0) {
      if (triesLeft === IMPORT_QUESTIONS_MAX_RETRIES) {
        notify(`Importing ${leftToAdd} question${leftToAdd === 1 ? '' : 's'}...`);
      }

      // eslint-disable-next-line no-await-in-loop
      leftToAdd = await addExternalQuestions(leftToAdd, difficulty);
      triesLeft -= 1;
    }

    const added = amount - leftToAdd;
    if (leftToAdd === 0) {
      notify(
        `Successfully imported ${added} question${added === 1 ? '' : 's'}`,
        'success'
      );
    } else if (added === 0) {
      notify(
        'Failed to import any questions.',
        'error'
      );
    } else {
      notify(
        `${added} question${leftToAdd === 1 ? '' : 's'} imported successfully; ${leftToAdd} couldn't be imported.`,
        'warning'
      );
    }

    dispatch(loadQuestions(getState().questionList.currentPage));
    done();
  }
});

export default [
  loadQuestionsLogic,
  addQuestionLogic,
  importQuestionsLogic
];
