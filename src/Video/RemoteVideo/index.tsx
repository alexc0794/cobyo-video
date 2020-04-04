import React, { Component } from 'react';
import { VideoUserType } from '../../VideoHangout/types';
import Video from '../../Video';

const MAX_DISTANCE_TO_HEAR_AUDIO = 3;

export type RemoteVideoPropTypes = VideoUserType & {
  localUserRow: number|null,
  localUserCol: number|null,
  remoteUserRow: number|null,
  remoteUserCol: number|null,
};

class RemoteVideo extends Component<RemoteVideoPropTypes> {

  componentDidMount() {
    const { videoTrack, audioTrack, userId } = this.props;
    if (videoTrack) {
      videoTrack.play(`video-${userId}`);
    }
    if (audioTrack && this.getShouldPlaySound()) {
      audioTrack.play();
    }
  }

  getDistanceFromLocalUser() {
    const { localUserRow, localUserCol, remoteUserRow, remoteUserCol } = this.props;
    if (localUserRow !== null && localUserCol !== null && remoteUserRow !== null && remoteUserCol !== null) {
      return Math.sqrt(Math.pow(localUserRow - remoteUserRow, 2) + Math.pow(localUserCol - remoteUserCol, 2));
    }
    return 0;
  }

  getShouldPlaySound() {
    return this.getDistanceFromLocalUser() < MAX_DISTANCE_TO_HEAR_AUDIO;
  }

  render() {
    const { userId, audioMuted } = this.props;

    return (
      <Video
        userId={userId}
        audioMuted={audioMuted || !this.getShouldPlaySound()}
      />
    );
  }
}

export default RemoteVideo;
