// @flow

import { List } from 'immutable';

import { getSetting } from '../_modules/savedSettings';
import { SETTINGS_PANEL_EXPANDED, TEMP_SETTING_UPDATE, CLEAR_TEMP_SETTINGS } from './settingsActions';
import { cloneObject } from '../utils/helperFuncs';
import type { ActionType } from '../utils/types';

export type SettingsStateType = {
  expanded: number,
  errorFields: List<string>,
  tempSettings: {}
};

const defaultState = {
  expanded: 0,
  errorFields: List(),
  tempSettings: {}
};

export default (
  state: SettingsStateType = defaultState,
  { type, payload }: ActionType
) => {
  if (type === SETTINGS_PANEL_EXPANDED) {
    if (
      payload !== undefined && payload !== null
      && payload.expanded !== undefined && payload.expanded !== null
    ) {
      return { ...state, expanded: payload.expanded };
    }
  } else if (type === TEMP_SETTING_UPDATE) {
    if (
      payload !== undefined && payload !== null && typeof payload === 'object'
      // $FlowFixMe
      && payload.settings !== undefined && payload.settings !== null
        && typeof payload.settings === 'object'
      && payload.category !== undefined && payload.category !== null
        && typeof payload.category === 'string'
      && payload.label !== undefined && payload.label !== null
        && typeof payload.label === 'string'
      && payload.validator !== undefined && payload.validator !== null
    ) {
      const { settings, category, label, value, validator } = payload;
      const newTempSettings = cloneObject(state.tempSettings);
      const savedValue = getSetting(settings, category, label);
      if (newTempSettings[category] === null || newTempSettings[category] === undefined) {
        newTempSettings[category] = {};
      }
      newTempSettings[category][label] = savedValue === value ? null : value;

      let errorFields: List<string> = state.errorFields;
      const fieldTag = `${category}_${label}`;
      // $FlowFixMe
      const valid = validator(value);
      if (!errorFields.includes(fieldTag) && !valid) {
        errorFields = errorFields.push(fieldTag);
      } else if (errorFields.includes(fieldTag) && valid) {
        errorFields = errorFields.remove(errorFields.indexOf(fieldTag));
      }

      return { ...state, tempSettings: newTempSettings, errorFields };
    }
  } else if (type === CLEAR_TEMP_SETTINGS) {
    return { ...state, tempSettings: {}, errorFields: List() };
  } else {
    return state;
  }
};
