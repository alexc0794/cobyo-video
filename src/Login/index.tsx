import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createAndUpdateUser, loginAndUpdateGuestUser } from '../redux/usersActions';
import { UserType } from '../types';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import FormControl from 'react-bootstrap/FormControl';
import './index.css';

type LocalStorageLogin = {
  firstName: string,
  userId: string,
  facebookUserId: string|null,
};

type FacebookLogin = {
  facebookLoginDetected: boolean,
  facebookUserId: string,
  facebookAccessToken: string,
};

type PropTypes = {
  onSubmit: (user: UserType) => void
};

function Login({ onSubmit }: PropTypes) {
  const localStorageLoginStr: string|null = window.localStorage.getItem('login');
  const localStorageLogin: LocalStorageLogin|null = localStorageLoginStr ? JSON.parse(localStorageLoginStr) : null;
  const [isReturningUser, setIsReturningUser] = useState<boolean>(!!localStorageLogin);
  const [firstName, setFirstName] = useState<string>(
    localStorageLogin ? localStorageLogin.firstName : ''
  );

  function handleChangeName(e: any) {
    const alphaExp = /^[a-zA-Z]+$/;
    const value = e.target.value;
    if (!value || value.match(alphaExp)) {
      setFirstName(e.target.value);
    }
  }

  function handleKeyPress(e: any) {
    if (e.charCode === 13) {
      handleClickEnterName();
    }
  }

  function prepareToSubmit(user: UserType) {
    const localStorageLogin: LocalStorageLogin = {
      firstName: user.firstName,
      userId: user.userId,
      facebookUserId: user.facebookUserId,
    };
    window.localStorage.setItem('login', JSON.stringify(localStorageLogin));
    onSubmit(user);
  }

  async function handleClickEnterName() {
    if (!firstName) { return; }
    const user: UserType = await dispatch(createAndUpdateUser(null, firstName));
    prepareToSubmit(user);
  }

  const [facebookLogin, setFacebookLogin] = useState<FacebookLogin|null>(null);

  function handleFacebookLoginSuccess(response: any) {
    const { status, authResponse } = response;
    if (!authResponse) { return; }
    const { accessToken, userID } = authResponse;
    setFacebookLogin({
      facebookLoginDetected: status === 'connected',
      facebookUserId: userID,
      facebookAccessToken: accessToken,
    });
  }

  useEffect(() => {
    FB.getLoginStatus(handleFacebookLoginSuccess);
  }, []);

  function handleFacebookLoginAttempt() {
    FB.login(response => {
      handleFacebookLoginSuccess(response);
    }, {
      scope: 'email,user_friends,user_gender,user_age_range,user_birthday,user_location'
    });
  }

  const dispatch = useDispatch();
  function handleFacebookContinue() {
    FB.api('/me', {
      fields: 'first_name, last_name, email, picture'
    }, async (response: any) => {
      const user: UserType = await dispatch(createAndUpdateUser(
        response.email,
        response.first_name,
        response.last_name,
        response.id,
        response.picture ? response.picture.data.url : null,
      ));
      prepareToSubmit(user);
    });
  }

  async function handleLogin(userId: string) {
    const user: UserType = await dispatch(loginAndUpdateGuestUser(userId));
    prepareToSubmit(user);
  }

  return (
    <div className="Login">
      {isReturningUser && localStorageLogin ? (
        <>
          <Button
            variant="warning"
            onClick={() => handleLogin(localStorageLogin.userId)}
            className="Continue"
          >
            Continue as {firstName}
          </Button>
          <Button variant="link" onClick={() => setIsReturningUser(false)}>
            Not {firstName}?
          </Button>
        </>
      ) : (
        <>
          <Button
            variant="primary"
            onClick={facebookLogin ? handleFacebookContinue : handleFacebookLoginAttempt}
            className="Continue"
          >
            {facebookLogin ? "Continue with Facebook" : "Login with Facebook"}
          </Button>
          <p>or login as a guest</p>
          <InputGroup>
            <FormControl
              placeholder="Enter name to continue"
              aria-label="Name"
              onChange={handleChangeName}
              value={firstName}
              onKeyPress={handleKeyPress}
            />
            <InputGroup.Append>
              <Button
                variant="outline-secondary"
                onClick={handleClickEnterName}
              >Go</Button>
              </InputGroup.Append>
          </InputGroup>
        </>
      )}
    </div>
  );
}

export default Login;
