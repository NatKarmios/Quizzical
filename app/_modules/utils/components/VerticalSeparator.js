// @flow
import React from 'react';

const DEFAULT_PAD = '10px';

type Props = {
  children: {
    size?: string,
    color?: string,
    pad?: string
  }
};

const VerticalSeparator = ({ children }: Props) => {
  const { color, size, pad } = children;
  const realPad: string = pad === undefined ? DEFAULT_PAD : pad;

  return (
    <div
      style={{
        display: 'inline-block',
        fontSize: size === undefined ? 'inherit' : size,
        color: color === undefined ? 'inherit' : color,
        marginLeft: realPad,
        marginRight: realPad
      }}
    >|</div>
  );
};

export default VerticalSeparator;
