import { combineReducers } from 'redux';
import { UserType } from 'types';

function byId(state = {}, action: any) {
  switch (action.type) {
    case 'CREATE_USER_SUCCESS': {
      const { user } = action.payload;
      return {
        ...state,
        [user.userId]: user,
      };
    }
    case 'UPDATE_USERS':
    case 'UPDATE_ACTIVE_USERS': {
      const { users } = action.payload;
      return users.reduce((acc: any, user: UserType) => {
        return { ...acc, [user.userId]: user };
      }, { ...state });
    }
    default:
      return state;
  }
}

function activeUserIds(state = [], action: any) {
  switch (action.type) {
    case 'UPDATE_ACTIVE_USERS': {
      const { users } = action.payload;
      // TODO: think of some special ordering. For now, just display how server returns it
      return users.map((user: UserType) => user.userId);
    }
    default:
      return state;
  }
}

export default combineReducers({
  byId,
  activeUserIds,
});
