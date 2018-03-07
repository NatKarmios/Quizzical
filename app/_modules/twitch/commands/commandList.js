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

const makeCommand = (
  pattern: RegExp,
// eslint-disable-next-line flowtype/no-weak-types
  func: MsgData => any,
  details: ?CommandDetailsType=undefined,
  modOnly: boolean=true
): CommandType => ({
  pattern, func, modOnly, details
});

const cmdDetails = (name: string, usage: string, description: string) => ({
  name, usage, description
});


let cmdListUrl;

export const help = makeCommand(
  /^help$/,
  async (msgData: MsgData) =>
    msgData.reply(await cmdListUrl),
  cmdDetails('Help', '`help`', 'Get a link to this command list.')
);


const questionListCombined = async (msgData: MsgData, page) => {
  const questionCount = await getQuestionCount();
  if (questionCount === 0) {
    msgData.reply('There are no saved questions.');
    return;
  }

  const maxPage = numPages(questionCount, 30);
  if (page >= maxPage) {
    msgData.reply(`Invalid page number! The largest page number is ${maxPage}.`);
    return;
  }

  const questions = await getQuestionList(page, 30);
  const formattedData = questionListFormatter(questions, page + 1, maxPage);
  const url = await upload(`Quizzical Question List | Page ${page + 1}`, formattedData);
  msgData.reply(url);
};

export const questionList = makeCommand(
  /^questionList$/,
  (msgData: MsgData) => questionListCombined(msgData, 0),
  cmdDetails('Get Question List', '`questionList` | `questionList [page]`', 'Gets a list of 30 saved questions')
);

export const questionListWithPageNumber = makeCommand(
  /^questionList [1-9]\d*$/,
  async (msgData: MsgData) => questionListCombined(msgData, parseInt(msgData.words[1], 10) - 1)
);

export const startQuestion = makeCommand(
  /^startQuestion /,
  async (msgData: MsgData) => {
    const state = getState();
    if (
      state.global === null || state.global === undefined
      || state.global.settings === null || state.global.settings === undefined
      || state.global.activeQuestion === null || state.global.activeQuestion === undefined
    ) {
      throw Error('Type error!');
    }
    const settings = state.global.settings;
    const activeQuestion = state.global.activeQuestion;

    if (activeQuestion.running) {
      msgData.reply('A question is already running.');
      return;
    }

    if (settings.misc === null || settings.misc === undefined || typeof settings.misc !== 'object') {
      throw Error('Type error!');
    }
    const miscSettings: {} = settings.misc;

    if (
      miscSettings.defaultDuration === null || miscSettings.defaultDuration === undefined
      || typeof miscSettings.defaultDuration !== 'string'
    ) {
      throw Error('Type error!');
    }
    let duration = parseInt(miscSettings.defaultDuration, 10);

    if (
      miscSettings.defaultPrize === null || miscSettings.defaultPrize === undefined
      || typeof miscSettings.defaultPrize !== 'string'
    ) {
      throw Error('Type error!');
    }
    let prize = parseInt(miscSettings.defaultPrize, 10);

    let mode = 0;

    const args = msgData.words.slice(1).map(parseInt);

    if (args.length === 0 || args.length > 4 || args.map(isNaN).includes(true)) {
      msgData.reply('Malformed command. Use the help command for more info.');
      return;
    }

    if (args.length === 4) {
      mode = args[3];
      if (![0, 1, 2].includes(mode)) {
        msgData.reply('Mode must be 0, 1 or 2.');
        return;
      }
    }

    if (args.length >= 3) {
      prize = args[2];
    }

    if (args.length >= 2) {
      duration = args[1];
      if (duration <= 0) {
        msgData.reply('Duration must be at least 1 second.');
        return;
      }
    }

    const questionID = args[0];
    try {
      const question = await getQuestionByID(questionID);
      dispatch(activeQuestionStart(question, duration, prize, mode === 2, mode === 0));
    } catch (e) {
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


const finishOrCancelQuestion = (cancelled: boolean) => (msgData: MsgData) => {
  const state = getState();
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
  if (!running) {
    msgData.reply('There is no question currently running.');
    return;
  }

  dispatch(activeQuestionEnd(cancelled));
};

export const finishQuestion = makeCommand(
  /^finishQuestion$/,
  finishOrCancelQuestion(false),
  cmdDetails('Finish Question', '`finishQuestion`', 'Finishes an active question immediately.')
);

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

cmdListUrl = upload('Quizzical Command List', commandListFormatter(commands));

export default commands;
