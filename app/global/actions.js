// @flow

export const LOGIN_STREAMER = 'LOGIN_STREAMER';
export const LOGIN_BOT = 'LOGIN_BOT';
export type ActionType = {
  +type: string,
  +payload: {
    +username: string
  }
};

function login(type, username) {
  return { type, payload: { username } };
}

export function loginStreamer(username: string) {
  return login(LOGIN_STREAMER, username);
}

export function loginBot(username: string) {
  return login(LOGIN_BOT, username);
}
