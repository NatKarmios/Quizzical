// @flow
import { createLogic } from 'redux-logic';

import { guiLogin, tokenLogin } from '../_modules/twitch/login';
import type { LoginDataType } from '../_modules/twitch/login';
import { getSetting, setSetting } from '../_modules/persist/settings';
import {
  TEST_SAVED_TOKENS, START_STREAMER_LOGIN, START_BOT_LOGIN,
  streamerLoginStarted, botLoginStarted,
  streamerLoginCancelled, botLoginCancelled,
  streamerLoggedIn, botLoggedIn
} from './actions';


const accountMap = {
  streamer: {
    startedActionCreator: streamerLoginStarted,
    successActionCreator: streamerLoggedIn,
    failureActionCreator: streamerLoginCancelled,
    type: 'streamer'
  },
  bot: {
    startedActionCreator: botLoginStarted,
    successActionCreator: botLoggedIn,
    failureActionCreator: botLoginCancelled,
    type: 'bot'
  }
};


type AccountVarsType = {
  successActionCreator: string => {},
  failureActionCreator: () => {},
  type: 'streamer' | 'bot'
};


const testSavedTokensLogic = createLogic({
  type: TEST_SAVED_TOKENS,
  process: async ({ action }, dispatch, done) => {
    console.log("testing");

    const doLogin = async (
      { startedActionCreator, successActionCreator, failureActionCreator, type }: AccountVarsType
    ) => {
      dispatch(startedActionCreator());

      const token = getSetting('login', `${type}AuthToken`);
      console.log(token);
      const username: ?string = await tokenLogin(token);
      if (username !== undefined && username !== null) {
        dispatch(successActionCreator(username));
      } else { dispatch(failureActionCreator()); }
    };

    await Promise.all([doLogin(accountMap.streamer), doLogin(accountMap.bot)]);
    done();
  }
});


let partitionCount = 0;




const processLogin = (
  {startedActionCreator, successActionCreator, failureActionCreator, type }: AccountVarsType
) =>
  async ({ action }, dispatch, done) => {
    dispatch(startedActionCreator());

    const sessionPartition = `${partitionCount}`;
    partitionCount += 1;

    const loginData: ?LoginDataType = await guiLogin(sessionPartition);
    console.log(loginData);
    if (loginData !== null && loginData !== undefined) {
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

export default [
  testSavedTokensLogic,
  loginStreamerLogic,
  loginBotLogic
];
