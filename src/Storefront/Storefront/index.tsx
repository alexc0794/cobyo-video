import React, { memo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectStorefrontTableIds } from 'src/storefront/selectors';
import { fetchAndUpdateTables } from 'src/tables/actions';
import { fetchAndUpdateMenu } from 'src/menu/actions';
import { useInterval } from 'src/hooks';
import { REFRESH_TABLES_INTERVAL_MS } from 'src/config';
import Club from 'src/storefront/Club';
import Cafeteria from 'src/storefront/Cafeteria';
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
