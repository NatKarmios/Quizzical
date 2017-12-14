/* eslint flowtype-errors/show-errors: 0 */
import React from 'react';
import { Switch, Route, Redirect } from 'react-router';
import App from './root/App';
import HomePage from './home/Home';
import CounterPage from './counter/Counter';
import SetupPage from './setup/Setup';

export default () => (
  <App>
    <Switch>
      <Route exact path="/" render={() => (<Redirect to="/setup" />)} />
      <Route path="/counter" component={CounterPage} />
      <Route path="/home" component={HomePage} />
      <Route path="/setup" component={SetupPage} />
    </Switch>
  </App>
);
