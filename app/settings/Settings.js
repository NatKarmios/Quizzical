// @flow
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import Button from 'material-ui/Button';
import Paper from 'material-ui/Paper';
import { MDIcon } from '../utils/components';
import Typography from 'material-ui/es/Typography/Typography';

import * as SettingsActions from './settingsActions';
import Panels from './SettingsPanels';
import DangerZone from './SettingsDangerZone';

const Settings = ({ expanded, expandPanel }) => (
  <div style={{ margin: '20px' }}>
    <Paper style={{ padding: '20px', marginBottom: '20px' }}>
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

    <Panels expanded={expanded} expandPanel={expandPanel}/>

    <DangerZone/>

  </div>
);

function mapStateToProps(state) {
  return {
    expanded: state.settings.expanded
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(SettingsActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
