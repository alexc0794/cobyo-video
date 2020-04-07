import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';

type PropTypes = {
  title: string,
  disabled: boolean,
  onSend: (message: string) => boolean
}

function MessageInput({
  title,
  disabled,
  onSend,
}: PropTypes) {
  const [message, setMessage] = useState<string>("");

  function handleChange(e: any) {
    const value = e.target.value;
    setMessage(value);
  }

  function handleKeyPress(e: any) {
    if (e.charCode === 13) {
      handleClickSend();
    }
  }

  function handleClickSend() {
    const success = onSend(message);
    if (success) {
      setMessage("");
    }
  }

  const placeholder = (() => {
    if (disabled) {
      return 'Chat disabled';
    }
    return `Message ${title}`;
  })()

  return (
    <InputGroup>
      <FormControl
        placeholder={placeholder}
        aria-label="Message"
        onChange={handleChange}
        value={message}
        onKeyPress={handleKeyPress}
      />
      <InputGroup.Append>
        <Button
          disabled={disabled}
          variant="primary"
          onClick={handleClickSend}
        >Send</Button>
      </InputGroup.Append>
    </InputGroup>
  );
}

export default MessageInput;
