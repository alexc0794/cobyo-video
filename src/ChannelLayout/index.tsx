import React from 'react';
import { UserInSeatType } from '../types';
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

function Layout({
  tableId,
  userId,
  shape,
  seats,
  storefront,
  onPickSeat
}: PropTypes) {
  console.log("shape",shape);
  let columns = seats.length > 6 ? seats.length - 2*2 : seats.length - 2*1;
  columns = shape ==='RECTANGULAR' ? seats.length / 2 : columns;
  const rows = shape ==='RECTANGULAR' ? DEFAULT_ROW +1 : DEFAULT_ROW;
  const styleVar = {'--columns': columns,'--rows': rows} as React.CSSProperties;

  return (
    <div
      style={styleVar}
      className={cx('ChannelContainer', {'ChannelContainer--clubMode':storefront === 'CLUB'})}
    >
        <div className={`Channel-table Channel-table--${shape}`} />
      {seats.map((seat, i) => (
        <button className="Channel-seat" key={i} onClick={() => onPickSeat(i)} />
      ))}
    </div>
  );
}

export default Layout;
