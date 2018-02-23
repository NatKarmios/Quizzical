// @flow

import * as loginActions from './login/loginActions';
import * as settingsActions from './settings/settingsActions';
import * as activeQuestionActions from './activeQuestion/activeQuestionActions';

export default {
  ...loginActions,
  ...settingsActions,
  ...activeQuestionActions
}
