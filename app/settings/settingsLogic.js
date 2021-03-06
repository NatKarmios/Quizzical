// @flow

import { createLogic } from 'redux-logic';

import { changeSettings } from '../_global/settings/settingsActions';

import { clearTempSettings, SAVE_TEMP_SETTINGS } from './settingsActions';


const saveTempSettingsLogic = createLogic({
  type: SAVE_TEMP_SETTINGS,
  process: async ({ getState }, dispatch, done) => {
    const { tempSettings } = getState().settings;
    dispatch(clearTempSettings());
    dispatch(changeSettings(tempSettings));
    done();
  }
});

export default [
  saveTempSettingsLogic
];
