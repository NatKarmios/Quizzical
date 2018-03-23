// @flow
import React from 'react';
import Avatar from 'material-ui/Avatar';
import Tooltip from 'material-ui/Tooltip';

import { MDIcon, Space } from '../utils/components';

import style from './style.scss';


export type AccountData = {
  displayName: ?string,
  avatar: ?string
};

type Props = {
  streamerLoggedIn: boolean,
  botLoggedIn: boolean,
  accountData: {
    streamer: AccountData,
    bot: AccountData
  }
};


const avatarStyles = {
  display: 'inline-block',
  // marginRight: '10px',
  verticalAlign: 'middle'
};


const NotLoggedIn = ({ icon }: { icon: string }) => (
  <span className={style.userDisplay}>
    <Tooltip title={<i>Not logged in</i>}>
      <Avatar style={avatarStyles}>
        <MDIcon style={{ marginLeft: '8px', marginTop: '5px' }}>{icon}</MDIcon>
      </Avatar>
    </Tooltip>
  </span>
);

const LoggedIn = ({ details }: { details: AccountData }) => (
  <span className={style.userDisplay}>
    <Tooltip title={<i>{details.displayName}</i>}>
      <Avatar
        style={avatarStyles}
        alt={details.displayName}
        src={details.avatar}
      />
    </Tooltip>
  </span>
);

const NavbarUsers = ({ streamerLoggedIn, botLoggedIn, accountData }: Props) => (
  <div className={style.users}>
    {!streamerLoggedIn ?
      <NotLoggedIn icon="account" /> :
      <LoggedIn details={accountData.streamer} />
    }
    <Space>4</Space>
    {!botLoggedIn ?
      <NotLoggedIn icon="robot" /> :
      <LoggedIn details={accountData.bot} />
    }
  </div>
);

export default NavbarUsers;
