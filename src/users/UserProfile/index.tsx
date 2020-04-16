import React, { memo } from 'react';
import cx from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import './index.css';

type PropTypes = {
  variation?: 'general' | 'self' | 'unavailable',
  userId: string,
  url: string | null,
}
function UserProfile({variation = 'general', userId, url}: PropTypes) {
  return (
    <div className={cx('UserProfile', {
        'UserProfile--general': variation === 'general',
        'UserProfile--self': variation === 'self',
        'UserProfile-unavailable': variation === 'unavailable'
      })}
    >
      {url ? (
        <img className="UserProfile-image" src={url} alt={userId} />
      ) : (
        <FontAwesomeIcon icon={faUser} />
      )}
    </div>
  )
}

export default memo(UserProfile);
