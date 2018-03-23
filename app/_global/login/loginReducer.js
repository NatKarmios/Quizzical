// @flow

import { BOT_LOGGED_IN, STREAMER_LOGGED_IN } from './loginActions';
import type { LoginStateType, ActionType } from '../../utils/types';


// The login state consists of:
const defaultState = {
  streamer: {
    // The streamer account's username
    username: null,
    // The streamer account's display name
    displayName: null,
    // The URL of the streamer account's display picture
    avatar: null
  },
  bot: {
    // The bot account's username
    username: null,
    // The bot account's display name
    displayName: null,
    // The URL of the bot account's display picture
    avatar: null
  }
};

/**
 *  Reducer for login state
 *
 * @param state
 * @param action
 * @returns The new login state
 */
const login = (state: LoginStateType=defaultState, action: ActionType) => {
  switch (action.type) {
    case STREAMER_LOGGED_IN:
      if (
        action.payload !== undefined && action.payload !== null
        && action.payload.username !== undefined && action.payload.username !== null
        && action.payload.displayName !== undefined && action.payload.displayName !== null
        && action.payload.avatar !== undefined && action.payload.avatar !== null
      ) {
        return {
          ...state,
          streamer: {
            ...state.streamer,
            username: action.payload.username,
            displayName: action.payload.displayName,
            avatar: action.payload.avatar
          }
        };
      }
      break;
    case BOT_LOGGED_IN:
      if (
        action.payload !== undefined && action.payload !== null
        && action.payload.username !== undefined && action.payload.username !== null
        && action.payload.displayName !== undefined && action.payload.displayName !== null
        && action.payload.avatar !== undefined && action.payload.avatar !== null
      ) {
        return {
          ...state,
          bot: {
            ...state.bot,
            username: action.payload.username,
            displayName: action.payload.displayName,
            avatar: action.payload.avatar
          }
        };
      }
      break;
    default:
      return state;
  }
};


export default login;
