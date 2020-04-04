import React from 'react';
import { UserInSeatType } from '../../types';
import './index.css';

type PropTypes = {
  tableId: string,
  userId: string|null,
  seats: Array<UserInSeatType>,
  onEnter: (seatNumber: number|null) => void,
};

function DanceFloor({
  seats,
  onEnter
}: PropTypes) {
  function handleClick() {
    onEnter(null);
  }

  return (
    <button className="dance-floor" onClick={handleClick}></button>
  );
}

export default DanceFloor;
