// @flow
import React from 'react';
import List, { ListItem, ListItemText } from 'material-ui/List';
import Tooltip from 'material-ui/Tooltip';
import Divider from 'material-ui/Divider';
import IconButton from 'material-ui/IconButton';
import { MDIcon } from '../../utils/components';

import PageButtons from './QuestionListPageButtons';
import AddButtons from './QuestionListAddButtons';


const QuestionListItem = ({ content, external }) => (
  <ListItem button>
    <ListItemText primary={content}/>
    {
      external ? (
        <Tooltip title="Imported" style={{ float: 'right' }} placement="right">
          <IconButton style={{ width: '32px', height: '32px' }} disableRipple>
            <MDIcon>web</MDIcon>
          </IconButton>
        </Tooltip>
      ) : null
    }
  </ListItem>
);

const QuestionList = () => (
  <List>
    <QuestionListItem content={"External!"} external={true} />
    <QuestionListItem content={"Homemade!"} external={false} />
    <Divider />
    <PageButtons />
    <Divider />
    <AddButtons />
  </List>
);

export default QuestionList;
