// @flow
import React from 'react';
import Icon from 'material-ui/Icon';

type MDIconProps = {
  children: string,
  color?: string,
  style?: {}
};

const MDIcon = ({ children, color = 'inherit', style = {} }: MDIconProps) => (
  <Icon style={{color, ...style}} className={`mdi mdi-${children}`} />
);

export default MDIcon;
