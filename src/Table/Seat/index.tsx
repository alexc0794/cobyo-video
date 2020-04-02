import React from 'react';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChair, faUser } from '@fortawesome/free-solid-svg-icons';
import { UserInSeatType } from '../../types';
import { timeSince } from '../../helpers';
import './index.css';

type PropTypes = {
  userId: string|null,
  seat: UserInSeatType,
  seatNumber: number,
  onClick: (seatNumber: number) => void
}

function Seat({
  userId,
  seat,
  seatNumber,
  onClick,
}: PropTypes) {

  return (
    <div className="seat">
      {(() => {
        if (!seat) {
          return (
            <div className="seat-open" onClick={() => onClick(seatNumber)}>
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
              <div className="seat-you" onClick={() => onClick(seatNumber)}>
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
            <div className="seat-occupied">
              {iconElement}
            </div>
          </OverlayTrigger>
        );
      })()}
    </div>
  );
}

export default Seat;
