import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './index.css';

export type User = {
  userId: string,
}

export type SeatViewGroupVideoPropTypes = {
  user: User,
  frontUser: User | null,
  frontLeftUser: User | null,
  frontRightUser: User | null,
  leftUser: User | null,
  rightUser: User | null,
}

function SeatViewGroupVideo({
  user,
  frontUser,
  frontLeftUser,
  frontRightUser,
  leftUser,
  rightUser,
}: SeatViewGroupVideoPropTypes) {
  return (
    <Container fluid>
      <Row>
        <SeatViewVideo placement="frontLeftUser" user={frontLeftUser} />
        <SeatViewVideo placement="frontUser" user={frontUser} />
        <SeatViewVideo placement="frontRightUser" user={frontRightUser} />
      </Row>
      <Row>
        <SeatViewVideo placement="leftUser" user={leftUser} />
        <SeatViewVideo placement="user" user={user} />
        <SeatViewVideo placement="rightUser" user={rightUser} />
      </Row>
    </Container>
  );
}

type SeatViewVideoPropTypes = {
  placement: string,
  user: User | null
}

function SeatViewVideo({ placement, user }: SeatViewVideoPropTypes) {
  if (!user) {
    return <SeatViewPlaceholder placement={placement} />;
  }

  return (
    <Col id={placement}>
      <div
        id={`video-${user.userId}`}
        className="video"
      />
      <p>{user.userId}</p>
    </Col>
  );
}

type SeatViewPlaceholderPropTypes = {
  placement: string
};

function SeatViewPlaceholder({ placement }: SeatViewPlaceholderPropTypes) {
  return (
    <Col id={placement}>
      <div className="video video-placeholder" />
    </Col>
  );
}

export default SeatViewGroupVideo;
