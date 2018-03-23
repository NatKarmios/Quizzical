// @flow

import React from 'react';

type Props = {
  children: ?(number | string)
};

const defaultProps = {};

const Space = ({ children }: Props) => (
  <span>{'\u00A0'.repeat(Number(children))}</span>
);

Space.defaultProps = defaultProps;

export default Space;
