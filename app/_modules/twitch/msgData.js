// @flow

const PATTERN = /^@badges=([a-z/\d,-]*);color=(#[\dA-F]{6}?);display-name=([A-Za-z\d_]+);.*:[a-z\d_]+![a-z\d_]+@[a-z\d_]+\.tmi\.twitch\.tv (PRIVMSG|WHISPER) #?[a-z\d_]+ :(.+)$/;

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
  reply: string => ?mixed
};

export const parseMsg = (
  toParse: string,
  sendMessage: string => ?mixed,
  sendWhisper: (string, string) => ?mixed
): ?MsgData => {
  const search = PATTERN.exec(toParse.trim());

  if (search === null) return null;

  const msg = search[5];
  const name = search[3];
  const nick = name.toLowerCase();
  const hasModBadge =
    search[1].includes('moderator') || search[0].includes('broadcaster');
  const isWhisper = search[4] === 'WHISPER';

  if (hasModBadge && !mods.includes(nick)) {
    mods.push(name);
  }
  if (!hasModBadge && !isWhisper && mods.includes(nick)) {
    mods.splice(mods.indexOf(nick), 1);
  }

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
    sendMessage,
    sendWhisper,
    reply:
      search[4] === 'WHISPER'
        ? str => sendWhisper(str, name)
        : str => sendMessage(str)
  };
};

// eslint-disable-next-line no-unused-vars
export const checkMod = (ignored1: string, ignored2: ?MsgData) => {};
