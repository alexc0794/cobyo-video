import { TableType } from '../types';
import { RTCType } from '../AgoraRTC';
import { fetchTable, joinTable, leaveTable, updateTableWithUserIdsFromRtc } from '../services';

export const updateTable = (table: TableType) => ({
  type: "UPDATE_TABLE",
  payload: {
    table
  }
});

export const joinedTable = (table: TableType) => ({
  type: "JOINED_TABLE",
  payload: {
    table
  }
});

export const leftTable = (table: TableType) => ({
  type: "LEFT_TABLE",
  payload: { table }
});

export function fetchAndUpdateTable(tableId: string) {
  return function(dispatch: any, getState: () => any) {
    return fetchTable(tableId).then(table => {
      dispatch(updateTable(table));
    });
  }
}

export function joinAndUpdateTable(tableId: string, seat: number, userId: string) {
  return function (dispatch: any) {
    return joinTable(tableId, seat, userId).then(table => {
      dispatch(joinedTable(table));
    });
  }
}

export function leaveAndUpdateTable(tableId: string, userId: string) {
  return function (dispatch: any) {
    return leaveTable(tableId, userId).then(table => {
      dispatch(leftTable(table));
    });
  }
}

export function updateTableWithRTC(tableId: string, rtc: RTCType, userId: string|null) {
  return function (dispatch: any) {
    const userIds = rtc.client.remoteUsers.map(user => user.uid.toString());
    if (userId) {
      userIds.push(userId);
    }
    return updateTableWithUserIdsFromRtc(tableId, userIds).then(table => {
      dispatch(updateTable(table));
    });
  }
}
