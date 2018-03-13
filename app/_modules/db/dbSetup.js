// @flow

// eslint-disable-next-line import/extensions
import sqlite from 'sqlite';
import { sep } from 'path';
import { getDataDir } from '../../utils/helperFuncs';
import { createTables } from './dbQueries';


// The filename of the SQLite database stored on disk
const DB_FILENAME = 'db.sqlite';

// The path to the SQLite database stored on disk
const DB_PATH = `${getDataDir()}${sep}${DB_FILENAME}`;

// The database object
let db;
// A function that gives other modules access to the `db` object
export const getDB = () => db;


/**
 *  Load the database from disk.
 *
 * @returns A promise that resolves when the database has been loaded.
 */
const loadDB = async () => {
  db = await sqlite.open(DB_PATH, { Promise });
  console.log(`Opened SQLite DB at \`${DB_PATH}\``);
};


/**
 *  Perform initialization steps for the database
 *
 * @returns A promise that resolves once initialization completes.
 */
export const setUpDB = async () => {
  // Load the database
  await loadDB();

  // Create any necessary tables that might not exist
  await createTables();
};
