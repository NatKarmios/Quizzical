// @flow
import React from 'react';
import MDIcon from "./MDIcon";

const InlineIcon = ({style, ...props}) =>
  <MDIcon style={{ ...style, verticalAlign: 'middle', paddingRight: '6px' }} {...props}/>;

export default InlineIcon;
