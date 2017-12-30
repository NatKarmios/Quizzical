// @flow
import React from 'react';
import { Link } from 'react-router-dom';
import Button from 'material-ui/Button';
import Paper from 'material-ui/Paper';
import { MDIcon } from '../utils/components';
import Typography from 'material-ui/es/Typography/Typography';

const Home = () => (
  <div>
    <Paper style={{ margin: '20px', padding: '20px' }}>
      <Typography type="headline">
        <MDIcon color="black" style={{ marginRight: '5px' }}>home</MDIcon>
        Home
        <Link to="/settings">
          <Button raised color="primary" style={{ float: 'right', top: '-5px' }}>
            <MDIcon>settings</MDIcon>
          </Button>
        </Link>
      </Typography>
    </Paper>
  </div>
);

export default Home;
