// @flow

import { getDB } from './dbSetup';
import type {
  QuestionType,
  UsedQuestionType,
  WinnerTotalType
} from '../../utils/types';

// <editor-fold desc="Query Strings">

// All queries are written in SQLite 3 syntax.
const CREATE_QUESTIONS_TABLE =
  'CREATE TABLE IF NOT EXISTS Questions (' +
  'questionID INTEGER PRIMARY KEY ASC, ' +
  'content TEXT UNIQUE NOT NULL, ' +
  'correctAnswer TEXT NOT NULL, ' +
  'incorrectAnswers TEXT NOT NULL, ' +
  'external BOOLEAN CHECK (external IN (0,1)) NOT NULL' +
  ');';
const CREATE_USED_QUESTIONS_TABLE =
  'CREATE TABLE IF NOT EXISTS UsedQuestions (' +
  'usedQuestionID INTEGER PRIMARY KEY ASC,' +
  'questionID INTEGER NOT NULL,' +
  'cancelled BOOLEAN CHECK (cancelled IN (0,1)) NOT NULL,' +
  'finishTime INTEGER NOT NULL,' +
  'duration INTEGER NOT NULL,' +
  'prize INTEGER NOT NULL,' +
  'FOREIGN KEY(questionID) REFERENCES Questions(questionID)' +
  ');';
const CREATE_WINNERS_TABLE =
  'CREATE TABLE IF NOT EXISTS Winners (' +
  'winnerID INTEGER PRIMARY KEY ASC,' +
  'name TEXT NOT NULL,' +
  'usedQuestionID INTEGER NOT NULL,' +
  'FOREIGN KEY(usedQuestionID) REFERENCES UsedQuestions(usedQuestionID)' +
  ');';
const INSERT_QUESTION =
  'INSERT INTO Questions(content, correctAnswer, incorrectAnswers, external) ' +
  'VALUES (?, ?, ?, ?);';
const INSERT_USED_QUESTION =
  'INSERT INTO UsedQuestions(questionID, cancelled, finishTime, duration, prize) ' +
  'VALUES (?, ?, ?, ?, ?);';
const INSERT_WINNER =
  'INSERT INTO Winners(name, usedQuestionID) VALUES (?, ?);';
const GET_LAST_INSERTED_ROW = 'SELECT last_insert_rowid();';
const GET_USED_QUESTION_COUNT = 'SELECT COUNT(*) FROM UsedQuestions';

const GET_USED_QUESTION_PARTIAL_1 =
  'SELECT UsedQuestions.*, Questions.*, COUNT(Winners.winnerID) as winnerCount FROM UsedQuestions ' +
  'LEFT OUTER JOIN Winners on UsedQuestions.usedQuestionID = Winners.usedQuestionID ' +
  'JOIN Questions on UsedQuestions.questionID = Questions.questionID ';
const GET_USED_QUESTION_PARTIAL_2 = 'GROUP BY UsedQuestions.usedQuestionID ';

const GET_TOP_WINNERS =
  'SELECT *, count(name) as total FROM Winners GROUP BY name ORDER BY count(name) DESC LIMIT ?;';

const GET_QUESTION_BY_ID = 'SELECT * FROM Questions WHERE questionID = ?;';
const GET_QUESTION_COUNT = 'SELECT COUNT(*) FROM Questions;';
const GET_QUESTION_SELECTION = 'SELECT * FROM Questions LIMIT ? OFFSET ?;';
const DELETE_ALL_QUESTIONS = 'DELETE FROM Questions;';
const DELETE_QUESTION_BY_ID = 'DELETE FROM Questions WHERE questionID = ?;';

// </editor-fold>

// <editor-fold desc="Type Parser Functions">

/**
 *  Parses and verifies the type of a raw 'question' retrieved from the database
 *
 *  In the database. `external` is stored as an integer (0 or 1) instead of a boolean,
 *  as SQLite 3 does not have boolean types, and incorrectAnswers is a single
 *  string with '|' characters delimiting answers, in order to avoid an
 *  unnecessarily complex data structure in the database.
 *
 * @param rawQuestion | The raw question object to be parsed
 * @returns The parsed question
 */
const parseRawQuestion = (rawQuestion: mixed): QuestionType => {
  if (
    rawQuestion &&
    typeof rawQuestion === 'object' &&
    typeof rawQuestion.questionID === 'number' &&
    typeof rawQuestion.content === 'string' &&
    typeof rawQuestion.correctAnswer === 'string' &&
    typeof rawQuestion.incorrectAnswers === 'string' &&
    typeof rawQuestion.external === 'number'
  ) {
    return {
      questionID: rawQuestion.questionID,
      content: rawQuestion.content,
      correctAnswer: rawQuestion.correctAnswer,
      incorrectAnswers: rawQuestion.incorrectAnswers.split('|'),
      external: rawQuestion.external === 1
    };
  }

  throw Error(
    `Parsed question didn't match types!\n${JSON.stringify(rawQuestion)}`
  );
};

/**
 *  Parses and verifies the type of a raw 'used question' retrieved from the database
 *
 *  `cancelled` must be mapped to a boolean, similar to `eternal` as above,
 *  and finishTime must be parsed from an integer into a date.
 *
 * @param rawQuestion | The raw question object to be parsed
 * @returns The parsed question
 */
const parseRawUsedQuestion = (rawUsedQuestion: mixed): UsedQuestionType => {
  if (
    rawUsedQuestion &&
    typeof rawUsedQuestion === 'object' &&
    typeof rawUsedQuestion.usedQuestionID === 'number' &&
    typeof rawUsedQuestion.questionID === 'number' &&
    typeof rawUsedQuestion.cancelled === 'number' &&
    typeof rawUsedQuestion.finishTime === 'number' &&
    typeof rawUsedQuestion.duration === 'number' &&
    typeof rawUsedQuestion.prize === 'number' &&
    typeof rawUsedQuestion.winnerCount === 'number'
  ) {
    return {
      usedQuestionID: rawUsedQuestion.usedQuestionID,
      questionID: rawUsedQuestion.questionID,
      cancelled: rawUsedQuestion.cancelled === 1,
      duration: rawUsedQuestion.duration,
      prize: rawUsedQuestion.prize,
      winners: rawUsedQuestion.winnerCount,
      finishTime: new Date(rawUsedQuestion.finishTime * 1000),
      question: parseRawQuestion(rawUsedQuestion)
    };
  }

  throw Error(
    `Parsed usedQuestion didn't match types!\n${JSON.stringify(
      rawUsedQuestion
    )}`
  );
};

/**
 *  Parses and verifies the type of a raw 'winner' retrieved from the database
 *
 *  There are no type conversions necessary here.
 *
 * @param rawQuestion | The raw question object to be parsed
 * @returns The parsed question
 */
const parseRawWinnerTotal = (rawWinner: mixed): WinnerTotalType => {
  if (
    rawWinner &&
    typeof rawWinner === 'object' &&
    typeof rawWinner.name === 'string' &&
    typeof rawWinner.total === 'number'
  ) {
    return {
      name: rawWinner.name,
      total: rawWinner.total
    };
  }

  throw Error(
    `Parsed winner didn't match types!\n${JSON.stringify(rawWinner)}`
  );
};

// </editor-fold>

/**
 *  Create any needed tables that don't yet exist.
 *
 * @returns A promise that resolves when the action has completed.
 */
export const createTables = async (): Promise<void> => {
  const tables = [
    CREATE_QUESTIONS_TABLE,
    CREATE_USED_QUESTIONS_TABLE,
    CREATE_WINNERS_TABLE
  ];
  await Promise.all(tables.map(table => getDB().run(table)));
};

/**
 *  Insert a new 'question' into the question database
 *
 * @param content          | The question to be asked
 * @param correctAnswer    | The correct answer
 * @param incorrectAnswers | An array of incorrect answers
 * @param external         | Whether the question has been imported
 * @returns A promise that resolves when the action has completed.
 */
export const insertQuestion = (
  content: string,
  correctAnswer: string,
  incorrectAnswers: Array<string>,
  external: boolean
): Promise<?mixed> =>
  getDB().run(INSERT_QUESTION, [
    content,
    correctAnswer,
    incorrectAnswers.join('|'),
    external
  ]);

/**
 *  Insert a new 'used question' into the database
 *
 * @param questionID | The ID of the question that was used
 * @param cancelled  | Whether or not the question was cancelled before completion
 * @param duration   | The duration that the question was run for
 * @param prize      | The prize value set for the question
 * @param winners    | The viewers who answered the question correctly
 * @returns A promise that resolves when the action has completed.
 */
export const insertUsedQuestion = async (
  questionID: number,
  cancelled: boolean,
  duration: number,
  prize: number,
  winners: Array<string>
): Promise<void> => {
  await getDB().run(INSERT_USED_QUESTION, [
    questionID,
    cancelled ? 1 : 0,
    Math.floor(new Date() / 1000),
    duration,
    prize
  ]);
  const lastInsert = await getLastInsertedRow();
  await Promise.all(winners.map(winner => insertWinner(winner, lastInsert)));
};

/**
 *  Insert a new 'winner' into the database
 *
 * @param name           | The name of the winner
 * @param usedQuestionID | The 'used question' that this relates to
 * @returns A promise that resolves when the action has completed.
 */
export const insertWinner = async (
  name: string,
  usedQuestionID: number
): Promise<void> => {
  await getDB().run(INSERT_WINNER, [name, usedQuestionID]);
};

/**
 *  Gets the row ID of the last inserted entity
 *
 * @returns A promise that resolves with said ID
 */
export const getLastInsertedRow = async (): Promise<number> =>
  (await getDB().get(GET_LAST_INSERTED_ROW))['last_insert_rowid()'];

/**
 *  Get how many questions in total are stored
 *
 * @returns A promise that resolves to the number of questions stored.
 */
export const getQuestionCount = async (): Promise<number> =>
  (await getDB().get(GET_QUESTION_COUNT))['COUNT(*)'];

/**
 *  Gets the number of 'used question' entities stored in the database
 * @returns A promise that resolves with said number
 */
export const getUsedQuestionCount = async (): Promise<number> =>
  (await getDB().get(GET_USED_QUESTION_COUNT))['COUNT(*)'];

/**
 *  Retrieve a specific question by ID
 *
 * @param id | The ID of the question to be retrieved
 * @returns A promise that resolves with the question, once retrieved.
 */
export const getQuestionByID = async (id: number): Promise<QuestionType> =>
  parseRawQuestion(await getDB().get(GET_QUESTION_BY_ID, [id]));

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
  page: number,
  numQuestions: number = 10
): Promise<Array<QuestionType>> =>
  (await getDB().all(GET_QUESTION_SELECTION, [
    numQuestions,
    page * numQuestions
  ])).map(parseRawQuestion);

/**
 *  Gets a list of 'used question' entities, with certain sorting and
 *  filtering parameters
 *
 * @param sortBy           | The column name to sort the results by
 * @param sortOrder        | Whether to sort in ascending or descending order
 * @param includeExternal  | Whether to include imported questions
 * @param questionSearch   | A search query for filtering results by question
 * @param page             | What 'page' of 'used question' entities to return
 * @param numUsedQuestions | How many 'used question' entities are on each 'page'
 * @returns A promise that resolves with the requested list of 'used question' entities
 */
export const getUsedQuestionList = async (
  sortBy: string,
  sortOrder: string,
  includeExternal: boolean,
  questionSearch: string,
  page: number,
  numUsedQuestions: number = 10
): Promise<Array<UsedQuestionType>> => {
  const cancelledFilter = includeExternal ? '' : ' AND cancelled != 1';

  const queryParts = [
    GET_USED_QUESTION_PARTIAL_1,
    `WHERE content LIKE "%${questionSearch}%"${cancelledFilter}`,
    GET_USED_QUESTION_PARTIAL_2,
    `ORDER BY ${sortBy}`,
    sortOrder,
    `LIMIT ${numUsedQuestions} OFFSET ${page * numUsedQuestions}`
  ];
  const query = queryParts.join(' ');

  return (await getDB().all(query)).map(parseRawUsedQuestion);
};

/**
 *  Gets a list of which viewers have won the most quiz questions
 *
 * @param amount | The maximum number of viewers to display (defaults to 50)
 * @returns A promise that resolves with a list of `winner` objects
 */
export const getTopWinners = async (
  amount: number = 50
): Promise<Array<WinnerTotalType>> =>
  (await getDB().all(GET_TOP_WINNERS, [amount])).map(parseRawWinnerTotal);

/**
 *  Delete all questions that have been stored
 *
 * @returns A promise that resolves when the action has completed.
 */
export const deleteAllQuestions: () => Promise<?mixed> = () =>
  getDB().run(DELETE_ALL_QUESTIONS);

/**
 *  Delete a specific question by ID
 *
 * @param id | The ID of the question to be deleted
 * @returns A promise that resolves when the action has completed.
 */
export const deleteQuestionByID = (id: number): Promise<?mixed> =>
  getDB().run(DELETE_QUESTION_BY_ID, [id]);
