// @flow

import type { QuestionType, ActionType } from '../../utils/types';

import {
  ADD_QUESTION, IMPORT_QUESTIONS, LOAD_QUESTIONS, QUESTIONS_LOADED
} from './questionListActions';

export type QuestionListState = {
  initialLoad: boolean,
  loading: boolean,
  questionCount: number,
  currentPage: number,
  loadedQuestions: Array<QuestionType>
};


const defaultState = {
  initialLoad: false,
  loading: false,
  questionCount: 0,
  currentPage: 0,
  loadedQuestions: []
};

export default function questionList(
  state: QuestionListState=defaultState,
  action: ActionType
) {
  if ([ADD_QUESTION, LOAD_QUESTIONS, IMPORT_QUESTIONS].includes(action.type)) {
    return { ...state, loading: true };
  }
  if (action.type === QUESTIONS_LOADED) {
    if (
      action.payload !== undefined && action.payload !== null && typeof action.payload === 'object'
      && action.payload.questionCount !== undefined && action.payload.questionCount !== null
      && action.payload.page !== undefined && action.payload.page !== null
      && action.payload.questions !== undefined && action.payload.questions !== null
    ) {
      return {
        initialLoad: true,
        loading: false,
        questionCount: action.payload.questionCount,
        currentPage: action.payload.page,
        loadedQuestions: action.payload.questions
      };
    }
  }
  return state;
}
