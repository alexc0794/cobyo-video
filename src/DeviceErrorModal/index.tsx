import React, { memo } from 'react';
import Modal from 'react-bootstrap/Modal';

function DeviceErrorModal() {
  return (
    <Modal show backdrop={"static"}>
      <Modal.Header>
        <Modal.Title>
          The browser on your device did not pass the requirements to run this app.
          If you are on an iPhone <span role="img" aria-label="Phone">📱</span>, please visit us on <strong>Safari</strong>.
          We apologize for the inconvenience <span role="img" aria-label="Cry">😭</span>.
        </Modal.Title>
      </Modal.Header>
    </Modal>
  );
}

export default memo(DeviceErrorModal);
