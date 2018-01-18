// @flow
import { sep } from 'path';

import { cloneObject, getDataDir, readFile, writeFile, fileExists } from '../utils/helperFuncs';

const SETTINGS_FILENAME = 'settings.json';
const SETTINGS_FILE_PATH = `${getDataDir()}${sep}${SETTINGS_FILENAME}`;

const DEFAULT_SETTINGS = {
  login: {
    streamerAuthToken: null,
    botAuthToken: null
  },
  chatMessages: {
    joinMessage: 'Quizzical initialized!'
  }
};

let settingsAreLoaded: boolean = false;

// <editor-fold desc="Object key types">

type SettingsCategoryType = $Keys<typeof DEFAULT_SETTINGS>;

type LoginSettingKeyType = $Keys<typeof DEFAULT_SETTINGS.login>;


type SettingKeyType = LoginSettingKeyType;

// </editor-fold>


let settings = cloneObject(DEFAULT_SETTINGS);


const checkLoaded = () => {
  if (!settingsAreLoaded) throw new Error('Settings haven\'t been loaded yet!');
};

export const mergeOntoSettings = loaded => {
  const processCategory = category => {
    const processSetting = (settingKey) => {
      const loadedSetting = loaded[category][settingKey];
      if (loadedSetting !== undefined) {
        settings[category][settingKey] = loadedSetting;
      }
    };

    if (loaded[category] !== null && typeof loaded[category] === 'object') {
      // Iterate through category settings
      Object.keys(settings[category]).forEach(processSetting);
    }
  };

  // Iterate through setting categories
  Object.keys(settings).forEach(processCategory);
};

export const resetSettings = () => {
  const login = settings.login;
  settings = cloneObject(DEFAULT_SETTINGS);
  settings.login = login;
};

export const loadSettings = async () => {
  if (!await fileExists(SETTINGS_FILE_PATH)) {
    settingsAreLoaded = true;
    await saveSettings();
    return;
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
  mergeOntoSettings(loadedSettings);
  settingsAreLoaded = true;
  console.log('Settings loaded successfully.');
};

export const saveSettings = async () => {
  checkLoaded();
  await writeFile(SETTINGS_FILE_PATH, JSON.stringify(settings, null, '    '));
};

// <editor-fold desc="Get / Set">

export const setSetting = async (category, settingKey, newVal, save = true) => {
  checkLoaded();
  try {
    settings[category][settingKey] = newVal;
    if (save) await saveSettings();
  } catch (e) { if (e !== undefined && e !== null) console.error(e); }
};

export const getSetting = (category, settingKey) => {
  checkLoaded();
  if (settings[category] !== null && settings[category] !== undefined)
    return settings[category][settingKey];
  return null;
};

export const getDefaultSetting = (category, settingKey) => {
  if (DEFAULT_SETTINGS[category] !== null && DEFAULT_SETTINGS[category] !== undefined)
    return DEFAULT_SETTINGS[category][settingKey];
  return null;
};

// </editor-fold>
