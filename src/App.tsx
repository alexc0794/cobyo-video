import React, { useCallback, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAndUpdateStorefront } from './redux/storefrontActions';
import { selectJoinedTable } from './redux/tablesSelectors';
import HomeNavbar from './HomeNavbar';
import DeviceErrorModal from './DeviceErrorModal';
import WelcomeModal from './WelcomeModal';
import Storefront from './Storefront';
import VideoHangout from './VideoHangout';
import ActiveUsers from './ActiveUsers';
import { checkSystemRequirements, getRTC, RTCType } from './AgoraRTC';
import { TableType, UserType } from './types';
import { useInterval } from './hooks';
import { REFRESH_STOREFRONT_INTERVAL_MS } from './config';

let rtc: RTCType = getRTC();
const passesSystemRequirements = checkSystemRequirements();

function App() {
  const [user, setUser] = useState<UserType|null>(null);
  const [showModal, setShowModal] = useState<boolean>(true);
  const joinedTable: TableType|null = useSelector(selectJoinedTable);

  function handleSubmitUser(user: UserType) {
    setShowModal(false);
    setUser(user);
  }

  const [{
    storefront,
    status,
    tableIdGrid,
  }, setStorefront] = useState<any>({ storefront: null, status: 'OPEN', tableIdGrid: [] });

  const dispatch = useDispatch();
  const loadStorefront = useCallback(async () => {
    setStorefront(await dispatch(fetchAndUpdateStorefront()));
  }, [dispatch]);

  useEffect(() => {
    loadStorefront();
  }, [loadStorefront]);

  useInterval(() => {
    loadStorefront();
  }, REFRESH_STOREFRONT_INTERVAL_MS)

  if (storefront === 'CLUB') {
    document.body.style.backgroundColor = 'rgba(0,0,0,.7)';
  }

  const modal = (() => {
    if (!passesSystemRequirements) {
      return <DeviceErrorModal />;
    }
    if (showModal) {
      return <WelcomeModal onSubmit={handleSubmitUser} />;
    }
    return null;
  })();

  return (
    <div id="App" className="App">
      {modal}
      {!!joinedTable && !!user && <VideoHangout userId={user.userId} tableId={joinedTable.tableId} rtc={rtc} />}
      {!joinedTable && <HomeNavbar user={user} storefront={storefront} status={status} />}
      {!joinedTable && (
        <div className="content">
          <Storefront
            userId={user ? user.userId : null}
            storefront={storefront}
            status={status}
            tableIdGrid={status === 'CLOSED' ? [] : tableIdGrid}
          />
            {!!user && <ActiveUsers />}
        </div>
      )}
    </div>
  );
}

export default App;
