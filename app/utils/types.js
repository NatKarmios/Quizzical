// @flow

import { List } from 'immutable';

export type ActionType = {
  type: string,
  payload?: mixed
};

export type QuestionType = {
  questionID: number,
  content: string,
  correctAnswer: string,
  incorrectAnswers: Array<string>,
  external: boolean
};

export type UsedQuestionType = {
  usedQuestionID: number,
  questionID: number,
  cancelled: boolean,
  finishTime: Date,
  duration: number,
  prize: number,
  winners: number,
  question: QuestionType
};

export type WinnerType = {
  winnerID: number,
  usedQuestionID: number,
  name: string
};

export type WinnerTotalType = {
  name: string,
  total: number
};

export type ActiveQuestionStateType = {
  uiActive: boolean,
  running: boolean,
  question: ?QuestionType,
  timeLeft: number,
  prize: number,
  endEarly: boolean,
  multipleWinners: boolean,
  answerMap: ?Array<number>,
  correctAnswerers: List,
  incorrectAnswerers: List
};

export type SettingsType = {
  [category: string]: {
    [label: string]: ?string
  }
};

type LoginAccountStateType = {
  username: ?string,
  displayName: ?string,
  avatar: ?string
};

export type LoginStateType = {
  streamer: LoginAccountStateType,
  bot: LoginAccountStateType
};

export type GlobalStateType = {
  settings: ?SettingsType,
  login: ?LoginStateType,
  activeQuestion: ?ActiveQuestionStateType
};


// eslint-disable-next-line
export const refineToQuestionType = (x: mixed): ?QuestionType => {
  if (
    x !== undefined && x !== null && typeof x === 'object'
    && x.questionID !== undefined && x.questionID !== null && typeof x.questionID === 'number'
    && x.content !== undefined && x.content !== null && typeof x.content === 'string'
    && x.correctAnswer !== undefined && x.correctAnswer !== null && typeof x.correctAnswer === 'string'
    && x.incorrectAnswers !== undefined && x.incorrectAnswers !== null
      && Array.isArray(x.incorrectAnswers)
    && x.external !== undefined && x.external !== null && typeof x.external === 'boolean'
  ) {
    return {
      questionID: x.questionID,
      content: x.content,
      correctAnswer: x.correctAnswer,
      external: x.external,
      incorrectAnswers: x.incorrectAnswers.join('|').split('|'),
    };
  }
  return null;
};
