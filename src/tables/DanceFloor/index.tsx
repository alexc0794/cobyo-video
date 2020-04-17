import React, { Fragment } from 'react';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { UserInSeatType } from 'src/types';
import { timeSince } from 'src/helpers';
import './index.css';

type PropTypes = {
  tableId: string,
  userId: string|null,
  seats: Array<UserInSeatType>,
  onEnter: (seatNumber: number|null) => void,
};

function DanceFloor({
  seats,
  onEnter,
  userId,
}: PropTypes) {
  function handleClick() {
    onEnter(null);
  }
  return (
    <div role="button" className="DanceFloor" onClick={handleClick}>
      {seats.map((seat, i) => (
        <Fragment key={seat.seatNumber}>
        {(() => {
          if (!seat.userId || !seat.satDownAt) {
            return (
              <div className="DanceFloor-seat DanceFloor-seat--empty" />
            );
          }
          const iconElement = seat.profilePictureUrl ? (
            <img src={seat.profilePictureUrl} alt={seat.firstName} />
          ) : (
            <FontAwesomeIcon icon={faUser} />
          );
          if (!!seat.userId && !!seat.satDownAt && seat.userId === userId) {
            return (
              <OverlayTrigger
                placement="bottom"
                overlay={
                  <Tooltip id={`tooltip-${userId}`}>
                    {`You joined ${timeSince(new Date(seat.satDownAt))} ago`}
                  </Tooltip>
                }
              >
                <div className="DanceFloor-seat DanceFloor-seat--you">
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
              <div className="DanceFloor-seat DanceFloor-seat--occupied">
                {iconElement}
              </div>
            </OverlayTrigger>
          );
        })()}
      </Fragment>
      ))}
    </div>
  );
}

export default DanceFloor;
