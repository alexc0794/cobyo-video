import React from 'react';
import { UserInSeatType } from '../../types';
import './index.css';

type PropTypes = {
  tableId: string,
  userId: string|null,
  seats: Array<UserInSeatType>,
  onEnter: (seatNumber: number) => void,
};

function DanceFloor({
  onEnter
}: PropTypes) {
  return (
    <button className="dance-floor" onClick={() => onEnter(1)}></button>
  );
}

export default DanceFloor;
