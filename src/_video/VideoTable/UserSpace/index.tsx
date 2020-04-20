import React, {memo} from 'react';
import { useSelector } from 'react-redux';
import { selectUserInventory } from '_users/selectors';
import { InventoryItemType } from 'types';
import UserItem from '_video/VideoTable/UserSpace/userItem';

type PropTypes = {
  userId: string
};

function UserSpace({userId}:PropTypes) {
  const userItems = useSelector(selectUserInventory(userId));
  return (
    <>
      {userItems && userItems.length > 0 ? (
        userItems.map((item: InventoryItemType) => (
          <UserItem itemId={item.itemId} key={item.itemIdPurchasedAt} />
        ))
      ) : null}
    </>
  );
}

export default memo(UserSpace);
