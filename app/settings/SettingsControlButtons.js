// @flow
import React from 'react';
import Button from 'material-ui/Button';

import { InlineIcon, Space } from '../utils/components';

type Props = {
  saveEnabled: boolean,
  clearEnabled: boolean,
  // eslint-disable-next-line flowtype/no-weak-types
  onSave: () => any,
  // eslint-disable-next-line flowtype/no-weak-types
  onClear: () => any
};

const SettingsControlButtons = ({
  saveEnabled,
  clearEnabled,
  onSave,
  onClear
}: Props) => (
  <div style={{ width: '100%', textAlign: 'center' }}>
    <span>
      <Button
        raised
        dense
        color="primary"
        onClick={onSave}
        disabled={!saveEnabled}
      >
        <InlineIcon>content-save</InlineIcon>
        <Space>2</Space>
        Save
      </Button>
    </span>
    <Space>4</Space>
    <span>
      <Button
        raised
        dense
        color="accent"
        onClick={onClear}
        disabled={!clearEnabled}
      >
        <InlineIcon>delete</InlineIcon>
        <Space>2</Space>
        Discard
      </Button>
    </span>
  </div>
);

export default SettingsControlButtons;
