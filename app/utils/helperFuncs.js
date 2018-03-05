import fs from 'fs';
import rp from 'request-promise-native';
import { BrowserWindow, remote } from 'electron';
import Noty from 'noty';

import { getState } from '../store';


const { app } = remote;

const NATURAL_NUMBER = RegExp('^([1-9]\\d*)?$');
const INTEGER = RegExp('^-?\\d*$');


export const restart: () => void =
  () => {
    app.relaunch();
    app.exit(0);
  };

export const delay: number => Promise<void> =
  t => new Promise((resolve) => { setTimeout(resolve, t); });

export const getWindow: () => BrowserWindow =
  () => remote.getCurrentWindow();

export const cloneObject =
  <T>(obj: T): T => JSON.parse(JSON.stringify(obj));

export const getDataDir =
  (): string => app.getPath('userData');

export const readFile: string => Promise<string> =
  filename => new Promise((resolve, reject) => fs.readFile(filename,
    (err, data) => ((err !== null && err !== undefined) ? reject(err) : resolve(data.toString()))
  ));

export const writeFile: (string, string) => Promise<void> =
  (filename, contents) => new Promise((resolve, reject) => fs.writeFile(filename, contents,
    err => ((err !== null && err !== undefined) ? reject(err) : resolve())
  ));

export const fileExists: string => Promise<boolean> =
  filename => new Promise(resolve => fs.access(filename,
    err => resolve((err === null || err === undefined))
  ));

export const httpGet = async options => rp({ method: 'GET', ...options });

export const decodeHtml = html => {
  const txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
};

export const isNaturalNumber = str =>
  NATURAL_NUMBER.test(str);

export const isInteger = str =>
  INTEGER.test(str);

export const notify = (text, type = 'info', timeout = 3000) =>
  new Noty({
    type,
    text,
    timeout,
    layout: 'bottomRight',
    progressBar: true,
  }).show();

export const shuffleArray = arr =>
  arr.map(a => [Math.random(), a])
     .sort((a, b) => a[0] - b[0])
     .map(a => a[1]);

export const range = (length, offset = 0) =>
  Array.from({ length }, (x, i) => i + offset);

export const formatWithContext = (str, context) => {
  const state = getState();
  const { settings, login } = state.global;
  let newStr = str;

  const fullContext = {
    pointName: settings.misc.pointName,
    pointsName: settings.misc.pointsName,
    streamer: login.streamer.displayName,
    bot: login.bot.displayName,
    ...context
  };

  Object.keys(fullContext).forEach(key => {
    newStr = newStr.replace(`{${key}}`, fullContext[key]);
  });
  return newStr;
};

export const numPages = (count, pageSize = 10) =>
  Math.max(Math.ceil(count / pageSize), 1);

