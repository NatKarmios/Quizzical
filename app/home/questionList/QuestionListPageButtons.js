// @flow
import React from 'react';
import Tooltip from 'material-ui/Tooltip';
import IconButton from 'material-ui/IconButton';
import { MDIcon, Space, CenteredListItem } from '../../utils/components';


type Props = {
  loading: boolean,
  currentPage: number,
  maxPage: number,
  loadNextPage: () => any,
  loadPrevPage: () => any
};


const QuestionListPageButtons = ({
   loading, currentPage, maxPage, loadNextPage, loadPrevPage
}: Props) => (
  <CenteredListItem>
    <Tooltip title="Previous page">
      <span>
        <IconButton disabled={loading || currentPage <= 0} onClick={loadPrevPage}>
          <MDIcon>chevron-double-left</MDIcon>
        </IconButton>
      </span>
    </Tooltip>
    <Space>4</Space>
    {currentPage + 1}/{Math.max(maxPage, 1)}
    <Space>4</Space>
    <Tooltip title="Next page">
      <span>
        <IconButton disabled={loading || currentPage + 1 >= maxPage} onClick={loadNextPage}>
          <MDIcon>chevron-double-right</MDIcon>
        </IconButton>
      </span>
    </Tooltip>
  </CenteredListItem>
);

export default QuestionListPageButtons;
