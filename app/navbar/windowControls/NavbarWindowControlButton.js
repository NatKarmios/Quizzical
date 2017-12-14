// @flow
import React from 'react';
import IconButton from 'material-ui/IconButton';
import MDIcon from '../../utils/components/MDIcon';

type propType = {
  onClick: void => void,
  icon: string
};

const NavbarWindowControlButton = ({ icon, onClick }: propType) => (
  <IconButton onClick={onClick}>
    <MDIcon color="white">{icon}</MDIcon>
  </IconButton>
);

export default NavbarWindowControlButton;
