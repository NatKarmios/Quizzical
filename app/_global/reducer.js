// @flow

import { combineReducers } from 'redux';

import settings from './settings/settingsReducer';
import login from './login/loginReducer';
import activeQuestion from './activeQuestion/activeQuestionReducer';

export default combineReducers({
  settings,
  login,
  activeQuestion
});
