// @flow
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import Button from 'material-ui/Button';
import Paper from 'material-ui/Paper';
import Tooltip from 'material-ui/Tooltip'
import { MDIcon, InlineIcon } from '../utils/components';
import Typography from 'material-ui/es/Typography/Typography';

import * as SettingsActions from './settingsActions';
import Panels from './SettingsPanels';
import DangerZone from './SettingsDangerZone';
import Space from "../utils/components/Space";
import { mergeOntoSettings, saveSettings, resetSettings } from '../_modules/savedSettings';
import { restart } from '../utils/helperFuncs';


const checkIfUnsavedChanges = tempSettings => {
  let unsavedChanges = false;
  if (tempSettings !== null && typeof tempSettings === 'object')
    Object.keys(tempSettings).forEach(category => {
      if (tempSettings[category] !== null && typeof tempSettings[category] === 'object')
        Object.keys(tempSettings[category]).forEach(label => {
          if (tempSettings[category][label] !== undefined && tempSettings[category][label] !== null)
            unsavedChanges = true;
        });
    });
  return unsavedChanges;
};


const logOutOfTwitch = async () => {
  mergeOntoSettings({
    login: {
      streamerAuthToken: null,
      botAuthToken: null
    }
  });
  await saveSettings();
  restart()
};

const resetToDefaultSettings = async () => {
  resetSettings();
  await saveSettings();
  restart();
};


const Settings = ({ expanded, tempSettings, expandPanel, updateTempSetting, saveTempSettings, clearTempSettings }) => {
  const unsavedSettings = checkIfUnsavedChanges(tempSettings);

  return (
    <div style={{ margin: '20px' }}>
      <Paper style={{ padding: '20px' }}>
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

      <br/>

      <div style={{ width: '100%', textAlign: 'center' }}>
        <Tooltip title="Save changes">
          <span>
            <Button raised dense color="primary" onClick={saveTempSettings} disabled={!unsavedSettings}>
              <MDIcon>content-save</MDIcon>
            </Button>
          </span>
        </Tooltip>
        <Space>4</Space>
        <Tooltip title="Discard changes">
          <span>
            <Button raised dense color="accent" onClick={clearTempSettings} disabled={!unsavedSettings}>
              <MDIcon>delete</MDIcon>
            </Button>
          </span>
        </Tooltip>
      </div>

      <br/>

      <Panels
        expanded={expanded}
        tempSettings={tempSettings}
        expandPanel={expandPanel}
        onTempSettingChange={updateTempSetting}
      />

      <DangerZone onLogout={logOutOfTwitch} onReset={resetToDefaultSettings}/>
    </div>
  );
};

function mapStateToProps(state) {
  return {
    expanded: state.settings.expanded,
    tempSettings: state.settings.tempSettings
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(SettingsActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
