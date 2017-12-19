// @flow
import { createLogic } from 'redux-logic';

import login from '../utils/twitch/login';
import type { LoginDataType } from '../utils/twitch/login';
import {
  START_STREAMER_LOGIN, START_BOT_LOGIN,
  streamerLoginCancelled, botLoginCancelled,
  streamerLoggedIn, botLoggedIn
} from './actions';


let partitionCount = 0;


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


const processLogin = ({ successActionCreator, failureActionCreator }) =>
  async ({ action }, dispatch, done) => {
    const sessionPartition = `${partitionCount}`;
    partitionCount += 1;

    const loginData: ?LoginDataType = await login(sessionPartition, false);
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
