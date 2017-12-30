// @flow
import React from 'react';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import { connect } from 'react-redux';

import NavbarUsers from './NavbarUsers';
import NavbarWindowControls from './windowControls';


type Props = {
  streamerLoggedIn: boolean,
  botLoggedIn: boolean,
};

const styles = {
  appBar: {
    height: '64px'
  }
};

const Navbar = ({ streamerLoggedIn, botLoggedIn }: Props) => (
  <AppBar position="static" style={{ WebkitAppRegion: 'drag', height: '64px' }}>
    <Toolbar>
      <Typography type="headline" color="inherit">Quizzical</Typography>
      <div style={{ flex: 1, height: '100%' }}>
        <NavbarUsers streamerLoggedIn={streamerLoggedIn} botLoggedIn={botLoggedIn} />
      </div>
      <NavbarWindowControls />
    </Toolbar>
  </AppBar>
);

function mapStateToProps(state) {
  return {
    streamerLoggedIn: state.navbar.streamerLoggedIn,
    botLoggedIn: state.navbar.botLoggedIn
  };
}

export default connect(mapStateToProps)(Navbar);
