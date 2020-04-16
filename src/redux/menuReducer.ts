import {combineReducers} from 'redux';
import { MenuItemType } from 'types';

// Assume this is a byId of menu items, not menus.
function byId(state = {}, action:any) {
  switch(action.type) {
    case 'UPDATE_MENU': {
      const items: Array<MenuItemType> = action.payload.menu.items;
      return items.reduce((acc: any, item: MenuItemType) => ({
        ...acc,
        [item.itemId]: item
      }), {});
    }
    default:
      return state;
  }
}

function allIds(state = [], action:any): Array<string> {
  switch(action.type) {
    case 'UPDATE_MENU': {
      const items: Array<MenuItemType> = action.payload.menu.items;
      return items.map((item: MenuItemType) => item.itemId);
    }
    default:
      return state;
  }
}

export default combineReducers({byId, allIds});
