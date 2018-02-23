// @flow

import { BOT_LOGGED_IN, STREAMER_LOGGED_IN } from './loginActions';


const defaultState = {
  streamer: { username: null, displayName: null, avatar: null },
  bot: { username: null, displayName: null, avatar: null }
};


const login = (state=defaultState, { type, payload }) => {
  let username, displayName, avatar;

  switch (type) {
    case STREAMER_LOGGED_IN:
      return {
        ...state,
        streamer: {
          ...state.streamer,
          username: payload.username,
          displayName: payload.displayName,
          avatar: payload.avatar }
      };
    case BOT_LOGGED_IN:
      return {
        ...state,
        bot: {
          ...state.bot,
          username: payload.username,
          displayName: payload.displayName,
          avatar: payload.avatar }
      };
    default:
      return state;
  }
};



export default login;
