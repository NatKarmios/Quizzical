// @flow
import { createLogic } from 'redux-logic';

import login from '../utils/twitch/login';
import type { LoginDataType } from '../utils/twitch/login';
import {
  START_STREAMER_LOGIN, START_BOT_LOGIN,
  streamerLoginCancelled, botLoginCancelled,
  streamerLoggedIn, botLoggedIn
} from './actions';


const accountMap = {
  streamer: {
    successActionCreator: streamerLoggedIn,
    failureActionCreator: streamerLoginCancelled,
    sessionPartition: 'streamer'
  },
  bot: {
    successActionCreator: botLoggedIn,
    failureActionCreator: botLoginCancelled,
    sessionPartition: 'bot'
  }
};


const processLogin = ({ successActionCreator, failureActionCreator, sessionPartition }) =>
  async ({ action }, dispatch, done) => {
    const loginData: ?LoginDataType = await login(sessionPartition);
    console.log(loginData);
    if (loginData !== null && loginData !== undefined) {
      dispatch(successActionCreator(loginData.username));
    } else {
      dispatch(failureActionCreator());
    }
    done();
  };

const loginStreamerLogic = createLogic({
  type: START_STREAMER_LOGIN,
  process: processLogin(accountMap.streamer)
});

const loginBotLogic = createLogic({
  type: START_BOT_LOGIN,
  process: processLogin(accountMap.bot)
});

export default [
  loginStreamerLogic,
  loginBotLogic
];
