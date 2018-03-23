// @flow

import React from 'react';
import type { Node } from 'react';
import { ListItem } from 'material-ui/List';


type Props = {
  children: Node
};


const CenteredListItem = ({ children }: Props) => (
  <ListItem>
    <span style={{ width: '100%', color: 'black', textAlign: 'center' }}>
      {children}
    </span>
  </ListItem>
);

export default CenteredListItem;
