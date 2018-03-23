// @flow

import { CHANGE_SETTINGS, SETTINGS_LOADED } from './settingsActions';
import { mergeOntoSettings } from '../../_modules/savedSettings';
import type { SettingsType, ActionType } from '../../utils/types';


type SettingsState = ?SettingsType;

/**
 *  Reducer for settings state
 *
 * @param state
 * @param type
 * @param payload
 * @returns The new settings state
 */
const settings = (state: SettingsState=null, { type, payload }: ActionType) => {
  switch (type) {
    case SETTINGS_LOADED:
      if (
        payload === null || payload === undefined
        || payload.settings === undefined || payload.settings === null
      ) {
        throw Error('Type error!');
      }
      return payload.settings;
    case CHANGE_SETTINGS:
      if (
        payload === null || payload === undefined
        || payload.changes === undefined || payload.changes === null
        || state === null || state === undefined
      ) {
        throw Error('Type error!');
      }

      // Merge the changes to me made to settings onto the
      // current settings state.
      // $FlowFixMe
      return mergeOntoSettings(state, payload.changes);
    default:
      return state;
  }
};

export default settings;
