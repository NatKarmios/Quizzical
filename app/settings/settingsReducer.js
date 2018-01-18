// @flow

import { getSetting } from '../_modules/savedSettings';
import { SETTINGS_PANEL_EXPANDED, TEMP_SETTING_UPDATE, CLEAR_TEMP_SETTINGS } from './settingsActions';
import {cloneObject} from '../utils/helperFuncs';

export type SettingsStateType = {
  expanded: number,
  tempSettings: {}
}

const defaultState = {
  expanded: 0,
  tempSettings: {}
};

export default function settings(
  state: SettingsStateType = defaultState,
  { type, payload }
) {
  switch (type) {
    case SETTINGS_PANEL_EXPANDED:
      const { expanded } = payload;
      if (expanded !== undefined && expanded !== null) {
        return { ...state, expanded };
      }
      break;
    case TEMP_SETTING_UPDATE:
      const { category, label, value } = payload;
      const newTempSettings = cloneObject(state.tempSettings);
      const savedValue = getSetting(category, label);
      if (newTempSettings[category] === null || newTempSettings[category] === undefined)
        newTempSettings[category] = {};
      newTempSettings[category][label] = savedValue === value ? null : value;
      return { ...state, tempSettings: newTempSettings };
    case CLEAR_TEMP_SETTINGS:
      return { ...state, tempSettings: {} };
    default:
      return state;
  }
}
