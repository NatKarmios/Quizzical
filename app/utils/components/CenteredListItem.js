// @flow
import React from 'react';
import { ListItem } from 'material-ui/List';

const CenteredListItem = ({ children }) => (
  <ListItem>
    <span style={{ width: '100%', color: 'black', textAlign: 'center' }}>
      {children}
    </span>
  </ListItem>
);

export default CenteredListItem;
