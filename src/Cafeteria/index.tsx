import React from 'react';
import Table from '../Table';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './index.css';

type PropTypes = {
  userId: string|null,
}

function Cafeteria({ userId }: PropTypes) {
  return (
    <Container fluid className="cafeteria">
      <Row>
        <Col><Table key="1" tableId="1" userId={userId} /></Col>
        <Col><Table key="2" tableId="2" userId={userId} /></Col>
      </Row>
      <Row/>
      <Row>
        <Col><Table key="3" tableId="3" userId={userId} /></Col>
        <Col><Table key="4" tableId="4" userId={userId} /></Col>
        <Col><Table key="5" tableId="5" userId={userId} /></Col>
      </Row>
    </Container>
  );
}

export default Cafeteria;
