import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAndUpdateTable, joinAndUpdateTable, leaveAndUpdateTable } from '../redux/tablesActions';
import { selectTableById, selectJoinedTableId, selectJoinedTableSeat } from '../redux/tablesSelectors';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChair, faUser } from '@fortawesome/free-solid-svg-icons'

import { UserInSeatType } from '../types';
import { timeSince } from '../helpers';
import { useInterval } from '../hooks';
import cx from 'classnames';
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
  const joinedTableId = useSelector(selectJoinedTableId);
  const isUserJoined = joinedTableId === tableId;
  const isUserJoinedAnother = joinedTableId !== null && !isUserJoined;
  const seat = useSelector(selectJoinedTableSeat(userId || ""));

  useEffect(() => {
    dispatch(fetchAndUpdateTable(tableId))
  }, [tableId, dispatch]);

  useInterval(() => {
    if (!userId || seat < 0 || !isUserJoined) { return; }
    dispatch(joinAndUpdateTable(tableId, seat, userId));
  }, 60000);

  async function handlePickSeat(pickedSeat: number) {
    if (!userId) { return; }

    const isSwitchingSeat = isUserJoined && pickedSeat !== seat;
    if (isSwitchingSeat) {
      // TODO:
      // await dispatch(leaveAndUpdateTable(tableId, userId));
      alert('Not yet implemented. Leave table first, then join.');
      return;
    }

    dispatch(joinAndUpdateTable(tableId, pickedSeat, userId));
  }

  function handleLeaveTable() {
    if (!userId) { return; }
    dispatch(leaveAndUpdateTable(tableId, userId));
  }

  if (!table) {
    return null;
  }

  const { seats } = table;
  return (
    <div className={cx("table", {
      "table-joined": isUserJoined,
      "table-joined-another": isUserJoinedAnother,
    })}>
      <Container fluid>
        <TableRow
          userId={userId}
          seats={seats}
          startIndex={0}
          endIndex={Math.ceil(seats.length / 2)}
          onClick={handlePickSeat}
        />
        <Row bsPrefix="table-row">
          {isUserJoined && (
            <Button variant="primary" onClick={handleLeaveTable}>Leave</Button>
          )}
        </Row>
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
            <div className="table-chair">
              {(() => {
                if (!seat) {
                  return (
                    <div className="table-chair-open" onClick={() => onClick(seatNumber)}>
                      <FontAwesomeIcon icon={faChair} />
                    </div>
                  );
                }

                if (!!seat && seat.userId === userId) {
                  return (
                    <OverlayTrigger
                      placement="bottom"
                      overlay={
                        <Tooltip id={`tooltip-${userId}`}>
                          {`You joined ${timeSince(new Date(seat.satDownAt))} ago`}
                        </Tooltip>
                      }
                    >
                      <div className="table-chair-you" onClick={() => onClick(seatNumber)}>
                        <FontAwesomeIcon icon={faUser} />
                      </div>
                    </OverlayTrigger>
                  );
                }
                return (
                  <OverlayTrigger
                    placement="bottom"
                    overlay={
                      <Tooltip id={`tooltip-${userId}`}>
                        {`Joined ${timeSince(new Date(seat.satDownAt))} ago`}
                      </Tooltip>
                    }
                  >
                    <div className="table-chair-occupied">
                      <FontAwesomeIcon icon={faUser} />
                    </div>
                  </OverlayTrigger>
                );
              })()}
            </div>
          </Col>
        );
      })}
    </Row>
  );
}

export default Table;
