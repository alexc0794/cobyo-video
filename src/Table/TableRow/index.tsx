import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Seat from '../Seat';
import { UserInSeatType } from '../../types';

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
        const { seatNumber } = seat;
        return (
          <Col key={seat ? `seat${seatNumber}-user${seat.userId}` : `seat${seatNumber}`}>
            <Seat userId={userId} seat={seat} seatNumber={seatNumber} onClick={onPickSeat} />
          </Col>
        );
      })}
    </Row>
  );
}

export default TableRow;
