import React, {memo} from 'react';
import { useSelector } from 'react-redux';
import { selectMenuItemById } from '../redux/menuSelectors';

type PropType = {
  itemName: string
}
function UserItem({itemName}:PropType) {
  const menuItem = useSelector(selectMenuItemById(itemName));
  return (<img src={menuItem.imageUrl} alt={itemName} />);
}

export default memo(UserItem);