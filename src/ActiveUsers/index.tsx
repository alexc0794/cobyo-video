import React, { useEffect, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAndUpdateActiveUsers } from '../redux/usersActions';
import { selectActiveUsers } from '../redux/usersSelectors';
import { useInterval } from '../hooks';
// import { timeSince } from '../helpers';
import { UserType } from '../types';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import './index.css';

function ActiveUsersTab() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchAndUpdateActiveUsers());
  }, [dispatch]);

  useInterval(() => {
    dispatch(fetchAndUpdateActiveUsers());
  }, 60000);

  const activeUsers = useSelector(selectActiveUsers);
  if (activeUsers.length > 0) {
    activeUsers.push(activeUsers[0]);
  }

  return (
    <div className="active-users">
      <Container>
        {activeUsers.map((user: UserType) => (
          <Row key={user.userId}>
            <ActiveUser user={user} />
          </Row>
        ))}
      </Container>
    </div>
  );
}

type ActiveUserPropTypes = {
  user: UserType
};

function ActiveUser({ user }: ActiveUserPropTypes) {
  // let status = "";
  // if (user.lastActiveAt) {
  //   const date = new Date(user.lastActiveAt);
  //   status = timeSince(date);
  // }

  return (
    <div className="active-user">
      <div className="active-user-icon">
        {user.profilePictureUrl && (
          <img src={user.profilePictureUrl} alt={user.firstName} />
        )}
      </div>
      {user.firstName} {user.lastName}
    </div>
  )
}

export default memo(ActiveUsersTab);
