import { ChatMessage } from '../Chat/types';

export const createChatMessage = (chatMessage: ChatMessage) => ({
  type: "CREATE_CHAT_MESSAGE",
  payload: { chatMessage },
});
