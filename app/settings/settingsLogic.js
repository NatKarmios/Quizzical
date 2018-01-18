// @flow
import { createLogic } from 'redux-logic';
import {mergeOntoSettings, saveSettings} from "../_modules/savedSettings";
import {clearTempSettings, SAVE_TEMP_SETTINGS} from "./settingsActions";

const saveTempSettingsLogic = createLogic({
  type: SAVE_TEMP_SETTINGS,
  process: async ({ getState }, dispatch, done) => {
    const { tempSettings } = getState().settings;
    console.log(tempSettings);
    mergeOntoSettings(tempSettings);
    await saveSettings();
    dispatch(clearTempSettings());
    done();
  }
});

export default [
  saveTempSettingsLogic
];
