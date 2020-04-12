import {combineReducers} from 'redux';
import {UserMenuItemType} from '../types';

type ById = {
  [key: string]: Array<UserMenuItemType>,
};

function byId(state: ById = {}, action:any) {
  switch(action.type) {
    case "BUY_MENU_ITEM": {
      const {itemName, fromUserId, toUserIds} = action.payload;
      let newState = {...state};
      toUserIds.forEach((id: string) => {
        if (state[id]) {
          newState[id] = [
            ...state[id],
            {
              menuItemName: itemName,
              fromUserId,
              expireOn: '',
            }
          ];
        } else {
          newState[id] = [
            {
              menuItemName: itemName,
              fromUserId,
              expireOn: '',
            }
          ];
        }
      });
      return newState;
    }
    default:
      return state;
  }
}

export default combineReducers({byId});
