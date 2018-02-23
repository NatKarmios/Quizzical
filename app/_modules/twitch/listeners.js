// @flow

import { dispatch } from '../../store';
import { activeQuestionHandleAnswer } from '../../_global/activeQuestion/activeQuestionActions';

import type { MsgData } from './msgData';
import { parseMsg, checkMod } from './msgData';
import { sendRaw } from "./chat";
import { parseCommand } from './commands/parse';


export const logMessage = msg => {
  const parsed: ?MsgData = parseMsg(msg);
  if (parsed !== undefined && parsed !== null)
    console.log(`< ${parsed.isWhisper ? 'WSP' : 'MSG'} | ${parsed.sender.display}: ${parsed.msg}`);
  else
    console.log(`< RAW | ${msg}`);
};

// The Twitch IRC server will send a PING message, which must reply with PONG
// to prove that the bot is not inactive.
const replyToPing = msg => {
  if (msg === 'PING :tmi.twitch.tv')
    sendRaw('PONG :tmi.twitch.tv');
};

const handleAnswer = msg => {
  const msgData: ?MsgData = parseMsg(msg);
  if (msgData !== undefined && msgData !== null && !isNaN(msgData.msg))
    dispatch(activeQuestionHandleAnswer(msgData));
};

const handleCommand = msg => {
  const msgData = parseMsg(msg);
  if (msgData !== undefined && msgData !== null)
    parseCommand(msgData);
};


export default [
  replyToPing,
  handleAnswer,
  checkMod,
  handleCommand
];
