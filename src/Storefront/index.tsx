import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchAndUpdateTables } from '../redux/tablesActions';
import { useInterval } from '../hooks';
import { REFRESH_TABLES_INTERVAL_MS } from '../config';
import Cafeteria from './Cafeteria';
import Club from './Club';

type PropTypes = {
  userId: string|null,
  storefront: string,
  status: string,
  tableIds: Array<string>,
}

function Storefront({ userId, storefront, tableIds }: PropTypes) {
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
        <Club userId={userId} tableIds={tableIds} />
      );
    }
    default:
      return (
        <Cafeteria userId={userId} tableIds={tableIds} />
      );
  }
}

export default Storefront;
