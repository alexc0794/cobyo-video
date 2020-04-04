import React, { memo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectStorefrontTableIds } from '../redux/appSelectors';
import { fetchAndUpdateTables } from '../redux/tablesActions';
import { useInterval } from '../hooks';
import { REFRESH_TABLES_INTERVAL_MS } from '../config';
import Club from './Club';
import Cafeteria from './Cafeteria';
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
