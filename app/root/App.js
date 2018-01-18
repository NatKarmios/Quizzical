// @flow
import React, { Component } from 'react';
import type { Children } from 'react';
import Navbar from '../navbar/Navbar';

export default class App extends Component {
  props: {
    children: Children
  };

  render() {
    return (
      <div style={{ minWidth: '800px' }}>
        <Navbar />
        {this.props.children}
      </div>
    );
  }
}
