// @flow

import { getTimeString, getDateString } from '../../../utils/helperFuncs';
import type { UsedQuestionType } from '../../../utils/types';

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

const recentQuestions = (recentQuestions: Array<UsedQuestionType>): string =>
  [
    `Showing the ${recentQuestions.length} most recently-used question${
      recentQuestions.length === 1 ? '' : 's'
    }.`,
    '',
    recentQuestions.map(mapRecentQuestion).join('\n\n')
  ].join('\n');

export default recentQuestions;
