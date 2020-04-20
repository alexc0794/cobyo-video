import React, { memo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectStorefront } from '_storefront/selectors';
import { selectTableById } from '_tables/selectors';
import { selectMenuItems } from '_menu/selectors';
import { VideoUserType } from '_video/VideoHangout/types';
import { RTC } from 'agora';
import RemoteVideo from '_video/Video/RemoteVideo';
import LocalVideo from '_video/Video/LocalVideo';
import { VideoPlaceholder } from '_video/Video';
import { TableType } from 'types';
import { joinAndUpdateTable } from '_tables/actions';
import Menu from '_menu/Menu';
import UserSpace from '_video/VideoTable/UserSpace';
import cx from 'classnames';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import UserActionPopover from '_video/VideoTable/UserActionPopover'
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

type SelectedUserType = {
  [userId: string]: boolean,
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
  const [selectedUsers, toggleSelectUser] = useState<SelectedUserType>({[userId]: true});

  const handleSelectUser = (userId: string) => {
    if (selectedUsers[userId]) {
      toggleSelectUser({
        ...selectedUsers,
        [userId]: !selectedUsers[userId]
      })
    } else {
      toggleSelectUser({
        ...selectedUsers,
        [userId]: true
      })
    }
  };

  const handleBuyForUser = (toUserId:string|null) => {
    if (!toUserId) {
      return;
    }
    toggleSelectUser({
      [toUserId]: true
    });
    toggleMenuOpen(true);
  }

  const handleCloseMenu = () => {
    toggleMenuOpen(false);
    toggleSelectUser({
      [userId]: true
    })
  }

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
        {isMenuOpen && ws && (
          <Menu
            tableId={tableId}
            storefront={storefront}
            userId={userId}
            selectedUsers={selectedUsers}
            onSelectUser={handleSelectUser}
            onRequestClose={handleCloseMenu}
            ws={ws}
          />
        )}
      </div>
      {seats.map(seat => (
        <div
          className={`VideoTable-seat ${useBlinkingTile && table.shape === 'DANCE_FLOOR' ? 'VideoTable-seat--blinking' :''} VideoTable-seat--${Math.floor(Math.random()*9)}`}
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
              const popover = (
                <Popover id="VideoTable-popover">
                  <UserActionPopover
                    userId={seat.userId}
                    onClickBuy={handleBuyForUser}
                  />
                </Popover>
              );
              return (
                <OverlayTrigger trigger="click" placement="bottom" overlay={popover} rootClose >
                  <div className="VideoTable-seat-overlayWrapper">
                    <RemoteVideo {...remoteUser} />
                  </div>
                </OverlayTrigger>
              );
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
