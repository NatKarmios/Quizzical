// @flow
import React from 'react';
import AppBar from 'material-ui/AppBar';
import { connect } from 'react-redux';

import NavbarTitle from './NavbarTitle';
import NavbarWindowControls from './windowControls';


type Props = {
  streamerUsername: string,
  botUsername: string
};

const Navbar = ({ streamerUsername, botUsername }: Props) => (
  <AppBar
    title={<NavbarTitle streamer={streamerUsername} bot={botUsername} />}
    style={{ WebkitAppRegion: 'drag' }}
    iconStyleLeft={{ WebkitAppRegion: 'no-drag' }}
    iconElementRight={<NavbarWindowControls />}
  />
);

function mapStateToProps(state) {
  return {
    streamerUsername: state.navbar.streamerUsername,
    botUsername: state.navbar.botUsername
  };
}

export default connect(mapStateToProps)(Navbar);
