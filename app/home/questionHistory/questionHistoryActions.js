// @flow

import type { UsedQuestionType } from '../../utils/types';


export const CHANGE_SORT_BY = 'QUESTIONHISTORY_SORT_BY';
export const CHANGE_SORT_ORDER = 'QUESTIONHISTORY_SORT_ORDER';
export const CHANGE_INCLUDE_CANCELLED = 'QUESTIONHISTORY_INCLUDE_CANCELLED';
export const CHANGE_QUESTION_SEARCH = 'QUESTIONHISTORY_CHANGE_QUESTION_SEARCH';
export const LOAD_HISTORY = 'QUESTIONHISTORY_LOAD_HISTORY';
export const HISTORY_LOADED = 'QUESTIONHISTORY_HISTORY_LOADED';

export const changeSortBy = (sortBy: string) => ({
  type: CHANGE_SORT_BY,
  payload: { sortBy }
});

export const changeSortOrder = (sortOrder: string) => ({
  type: CHANGE_SORT_ORDER,
  payload: { sortOrder }
});

export const changeIncludeCancelled = (includeCancelled: boolean) => ({
  type: CHANGE_INCLUDE_CANCELLED,
  payload: { includeCancelled }
});

export const changeQuestionSearch = (questionSearch: string) => ({
  type: CHANGE_QUESTION_SEARCH,
  payload: { questionSearch }
});

export const loadHistory = (
  sortBy: string, sortOrder: string, includeCancelled: boolean, questionSearch: string, page: number
) => ({
  type: LOAD_HISTORY,
  payload: { sortBy, sortOrder, includeCancelled, questionSearch, page }
});

export const historyLoaded = (recordCount: number, page: number, loadedHistory: Array<UsedQuestionType>) => ({
  type: HISTORY_LOADED,
  payload: { loadedHistory, page, recordCount }
});
