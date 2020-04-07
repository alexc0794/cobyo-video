import AgoraRTC, {
  IAgoraRTCClient,
  IMicrophoneAudioTrack,
  ICameraVideoTrack,
} from "agora-rtc-sdk-ng";
import { IS_DEV } from '../config';

/**
  0: DEBUG. Output all API logs.
  1: INFO. Output logs of the INFO, WARNING and ERROR level.
  2: WARNING. Output logs of the WARNING and ERROR level.
  3: ERROR. Output logs of the ERROR level.
  4: NONE. Do not output any log.
*/
const DEV_DEBUG_LEVEL = 1;
const PROD_DEBUG_LEVEL = 2;

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
  const params = new URLSearchParams(window.location.search);
  const debug = params.get('debug');
  const explicitOn = debug === '1' || debug === 'true';
  const explicitOff = debug === '0' || debug === 'false';
  if (explicitOn) {
    AgoraRTC.setLogLevel(DEV_DEBUG_LEVEL);
    AgoraRTC.enableLogUpload();
  } else if (explicitOff) {
    AgoraRTC.setLogLevel(PROD_DEBUG_LEVEL);
  } else {
    AgoraRTC.setLogLevel(IS_DEV ? DEV_DEBUG_LEVEL : PROD_DEBUG_LEVEL);
  }

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

export function checkSystemRequirements(): boolean {
  return AgoraRTC.checkSystemRequirements();
}
