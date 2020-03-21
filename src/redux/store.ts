import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import tables from './tablesReducer';

const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;

const enhancer = composeEnhancers(
  applyMiddleware(thunk),
);

export default createStore(
  combineReducers({
    tables
  }),
  enhancer
);
