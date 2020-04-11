import React, { useState, memo } from 'react';
import { useSelector } from 'react-redux';
import {selectMenuItems} from '../redux/menuSelectors';
import {MenuItemType} from '../types';
import Button from 'react-bootstrap/Button';
import './index.css';

type PropTypes = {
  tableId: string,
  storefront: string,
  userId: string,
  onRequestClose: () => void,
  ws: WebSocket,
};

type userSelectType = {
  [userId: string]: boolean,
};

const formatPrice = (cents:number) => {
  return (cents/100).toFixed(2);
};

function Menu({ tableId, storefront, userId, onRequestClose, ws }: PropTypes) {
  const menuItems = useSelector(selectMenuItems);
  const [showSelectUsers, toggleShowSelectUsers] = useState<boolean>(false);
  const [selectedItemId, setSelectedItemId] = useState<string>('');
  const [userSelection, toggleSelectUser] = useState<userSelectType>({});

  const handleSelectItem = (itemId: string) => {
    setSelectedItemId(itemId);
    toggleShowSelectUsers(true);
  };
  const handleSelectUser = (userId: string) => {
    if (userSelection[userId]) {
      userSelection[userId] = !userSelection[userId];
    } else {
      userSelection[userId] = true;
    }
  };
  const handleBuyItem = () => {
    const toUserIds = Object.keys(userSelection).filter(x => userSelection[x]=== true);
    // TODO: Request to purchase on our server before sending out with websockets.
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
          <label className="Menu-userSelect"><input type="checkbox" checked={userSelection[userId]} onChange={() => handleSelectUser(userId)} /> Myself</label>
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
