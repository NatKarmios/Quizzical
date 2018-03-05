// @flow
// eslint-disable-next-line import/extensions
import sqlite from 'sqlite';
import { sep } from 'path';
import { getDataDir } from '../../utils/helperFuncs';
import { createTable } from './dbQueries';

const DB_FILENAME = 'db.sqlite';
const DB_PATH = `${getDataDir()}${sep}${DB_FILENAME}`;

let db;
export const getDB = () => db;

const loadDB = async () => {
  db = await sqlite.open(DB_PATH, { Promise });
  console.log(`Opened SQLite DB at \`${DB_PATH}\``);
};

export const setUpDB = async () => {
  await loadDB();
  await createTable();
};
