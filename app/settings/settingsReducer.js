// @flow

import { SETTINGS_PANEL_EXPANDED } from "./settingsActions";

export type SettingsStateType = {
  expanded: number
}

const defaultState = { expanded: 0 };

export default function navbar(
  state: SettingsStateType = defaultState,
  { type, payload }
) {
  switch (type) {
    case SETTINGS_PANEL_EXPANDED:
      const { expanded } = payload;
      if (expanded !== undefined && expanded !== null) {
        console.log(`Expanded changed to ${expanded}`);
        return { expanded };
      }
      break;
    default:
      return state;
  }
}
