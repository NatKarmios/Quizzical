// @flow
import React from 'react';

const Space = ({children=1}) => (
  <span>{'\u00A0'.repeat(Number(children))}</span>
);

export default Space;
