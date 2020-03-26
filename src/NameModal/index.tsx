import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

type PropTypes = {
  onEnterName: (name: string) => void
}

function NameModal({
  onEnterName
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
    onEnterName(name);
  }

  return (
    <Modal show backdrop={"static"}>
      <Modal.Header>
        <Modal.Title>Welcome {initialName ? "back" : ""} to Virtual Cafeteria!</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        This is a video hangout space attempting to simulate a real-life cafeteria.
        You will need to allow the browser access to your <strong>webcam</strong> and <strong>microphone</strong>.
        For your optimal experience, we recommend you use Google Chrome on a laptop or desktop.
      </Modal.Body>

      <Modal.Body>
        Our video platform runs on <a href="https://www.agora.io/" target="_blank" rel="noopener noreferrer">agora.io</a>. What they do with your video and audio is not in our control.
        You can read their privacy policy <a href="https://www.agora.io/en/privacy-policy/" target="_blank" rel="noopener noreferrer">here</a>.
      </Modal.Body>

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
      <Modal.Footer>
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
      </Modal.Footer>
    </Modal>
  );
}

export default NameModal;
