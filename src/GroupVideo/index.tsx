import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './index.css';

export type User = {
  userId: string,
}

type PropTypes = {
    users: Array<User>
}

function GroupVideo({
  users
}: PropTypes) {

  function getUniqueKey(userId: string) {
    return `video-${userId}`;
  }

  return (
    <Container fluid>
      <Row>
        {users.map(user => (
          <Col key={getUniqueKey(user.userId)}>
            <div
              id={getUniqueKey(user.userId)}
              style={{height: '480px'}}
              className="video"
            ></div>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default GroupVideo;
