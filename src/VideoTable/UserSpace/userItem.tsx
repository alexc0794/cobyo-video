import React, {memo} from 'react';
import { useSelector } from 'react-redux';
import { selectMenuItemById } from '../../redux/menuSelectors';
import './userItem.css'

type PropType = {
  itemName: string
}
function UserItem({itemName}:PropType) {
  const menuItem = useSelector(selectMenuItemById(itemName));
  return (<img className="UserItem" src={menuItem.imageUrl} alt={itemName} />);
}

export default memo(UserItem);
