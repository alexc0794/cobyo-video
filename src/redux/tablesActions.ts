import { TableType } from '../types';
import { RTCType } from '../AgoraRTC';
import { updateUsers } from './usersActions';
import { fetchTable, fetchTables, joinTable, leaveTable, updateTableWithUserIdsFromRtc } from '../services';

export const updateTable = (table: TableType) => ({
  type: "UPDATE_TABLE",
  payload: { table }
});

export const updateTables = (tables: Array<TableType>) => ({
  type: "UPDATE_TABLES",
  payload: { tables }
});

export const joinedTable = (table: TableType) => ({
  type: "JOINED_TABLE",
  payload: { table }
});

export const leftTable = (table: TableType) => ({
  type: "LEFT_TABLE",
  payload: { table }
});

export function fetchAndUpdateTable(tableId: string) {
  return async function(dispatch: any, getState: () => any) {
    const { table, users } = await fetchTable(tableId);
    dispatch(updateTable(table));
    dispatch(updateUsers(users));
  }
}

export function fetchAndUpdateTables(tableIds: Array<string>) {
  return async function(dispatch: any, getState: () => any) {
    const { tables, users } = await fetchTables(tableIds);
    dispatch(updateTables(tables));
    dispatch(updateUsers(users));
  }
}

export function joinAndUpdateTable(tableId: string, seat: number, userId: string) {
  return function(dispatch: any) {
    return joinTable(tableId, seat, userId).then(table => {
      dispatch(joinedTable(table));
    });
  }
}

export function leaveAndUpdateTable(tableId: string, userId: string) {
  return function(dispatch: any) {
    return leaveTable(tableId, userId).then(table => {
      dispatch(leftTable(table));
    });
  }
}

export function updateTableWithRTC(tableId: string, rtc: RTCType, userId: string|null) {
  return function(dispatch: any) {
    const userIds = rtc.client.remoteUsers.map(user => user.uid.toString());
    if (userId) {
      userIds.push(userId);
    }
    return updateTableWithUserIdsFromRtc(tableId, userIds).then(table => {
      dispatch(updateTable(table));
    });
  }
}
