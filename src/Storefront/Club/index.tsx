import React, { memo } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from '../../Table';

type PropTypes = {
  userId: string|null,
  tableIdGrid: Array<Array<string>>,
}

function Club({
  userId,
  tableIdGrid,
}: PropTypes) {
  const firstRow = tableIdGrid[0] || [];
  const secondRow = tableIdGrid[1] || [];
  const thirdRow = tableIdGrid[2] || [];

  return (
    <Container fluid className="storefront club">
      <Row>
        {firstRow.map((tableId: string) => (
          <Col key={tableId}><Table tableId={tableId} userId={userId} /></Col>
        ))}
      </Row>
      <Row />
      <Row>
        {secondRow.length > 0 && (
          <>
            <Col lg={1} />
            <Col lg={4}>
              <Table tableId={secondRow[0]} userId={userId}/>
            </Col>
            <Col lg={1} />
          </>
        )}
        {secondRow.slice(1).map((tableId: string) => (
          <Col key={tableId} lg={3}><Table tableId={tableId} userId={userId} /></Col>
        ))}
      </Row>
      <Row />
      <Row>
        {thirdRow.map((tableId: string) => (
          <Col key={tableId}><Table tableId={tableId} userId={userId} /></Col>
        ))}
      </Row>
    </Container>
  );
}

export default memo(Club);
