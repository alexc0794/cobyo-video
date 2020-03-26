import React, { useState } from 'react';
import Popover from 'react-bootstrap/Popover';
import { fetchTableKeywords } from '../../services';
import { useInterval } from '../../hooks';
import './index.css';

type PropTypes = {
  tableId: string
};

function TopicsPopover({
  tableId
}: PropTypes) {
  const [message, setMessage] = useState("");

  // useInterval(refreshPopover, userClosed ? 60000 : 30000);
  //
  // async function refreshPopover() {
  //   const keywords = await fetchTableKeywords(tableId, 5);
  //   setMessage(keywords.join(", "));
  //   setUserClosed(false);
  // }


  return (
    <Popover
      id="topics-popover"
      className="topics-popover"
    >
      <Popover.Title><strong className="mr-auto">Discussed Topics</strong></Popover.Title>
      <Popover.Content>{message}</Popover.Content>
    </Popover>
  );
}

export default TopicsPopover;
