// @flow

import { getSetting, tempVars } from '../persist/settings';
import { IntervalQueue } from '../../utils/IntervalQueue';

const TWITCH_CHAT_URL = 'wss://irc-ws.chat.twitch.tv:443';
const PREFIX = '/me - ';
const LOG_TWITCH = false;
let connectionStarted = false;
const getChannel = () => { return `#${tempVars['streamerNick']}`; };
const getNick = () => { return tempVars['botNick']; };
let queue: IntervalQueue;

let socket: WebSocket;
const listeners: Array<string => void> = [
  // The Twitch IRC server will send a PING message, which must reply with PONG
  // to prove that the bot is not inactive.
  msg => { if (msg === 'PING :tmi.twitch.tv') sendRaw('PONG :tmi.twitch.tv'); }
];
if (LOG_TWITCH) listeners.push(msg => { console.log(`< ${msg}`); });


// <editor-fold desc="Sending Functions">

export const sendRaw = msg => {
  if (LOG_TWITCH) console.log(`> ${msg}`);
  socket.send(msg);
};

const sendMessage = (msg) => {
  sendRaw(`:${getNick()}!${getNick()}@${getNick()}.tmi.twitch.tv PRIVMSG 
           ${getChannel()} :${msg}\r\n`);
};

export const queueMessage = (msg, prefix=true) => {
  queue.put(`${prefix ? PREFIX : ''}${msg}`);
};

// </editor-fold>


const login = () => {
  sendRaw(`PASS oauth:${getSetting('login', 'botAuthToken')}`);
  sendRaw(`NICK ${getNick()}`);
  sendRaw(`JOIN ${getChannel()}`);
  sendRaw('CAP REQ :twitch.tv/tags');
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
      resolve();
    });
    socket.addEventListener('message', event => { listeners.forEach(func => func(event.data)); });
  });
};