// @flow

export const SETTINGS_PANEL_EXPANDED = 'SETTINGS_PANEL_EXPANDED';
export const TEMP_SETTING_UPDATE = 'TEMP_SETTING_UPDATE';
export const SAVE_TEMP_SETTINGS = 'SAVE_TEMP_SETTINGS';
export const CLEAR_TEMP_SETTINGS = 'CLEAR_TEMP_SETTINGS';

export const expandPanel = (oldPanel, newPanel: number) => ({
  type: SETTINGS_PANEL_EXPANDED,
  payload: { expanded: oldPanel === newPanel ? 0 : newPanel }
});

export const updateTempSetting = (settings, category: string, label: string, value, validator=()=>true) => ({
  type: TEMP_SETTING_UPDATE,
  payload: { settings, category, label, value, validator }
});

export const saveTempSettings = () => ({ type: SAVE_TEMP_SETTINGS });

export const clearTempSettings = () => ({ type: CLEAR_TEMP_SETTINGS });
