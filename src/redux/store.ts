import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import app from './appReducer';
import tables from '_tables/reducers';
import chat from '_chat/reducers';
import users from '_users/reducers';
import storefront from '_storefront/reducers';
import menu from '_menu/reducers';
import music from 'music/reducers';
import userMenuItems from '_users/userMenuItemsReducer';

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
    music,
    userMenuItems,
  }),
  enhancer
);
