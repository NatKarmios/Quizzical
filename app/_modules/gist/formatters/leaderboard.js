// @flow

import type { WinnerTotalType } from '../../../utils/types';


const leaderboardFormatter = (winnerList: Array<WinnerTotalType>) => [
  `*Showing top ${winnerList.length} viewer${winnerList.length === 1 ? '' : 's'}.*`,
  '',
  '| Viewer | Wins |',
  '| ------ | ---- |',
  ...winnerList.map((winner: WinnerTotalType) =>
    `| ${winner.name} | ${winner.total} |`
  ),
  ''
].join('\n');


export default leaderboardFormatter;
