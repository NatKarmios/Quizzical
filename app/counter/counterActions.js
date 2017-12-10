// @flow
import type { counterStateType } from './counterReducer';

type actionType = {
  +type: string
};

export const INCREMENT_COUNTER = 'INCREMENT_COUNTER';
export const DECREMENT_COUNTER = 'DECREMENT_COUNTER';
export const INCREMENT_COUNTER_ASYNC = 'INCREMENT_COUNTER_ASYNC';

export function increment() {
  return {
    type: INCREMENT_COUNTER
  };
}

export function decrement() {
  return {
    type: DECREMENT_COUNTER
  };
}

export function incrementIfOdd() {
  return (dispatch: (action: actionType) => void, getState: () => counterStateType) => {
    const { counter } = getState();

    if (counter % 2 === 0) {
      return;
    }

    dispatch(increment());
  };
}

export function incrementAsync(delay: number = 1000) {
  return {
    type: INCREMENT_COUNTER_ASYNC,
    payload: { delay }
  };
}
