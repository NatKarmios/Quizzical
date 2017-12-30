// @flow
import React from 'react';
import { Link } from 'react-router-dom';
import Button from 'material-ui/Button';
import Paper from 'material-ui/Paper';
import { MDIcon } from '../utils/components';
import Typography from 'material-ui/es/Typography/Typography';

const Settings = () => (
  <div>
    <Paper style={{ margin: '20px', padding: '20px' }}>
      <Typography type="headline">
        <MDIcon color="black" style={{ marginRight: '5px' }}>settings</MDIcon>
        Settings
        <Link to="/home">
          <Button raised color="primary" style={{ float: 'right', top: '-5px' }}>
            <MDIcon>arrow-left-bold</MDIcon>
            <MDIcon>home</MDIcon>
          </Button>
        </Link>
      </Typography>
    </Paper>
  </div>
);

export default Settings;
