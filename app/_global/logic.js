// @flow

import loginLogic from './login/loginLogic'
import settingsLogic from './settings/settingsLogic'
import activeQuestionLogic from './activeQuestion/activeQuestionLogic';

export default [
  ...loginLogic,
  ...settingsLogic,
  ...activeQuestionLogic
]
