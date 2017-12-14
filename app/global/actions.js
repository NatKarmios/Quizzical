// @flow

export const STREAMER_LOGGED_IN = 'STREAMER_LOGGED_IN';
export const BOT_LOGGED_IN = 'BOT_LOGGED_IN';
export const STREAMER_LOGIN_CANCELLED = 'STREAMER_LOGIN_CANCELLED';
export const BOT_LOGIN_CANCELLED = 'BOT_LOGIN_CANCELLED';
export const START_STREAMER_LOGIN = 'START_STREAMER_LOGIN';
export const START_BOT_LOGIN = 'START_BOT_LOGIN';
export type ActionType = {
  +type: string,
  +payload: {
    +username: string
  }
};

function login(type, username) {
  return { type, payload: { username } };
}

export function streamerLoggedIn(username: string) {
  return login(STREAMER_LOGGED_IN, username);
}

export function botLoggedIn(username: string) {
  return login(BOT_LOGGED_IN, username);
}

export function streamerLoginCancelled() {
  return { type: STREAMER_LOGIN_CANCELLED };
}

export function botLoginCancelled() {
  return { type: BOT_LOGIN_CANCELLED };
}

export function startStreamerLogin() {
  return { type: START_STREAMER_LOGIN };
}

export function startBotLogin() {
  return {type: START_BOT_LOGIN};
}
