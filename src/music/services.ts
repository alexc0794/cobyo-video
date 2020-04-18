import axios from 'axios';
import { BASE_API_URL } from 'config';
import { SpotifyToken } from 'types';

const BASE_SPOTIFY_API_URL = 'https://api.spotify.com';

export function fetchSpotifyToken(accessToken: string): Promise<SpotifyToken> {
  return new Promise(async (resolve, reject) => {
    const authorization = `Bearer ${accessToken}`;
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

export function transferUserPlayback(deviceId: string, accessToken: string): Promise<void> {
  return new Promise(async (resolve, reject) => {
    const authorization = `Bearer ${accessToken}`;
    try {
      await axios.put(
        `${BASE_SPOTIFY_API_URL}/v1/me/player`,
        { device_ids: [deviceId], play: true },
        { headers: { Authorization: authorization } },
      );
      return resolve();
    } catch {
      reject();
    }
  });
}
