import { combineReducers } from 'redux';
import { UserType } from '../types';

function byId(state = {}, action: any) {
  switch (action.type) {
    case 'UPDATE_USERS': {
      const { users } = action.payload;
      return users.reduce((acc: any, user: UserType) => {
        return { ...acc, [user.userId]: user };
      }, {...state});
    }
    default:
      return state;
  }
}

export default combineReducers({
  byId,
});
