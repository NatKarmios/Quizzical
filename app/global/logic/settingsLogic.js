// @flow

import { createLogic } from 'redux-logic';

import {loadSettings, saveSettings} from '../../_modules/savedSettings';
import { LOAD_SETTINGS, SETTINGS_LOADED, CHANGE_SETTINGS, settingsLoaded, settingsReady, settingsChanged } from '../actions';
import { testSavedTokens } from '../actions';


const loadSettingsLogic = createLogic({
  type: LOAD_SETTINGS,
  process: async ({ action }, dispatch, done) => {
    const settings = await loadSettings();
    dispatch(settingsLoaded(settings));
    done();
  }
});

const settingsLoadedLogic = createLogic({
  type: SETTINGS_LOADED,
  process: async ({ action }, dispatch, done) => {
    dispatch(settingsReady());
    done();
  }
});

const settingsReadyLogic = createLogic({
  type: SETTINGS_LOADED,
  process: async ({ action }, dispatch, done) => {
    dispatch(testSavedTokens());
    done();
  }
});

const changeSettingsLogic = createLogic({
  type: CHANGE_SETTINGS,
  process: async ({ getState }, dispatch, done) => {
    await saveSettings(getState().global.settings);
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
