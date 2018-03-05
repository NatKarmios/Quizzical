// @flow
/* eslint-disable flowtype/no-weak-types */

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';

import { MDIcon, HeaderLinkButton } from '../utils/components';

import * as SettingsActions from './settingsActions';
import ControlButtons from './SettingsControlButtons';
import Panels from './SettingsPanels';
import DangerZone from './SettingsDangerZone';
import { mergeOntoSettings, saveSettings, resetSettings } from '../_modules/savedSettings/savedSettings';
import type { SettingsType } from '../utils/types';
import { deleteAllQuestions } from '../_modules/db/dbQueries';
import { restart } from '../utils/helperFuncs';


const checkIfUnsavedChanges = tempSettings => {
  let unsavedChanges = false;
  if (tempSettings !== null && typeof tempSettings === 'object') {
    Object.keys(tempSettings).forEach(category => {
      if (tempSettings[category] !== null && typeof tempSettings[category] === 'object') {
        Object.keys(tempSettings[category]).forEach(label => {
          if (
            tempSettings[category][label] !== undefined && tempSettings[category][label] !== null
          ) {
            unsavedChanges = true;
          }
        });
      }
    });
  }
  return unsavedChanges;
};


const logOutOfTwitch = async (settings: SettingsType): Promise<void> => {
  const newSettings = mergeOntoSettings(settings, {
    login: {
      streamerAuthToken: null,
      botAuthToken: null
    }
  });
  await saveSettings(newSettings);
  restart();
};

const deleteQuestions = async (): Promise<void> => {
  await deleteAllQuestions();
  restart();
};

const resetToDefaultSettings = async (settings: SettingsType): Promise<void> => {
  const newSettings = resetSettings(settings);
  await saveSettings(newSettings);
  restart();
};


type Props = {
  settings: SettingsType,
  expanded: number,
  tempSettings: {},
  expandPanel: (number, number) => any,
  updateTempSetting: () => any,
  saveTempSettings: () => any,
  clearTempSettings: () => any,
  canSave: boolean
};


const Settings = ({
  settings, expanded, tempSettings, expandPanel, updateTempSetting,
  saveTempSettings, clearTempSettings, canSave
}: Props) => {
  const unsavedSettings = checkIfUnsavedChanges(tempSettings);

  const logout = () => {
    logOutOfTwitch(settings).catch();
  };
  const reset = () => {
    resetToDefaultSettings(settings).catch();
  };

  return (
    <div style={{ margin: '20px' }}>
      <Paper style={{ padding: '20px' }}>
        <Typography type="headline">
          <MDIcon color="black" style={{ marginRight: '5px' }}>settings</MDIcon>
          Settings
          <HeaderLinkButton tooltipText="Back to home" linkTo="/home" icons={['arrow-left-bold', 'home']} width="80px" />
        </Typography>
      </Paper>

      <br />

      <ControlButtons
        saveEnabled={canSave && unsavedSettings}
        clearEnabled={unsavedSettings}
        onSave={saveTempSettings}
        onClear={clearTempSettings}
      />

      <br />

      <Panels
        settings={settings}
        expanded={expanded}
        tempSettings={tempSettings}
        expandPanel={expandPanel}
        onTempSettingChange={updateTempSetting}
      />

      <DangerZone onLogout={logout} onDeleteQuestions={deleteQuestions} onReset={reset} />
    </div>
  );
};

function mapStateToProps(state) {
  return {
    settings: state.global.settings,
    expanded: state.settings.expanded,
    tempSettings: state.settings.tempSettings,
    canSave: state.settings.errorFields.size === 0
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(SettingsActions, dispatch);
}


// $FlowFixMe
export default connect(mapStateToProps, mapDispatchToProps)(Settings);
