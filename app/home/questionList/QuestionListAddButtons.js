// @flow
import React from 'react';
import Tooltip from 'material-ui/Tooltip';
import Button from 'material-ui/Button';
import { MDIcon, Space, CenteredListItem } from '../../utils/components';

const QuestionListAddButtons = () => (
  <CenteredListItem>
    <Tooltip title="Add question">
      <Button raised dense color="primary">
        <MDIcon>plus</MDIcon><MDIcon>keyboard</MDIcon>
      </Button>
    </Tooltip>
    <Space>4</Space>
    <Tooltip title="Import questions">
      <Button raised dense color="primary">
        <MDIcon>plus</MDIcon><MDIcon>web</MDIcon>
      </Button>
    </Tooltip>
  </CenteredListItem>
);

export default QuestionListAddButtons;
