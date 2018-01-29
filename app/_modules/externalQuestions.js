// @flow

import { httpGet } from '../utils/helperFuncs';
import {insertQuestion} from "./db/dbQueries";

const getApiUrl = (amount, difficulty) =>
  `https://opentdb.com/api.php?amount=${amount}&category=15&difficulty=${difficulty}`;


const parseRawQuestion = question => ({
  content: decodeURI(question['question']),
  correctAnswer: decodeURI(question['correct_answer']),
  incorrectAnswers: question['incorrect_answers'].map(decodeURI),
});

export const retrieveExternalQuestions = async (amount, difficulty='medium') => {
  const questions = await httpGet({ uri: getApiUrl(amount, difficulty), json: true });
  return questions['results'].map(parseRawQuestion);
};

export const addExternalQuestions = async (amount, difficulty) => {
  const questions = await retrieveExternalQuestions(amount, difficulty);
  await Promise.all(questions.map(question => {
    console.log(`adding question: "${question.content}`);
    insertQuestion(
      question.content, question.correctAnswer, question.incorrectAnswers, true
    )
  }));
};
