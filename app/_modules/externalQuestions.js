// @flow

import { decodeHtml, httpGet } from '../utils/helperFuncs';
import { insertQuestion } from './db/dbQueries';

const getApiUrl = (amount, difficulty) =>
  `https://opentdb.com/api.php?amount=${amount}&category=15&difficulty=${difficulty}`;


const parseRawQuestion = question => ({
  content: decodeHtml(question.question),
  correctAnswer: decodeHtml(question.correct_answer),
  incorrectAnswers: question.incorrect_answers.map(decodeHtml),
});

export const retrieveExternalQuestions = async (amount: number, difficulty: string='medium') => {
  const questions = await httpGet({ uri: getApiUrl(amount, difficulty), json: true });
  return questions.results.map(parseRawQuestion);
};

export const addExternalQuestions = async (amount: number, difficulty: string) => {
  let missed = 0;
  const questions = await retrieveExternalQuestions(amount, difficulty);

  await Promise.all(questions.map(async question => {
    try {
      await insertQuestion(
        question.content, question.correctAnswer, question.incorrectAnswers, true
      );
    } catch (e) {
      missed += 1;
    }
  }));

  return missed;
};
