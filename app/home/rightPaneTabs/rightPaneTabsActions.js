// @flow

export const CHANGE_TAB = 'HOME_RIGHT_PANE_CHANGE_TAB';


export const changeTab = (value: number) => ({
  type: CHANGE_TAB,
  payload: { value }
});
