// @flow

// Global logic
import globalSettings from './_global/settings/settingsLogic';
import login from './_global/login/loginLogic';
import activeQuestion from './_global/activeQuestion/activeQuestionLogic';

// Specific component logic
import settings from './settings/settingsLogic';
import questionList from './home/questionList/questionListLogic';
import questionDisplay from './home/questionDisplay/questionDisplayLogic';

export default [
  ...globalSettings,
  ...login,
  ...activeQuestion,
  ...settings,
  ...questionList,
  ...questionDisplay
];
