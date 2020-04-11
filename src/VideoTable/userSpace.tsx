import React, {memo} from 'react';
import { useSelector } from 'react-redux';
import { selectUserMenuItemsById } from '../redux/userMenuItemsSelectors';
import {menuItemType, userMenuItemType} from '../types';
import UserItem from './userItem';

type PropTypes = {
  userId: string
}

function UserSpace({userId}:PropTypes) {
  const userItems = useSelector(selectUserMenuItemsById(userId));
  return (
    <>
      {userItems && userItems.length > 0 ? (
        userItems.map((item: userMenuItemType) => (
          <UserItem itemName={item.menuItemName} key={item.menuItemName} />
        ))
      ) : null}
    </>
  )
}

export default memo(UserSpace);