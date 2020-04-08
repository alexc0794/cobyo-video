import React, { memo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectStorefront } from '../redux/storefrontSelectors';
import { selectTableById } from '../redux/tablesSelectors';
import { VideoUserType } from '../VideoHangout/types';
import { RTC } from '../AgoraRTC';
import RemoteVideo from '../Video/RemoteVideo';
import LocalVideo from '../Video/LocalVideo';
import { VideoPlaceholder } from '../Video';
import { TableType } from '../types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDollarSign } from '@fortawesome/free-solid-svg-icons';
import CocktailImage1 from '../images/cocktail.png';
import CocktailImage2 from '../images/cocktail2.png';
import CocktailImage3 from '../images/cocktail3.png';
import { joinAndUpdateTable } from '../redux/tablesActions';
import cx from 'classnames';
import './index.css';

const DEFAULT_ROW = 3;
const DEFAULT_COLUMN = 6;

type PropTypes = {
  tableId: string,
  userId: string,
  rtc: RTC,
  remoteUsers: Array<VideoUserType>,
};

function VideoTable({
  tableId,
  userId,
  rtc,
  remoteUsers,
}: PropTypes) {
  const storefront = useSelector(selectStorefront);
  const dispatch = useDispatch();
  const table: TableType = useSelector(selectTableById(tableId));
  const { seats } = table;
  let columns;
  switch(table.shape) {
    case 'RECTANGULAR':
      columns = seats.length / 2;
      break;
    case 'U_UP':
    case 'U_DOWN':
      columns = seats.length > 6 ? seats.length - 2*2 : seats.length - 2*1;
      break;
    default:
      columns = DEFAULT_COLUMN;
  }
  const rows = (table.shape ==='RECTANGULAR' || table.shape === 'DANCE_FLOOR') ? DEFAULT_ROW + 1 : DEFAULT_ROW;
  const styleVar = {'--columns': columns,'--rows': rows} as React.CSSProperties;
  const [boughtDrink, setBoughtDrink] = useState<number|null>(null);
  const drinks =[CocktailImage1, CocktailImage2, CocktailImage3];

  async function handlePickSeat(pickedSeatNumber: number|null) {
    if (!userId) { return; }
    const isSeatOccupied = pickedSeatNumber && seats[pickedSeatNumber].userId !== null;
    if (isSeatOccupied) {
      return;
    }
    dispatch(joinAndUpdateTable(tableId, pickedSeatNumber, userId));
  }

  return (
    <div
      style={styleVar}
      className={cx('VideoTableContainer', {'VideoTableContainer--clubMode':storefront === 'CLUB'})}
    >
      {table.shape !== 'DANCE_FLOOR' && (
        <div className={`VideoTable VideoTable--${table.shape}`}>
          <div className="VideoTable-commonArea" />
          {seats.map(seat => (
            <div className="VideoTable-drink" key={seat.seatNumber}>
              {(() => {
                if (seat && seat.userId === userId) {
                  if (boughtDrink === null) {
                    return (
                      <button className="VideoTable-buyButton" onClick={()=>setBoughtDrink(Math.floor(Math.random()*3))}>
                        <FontAwesomeIcon icon={faDollarSign} />
                      </button>
                    )
                  } else {
                    return (<img src={drinks[boughtDrink]} alt="cocktail" />);
                  }
                }
              })()}
            </div>
          ))}
        </div>
      )}
      {seats.map(seat => (
        <div
          className="VideoTable-seat"
          key={seat.seatNumber}
          onClick={()=>handlePickSeat(seat.seatNumber)}
          role="button"
        >
          {(() => {
            if (!seat) {
              return null;
            }
            if (seat.userId === userId) {
              return (
                <LocalVideo
                  userId={userId}
                  tableId={tableId}
                  audioMuted={false} // TODO: Implement mute icon for own video
                  rtc={rtc}
                />
              );
            }
            const remoteUser = remoteUsers.find(user => user.userId === seat.userId) || null;
            if (remoteUser) {
              return <RemoteVideo {...remoteUser} />;
            }

            return table.shape === 'DANCE_FLOOR' ? null : <VideoPlaceholder />;
          })()}
        </div>
      ))}
    </div>
  );
}

export default memo(VideoTable);
