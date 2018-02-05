// @flow

import { isInteger, isNaturalNumber } from '../../utils/helperFuncs';

import {
  CHANGE_QUESTION, CHANGE_DURATION, CHANGE_PRIZE, CHANGE_MULTIPLE_WINNERS, CHANGE_END_EARLY
} from './questionDisplayActions';

const defaultState = {
  question: null,
  prize: '',
  duration: '',
  multipleWinners: false,
  endEarly: false
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
    default:
      break;
  }
  return state;
}
