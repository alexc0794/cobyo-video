import React, { Component } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import { RTCType, AGORA_APP_ID } from '../AgoraRTC';
import { VideoUserType } from '../VideoHangout/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChair, faMicrophoneSlash } from '@fortawesome/free-solid-svg-icons';
import { fetchToken } from '../services';
import cx from 'classnames';
import './index.css';

type RemoteVideoPropTypes = VideoUserType;

export class RemoteVideo extends Component<RemoteVideoPropTypes> {

  componentDidMount() {
    const { videoTrack, audioTrack, userId } = this.props;
    if (videoTrack) {
      videoTrack.play(`video-${userId}`);
    }
    if (audioTrack) {
      audioTrack.play();
    }
  }

  render() {
    const { userId, audioMuted } = this.props;
    return <Video userId={userId} audioMuted={audioMuted} />;
  }
}

type LocalVideoPropTypes = {
  userId: string,
  tableId: string,
  audioMuted: boolean,
  rtc: RTCType,
}

export class LocalVideo extends Component<LocalVideoPropTypes> {

  async componentDidMount() {
    const { userId, tableId, rtc } = this.props;
    const token = await fetchToken(userId, tableId);
    try {
      await rtc.client.join(AGORA_APP_ID, tableId, token,
        parseInt(userId, 10), // Must be an int, otherwise token invalidates :(
      );
    } catch(e) {
      console.error(e);
      alert('Failed to join the table!');
      return;
    }

    try {
      await rtc.client.enableDualStream();
    } catch (e) {
      console.log('dual stream not enabled', e);
    }

    try {
      rtc.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
      rtc.localVideoTrack = await AgoraRTC.createCameraVideoTrack();
    } catch (e) {
      // this.props.leaveAndUpdateTable(table.tableId, userId);
      console.error(e);
      alert('Access to your microphone and camera must be granted for this to work!');
      return;
    }
    await rtc.client.publish([rtc.localAudioTrack, rtc.localVideoTrack]);
    rtc.localVideoTrack.play(`video-${userId}`);

    // RTC client listeners
    rtc.client.on('token-privilege-will-expire', () => {
      rtc.client.renewToken(token);
    });
  }

  async componentWillUnmount() {
    const { rtc } = this.props;
    if (rtc.localAudioTrack) {
      rtc.localAudioTrack.close();
    }
    if (rtc.localVideoTrack) {
      rtc.localVideoTrack.close();
    }
    await rtc.client.leave();
  }

  render() {
    const { audioMuted, userId } = this.props;
    return (
      <Video userId={userId} audioMuted={audioMuted} />
    );
  }
}

type VideoPropTypes = {
  userId: string,
  audioMuted: boolean,
};

function Video({
  userId,
  audioMuted,
}: VideoPropTypes) {
  return (
    <div id={`video-${userId}`} className={cx("video", {})}>
      {audioMuted && (
        <div className="video-overlay">
          <div className="video-muted-icon"><FontAwesomeIcon icon={faMicrophoneSlash} /></div>
        </div>
      )}
    </div>
  );
}

export function VideoPlaceholder() {
  return (
      <div className={cx("video video-placeholder", {})}>
        <div className="video-placeholder-icon">
          <FontAwesomeIcon icon={faChair} />
        </div>
      </div>
  );
}
