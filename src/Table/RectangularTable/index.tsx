import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Seat from '../Seat';
import { UserInSeatType } from '../../types';
import cx from 'classnames';

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
        <Row bsPrefix="table-row" />
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

type TableRowPropTypes = {
  userId: string|null,
  seats: Array<UserInSeatType>,
  startIndex: number,
  endIndex: number,
  onPickSeat: (seatNumber: number) => void
};

function TableRow({
  userId,
  seats,
  startIndex,
  endIndex,
  onPickSeat,
}: TableRowPropTypes) {
  return (
    <Row noGutters>
      {seats.slice(startIndex, endIndex).map((seat: UserInSeatType, i: number) => {
        const seatNumber = startIndex + i;
        return (
          <Col key={seat ? `seat${seatNumber}-user${seat.userId}` : `seat${seatNumber}`}>
            <Seat userId={userId} seat={seat} seatNumber={seatNumber} onClick={onPickSeat} />
          </Col>
        );
      })}
    </Row>
  );
}

export default RectangularTable;
