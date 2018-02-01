// @flow
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Paper from 'material-ui/Paper';
import { MDIcon, HeaderLinkButton } from '../utils/components';
import Typography from 'material-ui/es/Typography/Typography';

import * as SettingsActions from './settingsActions';
import ControlButtons from './SettingsControlButtons'
import Panels from './SettingsPanels';
import DangerZone from './SettingsDangerZone';
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
  restart();
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
          <HeaderLinkButton tooltipText="Back to home" linkTo="/home" icons={['arrow-left-bold', 'home']} width="80px"/>
        </Typography>
      </Paper>

      <br/>

      <ControlButtons enabled={unsavedSettings} onSave={saveTempSettings} onClear={clearTempSettings}/>

      <br/>

      <Panels
        expanded={expanded}
        tempSettings={tempSettings}
        expandPanel={expandPanel}
        onTempSettingChange={updateTempSetting}
      />

      <DangerZone onLogout={logOutOfTwitch} onDeleteQuestions={()=>{}} onReset={resetToDefaultSettings}/>
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
