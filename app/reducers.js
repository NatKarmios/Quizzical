// @flow
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';

// Global state reducers
import globalSettings from './_global/settings/settingsReducer';
import login from './_global/login/loginReducer';
import activeQuestion from './_global/activeQuestion/activeQuestionReducer';

// Specific component state reducers
import navbar from './navbar/navbarReducer';
import setup from './setup/setupReducer';
import settings from './settings/settingsReducer';
import questionList from './home/questionList/questionListReducer';
import questionDisplay from './home/questionDisplay/questionDisplayReducer';
import questionHistory from './home/questionHistory/questionHistoryReducer';
import rightPaneTabs from './home/rightPaneTabs/rightPaneTabsReducer';


const rootReducer = combineReducers({
  global: combineReducers({
    settings: globalSettings,
    login,
    activeQuestion
  }),
  navbar,
  setup,
  settings,
  questionList,
  questionDisplay,
  questionHistory,
  rightPaneTabs,
  router
});

export default rootReducer;
