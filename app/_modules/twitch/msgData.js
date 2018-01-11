// @flow

const PATTERN = /^@badges=([a-z\/\d,-]*);color=(#[\dA-F]{6}?);display-name=([A-Za-z\d_]+);.*:[a-z\d_]+![a-z\d_]+@[a-z\d_]+\.tmi\.twitch\.tv PRIVMSG #[a-z\d_]+ :(.+)$/;

export type MsgData = {
  rawMsg: string,
  msg: string,
  sender: {
    raw: string,
    display: string
  },
  color: string,
  isMod: boolean
}

export const parseMsg: string => ?MsgData = toParse => {
  const search = PATTERN.exec(toParse.trim());
  return search === null ? null : {
    rawMsg: toParse,
    msg: search[4],
    sender: {
      raw: search[3].toLowerCase(),
      display: search[3]
    },
    color: search[2],
    isMod: search[1].includes('moderator') || search[0].includes('broadcaster')
  }
};
