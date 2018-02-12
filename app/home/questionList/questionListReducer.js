// @flow

import type { QuestionType } from '../../_modules/db/dbQueries';

import { ADD_QUESTION, IMPORT_QUESTIONS, LOAD_QUESTIONS, QUESTIONS_LOADED } from './questionListActions';

export type QuestionListStateType = {
  initialLoad: boolean,
  loading: boolean,
  questionCount: number,
  currentPage: number,
  loadedQuestions: Array<QuestionType>
}

const defaultState = {
  initialLoad: false,
  loading: false,
  questionCount: 0,
  currentPage: 0,
  loadedQuestions: []
};

export default function questionList(
  state = defaultState,
  { type, payload }
) {
  if ([ADD_QUESTION, LOAD_QUESTIONS, IMPORT_QUESTIONS].includes(type))
    return { ...state, loading: true };
  if (type === QUESTIONS_LOADED)
    return {
      initialLoad: true,
      loading: false,
      questionCount: payload['questionCount'],
      currentPage: payload['page'],
      loadedQuestions: payload['questions']
    };
  return state;
}
