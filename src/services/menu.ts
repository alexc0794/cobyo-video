import axios from 'axios';
import { BASE_API_URL } from '../config';

export function fetchMenu(storefront: string): Promise<any> {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.get(
        `${BASE_API_URL}/menu/${storefront}`
      );
      return resolve(
        response.data.menu.items
      );
    } catch (e) {
      return reject("fail to get menu");
    }
  })
}
