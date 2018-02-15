// @flow

import * as loginActions from './login/loginActions';
import * as settingsActions from './settings/settingsActions';

export default {
  ...loginActions,
  ...settingsActions
}
