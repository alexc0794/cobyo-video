import React, { useState, useEffect, useCallback, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAndUpdateActiveUsers } from '../redux/usersActions';
import { selectUserId } from '../redux/appSelectors';
import { selectStorefront } from '../redux/storefrontSelectors';
import { selectActiveUsers } from '../redux/usersSelectors';
import { useInterval } from '../hooks';
import { REFRESH_ACTIVE_USERS_INTERVAL_MS } from '../config';
import { UserType } from '../types';
import Alert from 'react-bootstrap/Alert';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import ActiveUser from './ActiveUser';
import Chat from '../Chat';
import cx from 'classnames';
import './index.css';

function ActiveUsersTab() {
  const [errorMessage, setErrorMessage] = useState<string|null>(null);
  const [loaded, setLoaded] = useState<boolean>(false);
  const dispatch = useDispatch();
  const loadActiveUsers = useCallback(async () => {
    const errorCode: any = await dispatch(fetchAndUpdateActiveUsers());
    if (errorCode === 403) {
      setErrorMessage("Log in with Facebook to see who else is online.");
    }
    setLoaded(true);
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
  const storefront = useSelector(selectStorefront);
  const userId = useSelector(selectUserId);

  if (!loaded) { return null; }

  return (
    <div className={cx('active-users', {
      'active-users-club': storefront === 'CLUB',
    })}>
      {errorMessage && (
        <Alert
          className="active-users-alert-error"
          variant="info"
          onClose={handleCloseErrorAlert}
          dismissible
        >{errorMessage}</Alert>
      )}
      {!errorMessage && (
        <>
          <Chat userId={userId} title="room" />
          <Container>
            {activeUsers.map((user: UserType) => (
              <Row key={user.userId}>
                <ActiveUser user={user} />
              </Row>
            ))}
          </Container>
        </>
      )}
    </div>
  );
}

export default memo(ActiveUsersTab);
