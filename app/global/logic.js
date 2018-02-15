// @flow

import loginLogic from './login/loginLogic'
import settingsLogic from './settings/settingsLogic'

export default [
  ...loginLogic,
  ...settingsLogic
]
