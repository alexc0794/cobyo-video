import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophoneSlash, faChair } from '@fortawesome/free-solid-svg-icons';
import cx from 'classnames';
import './index.css';

type VideoPropTypes = {
  userId: string,
  audioMuted: boolean,
};

export default function Video({
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
