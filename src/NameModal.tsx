import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';

type PropTypes = {
  onEnterName: (name: string) => void
}

function NameModal({
  onEnterName
}: PropTypes) {

  const [name, setName] = useState("");

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
    onEnterName(name)
  }

  return (
    <Modal show>
      <Modal.Header>
        <Modal.Title>Welcome to the Virtual Cafeteria</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <InputGroup>
          <FormControl
            placeholder="Enter name..."
            aria-label="Name"
            onChange={handleChangeName}
            value={name}
            onKeyPress={handleKeyPress}
          />
          <InputGroup.Append>
            <Button
              variant="outline-secondary"
              onClick={handleClickEnterName}
            >Enter</Button>
          </InputGroup.Append>
        </InputGroup>
      </Modal.Body>
    </Modal>
  );
}

export default NameModal;
