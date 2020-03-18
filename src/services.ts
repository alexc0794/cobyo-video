import axios from 'axios';

const BASE_API_URL = 'https://y6f6x4ptsa.execute-api.us-east-1.amazonaws.com/dev';

export function fetchToken(uid: number): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.get(
        `${BASE_API_URL}/token/${uid}`
      );
      return resolve(response.data.toString());
    } catch (e) {
      return reject("Something went wrong");
    }
  });
}
