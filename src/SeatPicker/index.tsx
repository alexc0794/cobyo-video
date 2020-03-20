import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { Table, UserInSeat } from '../types';
import { timeSince } from '../helpers';
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

              const tooltip = <Tooltip id={`tooltip-${userId}`}>{`Joined ${timeSince(new Date(seat.satDownAt))} ago`}</Tooltip>;

              if (!!seat && seat.userId === userId) {
                return (
                  <OverlayTrigger
                    placement="bottom"
                    overlay={tooltip}
                  >
                    <span><Button variant="warning" disabled style={{ pointerEvents: 'none' }}>You</Button></span>
                  </OverlayTrigger>
                );
              }
              return (
                <OverlayTrigger
                  placement="bottom"
                  overlay={tooltip}
                >
                  <span><Button variant="danger" disabled style={{ pointerEvents: 'none' }}>Occupied</Button></span>
                </OverlayTrigger>
              );
            })()}
          </Col>
        );
      })}
    </Row>
  );
}

export default SeatPicker;
