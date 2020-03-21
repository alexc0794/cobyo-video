import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from './Table';
import { UserInSeatType, TableType } from '../types';
import { getSeatNumber } from '../seatNumberHelpers';
import './index.css';

function getGroupVideoUsers(userId: string, table: TableType): GroupVideoUsersType {
  const seat: number = table.seats.findIndex(seat => seat && seat.userId === userId);
  const numSeats = table.seats.length;
  return {
    user: table.seats[seat],
    frontLeftUser: table.seats[getSeatNumber("frontLeft", seat, numSeats)],
    frontUser: table.seats[getSeatNumber("front", seat, numSeats)],
    frontRightUser: table.seats[getSeatNumber("frontRight", seat, numSeats)],
    leftUser: table.seats[getSeatNumber("left", seat, numSeats)],
    rightUser: table.seats[getSeatNumber("right", seat, numSeats)]
  };
}

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
};

function GroupVideo({
  userId,
  table,
}: GroupVideoPropTypes) {
  const { user, frontLeftUser, frontUser, frontRightUser, leftUser, rightUser } = getGroupVideoUsers(userId, table);
  return (
    <Container fluid className="group-video">
      <Row>
        <Col><Video placement="frontLeftUser" user={frontLeftUser} /></Col>
        <Col><Video placement="frontUser" user={frontUser} /></Col>
        <Col><Video placement="frontRightUser" user={frontRightUser} /></Col>
      </Row>
      <Row>
        <Table tableId={table.tableId} />
      </Row>
      <Row>
        <Col><Video placement="leftUser" user={leftUser} /></Col>
        <Col><Video placement="user" user={user} /></Col>
        <Col><Video placement="rightUser" user={rightUser} /></Col>
      </Row>
    </Container>
  );
}

type VideoPropTypes = {
  placement: string,
  user: UserInSeatType | null
}

function Video({ placement, user }: VideoPropTypes) {
  if (!user) {
    return <Placeholder placement={placement} />;
  }

  return (
    <div id={placement}>
      <div
        id={`video-${user.userId}`}
        className="video"
      />
    </div>
  );
}

type PlaceholderPropTypes = {
  placement: string
};

function Placeholder({ placement }: PlaceholderPropTypes) {
  return (
    <div id={placement}>
      <div className="video video-placeholder" />
    </div>
  );
}

export default GroupVideo;
