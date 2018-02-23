// @flow

import { createLogic } from 'redux-logic';

import { delay, formatWithContext } from '../../utils/helperFuncs';
import { queueMessage } from '../../_modules/twitch/chat';
import type { MsgData } from '../../_modules/twitch/msgData';

import {
  ACTIVE_QUESTION_START, ACTIVE_QUESTION_TICK, ACTIVE_QUESTION_HANDLE_ANSWER, ACTIVE_QUESTION_END,
  activeQuestionTick, activeQuestionEnd, activeQuestionStoreAnswerer
} from './activeQuestionActions';


const lower = str => str.toLowerCase();
const getContextFromState = (state, settings, extra={}) => {
  const { prize, question, correctAnswerers, timeLeft } = state;
  const winners = [...correctAnswerers];

  const context = {
    prize: `${prize} ${settings['misc'][`point${Math.abs(prize) === 1 ? '' : 's'}Name`]}`,
    rawPrize: prize,
    question: question.content,
    timeLeft,
    ...extra
  };

  if (winners.length === 1)
    context.winner = winners[0];
  else if (winners.length > 1)
    context.winners = `${[...winners].slice(0, -1).join(', ')} and ${winners[winners.length-1]}`;

  return context;
};
const sendFormatted = (msg, state, settings, extraContext={}, sender=queueMessage) =>
  sender(formatWithContext(msg, getContextFromState(state, settings, extraContext)));
const getSender = (state, settings, extraContext={}, sender=queueMessage) => msg =>
  sendFormatted(msg, state, settings, extraContext, sender);


const activeQuestionStartLogic = createLogic({
  type: ACTIVE_QUESTION_START,
  process: async ({ getState }, dispatch, done) => {
    const globalState = getState()['global'];
    const state = globalState['activeQuestion'];
    const { question, timeLeft, prize, answerMap } = state;
    const { settings } = globalState;
    const { chatMessages } = settings;

    const send = getSender(state, settings);

    const rawAnswers = [question.correctAnswer, ...question.incorrectAnswers];
    const indexedAnswers = rawAnswers.map((answer, ix) => [answerMap[ix], `${answerMap[ix]}. ${answer}`]);
    indexedAnswers.sort((a, b) => a[0] - b[0]);
    const parsedAnswers = indexedAnswers.map(indexedAnswer => indexedAnswer[1]);

    send(chatMessages['questionStarted']);
    send(chatMessages['showQuestion']);
    queueMessage(parsedAnswers.join(' | '));

    await delay(1000);
    dispatch(activeQuestionTick());

    done();
  }
});

const activeQuestionTickLogic = createLogic({
  type: ACTIVE_QUESTION_TICK,
  process: async ({ getState }, dispatch, done) => {
    const { timeLeft, running } = getState()['global']['activeQuestion'];

    if (running) {
      if (timeLeft > 0) {
        await delay(1000);
        dispatch(activeQuestionTick());
      } else {
        dispatch(activeQuestionEnd());
      }
    }
    done();
  }
});

const activeQuestionHandleAnswerLogic = createLogic({
  type: ACTIVE_QUESTION_HANDLE_ANSWER,
  process: ({ action, getState }, dispatch, done) => {
    const globalState = getState()['global'];
    const state = globalState['activeQuestion'];
    const { settings } = globalState;
    const { chatMessages } = settings;

    const msgData: MsgData = action['payload']['msgData'];

    const reply = getSender(state, settings, { target: msgData.sender.display }, msgData.reply);

    if (state['running'] && msgData.isWhisper) {
      const choice = parseInt(msgData.msg);
      const answerMap: Array<number> = state['answerMap'];
      const { correctAnswerers, incorrectAnswerers, endEarly } = state;

      if ([...correctAnswerers, ...incorrectAnswerers].map(lower).includes(msgData.sender.raw)) {
        reply(chatMessages['alreadyAnswered']);
      } else if (isNaN(choice) || Math.floor(choice) !== choice || choice <= 0 || choice > answerMap.length ) {
        reply(chatMessages['invalidAnswer']);
      } else {
        reply(chatMessages['answerReceived']);
        const isCorrect = answerMap.indexOf(choice) === 0;

        if (!endEarly || correctAnswerers.size === 0)
          dispatch(activeQuestionStoreAnswerer(
            msgData.sender.display, isCorrect && (correctAnswerers.size === 0 || state['multipleWinners'])
          ));
        if (isCorrect && endEarly)
          dispatch(activeQuestionEnd());
      }
    }

    done();
  }
});

const activeQuestionEndLogic = createLogic({
  type: ACTIVE_QUESTION_END,
  process: ({ action, getState }, dispatch, done) => {
    const globalState = getState()['global'];
    const { settings } = globalState;
    const { chatMessages } = settings;
    const state = globalState['activeQuestion'];

    const send = getSender(state, settings);
    const { cancelled } = action.payload;

    if (cancelled) {
      send(chatMessages['questionCancelled']);
    } else {
      const { correctAnswerers } = state;
      const numWinners = [...correctAnswerers].length;
      if (numWinners === 0) {
        send(chatMessages['questionEndNoWinners']);
      } else {
        if (numWinners === 1)
          send(chatMessages['questionEndSingleWinner']);
        else
          send(chatMessages['questionEndMultipleWinners']);

        // TODO: add points to bot
      }
    }

    done();
  }
});


export default [
  activeQuestionStartLogic,
  activeQuestionTickLogic,
  activeQuestionHandleAnswerLogic,
  activeQuestionEndLogic
]
