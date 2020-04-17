import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import app from './appReducer';
import tables from 'src/tables/reducers';
import chat from 'src/chat/reducers';
import users from 'src/users/reducers';
import storefront from 'src/storefront/reducers';
import menu from 'src/menu/reducers';
import userMenuItems from 'src/users/userMenuItemsReducer';

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
