import { createLogic } from 'redux-logic';
import { INCREMENT_COUNTER_ASYNC, increment } from './counterActions';
import { delay } from '../utils/helperFuncs';

const incrementAsyncLogic = createLogic({
  type: INCREMENT_COUNTER_ASYNC,
  async process({ action }, dispatch, done) {
    await delay(action.payload.delay);
    dispatch(increment());
    done();
  }
});

export default [
  incrementAsyncLogic
];
