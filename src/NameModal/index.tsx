import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createAndUpdateUser } from '../redux/usersActions';
import { selectStorefront, selectStatus } from '../redux/appSelectors';
import Modal from 'react-bootstrap/Modal';
import Spinner from 'react-bootstrap/Spinner';
import Button from 'react-bootstrap/Button';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { UserType } from '../types';
import { random } from '../helpers';

type PropTypes = {
  onSubmit: (user: UserType) => void
}

function NameModal({
  onSubmit
}: PropTypes) {
  const initialName = window.localStorage.getItem('name');
  const [name, setName] = useState(initialName || '');

  function handleChangeName(e: any) {
    const alphaExp = /^[a-zA-Z]+$/;
    const value = e.target.value;
    if (!value || value.match(alphaExp)) {
      setName(e.target.value);
    }
  }

  function handleKeyPress(e: any) {
    if (e.charCode === 13) {
      handleClickEnterName();
    }
  }

  function handleClickEnterName() {
    if (!name) {
      return;
    }
    window.localStorage.setItem('name', name);
    const names = name.split(' ');
    const user: UserType = {
      userId: random(2147483647).toString(), // 2^31-1
      facebookUserId: null,
      email: null,
      firstName: names[0],
      lastName: names.length > 1 ? names[1] : null,
      profilePictureUrl: null,
      lastActiveAt: null,
    };
    onSubmit(user);
  }

  type FacebookLoginType = {
    facebookLoginDetected: boolean,
    facebookUserId: string,
    facebookAccessToken: string,
  };
  const [facebookLogin, setFacebookLogin] = useState<FacebookLoginType|null>(null);

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
      onSubmit(user);
    });
  }

  const [showDisclaimer, setShowDisclaimer] = useState<boolean>(false);
  function handleClickDislaimer(e: any) {
    e.preventDefault();
    setShowDisclaimer(prevShowDislcaimer => !prevShowDislcaimer);
  }

  const storefront = useSelector(selectStorefront);
  const status = useSelector(selectStatus);
  const closed = status === 'CLOSED';

  const title = (() => {
    let title = `Welcome${initialName ? ' back' : ''}`;
    switch (storefront) {
      case 'CLUB':
        title += ' to the Virtual Club';
        break;
      case 'CAFE':
        title += ' to the Virtual Cafe';
        break;
      case 'CAFETERIA':
        title += ' to the Virtual Cafeteria';
        break;
    }
    return title += '!';
  })();

  return (
    <Modal show backdrop={"static"}>
      <Modal.Header>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      {closed && (
        <Modal.Body>
          We are currently closed. Please come back at a later time.
        </Modal.Body>
      )}
      {!!storefront && !closed && (
        <>
          <Modal.Body>
            You are about to enter a video simulation of a real-life {storefront.toLowerCase()}.
            To partake, please allow the browser access to your <strong>webcam</strong> and <strong>microphone</strong>.
          </Modal.Body>
          <Modal.Body>
            For your optimal experience, we recommend you use Google Chrome on a laptop or desktop.
          </Modal.Body>

            <Button variant="link" onClick={handleClickDislaimer}>{showDisclaimer ? 'Hide Disclaimer' : 'View Disclaimer'}</Button>

          {showDisclaimer && (
            <>
              <Modal.Body>
                <span>We will <strong>NOT</strong> record your video or audio, but your audio may be </span>
                <OverlayTrigger
                  placement="left"
                  overlay={
                    <Tooltip id="audio-recording-tooltip">
                      We utilize speech recognition to parse conversations and display talking points to other users.
                    </Tooltip>
                  }
                >
                  <span style={{textDecoration: 'underline'}}>transcribed</span>
                </OverlayTrigger>
                <span>. Transcriptions will be destroyed after one hour.</span>
              </Modal.Body>
              <Modal.Body>
                Our video platform runs on <a href="https://www.agora.io/" target="_blank" rel="noopener noreferrer">agora.io</a>. What they do with your video and audio is not in our control.
                You can read their privacy policy <a href="https://www.agora.io/en/privacy-policy/" target="_blank" rel="noopener noreferrer">here</a>.
              </Modal.Body>
            </>
          )}
          <Modal.Footer>
            <InputGroup>
              <Button
                variant="primary"
                onClick={facebookLogin ? handleFacebookContinue : handleFacebookLoginAttempt}
                style={{marginRight: '10px'}}
              >
                {facebookLogin ? "Continue with Facebook" : "Login with Facebook"}
              </Button>
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
          </Modal.Footer>
        </>
      )}
      {!storefront && !closed && (
        <Modal.Body>
          <Spinner animation="border" />
        </Modal.Body>
      )}
    </Modal>
  );
}

export default NameModal;
