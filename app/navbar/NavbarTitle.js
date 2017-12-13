// @flow
import React from 'react';

import style from './style.scss';

import NavbarTitleUserDisplay from './NavbarTitleUserDisplay';
import { VerticalSeparator } from '../utils/components';


type Props = {
  streamer: string,
  bot: string
};

const NavbarTitle = ({ streamer, bot }: Props) => (
  <div>
    Quizzical
    <div className={style.users}>
      <NavbarTitleUserDisplay icon="account">
        {streamer}
      </NavbarTitleUserDisplay>
      <VerticalSeparator>{{ size: '30px' }}</VerticalSeparator>
      <NavbarTitleUserDisplay icon="robot">
        {bot}
      </NavbarTitleUserDisplay>
    </div>
  </div>
  );

export default NavbarTitle;
