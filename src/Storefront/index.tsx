import React, { memo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectStorefrontTableIds } from 'redux/storefrontSelectors';
import { fetchAndUpdateTables } from 'redux/tablesActions';
import { fetchAndUpdateMenu } from 'redux/menuActions';
import { useInterval } from 'hooks';
import { REFRESH_TABLES_INTERVAL_MS } from 'config';
import Club from 'Storefront/Club';
import Cafeteria from 'Storefront/Cafeteria';
import './index.css';

type PropTypes = {
  userId: string|null,
  storefront: string,
  status: string,
  tableIdGrid: Array<Array<string>>,
}

function Storefront({ userId, storefront, tableIdGrid }: PropTypes) {
  const tableIds = useSelector(selectStorefrontTableIds);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAndUpdateMenu(storefront));
  }, [storefront, dispatch]);

  useEffect(() => {
    dispatch(fetchAndUpdateTables(tableIds));
  }, [dispatch, tableIds]);

  useInterval(() => {
    dispatch(fetchAndUpdateTables(tableIds));
  }, REFRESH_TABLES_INTERVAL_MS);

  switch (storefront) {
    case 'CLUB': {
      return (
        <Club userId={userId} tableIdGrid={tableIdGrid} />
      );
    }
    default: {
      return (
        <Cafeteria userId={userId} tableIdGrid={tableIdGrid} />
      );
    }
  }
}

export default memo(Storefront);
