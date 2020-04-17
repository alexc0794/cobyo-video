import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectStorefront } from 'stores/selectors';
import { joinAndUpdateTable } from 'tables/actions';
import { selectTableById, selectJoinedTableId, selectJoinedTableSeat } from 'tables/selectors';
import { selectUsersByIds } from 'users/selectors';
import DanceFloor from 'tables/DanceFloor';
import TableLayout from 'tables/TableLayout';
import { SeatType, UserInSeatType } from 'types';
import './index.css';

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
  const storefront = useSelector(selectStorefront);

  async function handlePickSeat(pickedSeatNumber: number|null) {
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
        <DanceFloor
          tableId={tableId}
          userId={userId}
          seats={userInSeats}
          onEnter={handlePickSeat}
        />
      );
    default:
      return (
        <TableLayout
          tableId={tableId}
          userId={userId}
          seats={userInSeats}
          shape={table.shape}
          storefront={storefront}
          onPickSeat={handlePickSeat}
        />
      )
  }
}

export default Table;
