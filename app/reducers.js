// @flow
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import counter from './counter/counterReducer';
import navbar from './navbar/navbarReducer';

const rootReducer = combineReducers({
  counter,
  navbar,
  router,
});

export default rootReducer;
