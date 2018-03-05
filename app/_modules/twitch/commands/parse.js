// @flow

import type { MsgData } from '../msgData';

import commands from './commandList';

export type CommandDetailsType = {
  name: string,
  usage: string,
  description: string
};

export type CommandType = {
  pattern: RegExp,
  func: MsgData => void,
  modOnly: boolean,
  details: ?CommandDetailsType
};


const parseCommand: MsgData => void = (msgData: MsgData) => {
  // Non-whisper messages are ignored if they don't start with '?', the command prefix.
  if (!msgData.msg.startsWith('?') && !msgData.isWhisper) return;

  // If the message isn't a whisper, the command prefix is ignored when matching for a command.
  const msg = msgData.isWhisper ? msgData.msg : msgData.msg.substring(1);

  // Iterate through the list of commands; if the command's regex matches the user message,
  // then call the command's function with the message data.
  commands.forEach(cmd => {
    if (cmd.pattern.test(msg)) {
      cmd.func(msgData);
    }
  });
};


export default parseCommand;
