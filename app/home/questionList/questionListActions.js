// @flow

export const LOAD_QUESTIONS = 'LOAD_QUESTIONS';
export const QUESTIONS_LOADED = 'QUESTIONS_LOADED';
export const ADD_QUESTION = 'ADD_QUESTION';
export const IMPORT_QUESTIONS = 'IMPORT_QUESTIONS';

export const loadQuestions = page => ({
  type: LOAD_QUESTIONS,
  payload: { page }
});

export const questionsLoaded = (questionCount, page, questions) => ({
  type: QUESTIONS_LOADED,
  payload: { questionCount, page, questions }
});

export const addQuestion = (question, answer, incorrectAnswers) => ({
  type: ADD_QUESTION,
  payload: { question, answer, incorrectAnswers }
});

export const importQuestions = (amount, difficulty) => ({
  type: IMPORT_QUESTIONS,
  payload: { amount, difficulty }
});
