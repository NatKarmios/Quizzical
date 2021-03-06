// @flow

import { STREAMER_LOGGED_IN, BOT_LOGGED_IN } from '../_global/login/loginActions';
import type { ActionType } from '../utils/types';

export type NavbarStateType = {
  streamerLoggedIn: boolean,
  botLoggedIn: boolean
};

const defaultState = { streamerLoggedIn: false, botLoggedIn: false };

export default function navbar(
  state: NavbarStateType = defaultState,
  { type }: ActionType
): NavbarStateType {
  const { streamerLoggedIn, botLoggedIn } = state;

  switch (type) {
    case STREAMER_LOGGED_IN:
      return { streamerLoggedIn: true, botLoggedIn };
    case BOT_LOGGED_IN:
      return { streamerLoggedIn, botLoggedIn: true };
    default:
      return { streamerLoggedIn, botLoggedIn };
  }
}
