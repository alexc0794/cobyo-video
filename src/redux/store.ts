import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import app from './appReducer';
import tables from './tablesReducer';
import users from './usersReducer';
import storefront from './storefrontReducer';

const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const enhancer = composeEnhancers(
  applyMiddleware(thunk),
);

export default createStore(
  combineReducers({
    app,
    tables,
    users,
    storefront,
  }),
  enhancer
);
