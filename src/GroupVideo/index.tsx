import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from './Table';
import './index.css';

export type User = {
  userId: string,
}

export type GroupVideoUsers = {
  user: User,
  frontUser: User | null,
  frontLeftUser: User | null,
  frontRightUser: User | null,
  leftUser: User | null,
  rightUser: User | null,
}

export type GroupVideoPropTypes = GroupVideoUsers & {
  tableId: string,
};

function GroupVideo({
  user,
  frontUser,
  frontLeftUser,
  frontRightUser,
  leftUser,
  rightUser,
  tableId,
}: GroupVideoPropTypes) {
  return (
    <Container fluid className="group-video">
      <Row>
        <Col><Video placement="frontLeftUser" user={frontLeftUser} /></Col>
        <Col><Video placement="frontUser" user={frontUser} /></Col>
        <Col><Video placement="frontRightUser" user={frontRightUser} /></Col>
      </Row>
      <Row>
        <Table tableId={tableId} />
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
  user: User | null
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
