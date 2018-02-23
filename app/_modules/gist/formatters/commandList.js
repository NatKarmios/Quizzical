// @flow

import type { CommandType, CommandDetailsType } from '../../twitch/commands/parse';


const mapCommand = ({name, usage, description}: CommandDetailsType) => [
  `## ${name}`,
  `Usage: ${usage}`,
  '',
  description
].join('\r');

const commandListFormatter = (commandList: Array<CommandType>) => [
  '*To use a command, either whisper it to me, or post it in chat prefixed with `?`.*',
  ...commandList
    .filter((command: CommandType) => command.details !== null && command.details !== undefined)
    .map((command: CommandType) => mapCommand(command.details)),
  '*Note that only moderators can run commands.*'
].join('\r\r');

export default commandListFormatter;
