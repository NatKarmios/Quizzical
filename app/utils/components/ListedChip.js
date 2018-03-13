// @flow

import React from 'react';
import type { Node } from 'react';
import Chip from 'material-ui/Chip';


type Props = {
// eslint-disable-next-line flowtype/no-weak-types
  onDelete: ?() => any,
  children: Node
};


const ListedChip = ({ onDelete, children }: Props) => (
  <Chip
    label={children}
    onDelete={onDelete}
    style={{ marginRight: '5px', marginBottom: '5px', display: 'flex' }}
  />
);


export default ListedChip;
