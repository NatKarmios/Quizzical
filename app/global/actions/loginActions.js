// @flow

export const TEST_SAVED_TOKENS = 'TEST_SAVED_TOKENS';
export const STREAMER_LOGGED_IN = 'STREAMER_LOGGED_IN';
export const BOT_LOGGED_IN = 'BOT_LOGGED_IN';
export const STREAMER_LOGIN_CANCELLED = 'STREAMER_LOGIN_CANCELLED';
export const BOT_LOGIN_CANCELLED = 'BOT_LOGIN_CANCELLED';
export const STREAMER_LOGIN_STARTED = 'STREAMER_LOGIN_STARTED';
export const BOT_LOGIN_STARTED = 'BOT_LOGIN_STARTED';
export const START_STREAMER_LOGIN = 'START_STREAMER_LOGIN';
export const START_BOT_LOGIN = 'START_BOT_LOGIN';


export function testSavedTokens() {
  return { type: TEST_SAVED_TOKENS };
}


function login(type) {
  return { type };
}

export function streamerLoggedIn() {
  return login(STREAMER_LOGGED_IN);
}

export function botLoggedIn() {
  return login(BOT_LOGGED_IN);
}

export function streamerLoginCancelled() {
  return { type: STREAMER_LOGIN_CANCELLED };
}

export function botLoginCancelled() {
  return { type: BOT_LOGIN_CANCELLED };
}

export function streamerLoginStarted() {
  return { type: STREAMER_LOGIN_STARTED };
}

export function botLoginStarted() {
  return { type: BOT_LOGIN_STARTED };
}

export function startStreamerLogin() {
  return { type: START_STREAMER_LOGIN };
}

export function startBotLogin() {
  return {type: START_BOT_LOGIN};
}
