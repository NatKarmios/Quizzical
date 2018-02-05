import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import Root from './root/Root';
import { configureStore, history } from './store/configureStore';
import './app.global.css';
import { testSavedTokens } from './global/actions';
import { setUpDB } from './_modules/db/dbSetup';
import { loadSettings } from './global/actions/settingsActions';

const store = configureStore();

const ready = () => {
  render(
    <AppContainer>
      <Root store={store} history={history} />
    </AppContainer>,
    document.getElementById('root')
  );

  if (module.hot) {
    module.hot.accept('./root/Root', () => {
      const NextRoot = require('./root/Root'); // eslint-disable-line global-require
      render(
        <AppContainer>
          <NextRoot store={store} history={history}/>
        </AppContainer>,
        document.getElementById('root')
      );
    });
  }
};

const setup = async () => {
  await Promise.all([
    setUpDB(),
    loadSettings()
  ]);
  ready();
  store.dispatch(loadSettings());
};

setup().catch();
