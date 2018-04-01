// @flow

import { getState } from '../../store';
import { getSetting as injectAndGetSetting } from '../savedSettings';
import IntervalQueue from '../../utils/IntervalQueue';
import { formatWithContext } from '../../utils/helperFuncs';
import type { GlobalStateType } from '../../utils/types';

import { parseMsg } from './msgData';
import type { MsgData } from './msgData';
import hardcodedListeners, { logMessage } from './listeners';

// <editor-fold desc="Constants">

// The websocket URL to connect to for Twitch chat
const TWITCH_CHAT_URL = 'wss://irc-ws.chat.twitch.tv:443';

// A string to prefix any messages sent to chat
const PREFIX = '/me - ';

// Whether or not to log all Twitch messages to the console
const LOG_TWITCH = false;

// </editor-fold>

// <editor-fold desc="Helper Functions">

/**
 *  Retireve global state and verify its type
 *
 * @returns The global state object
 */
const getGlobalState = (): GlobalStateType => {
  const state = getState();
  if (state.global === null || state.global === undefined) {
    throw Error('Type error!');
  }
  return state.global;
};

/**
 *  Get global login state and verify its type
 *
 * @returns The global login state object
 */
const getLoginData = (): {} => {
  const globalState: Object = getGlobalState();
  if (
    globalState.login === undefined ||
    globalState.login === null ||
    typeof globalState.login !== 'object'
  ) {
    throw Error('Type error!');
  }
  return globalState.login;
};

/**
 *  Get the IRC channel to connect to (i.e. the streamer's username with a '#' in front)
 *
 * @returns The IRC channel to connect to
 */
const getChannel = () => {
  const loginData: Object = getLoginData();
  if (
    loginData.streamer === undefined ||
    loginData.streamer === null ||
    typeof loginData.streamer !== 'object' ||
    loginData.streamer.username === undefined ||
    loginData.streamer.username === null ||
    typeof loginData.streamer.username !== 'string'
  ) {
    throw Error('Type error!');
  }
  return `#${loginData.streamer.username}`;
};

/**
 *  Get the IRC nickname to sign in with (i.e. the bot account's username)
 *
 * @returns The IRC nickname to sign in with
 */
const getNick = () => {
  const loginData: Object = getLoginData();
  if (
    loginData.bot === undefined ||
    loginData.bot === null ||
    typeof loginData.bot !== 'object' ||
    loginData.bot.username === undefined ||
    loginData.bot.username === null ||
    typeof loginData.bot.username !== 'string'
  ) {
    throw Error('Type error!');
  }
  return `#${loginData.bot.username}`;
};

/**
 *  Gets a particular user setting; this simply removes the need to explicitly
 *  retrieve and check the type of the settings state object
 *
 * @param category | The desired setting's category
 * @param key      | The desired setting's key
 * @returns The desired value from user settings
 */
const getSetting = (category, key) => {
  const globalState = getGlobalState();
  if (
    globalState.settings === undefined ||
    globalState.settings === null ||
    typeof globalState.settings !== 'object'
  ) {
    throw Error('Type error!');
  }
  return injectAndGetSetting(globalState.settings, category, key);
};

/**
 *  Takes some value and verifies that it matches the 'event' type
 *
 * @param value | The value to be verified
 * @returns The same value with its type verified, or null if the type is invalid
 */
const refineToEventType = (value: mixed): ?{ data: string } => {
  if (value && typeof value === 'object' && typeof value.data === 'string') {
    return { data: value.data };
  }
  return null;
};

// </editor-fold>

// <editor-fold desc="Variables">

// Whether a connection to Twitch chat has been initialized
let connectionStarted = false;

// The queue of messages to be sent to Twitch chat
let queue: IntervalQueue;

// The websocket that will be used to communicate with Twitch's servers
let socket: WebSocket;

// A list of listeners that will each be called when a message is recieved in chat
const listeners: Array<(string, ?MsgData) => void> = [...hardcodedListeners];

// </editor-fold>

// If logging Twitch chat to console is enabled, add the logging
// function to the listeners list
if (LOG_TWITCH) listeners.push(logMessage);

// <editor-fold desc="Sending Functions">

export const sendRaw = (msg: string) => {
  if (LOG_TWITCH) console.log(`> ${msg}`);
  socket.send(msg);
};

const sendMessage = msg => {
  sendRaw(`:${getNick()}!${getNick()}@${getNick()}.tmi.twitch.tv PRIVMSG 
           ${getChannel()} :${msg}\r\n`);
};

export const queueMessage = (msg: string, prefix: boolean = true) =>
  queue.put(`${prefix ? PREFIX : ''}${msg}`);

export const queueWhisper = (msg: string, recipient: string) =>
  queueMessage(`/w ${recipient} ${msg}`, false);

// </editor-fold>

/**
 *  Send login details to Twitch
 */
const login = () => {
  // Get the bot account's OAuth token from user settings
  const botAuthToken: ?string = getSetting('login', 'botAuthToken');

  // Verify the type of `botAuthToken`
  if (botAuthToken === undefined || botAuthToken === null) {
    throw Error('Attempted to connect to Twitch chat before bot logged in!');
  }

  // Send authentication details to Twitch chat
  sendRaw(`PASS oauth:${botAuthToken}`);
  sendRaw(`NICK ${getNick()}`);
  sendRaw(`JOIN ${getChannel()}`);
  sendRaw('CAP REQ :twitch.tv/tags');
  sendRaw('CAP REQ :twitch.tv/commands');
};

/**
 *  Close the connection to Twitch
 */
export const close = () => {
  // Close the websocket
  socket.close();
};

/**
 *  Add a listener function to incoming Twitch messages
 *
 * @param func | The function to listen to Twitch messages
 */
export const onMessage = (func: string => void) => {
  // Push the given function to the list of listeners
  listeners.push(func);
};

/**
 *  Connect to Twitch chat
 *
 * @returns A promise that resolves once a connection is established
 */
export const connect = (): Promise<void> => {
  // Abort if a connection attempt has already been started
  if (connectionStarted) throw Error('Already connected to chat!');

  // Indicate that a connection attempt has been started
  connectionStarted = true;

  // Form the promise
  return new Promise(resolve => {
    // Create the websocket and connect to Twitch chat
    socket = new WebSocket(TWITCH_CHAT_URL);

    // Add an event listener for when the socket opens
    socket.addEventListener('open', () => {
      // Send login data
      login();

      // Instantiate the message queue
      queue = new IntervalQueue(sendMessage);

      // Indicate that chat is connected in the console
      console.log('Connected to chat.');

      // Get the join message from user settings
      const joinMessage = getSetting('chatMessages', 'joinMessage');

      // Don't send the join message if it isn't a useful value
      if (
        joinMessage !== undefined &&
        joinMessage !== null &&
        joinMessage !== ''
      ) {
        // Format and send the join message
        queueMessage(formatWithContext(joinMessage));
      }

      // Resolve promise
      resolve();
    });

    // Add an event listener for when a message is recieved
    socket.addEventListener('message', (event: mixed) => {
      // Verfy the event object to the required type
      const typedEvent: ?{ data: string } = refineToEventType(event);

      // Verify that refinement was successful
      if (typedEvent !== undefined && typedEvent !== null) {
        // Get the recieved message
        const msg = typedEvent.data;

        // Call each listener function with the raw message and parsed message data
        listeners.forEach(func =>
          func(msg, parseMsg(msg, queueMessage, queueWhisper))
        );
      }
    });
  });
};
