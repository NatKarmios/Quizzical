// @flow

import type { ActionType, GlobalStateType } from './utils/types';

type StoreType = {
  getState: () => { global: GlobalStateType },
  dispatch: ActionType => ?mixed
};

let store: ?StoreType;

export const setStore = (newStore: StoreType) => {
  store = newStore;
};

export const getState = (): Object => {
  if (store === undefined || store === null) {
    throw Error('Attepted to get state before store has been initialized!');
  }
  return store.getState();
};

export const dispatch = (action: ActionType) => {
  if (store !== undefined && store !== null) {
    store.dispatch(action);
  } else {
    throw Error('Attempted to dispatch before store has been defined!');
  }
};
