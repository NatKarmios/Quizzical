// @flow
<<<<<<< HEAD:app/root/App.js
import React, { Component } from 'react';
import type { Children } from 'react';
import Navbar from '../navbar/Navbar';
=======
import * as React from 'react';
>>>>>>> 177b3a3... v0.13.0 (#1166):app/containers/App.js

type Props = {
  children: React.Node
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
