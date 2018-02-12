// @flow
import { getDB } from './dbSetup';


export type QuestionType = {
  questionID: number,
  content: string,
  correctAnswer: string,
  incorrectAnswers: Array<string>,
  external: boolean
}


const CREATE_QUESTIONS_TABLE =
  'CREATE TABLE IF NOT EXISTS Questions ' +
  '(questionID INTEGER PRIMARY KEY ASC, content TEXT, correctAnswer TEXT, ' +
  'incorrectAnswers TEXT, external BOOLEAN);';
const INSERT_QUESTION =
  'INSERT INTO Questions(content, correctAnswer, incorrectAnswers, external) ' +
  'VALUES (?, ?, ?, ?)';
const GET_ALL_QUESTIONS = 'SELECT * FROM Questions';
const GET_QUESTION_BY_ID = 'SELECT * FROM Questions WHERE questionID = ?';
const GET_QUESTION_COUNT = 'SELECT COUNT(*) FROM Questions';
const GET_QUESTION_SELECTION = 'SELECT * FROM Questions LIMIT ? OFFSET ?';
const DELETE_ALL_QUESTIONS = 'DELETE FROM Questions';
const DELETE_QUESTION_BY_ID = 'DELETE FROM Questions WHERE questionID = ?';

const parseRawQuestion: mixed => QuestionType =
    rawQuestion => ({
      ...rawQuestion,
      incorrectAnswers: rawQuestion.incorrectAnswers.split('|'),
      external: rawQuestion.external === 1
    });

export const createTable: () => Promise<void> =
  () => getDB().run(CREATE_QUESTIONS_TABLE);

export const insertQuestion: (string, string, Array<string>, boolean) => Promise<void> =
  (content: string, correctAnswer: string, incorrectAnswers: Array<string>, external: boolean) =>
    getDB().run(INSERT_QUESTION, [content, correctAnswer, incorrectAnswers.join('|'), external]);

export const getAllQuestions: () => Promise<Array<QuestionType>> =
  async () => (await getDB().all(GET_ALL_QUESTIONS)).map(parseRawQuestion);

export const getQuestionByID: number => Promise<QuestionType> =
  async id => parseRawQuestion(await getDB().get(GET_QUESTION_BY_ID, [id]));

export const getQuestionCount: () => Promise<number> =
  async () => (await getDB().get(GET_QUESTION_COUNT))['COUNT(*)'];

export const getQuestionList: () => Promise<Array<QuestionType>> =
  async (page: number, numQuestions: number = 10) =>
    (await getDB().all(
      GET_QUESTION_SELECTION, [numQuestions, page*numQuestions]
    )).map(parseRawQuestion);

export const deleteAllQuestions: () => Promise<void> =
  () => getDB().run(DELETE_ALL_QUESTIONS);

export const deleteQuestionByID: number => Promise<void> =
  id => getDB().run(DELETE_QUESTION_BY_ID, [id]);
