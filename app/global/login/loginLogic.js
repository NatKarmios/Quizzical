// @flow
import { createLogic } from 'redux-logic';

import { guiLogin, tokenLogin } from '../../_modules/twitch/login';
import type { LoginDataType, AccountDetailsType } from '../../_modules/twitch/login';
import { connect } from '../../_modules/twitch/chat';
import { getSetting, setSetting } from '../../_modules/savedSettings';
import vars from '../../_modules/vars';

import {
  TEST_SAVED_TOKENS,
  START_STREAMER_LOGIN, START_BOT_LOGIN,
  STREAMER_LOGGED_IN, BOT_LOGGED_IN,
  streamerLoginStarted, botLoginStarted,
  streamerLoginCancelled, botLoginCancelled,
  streamerLoggedIn, botLoggedIn
} from '../actions';


const accountMap = {
  streamer: {
    startedActionCreator: streamerLoginStarted,
    successActionCreator: streamerLoggedIn,
    failureActionCreator: streamerLoginCancelled,
    scopes: [],
    accountType: 'streamer'
  },
  bot: {
    startedActionCreator: botLoginStarted,
    successActionCreator: botLoggedIn,
    failureActionCreator: botLoginCancelled,
    scopes: ['chat_login'],
    accountType: 'bot'
  }
};


type AccountVarsType = {
  startedActionCreator: () => {},
  successActionCreator: string => {},
  failureActionCreator: () => {},
  scopes: Array<string>,
  accountType: 'streamer' | 'bot'
};


const storeAccountDetails = (accountType: string, details: AccountDetailsType) => {
  const { username, displayName, avatarURL } = details;
  vars.accountData[accountType] = {
    nick: username,
    display: displayName,
    avatar: avatarURL
  };
};

const testSavedTokensLogic = createLogic({
  type: TEST_SAVED_TOKENS,
  process: async ({ action, getState }, dispatch, done) => {
    const settings = getState().global.settings;

    const doLogin = async (
      { startedActionCreator, successActionCreator, failureActionCreator, accountType }: AccountVarsType
    ) => {
      dispatch(startedActionCreator());

      const token = getSetting(settings, 'login', `${accountType}AuthToken`);
      const details: ?{username: string, displayName: string, avatarURL: string} = await tokenLogin(token);
      if (details !== undefined && details !== null) {
        storeAccountDetails(accountType, details);
        dispatch(successActionCreator());
      } else { dispatch(failureActionCreator()); }
    };

    await Promise.all([doLogin(accountMap.streamer), doLogin(accountMap.bot)]);
    done();
  }
});


let partitionCount = 0;

let atLeastOneLoggedIn = false;


const processLogin = (
  {startedActionCreator, successActionCreator, failureActionCreator, scopes, accountType }: AccountVarsType
) =>
  async ({ action, getState }, dispatch, done) => {
    dispatch(startedActionCreator());

    const settings = getState().global.settings;

    const sessionPartition = `${partitionCount}`;
    partitionCount += 1;

    const loginData: ?LoginDataType = await guiLogin(sessionPartition, scopes);
    if (loginData !== null && loginData !== undefined) {
      storeAccountDetails(accountType, loginData.details);
      await setSetting(settings, 'login', `${accountType}AuthToken`, loginData.token);

      dispatch(successActionCreator());
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


export default [
  testSavedTokensLogic,
  loginStreamerLogic,
  loginBotLogic,
  loginFinishedLogic
];
