import React, { memo } from 'react';
import { useSelector } from 'react-redux';
import { selectStorefront } from '../redux/storefrontSelectors';
import { selectTableById } from '../redux/tablesSelectors';
import { VideoUserType } from '../VideoHangout/types';
import { RTCType } from '../AgoraRTC';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import RemoteVideo from '../Video/RemoteVideo';
import LocalVideo from '../Video/LocalVideo';
import { VideoPlaceholder } from '../Video';
import { useWindowDimensions } from '../hooks';
import { getTableGrid } from './helpers';
import { TableType, SeatType } from '../types';
import cx from 'classnames';
import './index.css';

const VIDEO_SETTINGS_HEIGHT_PX = 120;
const TABLE_HEIGHT_PX = 0;

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
  const [, windowHeight] = useWindowDimensions();
  const groupVideoHeight = windowHeight - VIDEO_SETTINGS_HEIGHT_PX - TABLE_HEIGHT_PX;
  const storefront = useSelector(selectStorefront);
  const table: TableType = useSelector(selectTableById(tableId));
  const rows: Array<any> = getTableGrid(table);

  return (
    <Container fluid className={cx('video-table', {
      'club-mode-lighter': storefront === 'CLUB',
    })}>
      {rows.map((seats, i) => (
        <Row key={`video-table-row-${i}`} style={{height: `${groupVideoHeight / rows.length}px`}}>
          {seats.map((seat: SeatType|null, i: number) => (
            <Col key={i}>
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
            </Col>
          ))}
        </Row>
      ))}
    </Container>
  );
}

export default memo(VideoTable);
