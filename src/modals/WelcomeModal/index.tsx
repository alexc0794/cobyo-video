import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectStorefront, selectStatus } from '_storefront/selectors';
import Modal from 'react-bootstrap/Modal';
import Spinner from 'react-bootstrap/Spinner';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import Login from '_login/Login';
import { UserType } from 'types';
import './index.css';

type PropTypes = {
  onSubmit: (user: UserType) => void
}

function WelcomeModal({ onSubmit }: PropTypes) {
  const [showDisclaimer, setShowDisclaimer] = useState<boolean>(false);
  function handleClickDislaimer(e: any) {
    e.preventDefault();
    setShowDisclaimer(prevShowDislcaimer => !prevShowDislcaimer);
  }

  const storefront = useSelector(selectStorefront);
  const status = useSelector(selectStatus);
  const closed = status === 'CLOSED';

  const title = (() => {
    let title = 'Welcome';
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
            <p>You are about to enter a video simulation of a real-life {storefront.toLowerCase()}.
            To partake, please allow the browser access to your <strong>webcam</strong> and <strong>microphone</strong>.</p>

            <p>For your optimal experience, we recommend you use Google Chrome on a laptop or desktop.</p>
          </Modal.Body>

          <Button size="sm" variant="link" onClick={handleClickDislaimer}>{showDisclaimer ? 'Hide Disclaimer' : 'View Disclaimer'}</Button>

          {showDisclaimer && (
            <Modal.Body>
              <p>
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
              </p>
              <p>
                Our video platform runs on <a href="https://www.agora.io/" target="_blank" rel="noopener noreferrer">agora.io</a>. What they do with your video and audio is not in our control.
                You can read their privacy policy <a href="https://www.agora.io/en/privacy-policy/" target="_blank" rel="noopener noreferrer">here</a>.
              </p>
            </Modal.Body>
          )}
          <Modal.Body>
            <Login onSubmit={onSubmit} />
          </Modal.Body>
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

export default WelcomeModal;
