import axios from 'axios';
import { BASE_API_URL } from '../config';

export function fetchStorefront(): Promise<any> {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.get(`${BASE_API_URL}/storefront`);
      return resolve({
        storefront: response.data.storefront,
        status: response.data.status,
        tableIdGrid: response.data.table_id_grid,
      });
    } catch (e) {
      console.error(e)
      return reject("Something went wrong");
    }
  });
}
