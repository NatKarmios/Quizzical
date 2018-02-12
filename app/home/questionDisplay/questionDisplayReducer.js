// @flow

import { isInteger, isNaturalNumber } from '../../utils/helperFuncs';

import {
  CHANGE_QUESTION, CHANGE_DURATION, CHANGE_PRIZE, CHANGE_MULTIPLE_WINNERS, CHANGE_END_EARLY, CHANGE_DELETE_DIALOG_OPEN,
  DELETE_QUESTION
} from './questionDisplayActions';
import { SELECT_QUESTION, QUESTIONS_LOADED } from '../questionList/questionListActions';

const defaultState = {
  question: null,
  prize: '',
  duration: '',
  multipleWinners: false,
  endEarly: false,
  deleteDialogOpen: false,
  busy: false
};

export default (
  state=defaultState,
  { type, payload }
) => {
  switch (type) {
    case CHANGE_QUESTION:
      return { ...state, question: payload.value };
    case CHANGE_DURATION:
      if (isNaturalNumber(payload.value))
        return { ...state, duration: payload.value };
      break;
    case CHANGE_PRIZE:
      if (isInteger(payload.value))
        return { ...state, prize: payload.value };
      break;
    case CHANGE_MULTIPLE_WINNERS:
      return { ...state, multipleWinners: payload.value };
    case CHANGE_END_EARLY:
      return { ...state, endEarly: payload.value };
    case SELECT_QUESTION:
      return { ...state, question: payload.question };
    case CHANGE_DELETE_DIALOG_OPEN:
      return { ...state, deleteDialogOpen: payload.open };
    case DELETE_QUESTION:
      return { ...state, busy: true, question: null };
    case QUESTIONS_LOADED:
      return { ...state, busy: false };
    default:
      break;
  }
  return state;
}
