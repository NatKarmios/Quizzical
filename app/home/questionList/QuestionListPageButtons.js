// @flow
import React from 'react';
import Tooltip from 'material-ui/Tooltip';
import IconButton from 'material-ui/IconButton';
import { MDIcon, Space, CenteredListItem } from '../../utils/components';

const QuestionListPageButtons = ({ loading, currentPage, questionCount, loadNextPage, loadPrevPage }) => {
  const maxPage = Math.max(Math.ceil(questionCount / 10), 1);
  return (
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
        <IconButton disabled={loading || currentPage+1 >= maxPage} onClick={loadNextPage}>
          <MDIcon>chevron-double-right</MDIcon>
        </IconButton>
      </span>
      </Tooltip>
    </CenteredListItem>
  );
};

export default QuestionListPageButtons;
