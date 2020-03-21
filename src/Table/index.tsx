import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAndUpdateTable, joinAndUpdateTable } from '../redux/tablesActions';
import { selectTableById } from '../redux/tablesSelectors';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { UserInSeatType } from '../types';
import { timeSince } from '../helpers';
import './index.css';

type PropTypes = {
  tableId: string,
  userId: string|null,
};

function Table({
  tableId,
  userId,
}: PropTypes) {
  const dispatch = useDispatch();
  const table = useSelector(selectTableById(tableId));

  useEffect(() => {
    dispatch(fetchAndUpdateTable(tableId))
  }, [tableId, dispatch]);

  async function handlePickSeat(seat: number) {
    if (!userId) { return; }
    dispatch(joinAndUpdateTable(tableId, seat, userId));
  }

  if (!table) {
    return null;
  }

  const { seats } = table;

  return (
    <div className="Table">
      <Container fluid>
        <TableRow
          userId={userId}
          seats={seats}
          startIndex={0}
          endIndex={Math.ceil(seats.length / 2)}
          onClick={handlePickSeat}
        />
        <Row bsPrefix="table-row" />
        <TableRow
          userId={userId}
          seats={seats}
          startIndex={Math.ceil(seats.length / 2)}
          endIndex={seats.length}
          onClick={handlePickSeat}
        />
      </Container>
    </div>
  );
}

type TableRowPropTypes = {
  userId: string|null,
  seats: Array<UserInSeatType>,
  startIndex: number,
  endIndex: number,
  onClick: (seatNumber: number) => void
};

function TableRow({
  userId,
  seats,
  startIndex,
  endIndex,
  onClick
}: TableRowPropTypes) {
  return (
    <Row noGutters>
      {seats.slice(startIndex, endIndex).map((seat: UserInSeatType, i: number) => {
        const seatNumber = startIndex + i;
        return (
          <Col key={seat ? `seat${seatNumber}-user${seat.userId}` : `seat${seatNumber}`}>
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
                    <span><Button variant="warning" onClick={() => onClick(seatNumber)}>You</Button></span>
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

export default Table;
