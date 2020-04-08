import { TableType } from '../types';
import { RTC } from '../AgoraRTC';
import { selectToken } from './appSelectors';
import { updateUsers } from './usersActions';
import { fetchTable, fetchTables, joinTable, leaveTable, updateTableWithUserIdsFromRtc, updateTableName } from '../services';
import {AxiosResponse} from "axios";

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

export const updateTableAction = (table: AxiosResponse<any>) => ({
  type: "UPDATE_TABLE_NAME",
  payload: { table }
})

export function fetchAndUpdateTable(tableId: string) {
  return async function(dispatch: any, getState: () => any) {
    const { table, users } = await fetchTable(tableId);
    dispatch(updateTable(table));
    dispatch(updateUsers(users));
  }
}

export function fetchAndUpdateTables(tableIds: Array<string>) {
  return async function(dispatch: any, getState: () => any) {
    const token = selectToken(getState());
    const { tables, users } = await fetchTables(tableIds, token);
    dispatch(updateTables(tables));
    dispatch(updateUsers(users));
  }
}

export function joinAndUpdateTable(tableId: string, seat: number|null, userId: string) {
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

export function updateTableWithRTC(tableId: string, rtc: RTC, userId: string|null) {
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

export function updateTableName_(payload: { table_id: string, name: string }) {
  return function(dispatch: any) {
    return updateTableName(payload).then(table => dispatch(updateTableAction(table)))
  }
}
