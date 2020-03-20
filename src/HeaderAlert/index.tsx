import React, { useState } from 'react';
import Alert from 'react-bootstrap/Alert';

type PropTypes = {
  userName: string,
  numActiveUsers: number,
};

function HeaderAlert({
  userName,
  numActiveUsers,
}: PropTypes) {

  const [visible, setVisible] = useState(true);

  let text = `Hello "${userName}". `;
  if (numActiveUsers === 0) {
    text += "No one is at the table.";
  } else if (numActiveUsers === 1) {
    text += "There is one user at the table.";
  } else {
    text += `There are ${numActiveUsers} users at the table.`;
  }

  function onClose() {
    setVisible(false);
  }

  return (
    <Alert show={visible} variant="primary" dismissible onClose={onClose}>
      {text}
    </Alert>
  );
}

export default HeaderAlert;
