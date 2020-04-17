import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createAndUpdateUser, loginAndUpdateGuestUser } from 'src/users/actions';
import { UserType } from 'src/types';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import FormControl from 'react-bootstrap/FormControl';
import './index.css';

type LocalStorageLogin = {
  name: string,
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

type Name = {
  firstName: string,
  lastName: string|null,
};

function parseName(name: string): Name {
  const names = name.split(' ');
  return {
    firstName: names[0],
    lastName: names.slice(1).join(' ') || null,
  };
}

function Login({ onSubmit }: PropTypes) {
  const localStorageLoginStr: string|null = window.localStorage.getItem('login');
  const localStorageLogin: LocalStorageLogin|null = localStorageLoginStr ? JSON.parse(localStorageLoginStr) : null;
  const [isReturningUser, setIsReturningUser] = useState<boolean>(!!localStorageLogin);
  const [name, setName] = useState<string>(localStorageLogin ? localStorageLogin.name : '');

  function handleChangeName(e: any) {
    const alphaExp = /^[a-zA-Z ]+$/;
    const value = e.target.value;
    if (!value || value.match(alphaExp)) {
      setName(value);
    }
  }

  function handleKeyPress(e: any) {
    if (e.charCode === 13) {
      handleClickEnterName();
    }
  }

  function prepareToSubmit(user: UserType) {
    const localStorageLogin: LocalStorageLogin = {
      name: user.lastName ? `${user.firstName} ${user.lastName}` : user.firstName,
      userId: user.userId,
      facebookUserId: user.facebookUserId,
    };
    window.localStorage.setItem('login', JSON.stringify(localStorageLogin));
    onSubmit(user);
  }

  async function handleClickEnterName() {
    if (!name) { return; }
    const { firstName, lastName } = parseName(name);
    const user: UserType = await dispatch(createAndUpdateUser(null, firstName, lastName));
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
          >
            Continue as {name}
          </Button>
          <Button variant="link" onClick={() => setIsReturningUser(false)}>
            Not {name}?
          </Button>
        </>
      ) : (
        <>
          <Button
            variant="primary"
            onClick={facebookLogin ? handleFacebookContinue : handleFacebookLoginAttempt}
          >
            {facebookLogin ? "Continue with Facebook" : "Login with Facebook"}
          </Button>
          <p>or as a guest</p>
          <InputGroup>
            <FormControl
              placeholder="Enter name to continue"
              aria-label="Name"
              onChange={handleChangeName}
              value={name}
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
