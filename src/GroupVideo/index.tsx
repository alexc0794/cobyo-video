import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Video from './Video';
import VideoSettings from './VideoSettings';
import  { RTCType } from '../AgoraRTC';
import { UserInSeatType, TableType } from '../types';
import { getOpposingRowSeats, getSameRowSeats } from '../seatNumberHelpers';
import './index.css';

export type GroupVideoUsersType = {
  user: UserInSeatType | null,
  frontUser: UserInSeatType | null,
  frontLeftUser: UserInSeatType | null,
  frontRightUser: UserInSeatType | null,
  leftUser: UserInSeatType | null,
  rightUser: UserInSeatType | null,
}

export type GroupVideoPropTypes = {
  userId: string,
  table: TableType,
  rtc: RTCType,
};

function GroupVideo({
  userId,
  table,
  rtc,
}: GroupVideoPropTypes) {
  type Volume = {
    level: number,
    userId: string
  };
  const VIDEO_SETTINGS_HEIGHT_PX = 120;

  const [groupVideoDimensions, setGroupVideoDimensions] = useState<Array<number>>([
    window.innerWidth, window.innerHeight - VIDEO_SETTINGS_HEIGHT_PX
  ]);

  useEffect(() => {
    function onResize() {
      const videoElements = document.getElementsByClassName("video");
      Array.prototype.forEach.call(videoElements, function(videoElement) {
        setGroupVideoDimensions([
          window.innerWidth, window.innerHeight - VIDEO_SETTINGS_HEIGHT_PX
        ]);
      });
    }
    onResize();
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const [volumes, setVolumes] = useState<Array<Volume>>([]);
  useEffect(() => {
    rtc.client.enableAudioVolumeIndicator();
    rtc.client.on("volume-indicator", (volumes: Array<object>) => {
      setVolumes(volumes.map((volume: any) => ({
        level: volume.level || 0,
        userId: volume.uid.toString()
      })));
    });
    return () => {
      rtc.client.removeAllListeners("volume-indicator");
    };
  }, [rtc.client]);

  const [rows, setRows] = useState<Array<Array<UserInSeatType|null>>>([]);
  useEffect(() => {
    const rowSize = table.seats.length / 2 > 3 ? 5 : 3;
    const seat = table.seats.findIndex(seat => seat && seat.userId === userId);
    let opposingRowSeats = getOpposingRowSeats(seat, table.seats.length, rowSize);
    let sameRowSeats = getSameRowSeats(seat, table.seats.length, rowSize);
    function removeNullsOnEnd(seats: Array<number|null>): Array<number|null> {
      const firstNonNullSeat = seats.findIndex(seat => seat !== null);
      const lastNonNullSeat = seats.length - 1 - seats.slice().reverse().findIndex(seat => seat !== null);
      return seats.slice(firstNonNullSeat, lastNonNullSeat + 1);
    }
    opposingRowSeats = removeNullsOnEnd(opposingRowSeats);
    sameRowSeats = removeNullsOnEnd(sameRowSeats);
    setRows([
      opposingRowSeats.map(seat => seat !== null ? table.seats[seat] : null),
      sameRowSeats.map(seat => seat !== null ? table.seats[seat] : null),
    ]);
  }, [userId, table.seats]);

  const sortedVolumes = volumes.sort((a, b) => b.level - a.level);
  const userSpeaking: string|null = (
    sortedVolumes.length > 0 && sortedVolumes[0].level > .4
  ) ? sortedVolumes[0].userId : null;

  const [, groupVideoHeight] = groupVideoDimensions;

  return (
    <Container fluid className="group-video">
      {rows.map((seats, i) => (
        <Row
          key={`group-video-row-${i}`}
          style={{
            height: `${groupVideoHeight/2}px`
          }}
        >
          {seats.map((seat, i) => (
            <Col key={i}>
              <Video
                placement={i.toString()}
                user={seat}
                size={rows.length > 3 ? "sm" : "md"}
                speaking={!!seat && seat.userId === userSpeaking}
              />
            </Col>
          ))}
        </Row>
      ))}
      <Row>
        <VideoSettings tableId={table.tableId} userId={userId} rtc={rtc} />
      </Row>
    </Container>
  );
}

export default GroupVideo;
