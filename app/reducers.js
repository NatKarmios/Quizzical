// @flow
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import counter from './counter/counterReducer';
import navbar from './navbar/navbarReducer';
import setup from './setup/setupReducer';
import settings from './settings/settingsReducer';

const rootReducer = combineReducers({
  counter,
  navbar,
  setup,
  settings,
  router,
});

export default rootReducer;
