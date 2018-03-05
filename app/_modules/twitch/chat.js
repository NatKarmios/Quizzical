// @flow

import { getState } from '../../store';
import { getSetting as injectAndGetSetting } from '../savedSettings/savedSettings';
import IntervalQueue from '../../utils/IntervalQueue';
import type { GlobalStateType } from '../../utils/types';

import { parseMsg } from './msgData';
import type { MsgData } from './msgData';
import hardcodedListeners, { logMessage } from './listeners';

const TWITCH_CHAT_URL = 'wss://irc-ws.chat.twitch.tv:443';
const PREFIX = '/me - ';
const LOG_TWITCH = false;
let connectionStarted = false;

const getGlobalState = (): GlobalStateType => {
  const state = getState();
  if (state.global === null || state.global === undefined) {
    throw Error('Type error!');
  }
  return state.global;
};

const getLoginData = (): {} => {
  const globalState: {} = getGlobalState();
  if (globalState.login === undefined || globalState.login === null || typeof globalState.login !== 'object') {
    throw Error('Type error!');
  }
  return globalState.login;
};

const getChannel = () => {
  const loginData: {} = getLoginData();
  if (
    loginData.streamer === undefined || loginData.streamer === null || typeof loginData.streamer !== 'object'
    || loginData.streamer.username === undefined || loginData.streamer.username === null
    || typeof loginData.streamer.username !== 'string'
  ) {
    throw Error('Type error!');
  }
  return `#${loginData.streamer.username}`;
};

const getNick = () => {
  const loginData: {} = getLoginData();
  if (
    loginData.bot === undefined || loginData.bot === null || typeof loginData.bot !== 'object'
    || loginData.bot.username === undefined || loginData.bot.username === null
    || typeof loginData.bot.username !== 'string'
  ) {
    throw Error('Type error!');
  }
  return `#${loginData.bot.username}`;
};

const getSetting = (category, key) => {
  const globalState = getGlobalState();
  if (globalState.settings === undefined || globalState.settings === null || typeof globalState.settings !== 'object') {
    throw Error('Type error!');
  }
  return injectAndGetSetting(globalState.settings, category, key);
};

let queue: IntervalQueue;

let socket: WebSocket;
const listeners: Array<(string, ?MsgData) => void> =
  [...hardcodedListeners];

if (LOG_TWITCH) listeners.push(logMessage);


const refineToEventType = (value: mixed): ?{ data: string } => {
  if (value && typeof value === 'object' && typeof value.data === 'string') {
    return { data: value.data };
  }
  return null;
};


// <editor-fold desc="Sending Functions">

export const sendRaw = (msg: string) => {
  if (LOG_TWITCH) console.log(`> ${msg}`);
  socket.send(msg);
};

const sendMessage = (msg) => {
  sendRaw(`:${getNick()}!${getNick()}@${getNick()}.tmi.twitch.tv PRIVMSG 
           ${getChannel()} :${msg}\r\n`);
};

export const queueMessage = (msg: string, prefix: boolean=true) =>
  queue.put(`${prefix ? PREFIX : ''}${msg}`);

export const queueWhisper = (msg: string, recipient: string) =>

  queueMessage(`/w ${recipient} ${msg}`, false);

// </editor-fold>


const login = () => {
  const botAuthToken: ?string = getSetting('login', 'botAuthToken');
  if (botAuthToken === undefined || botAuthToken === null) {
    throw Error('Attempted to connect to Twitch chat before bot logged in!');
  }
  sendRaw(`PASS oauth:${botAuthToken}`);
  sendRaw(`NICK ${getNick()}`);
  sendRaw(`JOIN ${getChannel()}`);
  sendRaw('CAP REQ :twitch.tv/tags');
  sendRaw('CAP REQ :twitch.tv/commands');
};

export const close = () => {
  socket.close();
};

export const onMessage = (func: string => void) => {
  listeners.push(func);
};

export const connect = (): Promise<void> => {
  if (connectionStarted) throw Error('Already connected to chat!');
  connectionStarted = true;
  return new Promise(resolve => {
    socket = new WebSocket(TWITCH_CHAT_URL);
    socket.addEventListener('open', () => {
      login();
      queue = new IntervalQueue(sendMessage);
      console.log('Connected to chat.');
      const joinMessage = getSetting('chatMessages', 'joinMessage');
      if (joinMessage !== undefined && joinMessage !== null) {
        queueMessage(joinMessage);
      }
      resolve();
    });
    socket.addEventListener(
      'message',
      (event: mixed) => {
        const typedEvent: ?{ data: string } = refineToEventType(event);
        if (typedEvent !== undefined && typedEvent !== null) {
          const msg = typedEvent.data;
          listeners.forEach(func => func(msg, parseMsg(msg, queueMessage, queueWhisper)));
        }
      }
    );
  });
};
