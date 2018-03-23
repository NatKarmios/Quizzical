// @flow

import { isInteger, isNaturalNumber } from '../../utils/helperFuncs';

import {
  CHANGE_QUESTION, CHANGE_DURATION, CHANGE_PRIZE, CHANGE_MULTIPLE_WINNERS,
  CHANGE_END_EARLY, CHANGE_DELETE_DIALOG_OPEN, DELETE_QUESTION
} from './questionDisplayActions';

import { SELECT_QUESTION, QUESTIONS_LOADED } from '../questionList/questionListActions';

import type { QuestionType, ActionType } from '../../utils/types';


type QuestionDisplayState = {
  question: ?QuestionType,
  prize: string,
  duration: string,
  multipleWinners: boolean,
  endEarly: boolean,
  deleteDialogOpen: boolean,
  busy: boolean
};


const defaultState = {
  question: null,
  prize: '',
  duration: '',
  multipleWinners: true,
  endEarly: false,
  deleteDialogOpen: false,
  busy: false
};

export default (
  state: QuestionDisplayState=defaultState,
  action: ActionType
) => {
  switch (action.type) {
    case CHANGE_QUESTION:
      if (
        action.payload !== undefined && action.payload !== null && typeof action.payload === 'object'
        && action.payload.value !== undefined && action.payload.value !== null
      ) {
        return { ...state, question: action.payload.value };
      }
      break;
    case CHANGE_DURATION:
      if (
        action.payload !== undefined && action.payload !== null && typeof action.payload === 'object'
        && action.payload.value !== undefined && action.payload.value !== null
      ) {
        if (isNaturalNumber(action.payload.value)) {
          return { ...state, duration: action.payload.value };
        }
      }
      break;
    case CHANGE_PRIZE:
      if (
        action.payload !== undefined && action.payload !== null && typeof action.payload === 'object'
        && action.payload.value !== undefined && action.payload.value !== null
      ) {
        if (isInteger(action.payload.value)) {
          return { ...state, prize: action.payload.value };
        }
      }
      break;
    case CHANGE_MULTIPLE_WINNERS:
      if (
        action.payload !== undefined && action.payload !== null && typeof action.payload === 'object'
        && action.payload.value !== undefined && action.payload.value !== null
      ) {
        return { ...state, multipleWinners: action.payload.value };
      }
      break;
    case CHANGE_END_EARLY:
      if (
        action.payload !== undefined && action.payload !== null && typeof action.payload === 'object'
        && action.payload.value !== undefined && action.payload.value !== null
      ) {
        return { ...state, endEarly: action.payload.value };
      }
      break;
    case SELECT_QUESTION:
      if (
        action.payload !== undefined && action.payload !== null && typeof action.payload === 'object'
        && action.payload.question !== undefined && action.payload.question !== null
      ) {
        return { ...state, question: action.payload.question };
      }
      break;
    case CHANGE_DELETE_DIALOG_OPEN:
      if (
        action.payload !== undefined && action.payload !== null && typeof action.payload === 'object'
        && action.payload.open !== undefined && action.payload.open !== null
      ) {
        return { ...state, deleteDialogOpen: action.payload.open };
      }
      break;
    case DELETE_QUESTION:
      return { ...state, busy: true, question: null };
    case QUESTIONS_LOADED:
      return { ...state, busy: false };
    default:
      break;
  }
  return state;
};
