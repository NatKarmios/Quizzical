// @flow

import { createLogic } from 'redux-logic';

import { loadSettings, saveSettings } from '../../_modules/savedSettings';
import { testSavedTokens } from '../login/loginActions';
import { notify } from '../../utils/helperFuncs';
import { testConnection } from '../../_modules/streamlabsBot';

import {
  LOAD_SETTINGS, SETTINGS_LOADED, CHANGE_SETTINGS, settingsLoaded, settingsReady, settingsChanged
} from './settingsActions';

/*
 * These logics are largely used to chain Redux actions.
 * Not much actual logic.
 */


/**
 *  The logic to load settings from a file.
 */
const loadSettingsLogic = createLogic({
  type: LOAD_SETTINGS,
  process: async ({ action }, dispatch, done) => {
    // Load settings from file
    const settings = await loadSettings();

    dispatch(settingsLoaded(settings));
    done();
  }
});


/**
 *  The logic for when settings have been loaded.
 */
const settingsLoadedLogic = createLogic({
  type: SETTINGS_LOADED,
  process: async ({ action }, dispatch, done) => {
    dispatch(settingsReady());
    done();
  }
});


/**
 *  The logic for when settings are ready to be used.
 */
const settingsReadyLogic = createLogic({
  type: SETTINGS_LOADED,
  process: async ({ action }, dispatch, done) => {
    // Test connection to StreamLabs Bot
    testConnection().catch();

    // Attept to log in with saved Twitch authentication tokens
    dispatch(testSavedTokens());

    done();
  }
});


/**
 *  The logic for when settings are being changed
 */
const changeSettingsLogic = createLogic({
  type: CHANGE_SETTINGS,
  process: async ({ getState }, dispatch, done) => {
    // Save modified settings
    await saveSettings(getState().global.settings);

    // Notify the streamer that settings have been saved.
    notify('Settings saved.', 'success');

    dispatch(settingsChanged());
    done();
  }
});

export default [
  loadSettingsLogic,
  settingsLoadedLogic,
  settingsReadyLogic,
  changeSettingsLogic
];
