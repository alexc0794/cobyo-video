import React, {memo} from 'react';
import { useSelector } from 'react-redux';
import { selectMenuItemById } from 'src/menu/selectors';
import { MenuItemType } from 'src/types';
import './userItem.css'

type PropType = {
  itemId: string
}
function UserItem({ itemId }:PropType) {
  const menuItem: MenuItemType = useSelector(selectMenuItemById(itemId));
  return (
    <img className="UserItem" src={menuItem.imageUrl} alt={menuItem.name} />
  );
}

export default memo(UserItem);
