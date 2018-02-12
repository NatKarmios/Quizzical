import fs from 'fs';
import rp from 'request-promise-native';
import { remote, BrowserWindow } from 'electron';

const { app } = remote;

const NATURAL_NUMBER = RegExp('^([1-9]\\d*)?$');
const INTEGER = RegExp('^-?\\d*$');


export const restart: () => void =
  () => {
    const app = require('electron').remote.app;
    app.relaunch();
    app.exit(0);
  };

export const delay: number => Promise<void> =
  t => new Promise((resolve) => { setTimeout(resolve, t); });

export const getWindow: () => BrowserWindow =
  () => remote.getCurrentWindow();

export const cloneObject: <T>(t) => T =
    obj => JSON.parse(JSON.stringify(obj));

export const getDataDir: () => string =
  () => app.getPath('userData');

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
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
};

export const isNaturalNumber = str =>
  NATURAL_NUMBER.test(str);

export const isInteger = str =>
  INTEGER.test(str);
