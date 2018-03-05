import { createStore, applyMiddleware, compose } from 'redux';
import { createLogicMiddleware } from 'redux-logic';
import thunk from 'redux-thunk';
import { createHashHistory } from 'history';
import { routerMiddleware, routerActions } from 'react-router-redux';
import { createLogger } from 'redux-logger';

import arrLogic from '../logic';
import rootReducer from '../reducers';

// Global state actions
import * as globalSettingsActions from '../_global/settings/settingsActions';
import * as loginActions from '../_global/login/loginActions';
import * as activeQuestionActions from '../_global/activeQuestion/activeQuestionActions';

// Specific component state actions
import * as setupActions from '../setup/setupActions';
import * as settingsActions from '../settings/settingsActions';
import * as questionListActions from '../home/questionList/questionListActions';
import * as questionDisplayActions from '../home/questionDisplay/questionDisplayActions';

const history = createHashHistory();

const configureStore = (initialState) => {
  // Redux Configuration
  const middleware = [];
  const enhancers = [];

  // Logic Middleware
  const logicMiddleware = createLogicMiddleware(arrLogic);
  middleware.push(logicMiddleware);

  // Thunk Middleware
  middleware.push(thunk);

  // Logging Middleware
  const logger = createLogger({
    level: 'info',
    collapsed: true
  });
  middleware.push(logger);

  // Router Middleware
  const router = routerMiddleware(history);
  middleware.push(router);

  // Redux DevTools Configuration
  const actionCreators = {
    ...globalSettingsActions,
    ...loginActions,
    ...activeQuestionActions,
    ...setupActions,
    ...settingsActions,
    ...questionListActions,
    ...questionDisplayActions,
    ...routerActions,
  };
  // If Redux DevTools Extension is installed use it, otherwise use Redux compose
  /* eslint-disable no-underscore-dangle */
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      // Options: http://zalmoxisus.github.io/redux-devtools-extension/API/Arguments.html
      actionsBlacklist: [activeQuestionActions.ACTIVE_QUESTION_TICK],
      actionCreators,
    })
    : compose;
  /* eslint-enable no-underscore-dangle */

  // Apply Middleware & Compose Enhancers
  enhancers.push(applyMiddleware(...middleware));
  const enhancer = composeEnhancers(...enhancers);

  // Create Store
  const store = createStore(rootReducer, initialState, enhancer);

  if (module.hot) {
    module.hot.accept('../reducers', () =>
      store.replaceReducer(require('../reducers')) // eslint-disable-line global-require
    );
  }

  return store;
};

export default { configureStore, history };
