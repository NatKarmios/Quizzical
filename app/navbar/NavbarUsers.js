// @flow
import React from 'react';

import style from './style.scss';

import NavbarUser from './NavbarUser';
import { VerticalSeparator } from '../utils/components';


type Props = {
  streamer: string,
  bot: string
};

const NavbarUsers = ({ streamer, bot }: Props) => (
  <div className={style.users}>
    <NavbarUser icon="account">
      {streamer}
    </NavbarUser>
    <VerticalSeparator>{{ size: '30px' }}</VerticalSeparator>
    <NavbarUser icon="robot">
      {bot}
    </NavbarUser>
  </div>
  );

export default NavbarUsers;
