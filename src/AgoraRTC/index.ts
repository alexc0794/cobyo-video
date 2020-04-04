import AgoraRTC, {
  IAgoraRTCClient,
  IMicrophoneAudioTrack,
  ICameraVideoTrack,
} from "agora-rtc-sdk-ng";

export const AGORA_APP_ID = process.env.REACT_APP_AGORA_APP_ID || '';

export type RTCType = {
 client: IAgoraRTCClient,
 joined: boolean,
 published: boolean,
 localStream: null,
 remoteStreams: Array<null>,
 localAudioTrack: IMicrophoneAudioTrack | null,
 localVideoTrack: ICameraVideoTrack | null,
};

export function getRTC(): RTCType {
  return {
    client: AgoraRTC.createClient({
      mode: "rtc",
      codec: "h264",
    }),
    joined: false,
    published: false,
    localStream: null,
    remoteStreams: [],
    localAudioTrack: null,
    localVideoTrack: null,
  };
}
