export type SpotifyToken = {
  userId: string,
  accessToken: string,
  refreshToken: string,
  lastRefreshedAt: string,
};

export type CurrentlyPlaying = {
  fromUserId: string,
  trackId: string,
  trackUri: string,
  trackName: string,
  artistName: string,
  position: number,
  duration: number,
  paused: boolean,
};
