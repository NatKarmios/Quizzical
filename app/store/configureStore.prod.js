import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { createHashHistory } from 'history';
import { routerMiddleware } from 'react-router-redux';
import { createLogicMiddleware } from 'redux-logic';
import rootReducer from '../reducers';
import arrLogic from '../logic';

const history = createHashHistory();
const router = routerMiddleware(history);
const logic = createLogicMiddleware(arrLogic);
const enhancer = applyMiddleware(thunk, router, logic);

function configureStore(initialState) {
  return createStore(rootReducer, initialState, enhancer);
}

export default { configureStore, history };
