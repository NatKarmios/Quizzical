// @flow

import { dispatch } from '../../store';
import { activeQuestionHandleAnswer } from '../../_global/activeQuestion/activeQuestionActions';

import type { MsgData } from './msgData';
import { checkMod } from './msgData';
import { sendRaw } from './chat';
import parseCommand from './commands/parse';


export const logMessage = (msg: string, msgData: ?MsgData) => {
  if (msgData !== undefined && msgData !== null) {
    console.log(`< ${msgData.isWhisper ? 'WSP' : 'MSG'} | ${msgData.sender.display}: ${msgData.msg}`);
  } else {
    console.log(`< RAW | ${msg}`);
  }
};

// The Twitch IRC server will send a PING message, which must reply with PONG
// to prove that the bot is not inactive.
// eslint-disable-next-line no-unused-vars
const replyToPing = (msg: string, ignored: ?MsgData) => {
  if (msg.trim() === 'PING :tmi.twitch.tv') {
    sendRaw('PONG :tmi.twitch.tv');
  }
};

const handleAnswer = (msg: string, msgData: ?MsgData) => {
  if (msgData !== undefined && msgData !== null && !isNaN(msgData.msg)) {
    dispatch(activeQuestionHandleAnswer(msgData));
  }
};

const handleCommand = (msg: string, msgData: ?MsgData) => {
  if (msgData !== undefined && msgData !== null) {
    parseCommand(msgData);
  }
};


export default [
  replyToPing,
  handleAnswer,
  checkMod,
  handleCommand
];
