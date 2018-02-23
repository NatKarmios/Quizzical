// @flow

import type { counterStateType } from '../counter/counterReducer';
import type { NavbarStateType } from '../navbar/navbarReducer';

export type GlobalStateType = {
  ...counterStateType,
  ...NavbarStateType
};
