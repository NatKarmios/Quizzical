// @flow

import type { MsgData } from '../msgData';
import type { CommandType, CommandDetailsType } from './parse';
import { getQuestionCount, getQuestionList, getQuestionByID } from '../../db/dbQueries';
import { numPages } from '../../../utils/helperFuncs';
import upload from '../../gist/gist';
import questionListFormatter from '../../gist/formatters/questionList';
import commandListFormatter from '../../gist/formatters/commandList';
import { getState, dispatch } from '../../../store';
import { activeQuestionStart, activeQuestionEnd } from '../../../_global/activeQuestion/activeQuestionActions';


/**
 *  Convenience function; forms a command object.
 *
 * @param pattern | The regular expressions pattern that matches the given command
 * @param func    | The function that is called when someone uses the command
 * @param details | Extra command information (see `cmdDetails` below); optional
 * @param modOnly | Whether the command can only be used by moderators;
 *                | optional, defaults to true
 * @returns The formed command object
 */
const makeCommand = (
  pattern: RegExp,
// eslint-disable-next-line flowtype/no-weak-types
  func: MsgData => any,
  details: ?CommandDetailsType=undefined,
  modOnly: boolean=true
): CommandType => ({
  pattern, func, modOnly, details
});

/**
 *  Convenience function; forms a command-details object
 *
 * @param name        | The name of the command
 * @param usage       | How the command should be used
 * @param description | A description of the command
 * @returns The formed command-details object
 */
const cmdDetails = (name: string, usage: string, description: string) => ({
  name, usage, description
});


// The URL to the GitHub Gist of the command list.
let cmdListUrl;

/**
 *  help
 *  Responds a link to the GitHub Gist of the command list.
 */
export const help = makeCommand(
  /^help$/,
  async (msgData: MsgData) =>
    msgData.reply(await cmdListUrl),
  cmdDetails('Help', '`help`', 'Get a link to this command list.')
);


/**
 *  Convenience function; acts as the command function for both
 *  the basic and specific question list function.
 */
const questionListCombined = async (msgData: MsgData, page) => {
  // Get how many questions are stored in total
  const questionCount = await getQuestionCount();

  // If there aren't any questions saved, inform the viewer and
  // abort the command
  if (questionCount === 0) {
    msgData.reply('There are no saved questions.');
    return;
  }

  // Get how many 'pages' of questions there are
  const maxPage = numPages(questionCount, 30);

  // If the viewer requested too large a page number, inform them
  // of such and abort the command
  if (page >= maxPage) {
    msgData.reply(`Invalid page number! The largest page number is ${maxPage}.`);
    return;
  }

  // Retrieve the list of questions from the database
  const questions = await getQuestionList(page, 30);

  // Format the question list and page number information
  // into a Markdown-readable form
  const formattedData = questionListFormatter(questions, page + 1, maxPage);

  // Upload the formatted question list to GitHub Gists
  const url = await upload(`Quizzical Question List | Page ${page + 1}`, formattedData);

  // Send the Gist URL to the viewer
  msgData.reply(url);
};

/**
 *  questionList
 *  Gets the first page of questions
 */
export const questionList = makeCommand(
  /^questionList$/,
  (msgData: MsgData) => questionListCombined(msgData, 0),
  cmdDetails('Get Question List', '`questionList` | `questionList [page]`', 'Gets a list of 30 saved questions')
);

/**
 * questionList x
 * Gets a specific page of questions
 */
export const questionListWithPageNumber = makeCommand(
  /^questionList [1-9]\d*$/,
  async (msgData: MsgData) => questionListCombined(msgData, parseInt(msgData.words[1], 10) - 1)
);


/**
 *  startQuestion
 *  Starts a quiz question
 */
export const startQuestion = makeCommand(
  /^startQuestion /,
  async (msgData: MsgData) => {
    // Get the current program state
    const state = getState();

    // Veriy state
    if (
      state.global === null || state.global === undefined
      || state.global.settings === null || state.global.settings === undefined
      || state.global.activeQuestion === null || state.global.activeQuestion === undefined
    ) {
      throw Error('Type error!');
    }

    // Extract data from state
    const settings = state.global.settings;
    const activeQuestion = state.global.activeQuestion;

    // If there is already a question running, inform the viewer and abort the command
    if (activeQuestion.running) {
      msgData.reply('A question is already running.');
      return;
    }

    // Verify user settings
    if (settings.misc === null || settings.misc === undefined || typeof settings.misc !== 'object') {
      throw Error('Type error!');
    }

    // Get a category of user settings
    const miscSettings: {} = settings.misc;

    // Verify 'defaultDuration' in settings
    if (
      miscSettings.defaultDuration === null || miscSettings.defaultDuration === undefined
      || typeof miscSettings.defaultDuration !== 'string'
    ) {
      throw Error('Type error!');
    }

    // Parse the default question duration from user settings
    let duration = parseInt(miscSettings.defaultDuration, 10);

    // Verify 'defaultPrize' in settings
    if (
      miscSettings.defaultPrize === null || miscSettings.defaultPrize === undefined
      || typeof miscSettings.defaultPrize !== 'string'
    ) {
      throw Error('Type error!');
    }

    // Parse the default question prize from user settings
    let prize = parseInt(miscSettings.defaultPrize, 10);

    // Set the default `mode` value of 0
    // The `mode` specifies the values of `multipleWinners` and `endEarly`, such that:
    // - 0 => multipleWinners: true, endEarly: false
    // - 1 => multipleWinners: false, endEarly: false
    // - 2 => multipleWinners: false, endEarly: true
    let mode = 0;

    // Get the list of command arguments, and parse them to integers
    // (ignore the first 'word' as that is the command itself)
    const args = msgData.words.slice(1).map(parseInt);

    // If there are too few or too many arguments, or any of the arguments are
    // non-integers, inform the viewer and abort command
    if (args.length === 0 || args.length > 4 || args.map(isNaN).includes(true)) {
      msgData.reply('Malformed command. Use the help command for more info.');
      return;
    }

    // Set the `mode` argument if specified
    if (args.length === 4) {
      mode = args[3];
      // If the viewer gives an invalid value for `mode`, inform them and abort command
      if (![0, 1, 2].includes(mode)) {
        msgData.reply('Mode must be 0, 1 or 2.');
        return;
      }
    }

    // Set the `prize` argument if specified
    if (args.length >= 3) {
      prize = args[2];
    }

    // Set the `duration` argument if specified
    if (args.length >= 2) {
      duration = args[1];
      // If the specified duration is negative, inform the user and abort command
      if (duration <= 0) {
        msgData.reply('Duration must be at least 1 second.');
        return;
      }
    }

    // Set the `quesionID` arguent
    // This is the only required arguent.
    const questionID = args[0];
    try {
      // Attempt to retrieve the specified question
      const question = await getQuestionByID(questionID);

      // Start the question
      dispatch(activeQuestionStart(question, duration, prize, mode === 2, mode === 0));
    } catch (e) {
      // If there was a problem retrieving the question, inform the viewer and abort
      // This will most likely be due to them requesting a question that does not exist.
      console.error(e);
      msgData.reply('Something went wrong; that question might not exist.');
    }
  },
  cmdDetails(
    'Start Question', '`startQuestion [id] [duration?] [prize?] [mode?]`',
    [
      'Starts the question with the specified question ID, duration, prize and mode.',
      'Duration, prize and mode are optional.',
      '',
      'Modes:',
      '- `0` - Normal',
      '- `1` - Only the first correct answerer wins',
      '- `2` - Finish as soon as someone answers correctly.'
    ].join('\n')
  )
);


/**
 *  Convenience function; acts as the command function for both
 *  'finishQuestion' and 'cancelQuestion'.
 *
 *  @param cancelled | Whether the question is cancelled or is just finishing early
 *  @returns The command function
 */
const finishOrCancelQuestion = (cancelled: boolean) => (msgData: MsgData) => {
  // Get current program state
  const state = getState();

  // Verify state contents
  if (
    state === null || state === undefined || state.global === null || state.global === undefined
    || state.global.activeQuestion === null || state.global.activeQuestion === undefined
    || typeof state.global.activeQuestion !== 'object'
    || state.global.activeQuestion.running === null
    || state.global.activeQuestion.running === undefined
    || typeof state.global.activeQuestion.running !== 'boolean'
  ) {
    throw Error('Type error!');
  }

  const running = state.global.activeQuestion.running;

  // A question can't be finished or cancelled if there isn't one currently running;
  // If this is the case, inform the viewer and abort command
  if (!running) {
    msgData.reply('There is no question currently running.');
    return;
  }

  // End or cancel the question
  dispatch(activeQuestionEnd(cancelled));
};

/**
 *  finishQuestion
 *  Finish the currently running question, announcing the winner(s) and
 *  distributing points as normal
 */
export const finishQuestion = makeCommand(
  /^finishQuestion$/,
  finishOrCancelQuestion(false),
  cmdDetails('Finish Question', '`finishQuestion`', 'Finishes an active question immediately.')
);

/**
 *  cancelQuestion
 *  Cancels the currently running question; no winners are announced and no points
 *  are distributed
 */
export const cancelQuestion = makeCommand(
  /^cancelQuestion$/,
 finishOrCancelQuestion(true),
  cmdDetails(
    'Cancel Question', '`cancelQuestion`', 'Cancels an active question immediately, ignoring any potential winners.'
  )
);


const commands = [
  help,
  questionList,
  questionListWithPageNumber,
  startQuestion,
  finishQuestion,
  cancelQuestion
];


// Since the list of commands does not change during runtime, the program can safely
// upload the question list only once, on initialization.
cmdListUrl = upload('Quizzical Command List', commandListFormatter(commands));


export default commands;
