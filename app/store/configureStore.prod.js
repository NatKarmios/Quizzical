import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { createBrowserHistory } from 'history';
import { routerMiddleware } from 'react-router-redux';
import { createLogicMiddleware } from 'redux-logic';
import rootReducer from '../reducers';
import arrLogic from '../logic';

const history = createBrowserHistory();
const router = routerMiddleware(history);
const logic = createLogicMiddleware(arrLogic);
const enhancer = applyMiddleware(thunk, router, logic);

function configureStore(initialState) {
  return createStore(rootReducer, initialState, enhancer);
}

export default { configureStore, history };
