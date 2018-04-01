import fs from 'fs';
import rp from 'request-promise-native';
import { BrowserWindow, remote } from 'electron';
import Noty from 'noty';

import { getState } from '../store';

const { app } = remote;

// The RegEx pattern for a natural number (i.e. a whole number greater than 0)
const NATURAL_NUMBER = RegExp('^([1-9]\\d*)?$');

// The RegEx pattern for an integer (i.e. any whole number)
const INTEGER = RegExp('^-?\\d*$');

/**
 *  Restarts Quizzical
 */
export const restart: () => void = () => {
  // Launch a new instance of Quizzical
  app.relaunch();

  // Close the current instance of Quizzical
  app.exit(0);
};

/**
 *  Delays for a certain number amount of time; effectively a
 *  promise-ified version of `setTimeout()`
 *
 * @param t | The amount of time to sleep for, in milliseconds
 * @returns A promise that resolves when the delay has finished
 */
export const delay: number => Promise<void> = t =>
  new Promise(resolve => {
    setTimeout(resolve, t);
  });

/**
 *  Gets Quizzical's main window via Electron's API
 *
 * @returns Quizzical's main window
 */
export const getWindow: () => BrowserWindow = () => remote.getCurrentWindow();

/**
 *  Clone an object by converting it to JSON and back
 *
 * @param obj | The object to clone
 * @returns The cloned object
 */
export const cloneObject = <T>(obj: T): T => JSON.parse(JSON.stringify(obj));

/**
 *  Gets the path to Quizzical data directory, via Electron's API
 *
 * @returns The path to the data directory
 */
export const getDataDir = (): string => app.getPath('userData');

/**
 *  Reads a file from disk
 *
 * @param filename | The path to the file to be read
 * @returns A promise that resolves with the file's contents
 */
export const readFile: string => Promise<string> = filename =>
  new Promise((resolve, reject) =>
    fs.readFile(
      filename,
      (err, data) =>
        err !== null && err !== undefined
          ? reject(err)
          : resolve(data.toString())
    )
  );

/**
 *  Write a string to a file on disk
 *
 * @param filename | The path of the file to be written to
 * @param contents | The contents of the file to be written
 * @returns A promise that resolves once the action has completed
 */
export const writeFile: (string, string) => Promise<void> = (
  filename,
  contents
) =>
  new Promise((resolve, reject) =>
    fs.writeFile(
      filename,
      contents,
      err => (err !== null && err !== undefined ? reject(err) : resolve())
    )
  );

/**
 *  Checks if a file exists
 *
 * @param filename | The path to the file to check
 * @returns Whether or not the file exists
 */
export const fileExists: string => Promise<boolean> = filename =>
  new Promise(resolve =>
    fs.access(filename, err => resolve(err === null || err === undefined))
  );

/**
 *  A wrapper function for HTTP requests
 *
 *  The request library I used changed a few times through development.
 *  so I used this wrapper function to ease the pains somewhat
 *
 * @param options | The options to be passed to the HTTP request
 * @returns A promise that resolves to the result of the request
 */
export const httpGet = async options => rp({ method: 'GET', ...options });

/**
 *  Decodes a HTML-encoded string;
 *  this is achieved by rendering the string inside of a 'textarea'
 *  component that is kept separate from the DOM, and getting its contents
 *
 * @param html | The string to be decoded
 * @returns The decoded string
 */
export const decodeHtml = html => {
  const txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
};

/**
 *  Checks whether a string is a natural number
 *
 * @param str | The string to be checked
 * @returns Whether the string is a natural number
 */
export const isNaturalNumber = str => NATURAL_NUMBER.test(str);

/**
 *  Checks whether a string is an integer
 *
 * @param str | The string to be checked
 * @returns Whether the string is an integer
 */
export const isInteger = str => INTEGER.test(str);

/**
 *  Wrapper function for Noty; creates a small notification at the bottom-right
 *  of the Quizzical window, which disappears after a short time
 * @param text    | The text of the notification
 * @param type    | The type of notification
 *                | (i.e. 'info', 'warning', 'error', 'success')
 * @param timeout | The time, in milliseconds, that the notification is visible for
 */
export const notify = (text, type = 'info', timeout = 3000) =>
  new Noty({
    type,
    text,
    timeout,
    layout: 'bottomRight',
    progressBar: true
  }).show();

/**
 *  Shuffles an array, putting its items in random order
 *
 * @param arr | The array to be shuffled
 * @returns The shuffled array
 */
export const shuffleArray = arr =>
  arr
    // Map the array items to pairs, with a random number as the other item
    .map(a => [Math.random(), a])
    // Sort this mapped array by the random numbers
    .sort((a, b) => a[0] - b[0])
    // Map the pairs back into the original values
    .map(a => a[1]);

/**
 *  Generates a range of values in an array
 *
 * @param length | The length of the range
 * @param offset | The range's offset
 * @returns The generated array
 */
export const range = (length, offset = 0) =>
  Array.from({ length }, (x, i) => i + offset);

/**
 *  Formats a string using a given 'context' object; if the string
 *  contains a key from the context object in braces, it will be replaced
 *
 *  For example: `formatWithContext('{var}!', { var: 'Hello' } )`
 *  would give 'Hello!'
 *
 * @param str     | The string to be formatted
 * @param context | The context to format the string with
 * @returns The formatted string
 */
export const formatWithContext = (str, context) => {
  // Get global state
  const state = getState();
  const { settings, login } = state.global;

  let newStr = str;

  // Combine the supplied context object with some values from
  // global state to give the full context object
  const fullContext = {
    pointName: settings.misc.pointName,
    pointsName: settings.misc.pointsName,
    streamer: login.streamer.displayName,
    bot: login.bot.displayName,
    ...context
  };

  // For each key in the full context object...
  Object.keys(fullContext).forEach(key => {
    // Replace any occurence of that key in braces in the string, with the object's
    // value for that key
    newStr = newStr.replace(`{${key}}`, fullContext[key]);
  });

  return newStr;
};

/**
 *  Calculate how many 'pages' a list of items contains, given a particular page size
 *
 * @param count    | The amount of items in total
 * @param pageSize | The number of items on each 'page'
 * @returns The number of pages
 */
export const numPages = (count, pageSize = 10) =>
  Math.max(Math.ceil(count / pageSize), 1);

/**
 *  Converts a cardinal number to an ordinal number,
 *  i.e. 1 -> '1st'
 *
 * @param x | The number to convert
 * @returns The ordinal version of the number
 */
export const ordinal = (x: number) => {
  // There is a special case in the general pattern, when the number
  // ends in 11, 12, or 13; in this case, the suffix is 'th'
  const specialCase = x % 100;
  if ([11, 12, 13].includes(specialCase) >= 0) {
    return `${x}th`;
  }

  // Outside of the special case, the result depends only on the last digit
  const units = x % 10;

  // Select the appropriate suffix for the last digit
  let end;
  switch (units) {
    case 1:
      end = 'st';
      break;
    case 2:
      end = 'nd';
      break;
    case 3:
      end = 'rd';
      break;
    default:
      end = 'th';
  }

  // Return the combined number and suffix
  return `${x}${end}`;
};

/**
 *  Generates a string based on the time part of a Date object
 *
 * @param date | The date that holds the time values
 * @returns The string-representation of the time
 */
export const getTimeString = (date: Date) => {
  // Get the number of hours
  const hours = date.getHours();

  // Get the number of minutes
  const rawMins = date.getMinutes();

  // Zero-pad the number of minutes so it is 2 characters long
  const mins = `${rawMins < 10 ? '0' : ''}${rawMins}`;

  // Ascertain whether the time is AM or PM
  const amOrPm = hours < 12 ? 'AM' : 'PM';

  // Combine and return
  return `${hours % 12}:${mins} ${amOrPm}`;
};

/**
 *  Generates a string based on the date part of a Date object
 *
 * @param date | The date that holds the date values
 * @returns The string-representation of the date
 */
export const getDateString = (date: Date) => {
  // Get the year
  const year = date.getFullYear();

  // Get the month and convert it to its full-word representation
  const month = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ][date.getMonth()];

  // Get the day and convert it to an ordinal number
  const day = ordinal(date.getDate());

  // Combine and return
  return `${day} ${month} ${year}`;
};
