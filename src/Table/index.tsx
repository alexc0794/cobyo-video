import React, { useEffect, useState } from 'react';
import SeatPicker from '../SeatPicker';
import { RTCType } from '../AgoraRTC';
import { fetchTable, joinTable } from '../services';
import { TableType } from '../types';

type PropTypes = {
  tableId: string,
  userId: string|null,
  onJoin: (table: TableType, userid: string) => void,
  rtc: RTCType,
};

function Table({
  tableId,
  userId,
  onJoin,
  rtc,
}: PropTypes) {
  const [table, setTable] = useState<TableType | null>(null);

  useEffect(() => {
    async function loadTable() {
      const result = await fetchTable(tableId);
      setTable(result);
    }
    loadTable();
    rtc.client.on("user-published", loadTable);
    rtc.client.on("user-unpublished", loadTable); // This doesnt work because when someone leaves the server is out-of-date
  }, [tableId, rtc]);


  async function handlePickSeat(seat: number) {
    if (!userId) { return; }

    let joinedTable: TableType;
    try {
      joinedTable = await joinTable(tableId, seat, userId);
    } catch (e) {
      console.error(e); // TODO: Error handling
      return;
    }
    onJoin(joinedTable, userId);
    setTable(joinedTable);
  }

  if (!table) {
    return null;
  }

  return (
    <SeatPicker
      userId={userId}
      table={table}
      onClick={handlePickSeat}
    />
  );
}

export default Table;
