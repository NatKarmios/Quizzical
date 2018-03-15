// @flow

import type { QuestionType } from '../../utils/types';
import type { MsgData } from '../../_modules/twitch/msgData';


/*
 *  Actions that relate to active question state
 */


export const ACTIVE_QUESTION_START = 'ACTIVE_QUESTION_START';
export const ACTIVE_QUESTION_TICK = 'ACTIVE_QUESTION_TICK';
export const ACTIVE_QUESTION_HANDLE_ANSWER = 'ACTIVE_QUESTION_HANDLE_ANSWER';
export const ACTIVE_QUESTION_STORE_ANSWERER = 'ACTIVE_QUESTION_STORE_ANSWERER';
export const ACTIVE_QUESTION_END = 'ACTIVE_QUESTION_END';
export const ACTIVE_QUESTION_RESET = 'ACTIVE_QUESTION_RESET';


export const activeQuestionStart = (
  question: QuestionType, duration: number, prize: number,
  endEarly: boolean, multipleWinners: boolean
) => ({
  type: ACTIVE_QUESTION_START,
  payload: { question, duration, prize, endEarly, multipleWinners }
});

export const activeQuestionTick = () => ({
  type: ACTIVE_QUESTION_TICK
});

export const activeQuestionHandleAnswer = (msgData: MsgData) => ({
  type: ACTIVE_QUESTION_HANDLE_ANSWER,
  payload: { msgData }
});

export const activeQuestionStoreAnswerer = (answerer: string, correct: boolean) => ({
  type: ACTIVE_QUESTION_STORE_ANSWERER,
  payload: { answerer, correct }
});

export const activeQuestionEnd = (cancelled: boolean=false) => ({
  type: ACTIVE_QUESTION_END,
  payload: { cancelled }
});

export const activeQuestionReset = () => ({
  type: ACTIVE_QUESTION_RESET
});
