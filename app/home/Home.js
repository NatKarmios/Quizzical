// @flow
import React from 'react';
import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid';
import { MDIcon, HeaderLinkButton } from '../utils/components';
import Typography from 'material-ui/es/Typography/Typography';

const Home = () => (
  <div style={{ margin: '20px' }}>
    <Paper style={{ padding: '20px' }}>
      <Typography type="headline">
        <MDIcon color="black" style={{ marginRight: '5px' }}>home</MDIcon>
        Home
        <HeaderLinkButton
          tooltipText="To settings" linkTo="/settings" icons={['settings']} width="70px"/>
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
