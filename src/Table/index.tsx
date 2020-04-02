import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { joinAndUpdateTable, leaveAndUpdateTable } from '../redux/tablesActions';
import { selectTableById, selectJoinedTableId, selectJoinedTableSeat } from '../redux/tablesSelectors';
import { selectUsersByIds } from '../redux/usersSelectors';
import RectangularTable from './RectangularTable';
import { SeatType, UserInSeatType } from '../types';
import './index.css';

type PropTypes = {
  tableId: string,
  userId: string|null,
};

function Table({ tableId, userId }: PropTypes) {
  const dispatch = useDispatch();
  const table = useSelector(selectTableById(tableId));
  const joinedTableId = useSelector(selectJoinedTableId);
  const isUserJoined = joinedTableId === tableId;
  // const isUserJoinedOther = joinedTableId !== null && !isUserJoined;
  const seat = useSelector(selectJoinedTableSeat(userId || ""));

  async function handlePickSeat(pickedSeat: number) {
    if (!userId) { return; }

    const isSwitchingSeat = isUserJoined && pickedSeat !== seat;
    if (isSwitchingSeat) {
      alert('Not yet implemented. Leave table first, then join.');
      return;
    }
    dispatch(joinAndUpdateTable(tableId, pickedSeat, userId));
  }

  function handleLeaveTable() {
    if (!userId) { return; }
    dispatch(leaveAndUpdateTable(tableId, userId));
  }

  const seats = table ? table.seats : [];
  const tableUserIds: Array<string|null> = seats.map((seat: SeatType) => seat ? seat.userId : null);
  const users = useSelector(selectUsersByIds(tableUserIds));
  const userInSeats: Array<UserInSeatType> = seats.map((seat: SeatType, i: number) => seat ? ({
    ...seat,
    ...users[i]
  }) : null);

  return (
    <RectangularTable tableId={tableId} userId={userId} seats={userInSeats} onPickSeat={handlePickSeat} />
  );
}

export default Table;
