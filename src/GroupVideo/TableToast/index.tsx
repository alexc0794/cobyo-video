import React, { useState } from 'react';
import Toast from 'react-bootstrap/Toast';
import { fetchTableKeywords } from '../../services';
import { useInterval } from '../../hooks';
import './index.css';

type PropTypes = {
  tableId: string
};

function TableToast({
  tableId
}: PropTypes) {
  const [message, setMessage] = useState("");
  const [userClosed, setUserClosed] = useState(false);

  useInterval(refreshToast, userClosed ? 60000 : 30000);

  async function refreshToast() {
    const keywords = await fetchTableKeywords(tableId, 2);
    setMessage(keywords.join(", "));
    setUserClosed(false);
  }

  function handleClose() {
    setUserClosed(true);
  }

  // TODO: This is just workaround because toast is not click-thru-able when hidden
  if (userClosed) {
    return null;
  }

  return (
    <Toast
      className="table-toast"
      show={!userClosed && message.length > 0}
      onClose={handleClose}
      animation
    >
      <Toast.Header><strong className="mr-auto">Discussed Topics</strong></Toast.Header>
      <Toast.Body>{message}</Toast.Body>
    </Toast>
  );
}

export default TableToast;
