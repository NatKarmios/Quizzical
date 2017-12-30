// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './Home.css';

const Home = () => (
  <div>
    <div className={styles.container} data-tid="container">
      <h2>Home</h2>
      <Link to="/counter">to Counter</Link>
    </div>
  </div>
);

export default Home;
