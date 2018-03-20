// @flow
import React from 'react';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import { connect } from 'react-redux';

import { Space } from "../utils/components";
import NavbarUsers from './NavbarUsers';
import type { AccountData } from './NavbarUsers';
import NavbarWindowControls from './windowControls';
import icon from './thinking.svg';


type Props = {
  streamerLoggedIn: boolean,
  botLoggedIn: boolean,
  accountData: {
    streamer: AccountData,
    bot: AccountData
  }
};

const Navbar = (props: Props) => (
  <AppBar position="fixed" style={{ WebkitAppRegion: 'drag', height: '64px' }}>
    <Toolbar disableGutters >
      <Typography type="headline" color="inherit">
        <img
          width="40px"
          height="40px"
          src={icon}
          style={{ verticalAlign: 'middle', display: 'inline-flex', padding: '0 10px' }}
        />
        Quizzical
      </Typography>
      <div style={{ flex: 1, height: '100%' }}>
        <NavbarUsers {...props} />
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

// $FlowFixMe
export default connect(mapStateToProps)(Navbar);
