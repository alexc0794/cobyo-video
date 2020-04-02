import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import TableRow from '../TableRow';
import Seat from '../Seat';
import { UserInSeatType } from '../../types';
import './index.css';

type PropTypes = {
  tableId: string,
  userId: string|null,
  numSeatsAtEnds: number,
  seats: Array<UserInSeatType>,
  facingUp: boolean,
  onPickSeat: (seatNumber: number) => void,
};

function CouchTable({
  tableId,
  userId,
  seats,
  numSeatsAtEnds,
  facingUp,
  onPickSeat,
}: PropTypes) {
  const seatsAtFirstEnd = seats.slice(0, numSeatsAtEnds);
  const seatsAtSecondEnd = seats.slice(seats.length - numSeatsAtEnds, seats.length);

  return (
    <Container fluid className="couch-table">
      {!facingUp && (
        <TableRow
          userId={userId}
          seats={seats}
          startIndex={numSeatsAtEnds}
          endIndex={seats.length - numSeatsAtEnds}
          onPickSeat={onPickSeat}
        />
      )}
      <Row noGutters>
        <Col lg={2} className="vertical-table-row">
          {seatsAtFirstEnd.map((seat, i) => (
            <Seat key={`seat-first-end-${i}`} userId={userId} seat={seat} seatNumber={seat.seatNumber} onClick={onPickSeat} />
          ))}
        </Col>
        <Col lg={8} className="table" />
        <Col lg={2} className="vertical-table-row">
          {seatsAtSecondEnd.map((seat, i) => (
            <Seat key={`seat-second-end-${i}`} userId={userId} seat={seat} seatNumber={seat.seatNumber} onClick={onPickSeat} />
          ))}
        </Col>
      </Row>
      {facingUp && (
        <TableRow
          userId={userId}
          seats={seats}
          startIndex={numSeatsAtEnds}
          endIndex={seats.length - numSeatsAtEnds}
          onPickSeat={onPickSeat}
        />
      )}
    </Container>
  );
}

export default CouchTable;
