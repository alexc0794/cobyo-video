import React, { Fragment, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchAndUpdateTables } from '../redux/tablesActions';
import { useInterval } from '../hooks';
import { REFRESH_TABLES_INTERVAL_MS } from '../config';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from '../Table';
import './index.css';

type PropTypes = {
  userId: string|null,
  storefront: string,
  status: string,
  tableIdGrid: Array<Array<string>>,
}

function Storefront({ userId, storefront, tableIdGrid }: PropTypes) {
  const empty: Array<string> = [];
  const tableIds = empty.concat.apply([], tableIdGrid);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchAndUpdateTables(tableIds));
  }, [dispatch, tableIds]);

  useInterval(() => {
    dispatch(fetchAndUpdateTables(tableIds));
  }, REFRESH_TABLES_INTERVAL_MS);

  return (
    <Container fluid className="storefront">
      {tableIdGrid.map((tableIdRow: Array<string>, rowI: number) => (
        <Fragment key={rowI}>
          <Row>
            {tableIdRow.map(tableId => (
              <Col key={tableId}>
                <Table tableId={tableId} userId={userId} />
              </Col>
            ))}
          </Row>
          <Row />
        </Fragment>
      ))}
    </Container>
  )
}

export default Storefront;
