import React, {memo} from 'react';
import { useSelector } from 'react-redux';
import { selectUserMenuItemsById } from 'users/userMenuItemsSelectors';
import { UserMenuItemType } from 'types';
import UserItem from 'video/VideoTable/UserSpace/userItem';

type PropTypes = {
  userId: string
};

function UserSpace({userId}:PropTypes) {
  const userItems = useSelector(selectUserMenuItemsById(userId));
  return (
    <>
      {userItems && userItems.length > 0 ? (
        userItems.map((item: UserMenuItemType) => (
          <UserItem itemId={item.itemId} key={item.itemId} />
        ))
      ) : null}
    </>
  );
}

export default memo(UserSpace);
