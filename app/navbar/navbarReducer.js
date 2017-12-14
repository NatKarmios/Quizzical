// @flow
import { STREAMER_LOGGED_IN, BOT_LOGGED_IN } from '../global/actions';
// import type { ActionType } from '../global/actions';

export type NavbarStateType = {
  streamerUsername: string,
  botUsername: string
};

export default function navbar(
  state: NavbarStateType = { streamerUsername: 'Not logged in', botUsername: 'Not logged in' },
  { type, payload }
): NavbarStateType {
  const { streamerUsername, botUsername } = state;

  switch (type) {
    case STREAMER_LOGGED_IN:
      return { streamerUsername: payload.username, botUsername };
    case BOT_LOGGED_IN:
      return { streamerUsername, botUsername: payload.username };
    default:
      return { streamerUsername, botUsername };
  }
}
