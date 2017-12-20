import fs from 'fs';
import { remote, BrowserWindow } from 'electron';

const { app } = remote;


export const delay: number => Promise<void> =
  t => new Promise((resolve) => { setTimeout(resolve, t); });

export const getWindow: () => BrowserWindow =
  () => remote.getCurrentWindow();

export const cloneObject: <T>(t) => T =
    obj => JSON.parse(JSON.stringify(obj));

export const getDataDir: () => string =
  () => app.getPath('userData');

export const readFile: string => string =
  filename => new Promise((resolve, reject) => fs.readFile(filename,
    (data, err) => ((err !== null && err !== undefined) ? resolve(data) : reject(err))
  ));

export const writeFile: (string, string) => void =
  (filename, contents) => new Promise((resolve, reject) => fs.writeFile(filename, contents,
    err => ((err !== null && err !== undefined) ? resolve() : reject(err))
  ));

