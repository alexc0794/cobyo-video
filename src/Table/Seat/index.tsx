import React from 'react';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChair, faUser, faCouch } from '@fortawesome/free-solid-svg-icons';
import { UserInSeatType } from '../../types';
import { timeSince } from '../../helpers';
import './index.css';

type PropTypes = {
  userId: string|null,
  seat: UserInSeatType,
  seatNumber: number,
  onClick: (seatNumber: number) => void,
  storefront: string
}

function Seat({
  userId,
  seat,
  seatNumber,
  onClick,
  storefront
}: PropTypes) {

  return (
    <>
      {(() => {
        if (!seat.userId || !seat.satDownAt) {
          return (
            <button className="Seat Seat--open" onClick={() => onClick(seatNumber)}>
              {storefront === 'CLUB' ? (<FontAwesomeIcon icon={faCouch} />) : (<FontAwesomeIcon icon={faChair} />)}
            </button>
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
              <div className="Seat Seat--you" onClick={() => onClick(seatNumber)}>
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
            <div className="Seat Seat--occupied">
              {iconElement}
            </div>
          </OverlayTrigger>
        );
      })()}
    </>
  );
}

export default Seat;
