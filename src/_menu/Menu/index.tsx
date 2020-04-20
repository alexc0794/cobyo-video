import React, { useState, memo } from 'react';
import { useSelector } from 'react-redux';
import { selectMenuItems } from '_menu/selectors';
import { purchaseMenuItem } from '_menu/services';
import { MenuItemType, SelectedUserType } from 'types';
import Button from 'react-bootstrap/Button';
import UserSelection from '_menu/UserSelection';
import './index.css';

type PropTypes = {
  tableId: string,
  storefront: string,
  userId: string,
  initiallySelectedUsers: SelectedUserType,
  onRequestClose: () => void,
  ws: WebSocket,
};

const formatPrice = (cents:number) => {
  return (cents/100).toFixed(2);
};

function Menu({
  tableId,
  storefront,
  userId,
  initiallySelectedUsers,
  onRequestClose,
  ws,
}: PropTypes) {
  const menuItems = useSelector(selectMenuItems);
  const [showSelectUsers, toggleShowSelectUsers] = useState<boolean>(false);
  const [selectedItemId, setSelectedItemId] = useState<string>('');
  const [selectedUsers, setSelectedUsers] = useState<SelectedUserType>(initiallySelectedUsers);

  const handleSelectItem = (itemId: string) => {
    setSelectedItemId(itemId);
    toggleShowSelectUsers(true);
  };

  const handleSelectUser = (userId: string) => {
    if (selectedUsers[userId]) {
      setSelectedUsers({
        ...selectedUsers,
        [userId]: !selectedUsers[userId]
      })
    } else {
      setSelectedUsers({
        ...selectedUsers,
        [userId]: true
      })
    }
  };

  const handleBuyItem = async () => {
    let toUserIds: Array<string> = Object.keys(selectedUsers).filter((userId:string) => selectedUsers[userId] === true);
    // TODO: Request to purchase on our server before sending out with websockets.
    toUserIds = await purchaseMenuItem(selectedItemId, userId, toUserIds);
    toUserIds.forEach(toUserId => {
      ws.send(JSON.stringify({
        action: 'purchasedMenuItem',
        itemId: selectedItemId,
        userId: toUserId,
        fromUserId: userId,
        channelId: tableId,
      }));
    });
    onRequestClose();
  };

  return (
    <div className="Menu">
      {showSelectUsers ? (
        <>
          <p>Who do you want to buy this for?</p>
          {/* <label className="Menu-userSelect"><input type="checkbox" checked={selectedUser[userId]} onChange={() => handleSelectUser(userId)} /> Myself</label> */}
          <UserSelection tableId={tableId} userId={userId} onSelectUser={handleSelectUser} selectedUser={selectedUsers} />
          <Button size="sm" onClick={handleBuyItem} >Submit</Button>{' '}
          <Button size="sm" onClick={()=>toggleShowSelectUsers(false)} variant="outline-primary">Cancel</Button>
        </>
      ) : (
        <>
          <h4 className="Menu-header">Menu</h4>
          {menuItems.map((item: MenuItemType) => {
            return (
              <dl className="Menu-item" key={item.itemId} role="button" onClick={() => handleSelectItem(item.itemId)} >
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
