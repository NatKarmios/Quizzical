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

// <editor-fold desc="Constants">

// The name of the settings file
const SETTINGS_FILENAME: string = 'settings.json';

// The path to the settings file
const SETTINGS_FILE_PATH: string = `${getDataDir()}${sep}${SETTINGS_FILENAME}`;

// The default values of all of the settings
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

// </editor-fold>

/**
 *  Merges a partial settings object onto an existing settings object
 *
 * @param settings | The existing settings
 * @param loaded   | The new settings to merge
 * @returns The new settings object
 */
export const mergeOntoSettings = (
  settings: SettingsType,
  loaded: SettingsType
): SettingsType => {
  // Create a clone of the existing settings object for the new settings
  const newSettings = cloneObject(settings);

  // This is a helper function that processes a category of settings
  const processCategory = (category: string) => {
    // This is a helper function that processes a particular setting
    const processSetting = settingKey => {
      // If the category exists in the loaded settings...
      if (loaded[category] !== undefined && loaded[category] !== null) {
        // ...get the value of the setting from the loaded setting's category
        const loadedSetting = loaded[category][settingKey];

        // If the loaded setting exists...
        if (loadedSetting !== undefined) {
          // ...insert it into the new settings object
          newSettings[category][settingKey] = loadedSetting;
        }
      }
    };

    // If the category exists in the loaded settings object...
    if (loaded[category] !== null && typeof loaded[category] === 'object') {
      // ...process each setting in the category
      Object.keys(newSettings[category]).forEach(processSetting);
    }
  };

  // Process each category in settings
  Object.keys(settings).forEach(processCategory);

  return newSettings;
};

/**
 *  Reset all saved settings, whilst retaining the login data
 *
 * @param settings | The settings object
 * @returns The new settings object
 */
export const resetSettings = (settings: SettingsType) => {
  // Extract login data from settings
  const { login } = settings;

  // Create a clone of the default settings for the new settings
  const newSettings = cloneObject(DEFAULT_SETTINGS);

  // Insert the login data into the new settings
  newSettings.login = login;

  return newSettings;
};

/**
 *  Load settings from the file
 *
 * @returns A promise that resolves with the loaded settings
 */
export const loadSettings = async (): SettingsType => {
  // If the settings file doesn't exist...
  if (!await fileExists(SETTINGS_FILE_PATH)) {
    // Save the default settings to the file
    await saveSettings(DEFAULT_SETTINGS);

    // Use the default settings
    return cloneObject(DEFAULT_SETTINGS);
  }

  let loadedSettings = {};

  try {
    // Attempt to load the settings file
    const rawLoadedSettings = await readFile(SETTINGS_FILE_PATH);

    // Attempt to parse the settings from JSON
    loadedSettings = JSON.parse(rawLoadedSettings);
  } catch (e) {
    console.warn('Failed to read settings file:');
    console.warn(e);
  }

  // Merge the loaded settings onto the default settings
  return mergeOntoSettings(DEFAULT_SETTINGS, loadedSettings);
};

/**
 *  Save settings to disk
 *
 * @param settings | The settings to be saved
 * @returns A promise that resolves once the action is completed
 */
export const saveSettings = async (settings: SettingsType) => {
  await writeFile(SETTINGS_FILE_PATH, JSON.stringify(settings, null, '    '));
};

// <editor-fold desc="Get / Set">

/**
 *  Set a particular setting in the settings object
 *
 * @param settings   | The existing settings object
 * @param category   | The category of the setting being changed
 * @param settingKey | The key of the setting being changed
 * @param newVal     | The changed setting's new value
 * @returns A promise that resolves with the new settings object
 */
export const setSetting = async (
  settings: SettingsType,
  category: string,
  settingKey: string,
  newVal: ?string
) => {
  // Clone the existing settings
  const newSettings: SettingsType = cloneObject(settings);

  try {
    // Attempt to set the new settings value
    newSettings[category][settingKey] = newVal;
  } catch (e) {
    if (e !== undefined && e !== null) console.error(e);
  }

  return newSettings;
};

/**
 *  Attempt to get a setting from the settings object.
 *  This is mostly a helper function to play nice with Flow and
 *  cut down a little on boilerplate
 *
 * @param settings   | The settings object
 * @param category   | The category of the desired setting
 * @param settingKey | The key of the desired setting
 * @returns The desired setting if it exists, otherwise null
 */
export const getSetting = (
  settings: ?SettingsType,
  category: string,
  settingKey: string
) => {
  // Verify the settings object exists
  if (settings !== undefined && settings !== null) {
    // Verify the setting's category exists
    if (settings[category] !== null && settings[category] !== undefined) {
      // Get the setting's value
      const settingCategory = settings[category];

      // Verify the setting exists
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

/**
 *  Gets a setting from the default settings object
 *
 * @param category   | The category of the desired default setting
 * @param settingKey | The key of the desired default setting
 * @returns The default setting's value
 */
export const getDefaultSetting = (category: string, settingKey: string) => {
  // Verify the default setting's category exists
  if (
    DEFAULT_SETTINGS[category] !== null &&
    DEFAULT_SETTINGS[category] !== undefined
  ) {
    return DEFAULT_SETTINGS[category][settingKey];
  }

  return null;
};

// </editor-fold>
