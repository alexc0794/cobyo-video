import React from 'react';
import { useSelector } from 'react-redux';
import { selectStorefront } from '../redux/appSelectors';
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
  const storefront = useSelector(selectStorefront);
  return (
    <div id={`video-${userId}`} className={cx("video", {
      'club-mode': storefront === 'CLUB'
    })}>
      {audioMuted && (
        <div className="video-overlay">
          <div className="video-muted-icon"><FontAwesomeIcon icon={faMicrophoneSlash} /></div>
        </div>
      )}
    </div>
  );
}

export function VideoPlaceholder() {
  const storefront = useSelector(selectStorefront);
  return (
      <div className={cx("video video-placeholder", {
        'club-mode': storefront === 'CLUB'
      })}>
        <div className={cx("video-placeholder-icon", {
          'club-mode-darker': storefront === 'CLUB'
        })}>
          <FontAwesomeIcon icon={faChair} />
        </div>
      </div>
  );
}
