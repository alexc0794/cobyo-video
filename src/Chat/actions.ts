import { ChatMessage } from 'src/chat/types';

export const createChatMessage = (chatMessage: ChatMessage) => ({
  type: "CREATE_CHAT_MESSAGE",
  payload: { chatMessage },
});
