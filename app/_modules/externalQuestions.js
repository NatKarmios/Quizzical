// @flow

import { decodeHtml, httpGet } from '../utils/helperFuncs';
import { insertQuestion } from './db/dbQueries';

/**
 *  Get the API URL to use when getting questions from the Open Trivia Database
 *
 * @param amount     | The amount of questions to retrieve
 * @param difficulty | The difficulty level of the questions ('easy', 'medium' or 'hard')
 * @returns The API URL
 */
const getApiUrl = (amount, difficulty) =>
  `https://opentdb.com/api.php?amount=${amount}&category=15&difficulty=${difficulty}`;

/**
 *  Parses a raw question recieved from the Open Trivia Database into a usable format;
 *  this largely entails decoding and HTML encoding used by OTDb.
 *
 * @param question | The raw question to parse
 * @returns A quesiton object
 */
const parseRawQuestion = question => ({
  content: decodeHtml(question.question),
  correctAnswer: decodeHtml(question.correct_answer),
  incorrectAnswers: question.incorrect_answers.map(decodeHtml)
});

/**
 *  Get a list of questions from the Open Trivia Database
 *
 * @param amount     | The amount of questions to retrieve
 * @param difficulty | The difficulty level of the questions ('easy', 'medium' or 'hard')
 * @returns A promise that resolves with the list of questions
 */
export const retrieveExternalQuestions = async (
  amount: number,
  difficulty: string = 'medium'
) => {
  // Retrieve the raw questions
  const questions = await httpGet({
    uri: getApiUrl(amount, difficulty),
    json: true
  });

  // Parse the list of questions
  return questions.results.map(parseRawQuestion);
};

/**
 *  Retrieve a list of questions and add them to the database;
 *  not all of the questions requested will necessarily be added,
 *  as the database cannot store any dupliucate questions
 *
 * @param amount     | The amount of questions to retrieve
 * @param difficulty | The difficulty level of the questions ('easy', 'medium' or 'hard')
 * @returns A promise that resolves with how many questions couldn't be added to the DB
 */
export const addExternalQuestions = async (
  amount: number,
  difficulty: string
) => {
  let missed = 0;

  // Retrueve the questions
  const questions = await retrieveExternalQuestions(amount, difficulty);

  // Insert all the questions to the DB, in pseudo-parallel
  await Promise.all(
    questions.map(async question => {
      try {
        // Attempt to insert the question
        await insertQuestion(
          question.content,
          question.correctAnswer,
          question.incorrectAnswers,
          true
        );
      } catch (e) {
        // If insertion failed, increment 'missed'
        missed += 1;
      }
    })
  );

  return missed;
};
