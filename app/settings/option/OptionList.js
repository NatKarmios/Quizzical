// @flow
import React from 'react';
import List from 'material-ui/List';

import SettingsExpansionPanel from '../SettingsExpansionPanel';

const OptionList = ({ title, subtitle, expanded, onExpand, children }) => (
  <SettingsExpansionPanel
    expanded={expanded}
    onChange={onExpand}
    primary={title}
    secondary={subtitle}
  >
    <List style={{ color: 'black' }}>
      {children}
    </List>
  </SettingsExpansionPanel>
);

export default OptionList;
