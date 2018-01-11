// @flow
import React from 'react';
import { Link } from 'react-router-dom';
import Button from 'material-ui/Button';
import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid';
import { MDIcon } from '../utils/components';
import Typography from 'material-ui/es/Typography/Typography';

const Home = () => (
  <div style={{ margin: '20px' }}>
    <Paper style={{ padding: '20px' }}>
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
    <br/>
    <Grid container>
      <Grid item xs={12} sm={6}>
        <Paper style={{ padding: '20px' }}>
          <Typography>[Question list]</Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Paper style={{ padding: '20px' }}>
          <Typography>[Settings]</Typography>
        </Paper>
      </Grid>
    </Grid>
  </div>
);

export default Home;
