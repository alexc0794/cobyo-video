import React, {useEffect, useState, memo} from 'react';
import {fetchMenu} from '../services/menu';
import {menuItemType} from '../types';
import Button from 'react-bootstrap/Button';
import './menu.css';

type PropTypes = {
  storefront: string,
  onRequestClose: () => void,
}

function Menu({storefront, onRequestClose}:PropTypes) {
  const [menuItems, setMenuItems] = useState<Array<menuItemType>>([]);
  useEffect(()=>{
    fetchMenu(storefront).then(items=>{
      setMenuItems(items);
    });
  }, [])
  const formatPrice = (cents:number) => {
    return (cents/100).toFixed(2);
  }

  return (
    <div className="Menu">
       <h2 className="Menu-header">Menu</h2>
        {menuItems.map(item => {
          console.log(item);
          return (
            <dl className="Menu-item" key={item.name} role="button" onClick={() => console.log("selected item")} >
              <dt className="Menu-item-name">{item.name}</dt>
              <dd className="Menu-item-price">{formatPrice(item.cents)}</dd>
            </dl>
        )})}
        <Button size="sm" onClick={onRequestClose}>Close</Button>
    </div>
  )
}

export default memo(Menu);