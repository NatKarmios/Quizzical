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
  accountData: {}
};

const styles = {
  appBar: {
    height: '64px'
  }
};

const Navbar = ({ streamerLoggedIn, botLoggedIn, accountData }: Props) => (
  <AppBar position="fixed" style={{ WebkitAppRegion: 'drag', height: '64px' }}>
    <Toolbar>
      <Typography type="headline" color="inherit">Quizzical</Typography>
      <div style={{ flex: 1, height: '100%' }}>
        <NavbarUsers streamerLoggedIn={streamerLoggedIn} botLoggedIn={botLoggedIn} accountData={accountData} />
      </div>
      <NavbarWindowControls />
    </Toolbar>
  </AppBar>
);

function mapStateToProps(state) {
  return {
    streamerLoggedIn: state.navbar.streamerLoggedIn,
    botLoggedIn: state.navbar.botLoggedIn,
    accountData: state.global.login
  };
}

export default connect(mapStateToProps)(Navbar);
