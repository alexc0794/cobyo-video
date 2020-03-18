import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import './SeatPicker.css';

type PropTypes = {
  numSeats: number, // Should be an even number
  onClick: (seatNumber: number) => void
};

function SeatPicker({
  numSeats,
  onClick,
}: PropTypes) {

  return (
    <div className="SeatPicker">
      <Container fluid>
        <Row noGutters>
          {Array.from(new Array(Math.floor(numSeats / 2))).map((_, i) => (
            <Col key={i}>
              <Button onClick={() => onClick(i)}>Sit here!</Button>
            </Col>
          ))}
        </Row>
        <Row bsPrefix="table-row" />
        <Row noGutters>
          {Array.from(new Array(Math.floor(numSeats / 2))).map((_, i) => (
            <Col key={i}>
              <Button onClick={() => onClick(i)}>Sit here!</Button>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
}

export default SeatPicker;
