import React from 'react';
import { Switch, Route, Redirect, DefaultRoute, withRouter } from 'react-router';
import App from './root/App';
import HomePage from './home/Home';
import SetupPage from './setup/Setup';
import SettingsPage from './settings/Settings';

export default withRouter(() => (
  <App>
    <Switch style={{ overflowY: 'scroll' }}>
      <Route exact path="/" render={() => (<Redirect to="/setup" />)} />
      <Route path="/home" component={HomePage} />
      <Route path="/setup" component={SetupPage} />
      <Route path="/settings" component={SettingsPage} />
    </Switch>
  </App>
));
