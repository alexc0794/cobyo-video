import { combineReducers } from 'redux';

function userId(state = null, action: any) {
  switch (action.type) {
    case 'CREATE_USER_SUCCESS': {
      const { user } = action.payload;
      return user.userId;
    }
    default:
      return state;
  }
}

function token(state = null, action: any) {
  switch (action.type) {
    case 'CREATE_USER_SUCCESS': {
      const { token } = action.payload;
      return token;
    }
    default:
      return state;
  }
}

export default combineReducers({
  userId,
  token,
});
