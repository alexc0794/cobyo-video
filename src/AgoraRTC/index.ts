import AgoraRTC, {
  IAgoraRTCClient,
  IMicrophoneAudioTrack,
  ICameraVideoTrack,
} from 'agora-rtc-sdk-ng';
import { IS_DEV } from '../config';
import { fetchToken } from '../services';

const AGORA_APP_ID = process.env.REACT_APP_AGORA_APP_ID || '';
/**
  0: DEBUG. Output all API logs.
  1: INFO. Output logs of the INFO, WARNING and ERROR level.
  2: WARNING. Output logs of the WARNING and ERROR level.
  3: ERROR. Output logs of the ERROR level.
  4: NONE. Do not output any log.
*/
const DEV_DEBUG_LEVEL = 1;
const PROD_DEBUG_LEVEL = 2;

export type RTC = {
 client: IAgoraRTCClient,
 localAudioTrack: IMicrophoneAudioTrack | null,
 localVideoTrack: ICameraVideoTrack | null,
 passesSystemRequirements: boolean,
};

export function getRTC(): RTC {
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
      mode: 'rtc',
      codec: 'h264',
    }),
    localAudioTrack: null,
    localVideoTrack: null,
    passesSystemRequirements: AgoraRTC.checkSystemRequirements(),
  };
}

// Agora logic should go here to simplify usage in components
export async function joinCall(rtc: RTC, userId: string, channelId: string) {
  const token = await fetchToken(userId, channelId);
  try {
    await rtc.client.join(AGORA_APP_ID, channelId, token,
      parseInt(userId, 10), // Must be an int otherwise Agora breaks
    );
  } catch (e) {
    console.error(e);
    throw new Error('Failed to join.');
  }

  try {
    await rtc.client.enableDualStream();
  } catch (e) {
    console.warn(e);
  }

  try {
    rtc.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack({
      ANS: true,
      encoderConfig: 'standard_stereo',
    });
    rtc.localVideoTrack = await AgoraRTC.createCameraVideoTrack({
      encoderConfig: '480p_2',
      facingMode: 'user',
    });
  } catch (e) {
    console.error(e);
    await rtc.client.leave();
    throw new Error('Access to your microphone and camera must be granted for this to work!');
  }

  try {
    await rtc.client.publish([rtc.localAudioTrack, rtc.localVideoTrack]);
  } catch (e) {
    console.error(e);
    await rtc.client.leave();
    throw new Error('Failed to publish audio and video to others.');
  }

  try {
    rtc.localVideoTrack.play(`video-${userId}`);
  } catch (e) {
    console.error(e);
    await rtc.client.leave();
    throw new Error('Unable to play local video.');
  }

  rtc.client.on('token-privilege-will-expire', () => {
    rtc.client.renewToken(token);
  });
}

export async function leaveCall(rtc: RTC) {
  rtc.localAudioTrack && rtc.localAudioTrack.close();
  rtc.localVideoTrack && rtc.localVideoTrack.close();
  await rtc.client.leave();
}
