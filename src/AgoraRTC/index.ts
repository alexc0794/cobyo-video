import AgoraRTC, {
  IAgoraRTCClient,
  IMicrophoneAudioTrack,
  ICameraVideoTrack,
} from "agora-rtc-sdk-ng";

export const AGORA_APP_ID = '0e12dacab1874ad5939be54efd01d4c3'

type RTC = {
 client: IAgoraRTCClient,
 joined: boolean,
 published: boolean,
 localStream: null,
 remoteStreams: Array<null>,
 localAudioTrack: IMicrophoneAudioTrack | null,
 localVideoTrack: ICameraVideoTrack | null,
};

export function getRTC(): RTC {
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
