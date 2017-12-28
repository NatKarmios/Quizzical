// @flow
import { createLogic } from 'redux-logic';

import { guiLogin, tokenLogin } from '../_modules/twitch/login';
import type { LoginDataType } from '../_modules/twitch/login';
import { connect } from '../_modules/twitch/chat';
import { getSetting, setSetting, tempVars } from '../_modules/persist/settings';
import {
  TEST_SAVED_TOKENS,
  START_STREAMER_LOGIN, START_BOT_LOGIN,
  STREAMER_LOGGED_IN, BOT_LOGGED_IN,
  streamerLoginStarted, botLoginStarted,
  streamerLoginCancelled, botLoginCancelled,
  streamerLoggedIn, botLoggedIn
} from './actions';


const accountMap = {
  streamer: {
    startedActionCreator: streamerLoginStarted,
    successActionCreator: streamerLoggedIn,
    failureActionCreator: streamerLoginCancelled,
    scopes: [],
    type: 'streamer'
  },
  bot: {
    startedActionCreator: botLoginStarted,
    successActionCreator: botLoggedIn,
    failureActionCreator: botLoginCancelled,
    scopes: ['chat_login'],
    type: 'bot'
  }
};


type AccountVarsType = {
  startedActionCreator: () => {},
  successActionCreator: string => {},
  failureActionCreator: () => {},
  scopes: Array<string>,
  type: 'streamer' | 'bot'
};


const testSavedTokensLogic = createLogic({
  type: TEST_SAVED_TOKENS,
  process: async ({ action }, dispatch, done) => {

    const doLogin = async (
      { startedActionCreator, successActionCreator, failureActionCreator, type }: AccountVarsType
    ) => {
      dispatch(startedActionCreator());

      const token = getSetting('login', `${type}AuthToken`);
      const username: ?string = await tokenLogin(token);
      if (username !== undefined && username !== null) {
        tempVars[`${type}Nick`] = username;
        dispatch(successActionCreator(username));
      } else { dispatch(failureActionCreator()); }
    };

    await Promise.all([doLogin(accountMap.streamer), doLogin(accountMap.bot)]);
    done();
  }
});


let partitionCount = 0;

let atLeastOneLoggedIn = false;


const processLogin = (
  {startedActionCreator, successActionCreator, failureActionCreator, scopes, type }: AccountVarsType
) =>
  async ({ action }, dispatch, done) => {
    dispatch(startedActionCreator());

    const sessionPartition = `${partitionCount}`;
    partitionCount += 1;

    const loginData: ?LoginDataType = await guiLogin(sessionPartition, scopes);
    if (loginData !== null && loginData !== undefined) {
      tempVars[`${type}Nick`] = loginData.username;
      await setSetting('login', `${type}AuthToken`, loginData.token);

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


const loginFinishedLogic = createLogic({
  type: [STREAMER_LOGGED_IN, BOT_LOGGED_IN],
  process: ({ action }, dispatch, done) => {
    if (atLeastOneLoggedIn) {
      connect();
    }
    atLeastOneLoggedIn = true;
    done();
  }
});

const botLoginFinishedLogic = createLogic({
  type: BOT_LOGGED_IN,
});


export default [
  testSavedTokensLogic,
  loginStreamerLogic,
  loginBotLogic,
  loginFinishedLogic
];
