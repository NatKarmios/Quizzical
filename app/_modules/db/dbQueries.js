// @flow

import { getDB } from './dbSetup';
import type { QuestionType } from '../../utils/types';


// All queries are written in SQLite 3 syntax.
const CREATE_QUESTIONS_TABLE =
  'CREATE TABLE IF NOT EXISTS Questions ' +
  '(questionID INTEGER PRIMARY KEY ASC, content TEXT UNIQUE, correctAnswer TEXT, ' +
  'incorrectAnswers TEXT, external BOOLEAN);';
const INSERT_QUESTION =
  'INSERT INTO Questions(content, correctAnswer, incorrectAnswers, external) ' +
  'VALUES (?, ?, ?, ?)';
const GET_QUESTION_BY_ID = 'SELECT * FROM Questions WHERE questionID = ?';
const GET_QUESTION_COUNT = 'SELECT COUNT(*) FROM Questions';
const GET_QUESTION_SELECTION = 'SELECT * FROM Questions LIMIT ? OFFSET ?';
const DELETE_ALL_QUESTIONS = 'DELETE FROM Questions';
const DELETE_QUESTION_BY_ID = 'DELETE FROM Questions WHERE questionID = ?';


/**
 *  Parses and verifies the type of a raw question retrieved from the database
 *
 *  The main difference is that `external` is 0 or 1 instead of a boolean,
 *  as SQLite 3 does not have boolean types, and incorrectAnswers is a single
 *  string with '|' characters delimiting answers, in order to avoid an
 *  unnecessarily complex data structure in the database.
 *
 * @param rawQuestion | The raw question object to be parsed
 * @returns The parsed question
 */
const parseRawQuestion = (rawQuestion: mixed): QuestionType => {
  if (
    rawQuestion && typeof rawQuestion === 'object'
    && typeof rawQuestion.questionID === 'number'
    && typeof rawQuestion.content === 'string'
    && typeof rawQuestion.correctAnswer === 'string'
    && typeof rawQuestion.incorrectAnswers === 'string'
    && typeof rawQuestion.external === 'number'
  ) {
    return {
      questionID: rawQuestion.questionID,
      content: rawQuestion.content,
      correctAnswer: rawQuestion.correctAnswer,
      incorrectAnswers: rawQuestion.incorrectAnswers.split('|'),
      external: rawQuestion.external === 1
    };
  }

  throw Error(`Parsed question didn't match types!\n${JSON.stringify(rawQuestion)}`);
};


/**
 *  Create any needed tables that don't yet exist.
 *
 * @returns A promise that resolves when the action has completed.
 */
export const createTable = (): Promise<any> =>
  getDB().run(CREATE_QUESTIONS_TABLE);


/**
 *  Insert a new question into the question database
 *
 * @param content          | The question to be asked
 * @param correctAnswer    | The correct answer
 * @param incorrectAnswers | An array of incorrect answers
 * @param external         | Whether the question has been imported
 * @returns A promise that resolves when the action has completed.
 */
export const insertQuestion = (
  content: string, correctAnswer: string, incorrectAnswers: Array<string>, external: boolean
): Promise<any> =>
    getDB().run(INSERT_QUESTION, [content, correctAnswer, incorrectAnswers.join('|'), external]);


/**
 *  Retrieve a specific question by ID
 *
 * @param id | The ID of the question to be retrieved
 * @returns A promise that resolves with the question, once retrieved.
 */
export const getQuestionByID = async (id: number): Promise<QuestionType> =>
  parseRawQuestion(await getDB().get(GET_QUESTION_BY_ID, [id]));


/**
 *  Get how many questions in total are stored
 *
 * @returns A promise that resolves to the number of questions stored.
 */
export const getQuestionCount = async (): Promise<number> =>
  (await getDB().get(GET_QUESTION_COUNT))['COUNT(*)'];


/**
 *  Get a specific selection of questions
 *
 * @param page         | The 'page' of questions being retrieved
 *                     | i.e. page 0 means the first questions
 *                     | in the database
 * @param numQuestions | The number of questions considered to be on
 *                     | each 'page'.
 */
export const getQuestionList = async (
  page: number, numQuestions: number = 10
): Promise<Array<QuestionType>> =>
    (await getDB().all(
      GET_QUESTION_SELECTION, [numQuestions, page * numQuestions]
    )).map(parseRawQuestion);


/**
 *  Delete all questions that have been stored
 *
 * @returns A promise that resolves when the action has completed.
 */
export const deleteAllQuestions: () => Promise<any> =
  () => getDB().run(DELETE_ALL_QUESTIONS);


/**
 *  Delete a specific question by ID
 *
 * @param id | The ID of the question to be deleted
 * @returns A promise that resolves when the action has completed.
 */
export const deleteQuestionByID =
  (id: number): Promise<any> => getDB().run(DELETE_QUESTION_BY_ID, [id]);
