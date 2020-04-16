export type VideoUserType = {
  userId: string,
  videoTrack: any,
  audioTrack: any | null,
  audioMuted: boolean,
};

export type VolumeType = {
  level: number,
  userId: string
};
