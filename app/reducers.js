// @flow
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import global from './global/reducer'
import counter from './counter/counterReducer';
import navbar from './navbar/navbarReducer';
import setup from './setup/setupReducer';
import settings from './settings/settingsReducer';
import questionList from './home/questionList/questionListReducer';
import questionDisplay from './home/questionDisplay/questionDisplayReducer';

const rootReducer = combineReducers({
  global,
  counter,
  navbar,
  setup,
  settings,
  questionList,
  questionDisplay,
  router,
});

export default rootReducer;
