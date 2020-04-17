import React from 'react';
import { UserInSeatType } from 'src/types';
import Seat from 'src/tables/Seat';
import cx from 'classnames';
import './index.css';

type PropTypes = {
  tableId: string,
  userId: string|null,
  shape: string,
  seats: Array<UserInSeatType>,
  storefront: string,
  onPickSeat: (seatNumber: number|null) => void
};

const DEFAULT_ROW = 3;

function TableLayout({
  tableId,
  userId,
  shape,
  seats,
  storefront,
  onPickSeat
}: PropTypes) {
  let columns = seats.length > 6 ? seats.length - 2*2 : seats.length - 2*1;
  columns = shape ==='RECTANGULAR' ? seats.length / 2 : columns;
  const rows = shape ==='RECTANGULAR' ? DEFAULT_ROW +1 : DEFAULT_ROW;
  const styleVar = {'--columns': columns,'--rows': rows} as React.CSSProperties;

  return (
    <div
      style={styleVar}
      className={cx('TableContainer', {'TableContainer--clubMode':storefront === 'CLUB'})}
    >
      <div className={`Table-table Table-table--${shape}`} />
      {seats.map((seat, i) => (
        <Seat
          key={seat.seatNumber}
          userId={userId}
          seat={seat}
          seatNumber={seat.seatNumber}
          onClick={onPickSeat}
          storefront={storefront}
        />
      ))}
    </div>
  );
}

export default TableLayout;
