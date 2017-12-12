// @flow
import React from 'react';
import AppBar from 'material-ui/AppBar';
import NavbarWindowControls from './windowControls';

const Navbar = () => (
  <AppBar
    title="Quizzical"
    style={{ WebkitAppRegion: 'drag' }}
    iconElementRight={<NavbarWindowControls />}
  />
);

export default Navbar;
