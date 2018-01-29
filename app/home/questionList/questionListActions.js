// @flow

export const LOAD_QUESTIONS = 'LOAD_QUESTIONS';
export const QUESTIONS_LOADED = 'QUESTIONS_LOADED';

export const loadQuestions = page => ({
  type: LOAD_QUESTIONS,
  payload: { page }
});

export const questionsLoaded = (questionCount, page, questions) => ({
  type: QUESTIONS_LOADED,
  payload: { questionCount, page, questions }
});
