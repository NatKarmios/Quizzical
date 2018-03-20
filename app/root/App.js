import React, { Component } from 'react';
import type { Node } from 'react';

type Props = {
  children: Node
};

export default class App extends React.Component<Props> {
  props: Props;

  render() {
    return (
      <div style={{ minWidth: '800px' }}>
        {this.props.children}
      </div>
    );
  }
}
