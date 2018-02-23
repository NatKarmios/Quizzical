// @flow
import {
  STREAMER_LOGIN_STARTED, BOT_LOGIN_STARTED,
  STREAMER_LOGIN_CANCELLED, BOT_LOGIN_CANCELLED,
  STREAMER_LOGGED_IN, BOT_LOGGED_IN
} from '../_global/actions';

export default function setup(state, action) {
  const { streamerLoginStage, botLoginStage } =
    (state === undefined) ? { streamerLoginStage: 0, botLoginStage: 0 } : state;
  switch (action.type) {
    case STREAMER_LOGIN_STARTED:
      return { streamerLoginStage: 1, botLoginStage };
    case STREAMER_LOGIN_CANCELLED:
      return { streamerLoginStage: 0, botLoginStage };
    case STREAMER_LOGGED_IN:
      return { streamerLoginStage: 2, botLoginStage };
    case BOT_LOGIN_STARTED:
      return { streamerLoginStage, botLoginStage: 1 };
    case BOT_LOGIN_CANCELLED:
      return { streamerLoginStage, botLoginStage: 0 };
    case BOT_LOGGED_IN:
      return { streamerLoginStage, botLoginStage: 2 };
    default:
      return { streamerLoginStage, botLoginStage };
  }
}
