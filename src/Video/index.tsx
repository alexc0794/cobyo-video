import React, { Component } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import { RTCType, AGORA_APP_ID } from '../AgoraRTC';
import { VideoUserType } from '../VideoHangout/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChair } from '@fortawesome/free-solid-svg-icons';
import { fetchToken } from '../services';
import cx from 'classnames';
import './index.css';

type VideoPropTypes = VideoUserType;

type VideoStateTypes = {}

export class Video extends Component<VideoPropTypes, VideoStateTypes> {

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
    return <div id={`video-${this.props.userId}`} className={cx("video", {})} />;
  }
}

type MyVideoPropTypes = {
  userId: string,
  tableId: string,
  rtc: RTCType,
}

export class MyVideo extends Component<MyVideoPropTypes> {

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
    return <div id={`video-${this.props.userId}`} className={cx("video", {})} />;
  }
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
