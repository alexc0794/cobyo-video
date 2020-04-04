import axios from 'axios';
import { BASE_API_URL } from '../config';

export function fetchToken(uid: string, tableId: string): Promise<string> {
  return new Promise(async (resolve, _) => {
    try {
      const response = await axios.get(`${BASE_API_URL}/token/${uid}?channel_name=${tableId}`);
      return resolve(response.data.toString());
    } catch (e) {
      console.error(e);
      return resolve("");
    }
  });
}
