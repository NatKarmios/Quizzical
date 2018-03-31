// @flow

import type { WinnerTotalType } from '../../../utils/types';

/**
 *  Transform a list of winner totals into a Markdown-readable table of
 *  winner information.
 *
 * @param winnerList | The list of winners to be transformed
 * @returns The Markdown-formatted winner table
 */
const leaderboardFormatter = (winnerList: Array<WinnerTotalType>) =>
  [
    `*Showing top ${winnerList.length} viewer${
      winnerList.length === 1 ? '' : 's'
    }.*`,
    '',
    '| Viewer | Wins |',
    '| ------ | ---- |',
    ...winnerList.map(
      (winner: WinnerTotalType) => `| ${winner.name} | ${winner.total} |`
    ),
    ''
  ].join('\n');

export default leaderboardFormatter;
