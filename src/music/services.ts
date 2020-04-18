import axios from 'axios';
import { BASE_API_URL } from 'config';
import { SpotifyToken } from 'types';

export function fetchSpotifyToken(token: string): Promise<SpotifyToken> {
  return new Promise(async (resolve, reject) => {
    const authorization = `Bearer ${token}`;
    try {
      const response = await axios.get(`${BASE_API_URL}/spotify/token`, {
        headers: { Authorization: authorization }
      });
      return resolve(response.data.spotifyToken);
    } catch (e) {
      console.error(e);
      return reject("Failed to fetch token");
    }
  })
}
