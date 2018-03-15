// @flow

import type { CommandType, CommandDetailsType } from '../../twitch/commands/parse';

/**
 *  Map command details to Markdown format
 *
 * @param commandDetails | The command details to be mapped
 * @returns The Markdown-formatted details
 */
const mapCommand = (commandDetails: ?CommandDetailsType) => {
  if (commandDetails === null || commandDetails === undefined) {
    throw Error('Logic error!');
  }
  const { name, usage, description } = commandDetails;
  return [
    `## ${name}`,
    `Usage: ${usage}`,
    '',
    description
  ].join('\r');
};


/**
 *  Transform a list of commands into a Markdown-readable list of
 *  command information.
 *
 * @param commandList | The list of commands to be transformed
 * @returns The Markdown-formatted command list
 */
const commandListFormatter = (commandList: Array<CommandType>) => [
  '*To use a command, either whisper it to me, or post it in chat prefixed with `?`.*',
  ...commandList
    .filter((command: CommandType) => command.details !== null && command.details !== undefined)
    .map((command: CommandType) => mapCommand(command.details)),
  '*Note that only moderators can run commands.*'
].join('\r\r');

export default commandListFormatter;
