// @flow

import { getSetting, tempVars } from '../persist/settings';

const TWITCH_CHAT_URL = 'wss://irc-ws.chat.twitch.tv:443';
const PREFIX = '/me - ';
const LOG_TWITCH = false;
let connectionStarted = false;
const getChannel = () => { return `#${tempVars.streamerNick}`; };
const getNick = () => { return tempVars.botNick; };

let socket: WebSocket;
const listeners: Array = [
  // The Twitch IRC server will send a PING message, which must reply with PONG
  // to prove that the bot is not inactive.
  msg => { if (msg === 'PING :tmi.twitch.tv') sendRaw('PONG :tmi.twitch.tv'); }
];
if (LOG_TWITCH) listeners.push(msg => { console.log(`< ${msg}`); });

export const sendRaw = msg => {
  if (LOG_TWITCH) console.log(`> ${msg}`);
  socket.send(msg);
};

export const sendMessage = (msg, prefix=true) => {
  sendRaw(`:${getNick()}!${getNick()}@${getNick()}.tmi.twitch.tv PRIVMSG 
           ${getChannel()} :${prefix ? PREFIX : ''}${msg}\r\n`);
};

const login = () => {
  sendRaw(`PASS oauth:${getSetting('login', 'botAuthToken')}`);
  sendRaw(`NICK ${getNick()}`);
  sendRaw(`JOIN ${getChannel()}`);
};

export const close = () => {
  socket.close();
};

export const onMessage = (func: () => void) =>  {
  listeners.push(func);
};

export const connect = () => {
  if (connectionStarted) throw Error('Already connected to chat!');
  connectionStarted = true;
  return new Promise(resolve => {
    socket = new WebSocket(TWITCH_CHAT_URL);
    socket.addEventListener('open', () => {
      login();
      console.log('Connected to chat.');
      resolve();
    });
    socket.addEventListener('message', event => { listeners.forEach(func => { func(event.data); }); });
  });
};
