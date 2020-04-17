import { TableType } from 'types';
import { selectToken } from 'redux/appSelectors';
import { updateUsers } from 'users/actions';
import { fetchTable, fetchTables, joinTable, leaveTable } from 'services';

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
    const token = selectToken(getState());
    const { tables, users } = await fetchTables(tableIds, token);
    dispatch(updateTables(tables));
    dispatch(updateUsers(users));
  }
}

export function joinAndUpdateTable(tableId: string, seat: number | null, userId: string) {
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
