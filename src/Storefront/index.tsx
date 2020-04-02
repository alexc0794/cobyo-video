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

type PropTypes = {
  userId: string|null,
  tableIds: Array<string>
}

function Storefront({ userId, tableIds }: PropTypes) {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchAndUpdateTables(tableIds));
  }, [dispatch, tableIds]);

  useInterval(() => {
    dispatch(fetchAndUpdateTables(tableIds));
  }, REFRESH_TABLES_INTERVAL_MS);

  return (
    <Container fluid className="cafeteria">
      <Row>
        <Col><Table key="1" tableId={tableIds[0]} userId={userId} /></Col>
        <Col><Table key="2" tableId={tableIds[1]} userId={userId} /></Col>
      </Row>
      <Row/>
      <Row>
        <Col lg={5} className="dance-floor"></Col>
        <Col lg={1} />
        <Col lg={3}><Table key="3" tableId={tableIds[2]} userId={userId} /></Col>
        <Col lg={3}><Table key="4" tableId={tableIds[3]} userId={userId} /></Col>
      </Row>
      <Row/>
      <Row>
        <Col><Table key="5" tableId={tableIds[4]} userId={userId} /></Col>
        <Col><Table key="6" tableId={tableIds[5]} userId={userId} /></Col>
      </Row>
    </Container>
  );
}

export default Storefront;
