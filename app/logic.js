import global from './global/logic';
import counter from './counter/counterLogic';
import settings from './settings/settingsLogic';
import questionList from './home/questionList/questionListLogic'

export default [
  ...global,
  ...counter,
  ...settings,
  ...questionList
];
