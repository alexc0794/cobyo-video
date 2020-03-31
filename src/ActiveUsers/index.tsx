import React, { useState, useEffect, useCallback, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAndUpdateActiveUsers } from '../redux/usersActions';
import { selectActiveUsers } from '../redux/usersSelectors';
import { useInterval } from '../hooks';
import { REFRESH_ACTIVE_USERS_INTERVAL_MS } from '../config';
// import { timeSinceShort } from '../helpers';
import { UserType } from '../types';
import Alert from 'react-bootstrap/Alert';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import './index.css';

function ActiveUsersTab() {
  const [errorMessage, setErrorMessage] = useState<string|null>(null);
  const dispatch = useDispatch();
  const loadActiveUsers = useCallback(async () => {
    const errorCode: any = await dispatch(fetchAndUpdateActiveUsers());
    if (errorCode === 403) {
      setErrorMessage("Log in with Facebook to see who else is online.");
    }
  }, [dispatch]);


  useEffect(() => {
    loadActiveUsers();
  }, [loadActiveUsers]);

  useInterval(() => {
    if (errorMessage) { return; }
    loadActiveUsers();
  }, REFRESH_ACTIVE_USERS_INTERVAL_MS);

  function handleCloseErrorAlert() {
    setErrorMessage(null);
  }

  const activeUsers = useSelector(selectActiveUsers);

  return (
    <div className="active-users">
      {errorMessage && (
        <Alert
          className="active-users-alert-error"
          variant="danger"
          onClose={handleCloseErrorAlert}
          dismissible
        >{errorMessage}</Alert>
      )}
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
  //   status = timeSinceShort(date);
  // }

  return (
    <div className="active-user">
      <div className="active-user-icon">
        {user.profilePictureUrl && (
          <img src={user.profilePictureUrl} alt={user.firstName} />
        )}
      </div>
      <div className="active-user-body">
        <span className="active-user-name">{user.firstName} {user.lastName}</span>
        <span className="active-user-status-dot" />
      </div>
    </div>
  )
}

export default memo(ActiveUsersTab);
