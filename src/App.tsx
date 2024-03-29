import React, { useCallback, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectJoinedTable } from '_tables/selectors';
import { fetchAndUpdateStorefront } from '_storefront/actions';
import HomeNavbar from 'HomeNavbar';
import DeviceErrorModal from 'modals/DeviceErrorModal';
import WelcomeModal from 'modals/WelcomeModal';
import StorefrontLayout from '_storefront/StorefrontLayout';
import VideoHangout from '_video/VideoHangout';
import ActiveUsers from '_users/ActiveUsers';
import { getRTC, RTC } from 'agora';
import { TableType, UserType } from 'types';
import { useInterval } from 'hooks';
import { REFRESH_STOREFRONT_INTERVAL_MS } from 'config';

const rtc: RTC = getRTC();

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
    if (!rtc.passesSystemRequirements) {
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
          <StorefrontLayout
            userId={user ? user.userId : null}
            storefront={storefront}
            status={status}
          />
            {!!user && <ActiveUsers />}
        </div>
      )}
    </div>
  );
}

export default App;
