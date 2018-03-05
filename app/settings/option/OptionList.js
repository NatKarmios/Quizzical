// @flow

import React from 'react';
import type { Node } from 'react';
import List from 'material-ui/List';

import SettingsExpansionPanel from '../SettingsExpansionPanel';


type Props = {
  title: Node,
  subtitle: Node,
  expanded: boolean,
  // eslint-disable-next-line flowtype/no-weak-types
  onExpand: () => any,
  children: Node
};


const OptionList = ({ title, subtitle, expanded, onExpand, children }: Props) => (
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
