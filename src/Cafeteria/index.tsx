import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchAndUpdateTables } from '../redux/tablesActions';
import { useInterval } from '../hooks';
import { REFRESH_TABLES_INTERVAL_MS } from '../config';
import Table from '../Table';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './index.css';

const TABLE_IDS = ['1','2','3','4','5'];

type PropTypes = {
  userId: string|null,
}

function Cafeteria({ userId }: PropTypes) {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchAndUpdateTables(TABLE_IDS));
  }, [dispatch]);

  useInterval(() => {
    dispatch(fetchAndUpdateTables(TABLE_IDS));
  }, REFRESH_TABLES_INTERVAL_MS);

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
