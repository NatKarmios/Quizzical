// @flow

import { createLogic } from 'redux-logic';

import { guiLogin, tokenLogin } from '../../_modules/twitch/login';
import type { LoginDataType } from '../../_modules/twitch/login';
import { connect } from '../../_modules/twitch/chat';
import { getSetting } from '../../_modules/savedSettings';
import { notify } from '../../utils/helperFuncs';

import {
  TEST_SAVED_TOKENS,
  START_STREAMER_LOGIN,
  START_BOT_LOGIN,
  STREAMER_LOGGED_IN,
  BOT_LOGGED_IN,
  streamerLoginStarted,
  botLoginStarted,
  streamerLoginCancelled,
  botLoginCancelled,
  streamerLoggedIn,
  botLoggedIn
} from '../login/loginActions';
import { changeSettings } from '../settings/settingsActions';

// A mapping for the functions and variables related to
// each account's login process
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
  successActionCreator: (string, string, string) => {},
  failureActionCreator: () => {},
  scopes: Array<string>,
  accountType: 'streamer' | 'bot'
};

/**
 *  Logic for testing saved Twitch authentication tokens.
 */
const testSavedTokensLogic = createLogic({
  type: TEST_SAVED_TOKENS,
  process: async ({ getState }, dispatch, done) => {
    const { settings } = getState().global;

    const doLogin = async ({
      startedActionCreator,
      successActionCreator,
      failureActionCreator,
      accountType
    }: AccountVarsType) => {
      // Get the saved authentication token
      const token = getSetting(settings, 'login', `${accountType}AuthToken`);

      if (token === null || token === undefined) {
        return;
      }

      dispatch(startedActionCreator());

      // Attempt to log in with the token
      const details: ?{
        username: string,
        displayName: string,
        avatarURL: string
      } = await tokenLogin(token);

      // If login was successful...
      if (details !== undefined && details !== null) {
        // Store the account information and notify the streamer
        const { username, displayName, avatarURL } = details;
        dispatch(successActionCreator(username, displayName, avatarURL));
        notify(
          `Successfully logged into ${accountType} account.`,
          'success',
          1500
        );
      } else {
        // Otherwise notify the streamer that login failed
        dispatch(failureActionCreator());
        notify(`Failed to log into ${accountType} account!`, 'warning');
      }
    };

    await Promise.all([doLogin(accountMap.streamer), doLogin(accountMap.bot)]);
    done();
  }
});

// How many partitions have been used by browser windows
let partitionCount = 0;

// Whether at least one account has successfully logged in
let atLeastOneLoggedIn = false;

/**
 *
 * @param [unnamed] | The relevant account variables (see above)
 * @returns The function to be used for the relevant logic's
 *          'process' property.
 */
const processLogin = ({
  startedActionCreator,
  successActionCreator,
  failureActionCreator,
  scopes,
  accountType
}: AccountVarsType) => async (_, dispatch, done) => {
  dispatch(startedActionCreator());

  // Get the session partition
  const sessionPartition = `${partitionCount}`;

  // Increment the number of partitions used
  partitionCount += 1;

  // Attempt to log in via the GUI
  const loginData: ?LoginDataType = await guiLogin(sessionPartition, scopes);
  // If login was successful...
  if (loginData !== null && loginData !== undefined) {
    // Store the account information and notify the streamer
    const { username, displayName, avatarURL } = loginData.details;
    dispatch(
      changeSettings({
        login: {
          [`${accountType}AuthToken`]: loginData.token
        }
      })
    );
    dispatch(successActionCreator(username, displayName, avatarURL));
    notify(`Successfully logged into ${accountType} account.`, 'success', 1500);
  } else {
    // Otherwise notify the streamer that login failed
    dispatch(failureActionCreator());
    notify(`Failed to log into ${accountType} account!`, 'warning');
  }
  done();
};

/**
 *  The logic to attempt to log into the streamer account
 */
const loginStreamerLogic = createLogic({
  type: START_STREAMER_LOGIN,
  process: (_, dispatch, done) => {
    processLogin(accountMap.streamer)(_, dispatch, done);
  }
});

/**
 *  The logic to attempt to log into the bot account
 */
const loginBotLogic = createLogic({
  type: START_BOT_LOGIN,
  process: (_, dispatch, done) => {
    processLogin(accountMap.bot)(_, dispatch, done);
  }
});

/**
 *  The logic for a successful login
 */
const loginFinishedLogic = createLogic({
  type: [STREAMER_LOGGED_IN, BOT_LOGGED_IN],
  process: (_, dispatch, done) => {
    // If one account has already logged in,
    // then both must now be logged in.
    if (atLeastOneLoggedIn) {
      // Since both accounts have logged in, we can now connect to chat.
      connect().catch();
    }

    // At least one account must have now been logged in.
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
