import React, {useState} from 'react';
import { UserInSeatType } from '../../types';
import Seat from '../Seat'
import cx from 'classnames';
import { updateTableName_ } from "../../redux/tablesActions"
import { useDispatch } from 'react-redux'
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
  let columns = seats.length > 6 ? seats.length - 2*2 : seats.length - 2*1;
  columns = shape ==='RECTANGULAR' ? seats.length / 2 : columns;
  const rows = shape ==='RECTANGULAR' ? DEFAULT_ROW +1 : DEFAULT_ROW;
  const styleVar = {'--columns': columns,'--rows': rows} as React.CSSProperties;
  const [tableName, setTableName] = useState("")
  const dispatch = useDispatch()

  const handleNameUpdate = async (e: any) => {
    e.preventDefault()
    if (!tableName) return

    try {
      dispatch(updateTableName_({ table_id: tableId, name: tableName }))
    } catch(e) {
      console.error(e)
    }
  }

  return (
    <div
      style={styleVar}
      className={cx('ChannelContainer', {'ChannelContainer--clubMode':storefront === 'CLUB'})}
    >
      <div className={`Channel-table Channel-table--${shape}`} />
      {seats.map((seat) => (
        <Seat
          key={seat.seatNumber}
          userId={userId}
          seat={seat}
          seatNumber={seat.seatNumber}
          onClick={onPickSeat}
          storefront={storefront}
        />
      ))}
      <form onSubmit={handleNameUpdate}>
        <input
          className="Channel-table--name-input"
          type="text"
          value={tableName}
          onChange={(e) => setTableName(e.target.value)}
        />
        <button
          type="submit"
          onClick={handleNameUpdate}
        >Update Name</button>
      </form>
    </div>
  );
}

export default Layout;
