import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectTableById } from '../redux/tablesSelectors';
import { VideoUserType } from '../VideoHangout/types';
import { RTCType } from '../AgoraRTC';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { RemoteVideo, LocalVideo, VideoPlaceholder } from '../Video';
import { getTableRows } from './helpers';
import './index.css';

const VIDEO_SETTINGS_HEIGHT_PX = 120;
const TABLE_HEIGHT_PX = 0;

function calculateVideoHeight(windowHeight: number): number {
  return windowHeight - VIDEO_SETTINGS_HEIGHT_PX - TABLE_HEIGHT_PX;
}

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
  const [groupVideoDimensions, setGroupVideoDimensions] = useState<Array<number>>([
    window.innerWidth, calculateVideoHeight(window.innerHeight)
  ]);

  useEffect(() => {
    function onResize() {
      const videoElements = document.getElementsByClassName("video");
      Array.prototype.forEach.call(videoElements, function(videoElement) {
        setGroupVideoDimensions([
          window.innerWidth, calculateVideoHeight(window.innerHeight)
        ]);
      });
    }
    onResize();
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const table = useSelector(selectTableById(tableId));
  const rows: Array<any> = getTableRows(table, userId);
  const [, groupVideoHeight] = groupVideoDimensions;
  return (
    <Container fluid className="video-table">
      {rows.map((seats, i) => (
        <Row key={`video-table-row-${i}`} style={{height: `${groupVideoHeight / 2}px`}}>
          {seats.map((seat: any, i: number) => (
            <Col key={i}>
              {(() => {
                if (!seat) {
                  return <VideoPlaceholder />;
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

export default VideoTable;
