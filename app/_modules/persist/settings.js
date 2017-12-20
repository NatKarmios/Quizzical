// @flow
import { sep } from 'path';

import { cloneObject, getDataDir, readFile, writeFile, fileExists } from '../../utils/helper_funcs';


const SETTINGS_FILENAME = 'settings.json';
const SETTINGS_FILE_PATH = `${getDataDir()}${sep}${SETTINGS_FILENAME}`;

const defaultSettings = {
  login: {
    streamerAuthToken: null,
    botAuthToken: null
  }
};

let settingsAreLoaded: boolean = false;

// <editor-fold desc="Object key types">

type SettingsCategoryType = $Keys<typeof defaultSettings>;

type LoginSettingKeyType = $Keys<typeof defaultSettings.login>;


type SettingKeyType = LoginSettingKeyType;

// </editor-fold>


const settings = cloneObject(defaultSettings);


const checkLoaded = () => {
  if (!settingsAreLoaded) throw new Error('Settings haven\'t been loaded yet!');
};

const processLoadedSettings = loaded => {
  const processSetting = (category, settingKey) => {
    const loadedSetting = loaded[category][settingKey];
    if (loadedSetting !== null && loadedSetting !== undefined) {
      settings[category][settingKey] = loadedSetting;
    }
  };

  const processCategory = category => {
    if (typeof loaded[category] === 'object') {
      // Iterate through category settings
      Object.keys(settings[category]).forEach(settingKey => {
        processSetting(category, settingKey);
      });
    }
  };

  // Iterate through setting categories
  Object.keys(settings).forEach(category => {
    processCategory(category);
  });
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
  processLoadedSettings(loadedSettings);
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
  } catch (e) { console.error(e); }
};

export const getSetting = (category, settingKey) => {
  checkLoaded();
  return settings[category][settingKey];
};

// </editor-fold>
