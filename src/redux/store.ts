import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import app from './appReducer';
import tables from 'tables/reducers';
import chat from 'chat/reducers';
import users from 'users/reducers';
import storefront from 'storefront/reducers';
import menu from 'menu/reducers';
import userMenuItems from 'users/userMenuItemsReducer';

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
    chat,
    menu,
    userMenuItems,
  }),
  enhancer
);
