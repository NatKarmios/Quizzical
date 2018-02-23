// @flow

import { getState } from '../../store';
import { getSetting as injectAndGetSetting } from '../savedSettings';
import { IntervalQueue } from '../../utils/IntervalQueue';

import hardcodedListeners, { logMessage } from './listeners';

const TWITCH_CHAT_URL = 'wss://irc-ws.chat.twitch.tv:443';
const PREFIX = '/me - ';
const LOG_TWITCH = false;
let connectionStarted = false;
const getLoginData = () => getState()['global']['login'];
const getChannel = () => `#${getLoginData()['streamer']['username']}`;
const getNick = () => getLoginData()['bot']['username'];
const getSetting = (category, key) => injectAndGetSetting(getState()['global']['settings'], category, key);
let queue: IntervalQueue;

let socket: WebSocket;
const listeners: Array<string => void> = [ ...hardcodedListeners ];

if (LOG_TWITCH) listeners.push(logMessage);


// <editor-fold desc="Sending Functions">

export const sendRaw = msg => {
  if (LOG_TWITCH) console.log(`> ${msg}`);
  socket.send(msg);
};

const sendMessage = (msg) => {
  sendRaw(`:${getNick()}!${getNick()}@${getNick()}.tmi.twitch.tv PRIVMSG 
           ${getChannel()} :${msg}\r\n`);
};

export const queueMessage = (msg, prefix=true) =>
  queue.put(`${prefix ? PREFIX : ''}${msg}`);

export const queueWhisper = (msg, recipient) =>

  queueMessage(`/w ${recipient} ${msg}`, false);

// </editor-fold>


const login = () => {
  sendRaw(`PASS oauth:${getSetting('login', 'botAuthToken')}`);
  sendRaw(`NICK ${getNick()}`);
  sendRaw(`JOIN ${getChannel()}`);
  sendRaw('CAP REQ :twitch.tv/tags');
  sendRaw('CAP REQ :twitch.tv/commands');
};

export const close = () => {
  socket.close();
};

export const onMessage = (func: string => void) =>  {
  listeners.push(func);
};

export const connect = () => {
  if (connectionStarted) throw Error('Already connected to chat!');
  connectionStarted = true;
  return new Promise(resolve => {
    socket = new WebSocket(TWITCH_CHAT_URL);
    socket.addEventListener('open', () => {
      login();
      queue = new IntervalQueue(sendMessage);
      console.log('Connected to chat.');
      queueMessage(getSetting('chatMessages', 'joinMessage'));
      resolve();
    });
    socket.addEventListener('message', event => listeners.forEach(func => func(event.data)));
  });
};
