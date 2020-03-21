import React from 'react';
import Table from '../Table';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

type PropTypes = {
  userId: string|null,
}

function Cafeteria({ userId }: PropTypes) {
  return (
    <Container fluid>
      <Row>
        <Col>
          <Table
            key="1"
            tableId="1"
            userId={userId}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <Table
            key="2"
            tableId="2"
            userId={userId}
          />
        </Col>
        <Col>
          <Table
            key="3"
            tableId="3"
            userId={userId}
          />
        </Col>
      </Row>
    </Container>
  );
}

export default Cafeteria;
