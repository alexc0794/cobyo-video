import React, { memo, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectStorefront } from '../redux/storefrontSelectors';
import { selectTableById } from '../redux/tablesSelectors';
import { VideoUserType } from '../VideoHangout/types';
import { RTCType } from '../AgoraRTC';
import RemoteVideo from '../Video/RemoteVideo';
import LocalVideo from '../Video/LocalVideo';
import { VideoPlaceholder } from '../Video';
import { TableType } from '../types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDollarSign } from '@fortawesome/free-solid-svg-icons';
import CocktailImage1 from '../images/cocktail.png';
import CocktailImage2 from '../images/cocktail2.png';
import CocktailImage3 from '../images/cocktail3.png';
import cx from 'classnames';
import './index.css';

const DEFAULT_ROW = 3;

type PropTypes = {
  tableId: string,
  userId: string,
  rtc: RTCType,
  remoteUsers: Array<VideoUserType>,
};

function VideoTable({
  tableId,
  userId,
  rtc,
  remoteUsers,
}: PropTypes) {
  const storefront = useSelector(selectStorefront);
  const table: TableType = useSelector(selectTableById(tableId));
  const {seats} = table;
  let columns = seats.length > 6 ? seats.length - 2*2 : seats.length - 2*1;
  columns = table.shape ==='RECTANGULAR' ? seats.length / 2 : columns;
  const rows = table.shape ==='RECTANGULAR' ? DEFAULT_ROW +1 : DEFAULT_ROW;
  const styleVar = {'--columns': columns,'--rows': rows} as React.CSSProperties;
  const [boughtDrink, setBoughtDrink] = useState<number|null>(null);
  const drinks =[CocktailImage1, CocktailImage2, CocktailImage3];

  return (
    <div
      style={styleVar}
      className={cx('VideoTableContainer', {'VideoTableContainer--clubMode':storefront === 'CLUB'})}
    >
      {table.shape !== 'DANCE_FLOOR' && (
        <div className={`VideoTable VideoTable--${table.shape}`}>
          <div className="VideoTable-commonArea" />
          {seats.map((seat, i) => (
            <div className="VideoTable-drink" key={i}>
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
      {seats.map((seat, i) => (
        <div className="VideoTable-seat" key={i}>
          {(() => {
            if (!seat) {
              return null;
            }
            if (seat && seat.userId === userId) {
              return (
                <LocalVideo
                  userId={userId}
                  tableId={tableId}
                  audioMuted={false} // TODO: Implement mute icon for own video
                  rtc={rtc}
                />
              );
            }
            const remoteUser = remoteUsers.find(user => seat && user.userId === seat.userId) || null;
            if (remoteUser) {
              return <RemoteVideo {...remoteUser} />;
            }
            return <VideoPlaceholder />
          })()}
        </div>
      ))}
    </div>
  );
}

export default memo(VideoTable);
