import React, { useEffect, memo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAndUpdateUserInventory } from '_users/actions';
import { selectStorefront } from '_storefront/selectors';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophoneSlash, faChair, faCouch } from '@fortawesome/free-solid-svg-icons';
import cx from 'classnames';
import './index.css';

type VideoPropTypes = {
  userId: string,
  audioMuted: boolean,
};

function Video({
  userId,
  audioMuted,
}: VideoPropTypes) {
  const storefront = useSelector(selectStorefront);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchAndUpdateUserInventory(userId));
  }, [dispatch, userId])

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

function UnmemoizedVideoPlaceholder() {
  const storefront = useSelector(selectStorefront);
  return (
    <div className={cx("video video-placeholder", {
      'club-mode': storefront === 'CLUB'
    })}>
      <div className={cx("video-placeholder-icon", {
        'club-mode-darker': storefront === 'CLUB'
      })}>
        {storefront === 'CLUB' ? (
          <FontAwesomeIcon icon={faCouch} />
        ) : (
          <FontAwesomeIcon icon={faChair} />
        )}
      </div>
    </div>
  );
}

export const VideoPlaceholder = memo(UnmemoizedVideoPlaceholder);
export default memo(Video);
