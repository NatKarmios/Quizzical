// @flow

import type { ActionType } from '../../utils/types';

import { CHANGE_TAB } from './rightPaneTabsActions';


type RightPaneTabsState = {
  tab: number;
};


const defaultState = {
  tab: 0
};


const rightPaneTabs = (state: RightPaneTabsState = defaultState, action: ActionType) => {
  if (action.type === CHANGE_TAB) {
    if (
      action.payload !== undefined && action.payload !== null
      && action.payload.value !== undefined && action.payload.value !== null
    ) {
      return { ...state, tab: action.payload.value };
    }
  }  return state;
};


export default rightPaneTabs;
