import axios from 'axios';
import { BASE_API_URL } from 'config';

type GetStorefrontResponse = {
  storefront: string,
  status: string,
  tableIdGrid: Array<Array<string | null>>,
};

export function fetchStorefront(): Promise<any> {
  return new Promise(async (resolve, reject) => {
    try {
      const response: GetStorefrontResponse = (await axios.get(`${BASE_API_URL}/storefront`)).data;
      return resolve(response);
    } catch (e) {
      console.error(e)
      return reject("Something went wrong");
    }
  });
}
