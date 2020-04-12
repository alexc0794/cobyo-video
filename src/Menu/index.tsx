import React, {useEffect, useState, memo} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {fetchMenu} from '../services/menu';
import {saveMenuToStore} from '../redux/menuActions';
import {selectMenuItems} from '../redux/menuSelectors';
import {buyMenuItem} from '../redux/userMenuItemsActions';
import {MenuItemType} from '../types';
import Button from 'react-bootstrap/Button';
import UserSelection from './UserSelection';
import './index.css';

type PropTypes = {
  storefront: string,
  userId: string,
  onRequestClose: () => void,
};

type SelectedUserType = {
  [userId: string]: boolean,
};

function Menu({storefront, userId, onRequestClose}:PropTypes) {
  const dispatch = useDispatch();
  const menuItems = useSelector(selectMenuItems);
  const [showSelectUsers, toggleShowSelectUsers] = useState<boolean>(false);
  const [selectedItem, selectItem] = useState<string>('');
  const [selectedUser, toggleSelectUser] = useState<SelectedUserType>({});
  useEffect(()=>{
    fetchMenu(storefront).then(items => {
      dispatch(saveMenuToStore(items));
    });
  }, [storefront, dispatch, selectedItem, selectedUser]);
  const formatPrice = (cents:number) => {
    return (cents/100).toFixed(2);
  };
  const handleSelectItem = (itemName: string) => {
    selectItem(itemName);
    toggleShowSelectUsers(true);
  };
  const handleSelectUser = (userId: string) => {
    if (selectedUser[userId]) {
      toggleSelectUser({
        ...selectedUser,
        [userId]: !selectedUser[userId]
      })
    } else {
      toggleSelectUser({
        ...selectedUser,
        [userId]: true
      })
    }
  };
  const handleBuyItem = () => {
    const toUserIds = Object.keys(selectedUser).filter(x => selectedUser[x]=== true);
    dispatch(buyMenuItem(selectedItem, userId, toUserIds));
    onRequestClose();
  };
  // mock data to test user selection component
  const users = [
    {
      userId,
      firstName: 'Megan',
      facebookUserId: null,
      email: null,
      lastName: null,
      profilePictureUrl: null,
      lastActiveAt: null,
    },
    {
      userId: 'fakeId',
      firstName: 'My Twin',
      facebookUserId: null,
      email: null,
      lastName: null,
      profilePictureUrl: 'https://ca.slack-edge.com/T0115CVBWNP-U011DA8124V-gfac171cb152-72',
      lastActiveAt: null,
    },
    {
      userId: 'whatever',
      firstName: 'Alex',
      facebookUserId: null,
      email: null,
      lastName: null,
      profilePictureUrl: 'https://ca.slack-edge.com/T0115CVBWNP-U0115CVBWSF-310820805f84-72',
      lastActiveAt: null,
    },
  ]

  return (
    <div className="Menu">
      {showSelectUsers ? (
        <>
          <p>Who do you want to buy this for?</p>
          {/* <label className="Menu-userSelect"><input type="checkbox" checked={selectedUser[userId]} onChange={() => handleSelectUser(userId)} /> Myself</label> */}
          <UserSelection users={users} userId={userId} onSelectUser={handleSelectUser} selectedUser={selectedUser} />
          <Button size="sm" onClick={handleBuyItem} >Submit</Button>{' '}
          <Button size="sm" onClick={()=>toggleShowSelectUsers(false)} variant="outline-primary">Cancel</Button>
        </>
      ) : (
        <>
          <h4 className="Menu-header">Menu</h4>
          {menuItems.map((item: MenuItemType) => {
            return (
              <dl className="Menu-item" key={item.name} role="button" onClick={() => handleSelectItem(item.name)} >
                <dt className="Menu-item-name">{item.name}</dt>
                <dd className="Menu-item-price">{formatPrice(item.cents)}</dd>
              </dl>
          )})}
          <Button size="sm" onClick={onRequestClose}>Close</Button>
        </>
      )}
    </div>
  )
}

export default memo(Menu);
