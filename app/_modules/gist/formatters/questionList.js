// @flow

import type { QuestionType } from '../../../utils/types';


/**
 *  Maps a question to a Markdown-readable format
 *
 * @param [unnamed] | The question to be mapped
 * @returns The Markdown-formatted question info
 */
const mapQuestion = ({
  questionID, content, correctAnswer, incorrectAnswers, external
}: QuestionType) =>
  [
    `## \\#${questionID}: ${content}`,
    `- **${correctAnswer}**`,
    ...incorrectAnswers.map(incorrectAnswer => `- ${incorrectAnswer}`),
    ...(external ? ['', '*This question was imported from the internet.*'] : [])
  ].join('\r');


/**
 *  Maps a list of questions to a Markdown-readable format
 *
 * @param questionList | The list of questions to be mapped
 * @param page         | The current 'page' of questions
 * @param maxPage      | The page number of the last 'page' of questions
 * @returns The Markdown-formatted question list
 */
const questionListFormatter = (
  questionList: Array<QuestionType>, page: number, maxPage: number
) => [
  `*Showing page ${page} of ${maxPage}.*`,
  '',
  questionList.map(mapQuestion).join('\r\r'),
  '',
  '',
  '*Imported questions courtesy of [Open Trivia Database](https://opentdb.com).*'
].join('\r');


export default questionListFormatter;
