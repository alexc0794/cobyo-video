import { ChatMessage } from 'Chat/types';

const selectChatMessageById = (state: any, messageId: string) => state.chat.byId[messageId];

export const selectUserRecentChatMessage = (state: any, userId: string): ChatMessage | null => {
  const messageIds = state.chat.usersMessageIds[userId];
  if (!messageIds || !messageIds.length) { return null; }

  const recentMessageId = messageIds[messageIds.length - 1];
  const chatMessage: ChatMessage = selectChatMessageById(state, recentMessageId);
  return chatMessage;
}
