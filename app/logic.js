import global from './global/logic';
import counter from './counter/counterLogic';
import settings from './settings/settingsLogic';

export default [
  ...global,
  ...counter,
  ...settings
];
