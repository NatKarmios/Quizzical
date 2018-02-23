// @flow

import { queueMessage, queueWhisper } from './chat';

const PATTERN = /^@badges=([a-z\/\d,-]*);color=(#[\dA-F]{6}?);display-name=([A-Za-z\d_]+);.*:[a-z\d_]+![a-z\d_]+@[a-z\d_]+\.tmi\.twitch\.tv (PRIVMSG|WHISPER) #?[a-z\d_]+ :(.+)$/;

const mods: Array<string> = [];


export type MsgData = {
  rawMsg: string,
  isWhisper: boolean,
  msg: string,
  words: Array<string>,
  sender: {
    raw: string,
    display: string
  },
  color: string,
  isMod: boolean,
  reply: string => void
}

export const parseMsg: string => ?MsgData = toParse => {
  const search = PATTERN.exec(toParse.trim());

  if (search === null) return null;

  const msg = search[5];
  const name = search[3];
  const nick = name.toLowerCase();
  const hasModBadge = search[1].includes('moderator') || search[0].includes('broadcaster');
  const isWhisper = search[4] === 'WHISPER';

  if (hasModBadge && !mods.includes(nick))
    mods.push(name);
  if (!hasModBadge && !isWhisper && mods.includes(nick))
    mods.splice(mods.indexOf(nick), 1);

  console.log(msg, msg.split(' '));

  return {
    rawMsg: toParse,
    isWhisper,
    msg,
    words: msg.split(' '),
    sender: {
      raw: nick,
      display: name
    },
    color: search[2],
    isMod: hasModBadge || mods.includes(name),
    reply: search[4] === 'WHISPER' ? str => queueWhisper(str, name) : str => queueMessage(str)
  }
};

export const checkMod: string => void = msg => {
  parseMsg(msg);
};
