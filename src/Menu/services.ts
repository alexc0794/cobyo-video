import axios from 'axios';
import { BASE_API_URL } from 'src/config';

export function fetchMenu(storefront: string): Promise<any> {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.get(
        `${BASE_API_URL}/menu/${storefront}`
      );
      return resolve(response.data.menu);
    } catch (e) {
      console.error(e);
      return reject("Failed to fetch menu");
    }
  })
}


export function purchaseMenuItem(itemId: string, fromUserId: string, toUserIds: Array<string>): Promise<Array<string>> {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.post(`${BASE_API_URL}/menu/purchase`, {
        itemId,
        fromUserId,
        toUserIds,
      });
      return resolve(response.data.toUserIds);
    } catch (e) {
      console.error(e)
      return reject("Failed to purchase menu item");
    }
  })
}
