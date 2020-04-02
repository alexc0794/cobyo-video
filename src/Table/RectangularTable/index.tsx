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
  onPickSeat: (seatNumber: number) => void,
};

function RectangularTable({
  tableId,
  userId,
  seats,
  onPickSeat,
}: PropTypes) {
  return (
    <div className={cx("table", {})}>
      <Container fluid>
        <TableRow
          userId={userId}
          seats={seats}
          startIndex={0}
          endIndex={Math.ceil(seats.length / 2)}
          onPickSeat={onPickSeat}
        />
        <Row className="rectangular-table" />
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
