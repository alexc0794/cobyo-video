import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectJoinedTable } from './redux/tablesSelectors';
import HomeNavbar from './HomeNavbar';
import NameModal from './NameModal';
import Cafeteria from './Cafeteria';
import VideoHangout from './VideoHangout';
import { getRTC, RTCType } from './AgoraRTC';
import { hashCode } from './helpers';
import { TableType } from './types';

let rtc: RTCType = getRTC();

function App() {
  const [userId, setUserId] = useState<string|null>(null);
  const [userName, setUserName] = useState<string|null>(null);
  const [showModal, setShowModal] = useState<boolean>(true);

  function handleEnterName(name: string) {
    const hash = hashCode(name).toString();
    const id = hash.slice(hash.length - 4); // userId must be between 1-10000 :(
    setShowModal(false);
    setUserId(id);
    setUserName(name);
  };

  const joinedTable: TableType|null = useSelector(selectJoinedTable)

  return (
    <div id="App" className="App">
      {showModal && <NameModal onEnterName={handleEnterName} />}
      {!!joinedTable && !!userId && <VideoHangout userId={userId} tableId={joinedTable.tableId} rtc={rtc} />}
      {!joinedTable && (
        <>
          <HomeNavbar userName={userName} />
          <Cafeteria userId={userId} />
        </>
      )}
    </div>
  );
}

export default App;
