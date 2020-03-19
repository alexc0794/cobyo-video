import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { Table, UserInSeat } from '../types';
import './index.css';

type PropTypes = {
  userId: string,
  table: Table,
  onClick: (seatNumber: number) => void
};

function SeatPicker({
  userId,
  table,
  onClick,
}: PropTypes) {
  const { seats } = table;
  return (
    <div className="SeatPicker">
      <Container fluid>
        <SeatPickerRow
          userId={userId}
          seats={seats}
          startIndex={0}
          endIndex={Math.ceil(seats.length / 2)}
          onClick={onClick}
        />
        <Row bsPrefix="table-row" />
        <SeatPickerRow
          userId={userId}
          seats={seats}
          startIndex={Math.ceil(seats.length / 2)}
          endIndex={seats.length}
          onClick={onClick}
        />
      </Container>
    </div>
  );
}

type SeatPickerRowPropTypes = {
  userId: string,
  seats: Array<UserInSeat>,
  startIndex: number,
  endIndex: number,
  onClick: (seatNumber: number) => void
};

function SeatPickerRow({
  userId,
  seats,
  startIndex,
  endIndex,
  onClick
}: SeatPickerRowPropTypes) {
  return (
    <Row noGutters>
      {seats.slice(startIndex, endIndex).map((seat: UserInSeat, i: number) => {
        const seatNumber = startIndex + i;
        return (
          <Col key={seat ? (
            `seat${seatNumber}-user${seat.userId}`
          ) : (
            `seat${seatNumber}`
          )}>
            {(() => {
              if (!seat) {
                return (
                  <Button onClick={() => onClick(seatNumber)}>Sit here!</Button>
                );
              }
              if (!!seat && seat.userId == userId) {
                return (
                  <Button variant="warning" disabled>You</Button>
                );
              }
              return (
                <Button variant="danger" disabled>Occupied</Button>
              );
            })()}
          </Col>
        );
      })}
    </Row>
  );
}

export default SeatPicker;
