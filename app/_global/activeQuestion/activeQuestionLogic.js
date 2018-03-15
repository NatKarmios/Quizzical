// @flow

import { createLogic } from 'redux-logic';

import { delay, formatWithContext } from '../../utils/helperFuncs';
import { queueMessage } from '../../_modules/twitch/chat';
import type { MsgData } from '../../_modules/twitch/msgData';
import { distributePoints } from '../../_modules/streamlabsBot';
import { insertUsedQuestion } from '../../_modules/db/dbQueries';

import {
  ACTIVE_QUESTION_START, ACTIVE_QUESTION_TICK, ACTIVE_QUESTION_HANDLE_ANSWER, ACTIVE_QUESTION_END,
  activeQuestionTick, activeQuestionEnd, activeQuestionStoreAnswerer
} from './activeQuestionActions';


const lower = str => str.toLowerCase();

/**
 *  Maps the current program state and user settings into an object
 *  used for chat message formatting.
 *
 * @param state    | The current program state
 * @param settings | User settings
 * @param extra    | Any other variables that may apply to the
 *                 | context of the message being sent
 *
 * @returns An arbitrary object of string:string mappings that can
 *          be substituted into the user's custom chat messages.
 */
const getContextFromState = (state, settings, extra = {}) => {
  const { prize, question, correctAnswerers, duration, timeLeft } = state;
  const winners = [...correctAnswerers];

  const context = {
    // Insert variables from active question state
    prize: `${prize} ${settings.misc[`point${Math.abs(prize) === 1 ? '' : 's'}Name`]}`,
    rawPrize: prize,
    question: question.content,
    duration,
    timeLeft,

    // Insert extra variables
    ...extra
  };

  // If there are any winners for the active question, insert a
  // 'winner' or 'winners' variable as appropriate.
  if (winners.length === 1) {
    context.winner = winners[0];
  } else if (winners.length > 1) {
    context.winners = `${[...winners].slice(0, -1).join(', ')} and ${winners[winners.length - 1]}`;
  }

  return context;
};

/**
 *  Convenience function; takes and uses all the necessary pieces of
 *  data to send a message, which has been formatted using variables from
 *  the current program state and from user settings.
 *
 * @param msg          | The message to be sent
 * @param state        | The current program state
 * @param settings     | User settings
 * @param extraContext | Any extra variables to be formatted; optional
 * @param sender       | The function to use when sending; optional, and
 *                     | defaults to chat/queueMessage()
 * @returns Nothing.
 */
const sendFormatted = (msg, state, settings, extraContext = {}, sender = queueMessage) => {
  sender(formatWithContext(msg, getContextFromState(state, settings, extraContext)));
};

/**
 *  Convenience function; curries sendFormatted() with all of its
 *  parameters except `msg`, so said parameters only have to be
 *  specified once.
 *
 * @param state        | The current program state
 * @param settings     | User settings
 * @param extraContext | Any extra variables to be substituted into
 *                     | the message; optional
 * @param sender       | The function with which to send messages; optional,
 *                     | and defaults to chat/queueMessage()
 * @returns A function that takes a string message, formats it, then
 *          sends it via the given sender function.
 */
const getSender = (state, settings, extraContext = {}, sender = queueMessage) => msg =>
  sendFormatted(msg, state, settings, extraContext, sender);


/**
 *  The logic for when a question is started.
 */
const activeQuestionStartLogic = createLogic({
  type: ACTIVE_QUESTION_START,
  process: async ({ getState }, dispatch, done) => {
    // Extract necessary variiables from state and user settings
    const globalState = getState().global;
    const state = globalState.activeQuestion;
    const { question, answerMap } = state;
    const { settings } = globalState;
    const { chatMessages } = settings;

    // Obtain sender function (see above)
    const send = getSender(state, settings);

    // Compile complete answer array from the correct answer
    // and incorrect answers. The first item is always the correct answser.
    const rawAnswers = [question.correctAnswer, ...question.incorrectAnswers];

    // Map the answers into pairs of the index numbered format, i.e.:
    // ['a', 'b', 'c'] => [[2, '2. a'], [3, '3. b'], [1, '1. c']]
    const indexedAnswers = rawAnswers.map((answer, ix) => [answerMap[ix], `${answerMap[ix]}. ${answer}`]);

    // Sort the answers into the shuffled answer order, i.e.:
    // [[2, '2. a'], [3, '3. b'], [1, '1. c']] =>
    //   [[1, '1. c'], [2, '2. a'], [3, '3. b']]
    indexedAnswers.sort((a, b) => a[0] - b[0]);

    // Discard the index in the pairs, i.e.:
    // [[1, '1. c'], [2, '2. a'], [3, '3. b']] => ['1. c', '2. a', '3. b']
    const parsedAnswers = indexedAnswers.map(indexedAnswer => indexedAnswer[1]);

    // Send the 'quesiton started' message, the question itself, and the answer list
    // to chat. The answers are separated by '|' characters, joined such that:
    // ['1. c', '2. a', '3. b'] => '1. c | 2. a | 3. b'
    send(chatMessages.questionStarted);
    send(chatMessages.showQuestion);
    queueMessage(parsedAnswers.join(' | '));

    // After one second, start counting down the timer.
    await delay(1000);
    dispatch(activeQuestionTick());

    done();
  }
});

/**
 *  Logic for each tick of the current question
 */
const activeQuestionTickLogic = createLogic({
  type: ACTIVE_QUESTION_TICK,
  process: async ({ getState }, dispatch, done) => {
    // Extract values from state
    const { timeLeft, running } = getState().global.activeQuestion;

    // If there is a question already running...
    if (running) {
      // If there is still time left...
      if (timeLeft > 0) {
        // Wait 1 second then tick again
        await delay(1000);
        dispatch(activeQuestionTick());
      } else {
        // Otherwise end the question
        dispatch(activeQuestionEnd());
      }
    }
    done();
  }
});

/**
 *  The logic for handling a viewer's answer.
 */
const activeQuestionHandleAnswerLogic = createLogic({
  type: ACTIVE_QUESTION_HANDLE_ANSWER,
  process: ({ action, getState }, dispatch, done) => {
    // Extract values from state and user settings
    const globalState = getState().global;
    const state = globalState.activeQuestion;
    const { settings } = globalState;
    const { chatMessages } = settings;

    // Get message data from action payload
    const msgData: MsgData = action.payload.msgData;

    // Get sender function
    const reply = getSender(state, settings, { target: msgData.sender.display }, msgData.reply);

    // Answer will not be handled if there is no running question, or if
    // the given message was not whispered.
    if (state.running && msgData.isWhisper) {
      // Parse the viewer's answer choice
      const choice = parseInt(msgData.msg, 10);

      // Extract more values from state
      const answerMap: Array<number> = state.answerMap;
      const { correctAnswerers, incorrectAnswerers, endEarly, multipleWinners } = state;

      if ([...correctAnswerers, ...incorrectAnswerers].map(lower).includes(msgData.sender.raw)) {
        // If either answerer list contains the viewer, ignore their answer
        // and notify that they've already answered.
        reply(chatMessages.alreadyAnswered);
      } else if (
        isNaN(choice) || Math.floor(choice) !== choice || choice <= 0 || choice > answerMap.length
      ) {
        // If the viewer's choice is malformed, or outside the range of
        // possible answers, notify them of such and ignore their answer
        reply(chatMessages.invalidAnswer);
      } else {
        // Otherwiser, the answer is valid.
        // Tell the user their answer was accepted.
        reply(chatMessages.answerReceived);

        // Check if the answer is correct
        const isCorrect = answerMap.indexOf(choice) === 0;

console.log({isCorrect, endEarly, correctAnswerers, msgData})
        // If the question is supposed to end on the first correct answer,
        // and someone has already answered correctly, then ignore
        // any new answers
        if (!endEarly || correctAnswerers.size === 0) {
          // If only one winner is allowed, and someone has already answered
          // correctly, any subsequent answers are considered incorrect.
          dispatch(activeQuestionStoreAnswerer(
            msgData.sender.display,
            isCorrect && (correctAnswerers.size === 0 || multipleWinners)
          ));
        }

        // If the question is supposed to end on the first correct answer, and
        // this answer is correct, end the question.
        if (isCorrect && endEarly) {
          dispatch(activeQuestionEnd());
        }
      }
    }

    done();
  }
});

/**
 *  The logic for the end of a question.
 */
const activeQuestionEndLogic = createLogic({
  type: ACTIVE_QUESTION_END,
  process: ({ action, getState }, dispatch, done) => {
    // Extract variables from state and settings
    const globalState = getState().global;
    const { settings } = globalState;
    const { chatMessages } = settings;
    const state = globalState.activeQuestion;

    // Get sender function
    const send = getSender(state, settings);

    // Get data from action payload
    const { cancelled } = action.payload;

    // If the question had been cancelled...
    if (cancelled) {
      // Notify viewers
      send(chatMessages.questionCancelled);
    } else {
      // Otherwise...
      // Get more data from state
      const { correctAnswerers } = state;
      const numWinners = [...correctAnswerers].length;

      // Send an appropriate message to chat; there are either:
      // - No winners
      // - A single winner
      // - Multiple winners
      if (numWinners === 0) {
        send(chatMessages.questionEndNoWinners);
      } else if (numWinners === 1) {
        send(chatMessages.questionEndSingleWinner);
      } else {
        send(chatMessages.questionEndMultipleWinners);
      }

      // Distribute points to the winners
      distributePoints([...state.correctAnswerers], state.prize).catch();
    }

    // Save question data
    insertUsedQuestion(
      state.question.questionID,
      cancelled,
      state.duration,
      state.prize,
      [...state.correctAnswerers]
    );

    done();
  }
});


export default [
  activeQuestionStartLogic,
  activeQuestionTickLogic,
  activeQuestionHandleAnswerLogic,
  activeQuestionEndLogic
];
