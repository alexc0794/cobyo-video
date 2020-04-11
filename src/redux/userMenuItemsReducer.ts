import {combineReducers} from 'redux';
import {userMenuItemType} from '../types';

type byId = {
  [key: string]: Array<userMenuItemType>,
};

function byId(state: byId = {}, action:any) {
  switch(action.type) {
    case "BUY_MENU_ITEM": {
      console.log(action.payload);
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