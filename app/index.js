import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import Root from './root/Root';
import { configureStore, history } from './store/configureStore';
import './app.global.css';
import { testSavedTokens } from './global/actions';
import { loadSettings } from './_modules/savedSettings';


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


const store = configureStore();

const setup = async () => {
  await Promise.all([
    loadSettings()
  ]);
  ready();
  store.dispatch(testSavedTokens());
};

setup().catch();
