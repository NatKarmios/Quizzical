// @flow

import { List } from 'immutable';


import { range, shuffleArray } from '../../utils/helperFuncs';
import type { ActionType, ActiveQuestionStateType } from '../../utils/types';
import { refineToQuestionType } from '../../utils/types';

import {
  ACTIVE_QUESTION_START, ACTIVE_QUESTION_TICK, ACTIVE_QUESTION_STORE_ANSWERER,
  ACTIVE_QUESTION_RESET, ACTIVE_QUESTION_END
} from './activeQuestionActions';


// The active question state consists of:
const defaultState = {
  // Whether the active question UI is shown
  uiActive: false,
  // Whether there is a question currently running
  running: false,
  // The quesetion being asked
  question: null,
  // The total duration of the question
  duration: -1,
  // The amount of time left on the question
  timeLeft: -1,
  // The number of points distributed to any winners
  prize: -1,
  // Whether the question should end as soon as someone answers correctly
  endEarly: false,
  // Whether more than one person should be able to win
  multipleWinners: true,
  // An array that maps indeces of answers to those that the viewers see
  answerMap: null,
  // An immutable list of viewers who have answered correctly
  correctAnswerers: List(),
  // An immutable list of viewers who have answered incorrectly
  incorrectAnswerers: List()
};

/**
 *  Reducer for active question state
 *
 * @param state
 * @param type
 * @param payload
 * @returns The new active question state
 */
const activeQuestion = (
  state: ActiveQuestionStateType=defaultState, { type, payload }: ActionType
) => {
  if (type === ACTIVE_QUESTION_START) {
    if (payload !== undefined && payload !== null && typeof payload === 'object') {
      const { question, duration, prize, endEarly, multipleWinners } = payload;
      const typedQuestion = refineToQuestionType(question);
      if (typedQuestion !== undefined && typedQuestion !== null) {
        const answerMap = shuffleArray(range(typedQuestion.incorrectAnswers.length + 1, 1));

        return {
          ...state,
          question,
          prize,
          endEarly,
          multipleWinners,
          duration,
          timeLeft: duration,
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
