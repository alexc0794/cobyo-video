import React, { Component } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import { RTCType, AGORA_APP_ID } from '../../AgoraRTC';
import { fetchToken } from '../../services';
import Video from '../../Video';

export type LocalVideoPropTypes = {
  userId: string,
  tableId: string,
  audioMuted: boolean,
  rtc: RTCType,
}

class LocalVideo extends Component<LocalVideoPropTypes> {

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

    try {
      await rtc.client.publish([rtc.localAudioTrack, rtc.localVideoTrack]);
    } catch (e) {
      console.error(e);
      return;
    }

    try {
      rtc.localVideoTrack.play(`video-${userId}`);
    } catch (e) {
      console.log(e);
      alert('Unable to play local video');
      return;
    }

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

export default LocalVideo;
