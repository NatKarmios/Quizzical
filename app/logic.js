import global from './_global/logic';
import settings from './settings/settingsLogic';
import questionList from './home/questionList/questionListLogic';
import questionDisplay from './home/questionDisplay/questionDisplayLogic';

export default [
  ...global,
  ...settings,
  ...questionList,
  ...questionDisplay
];
