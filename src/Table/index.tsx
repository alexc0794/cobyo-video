import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { joinAndUpdateTable } from '../redux/tablesActions';
import { selectTableById, selectJoinedTableId, selectJoinedTableSeat } from '../redux/tablesSelectors';
import { selectUsersByIds } from '../redux/usersSelectors';
import DanceFloor from './DanceFloor';
import RectangularTable from './RectangularTable';
import CouchTable from './CouchTable';
import { SeatType, UserInSeatType } from '../types';

export const U_SHAPE_TABLE_END_SEAT_LENGTH = 2;

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

  async function handlePickSeat(pickedSeatNumber: number) {
    if (!userId) { return; }

    const isSwitchingSeat = isUserJoined && pickedSeatNumber !== seat;
    if (isSwitchingSeat) {
      alert('Not yet implemented. Leave table first, then join.');
      return;
    }
    dispatch(joinAndUpdateTable(tableId, pickedSeatNumber, userId));
  }

  const seats = table ? table.seats : [];
  const tableUserIds: Array<string|null> = seats.map((seat: SeatType) => seat ? seat.userId : null);
  const users = useSelector(selectUsersByIds(tableUserIds));
  const userInSeats: Array<UserInSeatType> = seats.map((seat: SeatType, i: number) => seat ? ({
    ...seat,
    ...users[i]
  }) : null);

  if (!table) { return null; }

  switch (table.shape) {
    case 'DANCE_FLOOR':
      return (
        <DanceFloor tableId={tableId} userId={userId} seats={userInSeats} onEnter={handlePickSeat} />
      );
    case 'U_DOWN':
    case 'U_UP':
      return (
        <CouchTable
          tableId={tableId}
          userId={userId}
          seats={userInSeats}
          numSeatsAtEnds={U_SHAPE_TABLE_END_SEAT_LENGTH}
          shape={table.shape}
          onPickSeat={handlePickSeat}
        />
      );
    default:
      return (
        <RectangularTable
          tableId={tableId}
          userId={userId}
          seats={userInSeats}
          onPickSeat={handlePickSeat}
        />
      )
  }
}

export default Table;
