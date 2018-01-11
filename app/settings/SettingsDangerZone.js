// @flow
import React from 'react';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';

import { Space } from '../utils/components';

const SettingsDangerZone = () => (
  <Paper style={{ marginTop: '20px', padding: '20px', backgroundColor: '#FDD' }}>
    <Typography type="subheading">
      Danger Zone
    </Typography>
    <br/>
    <div style={{ textAlign: 'center' }}>
      <Button raised color="accent">LOG OUT OF TWITCH</Button>
      <Space>8</Space>
      <Button raised color="accent">CLEAR SAVED DATA</Button>
    </div>
  </Paper>
);

export default SettingsDangerZone;
