import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import Root from './root/Root';
import { configureStore, history } from './store/configureStore';

import './app.global.scss';
import { setUpDB } from './_modules/db/dbSetup';
import { loadSettings } from './_global/settings/settingsActions';
import { setStore as supplyStore } from './store';

const store = configureStore();
supplyStore(store);

const ready = () => {
  render(
    <AppContainer>
      <Root store={store} history={history} />
    </AppContainer>,
    document.getElementById('root')
  );

  if (module.hot) {
    module.hot.accept('./root/Root', () => {
      const NextRoot =
      // eslint-disable-next-line
      require('./root/Root');
      render(
        <AppContainer>
          <NextRoot store={store} history={history} />
        </AppContainer>,
        document.getElementById('root')
      );
    });
  }
};

const setup = async () => {
  await setUpDB();
  ready();
  store.dispatch(loadSettings());
};

setup().catch();
