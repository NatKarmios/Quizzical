// @flow
import React from 'react';
import { MDIcon } from '../utils/components';

import style from './style.scss';

type Props = {
  children: string,
  icon: string
};


const NavbarTitleUserDisplay = ({ children, icon }: Props) => (
  <i className={style.userDisplay}>
    <MDIcon style={{ paddingRight: '5px' }}>{icon}</MDIcon>
    {children}
  </i>
);

export default NavbarTitleUserDisplay;
