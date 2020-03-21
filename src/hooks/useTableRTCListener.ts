import { useEffect, useState } from 'react';
import { RTCType } from '../AgoraRTC';
import { TableType } from '../types';
import { fetchTable, updateTableWithUserIdsFromRtc } from '../services';

export default function useTableRTCListener(
  tableId: string,
  userId: string|null,
  rtc: RTCType,
): TableType|null {
  const [table, setTable] = useState<TableType|null>(null);

  useEffect(() => {
    fetchTable(tableId).then(response => setTable(response));
  }, [tableId]);


  useEffect(() => {
    if (!userId) { return; }
    rtc.client.on("connection-state-change", (curState, revState, reason) => {
      if (curState === "CONNECTED") {
        console.log("SUP", revState, reason);
        const userIds = [...rtc.client.remoteUsers.map(user => user.uid.toString()), userId];
        updateTableWithUserIdsFromRtc(tableId, userIds).then(response => setTable(response));
      }
    });

    rtc.client.on("user-published", () => {
      // When someone joins, our local state of the table is now out-of-date, so re-fetch the table and update local state.
      fetchTable(tableId).then(response => setTable(response));
    });
    rtc.client.on("user-unpublished", () => {
      const userIds = [...rtc.client.remoteUsers.map(user => user.uid.toString()), userId];
      updateTableWithUserIdsFromRtc(tableId, userIds).then(response => setTable(response));
    });
  }, [tableId, userId, rtc])

  return table;
}
