import axios from 'axios';
import { BASE_API_URL } from 'config';
import { SpotifyToken, CurrentlyPlaying } from 'types';

const BASE_SPOTIFY_API_URL = 'https://api.spotify.com';

export function fetchCurrentlyPlaying(channelId: string): Promise<CurrentlyPlaying> {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.get(`${BASE_API_URL}/channel/${channelId}/currently-playing`);
      return resolve(response.data.currentlyPlaying);
    } catch (e) {
      console.error(e);
      return reject('Failed to fetch currently playing track');
    }
  });
}

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
  });
}

export function connectSpotify(channelId: string, token: string): Promise<number> {
  return new Promise(async (resolve, reject) => {
    const authorization = `Bearer ${token}`;
    try {
      const response = await axios.put(
        `${BASE_API_URL}/spotify/connect`,
        { channelId },
        { headers: { Authorization: authorization } },
      );
      return resolve(response.data);
    } catch (e) {
      console.error(e);
      return resolve(0);
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

export function playTrack(deviceId: string, accessToken: string, trackUri: string, position_ms: number = 0): Promise<void> {
  return new Promise(async (resolve, reject) => {
    const authorization = `Bearer ${accessToken}`;
    try {
      await axios.put(
        `${BASE_SPOTIFY_API_URL}/v1/me/player/play?device_id=${deviceId}`,
        { uris: [trackUri], position_ms },
        { headers: { Authorization: authorization } },
      );
      return resolve();
    } catch {
      reject();
    }
  });
}
