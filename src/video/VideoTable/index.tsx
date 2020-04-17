import React, { memo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectStorefront } from 'storefront/selectors';
import { selectTableById } from 'tables/selectors';
import { selectMenuItems } from 'menu/selectors';
import { VideoUserType } from 'video/VideoHangout/types';
import { RTC } from 'agora';
import RemoteVideo from 'video/Video/RemoteVideo';
import LocalVideo from 'video/Video/LocalVideo';
import { VideoPlaceholder } from 'video/Video';
import { TableType } from 'types';
import { joinAndUpdateTable } from 'tables/actions';
import Menu from 'menu/Menu';
import UserSpace from 'video/VideoTable/UserSpace';
import cx from 'classnames';
import './index.css';

const DEFAULT_ROW = 3;
const DEFAULT_COLUMN = 6;

type PropTypes = {
  tableId: string,
  userId: string,
  rtc: RTC,
  remoteUsers: Array<VideoUserType>,
  ws: WebSocket|undefined,
  useBlinkingBackground?: boolean,
  useBlinkingTile?: boolean,
};

function VideoTable({
  tableId,
  userId,
  rtc,
  remoteUsers,
  ws,
  useBlinkingBackground,
  useBlinkingTile = true,
}: PropTypes) {
  const storefront = useSelector(selectStorefront);
  const dispatch = useDispatch();
  const menuItems = useSelector(selectMenuItems);
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
  const [isMenuOpen, toggleMenuOpen] = useState<boolean>(false);

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
      {useBlinkingBackground && <div className="VideoTable-lightingEffects" />}
      {table.shape !== 'DANCE_FLOOR' && (
        <>
          <div className={`VideoTable VideoTable--${table.shape}`}>
            <div className="VideoTable-commonArea" />
            {seats.map(seat => (
              <div className="VideoTable-userSpace" key={seat.seatNumber}>
                {seat && seat.userId && <UserSpace userId={seat.userId} />}
              </div>
            ))}
          </div>
        </>
      )}
      <div className="VideoTable-menu">
        {isMenuOpen && ws && <Menu tableId={tableId} storefront={storefront} userId={userId} onRequestClose={()=>{toggleMenuOpen(false)}} ws={ws} />}
      </div>
      {seats.map(seat => (
        <div
          className={`VideoTable-seat ${useBlinkingTile &&  table.shape === 'DANCE_FLOOR' ? 'VideoTable-seat--blinking' :''} VideoTable-seat--${Math.floor(Math.random()*9)}`}
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
                <>
                  <LocalVideo
                    userId={userId}
                    tableId={tableId}
                    audioMuted={false} // TODO: Implement mute icon for own video
                    rtc={rtc}
                  />
                  {menuItems.length > 0 && <button className="VideoTable-menuButton" onClick={()=>toggleMenuOpen(true)}>Menu</button>}
                </>
              );
            }
            const remoteUser = remoteUsers.find(user => user.userId === seat.userId) || null;
            if (remoteUser) {
              return <RemoteVideo {...remoteUser} />;
            }

            return table.shape === 'DANCE_FLOOR' ? null : <VideoPlaceholder />;
          })()}
          {seat && seat.userId && table.shape === 'DANCE_FLOOR' && (
            <div className="VideoTable-seat-danceFloorSpace">
              {<UserSpace userId={seat.userId} />}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default memo(VideoTable);
