// @flow
import React, { Component } from 'react';
import Typography from 'material-ui/Typography';
import { MDIcon } from '../utils/components';
import { withStyles } from 'material-ui/styles';
import List, { ListItem, ListItemIcon, ListItemText, ListItemSecondaryAction } from 'material-ui/List';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import Icon from 'material-ui/Icon';

import SettingsExpansionPanel from './SettingsExpansionPanel';

type DefaultProps = {};
type Props = {};
type State = { expanded: number };


const SettingsPanels = ({ expanded, expandPanel }) => {
  const handleExpansion = (newPanel) => () => { expandPanel(expanded, newPanel); };
  return (
    <div>
      <SettingsExpansionPanel
        expanded={expanded === 1}
        onChange={handleExpansion(1)}
        primary="General settings"
        secondary="I am an expansion panel"
      >
        <List style={{color: 'black'}}>
          <ListItem>
            <ListItemIcon>
              <MDIcon>exclamation</MDIcon>
            </ListItemIcon>
            <ListItemText inset primary={
              <Typography>
                Options!
              </Typography>
            } secondary="whoa!"/>
          </ListItem>
        </List>
      </SettingsExpansionPanel>
      <SettingsExpansionPanel
        expanded={expanded === 2}
        onChange={handleExpansion(2)}
        primary="Bot Chat Messages"
        secondary="Customize 'em!"
      >
        <List style={{color: 'black'}}>
          <ListItem>
            <ListItemIcon>
              <Icon>
                <MDIcon>alert-circle-outline</MDIcon>
              </Icon>
            </ListItemIcon>
            <ListItemText inset primary={
              <TextField
                id="join-message"
                label="Join Message"
              />
            } />
            <ListItemSecondaryAction>
              <IconButton>
                <MDIcon>backup-restore</MDIcon>
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      </SettingsExpansionPanel>
    </div>
  );
};

export default SettingsPanels;
