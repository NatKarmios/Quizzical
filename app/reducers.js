// @flow
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import counter from './counter/counterReducer';
import navbar from './navbar/navbarReducer';
import setup from './setup/setupReducer';

const rootReducer = combineReducers({
  counter,
  navbar,
  setup,
  router,
});

export default rootReducer;
