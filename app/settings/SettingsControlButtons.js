// @flow
import React from 'react';
import Button from 'material-ui/Button';
import Tooltip from 'material-ui/Tooltip';

import { MDIcon, Space } from '../utils/components';


type Props = {
  saveEnabled: boolean,
  clearEnabled: boolean,
  // eslint-disable-next-line flowtype/no-weak-types
  onSave: () => any,
  // eslint-disable-next-line flowtype/no-weak-types
  onClear: () => any
};


const SettingsControlButtons = ({ saveEnabled, clearEnabled, onSave, onClear }: Props) => (
  <div style={{ width: '100%', textAlign: 'center' }}>
    <Tooltip title="Save changes">
      <span>
        <Button raised dense color="primary" onClick={onSave} disabled={!saveEnabled}>
          <MDIcon>content-save</MDIcon>
        </Button>
      </span>
    </Tooltip>
    <Space>4</Space>
    <Tooltip title="Discard changes">
      <span>
        <Button raised dense color="accent" onClick={onClear} disabled={!clearEnabled}>
          <MDIcon>delete</MDIcon>
        </Button>
      </span>
    </Tooltip>
  </div>
);

export default SettingsControlButtons;
