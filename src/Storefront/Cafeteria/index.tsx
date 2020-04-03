import React from 'react';
import Table from '../../Table';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './index.css';

type PropTypes = {
  userId: string|null,
  tableIds: Array<string>,
};

function Cafeteria({
  userId,
  tableIds
}: PropTypes) {

  return (
    <Container fluid className="cafeteria">
      <Row>
        <Col><Table key="1" tableId={tableIds[0]} userId={userId} /></Col>
        <Col><Table key="2" tableId={tableIds[1]} userId={userId} /></Col>
      </Row>
      <Row/>
      <Row>
        <Col><Table key="3" tableId={tableIds[2]} userId={userId} /></Col>
        <Col><Table key="4" tableId={tableIds[3]} userId={userId} /></Col>
      </Row>
      <Row/>
      <Row>
        <Col><Table key="5" tableId={tableIds[4]} userId={userId} /></Col>
        <Col><Table key="6" tableId={tableIds[5]} userId={userId} /></Col>
      </Row>
    </Container>
  );
}

export default Cafeteria;