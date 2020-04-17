import React, { memo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectStorefrontTableIds, selectStorefrontTables } from '_storefront/selectors';
import { fetchAndUpdateTables } from '_tables/actions';
import { fetchAndUpdateMenu } from '_menu/actions';
import { useInterval } from 'hooks';
import { REFRESH_TABLES_INTERVAL_MS } from 'config';
import {TableType} from 'types';
import Table from '_tables/Table';  // Converting to absolute is causing name collision with a node moduleimport './index.css';
import './index.css';

type PropTypes = {
  userId: string|null,
  storefront: string,
  status: string,
}

function StorefrontLayout({ userId, storefront }: PropTypes) {
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

  const getTableVariation = (table:TableType) => {
    if (table.shape === 'DANCE_FLOOR') {
      return 'danceFloor';
    }
    if (table.seats.length >= 10) {
      return 'large';
    } else if (table.seats.length <= 6) {
      return 'small';
    } else {
      return 'medium';
    }
  }

  return (
    <div className={`StorefrontLayout StorefrontLayout--${storefront}`}>
      {tables.map((table:TableType|undefined) => {
        return (
          table && (
            <div className={`StorefrontLayout-table StorefrontLayout-table--${getTableVariation(table)}`} key={table.tableId}>
              <Table tableId={table.tableId} userId={userId} />
            </div>
          )
        )
      })}
    </div>
  );
}

export default memo(StorefrontLayout);
