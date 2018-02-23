// @flow

let store;

export const setStore = newStore => {
  store = newStore;
};

export const getState = () => store.getState();

export const dispatch = action => store.dispatch(action);
