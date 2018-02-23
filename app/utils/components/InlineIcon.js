// @flow
import React from 'react';
import MDIcon from "./MDIcon";

const InlineIcon = ({style, padded=false, ...props}) =>
  <MDIcon
    style={{
      verticalAlign: 'middle',
      display: 'inline-flex',
      paddingRight: (padded ? '6px' : undefined),
      ...style
    }}

    {...props}
  />;

export default InlineIcon;
