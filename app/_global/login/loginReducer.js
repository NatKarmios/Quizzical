// @flow

import { BOT_LOGGED_IN, STREAMER_LOGGED_IN } from './loginActions';
import type { LoginStateType, ActionType } from '../../utils/types';


const defaultState = {
  streamer: { username: null, displayName: null, avatar: null },
  bot: { username: null, displayName: null, avatar: null }
};


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
