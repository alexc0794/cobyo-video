import React, { memo } from 'react';
import { useSelector } from 'react-redux';
import { selectUserRecentChatMessage } from 'chat/selectors';
import { UserType } from 'types';
import Tooltip from 'react-bootstrap/Tooltip';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';

type ActiveUserPropTypes = {
  user: UserType
};

function ActiveUser({ user }: ActiveUserPropTypes) {
  const { userId } = user;
  const chatMessage = useSelector((state) => selectUserRecentChatMessage(state, userId));

  const activeUserComponent = (
    <div className="active-user">
      <div className="active-user-icon">
        {user.profilePictureUrl && (
          <img src={user.profilePictureUrl} alt={user.firstName} />
        )}
      </div>
      <div className="active-user-body">
        <span className="active-user-name">{user.firstName} {user.lastName}</span>
        <span className="active-user-status-dot" />
      </div>
    </div>
  );

  if (chatMessage) {
    return (
      <OverlayTrigger
        placement="left"
        defaultShow
        trigger="click"
        delay={100}
        overlay={
          <Tooltip id={`active-user-popover-${userId}`}>{chatMessage.message}</Tooltip>
        }
      >
        {activeUserComponent}
      </OverlayTrigger>
    );
  }

  return activeUserComponent;
}

export default memo(ActiveUser);
