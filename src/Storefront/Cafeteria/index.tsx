import React, { memo } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from '../../Table';  // Converting to absolute is causing name collision with a node module

type PropTypes = {
  userId: string|null,
  tableIdGrid: Array<Array<string>>,
}

function Cafeteria({
  userId,
  tableIdGrid,
}: PropTypes) {
  const grid = [...tableIdGrid].map((e, i) => i < tableIdGrid.length - 1 ? [e, null] : [e]).reduce((a, b) => a.concat(b), [])

  return (
    <Container fluid className="storefront cafeteria">
      {grid.map((tableIdRow: Array<string>|null, rowI: number) => tableIdRow ? (
        <Row key={rowI}>
          {tableIdRow.map(tableId => (
            <Col key={tableId} lg={12 / tableIdRow.length}>
              <Table tableId={tableId} userId={userId} />
            </Col>
          ))}
        </Row>
      ) : (
        <Row key={rowI} />
      ))}
    </Container>
  );
}

export default memo(Cafeteria);
