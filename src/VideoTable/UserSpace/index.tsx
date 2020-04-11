import React, {memo} from 'react';
import { useSelector } from 'react-redux';
import { selectUserMenuItemsById } from '../../redux/userMenuItemsSelectors';
import { UserMenuItemType } from '../../types';
import UserItem from './userItem';

type PropTypes = {
  userId: string
};

function UserSpace({userId}:PropTypes) {
  const userItems = useSelector(selectUserMenuItemsById(userId));
  return (
    <>
      {userItems && userItems.length > 0 ? (
        userItems.map((item: UserMenuItemType) => (
          <UserItem itemName={item.menuItemName} key={item.menuItemName} />
        ))
      ) : null}
    </>
  )
}

export default memo(UserSpace);
