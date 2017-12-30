// @flow
import React from 'react';

import style from './style.scss';

import Avatar from 'material-ui/Avatar';
import { VerticalSeparator } from '../utils/components';
import { MDIcon } from "../utils/components";
import vars, { AccountDataType } from '../_modules/vars';


type Props = {
  streamerLoggedIn: boolean,
  botLoggedIn: boolean
};

const avatarStyles = {
  display: 'inline-block',
  marginRight: '10px',
  verticalAlign: 'middle'
};

const NotLoggedIn = ({ icon }) => (
  <i className={style.userDisplay}>
    <Avatar style={avatarStyles}>
      <MDIcon style={{ paddingRight: '5px' }}>{icon}</MDIcon>
    </Avatar>
    Not logged in
  </i>
);

const LoggedIn = ({ details }: { details: AccountDataType }) => (
  <i className={style.userDisplay}>
    <Avatar
      style={avatarStyles}
      alt={details.display}
      src={details.avatar}
    />
    {details.display}
  </i>
);

const NavbarUsers = ({ streamerLoggedIn, botLoggedIn }: Props) => (
  <div className={style.users}>
    {!streamerLoggedIn ?
      <NotLoggedIn icon="account"/> :
      <LoggedIn details={vars.accountData.streamer} />
    }
    <VerticalSeparator>{{ size: '30px', color: 'rgba(0, 0, 0, 0)' }}</VerticalSeparator>
    {!botLoggedIn ?
      <NotLoggedIn icon="robot"/> :
      <LoggedIn details={vars.accountData.bot} />
    }
  </div>
);

export default NavbarUsers;
