import React, { memo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectStorefrontTableIds, selectStorefrontTables } from '_storefront/selectors';
import { fetchAndUpdateTables } from '_tables/actions';
import { fetchAndUpdateMenu } from '_menu/actions';
import { useInterval } from 'hooks';
import { REFRESH_TABLES_INTERVAL_MS } from 'config';
import Club from '_storefront/Club';
import Cafeteria from '_storefront/Cafeteria';
import './index.css';

type PropTypes = {
  userId: string|null,
  storefront: string,
  status: string,
  tableIdGrid: Array<Array<string>>,
}

function StorefrontLayout({ userId, storefront, tableIdGrid }: PropTypes) {
  const tableIds = useSelector(selectStorefrontTableIds);
  const tables = useSelector(selectStorefrontTables);
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
        <Club userId={userId} tables={tables} />
      );
    }
    default: {
      return (
        <Cafeteria userId={userId} tableIdGrid={tableIdGrid} />
      );
    }
  }
}

export default memo(StorefrontLayout);
