// @flow

import React from 'react';
import Icon from 'material-ui/Icon';


export type MDIconProps = {
  children: string,
  color?: string,
  style?: {}
};


const defaultProps = {
  color: 'inherit',
  style: {}
};

const MDIcon = (props: MDIconProps) => {
  const { children, color, style } = props;
  return <Icon style={{ color, ...style }} className={`mdi mdi-${children}`} />;
};

MDIcon.defaultProps = defaultProps;

export default MDIcon;
