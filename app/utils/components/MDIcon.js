// @flow
import React from 'react';
import FontIcon from 'material-ui/FontIcon';

type MDIconProps = {
  children: string,
  color?: string,
  style?: {}
};

const MDIcon = ({ children, color = 'white', style = {} }: MDIconProps) => (
  <FontIcon color={color} style={style} className={`mdi mdi-${children}`} />
);

export default MDIcon;
