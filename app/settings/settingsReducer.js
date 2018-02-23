// @flow

import { List } from 'immutable';

import { getSetting } from '../_modules/savedSettings';
import { SETTINGS_PANEL_EXPANDED, TEMP_SETTING_UPDATE, CLEAR_TEMP_SETTINGS } from './settingsActions';
import { cloneObject } from '../utils/helperFuncs';

export type SettingsStateType = {
  expanded: number,
  errorFields: List<string>,
  tempSettings: {}
}

const defaultState = {
  expanded: 0,
  errorFields: List(),
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
      const { settings, category, label, value, validator } = payload;
      const newTempSettings = cloneObject(state.tempSettings);
      const savedValue = getSetting(settings, category, label);
      if (newTempSettings[category] === null || newTempSettings[category] === undefined)
        newTempSettings[category] = {};
      newTempSettings[category][label] = savedValue === value ? null : value;

      let errorFields: List<string> = state.errorFields;
      const fieldTag = `${category}_${label}`;
      const valid = validator(value);
      if (!errorFields.includes(fieldTag) && !valid)
        errorFields = errorFields.push(fieldTag);
      else if (errorFields.includes(fieldTag) && valid)
        errorFields = errorFields.remove(errorFields.indexOf(fieldTag));

      return { ...state, tempSettings: newTempSettings, errorFields };
    case CLEAR_TEMP_SETTINGS:
      return { ...state, tempSettings: {}, errorFields: List() };
    default:
      return state;
  }
}
