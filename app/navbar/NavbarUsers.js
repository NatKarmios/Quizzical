// @flow
import React from 'react';

import style from './style.scss';

import Avatar from 'material-ui/Avatar';
import Tooltip from 'material-ui/Tooltip';
import { MDIcon, Space } from "../utils/components";
import vars, { AccountDataType } from '../_modules/vars';


type Props = {
  streamerLoggedIn: boolean,
  botLoggedIn: boolean
};

const avatarStyles = {
  display: 'inline-block',
  // marginRight: '10px',
  verticalAlign: 'middle'
};

const NotLoggedIn = ({ icon }) => (
  <span className={style.userDisplay}>
    <Tooltip title={<i>Not logged in</i>}>
      <Avatar style={avatarStyles}>
        <MDIcon style={{ marginLeft: '8px', marginTop: '5px' }}>{icon}</MDIcon>
      </Avatar>
    </Tooltip>
  </span>
);

const LoggedIn = ({ details }: { details: AccountDataType }) => (
  <span className={style.userDisplay}>
    <Tooltip title={<i>{details.display}</i>}>
      <Avatar
        style={avatarStyles}
        alt={details.display}
        src={details.avatar}
      />
    </Tooltip>
  </span>
);

const NavbarUsers = ({ streamerLoggedIn, botLoggedIn }: Props) => (
  <div className={style.users}>
    {!streamerLoggedIn ?
      <NotLoggedIn icon="account"/> :
      <LoggedIn details={vars.accountData.streamer} />
    }
    <Space>4</Space>
    {!botLoggedIn ?
      <NotLoggedIn icon="robot"/> :
      <LoggedIn details={vars.accountData.bot} />
    }
  </div>
);

export default NavbarUsers;
