import React, { memo } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {TableType, SeatType} from 'types';
import Table from '_tables/Table';  // Converting to absolute is causing name collision with a node module

type PropTypes = {
  userId: string|null,
  tables: Array<TableType>,
}

function Club({
  userId,
  tables
}: PropTypes) {
  const getTableVariaiton = (seats:Array<SeatType>) => {
    if (seats.length >=24 ) {
      return 'danceFloor';
    }
    if (seats.length >= 10) {
      return 'large';
    } else if (seats.length <= 6) {
      return 'small';
    } else {
      return 'medium';
    }
  }

  return (
    <div className="StorefrontLayout StorefrontLayout--club">
      {tables.map((table:TableType) => {
        return (
          table && (
            <div className={`StorefrontLayout-table StorefrontLayout-table--${getTableVariaiton(table.seats)}`}>
              <Table tableId={table.tableId} userId={userId} />
            </div>
          )
        )
      })}
    </div>
  );
}

export default memo(Club);
