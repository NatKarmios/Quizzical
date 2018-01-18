// @flow
import sqlite3 from 'sqlite3';
import { sep } from 'path';
import { getDataDir } from '../utils/helperFuncs';

const DB_FILENAME = 'db.sqlite';
const DB_PATH = `${getDataDir()}${sep}${DB_FILENAME}`;

let db = null;

export const loadDB = () =>
  new Promise(resolve => {
    db = new sqlite3.Database(DB_PATH, sqlite3.OPEN_READWRITE, () => resolve());
  });
