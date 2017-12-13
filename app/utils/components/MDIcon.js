// @flow
import React from 'react';

type MDIconProps = {
  children: string,
  style?: {}
};

const MDIcon = ({ children, style = {} }: MDIconProps) => (
  <i style={style} className={`mdi mdi-${children}`} />
);

export default MDIcon;
