// @flow

import type { QuestionType } from '../../db/dbQueries';


const mapQuestion = ({ questionID, content, correctAnswer, incorrectAnswers, external }: QuestionType) =>
  [
    `## \\#${questionID}: ${content}`,
    `- **${correctAnswer}**`,
    ...incorrectAnswers.map(incorrectAnswer => `- ${incorrectAnswer}`),
    ...(external ? ['', '*This question was imported from the internet.*'] : [])
  ].join('\r');

const questionListFormatter = (questionList: Array<QuestionType>, page: number, maxPage: number) => {
  return [
    `*Showing page ${page} of ${maxPage}.*`,
    '',
    questionList.map(mapQuestion).join('\r\r'),
    '<br/><br/>',
    '*Imported questions courtesy of [Open Trivia Database](opentdb.com).*'
  ].join('\r');
};

export default questionListFormatter;
