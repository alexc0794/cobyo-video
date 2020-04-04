import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import TableRow from '../TableRow';
import { UserInSeatType } from '../../types';
import cx from 'classnames';
import './index.css';

type PropTypes = {
  tableId: string,
  userId: string|null,
  seats: Array<UserInSeatType>,
  storefront: string,
  onPickSeat: (seatNumber: number) => void,
};

function RectangularTable({
  tableId,
  userId,
  seats,
  storefront,
  onPickSeat,
}: PropTypes) {
  return (
    <div className={cx("rectangular-table", {})}>
      <Container fluid>
        <TableRow
          userId={userId}
          seats={seats}
          startIndex={0}
          endIndex={Math.ceil(seats.length / 2)}
          onPickSeat={onPickSeat}
        />
        <Row className={cx("table-display", {
          "club-table-display": storefront === 'CLUB',
        })} />
        <TableRow
          userId={userId}
          seats={seats}
          startIndex={Math.ceil(seats.length / 2)}
          endIndex={seats.length}
          onPickSeat={onPickSeat}
        />
      </Container>
    </div>
  );
}

export default RectangularTable;
