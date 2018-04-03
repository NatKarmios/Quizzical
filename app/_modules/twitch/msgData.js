// @flow

// The RegEx pattern used to parse Twitch messages
const PATTERN = /^@badges=([a-z/\d,-]*);color=(?:(#[\dA-F]{6}))?;display-name=([A-Za-z\d_]+);.*:[a-z\d_]+![a-z\d_]+@[a-z\d_]+\.tmi\.twitch\.tv (PRIVMSG|WHISPER) #?[a-z\d_]+ :(.+)$/;

// An array to store the usernames of know moderators
const mods: Array<string> = [];

// A message that is sent by a viewer is parsed into...
export type MsgData = {
  // The raw, untouched message
  rawMsg: string,

  // Whether the message was sent in chat or was a whisper
  isWhisper: boolean,

  // The text that the user sent as the message
  msg: string,

  // The message, divided into "words"
  words: Array<string>,

  // The viewer that sent the message
  sender: {
    // The viewer's raw username
    raw: string,

    // The viewer's display name
    display: string
  },

  // The colour of the viewer's name (Twitch users can set custom colours)
  color: string,

  // Whether the viewer is a moderator in the streamer's channel
  isMod: boolean,

  // A function to reply to the message in the appropriate method,
  // whether it be in chat or in a whisper
  reply: string => ?mixed
};

/**
 *  Parse a viewer's message into relevant information
 *
 * @param toParse     | The raw message to be parsed
 * @param sendMessage | The function to send a message to chat
 * @param sendWhisper | The function to send a whisper
 * @returns The parsed message, or null if parsing was unsuccessful
 */
export const parseMsg = (
  toParse: string,
  sendMessage: string => ?mixed,
  sendWhisper: (string, string) => ?mixed
): ?MsgData => {
  // Search the raw message using the RegEx pattern above
  const search = PATTERN.exec(toParse.trim());

  // Return null if the RegEx pattern failed to match
  if (search === null) return null;

  // Extract the sent message and sender's display name from the search results
  const msg = search[5];
  const name = search[3];

  // The username is just the display name in lower case
  const nick = name.toLowerCase();

  // If the viewer is a moderator (or should be treated like one), they'll
  // have a 'moderator' or 'broadcaster' badge
  const hasModBadge =
    search[1].includes('moderator') || search[0].includes('broadcaster');

  // Determine whether the message was a whisper
  const isWhisper = search[4] === 'WHISPER';

  // The user is considered a moderator if this message or a previous message
  // from them has had a moderator or broadcaster badge;
  // This is because whispers exist outside the scope of the streamer's channel,
  // and thus those badges are not sent; this way, I can still respond to moderators
  // in whispers without needing other external APIs
  if (hasModBadge && !mods.includes(nick)) {
    // If the user is a moderator and is not already in the moderator array,
    // add them to it
    mods.push(name);
  }

  // If the viewer was a moderator but is no longer, then remove them from
  // the moderator array
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
    color: search[2] !== null && search[2] !== undefined ? search[2] : '',
    isMod: hasModBadge || mods.includes(name),
    sendMessage,
    sendWhisper,
    reply:
      search[4] === 'WHISPER'
        ? str => sendWhisper(str, name)
        : str => sendMessage(str)
  };
};

// This dummy listener is used to force the message to be parsed, thus making sure that
// a viewer's moderator status is checked each time they send a message to chat
// eslint-disable-next-line no-unused-vars
export const checkMod = (ignored1: string, ignored2: ?MsgData) => {};
