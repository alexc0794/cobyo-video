import {combineReducers} from 'redux';
import {menuItemType} from '../types';

function byId(state = {}, action:any) {
  switch(action.type) {
    case 'SAVE_MENU_TO_STORE': {
      const {items} = action.payload;
      return items.reduce((acc:any, item:menuItemType) => (
        {
          ...acc,
          [item.name]: item
        }
      ), {});
    }
    default:
      return state;
  }
}

function allIds(state = [], action:any):Array<menuItemType> {
  switch(action.type) {
    case 'SAVE_MENU_TO_STORE': {
      const {items} = action.payload;
      return items.map((item:menuItemType) => item.name);
    }
    default:
      return state;
  }
}

export default combineReducers({byId, allIds});