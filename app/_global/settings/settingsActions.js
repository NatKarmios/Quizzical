// @flow

import type { SettingsType } from '../../utils/types';

export const LOAD_SETTINGS = 'LOAD_SETTINGS';
export const SETTINGS_LOADED = 'SETTINGS_LOADED';
export const SETTINGS_READY = 'SETTINGS_READY';
export const CHANGE_SETTINGS = 'CHANGE_SETTINGS';
export const SETTINGS_CHANGED = 'SETTINGS_CHANGED';

export const loadSettings = () => ({ type: LOAD_SETTINGS });

export const settingsLoaded = (settings: SettingsType) => ({
  type: SETTINGS_LOADED,
  payload: { settings }
});

export const settingsReady = () => ({ type: SETTINGS_READY });

export const changeSettings = (changes: {}) => ({
  type: CHANGE_SETTINGS,
  payload: { changes }
});

export const settingsChanged = () => ({ type: SETTINGS_CHANGED });
