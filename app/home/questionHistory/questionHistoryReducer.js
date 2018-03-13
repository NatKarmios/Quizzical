// @flow

import type { ActionType, UsedQuestionType } from '../../utils/types';

import {
  CHANGE_SORT_BY, CHANGE_SORT_ORDER, CHANGE_INCLUDE_CANCELLED, CHANGE_QUESTION_SEARCH,
  LOAD_HISTORY, HISTORY_LOADED
} from './questionHistoryActions';


type QuestionHistoryState = {
  sortBy: string,
  sortOrder: string,
  includeCancelled: boolean,
  questionSearch: string,
  prevSortBy: string,
  prevSortOrder: string,
  prevIncludeCancelled: boolean,
  prevQuestionSearch: string,
  loadedHistory: ?Array<UsedQuestionType>,
  recordCount: number,
  page: number,
  loading: boolean,
  initialLoad: boolean,
}


const defaultState = {
  sortBy: 'finishTime',
  sortOrder: 'DESC',
  includeCancelled: true,
  questionSearch: '',
  prevSortBy: 'finishTime',
  prevSortOrder: 'DESC',
  prevIncludeCancelled: true,
  prevQuestionSearch: '',
  loadedHistory: [],
  recordCount: 0,
  page: 0,
  loading: false,
  initialLoad: false
}


const questionHistory = (state: QuestionHistoryState = defaultState, action: ActionType) => {
  switch (action.type) {
    case CHANGE_SORT_BY:
      if (
        action.payload !== undefined && action.payload !== null
          && typeof action.payload === 'object'
        && action.payload.sortBy !== undefined && action.payload.sortBy !== null
          && typeof action.payload.sortBy === 'string'
      ) {
        return { ...state, sortBy: action.payload.sortBy };
      }
      break;
    case CHANGE_SORT_ORDER:
      if (
        action.payload !== undefined && action.payload !== null
        && typeof action.payload === 'object'
        && action.payload.sortOrder !== undefined && action.payload.sortOrder !== null
        && typeof action.payload.sortOrder === 'string'
      ) {
        return { ...state, sortOrder: action.payload.sortOrder };
      }
      break;
    case CHANGE_INCLUDE_CANCELLED:
      if (
        action.payload !== undefined && action.payload !== null
        && typeof action.payload === 'object'
        && action.payload.includeCancelled !== undefined && action.payload.includeCancelled !== null
        && typeof action.payload.includeCancelled === 'boolean'
      ) {
        return { ...state, includeCancelled: action.payload.includeCancelled };
      }
      break;
    case CHANGE_QUESTION_SEARCH:
      if (
        action.payload !== undefined && action.payload !== null
        && typeof action.payload === 'object'
        && action.payload.questionSearch !== undefined && action.payload.questionSearch !== null
        && typeof action.payload.questionSearch === 'string'
      ) {
        return { ...state, questionSearch: action.payload.questionSearch };
      }
      break;
    case LOAD_HISTORY:
      if (
        action.payload !== undefined && action.payload !== null
          && typeof action.payload === 'object'
      ) {
        return {
          ...state,
          loading: true,
          prevSortBy: action.payload.sortBy,
          prevSortOrder: action.payload.sortOrder,
          prevIncludeCancelled: action.payload.includeCancelled,
          prevQuestionSearch: action.payload.questionSearch
        }
      }
    case HISTORY_LOADED:
      if (
        action.payload !== undefined && action.payload !== null
          && typeof action.payload === 'object'
        && action.payload.loadedHistory !== undefined && action.payload.loadedHistory !== null
          && action.payload.loadedHistory.constructor === Array
        && action.payload.recordCount !== undefined && action.payload.recordCount !== null
          && typeof action.payload.recordCount === 'number'
        && action.payload.page !== undefined && action.payload.page !== null
          && typeof action.payload.page === 'number'
      ) {
        return {
          ...state,
          loadedHistory: action.payload.loadedHistory,
          recordCount: action.payload.recordCount,
          page: action.payload.page,
          loading: false,
          initialLoad: true
        };
      }
    default:
      return state;
  }
};


export default questionHistory;
