// @flow

import { List } from 'immutable';

import { range, shuffleArray } from '../../utils/helperFuncs';

import {
  ACTIVE_QUESTION_START, ACTIVE_QUESTION_TICK, ACTIVE_QUESTION_STORE_ANSWERER, ACTIVE_QUESTION_RESET,
  ACTIVE_QUESTION_END
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

const activeQuestion = (state=defaultState, { type, payload }) => {
  switch (type) {
    case ACTIVE_QUESTION_START:
      const { question, duration, prize, endEarly, multipleWinners } = payload;

      const timeLeft = duration;
      const answerMap = shuffleArray(range(question.incorrectAnswers.length+1, 1));

      return { ...state, question, prize, endEarly, multipleWinners, timeLeft, answerMap, uiActive: true, running: true };

    case ACTIVE_QUESTION_TICK:
      return { ...state, timeLeft: state.timeLeft - (state.running ? 1 : 0) };

    case ACTIVE_QUESTION_STORE_ANSWERER:
      const { answerer, correct } = payload;
      let { correctAnswerers, incorrectAnswerers } = state;

      if (correct)
        correctAnswerers = correctAnswerers.push(answerer);
      else
        incorrectAnswerers = incorrectAnswerers.push(answerer);

      return { ...state, correctAnswerers, incorrectAnswerers };

    case ACTIVE_QUESTION_END:
      return { ...state, running: false };

    case ACTIVE_QUESTION_RESET:
      return defaultState;

    default:
      return state;
  }
};

export default activeQuestion;
