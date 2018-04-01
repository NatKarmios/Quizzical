// @flow

import { dispatch } from '../../store';
import { activeQuestionHandleAnswer } from '../../_global/activeQuestion/activeQuestionActions';

import type { MsgData } from './msgData';
import { checkMod } from './msgData';
import { sendRaw } from './chat';
import parseCommand from './commands/parse';

/**
 *  Logs any recieved messages to the console.
 *  Logs in a nicer format if the message can be successfully parsed
 *  into message data
 *
 * @param msg     | The raw recieved message
 * @param msgData | The parsed data from the recieved message
 */
export const logMessage = (msg: string, msgData: ?MsgData) => {
  // Check if message data was successfully parsed
  if (msgData !== undefined && msgData !== null) {
    // Log parsed message to console
    console.log(
      `< ${msgData.isWhisper ? 'WSP' : 'MSG'} | ${msgData.sender.display}: ${
        msgData.msg
      }`
    );
  } else {
    // Otherwise, log the raw message
    console.log(`< RAW | ${msg}`);
  }
};

/**
 *  Sends a reply ping to Twitch when asked for one.
 *
 *  The Twitch IRC server will send a PING message, which must reply with PONG
 *  to prove that the bot is not inactive.
 *
 * @param msg     | The raw recieved message
 * @param msgData | The parsed data from the recieved message
 */
// eslint-disable-next-line no-unused-vars
const replyToPing = (msg: string, msgData: ?MsgData) => {
  // If the recieved message was a ping request...
  if (msg.trim() === 'PING :tmi.twitch.tv') {
    // ...reply with a pong
    sendRaw('PONG :tmi.twitch.tv');
  }
};

/**
 *  Handles an answer to a quiz question
 *
 * @param msg     | The raw recieved message
 * @param msgData | The parsed data from the recieved message
 */
const handleAnswer = (msg: string, msgData: ?MsgData) => {
  // If the message was sent by a user, and consists of only a number...
  if (msgData !== undefined && msgData !== null && !Number.isNaN(msgData.msg)) {
    // ...dispatch the event to handle the answer
    dispatch(activeQuestionHandleAnswer(msgData));
  }
};

/**
 *  Handles a command sent by a user
 *
 * @param msg     | The raw recieved message
 * @param msgData | The parsed data from the recieved message
 */
const handleCommand = (msg: string, msgData: ?MsgData) => {
  // If the message was sent by a user...
  if (msgData !== undefined && msgData !== null) {
    // ...attempt to parse and then handle a command from the message
    parseCommand(msgData);
  }
};

export default [replyToPing, handleAnswer, checkMod, handleCommand];
