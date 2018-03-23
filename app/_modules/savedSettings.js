// @flow

import { sep } from 'path';

import {
  cloneObject,
  getDataDir,
  readFile,
  writeFile,
  fileExists
} from '../utils/helperFuncs';
import type { SettingsType } from '../utils/types';

const SETTINGS_FILENAME: string = 'settings.json';
const SETTINGS_FILE_PATH: string = `${getDataDir()}${sep}${SETTINGS_FILENAME}`;

const DEFAULT_SETTINGS = {
  login: {
    streamerAuthToken: null,
    botAuthToken: null
  },
  chatMessages: {
    joinMessage: 'Quizzical initialized!',
    questionStarted:
      'A question has started for {prize}! You have {duration} seconds to answer; ' +
      "whisper your choice to me using '/w {bot} [choice]'.",
    showQuestion: 'Your question is: {question}',
    questionCancelled: 'Question cancelled.',
    questionEndNoWinners: 'Nobody answered correctly!',
    questionEndSingleWinner: 'Time is up! The winner is {winner}!',
    questionEndMultipleWinners: 'Time is up! The winners are {winners}!',
    answerReceived: 'Answer received!',
    alreadyAnswered: "You've already answered!",
    invalidAnswer: "That answer's invalid!"
  },
  misc: {
    pointName: 'point',
    pointsName: 'points',
    defaultPrize: '50',
    defaultDuration: '120'
  }
};

export const mergeOntoSettings = (
  settings: SettingsType,
  loaded: SettingsType
): SettingsType => {
  const newSettings = cloneObject(settings);
  const processCategory = (category: string) => {
    const processSetting = settingKey => {
      if (loaded[category] !== undefined && loaded[category] !== null) {
        const loadedSetting = loaded[category][settingKey];
        if (loadedSetting !== undefined) {
          newSettings[category][settingKey] = loadedSetting;
        }
      }
    };

    if (loaded[category] !== null && typeof loaded[category] === 'object') {
      // Iterate through category settings
      Object.keys(newSettings[category]).forEach(processSetting);
    }
  };

  // Iterate through setting categories
  Object.keys(settings).forEach(processCategory);
  return newSettings;
};

export const resetSettings = (settings: SettingsType) => {
  const { login } = settings;
  const newSettings = cloneObject(DEFAULT_SETTINGS);
  newSettings.login = login;
  return newSettings;
};

export const loadSettings = async (): SettingsType => {
  if (!await fileExists(SETTINGS_FILE_PATH)) {
    await saveSettings(DEFAULT_SETTINGS);
    return cloneObject(DEFAULT_SETTINGS);
  }
  let loadedSettings = {};
  try {
    const rawLoadedSettings = await readFile(SETTINGS_FILE_PATH);
    try {
      loadedSettings = JSON.parse(rawLoadedSettings);
    } catch (e2) {
      console.log('Failed to parse settings file:');
      console.log(e2);
    }
  } catch (e1) {
    console.log('Failed to read settings file:');
    console.log(e1);
  }
  return mergeOntoSettings(DEFAULT_SETTINGS, loadedSettings);
};

export const saveSettings = async (settings: SettingsType) => {
  await writeFile(SETTINGS_FILE_PATH, JSON.stringify(settings, null, '    '));
};

// <editor-fold desc="Get / Set">

export const setSetting = async (
  settings: SettingsType,
  category: string,
  settingKey: string,
  newVal: ?string
) => {
  const newSettings: SettingsType = cloneObject(settings);
  try {
    newSettings[category][settingKey] = newVal;
  } catch (e) {
    if (e !== undefined && e !== null) console.error(e);
  }

  return newSettings;
};

export const getSetting = (
  settings: ?SettingsType,
  category: string,
  settingKey: string
) => {
  if (settings !== undefined && settings !== null) {
    if (settings[category] !== null && settings[category] !== undefined) {
      const settingCategory = settings[category];
      if (
        settingCategory[settingKey] !== null &&
        settings[category][settingKey] !== undefined
      ) {
        return settings[category][settingKey];
      }
    }
  }
  return null;
};

export const getDefaultSetting = (category: string, settingKey: string) => {
  if (
    DEFAULT_SETTINGS[category] !== null &&
    DEFAULT_SETTINGS[category] !== undefined
  ) {
    return DEFAULT_SETTINGS[category][settingKey];
  }
  return null;
};

// </editor-fold>
