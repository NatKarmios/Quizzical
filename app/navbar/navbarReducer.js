// @flow
import { LOGIN_STREAMER, LOGIN_BOT } from '../global/actions';
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
    case LOGIN_STREAMER:
      return { streamerUsername: payload.username, botUsername };
    case LOGIN_BOT:
      return { streamerUsername, botUsername: payload.username };
    default:
      return { streamerUsername, botUsername };
  }
}
