import { ChatMessageResponse, ChatMessage } from 'src/chat/types';

export function transformChatMessage(response: ChatMessageResponse): ChatMessage {
  return {
    messageId: response.message_id,
    userId: response.user_id,
    message: response.message,
    sentAt: response.sent_at,
  };
}
