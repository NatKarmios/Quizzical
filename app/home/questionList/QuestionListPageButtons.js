// @flow
import React from 'react';
import Tooltip from 'material-ui/Tooltip';
import IconButton from 'material-ui/IconButton';
import { MDIcon, Space, CenteredListItem } from '../../utils/components';

const QuestionListPageButtons = () => (
  <CenteredListItem>
    <Tooltip title="Previous page">
      <IconButton><MDIcon>chevron-double-left</MDIcon></IconButton>
    </Tooltip>
    <Space>4</Space>
    1/20
    <Space>4</Space>
    <Tooltip title="Next page">
      <IconButton><MDIcon>chevron-double-right</MDIcon></IconButton>
    </Tooltip>
  </CenteredListItem>
);

export default QuestionListPageButtons;
