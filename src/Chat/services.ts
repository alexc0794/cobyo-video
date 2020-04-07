import axios from 'axios';
import { BASE_API_URL } from '../config';
import { ChatMessageResponse, ChatMessage } from './types';
import { transformChatMessage } from './transforms';

export function fetchChatMessages(previousMessageId: string|null = null, limit: number = 20): Promise<Array<ChatMessage>> {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.get(
        `${BASE_API_URL}/chat/messages?limit=${limit}${previousMessageId ? `&=previousMessageId=${previousMessageId}` : ''}`
      );
      const chatMessages = response.data.chat_messages.map(
        (chatMessage: ChatMessageResponse) => transformChatMessage(chatMessage)
      );
      return resolve(chatMessages);
    } catch (e) {
      console.error(e)
      return resolve([]);
    }
  });
}
