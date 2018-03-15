// @flow

import type { QuestionType } from '../../utils/types';

export const LOAD_QUESTIONS = 'LOAD_QUESTIONS';
export type LOAD_QUESTIONS_TYPE = 'LOAD_QUESTIONS';

export const QUESTIONS_LOADED = 'QUESTIONS_LOADED';
export type QUESTIONS_LOADED_TYPE = 'QUESTIONS_LOADED';

export const ADD_QUESTION = 'ADD_QUESTION';
export type ADD_QUESTION_TYPE = 'ADD_QUESTION';

export const IMPORT_QUESTIONS = 'IMPORT_QUESTIONS';
export type IMPORT_QUESTIONS_TYPE = 'IMPORT_QUESTIONS';

export const SELECT_QUESTION = 'SELECT_QUESTION';
export type SELECT_QUESTION_TYPE = 'SELECT_QUESTION';

export const loadQuestions = (page: number) => ({
  type: LOAD_QUESTIONS,
  payload: { page }
});

export const questionsLoaded = (
  questionCount: number, page: number, questions: Array<QuestionType>
) => ({
  type: QUESTIONS_LOADED,
  payload: { questionCount, page, questions }
});

export const addQuestion = (question: string, answer: string, incorrectAnswers: Array<string>) => ({
  type: ADD_QUESTION,
  payload: { question, answer, incorrectAnswers }
});

export const importQuestions = (amount: number, difficulty: string) => ({
  type: IMPORT_QUESTIONS,
  payload: { amount, difficulty }
});


export const selectQuestion = (question: QuestionType) => ({
  type: SELECT_QUESTION,
  payload: { question }
});
