// @flow
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import counter from './counter/counterReducer';
import navbar from './navbar/navbarReducer';
import setup from './setup/setupReducer';
import settings from './settings/settingsReducer';
import questionList from './home/questionList/questionListReducer';

const rootReducer = combineReducers({
  counter,
  navbar,
  setup,
  settings,
  questionList,
  router,
});

export default rootReducer;
