// @flow

import { List } from 'immutable';


import { range, shuffleArray } from '../../utils/helperFuncs';
import type { ActionType, ActiveQuestionStateType } from '../../utils/types';
import { refineToQuestionType } from '../../utils/types';

import {
  ACTIVE_QUESTION_START, ACTIVE_QUESTION_TICK, ACTIVE_QUESTION_STORE_ANSWERER,
  ACTIVE_QUESTION_RESET, ACTIVE_QUESTION_END
} from './activeQuestionActions';


const defaultState = {
  uiActive: false,
  running: false,
  question: null,
  timeLeft: -1,
  prize: -1,
  endEarly: false,
  multipleWinners: true,
  answerMap: null,
  correctAnswerers: List(),
  incorrectAnswerers: List()
};

const activeQuestion = (
  state: ActiveQuestionStateType=defaultState, { type, payload }: ActionType
) => {
  if (type === ACTIVE_QUESTION_START) {
    if (payload !== undefined && payload !== null && typeof payload === 'object') {
      const { question, duration, prize, endEarly, multipleWinners } = payload;
      const typedQuestion = refineToQuestionType(question);
      if (typedQuestion !== undefined && typedQuestion !== null) {
        const timeLeft = duration;
        const answerMap = shuffleArray(range(typedQuestion.incorrectAnswers.length + 1, 1));

        return {
          ...state,
          question,
          prize,
          endEarly,
          multipleWinners,
          timeLeft,
          answerMap,
          uiActive: true,
          running: true
        };
      }
    }
  } else if (type === ACTIVE_QUESTION_TICK) {
    return { ...state, timeLeft: state.timeLeft - (state.running ? 1 : 0) };
  } else if (type === ACTIVE_QUESTION_STORE_ANSWERER) {
    if (
      payload !== undefined && payload !== null && typeof payload === 'object'
      && payload.answerer !== undefined && payload.answerer !== null && typeof payload.answerer === 'string'
      && payload.correct !== undefined && payload.correct !== null && typeof payload.correct === 'boolean'
    ) {
      const { answerer, correct } = payload;
      let { correctAnswerers, incorrectAnswerers } = state;

      if (correct) {
        correctAnswerers = correctAnswerers.push(answerer);
      } else {
        incorrectAnswerers = incorrectAnswerers.push(answerer);
      }
      return { ...state, correctAnswerers, incorrectAnswerers };
    }
  } else if (type === ACTIVE_QUESTION_END) {
    return { ...state, running: false };
  } else if (type === ACTIVE_QUESTION_RESET) {
    return defaultState;
  }

  return state;
};

export default activeQuestion;
