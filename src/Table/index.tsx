import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAndUpdateTable, joinAndUpdateTable, leaveAndUpdateTable } from '../redux/tablesActions';
import { selectTableById, selectJoinedTableId, selectJoinedTableSeat } from '../redux/tablesSelectors';
import { selectUsersByIds } from '../redux/usersSelectors';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChair, faUser } from '@fortawesome/free-solid-svg-icons'
import { SeatType, UserInSeatType } from '../types';
import { timeSince } from '../helpers';
import { useInterval } from '../hooks';
import cx from 'classnames';
import './index.css';

type PropTypes = {
  tableId: string,
  userId: string|null,
};

function Table({ tableId, userId }: PropTypes) {
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
    dispatch(fetchAndUpdateTable(tableId));
  }, 20000);

  async function handlePickSeat(pickedSeat: number) {
    if (!userId) { return; }

    const isSwitchingSeat = isUserJoined && pickedSeat !== seat;
    if (isSwitchingSeat) {
      alert('Not yet implemented. Leave table first, then join.');
      return;
    }
    dispatch(joinAndUpdateTable(tableId, pickedSeat, userId));
  }

  function handleLeaveTable() {
    if (!userId) { return; }
    dispatch(leaveAndUpdateTable(tableId, userId));
  }

  const seats = table ? table.seats : [];
  const tableUserIds: Array<string|null> = seats.map((seat: SeatType) => seat ? seat.userId : null);
  const users = useSelector(selectUsersByIds(tableUserIds));
  const userInSeats: Array<UserInSeatType> = seats.map((seat: SeatType, i: number) => seat ? ({
    ...seat,
    ...users[i]
  }) : null);

  return (
    <div className={cx("table", {
      "table-joined": isUserJoined,
      "table-joined-another": isUserJoinedAnother,
    })}>
      <Container fluid>
        <TableRow
          userId={userId}
          userInSeats={userInSeats}
          startIndex={0}
          endIndex={Math.ceil(userInSeats.length / 2)}
          onClick={handlePickSeat}
        />
        <Row bsPrefix="table-row">
          {isUserJoined && (
            <Button variant="primary" onClick={handleLeaveTable}>Leave</Button>
          )}
        </Row>
        <TableRow
          userId={userId}
          userInSeats={userInSeats}
          startIndex={Math.ceil(userInSeats.length / 2)}
          endIndex={userInSeats.length}
          onClick={handlePickSeat}
        />
      </Container>
    </div>
  );
}

type TableRowPropTypes = {
  userId: string|null,
  userInSeats: Array<UserInSeatType>,
  startIndex: number,
  endIndex: number,
  onClick: (seatNumber: number) => void
};

function TableRow({
  userId,
  userInSeats,
  startIndex,
  endIndex,
  onClick
}: TableRowPropTypes) {
  return (
    <Row noGutters>
      {userInSeats.slice(startIndex, endIndex).map((seat: UserInSeatType, i: number) => {
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

                const iconElement = seat && seat.profilePictureUrl ? (
                  <img src={seat.profilePictureUrl} alt={seat.firstName} />
                ) : (
                  <FontAwesomeIcon icon={faUser} />
                );

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
                        {iconElement}
                      </div>
                    </OverlayTrigger>
                  );
                }

                return (
                  <OverlayTrigger
                    placement="bottom"
                    overlay={
                      <Tooltip id={`tooltip-${seat.userId}`}>
                        {`${seat.firstName || `User ${seat.userId}`} joined ${timeSince(new Date(seat.satDownAt))} ago`}
                      </Tooltip>
                    }
                  >
                    <div className="table-chair-occupied">
                      {iconElement}
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
