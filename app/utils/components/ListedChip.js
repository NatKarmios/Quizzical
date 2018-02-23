// @flow

import React from 'react';
import Chip from 'material-ui/Chip';


const ListedChip = ({ onDelete, children }) => (
  <Chip
    label={children}
    onDelete={onDelete}
    style={{ marginRight: '5px', marginBottom: '5px', display: 'flex' }}
  />
);

export default ListedChip;
