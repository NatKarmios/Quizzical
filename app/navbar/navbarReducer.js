// @flow
import { STREAMER_LOGGED_IN, BOT_LOGGED_IN } from '../global/actions';
// import type { ActionType } from '../global/actions';

export type NavbarStateType = {
  streamerLoggedIn: boolean,
  botLoggedIn: boolean
};

export default function navbar(
  state: NavbarStateType = { streamerLoggedIn: false, botLoggedIn: false },
  { type }
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
