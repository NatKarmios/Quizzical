// @flow

import { getDB } from './dbSetup';
import type { QuestionType } from '../../utils/types';


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


export const createTable = (): Promise<any> =>
  getDB().run(CREATE_QUESTIONS_TABLE);

export const insertQuestion = (
  content: string, correctAnswer: string, incorrectAnswers: Array<string>, external: boolean
): Promise<any> =>
    getDB().run(INSERT_QUESTION, [content, correctAnswer, incorrectAnswers.join('|'), external]);


export const getQuestionByID = async (id: number): Promise<QuestionType> =>
  parseRawQuestion(await getDB().get(GET_QUESTION_BY_ID, [id]));

export const getQuestionCount = async (): Promise<number> =>
  (await getDB().get(GET_QUESTION_COUNT))['COUNT(*)'];

export const getQuestionList = async (
  page: number, numQuestions: number = 10
): Promise<Array<QuestionType>> =>
    (await getDB().all(
      GET_QUESTION_SELECTION, [numQuestions, page * numQuestions]
    )).map(parseRawQuestion);

export const deleteAllQuestions: () => Promise<any> =
  () => getDB().run(DELETE_ALL_QUESTIONS);

export const deleteQuestionByID =
  (id: number): Promise<any> => getDB().run(DELETE_QUESTION_BY_ID, [id]);
