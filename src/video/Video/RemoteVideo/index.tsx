import React, { Component } from 'react';
import { VideoUserType } from 'src/video/VideoHangout/types';
import Video from 'src/video/Video';

export type RemoteVideoPropTypes = VideoUserType;

class RemoteVideo extends Component<RemoteVideoPropTypes> {

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
    return (
      <Video
        userId={userId}
        audioMuted={audioMuted}
      />
    );
  }
}

export default RemoteVideo;
