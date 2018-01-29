// @flow
import React from 'react';
import List, { ListItem, ListItemText } from 'material-ui/List';
import Tooltip from 'material-ui/Tooltip';
import Divider from 'material-ui/Divider';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import { MDIcon, Space } from '../utils/components/';


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

const CenteredListItem = ({ children }) => (
  <ListItem>
    <span style={{ width: '100%', color: 'black', textAlign: 'center' }}>
      {children}
    </span>
  </ListItem>
)

const HomeQuestionList = () => (
  <List>
    <QuestionListItem content={"External!"} external={true} />
    <QuestionListItem content={"Homemade!"} external={false} />
    <Divider />
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
    <Divider />
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
  </List>
);

export default HomeQuestionList;
