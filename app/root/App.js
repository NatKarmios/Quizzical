import React, { Component } from 'react';
import type { Node } from 'react';
import Navbar from '../navbar/Navbar';

type Props = {
  children: Node
};

export default class App extends React.Component<Props> {
  props: Props;

  render() {
    return (
      <div style={{ minWidth: '800px' }}>
        <Navbar />
        {this.props.children}
      </div>
    );
  }
}
