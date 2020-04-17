import React, { memo } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {TableType} from 'types';
import Table from '_tables/Table';  // Converting to absolute is causing name collision with a node module

type PropTypes = {
  userId: string|null,
  tables: Array<TableType|undefined>,
}

function Club({
  userId,
  tables
}: PropTypes) {
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
    <div className="StorefrontLayout StorefrontLayout--club">
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

export default memo(Club);
