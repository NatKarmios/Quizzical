// @flow
import React from 'react';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';

type propType = {
  onClick: void => void,
  children: string
};

const NavbarWindowControlButton = ({ children, onClick }: propType) => (
  <IconButton>
    <FontIcon
      color="white"
      className="material-icons"
      onClick={onClick}
    >
      {children}
    </FontIcon>
  </IconButton>
);

export default NavbarWindowControlButton;
