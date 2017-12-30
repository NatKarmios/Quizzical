// @flow
import React from 'react';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import { connect } from 'react-redux';

import NavbarUsers from './NavbarUsers';
import NavbarWindowControls from './windowControls';


type Props = {
  streamerUsername: string,
  botUsername: string
};

const Navbar = ({ streamerUsername, botUsername }: Props) => (
  <AppBar position="static" style={{ WebkitAppRegion: 'drag' }}>
    <Toolbar>
      <Typography type="title" color="inherit">Quizzical</Typography>
      <div style={{ flex: 1, height: '100%' }}>
        <NavbarUsers streamer={streamerUsername} bot={botUsername} />
      </div>
      <NavbarWindowControls />
    </Toolbar>
  </AppBar>
);

function mapStateToProps(state) {
  return {
    streamerUsername: state.navbar.streamerUsername,
    botUsername: state.navbar.botUsername
  };
}

export default connect(mapStateToProps)(Navbar);
