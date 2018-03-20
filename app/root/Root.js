// @flow
import React from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';

import Routes from '../routes';
import Navbar from '../navbar/Navbar';

type RootType = {
  store: {},
  history: {}
};

export default function Root({ store, history }: RootType) {
  return (
    <Provider store={store}>
      <div>
        <Navbar />
        <ConnectedRouter history={history}>
          <Routes />
        </ConnectedRouter>
      </div>
    </Provider>
  );
}
