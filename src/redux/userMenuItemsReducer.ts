import {combineReducers} from 'redux';
import {UserMenuItemType} from '../types';

type ById = {
  [key: string]: Array<UserMenuItemType>,
};

function byId(state: ById = {}, action:any) {
  switch(action.type) {
    case "purchasedMenuItem": {
      const { userId, itemId, fromUserId } = action.payload;
      const previousUserMenuItems = userId in state ? state[userId] : [];
      const userMenuItem: UserMenuItemType = {
        itemId, fromUserId, expireOn: null
      };
      return {
        ...state,
        [userId]: [ ...previousUserMenuItems, userMenuItem ]
      };
    }
    default:
      return state;
  }
}

export default combineReducers({byId});
