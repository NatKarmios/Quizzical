// @flow

export const SETTINGS_PANEL_EXPANDED = 'SETTINGS_PANEL_EXPANDED';

export const expandPanel = (oldPanel, newPanel: number) => {
  return {
    type: SETTINGS_PANEL_EXPANDED,
    payload: {
      expanded: oldPanel === newPanel ? 0 : newPanel
    }
  }
};
