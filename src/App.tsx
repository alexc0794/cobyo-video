import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectJoinedTable } from './redux/tablesSelectors';
import HomeNavbar from './HomeNavbar';
import NameModal from './NameModal';
import Cafeteria from './Cafeteria';
import VideoHangout from './VideoHangout';
import ActiveUsers from './ActiveUsers';
import { getRTC, RTCType } from './AgoraRTC';
import { TableType, UserType } from './types';

let rtc: RTCType = getRTC();

function App() {
  const [user, setUser] = useState<UserType|null>(null);
  const [showModal, setShowModal] = useState<boolean>(true);

  function handleSubmitUser(user: UserType) {
    setShowModal(false);
    setUser(user);
  }

  const joinedTable: TableType|null = useSelector(selectJoinedTable);

  return (
    <div id="App" className="App">
      {showModal && <NameModal onSubmit={handleSubmitUser} />}
      {!!joinedTable && !!user && <VideoHangout userId={user.userId} tableId={joinedTable.tableId} rtc={rtc} />}
      {!joinedTable && <HomeNavbar user={user} />}
      {!joinedTable && (
        <div className="content">
          <Cafeteria userId={user ? user.userId : null} />
          {!!user && <ActiveUsers />}
        </div>
      )}
    </div>
  );
}

export default App;
