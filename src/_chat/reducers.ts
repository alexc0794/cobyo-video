import { combineReducers } from 'redux';
import { ChatMessage } from '_chat/types';

function allIds(state = [], action: any): Array<ChatMessage> {
  switch (action.type) {
    case 'CREATE_CHAT_MESSAGE': {
      const { messageId } = action.payload.chatMessage;
      return [...state, messageId];
    }
    default:
      return state;
  }
}
function byId(state = {}, action: any) {
  switch (action.type) {
    case 'CREATE_CHAT_MESSAGE': {
      const { chatMessage } = action.payload;
      const { messageId } = chatMessage;
      return {
        ...state,
        [messageId]: chatMessage,
      };
    }
    default:
      return state;
  }
}

type UserMessageIds = {
  [key: string]: Array<string>,
};

function usersMessageIds(state: UserMessageIds = {}, action: any): UserMessageIds {
  switch (action.type) {
    case 'CREATE_CHAT_MESSAGE': {
      const { userId, messageId } = action.payload.chatMessage;
      const userMessageIds = userId in state ? state[userId] : [];
      return {
        ...state,
        [userId]: [...userMessageIds, messageId],
      };
    }
    default:
      return state;
  }
}

export default combineReducers({
  allIds,
  byId,
  usersMessageIds,
});
