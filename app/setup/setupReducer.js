// @flow
import {
  START_STREAMER_LOGIN, START_BOT_LOGIN,
  STREAMER_LOGIN_CANCELLED, BOT_LOGIN_CANCELLED,
  STREAMER_LOGGED_IN, BOT_LOGGED_IN
} from '../global/actions';

export default function setup(state, action) {
  const { streamerLoginStage, botLoginStage } =
    (state === undefined) ? { streamerLoginStage: 0, botLoginStage: 0 } : state;
  switch (action.type) {
    case START_STREAMER_LOGIN:
      return { streamerLoginStage: 1, botLoginStage };
    case STREAMER_LOGIN_CANCELLED:
      return { streamerLoginStage: 0, botLoginStage };
    case STREAMER_LOGGED_IN:
      return { streamerLoginStage: 2, botLoginStage };
    case START_BOT_LOGIN:
      return { streamerLoginStage, botLoginStage: 1 };
    case BOT_LOGIN_CANCELLED:
      return { streamerLoginStage, botLoginStage: 0 };
    case BOT_LOGGED_IN:
      return { streamerLoginStage, botLoginStage: 2 };
    default:
      return { streamerLoginStage, botLoginStage };
  }
}
