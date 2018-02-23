// @flow

import {CHANGE_SETTINGS, SETTINGS_LOADED} from "./settingsActions";
import {mergeOntoSettings} from "../../_modules/savedSettings";

const settings = (state=null, { type, payload }) => {
  switch (type) {
    case SETTINGS_LOADED:
      const { settings } = payload;
      return settings;
    case CHANGE_SETTINGS:
      const { changes } = payload;
      return mergeOntoSettings(state, changes);

  }

  return state;
};

export default settings;
