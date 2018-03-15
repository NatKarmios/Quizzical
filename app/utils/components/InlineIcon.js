// @flow

import React from 'react';
import MDIcon from './MDIcon';
import type { MDIconProps } from './MDIcon';


type Props = MDIconProps & {
  style?: {},
  padded?: boolean
};


const InlineIcon = ({ style = {}, padded = false, ...props }: Props) => (
  <MDIcon
    style={{
      verticalAlign: 'middle',
      display: 'inline-flex',
      paddingRight: (padded ? '6px' : undefined),
      ...style
    }}

    {...props}
  />
);

export default InlineIcon;
