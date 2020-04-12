import React, {memo} from 'react';
import UserProfile from '../../UserProfile';
import {UserType} from '../../types';
import cx from 'classnames';
import './index.css';

type PropTypes = {
  users: Array<UserType>,
  userId: string,
  selectedUser: SelectedUserType,
  onSelectUser: (userId: string)=> void,
}

type SelectedUserType = {
  [userId: string]: boolean,
};

function UserSelection({
  users,
  userId,
  selectedUser,
  onSelectUser
}: PropTypes) {
  return (
    <div className="UserSelection">
      {users.map((user:UserType) =>  (
          <div className="UserSelection-user" key={user.userId} onClick={()=>onSelectUser(user.userId)}>
            <div className={cx('UserSelection-userImage', {
              'is-selected': selectedUser[user.userId] === true
            })}>
              <UserProfile
                userId={user.userId}
                url={user.profilePictureUrl}
                variation={user.userId === userId ? 'self' : 'general'}
              />
            </div>
            <p className="UserSelection-userName">{user.userId === userId ? 'Myself' : user.firstName }</p>
          </div>
        )
      )}
    </div>
  )
}

export default memo(UserSelection);