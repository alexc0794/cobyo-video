import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import VideoSettings from './VideoSettings';
import  { RTCType } from '../AgoraRTC';
import { UserInSeatType, TableType } from '../types';
import { getOpposingRowSeats, getSameRowSeats } from '../seatNumberHelpers';
import cx from 'classnames';
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
      const lastNonNullSeat = seats.length - 1 - seats.reverse().findIndex(seat => seat !== null);
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
    sortedVolumes.length > 0 && sortedVolumes[0].level > 4
  ) ? sortedVolumes[0].userId : null;

  return (
    <Container fluid className="group-video">
      {rows.map((seats, i) => (
        <Row key={`group-video-row-${i}`}>
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

type VideoPropTypes = {
  placement: string,
  user: UserInSeatType | null,
  size: "md" | "sm",
  speaking: boolean,
};

function Video({ placement, user, size, speaking }: VideoPropTypes) {
  if (!user) {
    return <Placeholder placement={placement} size={size} />;
  }

  return (
    <div id={placement}>
      <div
        id={`video-${user.userId}`}
        className={cx("video", {
          "video-md": size === "md",
          "video-sm": size === "sm",
          "video-speaker": speaking
        })}
      />
    </div>
  );
}

type PlaceholderPropTypes = {
  placement: string,
  size: "md" | "sm",
};

function Placeholder({ placement, size }: PlaceholderPropTypes) {
  return (
    <div id={placement}>
      <div className={cx("video video-placeholder", {
        "video-md": size === "md",
        "video-sm": size === "sm",
      })} />
    </div>
  );
}

export default GroupVideo;
