// @flow

import { getTimeString, getDateString } from '../../../utils/helperFuncs';
import type { UsedQuestionType } from '../../../utils/types';

/**
 *  Maps a single 'used question' object into a Markdown-readable format
 *
 * @param [unnamed] | The used querstion to be mapped
 * @returns The Markdown-formatter used question
 */
const mapRecentQuestion = ({
  question,
  cancelled,
  finishTime,
  duration,
  prize,
  winners
}: UsedQuestionType): string =>
  [
    `## ${question.content}`,
    'Time Used | Duration | Prize | Winners | Cancelled? | External question?',
    ':--------:| --------:| -----:| -------:|:----------:|:-----------------:',
    [
      `${getDateString(finishTime)} ${getTimeString(finishTime)}`,
      `${duration}`,
      `${prize}`,
      `${winners}`,
      cancelled ? '✓' : '✗',
      question.external ? '✓' : '✗'
    ].join(' | ')
  ].join('\n');

/**
 *  Transform a list of used questions into a Markdown-readable list of
 *  used question information.
 *
 * @param recentQuestions | The list of used to be transformed
 * @returns The Markdown-formatted command list
 */
const recentQuestionsFormatter = (
  recentQuestions: Array<UsedQuestionType>
): string =>
  [
    `Showing the ${recentQuestions.length} most recently-used question${
      recentQuestions.length === 1 ? '' : 's'
    }.`,
    '',
    recentQuestions.map(mapRecentQuestion).join('\n\n')
  ].join('\n');

export default recentQuestionsFormatter;
